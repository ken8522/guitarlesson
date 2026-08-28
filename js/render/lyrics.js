/* lyrics.js -- sing-along sheets: chords sitting above the words.

   Songs store lyrics in ChordPro form, which is the format every chord site and
   songbook app uses:

       "[G]Row, row, row your boat, [C]gently down the [G]stream"

   The chord in brackets sounds on the syllable immediately after it. Rendering
   that as plain text with a chord line above only works in a monospace font at
   a fixed width; the moment the line wraps, every chord slides off its word.

   So each chord-and-word pair becomes its own inline block with the chord
   stacked on top, and the browser wraps between pairs. Text is split at word
   boundaries rather than at chord boundaries, so a long stretch of words under
   one chord still wraps on a phone.
*/
(function (GL) {
  'use strict';

  GL.render = GL.render || {};

  var notes = GL.notes;

  /* One line -> [{ chord, text }]. Text before the first bracket has no chord. */
  function parseLine(line) {
    var segments = [];
    var re = /\[([^\]]*)\]/g;
    var pos = 0;
    var chord = null;
    var m;
    while ((m = re.exec(line)) !== null) {
      var text = line.slice(pos, m.index);
      if (chord !== null || text) segments.push({ chord: chord, text: text });
      chord = m[1];
      pos = m.index + m[0].length;
    }
    var tail = line.slice(pos);
    if (chord !== null || tail) segments.push({ chord: chord, text: tail });
    return segments;
  }

  /* Every chord named in a song's lyrics, in order of first appearance. */
  function chordsUsed(song) {
    var seen = {}, out = [];
    (song.lyrics || []).forEach(function (section) {
      section.lines.forEach(function (line) {
        parseLine(line).forEach(function (seg) {
          if (seg.chord && !seen[seg.chord]) { seen[seg.chord] = 1; out.push(seg.chord); }
        });
      });
    });
    return out;
  }

  /* Move a chord symbol by `semitones`, keeping its quality and any slash bass.
     Goes through the chord parser rather than editing the string, so Bbm7b5
     transposes as cleanly as G. */
  function transposeChord(symbol, semitones, preferFlats) {
    if (!semitones) return symbol;
    var c = GL.chords.parse(symbol);
    if (!c) return symbol;
    var table = preferFlats ? notes.FLAT_NAMES : notes.SHARP_NAMES;
    var root = table[notes.mod12(c.rootPc + semitones)];
    var bass = (c.bassPc === null || c.bassPc === undefined)
      ? null : table[notes.mod12(c.bassPc + semitones)];
    return GL.chords.symbolOf(root, c.quality, bass);
  }

  /* The key a song lands in after transposing, so the sheet can label it. */
  function transposeKey(key, semitones, preferFlats) {
    var minor = /m$/.test(key);
    var rootPc = notes.noteToPc(key.replace(/m$/, ''));
    if (rootPc === null) return key;
    var table = preferFlats ? notes.FLAT_NAMES : notes.SHARP_NAMES;
    return table[notes.mod12(rootPc + semitones)] + (minor ? 'm' : '');
  }

  /* Sharp or flat spelling for the transposed key. Guitarists read Bb, not A#. */
  function prefersFlats(key, semitones) {
    var minor = /m$/.test(key);
    var rootPc = notes.noteToPc(key.replace(/m$/, ''));
    if (rootPc === null) return false;
    var pc = notes.mod12(rootPc + semitones);
    /* F, Bb, Eb, Ab, Db and their relative minors read better flat. */
    var flatMajors = [5, 10, 3, 8, 1, 6];
    var flatMinors = [2, 7, 0, 5, 10, 3];
    return (minor ? flatMinors : flatMajors).indexOf(pc) !== -1;
  }

  /* opts:
       transpose    semitones, default 0
       showChords   default true
       big          larger type, for reading at arm's length
  */
  function lyricSheet(song, opts) {
    opts = opts || {};
    var semis = opts.transpose || 0;
    var showChords = opts.showChords !== false;
    var flats = prefersFlats(song.key || 'C', semis);

    var out = [];
    out.push('<div class="lyricsheet' + (opts.big ? ' is-big' : '') +
             (showChords ? '' : ' is-nochords') + '">');

    (song.lyrics || []).forEach(function (section) {
      out.push('<div class="ly-section">');
      if (section.section) {
        out.push('<h4 class="ly-name">' + esc(section.section) + '</h4>');
      }
      section.lines.forEach(function (line) {
        if (!line) { out.push('<div class="ly-line is-blank"></div>'); return; }
        out.push('<div class="ly-line">');
        parseLine(line).forEach(function (seg) {
          var chord = seg.chord ? transposeChord(seg.chord, semis, flats) : null;
          /* Split into words so a long phrase under one chord can still wrap.
             The first word carries the chord; the rest keep an empty slot above
             them so every word sits on the same baseline. */
          var words = seg.text.match(/\S+\s*|\s+/g);
          if (!words || !words.length) words = [seg.text || ''];

          words.forEach(function (w, i) {
            var c = (i === 0 && chord) ? chord : '';
            /* A chord with no word after it (end of a line) still needs width. */
            var body = w === '' ? '&nbsp;' : esc(w).replace(/ /g, '&nbsp;');
            out.push('<span class="ly-pair' + (c ? ' has-chord' : '') + '">' +
                     '<span class="ly-chord">' + esc(c) + '</span>' +
                     '<span class="ly-word">' + body + '</span></span>');
          });
        });
        out.push('</div>');
      });
      out.push('</div>');
    });

    out.push('</div>');
    return out.join('');
  }

  function esc(t) {
    return String(t === null || t === undefined ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  GL.render.lyricSheet = lyricSheet;
  GL.render.parseLyricLine = parseLine;
  GL.lyrics = {
    parseLine: parseLine,
    chordsUsed: chordsUsed,
    transposeChord: transposeChord,
    transposeKey: transposeKey,
    prefersFlats: prefersFlats
  };
}(window.GL = window.GL || {}));
