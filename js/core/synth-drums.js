/* synth-drums.js -- a drum kit made of oscillators and noise.

   Same principle as the guitar: no samples, nothing to download. A kick is a
   sine whose pitch collapses; a snare is a noise burst with a tuned body under
   it; hats are high-passed noise with a very fast decay. It will not fool
   anyone, but it keeps time honestly and that is what a practice track is for.

   Patterns are written on a sixteenth grid: sixteen slots per bar, each holding
   a velocity from 0 (silent) to 1.
*/
(function (GL) {
  'use strict';

  function ctx() { return GL.audio.context(); }
  function bus() { return GL.audio.bus('drums'); }

  /* ------------------------------------------------------------ the voices */

  function kick(when, vel) {
    var c = ctx();
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = 'sine';
    /* The pitch drop is the entire character of a kick drum. */
    o.frequency.setValueAtTime(150, when);
    o.frequency.exponentialRampToValueAtTime(45, when + 0.08);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vel * 0.9, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.36);
    o.connect(g); g.connect(bus());
    o.start(when); o.stop(when + 0.4);
  }

  function noiseBuffer(seconds) {
    var c = ctx();
    var len = Math.floor(c.sampleRate * seconds);
    var b = c.createBuffer(1, len, c.sampleRate);
    var d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  var cachedNoise = null;
  function noise() {
    if (!cachedNoise) cachedNoise = noiseBuffer(1);
    return cachedNoise;
  }

  function snare(when, vel) {
    var c = ctx();
    /* Noise for the wires. */
    var n = c.createBufferSource();
    n.buffer = noise();
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1400;
    var ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, when);
    ng.gain.exponentialRampToValueAtTime(vel * 0.55, when + 0.002);
    ng.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
    n.connect(hp); hp.connect(ng); ng.connect(bus());
    n.start(when); n.stop(when + 0.2);

    /* A tuned thump for the drum body, or it sounds like a hi-hat. */
    var o = c.createOscillator();
    var og = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(210, when);
    o.frequency.exponentialRampToValueAtTime(150, when + 0.09);
    og.gain.setValueAtTime(0.0001, when);
    og.gain.exponentialRampToValueAtTime(vel * 0.35, when + 0.003);
    og.gain.exponentialRampToValueAtTime(0.0001, when + 0.13);
    o.connect(og); og.connect(bus());
    o.start(when); o.stop(when + 0.16);
  }

  function hat(when, vel, open) {
    var c = ctx();
    var n = c.createBufferSource();
    n.buffer = noise();
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    var g = c.createGain();
    var dur = open ? 0.28 : 0.045;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vel * (open ? 0.28 : 0.22), when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    n.connect(hp); hp.connect(g); g.connect(bus());
    n.start(when); n.stop(when + dur + 0.02);
  }

  /* A brush swirl, for the folk and ballad patterns where a stick is too much. */
  function brush(when, vel) {
    var c = ctx();
    var n = c.createBufferSource();
    n.buffer = noise();
    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2600;
    bp.Q.value = 0.6;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vel * 0.16, when + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
    n.connect(bp); bp.connect(g); g.connect(bus());
    n.start(when); n.stop(when + 0.25);
  }

  var VOICES = { k: kick, s: snare, h: hat, o: function (w, v) { hat(w, v, true); }, b: brush };

  /* ---------------------------------------------------------- the patterns */

  /* Sixteen slots to the bar. 'k' kick, 's' snare, 'h' hat, 'o' open hat,
     'b' brush. A slot is [voice, velocity]. */
  function grid(spec) {
    var out = [];
    for (var i = 0; i < 16; i++) out.push([]);
    Object.keys(spec).forEach(function (voice) {
      spec[voice].forEach(function (v, i) {
        if (v > 0) out[i].push([voice, v]);
      });
    });
    return out;
  }

  var PATTERNS = {
    folk: {
      name: 'Folk', beatsPerBar: 4,
      grid: grid({
        k: [1, 0, 0, 0, 0, 0, .6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        b: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        h: [.5, 0, .35, 0, .5, 0, .35, 0, .5, 0, .35, 0, .5, 0, .35, 0]
      })
    },
    rock: {
      name: 'Rock', beatsPerBar: 4,
      grid: grid({
        k: [1, 0, 0, 0, 0, 0, .8, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        s: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        h: [.6, 0, .4, 0, .6, 0, .4, 0, .6, 0, .4, 0, .6, 0, .4, 0]
      })
    },
    country: {
      name: 'Country (boom-chick)', beatsPerBar: 4,
      grid: grid({
        k: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        s: [0, 0, 0, 0, .8, 0, 0, 0, 0, 0, 0, 0, .8, 0, 0, 0],
        h: [.4, 0, 0, 0, .4, 0, 0, 0, .4, 0, 0, 0, .4, 0, 0, 0]
      })
    },
    bluegrass: {
      name: 'Bluegrass', beatsPerBar: 4,
      grid: grid({
        k: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        s: [0, 0, 0, 0, .95, 0, 0, 0, 0, 0, 0, 0, .95, 0, 0, 0]
      })
    },
    shuffle: {
      name: 'Blues shuffle', beatsPerBar: 4, swing: 0.62,
      grid: grid({
        k: [1, 0, 0, 0, 0, 0, .5, 0, .9, 0, 0, 0, 0, 0, 0, 0],
        s: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        h: [.6, 0, .35, 0, .6, 0, .35, 0, .6, 0, .35, 0, .6, 0, .35, 0]
      })
    },
    ballad: {
      name: 'Ballad', beatsPerBar: 4,
      grid: grid({
        k: [.9, 0, 0, 0, 0, 0, 0, 0, .7, 0, 0, 0, 0, 0, 0, 0],
        b: [0, 0, 0, 0, .8, 0, 0, 0, 0, 0, 0, 0, .8, 0, 0, 0],
        h: [.35, 0, 0, 0, .35, 0, 0, 0, .35, 0, 0, 0, .35, 0, 0, 0]
      })
    },
    bossa: {
      name: 'Bossa nova', beatsPerBar: 4,
      grid: grid({
        k: [1, 0, 0, .6, 0, 0, 1, 0, 0, .6, 0, 0, 1, 0, 0, 0],
        h: [.4, .3, .4, .3, .4, .3, .4, .3, .4, .3, .4, .3, .4, .3, .4, .3],
        s: [0, 0, 0, 0, 0, 0, .4, 0, 0, 0, .4, 0, 0, 0, 0, 0]
      })
    },
    waltz: {
      name: 'Waltz (3/4)', beatsPerBar: 3,
      grid: (function () {
        var g = grid({
          k: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          b: [0, 0, 0, 0, .7, 0, 0, 0, .7, 0, 0, 0, 0, 0, 0, 0],
          h: [.4, 0, 0, 0, .35, 0, 0, 0, .35, 0, 0, 0, 0, 0, 0, 0]
        });
        return g.slice(0, 12);
      }())
    },
    sixEight: {
      name: '6/8', beatsPerBar: 6,
      grid: (function () {
        /* Six slots of an eighth each, so the grid is read at half resolution. */
        var g = grid({
          k: [1, 0, 0, 0, 0, 0, .8, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          b: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          h: [.5, 0, .3, 0, .3, 0, .5, 0, .3, 0, .3, 0, 0, 0, 0, 0]
        });
        return g.slice(0, 12);
      }())
    },
    none: { name: 'No drums', beatsPerBar: 4, grid: grid({}) }
  };

  /* Play one bar of a pattern starting at `when`. `slotDur` is the length of a
     grid slot in seconds. */
  function playBar(patternKey, when, slotDur, level, swing) {
    var p = PATTERNS[patternKey] || PATTERNS.folk;
    p.grid.forEach(function (slot, i) {
      if (!slot.length) return;
      var t = when + i * slotDur;
      /* Swing pushes the odd sixteenths late, same as the metronome. */
      if (swing > 0 && i % 2 === 1) t += slotDur * swing;
      slot.forEach(function (hit) {
        var fn = VOICES[hit[0]];
        if (fn) fn(t, hit[1] * (level === undefined ? 1 : level));
      });
    });
  }

  GL.drums = {
    PATTERNS: PATTERNS,
    playBar: playBar,
    kick: kick, snare: snare, hat: hat, brush: brush
  };
}(window.GL = window.GL || {}));
