/* scalelib.js -- the scale and mode explorer.

   Forty-six scales, twelve keys, eleven tunings, all computed. The parts that
   matter for actually using a scale rather than reciting it: the CAGED boxes,
   the chords the scale harmonises into, and a drone to play it against so the
   modal colour is audible instead of theoretical.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;
  var S = GL.scales;

  var ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  var ui = {
    root: 'A',
    scale: 'minorPentatonic',
    mode: 'whole',      /* 'whole' | 'box' | '3nps' */
    position: 0,
    label: 'degree',
    bpm: 96,
    drone: true
  };

  var els = {};
  var droneVoices = [];

  /* --------------------------------------------------------------- playing */

  function stopDrone() {
    GL.guitar.stopAll(0.25);
    droneVoices = [];
  }

  /* A root and fifth underneath, quiet and long. Playing dorian against a drone
     is the only way to hear that it is not just "the relative major again". */
  function startDrone(rootPc, when) {
    /* 36 is C2, and it is a multiple of 12, so this lands the root somewhere in
       the octave below the guitar's open A -- low enough to sit under the scale. */
    var base = 36 + notes.mod12(rootPc);
    [base, base + 7, base + 12].forEach(function (m, i) {
      droneVoices.push(GL.guitar.note({
        midi: m,
        when: when + i * 0.02,
        velocity: i === 0 ? 0.42 : 0.26,
        tone: 'finger'
      }));
    });
  }

  function playCells(cells, opts) {
    opts = opts || {};
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);

    var seq = cells.slice().sort(function (a, b) { return a.midi - b.midi || a.stringIndex - b.stringIndex; });
    /* One note per pitch: a box has the same note on two strings in places. */
    var seen = {};
    seq = seq.filter(function (c) {
      if (seen[c.midi]) return false;
      seen[c.midi] = true;
      return true;
    });
    if (opts.direction === 'down') seq.reverse();
    else if (opts.direction === 'updown') seq = seq.concat(seq.slice(0, -1).reverse());

    var step = 60 / ui.bpm / 2;      /* eighth notes */
    var t0 = GL.audio.now() + 0.12;

    if (ui.drone) startDrone(notes.noteToPc(ui.root), t0);

    seq.forEach(function (c, i) {
      GL.guitar.note({
        midi: c.midi,
        when: t0 + i * step,
        velocity: c.isRoot ? 0.82 : 0.7,
        tone: 'finger',
        stringIndex: c.stringIndex
      });
    });
    return t0 + seq.length * step;
  }

  function playChord(symbol) {
    GL.audio.unlock();
    var v = GL.chords.voicings(symbol, { tuning: GL.app.tuning(), maxFret: 9, limit: 1 })[0];
    if (!v) { GL.app.toast('No shape for ' + symbol + ' in this tuning', 'error'); return; }
    GL.guitar.strum({
      frets: v.frets, tuning: GL.app.tuning(),
      direction: 'down', velocity: 0.78, tone: GL.app.state.settings.tone || 'steel'
    });
    return v;
  }

  /* ---------------------------------------------------------------- render */

  function positionsNow() {
    if (ui.mode === 'whole') return null;
    return S.positions(ui.root, ui.scale, {
      tuning: GL.app.tuning(),
      mode: ui.mode === '3nps' ? '3nps' : 'box',
      maxFret: 17
    });
  }

  function refresh() {
    renderNeck();
    renderInfo();
    renderHarmony();
  }

  function renderNeck() {
    clear(els.neck);
    var tuning = GL.app.tuning();
    var positions = positionsNow();

    var html, caption;
    if (!positions) {
      html = GL.render.fretboard({
        cells: S.onFretboard(ui.root, ui.scale, { tuning: tuning, maxFret: 15 }),
        tuning: tuning, toFret: 15, label: ui.label
      });
      caption = 'The whole neck. Every place this scale falls, from the nut to the 15th fret.';
    } else {
      if (ui.position >= positions.length) ui.position = 0;
      var p = positions[ui.position];
      /* Draw the position solid and the surrounding notes faded, so the box is
         seen in context rather than floating in space. */
      var all = S.onFretboard(ui.root, ui.scale, { tuning: tuning, maxFret: 15 });
      var inBox = {};
      p.cells.forEach(function (c) { inBox[c.stringIndex + ':' + c.fret] = true; });
      var cells = all.map(function (c) {
        return Object.assign({}, c, { dim: !inBox[c.stringIndex + ':' + c.fret] });
      });
      html = GL.render.fretboard({ cells: cells, tuning: tuning, toFret: 15, label: ui.label });
      caption = p.name + ' — frets ' + p.low + ' to ' + p.high + ', ' + p.cells.length + ' notes.';
    }

    els.neck.appendChild(h('div.neckwrap', { html: html }));
    els.neck.appendChild(h('p.hint', caption));

    /* Position stepper. */
    clear(els.steps);
    if (positions) {
      els.steps.appendChild(h('button.btn.btn-icon', {
        type: 'button',
        onclick: function () {
          ui.position = (ui.position - 1 + positions.length) % positions.length;
          refresh();
        }
      }, '‹'));
      positions.forEach(function (p, i) {
        els.steps.appendChild(h('button.btn.btn-chip' + (i === ui.position ? '.is-on' : ''), {
          type: 'button',
          onclick: function () { ui.position = i; refresh(); }
        }, String(i + 1)));
      });
      els.steps.appendChild(h('button.btn.btn-icon', {
        type: 'button',
        onclick: function () { ui.position = (ui.position + 1) % positions.length; refresh(); }
      }, '›'));
    }
  }

  function currentCells() {
    var positions = positionsNow();
    if (!positions) {
      return S.onFretboard(ui.root, ui.scale, { tuning: GL.app.tuning(), maxFret: 15 });
    }
    return positions[Math.min(ui.position, positions.length - 1)].cells;
  }

  function renderInfo() {
    clear(els.info);
    var sc = S.get(ui.scale);
    var names = S.noteNames(ui.root, ui.scale);
    var degrees = S.degreeLabels(ui.scale);

    els.info.appendChild(h('div.detail-head', [
      h('h2', ui.root + ' ' + sc.name),
      h('p.detail-quality', sc.mood)
    ]));

    els.info.appendChild(h('div.notegrid', names.map(function (n, i) {
      return h('div.notecell' + (i === 0 ? '.is-root' : ''), [
        h('span.notecell-name', n),
        h('span.notecell-deg', degrees[i])
      ]);
    })));

    els.info.appendChild(h('div.row.row-wrap.detail-play', [
      h('button.btn', { type: 'button', onclick: function () { playCells(currentCells(), { direction: 'up' }); } }, 'Ascend'),
      h('button.btn', { type: 'button', onclick: function () { playCells(currentCells(), { direction: 'updown' }); } }, 'Up and down'),
      h('button.btn', { type: 'button', onclick: stopDrone }, 'Stop')
    ]));

    var tempo = h('input.slider', {
      type: 'range', min: 50, max: 180, step: 2, value: ui.bpm,
      oninput: function () { ui.bpm = Number(this.value); tempoLabel.textContent = ui.bpm + ' bpm'; }
    });
    var tempoLabel = h('span.field-value', ui.bpm + ' bpm');

    els.info.appendChild(h('div.grid.grid-2', [
      h('label.field', [h('span', tempoLabel), tempo]),
      h('div.field', [h('span', 'Options'), h('label.check', [
        h('input', {
          type: 'checkbox', checked: ui.drone || null,
          onchange: function () { ui.drone = this.checked; }
        }),
        h('span', 'Root drone underneath')
      ])])
    ]));
  }

  function renderHarmony() {
    clear(els.harmony);
    var sc = S.get(ui.scale);

    if (sc.iv.length !== 7) {
      els.harmony.appendChild(h('p.hint',
        'Diatonic harmony is built by stacking thirds through a seven-note scale. ' +
        sc.name + ' has ' + sc.iv.length + ', so it has no diatonic chords of its own — ' +
        'it is played over the harmony of whatever key you are in.'));
      return;
    }

    var triads = S.harmonize(ui.root, ui.scale, { sevenths: false });
    var sevenths = S.harmonize(ui.root, ui.scale, { sevenths: true });

    els.harmony.appendChild(h('p.hint',
      'These are the chords that live inside ' + ui.root + ' ' + sc.name +
      '. Click one to hear it; this is the harmony the scale is describing.'));

    [{ label: 'Triads', list: triads }, { label: 'Sevenths', list: sevenths }].forEach(function (set) {
      els.harmony.appendChild(h('h3.detail-sub', set.label));
      els.harmony.appendChild(h('div.chordrow', set.list.map(function (d) {
        return h('button.degree', {
          type: 'button',
          onclick: function () { playChord(d.symbol); }
        }, [
          h('span.degree-numeral', d.numeral),
          h('span.degree-symbol', d.symbol)
        ]);
      })));
    });

    els.harmony.appendChild(h('div.row.row-wrap', [
      h('button.btn', {
        type: 'button',
        onclick: function () { playSequence(sevenths.map(function (d) { return d.symbol; })); }
      }, 'Play all seven'),
      h('button.btn', {
        type: 'button',
        onclick: function () {
          /* The cadence that proves the key. */
          playSequence([triads[0].symbol, triads[3].symbol, triads[4].symbol, triads[0].symbol]);
        }
      }, 'Hear the I-IV-V-I')
    ]));
  }

  function playSequence(symbols) {
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);
    var tuning = GL.app.tuning();
    var beat = 60 / 84 * 2;
    var t0 = GL.audio.now() + 0.1;
    symbols.forEach(function (sym, i) {
      var v = GL.chords.voicings(sym, { tuning: tuning, maxFret: 9, limit: 1 })[0];
      if (!v) return;
      GL.guitar.strum({
        frets: v.frets, tuning: tuning, when: t0 + i * beat,
        direction: 'down', velocity: 0.78, tone: GL.app.state.settings.tone || 'steel'
      });
    });
  }

  /* --------------------------------------------------------------- picker */

  function buildPicker() {
    var rootRow = h('div.rootrow', ROOTS.map(function (r) {
      return h('button.root-btn' + (r === ui.root ? '.is-on' : ''), {
        type: 'button',
        dataset: { root: r },
        onclick: function () {
          ui.root = r;
          GL.app.$$('.root-btn').forEach(function (b) { b.classList.toggle('is-on', b.dataset.root === r); });
          refresh();
        }
      }, r);
    }));

    var cats = S.byCategory();
    var scaleSelect = h('select.select', {
      onchange: function () { ui.scale = this.value; ui.position = 0; refresh(); }
    }, Object.keys(cats).map(function (cat) {
      return h('optgroup', { label: cat }, cats[cat].map(function (s) {
        return h('option', { value: s.key, selected: ui.scale === s.key },
          s.name + '  (' + s.iv.length + ' notes)');
      }));
    }));

    var modeSelect = h('select.select', {
      onchange: function () { ui.mode = this.value; ui.position = 0; refresh(); }
    }, [
      { v: 'whole', l: 'Whole neck' },
      { v: 'box', l: 'CAGED boxes' },
      { v: '3nps', l: 'Three notes per string' }
    ].map(function (o) {
      return h('option', { value: o.v, selected: ui.mode === o.v }, o.l);
    }));

    var labelSelect = h('select.select', {
      onchange: function () { ui.label = this.value; refresh(); }
    }, [
      { v: 'degree', l: 'Scale degrees' },
      { v: 'note', l: 'Note names' },
      { v: 'none', l: 'No labels' }
    ].map(function (o) {
      return h('option', { value: o.v, selected: ui.label === o.v }, o.l);
    }));

    return h('section.card.cl-picker', [
      rootRow,
      h('div.grid.grid-2', [
        h('label.field', [h('span', 'Scale'), scaleSelect]),
        h('label.field', [h('span', 'Layout'), modeSelect]),
        h('label.field', [h('span', 'Labels'), labelSelect])
      ])
    ]);
  }

  /* ------------------------------------------------------------------ view */

  GL.app.register('scales', {
    title: 'Scales',
    navLabel: 'Scales',
    icon: '&#9838;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Scales and modes'),
        h('p.view-sub', '46 scales, every key, mapped onto the neck you are actually holding.')
      ]));

      root.appendChild(buildPicker());

      els.neck = h('div');
      els.steps = h('div.row.row-wrap.stepper');
      els.info = h('aside.card.cl-detail');
      els.harmony = h('section.card');

      root.appendChild(h('div.cl-layout', [
        h('section.card.cl-main', [
          h('header.card-head', [h('h2', 'On the neck'), h('span.card-tag', 'root in amber')]),
          els.steps,
          els.neck
        ]),
        els.info
      ]));
      root.appendChild(h('div.stack', [els.harmony]));

      refresh();
    },
    unmount: function () {
      stopDrone();
      GL.guitar.stopAll();
      els = {};
    }
  });
}(window.GL = window.GL || {}));
