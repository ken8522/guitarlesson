/* jam.js -- the jam room: any progression, any key, any style, any tempo.

   The progression library holds roman numerals, so every entry works in all
   twelve keys and the app never stores a chord it did not compute.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  var ui = {
    key: 'A',
    progression: 0,
    style: 'blues',
    tempo: 92,
    beatsPerChord: 4,
    custom: ''
  };

  var backing = null;
  var els = {};

  function currentProgression() {
    return GL.progressions.LIBRARY[ui.progression] || GL.progressions.LIBRARY[0];
  }

  function currentChords() {
    if (ui.custom.trim()) {
      return ui.custom.split(/[,\s|]+/).filter(Boolean).map(function (s) {
        return { symbol: s, numeral: '' };
      }).filter(function (c) { return GL.chords.parse(c.symbol); });
    }
    return GL.progressions.realise(currentProgression().numerals, ui.key);
  }

  /* Which scales fit over this progression? A practical answer, not an
     exhaustive one: the ones whose notes contain every chord tone. */
  function suggestedScales(chords) {
    var needed = {};
    chords.forEach(function (c) {
      GL.chords.pitchClasses(GL.chords.parse(c.symbol)).forEach(function (pc) { needed[pc] = 1; });
    });
    var need = Object.keys(needed).map(Number);
    var out = [];
    ['major', 'aeolian', 'dorian', 'mixolydian', 'minorPentatonic', 'majorPentatonic', 'bluesMinor', 'lydian', 'phrygian', 'harmonicMinor']
      .forEach(function (key) {
        var pcs = GL.scales.pcs(ui.key, key);
        var covers = need.every(function (pc) { return pcs.indexOf(pc) !== -1; });
        if (covers) out.push({ key: key, name: GL.scales.SCALES[key].name, full: true });
      });
    /* Pentatonics rarely cover everything and are still the right answer. */
    if (out.length < 3) {
      ['minorPentatonic', 'bluesMinor', 'majorPentatonic'].forEach(function (key) {
        if (!out.some(function (o) { return o.key === key; })) {
          out.push({ key: key, name: GL.scales.SCALES[key].name, full: false });
        }
      });
    }
    return out.slice(0, 6);
  }

  function stop() {
    if (backing && backing.isRunning()) backing.stop();
    backing = null;
    if (els.playBtn) { els.playBtn.textContent = 'Start the band'; els.playBtn.classList.remove('is-live'); }
    GL.app.$$('.barcell').forEach(function (b) { b.classList.remove('is-now'); });
  }

  function start() {
    var chords = currentChords();
    if (!chords.length) { GL.app.toast('Nothing to play', 'error'); return; }
    backing = GL.backing.create({
      chords: chords.map(function (c) { return c.symbol; }),
      beatsPerBar: ui.beatsPerChord,
      style: ui.style,
      tempo: ui.tempo,
      tuning: GL.app.tuning(),
      onBar: function (i, chord, when) {
        var delay = Math.max(0, (when - GL.audio.now()) * 1000);
        setTimeout(function () {
          GL.app.$$('.barcell').forEach(function (b, n) { b.classList.toggle('is-now', n === i); });
          if (els.now) els.now.textContent = chord.symbol;
        }, delay);
      }
    });
    backing.start();
    els.playBtn.textContent = 'Stop';
    els.playBtn.classList.add('is-live');
  }

  function refresh() {
    var chords = currentChords();
    var prog = currentProgression();

    clear(els.chart);
    chords.forEach(function (c) {
      els.chart.appendChild(h('span.barcell.is-downbeat', [
        h('span.barcell-chord', c.symbol),
        c.numeral ? h('span.barcell-num', c.numeral) : null
      ]));
    });

    clear(els.about);
    if (!ui.custom.trim()) {
      els.about.appendChild(h('p.hint', prog.note));
    } else {
      els.about.appendChild(h('p.hint', 'Your own progression. Type chord symbols separated by spaces or commas.'));
    }

    /* Chord shapes for the loop. */
    clear(els.shapes);
    chords.forEach(function (c) {
      var v = GL.chords.voicings(c.symbol, { tuning: GL.app.tuning(), maxFret: 9, limit: 1 })[0];
      if (!v) return;
      els.shapes.appendChild(h('button.lesson-chord', {
        type: 'button',
        onclick: function () {
          GL.audio.unlock();
          GL.guitar.strum({ frets: v.frets, tuning: GL.app.tuning(), velocity: 0.82, tone: 'steel' });
        }
      }, [h('div', { html: GL.render.voicingDiagram(v, { name: c.symbol, size: 'sm' }) })]));
    });

    /* What to play over it. */
    clear(els.scales);
    suggestedScales(chords).forEach(function (s) {
      els.scales.appendChild(h('button.btn.btn-chip', {
        type: 'button',
        title: s.full ? 'Contains every chord tone' : 'Does not cover everything, but works',
        onclick: function () { GL.app.navigate('scales'); }
      }, ui.key + ' ' + s.name));
    });

    if (backing && backing.isRunning()) {
      backing.setChords(chords.map(function (c) { return c.symbol; }));
    }
  }

  GL.app.register('jam', {
    title: 'Jam',
    navLabel: 'Jam',
    icon: '&#9835;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Jam room'),
        h('p.view-sub',
          GL.progressions.LIBRARY.length + ' progressions, twelve keys, ' +
          Object.keys(GL.backing.STYLES).length + ' styles. Drums, bass and a comping guitar, ' +
          'all synthesised on the spot.')
      ]));

      els.chart = h('div.barchart.is-big');
      els.about = h('div');
      els.shapes = h('div.lesson-chords');
      els.scales = h('div.row.row-wrap');
      els.now = h('span.jam-now');

      var byGenre = GL.progressions.byGenre();
      var progSelect = h('select.select', {
        onchange: function () {
          ui.progression = Number(this.value);
          ui.custom = '';
          if (els.custom) els.custom.value = '';
          ui.beatsPerChord = currentProgression().beatsPerChord;
          refresh();
        }
      }, Object.keys(byGenre).map(function (g) {
        return h('optgroup', { label: g }, byGenre[g].map(function (p) {
          return h('option', {
            value: GL.progressions.LIBRARY.indexOf(p),
            selected: GL.progressions.LIBRARY.indexOf(p) === ui.progression
          }, p.name);
        }));
      }));

      var keyRow = h('div.rootrow', ROOTS.map(function (r) {
        return h('button.root-btn' + (r === ui.key ? '.is-on' : ''), {
          type: 'button', dataset: { root: r },
          onclick: function () {
            ui.key = r;
            GL.app.$$('.root-btn').forEach(function (b) { b.classList.toggle('is-on', b.dataset.root === r); });
            refresh();
          }
        }, r);
      }));

      var styleSelect = h('select.select', {
        onchange: function () {
          ui.style = this.value;
          if (backing) backing.setStyle(ui.style);
        }
      }, Object.keys(GL.backing.STYLES).map(function (k) {
        return h('option', { value: k, selected: k === ui.style },
          k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'));
      }));

      var tempoLabel = h('span.field-value', ui.tempo + ' bpm');
      var tempoSlider = h('input.slider', {
        type: 'range', min: 40, max: 220, step: 2, value: ui.tempo,
        oninput: function () {
          ui.tempo = Number(this.value);
          tempoLabel.textContent = ui.tempo + ' bpm';
          if (backing) backing.setTempo(ui.tempo);
        }
      });

      var barsSelect = h('select.select', {
        onchange: function () { ui.beatsPerChord = Number(this.value); refresh(); }
      }, [2, 3, 4, 6, 8].map(function (n) {
        return h('option', { value: n, selected: n === ui.beatsPerChord }, n + ' beats per chord');
      }));

      els.custom = h('input.input', {
        type: 'search', placeholder: 'or type chords: Am F C G',
        oninput: function () { ui.custom = this.value; refresh(); }
      });

      els.playBtn = h('button.btn.btn-primary.btn-wide', {
        type: 'button',
        onclick: function () { if (backing && backing.isRunning()) stop(); else start(); }
      }, 'Start the band');

      function mixer(label, which) {
        return h('label.field', [h('span', label), h('input.slider', {
          type: 'range', min: 0, max: 120, step: 5, value: 100,
          oninput: function () { if (backing) backing.setLevel(which, Number(this.value) / 100); }
        })]);
      }

      root.appendChild(h('section.card', [
        keyRow,
        h('div.grid.grid-2', [
          h('label.field', [h('span', 'Progression'), progSelect]),
          h('label.field', [h('span', 'Style'), styleSelect]),
          h('label.field', [h('span', tempoLabel), tempoSlider]),
          h('label.field', [h('span', 'Length'), barsSelect]),
          h('label.field', [h('span', 'Custom'), els.custom])
        ])
      ]));

      root.appendChild(h('section.card', [
        h('header.card-head', [h('h2', 'The loop'), els.now]),
        els.chart,
        els.about,
        h('div.row.row-wrap', [els.playBtn]),
        h('div.grid.grid-2.jam-mixer', [
          mixer('Drums', 'drums'), mixer('Bass', 'bass'), mixer('Guitar', 'guitar')
        ])
      ]));

      root.appendChild(h('section.card', [
        h('header.card-head', [h('h2', 'The shapes'), h('span.card-tag', 'click to hear')]),
        els.shapes
      ]));

      root.appendChild(h('section.card', [
        h('header.card-head', [h('h2', 'What to play over it'), h('span.card-tag', 'scales that fit')]),
        els.scales
      ]));

      refresh();
    },
    unmount: function () {
      stop();
      GL.guitar.stopAll();
      els = {};
    }
  });
}(window.GL = window.GL || {}));
