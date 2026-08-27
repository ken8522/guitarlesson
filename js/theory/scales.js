/* scales.js -- scale and mode tables, fretboard mapping, playing positions,
   and diatonic harmony.

   Like chords.js, none of this is stored per key. There is one interval table
   per scale, and every neck diagram in the app is computed from it. That is
   how the scale library covers 45 scales in 12 keys in 11 tunings without
   holding a single diagram in memory.
*/
(function (GL) {
  'use strict';

  var notes = GL.notes;
  var mod12 = notes.mod12;

  /* ----------------------------------------------------------------- table */

  var SCALES = {
    /* --- the major scale and its modes --- */
    major:            { name: 'Major (Ionian)',        iv: [0, 2, 4, 5, 7, 9, 11], cat: 'Major modes', mood: 'Bright, resolved, the reference point for everything else.' },
    dorian:           { name: 'Dorian',                iv: [0, 2, 3, 5, 7, 9, 10], cat: 'Major modes', mood: 'Minor with a raised 6th. Hopeful minor -- Celtic tunes and modal folk live here.' },
    phrygian:         { name: 'Phrygian',              iv: [0, 1, 3, 5, 7, 8, 10], cat: 'Major modes', mood: 'Minor with a flat 2nd. Spanish, dark, tense.' },
    lydian:           { name: 'Lydian',                iv: [0, 2, 4, 6, 7, 9, 11], cat: 'Major modes', mood: 'Major with a sharp 4th. Floating, unresolved, cinematic.' },
    mixolydian:       { name: 'Mixolydian',            iv: [0, 2, 4, 5, 7, 9, 10], cat: 'Major modes', mood: 'Major with a flat 7th. The sound of the folk, blues and country dominant.' },
    aeolian:          { name: 'Natural minor (Aeolian)', iv: [0, 2, 3, 5, 7, 8, 10], cat: 'Major modes', mood: 'The plain minor scale.' },
    locrian:          { name: 'Locrian',               iv: [0, 1, 3, 5, 6, 8, 10], cat: 'Major modes', mood: 'Flat 2nd and flat 5th. No stable home; used over m7b5.' },

    /* --- pentatonics and blues --- */
    majorPentatonic:  { name: 'Major pentatonic',      iv: [0, 2, 4, 7, 9],        cat: 'Pentatonic', mood: 'The major scale with the two notes that can clash removed.' },
    minorPentatonic:  { name: 'Minor pentatonic',      iv: [0, 3, 5, 7, 10],       cat: 'Pentatonic', mood: 'The workhorse. Five notes that fit almost any minor or blues context.' },
    bluesMinor:       { name: 'Minor blues',           iv: [0, 3, 5, 6, 7, 10],    cat: 'Pentatonic', mood: 'Minor pentatonic plus the flat 5 -- the blue note.' },
    bluesMajor:       { name: 'Major blues',           iv: [0, 2, 3, 4, 7, 9],     cat: 'Pentatonic', mood: 'Major pentatonic plus the flat 3. Country and swing blues.' },
    suspendedPent:    { name: 'Suspended pentatonic',  iv: [0, 2, 5, 7, 10],       cat: 'Pentatonic', mood: 'Also called Egyptian. Open, no thirds, ambiguous.' },
    manGong:          { name: 'Man gong',              iv: [0, 3, 5, 8, 10],       cat: 'Pentatonic', mood: 'The darkest rotation of the pentatonic set.' },
    ritusen:          { name: 'Ritusen',               iv: [0, 2, 5, 7, 9],        cat: 'Pentatonic', mood: 'Japanese folk pentatonic, gentle and unresolved.' },

    /* --- harmonic minor and its useful modes --- */
    harmonicMinor:    { name: 'Harmonic minor',        iv: [0, 2, 3, 5, 7, 8, 11], cat: 'Harmonic minor', mood: 'Natural minor with a raised 7th, giving a real dominant chord.' },
    phrygianDominant: { name: 'Phrygian dominant',     iv: [0, 1, 4, 5, 7, 8, 10], cat: 'Harmonic minor', mood: 'Fifth mode of harmonic minor. Flamenco, klezmer, Middle Eastern.' },
    lydianSharp2:     { name: 'Lydian #2',             iv: [0, 3, 4, 6, 7, 9, 11], cat: 'Harmonic minor', mood: 'Sixth mode. Exotic major with a wide opening leap.' },
    ukrainianDorian:  { name: 'Ukrainian Dorian',      iv: [0, 2, 3, 6, 7, 9, 10], cat: 'Harmonic minor', mood: 'Dorian with a sharp 4th. Eastern European folk.' },
    superLocrianbb7:  { name: 'Altered diminished',    iv: [0, 1, 3, 4, 6, 8, 9],  cat: 'Harmonic minor', mood: 'Seventh mode of harmonic minor, used over dim7.' },

    /* --- melodic minor and its modes --- */
    melodicMinor:     { name: 'Melodic minor',         iv: [0, 2, 3, 5, 7, 9, 11], cat: 'Melodic minor', mood: 'Minor third with major 6th and 7th. Smooth ascending minor.' },
    dorianb2:         { name: 'Dorian b2',             iv: [0, 1, 3, 5, 7, 9, 10], cat: 'Melodic minor', mood: 'Second mode. Dark but with a major 6th.' },
    lydianAugmented:  { name: 'Lydian augmented',      iv: [0, 2, 4, 6, 8, 9, 11], cat: 'Melodic minor', mood: 'Third mode. Weightless, no perfect fifth.' },
    lydianDominant:   { name: 'Lydian dominant',       iv: [0, 2, 4, 6, 7, 9, 10], cat: 'Melodic minor', mood: 'Fourth mode. The sound over a 7#11 -- bluesy and bright at once.' },
    mixolydianb6:     { name: 'Mixolydian b6',         iv: [0, 2, 4, 5, 7, 8, 10], cat: 'Melodic minor', mood: 'Fifth mode. A dominant that wants to fall.' },
    locrianSharp2:    { name: 'Locrian #2',            iv: [0, 2, 3, 5, 6, 8, 10], cat: 'Melodic minor', mood: 'Sixth mode. The usual choice over m7b5.' },
    altered:          { name: 'Altered (super locrian)', iv: [0, 1, 3, 4, 6, 8, 10], cat: 'Melodic minor', mood: 'Seventh mode. Every tension a dominant can carry.' },

    /* --- symmetrical --- */
    wholeTone:        { name: 'Whole tone',            iv: [0, 2, 4, 6, 8, 10],    cat: 'Symmetrical', mood: 'Six equal steps. No leading tone, no gravity.' },
    dimHalfWhole:     { name: 'Diminished (half-whole)', iv: [0, 1, 3, 4, 6, 7, 9, 10], cat: 'Symmetrical', mood: 'Over dominant 7 chords with b9 and #9.' },
    dimWholeHalf:     { name: 'Diminished (whole-half)', iv: [0, 2, 3, 5, 6, 8, 9, 11], cat: 'Symmetrical', mood: 'Over diminished 7 chords.' },
    chromatic:        { name: 'Chromatic',             iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], cat: 'Symmetrical', mood: 'All twelve. For technique and passing tones.' },
    augmentedScale:   { name: 'Augmented',             iv: [0, 3, 4, 7, 8, 11],    cat: 'Symmetrical', mood: 'Alternating minor thirds and semitones.' },

    /* --- bebop: seven-note scales with a passing tone added --- */
    bebopDominant:    { name: 'Bebop dominant',        iv: [0, 2, 4, 5, 7, 9, 10, 11], cat: 'Bebop', mood: 'Mixolydian plus a natural 7 so chord tones land on the beat.' },
    bebopMajor:       { name: 'Bebop major',           iv: [0, 2, 4, 5, 7, 8, 9, 11], cat: 'Bebop', mood: 'Major with an added #5 passing tone.' },
    bebopDorian:      { name: 'Bebop dorian',          iv: [0, 2, 3, 4, 5, 7, 9, 10], cat: 'Bebop', mood: 'Dorian with an added natural 3rd.' },
    bebopMelodicMinor:{ name: 'Bebop melodic minor',   iv: [0, 2, 3, 5, 7, 8, 9, 11], cat: 'Bebop', mood: 'Melodic minor with an added b6.' },

    /* --- world and exotic --- */
    harmonicMajor:    { name: 'Harmonic major',        iv: [0, 2, 4, 5, 7, 8, 11], cat: 'World', mood: 'Major with a flat 6th. Bittersweet.' },
    doubleHarmonic:   { name: 'Double harmonic (Byzantine)', iv: [0, 1, 4, 5, 7, 8, 11], cat: 'World', mood: 'Two augmented seconds. Arabic and Balkan music.' },
    hungarianMinor:   { name: 'Hungarian minor',       iv: [0, 2, 3, 6, 7, 8, 11], cat: 'World', mood: 'Harmonic minor with a sharp 4th.' },
    hungarianMajor:   { name: 'Hungarian major',       iv: [0, 3, 4, 6, 7, 9, 10], cat: 'World', mood: 'Bright and jagged, built on a diminished framework.' },
    neapolitanMinor:  { name: 'Neapolitan minor',      iv: [0, 1, 3, 5, 7, 8, 11], cat: 'World', mood: 'Harmonic minor with a flat 2nd.' },
    neapolitanMajor:  { name: 'Neapolitan major',      iv: [0, 1, 3, 5, 7, 9, 11], cat: 'World', mood: 'Melodic minor with a flat 2nd.' },
    persian:          { name: 'Persian',               iv: [0, 1, 4, 5, 6, 8, 11], cat: 'World', mood: 'Two augmented seconds and a flat 5th.' },
    enigmatic:        { name: 'Enigmatic',             iv: [0, 1, 4, 6, 8, 10, 11], cat: 'World', mood: 'Verdi built this one as a puzzle. It still sounds like one.' },
    hirajoshi:        { name: 'Hirajoshi',             iv: [0, 2, 3, 7, 8],        cat: 'World', mood: 'Japanese koto tuning. Five notes, two semitones.' },
    inSen:            { name: 'In sen',                iv: [0, 1, 5, 7, 10],       cat: 'World', mood: 'Japanese, spare and shadowy.' },
    iwato:            { name: 'Iwato',                 iv: [0, 1, 5, 6, 10],       cat: 'World', mood: 'Japanese, built from fourths and semitones.' },
    kumoi:            { name: 'Kumoi',                 iv: [0, 2, 3, 7, 9],        cat: 'World', mood: 'Japanese pentatonic with a major 6th.' },
    yo:               { name: 'Yo',                    iv: [0, 2, 5, 7, 9],        cat: 'World', mood: 'Japanese folk scale with no semitones.' },
    prometheus:       { name: 'Prometheus',            iv: [0, 2, 4, 6, 9, 10],    cat: 'World', mood: 'Scriabin mystic chord as a scale.' },
    algerian:         { name: 'Algerian',              iv: [0, 2, 3, 6, 7, 8, 11], cat: 'World', mood: 'Hungarian minor by another name, with added colour tones.' }
  };

  /* --------------------------------------------------------------- helpers */

  function get(key) { return SCALES[key] || SCALES.major; }

  function pcs(rootName, scaleKey) {
    var rootPc = notes.noteToPc(rootName);
    if (rootPc === null) return [];
    return get(scaleKey).iv.map(function (iv) { return mod12(rootPc + iv); });
  }

  /* Spelled note names. Seven-note scales get proper letter-per-degree
     spelling; everything else falls back to key-aware naming. */
  function noteNames(rootName, scaleKey) {
    var sc = get(scaleKey);
    var minorish = sc.iv.indexOf(3) !== -1 && sc.iv.indexOf(4) === -1;
    return notes.spellScale(rootName, sc.iv, minorish ? rootName + 'm' : rootName);
  }

  function degreeLabels(scaleKey) {
    return get(scaleKey).iv.map(function (iv) { return notes.intervalShort(iv); });
  }

  /* ------------------------------------------------------------- fretboard */

  /* Every place this scale appears on the neck. */
  function onFretboard(rootName, scaleKey, opts) {
    opts = opts || {};
    var tuning = opts.tuning || notes.TUNINGS.standard.strings;
    var maxFret = opts.maxFret === undefined ? 15 : opts.maxFret;
    var minFret = opts.minFret === undefined ? 0 : opts.minFret;
    var rootPc = notes.noteToPc(rootName);
    var sc = get(scaleKey);
    var names = noteNames(rootName, scaleKey);

    var cells = [];
    for (var si = 0; si < 6; si++) {
      for (var f = minFret; f <= maxFret; f++) {
        var pc = mod12(tuning[si] + f);
        var deg = sc.iv.indexOf(mod12(pc - rootPc));
        if (deg === -1) continue;
        cells.push({
          stringIndex: si,
          string: notes.strNumber(si),
          fret: f,
          midi: tuning[si] + f,
          pc: pc,
          degree: deg,
          label: notes.intervalShort(sc.iv[deg]),
          note: names[deg],
          isRoot: deg === 0
        });
      }
    }
    return cells;
  }

  /* Playing positions.

     'box'  five-fret windows anchored on each scale degree found on the lowest
            string -- the CAGED shapes players actually think in.
     '3nps' three notes per string, built by walking the scale upward in pitch
            and handing the next three notes to the next string. */
  function positions(rootName, scaleKey, opts) {
    opts = opts || {};
    var tuning = opts.tuning || notes.TUNINGS.standard.strings;
    var maxFret = opts.maxFret === undefined ? 17 : opts.maxFret;
    var mode = opts.mode || 'box';
    var rootPc = notes.noteToPc(rootName);
    var sc = get(scaleKey);
    var all = onFretboard(rootName, scaleKey, { tuning: tuning, maxFret: maxFret });

    /* Anchor frets: where each scale degree sits on the lowest string. Stop at
       11, or fret 12 repeats the open position and every shape is drawn twice. */
    var anchors = [];
    for (var f = 0; f <= 11; f++) {
      var deg = sc.iv.indexOf(mod12(tuning[0] + f - rootPc));
      if (deg !== -1) anchors.push({ fret: f, degree: deg });
    }

    if (mode === '3nps') {
      return anchors.map(function (a) {
        var seq = ascending(rootPc, sc, tuning[0] + a.fret, 18);
        var cells = [];
        var ok = true;
        for (var si = 0; si < 6; si++) {
          for (var k = 0; k < 3; k++) {
            var midi = seq[si * 3 + k];
            if (midi === undefined) { ok = false; break; }
            var fr = midi - tuning[si];
            /* Notes have to be reachable on their string, and the shape has to
               stay a hand-width wide. */
            if (fr < 0 || fr > maxFret) { ok = false; break; }
            cells.push(cellAt(all, si, fr));
          }
          if (!ok) break;
        }
        cells = cells.filter(Boolean);
        if (!ok || cells.length < 15) return null;
        return finish('3NPS from the ' + ordinal(a.degree + 1) + ' degree', cells, a);
      }).filter(Boolean);
    }

    /* Box positions. */
    return anchors.map(function (a, i) {
      var lo = a.fret;
      var hi = a.fret + 4;
      var cells = all.filter(function (c) { return c.fret >= lo && c.fret <= hi; });
      /* Widen by one fret for any string the window missed entirely -- this is
         what players do when a box does not quite line up. */
      for (var si = 0; si < 6; si++) {
        var has = cells.some(function (c) { return c.stringIndex === si; });
        if (!has) {
          all.forEach(function (c) {
            if (c.stringIndex === si && c.fret >= lo - 1 && c.fret <= hi + 1) cells.push(c);
          });
        }
      }
      if (cells.length < 8) return null;
      return finish('Position ' + (i + 1), cells, a);
    }).filter(Boolean);

    function finish(name, cells, a) {
      var frets = cells.map(function (c) { return c.fret; });
      return {
        name: name,
        anchorDegree: a.degree,
        low: Math.min.apply(null, frets),
        high: Math.max.apply(null, frets),
        cells: cells.slice().sort(function (x, y) {
          return x.stringIndex - y.stringIndex || x.fret - y.fret;
        })
      };
    }
  }

  function cellAt(all, si, fret) {
    for (var i = 0; i < all.length; i++) {
      if (all[i].stringIndex === si && all[i].fret === fret) return all[i];
    }
    return null;
  }

  /* Ascending MIDI notes of the scale starting at or above `fromMidi`. */
  function ascending(rootPc, sc, fromMidi, count) {
    var out = [];
    var m = fromMidi;
    var guard = 0;
    while (out.length < count && guard++ < 200) {
      if (sc.iv.indexOf(mod12(m - rootPc)) !== -1) out.push(m);
      m++;
    }
    return out;
  }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /* ------------------------------------------------------- diatonic harmony */

  /* Reverse lookup from an interval set to a chord quality. */
  var QUALITY_BY_SET = (function () {
    var map = {};
    Object.keys(GL.chords.QUALITIES).forEach(function (q) {
      var iv = GL.chords.QUALITIES[q].iv.map(mod12).sort(function (a, b) { return a - b; });
      var key = iv.join(',');
      /* First writing wins, and the table is ordered simple-to-complex, so
         [0,4,7] resolves to 'maj' rather than something exotic. */
      if (!(key in map)) map[key] = q;
    });
    return map;
  }());

  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  /* Stack thirds on each degree of a seven-note scale.
     Returns the chord on every degree with its roman numeral. */
  function harmonize(rootName, scaleKey, opts) {
    opts = opts || {};
    var sc = get(scaleKey);
    if (sc.iv.length !== 7) return [];
    var size = opts.sevenths ? 4 : 3;
    var names = noteNames(rootName, scaleKey);
    var rootPc = notes.noteToPc(rootName);

    return sc.iv.map(function (_, i) {
      var chordIv = [];
      for (var k = 0; k < size; k++) {
        var idx = (i + k * 2) % 7;
        var octaves = Math.floor((i + k * 2) / 7);
        chordIv.push(sc.iv[idx] + 12 * octaves - sc.iv[i]);
      }
      var setKey = chordIv.map(mod12).sort(function (a, b) { return a - b; }).join(',');
      var quality = QUALITY_BY_SET[setKey] || null;
      var chordRoot = names[i];

      return {
        degree: i + 1,
        root: chordRoot,
        rootPc: mod12(rootPc + sc.iv[i]),
        quality: quality,
        symbol: quality ? GL.chords.symbolOf(chordRoot, quality) : chordRoot + '?',
        numeral: numeralFor(ROMAN[i], quality),
        intervals: chordIv
      };
    });
  }

  function numeralFor(roman, quality) {
    if (!quality) return roman;
    var minorish = /^(m|dim|m6|m7|m9|m11|m13|m7b5|dim7|mMaj7|madd9)$/.test(quality);
    var base = minorish ? roman.toLowerCase() : roman;
    if (quality === 'maj' || quality === 'm') return base;
    if (quality === 'dim') return base + 'o';
    if (quality === 'dim7') return base + 'o7';
    if (quality === 'm7b5') return base + 'm7b5';
    if (quality === 'aug') return base + '+';
    if (quality === 'mMaj7') return base + '(maj7)';
    if (quality === 'maj7#5') return base + 'maj7#5';
    /* Case already carries "minor", so drop only a leading m that means minor
       -- never the one in "maj7". */
    return base + quality.replace(/^m(?!aj)/, '');
  }

  function byCategory() {
    var out = {};
    Object.keys(SCALES).forEach(function (k) {
      var c = SCALES[k].cat;
      (out[c] = out[c] || []).push({ key: k, name: SCALES[k].name, iv: SCALES[k].iv, mood: SCALES[k].mood });
    });
    return out;
  }

  GL.scales = {
    SCALES: SCALES,
    get: get,
    pcs: pcs,
    noteNames: noteNames,
    degreeLabels: degreeLabels,
    onFretboard: onFretboard,
    positions: positions,
    harmonize: harmonize,
    byCategory: byCategory,
    ascending: ascending
  };
}(window.GL = window.GL || {}));
