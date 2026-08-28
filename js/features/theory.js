/* theory.js -- the circle of fifths, and what a key actually contains.

   An interactive reference rather than a lesson: pick a key and see its notes,
   its diatonic chords, the chords it can borrow, and what it shares with its
   neighbours. The course track E teaches this; this view is where you look it
   up afterwards.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var ui = { key: 'C', minor: false };
  var els = {};

  /* ---------------------------------------------------- circle of fifths SVG */

  function circleSvg() {
    var size = 320, cx = size / 2, cy = size / 2;
    var rOuter = 148, rInner = 104, rHub = 62;
    var s = [];
    s.push('<svg class="cof" viewBox="0 0 ' + size + ' ' + size + '" width="100%" ' +
           'preserveAspectRatio="xMidYMid meet" role="img" aria-label="circle of fifths">');

    GL.notes.CIRCLE.forEach(function (e, i) {
      /* Twelve o'clock is C, going clockwise by fifths. */
      var a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      var majX = cx + Math.cos(a) * ((rOuter + rInner) / 2);
      var majY = cy + Math.sin(a) * ((rOuter + rInner) / 2);
      var minX = cx + Math.cos(a) * ((rInner + rHub) / 2);
      var minY = cy + Math.sin(a) * ((rInner + rHub) / 2);

      var majOn = !ui.minor && e.major === ui.key;
      var minOn = ui.minor && e.minor.replace('m', '') === ui.key;

      s.push('<circle class="cof-slot' + (majOn ? ' is-on' : '') + '" cx="' + r(majX) + '" cy="' + r(majY) + '" r="21" ' +
             'data-key="' + e.major + '" data-minor="0"/>');
      s.push('<text class="cof-label' + (majOn ? ' is-on' : '') + '" x="' + r(majX) + '" y="' + r(majY + 5) +
             '" text-anchor="middle" pointer-events="none">' + e.major + '</text>');

      s.push('<circle class="cof-slot is-minor' + (minOn ? ' is-on' : '') + '" cx="' + r(minX) + '" cy="' + r(minY) + '" r="17" ' +
             'data-key="' + e.minor.replace('m', '') + '" data-minor="1"/>');
      s.push('<text class="cof-label is-minor' + (minOn ? ' is-on' : '') + '" x="' + r(minX) + '" y="' + r(minY + 4) +
             '" text-anchor="middle" pointer-events="none">' + e.minor + '</text>');
    });

    var sig = notes.keySignature(ui.key + (ui.minor ? 'm' : ''));
    var acc = sig ? sig.accidentals : 0;
    s.push('<text class="cof-hub" x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle">' +
           ui.key + (ui.minor ? 'm' : '') + '</text>');
    s.push('<text class="cof-hubsub" x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle">' +
           (acc === 0 ? 'no sharps or flats'
             : Math.abs(acc) + (acc > 0 ? ' sharp' : ' flat') + (Math.abs(acc) === 1 ? '' : 's')) + '</text>');

    s.push('</svg>');
    return s.join('');
  }

  function r(n) { return Math.round(n * 100) / 100; }

  /* ------------------------------------------------------------------ panel */

  function refresh() {
    els.circle.innerHTML = circleSvg();
    els.circle.querySelectorAll('.cof-slot').forEach(function (slot) {
      slot.addEventListener('click', function () {
        ui.key = this.getAttribute('data-key');
        ui.minor = this.getAttribute('data-minor') === '1';
        refresh();
      });
    });

    var scaleKey = ui.minor ? 'aeolian' : 'major';
    var names = GL.scales.noteNames(ui.key, scaleKey);
    var triads = GL.scales.harmonize(ui.key, scaleKey, { sevenths: false });
    var sevenths = GL.scales.harmonize(ui.key, scaleKey, { sevenths: true });

    clear(els.detail);
    els.detail.appendChild(h('div.detail-head', [
      h('h2', ui.key + (ui.minor ? ' minor' : ' major')),
      h('p.detail-quality', names.join('  '))
    ]));

    els.detail.appendChild(h('h3.detail-sub', 'Diatonic chords'));
    els.detail.appendChild(h('div.chordrow', triads.map(function (d, i) {
      return h('button.degree', {
        type: 'button',
        onclick: function () { playChord(d.symbol); }
      }, [h('span.degree-numeral', d.numeral), h('span.degree-symbol', d.symbol)]);
    })));

    els.detail.appendChild(h('h3.detail-sub', 'With sevenths'));
    els.detail.appendChild(h('div.chordrow', sevenths.map(function (d) {
      return h('button.degree', {
        type: 'button',
        onclick: function () { playChord(d.symbol); }
      }, [h('span.degree-numeral', d.numeral), h('span.degree-symbol', d.symbol)]);
    })));

    /* Borrowed chords: what the parallel key offers. */
    var parallel = GL.scales.harmonize(ui.key, ui.minor ? 'major' : 'aeolian', { sevenths: false });
    var own = {};
    triads.forEach(function (d) { own[d.symbol] = 1; });
    var borrowed = parallel.filter(function (d) { return !own[d.symbol]; });
    if (borrowed.length) {
      els.detail.appendChild(h('h3.detail-sub',
        'Borrowed from ' + ui.key + (ui.minor ? ' major' : ' minor')));
      els.detail.appendChild(h('div.chordrow', borrowed.map(function (d) {
        return h('button.degree.is-borrowed', {
          type: 'button',
          onclick: function () { playChord(d.symbol); }
        }, [h('span.degree-numeral', d.numeral), h('span.degree-symbol', d.symbol)]);
      })));
      els.detail.appendChild(h('p.hint',
        'These are outside the key and still sound right, because they come from the key with the ' +
        'same root and the other third. The minor iv and the flat VII are the two you will use most.'));
    }

    /* Neighbours. */
    var sig = notes.keySignature(ui.key + (ui.minor ? 'm' : ''));
    if (sig) {
      var circle = notes.CIRCLE;
      var up = circle[(sig.position + 1) % 12];
      var down = circle[(sig.position + 11) % 12];
      els.detail.appendChild(h('h3.detail-sub', 'Closest keys'));
      els.detail.appendChild(h('div.row.row-wrap', [
        h('button.btn.btn-chip', {
          type: 'button',
          onclick: function () { ui.key = up.major; ui.minor = false; refresh(); }
        }, up.major + ' (a fifth up)'),
        h('button.btn.btn-chip', {
          type: 'button',
          onclick: function () { ui.key = down.major; ui.minor = false; refresh(); }
        }, down.major + ' (a fourth up)'),
        h('button.btn.btn-chip', {
          type: 'button',
          onclick: function () {
            ui.key = ui.minor ? sig.major : sig.minor.replace('m', '');
            ui.minor = !ui.minor;
            refresh();
          }
        }, ui.minor ? 'relative major' : 'relative minor')
      ]));
      els.detail.appendChild(h('p.hint',
        'Neighbouring keys differ by exactly one note, which is why moving between them sounds ' +
        'smooth and why key changes usually go up a fifth.'));
    }

    els.detail.appendChild(h('div.row.row-wrap.detail-play', [
      h('button.btn', {
        type: 'button',
        onclick: function () {
          playSequence([triads[0].symbol, triads[3].symbol, triads[4].symbol, triads[0].symbol]);
        }
      }, 'Hear I - IV - V - I'),
      h('button.btn', {
        type: 'button',
        onclick: function () { playSequence(triads.map(function (d) { return d.symbol; })); }
      }, 'Play all seven'),
      h('button.btn', {
        type: 'button',
        onclick: function () { GL.app.navigate('jam'); }
      }, 'Jam in this key')
    ]));
  }

  function playChord(symbol) {
    GL.audio.unlock();
    var v = GL.chords.voicings(symbol, { tuning: GL.app.tuning(), maxFret: 9, limit: 1 })[0];
    if (!v) { GL.app.toast('No shape for ' + symbol + ' in this tuning', 'error'); return; }
    GL.guitar.strum({ frets: v.frets, tuning: GL.app.tuning(), velocity: 0.8, tone: 'steel' });
  }

  function playSequence(symbols) {
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);
    var t0 = GL.audio.now() + 0.1;
    symbols.forEach(function (sym, i) {
      var v = GL.chords.voicings(sym, { tuning: GL.app.tuning(), maxFret: 9, limit: 1 })[0];
      if (!v) return;
      GL.guitar.strum({
        frets: v.frets, tuning: GL.app.tuning(), when: t0 + i * 1.05,
        velocity: 0.78, tone: 'steel'
      });
    });
  }

  GL.app.register('theory', {
    title: 'Theory',
    navLabel: 'Theory',
    icon: '&#9837;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Theory reference'),
        h('p.view-sub', 'Click any key on the circle. Outer ring is major, inner ring is its relative minor.')
      ]));

      els.circle = h('div.cof-wrap');
      els.detail = h('aside.card.cl-detail');

      root.appendChild(h('div.cl-layout', [
        h('section.card.cl-main', [
          h('header.card-head', [h('h2', 'Circle of fifths'), h('span.card-tag', 'click a key')]),
          els.circle
        ]),
        els.detail
      ]));

      refresh();
    },
    unmount: function () { GL.guitar.stopAll(); els = {}; }
  });
}(window.GL = window.GL || {}));
