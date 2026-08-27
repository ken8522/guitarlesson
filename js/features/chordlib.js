/* chordlib.js -- the chord explorer.

   Pick a chord and see every playable way to hold it, up the whole neck, with
   the fingering worked out and the CAGED form named. Everything is generated
   by chords.js against the tuning currently set on the practice bench, so this
   view works unchanged in DADGAD or open G.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;
  var C = GL.chords;

  /* Roots as guitarists write them: sharps going up, flats where the flat
     spelling is the one in common use. */
  var ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  var CATEGORY_ORDER = ['triad', 'power', 'seventh', 'sus', 'added', 'sixth', 'extended', 'altered'];
  var CATEGORY_NAMES = {
    triad: 'Triads', power: 'Power', seventh: 'Sevenths', sus: 'Suspended',
    added: 'Added tones', sixth: 'Sixths', extended: 'Extensions', altered: 'Altered'
  };

  /* View state, kept across mounts so going away and coming back is painless. */
  var ui = { root: 'C', quality: 'maj', maxFret: 12, rootBass: false, selected: 0 };

  var els = {};

  /* ------------------------------------------------------------- analysis */

  /* Which keys is this chord diatonic to, and what is its function there?
     For an intermediate player this is the difference between "here is a
     Bm7b5 shape" and "this is the vii of C major, which is why it turned up". */
  /* Dorian and mixolydian are rotations of the major scale, so including them
     would report the same fact three times over. These four parent scales
     cover the useful answers without the redundancy. */
  var ROLE_MODES = [
    { key: 'major', label: 'major' },
    { key: 'aeolian', label: 'natural minor' },
    { key: 'harmonicMinor', label: 'harmonic minor' },
    { key: 'melodicMinor', label: 'melodic minor' }
  ];

  function pcKey(pcs) {
    return pcs.slice().sort(function (a, b) { return a - b; }).join(',');
  }

  function diatonicRoles(chord) {
    var target = pcKey(C.pitchClasses(chord));
    var roles = [];
    var seen = {};

    /* A triad has to be compared against the scale's triads and a seventh
       against its sevenths -- harmonising only in sevenths meant a plain C
       never matched anything, because Cmaj7 has a note it does not. */
    ROLE_MODES.forEach(function (mode) {
      ROOTS.forEach(function (keyRoot) {
        [false, true].forEach(function (sevenths) {
          GL.scales.harmonize(keyRoot, mode.key, { sevenths: sevenths }).forEach(function (d) {
            if (!d.quality) return;
            if (notes.mod12(d.rootPc) !== notes.mod12(chord.rootPc)) return;
            if (pcKey(C.pitchClasses({ rootPc: d.rootPc, quality: d.quality, bassPc: null })) !== target) return;
            var id = keyRoot + '|' + mode.label;
            if (seen[id]) return;
            seen[id] = true;
            roles.push({ key: keyRoot, mode: mode.label, numeral: d.numeral });
          });
        });
      });
    });
    return roles.slice(0, 8);
  }

  /* A few chords worth reaching for next. Not an exhaustive substitution
     table; the ones an acoustic player actually uses. */
  function relatives(chord) {
    var out = [];
    var pc = chord.rootPc;
    var q = chord.quality;
    function add(label, symbol) {
      if (C.parse(symbol)) out.push({ label: label, symbol: symbol });
    }
    if (/^(maj|maj7|6|add9|69)$/.test(q)) {
      add('relative minor', notes.pcName(pc + 9, chord.root) + 'm');
      add('parallel minor', chord.root + 'm');
      add('its dominant', notes.pcName(pc + 7, chord.root) + '7');
    }
    if (/^(m|m7|m9|m6|madd9)$/.test(q)) {
      add('relative major', notes.pcName(pc + 3, chord.root));
      add('parallel major', chord.root);
      add('its dominant', notes.pcName(pc + 7, chord.root) + '7');
    }
    if (/^7/.test(q) || q === '7') {
      add('tritone sub', notes.pcName(pc + 6, chord.root) + '7');
      add('resolves to', notes.pcName(pc + 5, chord.root));
      add('sus it first', chord.root + '7sus4');
    }
    add('as a sus4', chord.root + 'sus4');
    add('as a sus2', chord.root + 'sus2');
    return out.slice(0, 6);
  }

  /* ------------------------------------------------------------- playback */

  function currentTone() { return GL.app.state.settings.tone || 'steel'; }

  function strumVoicing(v, direction) {
    GL.audio.unlock();
    GL.guitar.strum({
      frets: v.frets,
      tuning: GL.app.tuning(),
      direction: direction || 'down',
      velocity: 0.8,
      tone: currentTone()
    });
  }

  function arpeggiate(v) {
    GL.audio.unlock();
    var t0 = GL.audio.now() + 0.06;
    var tuning = GL.app.tuning();
    var step = 0;
    v.frets.forEach(function (f, si) {
      if (f < 0) return;
      GL.guitar.note({
        midi: notes.fretMidi(tuning, si, f),
        when: t0 + step * 0.19,
        velocity: 0.75,
        tone: 'finger',
        stringIndex: si
      });
      step++;
    });
  }

  /* ---------------------------------------------------------------- render */

  function symbol() {
    return C.symbolOf(ui.root, ui.quality);
  }

  function refresh() {
    var chord = C.parse(symbol());
    if (!chord) return;

    var voicings = C.voicings(chord, {
      tuning: GL.app.tuning(),
      maxFret: ui.maxFret,
      requireRootBass: ui.rootBass,
      limit: 14
    });

    renderVoicings(chord, voicings);
    renderDetail(chord, voicings);
  }

  function renderVoicings(chord, voicings) {
    clear(els.grid);
    if (!voicings.length) {
      els.grid.appendChild(h('p.empty',
        'No playable voicing for ' + chord.symbol + ' below fret ' + ui.maxFret +
        ' in ' + notes.TUNINGS[GL.app.state.settings.tuning].name + ' tuning. ' +
        'Try raising the fret limit.'));
      return;
    }
    if (ui.selected >= voicings.length) ui.selected = 0;

    voicings.forEach(function (v, i) {
      var card = h('div.voicing' + (i === ui.selected ? '.is-selected' : ''), {
        onclick: function () {
          ui.selected = i;
          strumVoicing(v, 'down');
          GL.app.$$('.voicing').forEach(function (c, ci) {
            c.classList.toggle('is-selected', ci === i);
          });
          renderDetail(chord, voicings);
        }
      });
      card.appendChild(h('div.voicing-dia', {
        html: GL.render.voicingDiagram(v, {
          sub: (v.caged ? v.caged + ' shape' : (v.baseFret > 1 ? 'fret ' + v.baseFret : 'open')),
          size: 'md'
        })
      }));
      card.appendChild(h('div.voicing-meta', [
        h('span', v.strings + ' strings'),
        h('span', v.fingerCount + (v.fingerCount === 1 ? ' finger' : ' fingers')),
        v.barres.length ? h('span.is-barre', 'barre') : null,
        v.rootInBass ? null : h('span.is-inv', 'inversion')
      ]));
      els.grid.appendChild(card);
    });
  }

  function renderDetail(chord, voicings) {
    var v = voicings[ui.selected];
    clear(els.detail);

    var quality = C.QUALITIES[chord.quality];
    var names = C.noteNames(chord);
    var degrees = quality.iv.map(function (iv) { return notes.intervalShort(iv); });

    els.detail.appendChild(h('div.detail-head', [
      h('h2', chord.symbol),
      h('p.detail-quality', notes.pcName(chord.rootPc, chord.root) + ' ' + quality.name)
    ]));

    /* Notes and what each one is doing in the chord. */
    els.detail.appendChild(h('div.notegrid', names.map(function (n, i) {
      return h('div.notecell' + (i === 0 ? '.is-root' : ''), [
        h('span.notecell-name', n),
        h('span.notecell-deg', degrees[i])
      ]);
    })));

    els.detail.appendChild(h('div.row.row-wrap.detail-play', [
      h('button.btn', { type: 'button', onclick: function () { strumVoicing(v, 'down'); } }, 'Strum down'),
      h('button.btn', { type: 'button', onclick: function () { strumVoicing(v, 'up'); } }, 'Strum up'),
      h('button.btn', { type: 'button', onclick: function () { arpeggiate(v); } }, 'Arpeggio'),
      h('button.btn.btn-icon', {
        type: 'button',
        title: 'Save to favourites',
        onclick: function () { toggleFavourite(chord.symbol, this); }
      }, isFavourite(chord.symbol) ? '★' : '☆')
    ]));

    /* This shape's notes on the full neck -- where else the same tones live. */
    if (v) {
      var pcs = C.pitchClasses(chord);
      var tuning = GL.app.tuning();
      var cells = [];
      for (var si = 0; si < 6; si++) {
        for (var f = 0; f <= 15; f++) {
          var pcHere = notes.mod12(tuning[si] + f);
          var idx = pcs.indexOf(pcHere);
          if (idx === -1) continue;
          var inShape = v.frets[si] === f;
          cells.push({
            stringIndex: si, fret: f,
            label: C.degreeOf(chord, pcHere),
            note: notes.pcName(pcHere, chord.root),
            isRoot: pcHere === notes.mod12(chord.rootPc),
            dim: !inShape
          });
        }
      }
      els.detail.appendChild(h('h3.detail-sub', 'These notes across the neck'));
      els.detail.appendChild(h('div.neckwrap', {
        html: GL.render.fretboard({ cells: cells, tuning: tuning, toFret: 15, label: 'degree' })
      }));
      els.detail.appendChild(h('p.hint',
        'Solid dots are the shape you have selected. Faded dots are the same chord tones elsewhere -- ' +
        'that is where the other voicings come from.'));
    }

    /* Function in a key. */
    var roles = diatonicRoles(chord);
    if (roles.length) {
      els.detail.appendChild(h('h3.detail-sub', 'Where this chord belongs'));
      els.detail.appendChild(h('div.rolelist', roles.map(function (r) {
        return h('span.role', [
          h('strong', r.numeral),
          ' of ' + r.key + ' ' + r.mode
        ]);
      })));
    }

    /* Somewhere to go next. */
    var rel = relatives(chord);
    if (rel.length) {
      els.detail.appendChild(h('h3.detail-sub', 'Try next'));
      els.detail.appendChild(h('div.row.row-wrap', rel.map(function (r) {
        return h('button.btn.btn-chip', {
          type: 'button',
          title: r.label,
          onclick: function () { go(r.symbol); }
        }, r.symbol);
      })));
    }
  }

  function go(sym) {
    var p = C.parse(sym);
    if (!p) return;
    ui.root = p.root;
    ui.quality = p.quality;
    ui.selected = 0;
    syncPicker();
    refresh();
  }

  /* ----------------------------------------------------------- favourites */

  function isFavourite(sym) {
    return GL.app.state.favorites.chords.indexOf(sym) !== -1;
  }

  function toggleFavourite(sym, btn) {
    var list = GL.app.state.favorites.chords;
    var i = list.indexOf(sym);
    if (i === -1) { list.push(sym); GL.app.toast(sym + ' saved'); }
    else { list.splice(i, 1); GL.app.toast(sym + ' removed'); }
    GL.app.save();
    if (btn) btn.textContent = isFavourite(sym) ? '★' : '☆';
    renderFavourites();
  }

  function renderFavourites() {
    if (!els.favs) return;
    clear(els.favs);
    var list = GL.app.state.favorites.chords;
    if (!list.length) return;
    els.favs.appendChild(h('span.field-label', 'Saved'));
    list.forEach(function (sym) {
      els.favs.appendChild(h('button.btn.btn-chip', {
        type: 'button',
        onclick: function () { go(sym); }
      }, sym));
    });
  }

  /* --------------------------------------------------------------- picker */

  function syncPicker() {
    GL.app.$$('.root-btn').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.root === ui.root);
    });
    if (els.quality) els.quality.value = ui.quality;
    if (els.search) els.search.value = '';
  }

  function buildPicker() {
    var rootRow = h('div.rootrow', ROOTS.map(function (r) {
      return h('button.root-btn' + (r === ui.root ? '.is-on' : ''), {
        type: 'button',
        dataset: { root: r },
        onclick: function () { ui.root = r; ui.selected = 0; syncPicker(); refresh(); }
      }, r);
    }));

    var groups = {};
    Object.keys(C.QUALITIES).forEach(function (k) {
      var cat = C.QUALITIES[k].cat;
      (groups[cat] = groups[cat] || []).push(k);
    });

    els.quality = h('select.select', {
      onchange: function () { ui.quality = this.value; ui.selected = 0; refresh(); }
    }, CATEGORY_ORDER.filter(function (c) { return groups[c]; }).map(function (cat) {
      return h('optgroup', { label: CATEGORY_NAMES[cat] || cat }, groups[cat].map(function (q) {
        return h('option', {
          value: q,
          selected: ui.quality === q
        }, C.QUALITIES[q].name + '  (' + (q === 'maj' ? 'no suffix' : q) + ')');
      }));
    }));

    els.search = h('input.input', {
      type: 'search',
      placeholder: 'or type a chord: Bbmaj9, F#m7b5, Cadd9/G',
      onkeydown: function (e) {
        if (e.key !== 'Enter') return;
        var parsed = C.parse(this.value.trim());
        if (!parsed) { GL.app.toast('Could not read "' + this.value + '"', 'error'); return; }
        go(parsed.symbol);
      }
    });

    var fretSlider = h('input.slider', {
      type: 'range', min: 4, max: 15, step: 1, value: ui.maxFret,
      oninput: function () {
        ui.maxFret = Number(this.value);
        fretLabel.textContent = 'up to fret ' + ui.maxFret;
        refresh();
      }
    });
    var fretLabel = h('span.field-value', 'up to fret ' + ui.maxFret);

    var bassToggle = h('label.check', [
      h('input', {
        type: 'checkbox',
        checked: ui.rootBass || null,
        onchange: function () { ui.rootBass = this.checked; refresh(); }
      }),
      h('span', 'Root in the bass only')
    ]);

    els.favs = h('div.row.row-wrap.favrow');

    return h('section.card.cl-picker', [
      rootRow,
      h('div.grid.grid-2', [
        h('label.field', [h('span', 'Quality'), els.quality]),
        h('label.field', [h('span', 'Search'), els.search]),
        h('label.field', [h('span', fretLabel), fretSlider]),
        h('div.field', [h('span', 'Filter'), bassToggle])
      ]),
      els.favs
    ]);
  }

  /* ------------------------------------------------------------------ view */

  GL.app.register('chords', {
    title: 'Chords',
    navLabel: 'Chords',
    icon: '&#9639;',
    mount: function (root, params) {
      if (params && params.c) {
        var p = C.parse(params.c);
        if (p) { ui.root = p.root; ui.quality = p.quality; ui.selected = 0; }
      }

      root.appendChild(h('div.view-head', [
        h('h1', 'Chords'),
        h('p.view-sub', [
          'Every playable shape, found by searching the neck. Currently in ',
          h('strong', notes.TUNINGS[GL.app.state.settings.tuning].name),
          ' tuning — change it on the practice bench and these all change with it.'
        ])
      ]));

      root.appendChild(buildPicker());

      els.grid = h('div.voicing-grid');
      els.detail = h('aside.card.cl-detail');
      root.appendChild(h('div.cl-layout', [
        h('section.card.cl-main', [
          h('header.card-head', [h('h2', 'Voicings'), h('span.card-tag', 'low to high')]),
          els.grid
        ]),
        els.detail
      ]));

      renderFavourites();
      refresh();
    },
    unmount: function () {
      GL.guitar.stopAll();
      els = {};
    }
  });
}(window.GL = window.GL || {}));
