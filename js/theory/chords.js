/* chords.js -- chord spelling, and a search that finds every playable voicing.

   Nothing here is a stored chord chart. Given a symbol like "Bbmaj9" the engine
   works out the notes, walks the fretboard for every combination of frets that
   sounds them, throws away the ones no hand can hold, works out the fingering
   (including barres), scores what is left, and returns the best. Change the
   tuning and the same code answers correctly for DADGAD -- which is why the
   alternate-tunings track needs no special cases.

   Fret arrays are always six entries, LOW string first: -1 mutes, 0 is open.
*/
(function (GL) {
  'use strict';

  var notes = GL.notes;
  var mod12 = notes.mod12;

  /* ------------------------------------------------------------- qualities */

  /* `iv`  the full set of intervals from the root
     `req` the notes a voicing MUST contain to still be this chord. The 5th is
           nearly always droppable; the 3rd and 7th almost never are, because
           they are what tell major from minor and 6th from 7th. */
  var QUALITIES = {
    '5':       { name: 'power chord',      iv: [0, 7],               req: [0, 7],        cat: 'power' },
    'maj':     { name: 'major',            iv: [0, 4, 7],            req: [0, 4],        cat: 'triad' },
    'm':       { name: 'minor',            iv: [0, 3, 7],            req: [0, 3],        cat: 'triad' },
    'dim':     { name: 'diminished',       iv: [0, 3, 6],            req: [0, 3, 6],     cat: 'triad' },
    'aug':     { name: 'augmented',        iv: [0, 4, 8],            req: [0, 4, 8],     cat: 'triad' },
    'sus2':    { name: 'suspended 2nd',    iv: [0, 2, 7],            req: [0, 2, 7],     cat: 'sus' },
    'sus4':    { name: 'suspended 4th',    iv: [0, 5, 7],            req: [0, 5, 7],     cat: 'sus' },
    '6':       { name: 'major 6th',        iv: [0, 4, 7, 9],         req: [0, 4, 9],     cat: 'sixth' },
    'm6':      { name: 'minor 6th',        iv: [0, 3, 7, 9],         req: [0, 3, 9],     cat: 'sixth' },
    '69':      { name: 'six nine',         iv: [0, 4, 7, 9, 14],     req: [0, 4, 9, 2],  cat: 'sixth' },
    '7':       { name: 'dominant 7th',     iv: [0, 4, 7, 10],        req: [0, 4, 10],    cat: 'seventh' },
    'maj7':    { name: 'major 7th',        iv: [0, 4, 7, 11],        req: [0, 4, 11],    cat: 'seventh' },
    'm7':      { name: 'minor 7th',        iv: [0, 3, 7, 10],        req: [0, 3, 10],    cat: 'seventh' },
    'mMaj7':   { name: 'minor major 7th',  iv: [0, 3, 7, 11],        req: [0, 3, 11],    cat: 'seventh' },
    'm7b5':    { name: 'half-diminished',  iv: [0, 3, 6, 10],        req: [0, 3, 6, 10], cat: 'seventh' },
    'dim7':    { name: 'diminished 7th',   iv: [0, 3, 6, 9],         req: [0, 3, 6, 9],  cat: 'seventh' },
    '7sus4':   { name: 'dominant 7 sus4',  iv: [0, 5, 7, 10],        req: [0, 5, 10],    cat: 'sus' },
    /* The chord on the third degree of harmonic minor. Rare as a written
       symbol, unavoidable if the harmoniser is to name every degree. */
    'maj7#5':  { name: 'augmented major 7th', iv: [0, 4, 8, 11],     req: [0, 4, 8, 11], cat: 'altered' },
    '7b5':     { name: 'dominant 7 flat 5', iv: [0, 4, 6, 10],       req: [0, 4, 6, 10], cat: 'altered' },
    '7#5':     { name: 'dominant 7 sharp 5', iv: [0, 4, 8, 10],      req: [0, 4, 8, 10], cat: 'altered' },
    'add9':    { name: 'add 9',            iv: [0, 4, 7, 14],        req: [0, 4, 2],     cat: 'added' },
    'madd9':   { name: 'minor add 9',      iv: [0, 3, 7, 14],        req: [0, 3, 2],     cat: 'added' },
    'add11':   { name: 'add 11',           iv: [0, 4, 7, 17],        req: [0, 4, 5],     cat: 'added' },
    '9':       { name: 'dominant 9th',     iv: [0, 4, 7, 10, 14],    req: [0, 4, 10, 2], cat: 'extended' },
    'maj9':    { name: 'major 9th',        iv: [0, 4, 7, 11, 14],    req: [0, 4, 11, 2], cat: 'extended' },
    'm9':      { name: 'minor 9th',        iv: [0, 3, 7, 10, 14],    req: [0, 3, 10, 2], cat: 'extended' },
    '9sus4':   { name: 'dominant 9 sus4',  iv: [0, 5, 7, 10, 14],    req: [0, 5, 10, 2], cat: 'sus' },
    '11':      { name: 'dominant 11th',    iv: [0, 7, 10, 14, 17],   req: [0, 10, 5],    cat: 'extended' },
    'm11':     { name: 'minor 11th',       iv: [0, 3, 7, 10, 14, 17], req: [0, 3, 10, 5], cat: 'extended' },
    '13':      { name: 'dominant 13th',    iv: [0, 4, 7, 10, 14, 21], req: [0, 4, 10, 9], cat: 'extended' },
    'm13':     { name: 'minor 13th',       iv: [0, 3, 7, 10, 14, 21], req: [0, 3, 10, 9], cat: 'extended' },
    'maj13':   { name: 'major 13th',       iv: [0, 4, 7, 11, 14, 21], req: [0, 4, 11, 9], cat: 'extended' },
    '7b9':     { name: 'dominant 7 flat 9', iv: [0, 4, 7, 10, 13],   req: [0, 4, 10, 1], cat: 'altered' },
    '7#9':     { name: 'dominant 7 sharp 9', iv: [0, 4, 7, 10, 15],  req: [0, 4, 10, 3], cat: 'altered' },
    '7#11':    { name: 'dominant 7 sharp 11', iv: [0, 4, 7, 10, 18], req: [0, 4, 10, 6], cat: 'altered' },
    'maj7#11': { name: 'major 7 sharp 11', iv: [0, 4, 7, 11, 18],    req: [0, 4, 11, 6], cat: 'altered' }
  };

  /* Written forms people actually type, longest first so 'maj7' wins over 'maj'. */
  var ALIASES = [
    ['maj7#11', 'maj7#11'], ['M7#11', 'maj7#11'], ['maj7+11', 'maj7#11'],
    ['maj7#5', 'maj7#5'], ['M7#5', 'maj7#5'], ['maj7+5', 'maj7#5'], ['+maj7', 'maj7#5'],
    ['mmaj7', 'mMaj7'], ['minmaj7', 'mMaj7'], ['mM7', 'mMaj7'], ['-maj7', 'mMaj7'],
    ['maj13', 'maj13'], ['M13', 'maj13'],
    ['maj9', 'maj9'], ['M9', 'maj9'],
    ['maj7', 'maj7'], ['M7', 'maj7'], ['ma7', 'maj7'], ['j7', 'maj7'],
    ['9sus4', '9sus4'], ['9sus', '9sus4'],
    ['7sus4', '7sus4'], ['7sus', '7sus4'],
    ['7b13', '7#5'], ['7#11', '7#11'], ['7b9', '7b9'], ['7#9', '7#9'],
    ['7b5', '7b5'], ['7#5', '7#5'], ['7+5', '7#5'], ['7alt', '7#9'],
    ['m7b5', 'm7b5'], ['min7b5', 'm7b5'], ['m7-5', 'm7b5'], ['halfdim', 'm7b5'],
    ['dim7', 'dim7'], ['m11', 'm11'], ['m13', 'm13'], ['m9', 'm9'], ['m7', 'm7'], ['m6', 'm6'],
    ['min7', 'm7'], ['min9', 'm9'], ['min6', 'm6'], ['min11', 'm11'],
    ['madd9', 'madd9'], ['madd2', 'madd9'],
    ['add11', 'add11'], ['add9', 'add9'], ['add2', 'add9'],
    ['sus2', 'sus2'], ['sus4', 'sus4'], ['sus', 'sus4'],
    ['dim', 'dim'], ['aug', 'aug'],
    ['6/9', '69'], ['69', '69'],
    ['13', '13'], ['11', '11'], ['9', '9'], ['7', '7'], ['6', '6'], ['5', '5'],
    ['min', 'm'], ['m', 'm'], ['-', 'm'],
    ['major', 'maj'], ['maj', 'maj'], ['M', 'maj'],
    ['o', 'dim'], ['+', 'aug'], ['', 'maj']
  ];

  /* 'F#m7b5/A' -> { root:'F#', rootPc:6, quality:'m7b5', bass:'A', bassPc:9 } */
  function parse(symbol) {
    if (!symbol) return null;
    var s = String(symbol).trim();
    var bass = null;
    var slash = s.lastIndexOf('/');
    /* Careful: '6/9' contains a slash that is not a bass note. */
    if (slash > 0 && /^[A-Ga-g][#b]*$/.test(s.slice(slash + 1))) {
      bass = s.slice(slash + 1);
      s = s.slice(0, slash);
    }
    var rootMatch = s.match(/^([A-Ga-g][#b]*)/);
    if (!rootMatch) return null;
    var rootName = rootMatch[1].charAt(0).toUpperCase() + rootMatch[1].slice(1);
    var rest = s.slice(rootMatch[1].length);

    var quality = null;
    for (var i = 0; i < ALIASES.length; i++) {
      if (rest === ALIASES[i][0]) { quality = ALIASES[i][1]; break; }
    }
    if (quality === null) return null;

    var bassPc = bass ? notes.noteToPc(bass) : null;
    return {
      root: rootName,
      rootPc: notes.noteToPc(rootName),
      quality: quality,
      bass: bass,
      bassPc: bassPc,
      symbol: rootName + displaySuffix(quality) + (bass ? '/' + bass : '')
    };
  }

  function displaySuffix(quality) {
    return quality === 'maj' ? '' : quality;
  }

  function symbolOf(rootName, quality, bass) {
    return rootName + displaySuffix(quality) + (bass ? '/' + bass : '');
  }

  /* Pitch classes the chord contains. */
  function pitchClasses(chord) {
    var q = QUALITIES[chord.quality];
    if (!q) return [];
    var set = q.iv.map(function (iv) { return mod12(chord.rootPc + iv); });
    if (chord.bassPc !== null && chord.bassPc !== undefined && set.indexOf(chord.bassPc) === -1) {
      set.push(chord.bassPc);
    }
    return set.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  /* Note names, spelled for the chord's own root. */
  function noteNames(chord) {
    var q = QUALITIES[chord.quality];
    if (!q) return [];
    var key = /m|dim/.test(chord.quality) ? chord.root + 'm' : chord.root;
    return q.iv.map(function (iv) { return notes.pcName(chord.rootPc + iv, key); });
  }

  /* Degree label ('b7', '9') for a pitch class within this chord. */
  function degreeOf(chord, pc) {
    var q = QUALITIES[chord.quality];
    if (!q) return '';
    var rel = mod12(pc - chord.rootPc);
    /* Prefer the written extension: a 9th is a 9, not a 2. */
    for (var i = 0; i < q.iv.length; i++) {
      if (mod12(q.iv[i]) === rel) return notes.intervalShort(q.iv[i]);
    }
    return notes.intervalShort(rel);
  }

  /* ------------------------------------------------------------- fingering */

  /* Work out which finger goes where, detecting barres.
     Returns null when no hand could hold the shape. */
  function fingering(frets) {
    var fretted = [];
    for (var i = 0; i < 6; i++) {
      if (frets[i] > 0) fretted.push(i);
    }
    if (!fretted.length) return { fingers: [0, 0, 0, 0, 0, 0], barres: [], count: 0 };

    /* Group strings by fret, low fret first: fingers land in that order. */
    var byFret = {};
    fretted.forEach(function (si) {
      (byFret[frets[si]] = byFret[frets[si]] || []).push(si);
    });
    var levels = Object.keys(byFret).map(Number).sort(function (a, b) { return a - b; });

    var fingers = [0, 0, 0, 0, 0, 0];
    var barres = [];
    var next = 1;

    for (var L = 0; L < levels.length; L++) {
      var f = levels[L];
      var group = byFret[f];
      var barred = false;

      if (group.length >= 2) {
        var lo = Math.min.apply(null, group);
        var hi = Math.max.apply(null, group);
        /* A barre flattens everything it crosses. Any string in between that is
           open, or fretted BEHIND the barre, would be silenced or re-pitched. */
        barred = true;
        for (var s = lo + 1; s < hi; s++) {
          if (frets[s] >= 0 && frets[s] < f) { barred = false; break; }
        }
        if (barred) {
          if (next > 4) return null;
          group.forEach(function (si) { fingers[si] = next; });
          barres.push({ fret: f, from: lo, to: hi, finger: next });
          next++;
        }
      }

      if (!barred) {
        /* One finger per string at this fret. */
        for (var k = 0; k < group.length; k++) {
          if (next > 4) return null;
          fingers[group[k]] = next;
          next++;
        }
      }
    }
    return { fingers: fingers, barres: barres, count: next - 1 };
  }

  /* ---------------------------------------------------------------- search */

  /* The open-position shapes every guitarist already has in their hands. These
     are not a chord dictionary -- the search below still generates every
     voicing from scratch, including all of these. They exist only to break
     ties, because "the standard shape" is a fact about players, not about
     music, and no scoring rule can derive it. Nothing here is required for a
     chord to be found: alternate tunings match none of it and work fine. */
  var CANONICAL = {};
  [
    /* C forms */      '-1,3,2,0,1,0', '-1,3,2,0,0,0', '-1,3,2,3,1,0', '-1,3,2,0,3,3', '-1,3,5,5,5,3',
    /* A forms */      '-1,0,2,2,2,0', '-1,0,2,2,1,0', '-1,0,2,0,2,0', '-1,0,2,0,1,0',
                       '-1,0,2,1,2,0', '-1,0,2,2,0,0', '-1,0,2,2,3,0', '-1,0,2,4,2,0',
    /* G forms */      '3,2,0,0,0,3', '3,2,0,0,3,3', '3,2,0,0,0,1', '3,2,0,0,0,2', '3,2,0,0,0,0', '-1,2,0,0,0,3',
    /* E forms */      '0,2,2,1,0,0', '0,2,2,0,0,0', '0,2,0,1,0,0', '0,2,0,0,0,0',
                       '0,2,1,1,0,0', '0,2,2,2,0,0', '0,2,4,2,0,0',
    /* D forms */      '-1,-1,0,2,3,2', '-1,-1,0,2,3,1', '-1,-1,0,2,1,2', '-1,-1,0,2,1,1',
                       '-1,-1,0,2,2,2', '-1,-1,0,2,3,0', '-1,-1,0,2,3,3',
    /* F and barres */ '1,3,3,2,1,1', '-1,-1,3,2,1,1', '-1,-1,3,2,1,0', '1,3,3,2,1,0',
                       '-1,2,4,4,3,2', '-1,2,4,4,2,2', '-1,2,0,2,0,2', '-1,2,1,2,0,2',
                       '-1,1,3,3,3,1', '-1,1,3,1,2,1', '-1,1,3,3,2,1'
  ].forEach(function (k) { CANONICAL[k] = true; });

  function span(frets) {
    var lo = 99, hi = 0, any = false;
    for (var i = 0; i < 6; i++) {
      if (frets[i] > 0) { lo = Math.min(lo, frets[i]); hi = Math.max(hi, frets[i]); any = true; }
    }
    return any ? hi - lo : 0;
  }

  function baseFretOf(frets) {
    var lo = 99;
    for (var i = 0; i < 6; i++) if (frets[i] > 0) lo = Math.min(lo, frets[i]);
    return lo === 99 ? 0 : lo;
  }

  /* Muted strings with sounding strings on both sides. Playable, but they have
     to be deadened with the fretting hand, so they cost the shape points. */
  function innerMutes(frets) {
    var first = -1, last = -1, n = 0;
    for (var i = 0; i < 6; i++) {
      if (frets[i] >= 0) { if (first < 0) first = i; last = i; }
    }
    for (var j = first; j <= last; j++) if (frets[j] < 0) n++;
    return n;
  }

  /* Find playable voicings for a chord.
       tuning      six MIDI numbers, low string first
       maxFret     highest fret to search (default 14)
       minFret     lowest fretted fret to allow (default 0)
       maxSpan     fret stretch the hand will accept (default 4)
       minStrings  fewest sounding strings (default 3, or 2 for power chords)
       requireRootBass  reject inversions
       limit       how many to return (default 12)
  */
  function voicings(input, opts) {
    var chord = typeof input === 'string' ? parse(input) : input;
    if (!chord) return [];
    opts = opts || {};

    var q = QUALITIES[chord.quality];
    if (!q) return [];

    var tuning = opts.tuning || notes.TUNINGS.standard.strings;
    var maxFret = opts.maxFret === undefined ? 14 : opts.maxFret;
    var minFret = opts.minFret === undefined ? 0 : opts.minFret;
    var maxSpan = opts.maxSpan === undefined ? 4 : opts.maxSpan;
    var limit = opts.limit === undefined ? 12 : opts.limit;
    var minStrings = opts.minStrings === undefined
      ? (chord.quality === '5' ? 2 : 3) : opts.minStrings;

    var pcs = pitchClasses(chord);
    var reqPcs = q.req.map(function (iv) { return mod12(chord.rootPc + iv); });
    var wantBassPc = (chord.bassPc === null || chord.bassPc === undefined)
      ? chord.rootPc : chord.bassPc;

    /* Candidate frets per string: mute, plus every fret sounding a chord tone. */
    var options = [];
    for (var si = 0; si < 6; si++) {
      var list = [-1];
      for (var f = 0; f <= maxFret; f++) {
        if (f > 0 && f < minFret) continue;
        if (pcs.indexOf(mod12(tuning[si] + f)) !== -1) list.push(f);
      }
      options.push(list);
    }

    var results = [];
    var current = [0, 0, 0, 0, 0, 0];

    (function walk(si, lo, hi) {
      if (si === 6) {
        evaluate(current.slice());
        return;
      }
      var list = options[si];
      for (var k = 0; k < list.length; k++) {
        var f = list[k];
        var nlo = lo, nhi = hi;
        if (f > 0) {
          nlo = Math.min(lo, f);
          nhi = Math.max(hi, f);
          if (nhi - nlo > maxSpan) continue;   /* prune: hand cannot reach */
        }
        current[si] = f;
        walk(si + 1, nlo, nhi);
      }
      current[si] = 0;
    }(0, 99, 0));

    function evaluate(frets) {
      var sounding = [];
      for (var i = 0; i < 6; i++) if (frets[i] >= 0) sounding.push(i);
      if (sounding.length < minStrings) return;

      var got = sounding.map(function (i) { return mod12(tuning[i] + frets[i]); });
      for (var r = 0; r < reqPcs.length; r++) {
        if (got.indexOf(reqPcs[r]) === -1) return;
      }

      var bassPc = mod12(tuning[sounding[0]] + frets[sounding[0]]);
      var rootInBass = bassPc === wantBassPc;
      if (opts.requireRootBass && !rootInBass) return;

      var inner = innerMutes(frets);
      if (inner > 1) return;

      var fing = fingering(frets);
      if (!fing) return;

      var sp = span(frets);
      var base = baseFretOf(frets);
      var opens = frets.filter(function (f) { return f === 0; }).length;
      var complete = pcs.every(function (pc) { return got.indexOf(pc) !== -1; });

      /* Voices, low to high. Several playability rules read off this. */
      var voices = sounding.map(function (i) { return tuning[i] + frets[i]; });

      /* Crossed voices: a string sounding LOWER than the string below it. The
         search turns up hundreds of these -- things like 0-7-0-0-0-0 for Em7 --
         because they do contain the right notes. They are rejected outright
         rather than scored down: a chord library that offers them is wrong even
         at rank ten. (Deliberate crossed voicings are a fingerstyle arranging
         device; they belong in a written arrangement, not a chord lookup.) */
      var wideGaps = 0;
      for (var vi = 1; vi < voices.length; vi++) {
        if (voices[vi] < voices[vi - 1]) return;
        /* A gap wider than a fifth in the middle of a chord sounds hollow.
           Between the top two voices it is normal, so it is not counted. */
        if (vi < voices.length - 1 && voices[vi] - voices[vi - 1] > 7) wideGaps++;
      }

      /* Score is a playability judgement, not music theory: how likely is a
         real player to reach for this shape? */
      var score = 0;
      score += rootInBass ? 4 : 0;
      score += sounding.length * 1.4;
      score += opens * 0.6;
      score += complete ? 1.5 : 0;
      score -= sp * 0.9;
      score -= base * 0.3;
      score -= inner * 3.0;
      score -= fing.count * 0.55;
      score -= wideGaps * 1.2;
      /* Open strings ringing while the hand is up at the 9th fret is a
         different sound, not a convenient version of the same chord. */
      if (opens > 0 && base > 4) score -= (base - 4) * 1.2;
      if (fing.barres.length === 0 && fing.count <= 3) score += 1.6;
      if (fing.barres.length && fing.barres[0].to - fing.barres[0].from === 5) score -= 0.4;
      /* The shapes that are simply what this chord looks like. The search finds
         them on its own, but so does it find forty near-misses that score
         within a point -- this is the thumb on the scale that says "this is the
         one you were taught". Every other voicing is still returned. */
      if (CANONICAL[frets.join(',')]) score += 6;

      results.push({
        frets: frets,
        fingers: fing.fingers,
        barres: fing.barres,
        fingerCount: fing.count,
        baseFret: base,
        span: sp,
        rootInBass: rootInBass,
        complete: complete,
        strings: sounding.length,
        midi: sounding.map(function (i) { return tuning[i] + frets[i]; }),
        caged: cagedForm(frets, chord),
        score: score
      });
    }

    results.sort(function (a, b) { return b.score - a.score; });

    /* Spread the answers up the neck. Twelve variants of the same open shape
       are useless; one good shape per position is what a player wants. */
    var seenPosition = {};
    var picked = [];
    var seenFrets = {};
    results.forEach(function (v) {
      var key = v.frets.join(',');
      if (seenFrets[key]) return;
      seenFrets[key] = 1;
      var zone = Math.floor(v.baseFret / 2);
      seenPosition[zone] = (seenPosition[zone] || 0) + 1;
      if (seenPosition[zone] <= 2) picked.push(v);
    });
    /* Backfill from the overall ranking if the spread left us short. */
    results.forEach(function (v) {
      if (picked.length >= limit) return;
      if (picked.indexOf(v) === -1) picked.push(v);
    });

    return picked.slice(0, limit);
  }

  /* ----------------------------------------------------------------- CAGED */

  /* The five open forms every barre shape is a moved version of. Stored as
     fret patterns relative to the lowest fretted note. */
  var CAGED_TEMPLATES = [
    { form: 'E', quality: 'maj',  rel: [0, 2, 2, 1, 0, 0] },
    { form: 'E', quality: 'm',    rel: [0, 2, 2, 0, 0, 0] },
    { form: 'E', quality: '7',    rel: [0, 2, 0, 1, 0, 0] },
    { form: 'E', quality: 'm7',   rel: [0, 2, 0, 0, 0, 0] },
    { form: 'E', quality: 'maj7', rel: [0, 2, 1, 1, 0, 0] },
    { form: 'A', quality: 'maj',  rel: [-1, 0, 2, 2, 2, 0] },
    { form: 'A', quality: 'm',    rel: [-1, 0, 2, 2, 1, 0] },
    { form: 'A', quality: '7',    rel: [-1, 0, 2, 0, 2, 0] },
    { form: 'A', quality: 'm7',   rel: [-1, 0, 2, 0, 1, 0] },
    { form: 'A', quality: 'maj7', rel: [-1, 0, 2, 1, 2, 0] },
    { form: 'D', quality: 'maj',  rel: [-1, -1, 0, 2, 3, 2] },
    { form: 'D', quality: 'm',    rel: [-1, -1, 0, 2, 3, 1] },
    { form: 'D', quality: '7',    rel: [-1, -1, 0, 2, 1, 2] },
    { form: 'D', quality: 'm7',   rel: [-1, -1, 0, 2, 1, 1] },
    { form: 'C', quality: 'maj',  rel: [-1, 3, 2, 0, 1, 0] },
    { form: 'C', quality: '7',    rel: [-1, 3, 2, 3, 1, 0] },
    { form: 'C', quality: 'maj7', rel: [-1, 3, 2, 0, 0, 0] },
    { form: 'G', quality: 'maj',  rel: [3, 2, 0, 0, 0, 3] },
    { form: 'G', quality: '7',    rel: [3, 2, 0, 0, 0, 1] }
  ];

  /* Which open form is this shape a moved copy of?

     The normalisation has to include open strings, not just fretted ones: under
     a barre, what was an open string becomes a note at the barre fret. Measure
     from the lowest SOUNDING fret and an open E shape and an F barre come out
     as the same pattern, which is the whole point of CAGED. */
  function cagedForm(frets, chord) {
    var sounding = frets.filter(function (f) { return f >= 0; });
    if (!sounding.length) return null;
    var base = Math.min.apply(null, sounding);
    var rel = frets.map(function (f) { return f < 0 ? -1 : f - base; });

    for (var i = 0; i < CAGED_TEMPLATES.length; i++) {
      var t = CAGED_TEMPLATES[i];
      if (chord && t.quality !== chord.quality) continue;
      var match = true;
      var exact = 0;
      for (var s = 0; s < 6; s++) {
        var a = rel[s], b = t.rel[s];
        if (a === b) { exact++; continue; }
        /* A string left out is still the same form -- players drop the low E
           from an A-form barre all the time. A string at a different fret is
           a different shape. */
        if (a === -1 || b === -1) continue;
        match = false;
        break;
      }
      if (match && exact >= 3) return t.form;
    }
    return null;
  }

  /* All twelve roots of one quality -- feeds the chord library's grid view. */
  function family(quality, opts) {
    return notes.SHARP_NAMES.map(function (root, pc) {
      var name = notes.pcName(pc, root);
      return { root: name, symbol: symbolOf(name, quality), voicings: voicings(name + (quality === 'maj' ? '' : quality), opts) };
    });
  }

  GL.chords = {
    QUALITIES: QUALITIES,
    CAGED_TEMPLATES: CAGED_TEMPLATES,
    parse: parse,
    symbolOf: symbolOf,
    displaySuffix: displaySuffix,
    pitchClasses: pitchClasses,
    noteNames: noteNames,
    degreeOf: degreeOf,
    fingering: fingering,
    voicings: voicings,
    cagedForm: cagedForm,
    family: family,
    baseFretOf: baseFretOf,
    span: span
  };
}(window.GL = window.GL || {}));
