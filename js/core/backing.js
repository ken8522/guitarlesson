/* backing.js -- turns a chord progression into a band.

   Give it chords, a style and a tempo and it schedules drums, a bass line and a
   comping guitar, bar by bar, ahead of the audio clock. This is what makes the
   modern song index useful without reproducing anyone's transcription: the
   progression is a fact, and a backing track built from it lets you practise
   the changes.

   The bass is synthesised here rather than in its own file because it is a
   short function -- a lowpassed triangle with a fast attack is a convincing
   enough upright when it is buried under a drum kit.
*/
(function (GL) {
  'use strict';

  var notes = GL.notes;

  /* ------------------------------------------------------------------ bass */

  function bassNote(midi, when, dur, vel) {
    var c = GL.audio.context();
    var o = c.createOscillator();
    var g = c.createGain();
    var lp = c.createBiquadFilter();

    o.type = 'triangle';
    o.frequency.value = notes.midiToFreq(midi);

    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1600, when);
    lp.frequency.exponentialRampToValueAtTime(420, when + 0.12);
    lp.Q.value = 1;

    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vel * 0.5, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(0.12, dur * 0.9));

    o.connect(lp); lp.connect(g); g.connect(GL.audio.bus('bass'));
    o.start(when);
    o.stop(when + dur + 0.1);
  }

  /* Put the root somewhere a bass guitar would actually play it. */
  function bassMidi(pc, low) {
    var m = 28 + notes.mod12(pc - 28);       /* E1 upwards */
    while (m < (low || 33)) m += 12;
    while (m > (low || 33) + 11) m -= 12;
    return m;
  }

  /* ---------------------------------------------------------- bass patterns */

  /* Each returns [{ beat, midi, dur, vel }] for one bar of `beats` beats. */
  var BASS = {
    root: function (chord, beats) {
      return [{ beat: 0, midi: bassMidi(chord.rootPc), dur: beats * 0.9, vel: 0.9 }];
    },
    rootFifth: function (chord, beats) {
      var r = bassMidi(chord.rootPc);
      var out = [];
      for (var b = 0; b < beats; b += 2) {
        out.push({ beat: b, midi: r, dur: 0.9, vel: 0.95 });
        if (b + 1 < beats) out.push({ beat: b + 1, midi: r + 7, dur: 0.9, vel: 0.75 });
      }
      return out;
    },
    /* Alternating root and fifth on every beat -- country and bluegrass. */
    alternating: function (chord, beats) {
      var r = bassMidi(chord.rootPc);
      var out = [];
      for (var b = 0; b < beats; b++) {
        out.push({ beat: b, midi: b % 2 === 0 ? r : r + 7, dur: 0.85, vel: b % 2 === 0 ? 0.95 : 0.8 });
      }
      return out;
    },
    /* Chord tones on the beats, which is what a walking line really is. */
    walking: function (chord, beats, nextChord) {
      var pcs = GL.chords.pitchClasses(chord);
      var r = bassMidi(chord.rootPc);
      var out = [{ beat: 0, midi: r, dur: 0.85, vel: 0.95 }];
      for (var b = 1; b < beats; b++) {
        var pc = pcs[b % pcs.length];
        var m = bassMidi(pc);
        /* Approach the next chord by a semitone on the last beat. */
        if (b === beats - 1 && nextChord) {
          var target = bassMidi(nextChord.rootPc);
          m = target + (Math.random() < 0.5 ? -1 : 1);
        }
        out.push({ beat: b, midi: m, dur: 0.85, vel: 0.8 });
      }
      return out;
    },
    bossa: function (chord, beats) {
      var r = bassMidi(chord.rootPc);
      return [
        { beat: 0, midi: r, dur: 1.4, vel: 0.9 },
        { beat: 1.5, midi: r + 7, dur: 0.9, vel: 0.75 },
        { beat: 2.5, midi: r, dur: 1.2, vel: 0.85 }
      ].filter(function (n) { return n.beat < beats; });
    },
    none: function () { return []; }
  };

  /* --------------------------------------------------------- comping guitar */

  /* Where the guitar hits, as beat offsets with velocities. */
  var COMP = {
    strum: [[0, 0.75, 'down'], [1.5, 0.45, 'up'], [2, 0.6, 'down'], [3, 0.5, 'down'], [3.5, 0.45, 'up']],
    offbeat: [[1, 0.7, 'down'], [3, 0.7, 'down']],
    chop: [[1, 0.8, 'down'], [3, 0.8, 'down']],
    sparse: [[0, 0.7, 'down']],
    waltz: [[0, 0.7, 'down'], [1, 0.55, 'down'], [2, 0.55, 'down']],
    none: []
  };

  var STYLES = {
    folk:      { drums: 'folk',      bass: 'rootFifth',   comp: 'strum',   swing: 0 },
    rock:      { drums: 'rock',      bass: 'root',        comp: 'offbeat', swing: 0 },
    country:   { drums: 'country',   bass: 'alternating', comp: 'chop',    swing: 0 },
    bluegrass: { drums: 'bluegrass', bass: 'alternating', comp: 'chop',    swing: 0 },
    blues:     { drums: 'shuffle',   bass: 'rootFifth',   comp: 'strum',   swing: 0.62 },
    jazz:      { drums: 'shuffle',   bass: 'walking',     comp: 'offbeat', swing: 0.58 },
    ballad:    { drums: 'ballad',    bass: 'root',        comp: 'sparse',  swing: 0 },
    bossa:     { drums: 'bossa',     bass: 'bossa',       comp: 'offbeat', swing: 0 },
    waltz:     { drums: 'waltz',     bass: 'rootFifth',   comp: 'waltz',   swing: 0 },
    sixEight:  { drums: 'sixEight',  bass: 'root',        comp: 'sparse',  swing: 0 },
    drumsOnly: { drums: 'folk',      bass: 'none',        comp: 'none',    swing: 0 },
    bandOnly:  { drums: 'folk',      bass: 'rootFifth',   comp: 'none',    swing: 0 }
  };

  /* ------------------------------------------------------------- the player */

  /* opts:
       chords       ['C','Am','F','G'] or [{ symbol, bars }]
       beatsPerBar  default 4
       style        key of STYLES
       tempo        bpm
       tuning       for the comping guitar
       onBar(i)     called when each bar starts sounding
  */
  function create(opts) {
    var state = {
      chords: normalise(opts.chords),
      beatsPerBar: opts.beatsPerBar || 4,
      style: opts.style || 'folk',
      tempo: opts.tempo || 90,
      tuning: opts.tuning || notes.TUNINGS.standard.strings,
      level: { drums: 1, bass: 1, guitar: 1 },
      countIn: opts.countIn === undefined ? 1 : opts.countIn
    };
    var onBar = opts.onBar || function () {};
    var barIndex = 0;
    var voicingCache = {};

    function normalise(list) {
      return (list || []).map(function (c) {
        var symbol = typeof c === 'string' ? c : c.symbol;
        var parsed = GL.chords.parse(symbol);
        return { symbol: symbol, parsed: parsed, bars: (c && c.bars) || 1 };
      }).filter(function (c) { return c.parsed; });
    }

    function voicing(symbol) {
      if (voicingCache[symbol]) return voicingCache[symbol];
      var v = GL.chords.voicings(symbol, {
        tuning: state.tuning, maxFret: 9, limit: 1
      })[0];
      voicingCache[symbol] = v;
      return v;
    }

    /* One transport beat = one bar, so everything for a bar is scheduled at
       once. That keeps the scheduling simple and the timing exact. */
    var transport = GL.audio.createTransport({
      getBpm: function () { return state.tempo / state.beatsPerBar; },
      onBeat: function (n, when) { scheduleBar(n, when); }
    });

    function scheduleBar(n, when) {
      if (!state.chords.length) return;
      var style = STYLES[state.style] || STYLES.folk;
      var beat = 60 / state.tempo;
      var beats = state.beatsPerBar;

      /* Count-in bars: click only, nothing else. */
      if (n < state.countIn) {
        for (var c = 0; c < beats; c++) {
          GL.drums.hat(when + c * beat, c === 0 ? 0.5 : 0.3);
        }
        return;
      }

      var i = (n - state.countIn) % state.chords.length;
      var chord = state.chords[i];
      var next = state.chords[(i + 1) % state.chords.length];
      barIndex = i;

      /* Drums. The grid is 16 slots for 4/4, 12 for 3/4 and 6/8. */
      var pattern = GL.drums.PATTERNS[style.drums];
      var slots = pattern ? pattern.grid.length : 16;
      var slotDur = (beats * beat) / slots;
      GL.drums.playBar(style.drums, when, slotDur, state.level.drums, style.swing);

      /* Bass. */
      var bassFn = BASS[style.bass] || BASS.root;
      bassFn(chord.parsed, beats, next.parsed).forEach(function (b) {
        bassNote(b.midi, when + b.beat * beat, b.dur * beat, b.vel * state.level.bass);
      });

      /* Comping guitar. */
      var v = voicing(chord.symbol);
      if (v && state.level.guitar > 0) {
        (COMP[style.comp] || []).forEach(function (hit) {
          if (hit[0] >= beats) return;
          var t = when + hit[0] * beat;
          if (style.swing > 0 && Math.abs(hit[0] % 1 - 0.5) < 0.01) t += beat * 0.5 * style.swing;
          GL.guitar.strum({
            frets: v.frets, tuning: state.tuning, when: t,
            direction: hit[2], velocity: hit[1] * state.level.guitar, tone: 'steel'
          });
        });
      }

      onBar(i, chord, when);
    }

    return {
      state: state,
      start: function () { GL.audio.unlock(); transport.start(0); },
      stop: function () { transport.stop(); GL.guitar.stopAll(0.1); },
      isRunning: function () { return transport.isRunning(); },
      toggle: function () {
        if (transport.isRunning()) this.stop(); else this.start();
        return transport.isRunning();
      },
      setTempo: function (v) { state.tempo = Math.max(40, Math.min(260, v)); },
      setStyle: function (k) { if (STYLES[k]) state.style = k; },
      setChords: function (list) { state.chords = normalise(list); voicingCache = {}; },
      setLevel: function (which, v) { state.level[which] = Math.max(0, Math.min(1.5, v)); },
      currentBar: function () { return barIndex; }
    };
  }

  GL.backing = { create: create, STYLES: STYLES, BASS: BASS, COMP: COMP, bassNote: bassNote };
}(window.GL = window.GL || {}));
