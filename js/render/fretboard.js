/* fretboard.js -- the full neck, drawn horizontally.

   Feed it the cells that scales.js produces and it draws a scale map; feed it
   arbitrary cells and it will mark anything. The 1st string is drawn on top,
   which is how a player looking down at the guitar sees it, and how every
   scale book prints it.
*/
(function (GL) {
  'use strict';

  GL.render = GL.render || {};

  var SINGLE_INLAYS = [3, 5, 7, 9, 15, 17, 19, 21];
  var DOUBLE_INLAYS = [12, 24];

  /* opts:
       cells        [{ stringIndex, fret, label, note, isRoot, degree }]
       tuning       six MIDI numbers, low first (for the open-string labels)
       fromFret     default 0
       toFret       default 15
       label        'degree' | 'note' | 'none'
       width        pixel width, default 860
       highlight    [{stringIndex, fret}] drawn as a ring (e.g. quiz targets)
       dim          true to draw cells muted (used for out-of-position notes)
  */
  function fretboard(opts) {
    var cells = opts.cells || [];
    var from = opts.fromFret === undefined ? 0 : opts.fromFret;
    var to = opts.toFret === undefined ? 15 : opts.toFret;
    var labelMode = opts.label || 'degree';
    var tuning = opts.tuning || GL.notes.TUNINGS.standard.strings;

    var count = to - from + 1;
    var width = opts.width || 860;
    var padL = 34, padR = 12, padT = 16, padB = 20;
    var boardW = width - padL - padR;
    var fw = boardW / count;               /* fret width */
    var sh = opts.stringGap || 24;         /* string spacing */
    var boardH = sh * 5;
    var height = boardH + padT + padB;

    /* Row 0 is the 1st string (high E) = string index 5. */
    function y(si) { return padT + (5 - si) * sh; }
    /* Fret 0 is the open string, drawn in a narrow lane left of the nut. */
    function xCenter(f) { return padL + (f - from + 0.5) * fw; }
    function xWire(f) { return padL + (f - from + 1) * fw; }

    var s = [];
    s.push('<svg class="fb" viewBox="0 0 ' + r(width) + ' ' + r(height) + '" width="100%" ' +
           'preserveAspectRatio="xMidYMid meet" role="img" aria-label="fretboard diagram">');

    s.push('<rect class="fb-board" x="' + r(padL) + '" y="' + r(padT - 5) +
           '" width="' + r(boardW) + '" height="' + r(boardH + 10) + '" rx="3"/>');

    /* Inlays sit behind everything else. */
    for (var f = Math.max(from, 1); f <= to; f++) {
      if (SINGLE_INLAYS.indexOf(f) !== -1) {
        s.push(inlay(xCenter(f), padT + boardH / 2));
      } else if (DOUBLE_INLAYS.indexOf(f) !== -1) {
        s.push(inlay(xCenter(f), padT + sh * 1.5));
        s.push(inlay(xCenter(f), padT + sh * 3.5));
      }
    }

    /* Fret wires. */
    for (f = from; f <= to; f++) {
      var isNut = (f === 0);
      s.push('<line class="' + (isNut ? 'fb-nut' : 'fb-wire') + '" x1="' + r(xWire(f)) +
             '" y1="' + r(padT - 5) + '" x2="' + r(xWire(f)) + '" y2="' + r(padT + boardH + 5) + '"/>');
    }

    /* Strings, gauged so the bass reads as the bass. */
    for (var si = 0; si < 6; si++) {
      s.push('<line class="fb-string" x1="' + r(padL) + '" y1="' + r(y(si)) +
             '" x2="' + r(padL + boardW) + '" y2="' + r(y(si)) +
             '" stroke-width="' + r(2.1 - si * 0.22) + '"/>');
      s.push('<text class="fb-openlabel" x="' + r(padL - 9) + '" y="' + r(y(si) + 3.5) +
             '" text-anchor="end">' + esc(GL.notes.pcName(tuning[si])) + '</text>');
    }

    /* Fret numbers. */
    for (f = Math.max(from, 1); f <= to; f++) {
      s.push('<text class="fb-fretnum" x="' + r(xCenter(f)) + '" y="' + r(padT + boardH + 15) +
             '" text-anchor="middle">' + f + '</text>');
    }

    /* Marked notes. */
    cells.forEach(function (c) {
      if (c.fret < from || c.fret > to) return;
      var cx = xCenter(c.fret);
      var cy = y(c.stringIndex);
      var cls = 'fb-dot' + (c.isRoot ? ' is-root' : '') +
                (c.dim || opts.dim ? ' is-dim' : '') +
                (c.className ? ' ' + c.className : '');
      s.push('<circle class="' + cls + '" cx="' + r(cx) + '" cy="' + r(cy) + '" r="' + r(sh * 0.40) + '"/>');
      var text = labelMode === 'note' ? c.note : labelMode === 'degree' ? c.label : '';
      if (text) {
        s.push('<text class="fb-dotlabel' + (c.isRoot ? ' is-root' : '') + '" x="' + r(cx) +
               '" y="' + r(cy + 3.4) + '" text-anchor="middle">' + esc(text) + '</text>');
      }
    });

    (opts.highlight || []).forEach(function (h) {
      if (h.fret < from || h.fret > to) return;
      s.push('<circle class="fb-target" cx="' + r(xCenter(h.fret)) + '" cy="' + r(y(h.stringIndex)) +
             '" r="' + r(sh * 0.46) + '"/>');
    });

    s.push('</svg>');
    return s.join('');

    function inlay(cx, cy) {
      return '<circle class="fb-inlay" cx="' + r(cx) + '" cy="' + r(cy) + '" r="4.5"/>';
    }
  }

  /* Convenience: draw a scale position, greying out the rest of the neck so the
     shape stands out from the notes around it. */
  function positionDiagram(rootName, scaleKey, position, opts) {
    opts = opts || {};
    var pad = opts.pad === undefined ? 1 : opts.pad;
    return fretboard(Object.assign({
      cells: position.cells,
      fromFret: Math.max(0, position.low - pad),
      toFret: position.high + pad,
      label: opts.label || 'degree',
      tuning: opts.tuning
    }, opts.svg || {}));
  }

  function r(n) { return Math.round(n * 100) / 100; }
  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  GL.render.fretboard = fretboard;
  GL.render.positionDiagram = positionDiagram;
}(window.GL = window.GL || {}));
