/* chord-diagram.js -- the little six-string box, drawn from a fret array.

   Takes exactly what chords.js produces, so any voicing the search finds can be
   drawn without translation. Returns an SVG string; callers drop it into
   innerHTML. Colours come from CSS custom properties so the diagram follows the
   app theme instead of hard-coding ink.
*/
(function (GL) {
  'use strict';

  GL.render = GL.render || {};

  /* opts:
       frets      six entries, low string first; -1 mute, 0 open
       fingers    six entries, 0 = none
       barres     [{ fret, from, to, finger }] as returned by chords.fingering
       name       label drawn above the box
       sub        smaller label under the name (e.g. "E shape")
       size       'sm' | 'md' | 'lg'
       showFingers  draw finger numbers inside the dots (default true)
       frets_shown  how many frets the box covers (default 5)
  */
  function chordDiagram(opts) {
    var frets = opts.frets || [-1, -1, -1, -1, -1, -1];
    var fingers = opts.fingers || [0, 0, 0, 0, 0, 0];
    var barres = opts.barres || [];
    var showFingers = opts.showFingers !== false;
    var rows = opts.frets_shown || 5;

    var scale = opts.size === 'sm' ? 0.72 : opts.size === 'lg' ? 1.35 : 1;
    var gapX = 17 * scale;
    var gapY = 21 * scale;
    var padL = 20 * scale;
    var padT = (opts.name ? 30 : 20) * scale;
    var padB = (showFingers ? 20 : 8) * scale;
    var padR = 20 * scale;

    var boxW = gapX * 5;
    var boxH = gapY * rows;
    var w = boxW + padL + padR;
    var h = boxH + padT + padB;

    /* Which fret is the top row? Open shapes start at the nut. */
    var fretted = frets.filter(function (f) { return f > 0; });
    var minF = fretted.length ? Math.min.apply(null, fretted) : 1;
    var maxF = fretted.length ? Math.max.apply(null, fretted) : 1;
    var base = (maxF <= rows) ? 1 : minF;
    var atNut = base === 1;

    /* The diagram is drawn low string on the LEFT, matching how a right-handed
       player looks down at the neck. */
    function x(si) { return padL + si * gapX; }
    function y(rowFret) { return padT + (rowFret - 0.5) * gapY; }

    var s = [];
    s.push('<svg class="cd" viewBox="0 0 ' + r(w) + ' ' + r(h) + '" width="' + r(w) + '" height="' + r(h) +
           '" role="img" aria-label="' + esc(opts.name || 'chord diagram') + '">');

    if (opts.name) {
      s.push('<text class="cd-name" x="' + r(w / 2) + '" y="' + r(14 * scale) +
             '" text-anchor="middle">' + esc(opts.name) + '</text>');
    }
    if (opts.sub) {
      s.push('<text class="cd-sub" x="' + r(w / 2) + '" y="' + r(25 * scale) +
             '" text-anchor="middle">' + esc(opts.sub) + '</text>');
    }

    /* Fret wires. */
    for (var f = 0; f <= rows; f++) {
      var yy = padT + f * gapY;
      s.push('<line class="cd-fret" x1="' + r(padL) + '" y1="' + r(yy) +
             '" x2="' + r(padL + boxW) + '" y2="' + r(yy) + '"/>');
    }
    if (atNut) {
      s.push('<rect class="cd-nut" x="' + r(padL - 1) + '" y="' + r(padT - 3 * scale) +
             '" width="' + r(boxW + 2) + '" height="' + r(3.5 * scale) + '" rx="1"/>');
    } else {
      s.push('<text class="cd-pos" x="' + r(padL - 7 * scale) + '" y="' + r(y(1) + 4 * scale) +
             '" text-anchor="end">' + base + '</text>');
    }

    /* Strings. Thicker toward the bass side, which reads instantly as a neck. */
    for (var si = 0; si < 6; si++) {
      s.push('<line class="cd-string" x1="' + r(x(si)) + '" y1="' + r(padT) +
             '" x2="' + r(x(si)) + '" y2="' + r(padT + boxH) +
             '" stroke-width="' + r((1.5 - si * 0.13) * scale) + '"/>');
    }

    /* Open and muted markers above the nut. */
    for (si = 0; si < 6; si++) {
      var mk = padT - 6 * scale;
      if (frets[si] === 0) {
        s.push('<circle class="cd-open" cx="' + r(x(si)) + '" cy="' + r(mk) +
               '" r="' + r(3.4 * scale) + '"/>');
      } else if (frets[si] < 0) {
        var d = 3.2 * scale;
        s.push('<path class="cd-mute" d="M' + r(x(si) - d) + ' ' + r(mk - d) +
               ' L' + r(x(si) + d) + ' ' + r(mk + d) +
               ' M' + r(x(si) + d) + ' ' + r(mk - d) +
               ' L' + r(x(si) - d) + ' ' + r(mk + d) + '"/>');
      }
    }

    /* Barres first, so the finger dots sit on top of the bar. */
    var barredStrings = {};
    barres.forEach(function (b) {
      var row = b.fret - base + 1;
      if (row < 1 || row > rows) return;
      for (var i = b.from; i <= b.to; i++) barredStrings[i] = b.finger;
      s.push('<rect class="cd-barre" x="' + r(x(b.from) - 5.5 * scale) +
             '" y="' + r(y(row) - 5.5 * scale) +
             '" width="' + r((b.to - b.from) * gapX + 11 * scale) +
             '" height="' + r(11 * scale) + '" rx="' + r(5.5 * scale) + '"/>');
    });

    /* Finger dots. */
    for (si = 0; si < 6; si++) {
      var fr = frets[si];
      if (fr === undefined || fr <= 0) continue;
      var row2 = fr - base + 1;
      if (row2 < 1 || row2 > rows) continue;
      var isBarred = barredStrings[si] !== undefined && barredStrings[si] === fingers[si];
      if (!isBarred) {
        s.push('<circle class="cd-dot" cx="' + r(x(si)) + '" cy="' + r(y(row2)) +
               '" r="' + r(5.5 * scale) + '"/>');
      }
      if (showFingers && fingers[si]) {
        s.push('<text class="cd-finger" x="' + r(x(si)) + '" y="' + r(y(row2) + 3.2 * scale) +
               '" text-anchor="middle" font-size="' + r(8.5 * scale) + '">' + fingers[si] + '</text>');
      }
    }

    /* String names along the bottom, so the shape is readable in any tuning. */
    if (opts.stringLabels) {
      opts.stringLabels.forEach(function (lbl, i) {
        s.push('<text class="cd-strlabel" x="' + r(x(i)) + '" y="' + r(padT + boxH + 12 * scale) +
               '" text-anchor="middle" font-size="' + r(8 * scale) + '">' + esc(lbl) + '</text>');
      });
    }

    s.push('</svg>');
    return s.join('');
  }

  /* Draw a voicing straight from chords.voicings(). */
  function voicingDiagram(voicing, opts) {
    opts = opts || {};
    return chordDiagram({
      frets: voicing.frets,
      fingers: voicing.fingers,
      barres: voicing.barres,
      name: opts.name,
      sub: opts.sub || (voicing.caged ? voicing.caged + ' shape' : ''),
      size: opts.size,
      showFingers: opts.showFingers,
      stringLabels: opts.stringLabels
    });
  }

  function r(n) { return Math.round(n * 100) / 100; }
  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  GL.render.chordDiagram = chordDiagram;
  GL.render.voicingDiagram = voicingDiagram;
}(window.GL = window.GL || {}));
