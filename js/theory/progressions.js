/* progressions.js -- roman numerals in both directions, and a library.

   A progression is stored as numerals, never as chords, so one entry covers all
   twelve keys. `realise()` turns 'bVII' in the key of D into C, and knows that
   a lowercase numeral means minor unless a suffix says otherwise.
*/
(function (GL) {
  'use strict';

  var notes = GL.notes;

  var DEGREE = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 };

  /* Order is load-bearing. Regex alternation takes the FIRST branch that
     matches, so the longer numerals have to come first -- with 'I' ahead of
     'IV', every IV chord parsed as a I with a stray "V" suffix, and a I-IV-V
     came out as I-I-V. */
  var ROMAN_RE = /^([b#]?)(IV|VII|VI|V|III|II|I|iv|vii|vi|v|iii|ii|i)(.*)$/;

  /* 'bVII7' -> { offset: 10, minor: false, quality: '7' } */
  function parseNumeral(text) {
    var m = String(text).trim().match(ROMAN_RE);
    if (!m) return null;
    var acc = m[1] === 'b' ? -1 : m[1] === '#' ? 1 : 0;
    var roman = m[2];
    var suffix = (m[3] || '').trim();
    var minor = roman === roman.toLowerCase();
    var offset = DEGREE[roman.toUpperCase()];
    if (offset === undefined) return null;

    var quality;
    if (!suffix) quality = minor ? 'm' : 'maj';
    else if (suffix === 'o') quality = 'dim';
    else if (suffix === 'o7') quality = 'dim7';
    else if (suffix === '+') quality = 'aug';
    else if (minor && /^(7|9|11|13|6)$/.test(suffix)) quality = 'm' + suffix;
    else quality = suffix;

    return { offset: notes.mod12(offset + acc), acc: acc, minor: minor, quality: quality, text: text };
  }

  /* Numerals to chord symbols in a key. */
  function realise(numerals, keyName) {
    var rootPc = notes.noteToPc(keyName);
    if (rootPc === null) return [];
    /* Spell relative to the key so a bVII in D comes out C, not B#. */
    var keyForSpelling = keyName;
    return numerals.map(function (n) {
      var p = parseNumeral(n);
      if (!p) return null;
      var pc = notes.mod12(rootPc + p.offset);
      /* A flattened degree is spelled flat and a raised one sharp, whatever the
         key would otherwise prefer: the bII of C is Db, never C#, because the
         name is describing a lowered second and not an arbitrary pitch. */
      var name = p.acc < 0 ? notes.FLAT_NAMES[pc]
               : p.acc > 0 ? notes.SHARP_NAMES[pc]
               : notes.pcName(pc, keyForSpelling);
      var quality = GL.chords.QUALITIES[p.quality] ? p.quality : (p.minor ? 'm' : 'maj');
      return { symbol: GL.chords.symbolOf(name, quality), numeral: n, root: name, quality: quality };
    }).filter(Boolean);
  }

  /* The other direction: given chords and a key, what are the numerals? */
  function analyse(symbols, keyName) {
    var rootPc = notes.noteToPc(keyName);
    var scale = GL.scales.harmonize(keyName, 'major', { sevenths: false });
    return symbols.map(function (sym) {
      var c = GL.chords.parse(sym);
      if (!c) return sym;
      var rel = notes.mod12(c.rootPc - rootPc);
      var names = ['I', 'bII', 'II', 'bIII', 'III', 'IV', 'bV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
      var base = names[rel];
      var minorish = /^(m|dim|m7|m9|m11|m13|m7b5|dim7)$/.test(c.quality);
      var out = minorish ? base.toLowerCase() : base;
      if (c.quality === '7') out += '7';
      else if (c.quality === 'maj7') out += 'maj7';
      else if (c.quality === 'm7') out += '7';
      else if (c.quality === 'dim') out += 'o';
      else if (c.quality === 'm7b5') out += 'm7b5';
      var diatonic = scale.some(function (d) { return notes.mod12(d.rootPc) === notes.mod12(c.rootPc); });
      return { symbol: sym, numeral: out, diatonic: diatonic };
    });
  }

  /* ------------------------------------------------------------- the library */

  function P(name, numerals, genre, note, beats) {
    return { name: name, numerals: numerals, genre: genre, note: note, beatsPerChord: beats || 4 };
  }

  var LIBRARY = [
    /* --- the workhorses --- */
    P('I-IV-V', ['I', 'IV', 'V', 'V'], 'Essential', 'The oldest three chords in popular music.'),
    P('I-V-vi-IV', ['I', 'V', 'vi', 'IV'], 'Essential', 'The four-chord song. Hundreds of hits sit on exactly this.'),
    P('vi-IV-I-V', ['vi', 'IV', 'I', 'V'], 'Essential', 'The same four chords starting on the minor. Darker opening, same landing.'),
    P('I-vi-IV-V', ['I', 'vi', 'IV', 'V'], 'Essential', 'Doo-wop. Fifties, and it never really left.'),
    P('I-IV-I-V', ['I', 'IV', 'I', 'V'], 'Essential', 'Folk and country in its plainest form.'),
    P('ii-V-I', ['ii7', 'V7', 'Imaj7', 'Imaj7'], 'Jazz', 'The cadence the whole of jazz harmony is built around.'),
    P('I-vi-ii-V', ['Imaj7', 'vi7', 'ii7', 'V7'], 'Jazz', 'Rhythm changes, first four bars.'),
    P('I-bVII-IV', ['I', 'bVII', 'IV', 'I'], 'Rock', 'Mixolydian rock. The bVII is outside the key, which is the point.'),
    P('I-bVII-bVI-bVII', ['I', 'bVII', 'bVI', 'bVII'], 'Rock', 'Aeolian rock cadence. Heavy, and it never resolves.'),
    P('i-bVI-bIII-bVII', ['i', 'bVI', 'bIII', 'bVII'], 'Rock', 'The minor-key equivalent of the four-chord song.'),
    P('i-VII-VI-V', ['i', 'bVII', 'bVI', 'V'], 'Classical', 'The Andalusian cadence. Flamenco, and everything descended from it.'),
    P('i-iv-V', ['i', 'iv', 'V7', 'i'], 'Classical', 'Minor key with a proper dominant, borrowed from harmonic minor.'),
    P('I-iii-IV-V', ['I', 'iii', 'IV', 'V'], 'Pop', 'A gentler climb than I-IV-V.'),
    P('I-V-vi-iii-IV-I-IV-V', ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'], 'Classical', "Pachelbel's canon. Eight bars, and you will hear it everywhere now."),

    /* --- blues --- */
    P('12-bar blues', ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'], 'Blues', 'The standard form. Twelve bars, three chords.'),
    P('12-bar quick change', ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'], 'Blues', 'The IV arrives in bar 2 instead of bar 5.'),
    P('12-bar jazz blues', ['I7', 'IV7', 'I7', 'v7', 'IV7', 'IV7', 'I7', 'VI7', 'ii7', 'V7', 'I7', 'V7'], 'Blues', 'Blues with ii-V substitutions worked into it.'),
    P('8-bar blues', ['I7', 'V7', 'IV7', 'IV7', 'I7', 'V7', 'I7', 'V7'], 'Blues', 'Key to the Highway and a hundred others.'),
    P('16-bar blues', ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'I7', 'I7', 'V7', 'V7', 'IV7', 'IV7', 'I7', 'V7'], 'Blues', 'The long form, common in country blues.'),
    P('Minor blues', ['i7', 'i7', 'i7', 'i7', 'iv7', 'iv7', 'i7', 'i7', 'bVI7', 'V7', 'i7', 'V7'], 'Blues', 'The minor twelve-bar. The bVI to V is the whole character.'),

    /* --- folk and traditional --- */
    P('I-V (two chord)', ['I', 'V'], 'Folk', 'Two chords, endlessly. More traditional music uses this than any other shape.', 4),
    P('i-bVII (modal vamp)', ['i', 'bVII'], 'Folk', 'Dorian or aeolian vamp. Celtic and old-time live here.', 4),
    P('I-bVII (mixolydian vamp)', ['I', 'bVII'], 'Folk', 'The mixolydian two-chord vamp. Old Joe Clark, and most fiddle tunes.', 4),
    P('i-III-VII-i', ['i', 'bIII', 'bVII', 'i'], 'Folk', 'Aeolian folk. Sounds ancient because it more or less is.'),
    P('I-IV-V-IV', ['I', 'IV', 'V', 'IV'], 'Folk', 'The V never resolves, so it keeps rolling.'),
    P('i-iv-VII-III', ['i', 'iv', 'bVII', 'bIII'], 'Folk', 'A circle-of-fifths descent in a minor key.'),
    P('I-V-IV-I (Celtic)', ['I', 'V', 'IV', 'I'], 'Folk', 'The plagal turn at the end gives it the folk flavour.'),

    /* --- country --- */
    P('I-IV-V country', ['I', 'I', 'IV', 'V'], 'Country', 'With bass runs between every change.'),
    P('I-V-IV-I', ['I', 'V', 'IV', 'I'], 'Country', 'Sweet Home Alabama, in essence.'),
    P('I-vi-IV-V country', ['I', 'vi', 'IV', 'V'], 'Country', 'Fifties country ballad.'),
    P('I-II7-V', ['I', 'II7', 'V7', 'I'], 'Country', 'A secondary dominant on the second degree. Western swing.'),

    /* --- jazz and richer harmony --- */
    P('Rhythm changes A', ['Imaj7', 'vi7', 'ii7', 'V7', 'Imaj7', 'vi7', 'ii7', 'V7'], 'Jazz', 'The A section of the most reused form in jazz.'),
    P('Rhythm changes B', ['III7', 'III7', 'VI7', 'VI7', 'II7', 'II7', 'V7', 'V7'], 'Jazz', 'The bridge: a cycle of dominants.'),
    P('Autumn Leaves A', ['ii7', 'V7', 'Imaj7', 'IVmaj7', 'viim7b5', 'III7', 'vi', 'vi'], 'Jazz', 'A major ii-V-I answered by a minor one.'),
    P('Circle of fifths', ['iii7', 'vi7', 'ii7', 'V7', 'Imaj7', 'IVmaj7', 'viim7b5', 'III7'], 'Jazz', 'Falling fifths all the way round.'),
    P('Backdoor ii-V', ['Imaj7', 'ivm7', 'bVII7', 'Imaj7'], 'Jazz', 'Resolving to I from bVII7 instead of V7.'),
    P('Tritone sub ii-V-I', ['ii7', 'bII7', 'Imaj7', 'Imaj7'], 'Jazz', 'The V replaced by the dominant a tritone away, so the bass falls by a semitone.'),
    P('Minor ii-V-i', ['iim7b5', 'V7', 'i', 'i'], 'Jazz', 'The minor-key cadence. The V is borrowed from harmonic minor.'),
    P('Bossa I-VI-ii-V', ['Imaj7', 'VI7', 'ii7', 'V7'], 'Jazz', 'Brazilian, and it swings even at a whisper.'),

    /* --- pop and modern --- */
    P('IV-I-V-vi', ['IV', 'I', 'V', 'vi'], 'Pop', 'Another rotation of the four chords.'),
    P('vi-V-IV-V', ['vi', 'V', 'IV', 'V'], 'Pop', 'Never lands on I, so it never feels finished.'),
    P('I-iii-vi-IV', ['I', 'iii', 'vi', 'IV'], 'Pop', 'A softer descent than the usual four.'),
    P('i-VI-III-VII', ['i', 'bVI', 'bIII', 'bVII'], 'Pop', 'The minor four-chord loop, used constantly since about 2005.'),
    P('I-IV-vi-V', ['I', 'IV', 'vi', 'V'], 'Pop', 'The IV early makes it lift sooner.'),
    P('I-V-IV-IV', ['I', 'V', 'IV', 'IV'], 'Pop', 'Sits on the IV, which softens the turnaround.'),
    P('vi-IV-V-I', ['vi', 'IV', 'V', 'I'], 'Pop', 'Ends on the tonic, so it works as a chorus.'),
    P('I-bIII-IV', ['I', 'bIII', 'IV', 'IV'], 'Rock', 'Borrowed bIII. Blues-rock staple.'),
    P('I-iv-I', ['I', 'IV', 'iv', 'I'], 'Pop', 'The minor four. One of the strongest effects in tonal music.'),
    P('I-V/vii-vi', ['I', 'V', 'vi', 'V'], 'Pop', 'A pedal-ish loop that keeps returning without settling.'),

    /* --- turnarounds and cadences --- */
    P('Perfect cadence', ['V7', 'I'], 'Cadences', 'A full stop.', 4),
    P('Plagal cadence', ['IV', 'I'], 'Cadences', 'The amen cadence. Softer, very common in folk and gospel.', 4),
    P('Interrupted cadence', ['V7', 'vi'], 'Cadences', 'Promises I and delivers the relative minor.', 4),
    P('I-vi-ii-V turnaround', ['I', 'vi', 'ii', 'V'], 'Cadences', 'The standard turnaround, in one bar or four.', 2),
    P('Blues turnaround', ['I7', 'IV7', 'I7', 'V7'], 'Cadences', 'The last two bars of a twelve-bar.', 2),
    P('Descending bass', ['I', 'V', 'vi', 'iii'], 'Cadences', 'The bass walks down by step: I, VII, VI, V.'),

    /* --- modal --- */
    P('Dorian vamp', ['i7', 'IV7'], 'Modal', 'The major IV against a minor i is what dorian sounds like.', 4),
    P('Mixolydian vamp', ['I7', 'bVII'], 'Modal', 'The flat seven, and no leading tone anywhere.', 4),
    P('Lydian vamp', ['Imaj7', 'II'], 'Modal', 'The major II is the raised fourth showing itself.', 4),
    P('Phrygian vamp', ['i', 'bII'], 'Modal', 'Spanish, and immediately recognisable.', 4),
    P('Aeolian loop', ['i', 'bVI', 'bVII', 'i'], 'Modal', 'Natural minor with no dominant at all.'),
    P('Harmonic minor cadence', ['i', 'iv', 'V7', 'i'], 'Modal', 'The raised seventh gives the minor key a real V.')
  ];

  function byGenre() {
    var out = {};
    LIBRARY.forEach(function (p) { (out[p.genre] = out[p.genre] || []).push(p); });
    return out;
  }

  GL.progressions = {
    LIBRARY: LIBRARY,
    parseNumeral: parseNumeral,
    realise: realise,
    analyse: analyse,
    byGenre: byGenre
  };
}(window.GL = window.GL || {}));
