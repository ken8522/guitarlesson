/* synth-guitar.js -- a steel-string acoustic, synthesised from nothing.

   This is a Karplus-Strong plucked-string model. A burst of filtered noise is
   fed into a delay line one period long; every time round the loop it passes
   through an averaging filter that eats the high frequencies slightly faster
   than the low ones. That is very close to what a real string does, and it is
   why the tone starts bright and mellows as it rings instead of just fading.

   Three details separate "twangy toy" from "sounds like a guitar":

     * pick position. Plucking a string at 1/8 of its length cancels every 8th
       harmonic. Modelling that as a comb filter on the excitation is most of
       the reason a flatpick sounds different from a thumb.
     * a per-pitch decay time. Low strings ring for four seconds, the high E for
       barely one. A single decay constant sounds synthetic immediately.
     * string choking. Fretting a new note on a string kills whatever was
       ringing on it. Without this, tab playback turns into a wash of mud.

   Body resonance is deliberately NOT here -- it lives on the guitar bus in
   audio.js, because it belongs to the instrument, not to each string.
*/
(function (GL) {
  'use strict';

  var notes = GL.notes;

  /* --------------------------------------------------------- tone presets */

  var TONES = {
    /* Flatpick: bright attack, pronounced pick-position notch. */
    steel:    { exciteLP: 0.34, damping: 0.42, decayScale: 1.00, pickPos: 0.12, click: 0.55, level: 1.00 },
    /* Fingers/nails: softer excitation, longer sustain, plucked nearer the neck. */
    finger:   { exciteLP: 0.60, damping: 0.48, decayScale: 1.12, pickPos: 0.20, click: 0.18, level: 0.95 },
    /* Thumb on a wound string, for alternating-bass patterns. */
    thumb:    { exciteLP: 0.72, damping: 0.55, decayScale: 0.85, pickPos: 0.24, click: 0.22, level: 1.10 },
    /* Palm mute: heavy damping, dies almost at once. */
    mute:     { exciteLP: 0.55, damping: 0.66, decayScale: 0.09, pickPos: 0.10, click: 0.60, level: 0.95 },
    /* Natural harmonic: glassy, very little fundamental, long ring. */
    harmonic: { exciteLP: 0.18, damping: 0.28, decayScale: 1.35, pickPos: 0.50, click: 0.25, level: 0.80 }
  };

  /* Buffers are cached by pitch and tone. An LRU keeps memory bounded -- a
     full neck in three tones would otherwise sit at ~70MB of Float32. */
  var cache = new Map();
  var CACHE_MAX = 72;

  /* One live voice per string, so a new note can choke the old one. */
  var stringVoices = {};
  var allVoices = [];

  /* ------------------------------------------------------------- rendering */

  /* How long this pitch should ring, in seconds. Empirical curve fitted to a
     dreadnought: ~3.6s at low E, ~1.1s at the 12th fret of the high E. */
  function decayTime(freq, scale) {
    var t = 3.6 * Math.pow(82.41 / freq, 0.55);
    return Math.max(0.06, Math.min(4.2, t * scale));
  }

  function renderString(freq, tone, velocity) {
    var ctx = GL.audio.context();
    var sr = ctx.sampleRate;

    /* Delay-line length. Rounding it detunes the note by up to ~8 cents at the
       top of the neck, so we render at the length's natural pitch and correct
       with playbackRate at playback time instead. */
    var N = Math.max(2, Math.round(sr / freq));
    var t60 = decayTime(freq, tone.decayScale);
    var len = Math.max(64, Math.ceil(t60 * 1.05 * sr));

    var line = new Float32Array(N);

    /* Excitation: white noise through a one-pole lowpass. A harder pick
       (higher velocity) lets more top through, exactly as it does in life. */
    var lp = Math.max(0.05, tone.exciteLP * (1.25 - 0.45 * velocity));
    var last = 0;
    var i;
    for (i = 0; i < N; i++) {
      last += ((Math.random() * 2 - 1) - last) * (1 - lp);
      line[i] = last;
    }

    /* Remove DC, or the note starts with an audible thump. */
    var mean = 0;
    for (i = 0; i < N; i++) mean += line[i];
    mean /= N;
    for (i = 0; i < N; i++) line[i] -= mean;

    /* Pick position: cancels the harmonic whose node sits under the pick. */
    var p = Math.max(1, Math.round(N * tone.pickPos));
    if (p < N) {
      var pre = new Float32Array(line);
      for (i = 0; i < N; i++) line[i] = pre[i] - pre[(i - p + N) % N];
    }

    /* Normalise the burst so velocity, not luck, controls loudness. */
    var peak = 0;
    for (i = 0; i < N; i++) peak = Math.max(peak, Math.abs(line[i]));
    if (peak > 0) {
      for (i = 0; i < N; i++) line[i] /= peak;
    }

    /* Per-round-trip loss. Each slot in the delay line is updated `freq` times
       a second, so decaying to -60dB in t60 seconds means: g^(freq*t60) = 0.001 */
    var g = Math.pow(0.001, 1 / (freq * t60));
    var b = tone.damping;

    var buf = ctx.createBuffer(1, len, sr);
    var out = buf.getChannelData(0);
    var idx = 0;
    var prev = 0;
    for (i = 0; i < len; i++) {
      var cur = line[idx];
      out[i] = cur;
      /* Averaging lowpass, weighted by `damping`, then the loop loss. */
      line[idx] = (cur * (1 - b) + prev * b) * g;
      prev = cur;
      idx++;
      if (idx === N) idx = 0;
    }

    /* Attack transient: the sound of the pick or nail leaving the string.
       Three milliseconds of high-passed noise, and the note stops sounding
       like it faded in from nowhere. */
    var clickLen = Math.floor(sr * 0.003);
    var hp = 0, prevIn = 0;
    for (i = 0; i < clickLen; i++) {
      var n = Math.random() * 2 - 1;
      hp = 0.85 * (hp + n - prevIn);
      prevIn = n;
      out[i] += hp * tone.click * 0.30 * (1 - i / clickLen);
    }

    /* The loop is N samples of delay plus the averaging filter's own delay,
       which for y = (1-b)x[n] + b*x[n-1] is b samples. Getting that term right
       instead of assuming a half sample takes the tuning error at the top of
       the neck from four cents to under one. */
    return { buffer: buf, natural: sr / (N + b) };
  }

  function getRendered(freq, toneName, velocity) {
    /* Quantise the cache key: humans cannot hear a 2% velocity difference in
       the excitation filter, and this keeps the hit rate high. */
    var vq = Math.round(velocity * 4) / 4;
    var key = toneName + '|' + Math.round(freq * 100) + '|' + vq;
    var hit = cache.get(key);
    if (hit) {
      /* Refresh LRU position. */
      cache.delete(key);
      cache.set(key, hit);
      return hit;
    }
    var made = renderString(freq, TONES[toneName] || TONES.steel, vq);
    cache.set(key, made);
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
    return made;
  }

  /* --------------------------------------------------------------- playing */

  function reap() {
    var t = GL.audio.now();
    for (var i = allVoices.length - 1; i >= 0; i--) {
      if (allVoices[i].endsAt < t) allVoices.splice(i, 1);
    }
  }

  function release(voice, when, seconds) {
    if (!voice) return;
    var g = voice.gain.gain;
    try {
      g.cancelScheduledValues(when);
      g.setValueAtTime(Math.max(0.0001, voice.peak || g.value), when);
      g.exponentialRampToValueAtTime(0.0001, when + seconds);
      voice.source.stop(when + seconds + 0.01);
    } catch (e) { /* voice already finished */ }
    voice.endsAt = Math.min(voice.endsAt, when + seconds);
  }

  /* Play one note.
       midi        pitch to sound
       when        audio-clock time; defaults to now
       velocity    0..1
       tone        key of TONES
       stringIndex 0..5 low to high; supply it and re-fretting chokes the string
       dur         if given, the note is damped after this many seconds
       slideTo     midi note to glide to (slides, hammer-ons, bends)
       slideTime   how long the glide takes, default 0.09s
  */
  function note(opts) {
    var ctx = GL.audio.context();
    var when = opts.when === undefined ? GL.audio.now() + 0.005 : opts.when;
    var vel = opts.velocity === undefined ? 0.8 : Math.max(0.05, Math.min(1, opts.velocity));
    var toneName = opts.tone || 'steel';
    var tone = TONES[toneName] || TONES.steel;
    var freq = notes.midiToFreq(opts.midi);

    var rendered = getRendered(freq, toneName, vel);

    var src = ctx.createBufferSource();
    src.buffer = rendered.buffer;
    src.playbackRate.value = freq / rendered.natural;

    var peak = Math.max(0.0002, vel * vel * 0.55 * tone.level);
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.0015);

    src.connect(gain);
    gain.connect(GL.audio.bus('guitar'));

    if (opts.slideTo !== undefined) {
      var target = notes.midiToFreq(opts.slideTo) / rendered.natural;
      var st = opts.slideTime === undefined ? 0.09 : opts.slideTime;
      var at = when + (opts.slideAt === undefined ? 0.06 : opts.slideAt);
      src.playbackRate.setValueAtTime(src.playbackRate.value, at);
      src.playbackRate.exponentialRampToValueAtTime(Math.max(0.01, target), at + st);
    }

    var voice = {
      source: src,
      gain: gain,
      peak: peak,
      endsAt: when + rendered.buffer.duration / src.playbackRate.value
    };

    /* A string can only sound one note at a time. */
    if (opts.stringIndex !== undefined && opts.stringIndex !== null) {
      var prev = stringVoices[opts.stringIndex];
      if (prev && prev.endsAt > when) release(prev, when, 0.035);
      stringVoices[opts.stringIndex] = voice;
    }

    src.start(when);
    allVoices.push(voice);
    if (allVoices.length > 96) reap();

    if (opts.dur !== undefined) {
      release(voice, when + opts.dur, opts.damp === 'hard' ? 0.02 : 0.10);
    }
    return voice;
  }

  /* Convenience: sound a fret on a string in the current tuning. */
  function pluck(opts) {
    var tuning = opts.tuning || notes.TUNINGS.standard.strings;
    return note(Object.assign({}, opts, {
      midi: notes.fretMidi(tuning, opts.stringIndex, opts.fret, opts.capo)
    }));
  }

  /* Strum a shape.
       frets      array of 6, LOW string first; -1 mutes, 0 is open
       direction  'down' (low to high) or 'up'
       spread     seconds between adjacent strings; default is feel-appropriate
       only       optional array of string indices to restrict the strum to
  */
  function strum(opts) {
    var frets = opts.frets || [];
    var tuning = opts.tuning || notes.TUNINGS.standard.strings;
    var when = opts.when === undefined ? GL.audio.now() + 0.005 : opts.when;
    var up = opts.direction === 'up';
    var vel = opts.velocity === undefined ? 0.8 : opts.velocity;
    var toneName = opts.tone || 'steel';

    /* Upstrokes are quicker and usually catch fewer strings than downstrokes. */
    var spread = opts.spread === undefined ? (up ? 0.013 : 0.019) : opts.spread;

    var order = [0, 1, 2, 3, 4, 5];
    if (up) order.reverse();
    if (opts.only) order = order.filter(function (i) { return opts.only.indexOf(i) !== -1; });

    var step = 0;
    var voices = [];
    order.forEach(function (si) {
      var f = frets[si];
      if (f === undefined || f === null || f < 0) return;
      /* A strum is one gesture, not six equal plucks: the strings the pick
         reaches first speak slightly louder, and the ramp differs by direction. */
      var shade = up ? (0.82 + 0.18 * (step / 5)) : (1.0 - 0.14 * (step / 5));
      voices.push(note({
        midi: notes.fretMidi(tuning, si, f, opts.capo),
        when: when + step * spread,
        velocity: Math.max(0.05, Math.min(1, vel * shade)),
        tone: toneName,
        stringIndex: si,
        dur: opts.dur,
        damp: opts.damp
      }));
      step++;
    });
    return voices;
  }

  /* Percussive dead strum -- the "chk" between beats in a folk or funk pattern.
     Real players do this by relaxing the fretting hand, so it is pitchless
     noise with a hint of the shape underneath. */
  function chuck(opts) {
    var ctx = GL.audio.context();
    var when = opts.when === undefined ? GL.audio.now() + 0.005 : opts.when;
    var vel = opts.velocity === undefined ? 0.7 : opts.velocity;

    var len = Math.floor(ctx.sampleRate * 0.09);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;

    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1500;
    bp.Q.value = 0.9;

    var g = ctx.createGain();
    g.gain.value = vel * 0.32;

    src.connect(bp); bp.connect(g); g.connect(GL.audio.bus('guitar'));
    src.start(when);

    /* Choke anything still ringing -- that is what the muting hand does. */
    Object.keys(stringVoices).forEach(function (k) {
      var v = stringVoices[k];
      if (v && v.endsAt > when) release(v, when, 0.03);
    });
  }

  function stopAll(fadeSeconds) {
    var t = GL.audio.now();
    var f = fadeSeconds === undefined ? 0.06 : fadeSeconds;
    allVoices.forEach(function (v) { release(v, t, f); });
    allVoices.length = 0;
    stringVoices = {};
  }

  GL.guitar = {
    TONES: TONES,
    note: note,
    pluck: pluck,
    strum: strum,
    chuck: chuck,
    stopAll: stopAll,
    decayTime: decayTime,
    /* exposed for the audio sanity checks */
    _cacheSize: function () { return cache.size; }
  };
}(window.GL = window.GL || {}));
