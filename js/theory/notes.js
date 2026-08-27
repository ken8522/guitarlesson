/* notes.js -- pitch, interval and key arithmetic.
   Every other engine in the app is built on top of this file.

   Conventions used throughout Fretwork:
     * "pc"      pitch class, 0..11, C = 0
     * "midi"    MIDI note number, C4 = 60, A4 = 69 = 440Hz
     * tunings   arrays of 6 MIDI numbers ordered LOW string to HIGH string,
                 so tuning[0] is the 6th string. Use GL.notes.strIndex() to go
                 from a guitar string number (1 = high E) to an array index.
*/
(function (GL) {
  'use strict';

  var LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  var FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  /* Keys conventionally written with flats. Anything else gets sharps.
     Minor keys are tagged with a trailing '-' so they can share the list. */
  var FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
                   'D-', 'G-', 'C-', 'F-', 'Bb-', 'Eb-', 'Ab-'];

  var INTERVAL_SHORT = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
  var INTERVAL_LONG = [
    'unison', 'minor 2nd', 'major 2nd', 'minor 3rd', 'major 3rd', 'perfect 4th',
    'tritone', 'perfect 5th', 'minor 6th', 'major 6th', 'minor 7th', 'major 7th'
  ];
  /* Degree labels for notes written above the octave (9ths, 11ths, 13ths). */
  var EXT_SHORT = { 13: 'b9', 14: '9', 15: '#9', 17: '11', 18: '#11', 20: 'b13', 21: '13' };

  var ACC_TEXT = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': '##' };

  /* ---------------------------------------------------------------- parsing */

  /* 'F#' -> { letter:'F', acc:1, pc:6 }. Accepts #, b and s. */
  function parseNote(name) {
    if (typeof name !== 'string') return null;
    var s = name.trim();
    var letter = s.charAt(0).toUpperCase();
    if (!(letter in LETTER_PC)) return null;
    var acc = 0;
    for (var i = 1; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === '#' || c === 's') acc++;
      else if (c === 'b') acc--;
      else break;
    }
    return { letter: letter, acc: acc, pc: mod12(LETTER_PC[letter] + acc) };
  }

  function noteToPc(name) {
    var p = parseNote(name);
    return p ? p.pc : null;
  }

  function spell(letter, acc) {
    var a = Math.max(-2, Math.min(2, acc));
    return letter + ACC_TEXT[String(a)];
  }

  /* Preferred single-note name for a pitch class, honouring the key context. */
  function pcName(pc, key) {
    return usesFlats(key) ? FLAT_NAMES[mod12(pc)] : SHARP_NAMES[mod12(pc)];
  }

  /* Accepts 'Eb', 'Ebm', 'Eb minor', 'Eb-'. */
  function usesFlats(key) {
    if (!key) return false;
    var k = String(key).trim();
    var m = k.match(/^([A-Ga-g][#b]*)/);
    if (!m) return false;
    var root = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    var rest = k.slice(m[1].length);
    var minor = /^(m$|m[^a]|min|-)/i.test(rest) || /minor/i.test(rest);
    return FLAT_KEYS.indexOf(minor ? root + '-' : root) !== -1;
  }

  /* --------------------------------------------------------------- spelling */

  /* Spell a scale so each letter is used exactly once -- F# major comes out as
     F# G# A# B C# D# E#, not F# G# A# B C# D# F. Only meaningful for seven-note
     scales; pentatonics and symmetrical scales fall back to key-aware naming. */
  function spellScale(rootName, intervals, keyHint) {
    var root = parseNote(rootName);
    if (!root) return [];
    if (intervals.length !== 7) {
      return intervals.map(function (iv) {
        return pcName(root.pc + iv, keyHint || rootName);
      });
    }
    var li = LETTERS.indexOf(root.letter);
    return intervals.map(function (iv, i) {
      var letter = LETTERS[(li + i) % 7];
      var want = mod12(root.pc + iv);
      var acc = want - LETTER_PC[letter];
      /* Wrap into a sane accidental range: wanting pc 11 from letter C is Cb. */
      if (acc > 6) acc -= 12;
      if (acc < -6) acc += 12;
      return spell(letter, acc);
    });
  }

  /* ------------------------------------------------------------ midi / freq */

  function mod12(n) { return ((n % 12) + 12) % 12; }

  function midiToFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function freqToMidi(freq) { return 69 + 12 * Math.log(freq / 440) / Math.LN2; }

  function midiName(midi, key) {
    return pcName(mod12(midi), key) + (Math.floor(midi / 12) - 1);
  }

  /* Cents that `freq` is sharp (+) or flat (-) of the nearest tempered note. */
  function centsOff(freq) {
    var m = freqToMidi(freq);
    return (m - Math.round(m)) * 100;
  }

  function intervalShort(semi) {
    if (semi < 12) return INTERVAL_SHORT[mod12(semi)];
    return EXT_SHORT[semi] || INTERVAL_SHORT[mod12(semi)];
  }

  function intervalLong(semi) { return INTERVAL_LONG[mod12(semi)]; }

  /* ---------------------------------------------------------------- tunings */

  var TUNINGS = {
    standard:      { name: 'Standard',        strings: [40, 45, 50, 55, 59, 64], label: 'E A D G B E' },
    dropD:         { name: 'Drop D',          strings: [38, 45, 50, 55, 59, 64], label: 'D A D G B E' },
    doubleDropD:   { name: 'Double drop D',   strings: [38, 45, 50, 55, 59, 62], label: 'D A D G B D' },
    dadgad:        { name: 'DADGAD',          strings: [38, 45, 50, 55, 57, 62], label: 'D A D G A D' },
    openG:         { name: 'Open G',          strings: [38, 43, 50, 55, 59, 62], label: 'D G D G B D' },
    openD:         { name: 'Open D',          strings: [38, 45, 50, 54, 57, 62], label: 'D A D F# A D' },
    openC:         { name: 'Open C',          strings: [36, 43, 48, 55, 60, 64], label: 'C G C G C E' },
    openE:         { name: 'Open E',          strings: [40, 47, 52, 56, 59, 64], label: 'E B E G# B E' },
    cgdgcd:        { name: 'CGDGCD',          strings: [36, 43, 50, 55, 60, 62], label: 'C G D G C D' },
    halfStepDown:  { name: 'Half step down',  strings: [39, 44, 49, 54, 58, 63], label: 'Eb Ab Db Gb Bb Eb' },
    wholeStepDown: { name: 'Whole step down', strings: [38, 43, 48, 53, 57, 62], label: 'D G C F A D' }
  };

  /* Guitar string number (1 = high E) to tuning-array index (0 = low string). */
  function strIndex(stringNo) { return 6 - stringNo; }
  function strNumber(index) { return 6 - index; }

  /* MIDI note sounding at a given string index and fret, capo included. */
  function fretMidi(tuning, index, fret, capo) {
    return tuning[index] + fret + (capo || 0);
  }

  /* Lowest fret on `index` sounding pitch class `pc`, searching from minFret. */
  function fretForPc(tuning, index, pc, minFret, maxFret) {
    var lo = minFret || 0;
    var hi = maxFret === undefined ? 22 : maxFret;
    for (var f = lo; f <= hi; f++) {
      if (mod12(tuning[index] + f) === mod12(pc)) return f;
    }
    return -1;
  }

  /* ------------------------------------------------------- circle of fifths */

  var CIRCLE = (function () {
    /* Clockwise from C: sharps out to F#, then the flat spellings back round. */
    var majors = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
    var minors = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];
    var accidentals = [0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1];
    return majors.map(function (maj, i) {
      return { major: maj, minor: minors[i], accidentals: accidentals[i], position: i };
    });
  }());

  function keySignature(keyName) {
    if (!keyName) return null;
    var minor = /m(in)?\b|minor|-$/i.test(keyName);
    var m = keyName.match(/^([A-Ga-g][#b]*)/);
    if (!m) return null;
    var root = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    for (var i = 0; i < CIRCLE.length; i++) {
      var e = CIRCLE[i];
      if (minor ? e.minor.replace('m', '') === root : e.major === root) return e;
    }
    return null;
  }

  GL.notes = {
    LETTERS: LETTERS,
    SHARP_NAMES: SHARP_NAMES,
    FLAT_NAMES: FLAT_NAMES,
    INTERVAL_SHORT: INTERVAL_SHORT,
    INTERVAL_LONG: INTERVAL_LONG,
    TUNINGS: TUNINGS,
    CIRCLE: CIRCLE,
    mod12: mod12,
    parseNote: parseNote,
    noteToPc: noteToPc,
    pcName: pcName,
    usesFlats: usesFlats,
    spell: spell,
    spellScale: spellScale,
    midiToFreq: midiToFreq,
    freqToMidi: freqToMidi,
    midiName: midiName,
    centsOff: centsOff,
    intervalShort: intervalShort,
    intervalLong: intervalLong,
    strIndex: strIndex,
    strNumber: strNumber,
    fretMidi: fretMidi,
    fretForPc: fretForPc,
    keySignature: keySignature
  };
}(window.GL = window.GL || {}));
