/* audio.js -- the single AudioContext, the mix bus, and the clock.

   Everything that makes a sound in Fretwork goes through here, and everything
   with a tempo schedules against GL.audio.now() rather than setTimeout. Browser
   timers drift by tens of milliseconds; the audio clock does not, which is the
   difference between a metronome you can practise to and one you can't.

   Bus layout:

       guitar --> body EQ --.
       bass ----------------+--> dry ---> master --> limiter --> out
       drums ---------------+
       click ---------------'
              \--> send --> reverb --> master

   The reverb impulse is synthesised at startup (decaying noise), so the app
   still ships with zero audio files.
*/
(function (GL) {
  'use strict';

  var ctx = null;
  var nodes = null;
  var listeners = [];

  function build() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('Web Audio is not available in this browser.');
    ctx = new AC();

    var master = ctx.createGain();
    master.gain.value = 0.9;

    /* Gentle limiter -- a six-string strum plus drums can clip without it. */
    var limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -8;
    limiter.knee.value = 6;
    limiter.ratio.value = 8;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.18;

    master.connect(limiter);
    limiter.connect(ctx.destination);

    /* --- reverb send ------------------------------------------------------ */
    var reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(1.7, 2.2);
    var reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.85;
    reverb.connect(reverbGain);
    reverbGain.connect(master);

    var send = ctx.createGain();
    send.gain.value = 0.16;
    send.connect(reverb);

    /* --- guitar bus: the body of the instrument --------------------------- */
    var guitar = ctx.createGain();
    guitar.gain.value = 0.85;

    /* A steel-string dreadnought has a strong Helmholtz air resonance near
       100Hz and a main top resonance near 215Hz, with a slight scoop in the
       lower mids and air on top. Four filters gets most of the way there. */
    var helmholtz = peaking(100, 1.1, 4.5);
    var topPlate = peaking(215, 1.9, 3.0);
    var scoop = peaking(430, 1.4, -2.5);
    var air = shelf('highshelf', 6500, 2.5);

    guitar.connect(helmholtz);
    helmholtz.connect(topPlate);
    topPlate.connect(scoop);
    scoop.connect(air);

    var guitarOut = ctx.createGain();
    air.connect(guitarOut);
    guitarOut.connect(master);
    guitarOut.connect(send);

    /* --- other buses ------------------------------------------------------ */
    var drums = gainTo(0.7, master, send, 0.5);
    var bass = gainTo(0.8, master, null, 0);
    /* The click stays bone dry: reverb on a metronome smears the beat. */
    var click = gainTo(0.6, master, null, 0);

    nodes = {
      master: master, limiter: limiter, send: send, reverb: reverb,
      reverbGain: reverbGain, guitar: guitar, guitarOut: guitarOut,
      drums: drums, bass: bass, click: click
    };

    return nodes;

    function peaking(freq, q, gainDb) {
      var f = ctx.createBiquadFilter();
      f.type = 'peaking';
      f.frequency.value = freq;
      f.Q.value = q;
      f.gain.value = gainDb;
      return f;
    }

    function shelf(type, freq, gainDb) {
      var f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.gain.value = gainDb;
      return f;
    }

    /* A bus gain that feeds master, and optionally the reverb at its own level. */
    function gainTo(level, dest, sendBus, sendLevel) {
      var g = ctx.createGain();
      g.gain.value = level;
      g.connect(dest);
      if (sendBus && sendLevel > 0) {
        var s = ctx.createGain();
        s.gain.value = sendLevel;
        g.connect(s);
        s.connect(sendBus);
      }
      return g;
    }
  }

  /* Exponentially decaying stereo noise, with the first 8ms shaped into a
     short build-up so the tail sounds like a room rather than a gunshot. */
  function makeImpulse(seconds, decay) {
    var rate = ctx.sampleRate;
    var len = Math.floor(rate * seconds);
    var buf = ctx.createBuffer(2, len, rate);
    for (var ch = 0; ch < 2; ch++) {
      var data = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        var build = Math.min(1, i / (rate * 0.008));
        data[i] = (Math.random() * 2 - 1) * build * Math.pow(1 - t, decay);
      }
    }
    return buf;
  }

  function context() {
    if (!ctx) build();
    return ctx;
  }

  function bus(name) {
    if (!ctx) build();
    return nodes[name];
  }

  /* Browsers start the context suspended until a user gesture. Call this from
     any click handler; it is safe to call repeatedly. */
  function unlock() {
    var c = context();
    if (c.state === 'suspended') {
      return c.resume().then(notify);
    }
    notify();
    return Promise.resolve();
  }

  function notify() {
    listeners.forEach(function (fn) { try { fn(ctx.state); } catch (e) { /* ignore */ } });
  }

  function onStateChange(fn) { listeners.push(fn); }

  function now() { return context().currentTime; }

  function setMasterVolume(v) {
    bus('master').gain.setTargetAtTime(Math.max(0, Math.min(1.5, v)), now(), 0.02);
  }

  function setReverb(amount) {
    bus('send').gain.setTargetAtTime(Math.max(0, Math.min(0.6, amount)), now(), 0.05);
  }

  /* ------------------------------------------------------------- transport */

  /* Beat clock. `getBpm` is read fresh every beat, so tempo changes and
     gradual tempo ramps take effect on the next beat with no restart.
     `onBeat(beatIndex, when)` is called AHEAD of time -- schedule your sound
     at `when`, do not play it immediately. */
  function createTransport(opts) {
    var getBpm = opts.getBpm || function () { return opts.bpm || 90; };
    var onBeat = opts.onBeat || function () {};
    var lookahead = opts.lookahead || 0.12;   /* seconds scheduled in advance */
    var tickMs = opts.tickMs || 25;
    var timer = null;
    var nextTime = 0;
    var beat = 0;
    var running = false;

    function tick() {
      var c = context();
      while (nextTime < c.currentTime + lookahead) {
        onBeat(beat, nextTime);
        nextTime += 60 / Math.max(20, getBpm());
        beat++;
      }
    }

    return {
      start: function (startBeat) {
        if (running) return;
        var c = context();
        beat = startBeat || 0;
        /* Small offset so the first beat is scheduled, not fired late. */
        nextTime = c.currentTime + 0.08;
        running = true;
        tick();
        timer = setInterval(tick, tickMs);
      },
      stop: function () {
        running = false;
        if (timer) clearInterval(timer);
        timer = null;
      },
      isRunning: function () { return running; },
      beat: function () { return beat; },
      /* Fractional beat position right now -- for animating a playhead. */
      position: function () {
        if (!running) return beat;
        var spb = 60 / Math.max(20, getBpm());
        return beat - (nextTime - context().currentTime) / spb;
      }
    };
  }

  GL.audio = {
    context: context,
    bus: bus,
    unlock: unlock,
    onStateChange: onStateChange,
    now: now,
    setMasterVolume: setMasterVolume,
    setReverb: setReverb,
    createTransport: createTransport
  };
}(window.GL = window.GL || {}));
