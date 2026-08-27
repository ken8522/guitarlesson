/* metronome.js -- the click, and the practice modes built on top of it.

   The click itself schedules against the audio clock, so it does not drift.
   The modes are the part that matters for practice:

     * subdivisions, because "play it slowly" usually means "hear the 8ths"
     * accent patterns, so 6/8 feels like 6/8 and not six clicks
     * 2 and 4 only, which forces you to keep time between the clicks
     * a tempo ramp, for taking a drill from 60 to 120 over ten minutes
       without stopping to change the number
*/
(function (GL) {
  'use strict';

  function createMetronome(opts) {
    opts = opts || {};

    var state = {
      bpm: opts.bpm || 90,
      beatsPerBar: opts.beatsPerBar || 4,
      subdivision: opts.subdivision || 1,   /* clicks per beat */
      accentFirst: true,
      mode: 'all',                          /* 'all' | 'backbeat' | 'barOnly' */
      swing: 0,                             /* 0..0.66, delays the off-beat */
      volume: 0.8,
      countIn: 0,                           /* bars of count-in before onBeat fires */
      ramp: null                            /* { to, overSeconds, from, startedAt } */
    };

    var onBeat = opts.onBeat || function () {};
    var onBarComplete = opts.onBarComplete || function () {};

    var transport = GL.audio.createTransport({
      getBpm: function () { return currentBpm() * state.subdivision; },
      onBeat: schedule
    });

    var startedAt = 0;

    function currentBpm() {
      if (!state.ramp) return state.bpm;
      var elapsed = GL.audio.now() - state.ramp.startedAt;
      var t = Math.min(1, elapsed / state.ramp.overSeconds);
      var v = state.ramp.from + (state.ramp.to - state.ramp.from) * t;
      if (t >= 1) { state.bpm = state.ramp.to; state.ramp = null; }
      return v;
    }

    function schedule(tick, when) {
      var sub = state.subdivision;
      var beatInBar = Math.floor(tick / sub) % state.beatsPerBar;
      var subIndex = tick % sub;
      var bar = Math.floor(tick / (sub * state.beatsPerBar));

      /* Swing: push the second half of each beat later. Only meaningful when
         the click is subdividing in twos. */
      var t = when;
      if (state.swing > 0 && sub === 2 && subIndex === 1) {
        t += (60 / currentBpm()) * 0.5 * state.swing;
      }

      var isDownbeat = beatInBar === 0 && subIndex === 0;
      var isBeat = subIndex === 0;

      var play = true;
      if (state.mode === 'backbeat') play = isBeat && (beatInBar === 1 || beatInBar === 3);
      else if (state.mode === 'barOnly') play = isDownbeat;

      if (play) {
        if (isDownbeat && state.accentFirst) click(t, 'accent');
        else if (isBeat) click(t, 'beat');
        else click(t, 'sub');
      }

      onBeat({
        tick: tick, bar: bar, beat: beatInBar, sub: subIndex,
        when: t, isBeat: isBeat, isDownbeat: isDownbeat,
        counting: bar < state.countIn,
        bpm: currentBpm()
      });

      if (isDownbeat && tick > 0) onBarComplete(bar);
    }

    /* A woodblock, near enough: two detuned sines with a very fast decay and a
       tick of noise on the front so it cuts through an acoustic guitar. */
    function click(when, kind) {
      var ctx = GL.audio.context();
      var spec = kind === 'accent' ? { f: 1760, g: 1.0, d: 0.055 }
               : kind === 'beat'   ? { f: 1175, g: 0.72, d: 0.045 }
               :                     { f: 880,  g: 0.36, d: 0.032 };

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(spec.g * state.volume * 0.5, when + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, when + spec.d);
      g.connect(GL.audio.bus('click'));

      [1, 1.5].forEach(function (mult, i) {
        var o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = spec.f * mult;
        var og = ctx.createGain();
        og.gain.value = i === 0 ? 1 : 0.32;
        o.connect(og); og.connect(g);
        o.start(when);
        o.stop(when + spec.d + 0.01);
      });

      /* 2ms of noise for the attack. */
      var n = ctx.createBufferSource();
      var len = Math.floor(ctx.sampleRate * 0.002);
      var b = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = b.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      n.buffer = b;
      var ng = ctx.createGain();
      ng.gain.value = 0.5;
      n.connect(ng); ng.connect(g);
      n.start(when);
    }

    return {
      state: state,
      start: function () {
        GL.audio.unlock();
        startedAt = GL.audio.now();
        transport.start(0);
      },
      stop: function () { transport.stop(); },
      toggle: function () {
        if (transport.isRunning()) this.stop(); else this.start();
        return transport.isRunning();
      },
      isRunning: function () { return transport.isRunning(); },
      setBpm: function (v) {
        state.bpm = Math.max(30, Math.min(300, Math.round(v)));
        state.ramp = null;
        return state.bpm;
      },
      /* Climb from the current tempo to `to` over `seconds`, without stopping. */
      rampTo: function (to, seconds) {
        state.ramp = {
          from: state.bpm, to: Math.max(30, Math.min(300, to)),
          overSeconds: Math.max(1, seconds), startedAt: GL.audio.now()
        };
      },
      currentBpm: currentBpm,
      position: transport.position,
      /* Exposed so drills can use the same click without a second metronome. */
      click: click
    };
  }

  GL.metronome = { create: createMetronome };
}(window.GL = window.GL || {}));
