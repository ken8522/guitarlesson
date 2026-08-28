/* songs.js -- the repertoire, the tab player, and the reference index.

   Two halves, and they are deliberately different things:

     Repertoire  public-domain songs with chords and, where there is one, a
                 playable tab. Everything sounds in the app.
     Index       well-known songs still in copyright. Facts only -- key, capo,
                 chords, progression shape -- with links out to a licensed
                 chart, and a backing track built from the progression so the
                 changes can be practised.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var ui = { pane: 'repertoire', genre: 'all', maxDifficulty: 5, search: '', indexSearch: '', chordFilter: '' };

  var player = null;      /* tab playback state */
  var backing = null;     /* backing-track engine */
  var raf = null;

  /* ---------------------------------------------------------------- data */

  function allSongs() {
    var out = [];
    Object.keys(GL.songs || {}).forEach(function (k) {
      (GL.songs[k] || []).forEach(function (s) { out.push(s); });
    });
    return out;
  }

  function findSong(id) {
    return allSongs().filter(function (s) { return s.id === id; })[0] || null;
  }

  function genres() {
    var seen = {};
    allSongs().forEach(function (s) { seen[s.genre] = 1; });
    return Object.keys(seen).sort();
  }

  function songTuning(song) {
    var t = GL.notes.TUNINGS[song.tuning || 'standard'];
    return (t || GL.notes.TUNINGS.standard).strings;
  }

  /* -------------------------------------------------------------- playback */

  function stopEverything() {
    if (backing && backing.isRunning()) backing.stop();
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    player = null;
    GL.guitar.stopAll(0.08);
  }

  /* Schedule an entire tab excerpt and animate a playhead against the audio
     clock. The excerpts are a few bars long, so scheduling them in one go is
     simpler than a lookahead loop and exactly as accurate. */
  function playTab(song, parsed, opts) {
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);

    var bpm = opts.bpm;
    var beat = 60 / bpm;
    var tun = songTuning(song);
    var t0 = GL.audio.now() + 0.2;

    if (opts.countIn) {
      var per = (song.timeSig ? song.timeSig[0] : 4);
      for (var c = 0; c < per; c++) GL.drums.hat(t0 + c * beat, c === 0 ? 0.5 : 0.3);
      t0 += per * beat;
    }

    parsed.events.forEach(function (e) {
      GL.guitar.note({
        midi: notes.fretMidi(tun, e.stringIndex, e.fret),
        when: t0 + e.beat * beat,
        dur: e.ring ? undefined : e.dur * beat,
        velocity: e.dead ? 0.4 : 0.78,
        tone: song.tab.tone || 'finger',
        stringIndex: e.stringIndex,
        slideTo: e.artic && e.to !== null ? notes.fretMidi(tun, e.stringIndex, e.to) : undefined,
        slideTime: e.artic === 's' ? 0.12 : 0.05
      });
    });

    player = { t0: t0, beat: beat, total: parsed.totalBeats, parsed: parsed, song: song, opts: opts };
    if (raf) cancelAnimationFrame(raf);
    tick();
  }

  function tick() {
    if (!player) return;
    raf = requestAnimationFrame(tick);
    var svg = GL.app.$('.tabwrap svg');
    if (!svg) return;
    var pos = (GL.audio.now() - player.t0) / player.beat;
    if (pos < 0) pos = 0;
    if (pos > player.total) {
      if (player.opts.loop) {
        playTab(player.song, player.parsed, player.opts);
        return;
      }
      cancelAnimationFrame(raf);
      raf = null;
      GL.render.movePlayhead(svg, -1, { pxPerBeat: 46 });
      player = null;
      var btn = GL.app.$('.tab-play');
      if (btn) { btn.textContent = 'Play'; btn.classList.remove('is-live'); }
      return;
    }
    GL.render.movePlayhead(svg, pos, { pxPerBeat: 46 });
  }

  /* Flatten a song's form into one chord per bar for the backing engine. */
  function formChords(song) {
    var out = [];
    (song.form || []).forEach(function (section) {
      section.bars.forEach(function (c) { out.push(c); });
    });
    return out;
  }

  /* -------------------------------------------------------- repertoire list */

  function renderList(root) {
    var filters = h('section.card', [
      h('div.grid.grid-2', [
        h('label.field', [h('span', 'Genre'), h('select.select', {
          onchange: function () { ui.genre = this.value; refreshList(); }
        }, [h('option', { value: 'all', selected: ui.genre === 'all' }, 'All genres')].concat(
          genres().map(function (g) {
            return h('option', { value: g, selected: ui.genre === g }, g);
          })
        ))]),
        h('label.field', [h('span', 'Up to difficulty ' + ui.maxDifficulty), h('input.slider', {
          type: 'range', min: 1, max: 5, step: 1, value: ui.maxDifficulty,
          oninput: function () { ui.maxDifficulty = Number(this.value); refreshList(); }
        })]),
        h('label.field', [h('span', 'Search'), h('input.input', {
          type: 'search', placeholder: 'title, origin, tag',
          value: ui.search,
          oninput: function () { ui.search = this.value; refreshList(); }
        })]),
        h('label.field', [h('span', 'Uses this chord'), h('input.input', {
          type: 'search', placeholder: 'e.g. Bm',
          value: ui.chordFilter,
          oninput: function () { ui.chordFilter = this.value.trim(); refreshList(); }
        })])
      ])
    ]);

    var list = h('div.songgrid');
    root.appendChild(filters);
    root.appendChild(list);

    function refreshList() {
      clear(list);
      var q = ui.search.toLowerCase();
      var matches = allSongs().filter(function (s) {
        if (ui.genre !== 'all' && s.genre !== ui.genre) return false;
        if (s.difficulty > ui.maxDifficulty) return false;
        if (ui.chordFilter && s.chords.indexOf(ui.chordFilter) === -1) return false;
        if (!q) return true;
        return (s.title + ' ' + s.origin + ' ' + (s.tags || []).join(' ')).toLowerCase().indexOf(q) !== -1;
      });

      if (!matches.length) {
        list.appendChild(h('p.empty', 'Nothing matches those filters.'));
        return;
      }

      matches.forEach(function (s) {
        list.appendChild(h('button.songcard', {
          type: 'button',
          onclick: function () { GL.app.navigate('songs', 's=' + s.id); }
        }, [
          h('div.songcard-top', [
            h('h3', s.title),
            h('span.diff', '•'.repeat(s.difficulty))
          ]),
          h('p.songcard-origin', s.origin),
          h('div.songcard-meta', [
            h('span.pill', s.genre),
            h('span.pill', 'key of ' + s.key),
            s.capo ? h('span.pill', 'capo ' + s.capo) : null,
            s.tuning && s.tuning !== 'standard' ? h('span.pill.is-alt', notes.TUNINGS[s.tuning].name) : null,
            s.tab ? h('span.pill.is-tab', 'tab') : null
          ]),
          h('p.songcard-chords', s.chords.join('  '))
        ]));
      });
    }

    refreshList();
  }

  /* ------------------------------------------------------------ song detail */

  function renderSong(root, song) {
    var tun = songTuning(song);
    var beatsPerBar = song.timeSig ? song.timeSig[0] : 4;

    root.appendChild(h('div.view-head', [
      h('button.btn.btn-sm.backlink', {
        type: 'button', onclick: function () { GL.app.navigate('songs'); }
      }, '‹  All songs'),
      h('h1', song.title),
      h('p.lesson-goal', song.origin),
      h('div.songcard-meta', [
        h('span.pill', song.genre),
        h('span.pill', 'key of ' + song.key),
        h('span.pill', song.tempo + ' bpm'),
        h('span.pill', beatsPerBar + '/' + (song.timeSig ? song.timeSig[1] : 4)),
        song.capo ? h('span.pill', 'capo ' + song.capo) : null,
        h('span.pill' + (song.tuning !== 'standard' ? '.is-alt' : ''),
          notes.TUNINGS[song.tuning || 'standard'].name)
      ])
    ]));

    root.appendChild(h('section.card', [h('p.lesson-text', song.about)]));

    /* Chords. */
    root.appendChild(h('section.card', [
      h('header.card-head', [h('h2', 'The chords'), h('span.card-tag', song.chords.length + ' shapes')]),
      h('div.lesson-chords', song.chords.map(function (sym) {
        var v = GL.chords.voicings(sym, { tuning: tun, maxFret: 9, limit: 1 })[0];
        if (!v) return h('div.empty', sym);
        return h('button.lesson-chord', {
          type: 'button',
          onclick: function () {
            GL.audio.unlock();
            GL.guitar.strum({ frets: v.frets, tuning: tun, velocity: 0.82, tone: 'steel' });
          }
        }, [h('div', { html: GL.render.voicingDiagram(v, { name: sym, size: 'md' }) })]);
      }))
    ]));

    /* Form, with a backing band. */
    if (song.form && song.form.length) {
      root.appendChild(renderForm(song, tun, beatsPerBar));
    }

    /* Tab, if the song has one. */
    if (song.tab) {
      root.appendChild(renderTabPlayer(song));
    }
  }

  function renderForm(song, tun, beatsPerBar) {
    var card = h('section.card');
    card.appendChild(h('header.card-head', [
      h('h2', 'The form'),
      h('span.card-tag', 'play along')
    ]));

    song.form.forEach(function (section) {
      card.appendChild(h('h3.detail-sub', section.name));
      card.appendChild(h('div.barchart', section.bars.map(function (c, i) {
        return h('span.barcell' + (i % 4 === 0 ? '.is-downbeat' : ''), c);
      })));
    });

    var styleSelect = h('select.select', {
      onchange: function () { if (backing) backing.setStyle(this.value); }
    }, Object.keys(GL.backing.STYLES).map(function (k) {
      var def = beatsPerBar === 3 ? 'waltz' : (song.genre === 'Blues' ? 'blues' : 'folk');
      return h('option', { value: k, selected: k === def }, GL.backing.STYLES[k].drums === 'none'
        ? k : k.charAt(0).toUpperCase() + k.slice(1));
    }));

    var tempoLabel = h('span.field-value', song.tempo + ' bpm');
    var tempoSlider = h('input.slider', {
      type: 'range', min: 40, max: 200, step: 2, value: song.tempo,
      oninput: function () {
        tempoLabel.textContent = this.value + ' bpm';
        if (backing) backing.setTempo(Number(this.value));
      }
    });

    var nowPlaying = h('span.hint');

    var playBtn = h('button.btn.btn-primary', {
      type: 'button',
      onclick: function () {
        var self = this;
        if (backing && backing.isRunning()) {
          backing.stop();
          self.textContent = 'Play the band';
          self.classList.remove('is-live');
          nowPlaying.textContent = '';
          return;
        }
        backing = GL.backing.create({
          chords: formChords(song),
          beatsPerBar: beatsPerBar,
          style: styleSelect.value,
          tempo: Number(tempoSlider.value),
          tuning: tun,
          onBar: function (i, chord, when) {
            var delay = Math.max(0, (when - GL.audio.now()) * 1000);
            setTimeout(function () {
              nowPlaying.textContent = 'bar ' + (i + 1) + '  ·  ' + chord.symbol;
              GL.app.$$('.barcell').forEach(function (b, n) {
                b.classList.toggle('is-now', n === i);
              });
            }, delay);
          }
        });
        backing.start();
        self.textContent = 'Stop';
        self.classList.add('is-live');
      }
    }, 'Play the band');

    card.appendChild(h('div.grid.grid-2', [
      h('label.field', [h('span', 'Style'), styleSelect]),
      h('label.field', [h('span', tempoLabel), tempoSlider])
    ]));
    card.appendChild(h('div.row.row-wrap', [playBtn, nowPlaying]));
    return card;
  }

  function renderTabPlayer(song) {
    var parsed = GL.tab.parseSong({ sections: [{ name: song.tab.name || '', bars: song.tab.bars }] });
    var card = h('section.card');

    card.appendChild(h('header.card-head', [
      h('h2', song.tab.name || 'Tab'),
      h('span.card-tag', parsed.bars.length + ' bars')
    ]));

    card.appendChild(h('div.tabwrap', {
      html: GL.render.tabStaff({ parsed: parsed, showBeats: true })
    }));

    var opts = { bpm: song.tab.tempo || song.tempo, loop: false, countIn: true };
    var tempoLabel = h('span.field-value', opts.bpm + ' bpm');

    var playBtn = h('button.btn.btn-primary.tab-play', {
      type: 'button',
      onclick: function () {
        if (player) {
          stopEverything();
          this.textContent = 'Play';
          this.classList.remove('is-live');
          return;
        }
        playTab(song, parsed, opts);
        this.textContent = 'Stop';
        this.classList.add('is-live');
      }
    }, 'Play');

    card.appendChild(h('div.grid.grid-2', [
      h('label.field', [h('span', tempoLabel), h('input.slider', {
        type: 'range', min: 30, max: 200, step: 2, value: opts.bpm,
        oninput: function () { opts.bpm = Number(this.value); tempoLabel.textContent = opts.bpm + ' bpm'; }
      })]),
      h('div.field', [h('span', 'Options'), h('label.check', [
        h('input', { type: 'checkbox', onchange: function () { opts.loop = this.checked; } }),
        h('span', 'Loop')
      ]), h('label.check', [
        h('input', { type: 'checkbox', checked: true, onchange: function () { opts.countIn = this.checked; } }),
        h('span', 'Count in')
      ])])
    ]));
    card.appendChild(h('div.row.row-wrap', [playBtn]));
    return card;
  }

  /* ------------------------------------------------------------- the index */

  function renderIndex(root) {
    root.appendChild(h('section.card.notice', [
      h('h3', 'What this list is, and is not'),
      h('p.lesson-text',
        'These songs are still in copyright, so no lyrics and no transcriptions appear here. ' +
        'What is listed is reference data — the key people play them in, the capo, the chords they ' +
        'need and the shape of the progression. For the chart itself, follow the link. To practise ' +
        'the changes, press "jam" and the app will build a backing track from the progression.')
    ]));

    var results = h('div.indexlist');
    var count = h('span.hint');

    root.appendChild(h('section.card', [
      h('div.grid.grid-2', [
        h('label.field', [h('span', 'Search'), h('input.input', {
          type: 'search', placeholder: 'title, artist, tag, key',
          value: ui.indexSearch,
          oninput: function () { ui.indexSearch = this.value; refresh(); }
        })]),
        h('label.field', [h('span', 'Uses this chord'), h('input.input', {
          type: 'search', placeholder: 'e.g. F#m',
          oninput: function () { ui.idxChord = this.value.trim(); refresh(); }
        })])
      ]),
      count
    ]));
    root.appendChild(results);

    function refresh() {
      clear(results);
      var q = (ui.indexSearch || '').toLowerCase();
      var chord = ui.idxChord;
      var matches = GL.songIndex.filter(function (e) {
        if (chord && e.chords.indexOf(chord) === -1) return false;
        if (!q) return true;
        return (e.title + ' ' + e.artist + ' ' + e.key + ' ' + (e.tags || []).join(' '))
          .toLowerCase().indexOf(q) !== -1;
      });
      count.textContent = matches.length + ' of ' + GL.songIndex.length + ' songs';

      matches.slice(0, 120).forEach(function (e) {
        var links = GL.songIndexLinks(e);
        results.appendChild(h('div.indexrow', [
          h('div.indexrow-main', [
            h('strong', e.title),
            h('span.indexrow-artist', e.artist + '  ·  ' + e.year)
          ]),
          h('div.indexrow-meta', [
            h('span.pill', e.key),
            e.capo ? h('span.pill', 'capo ' + e.capo) : null,
            h('span.pill', '•'.repeat(e.difficulty)),
            e.progression ? h('span.pill.is-prog', e.progression) : null
          ]),
          h('div.indexrow-chords', e.chords.join('  ')),
          h('div.indexrow-links', [
            h('button.btn.btn-sm', {
              type: 'button',
              onclick: function () { jamOn(e, this); }
            }, 'Jam the changes')
          ].concat(links.map(function (l) {
            return h('a.btn.btn-sm', { href: l.url, target: '_blank', rel: 'noopener noreferrer' }, l.label);
          })))
        ]));
      });

      if (matches.length > 120) {
        results.appendChild(h('p.hint', 'Showing the first 120. Narrow the search to see the rest.'));
      }
    }

    function jamOn(entry, btn) {
      if (backing && backing.isRunning()) {
        backing.stop();
        GL.app.$$('.indexrow-links .btn').forEach(function (b) {
          if (b.textContent === 'Stop') { b.textContent = 'Jam the changes'; b.classList.remove('is-live'); }
        });
        if (btn.textContent === 'Stop') { btn.textContent = 'Jam the changes'; btn.classList.remove('is-live'); return; }
      }
      backing = GL.backing.create({
        chords: entry.chords,
        beatsPerBar: 4,
        style: /blues/.test((entry.tags || []).join(' ')) ? 'blues' : 'folk',
        tempo: 92,
        tuning: GL.app.tuning()
      });
      backing.start();
      btn.textContent = 'Stop';
      btn.classList.add('is-live');
      GL.app.toast('Backing track on ' + entry.chords.join(' - ') + '. It loops until you stop it.');
    }

    refresh();
  }

  /* ------------------------------------------------------------------ view */

  GL.app.register('songs', {
    title: 'Songs',
    navLabel: 'Songs',
    icon: '&#9836;',
    mount: function (root, params) {
      if (params && params.s) {
        var song = findSong(params.s);
        if (song) { renderSong(root, song); return; }
      }

      root.appendChild(h('div.view-head', [
        h('h1', 'Songs'),
        h('p.view-sub',
          allSongs().length + ' songs with chords and playable tab, plus ' + GL.songIndex.length +
          ' well-known songs indexed for reference.')
      ]));

      var panes = h('div.subtabs', [
        h('button.subtab' + (ui.pane === 'repertoire' ? '.is-on' : ''), {
          type: 'button',
          onclick: function () { ui.pane = 'repertoire'; GL.app.navigate('songs'); }
        }, 'Repertoire'),
        h('button.subtab' + (ui.pane === 'index' ? '.is-on' : ''), {
          type: 'button',
          onclick: function () { ui.pane = 'index'; GL.app.navigate('songs'); }
        }, 'Song index')
      ]);
      root.appendChild(panes);

      if (ui.pane === 'index') renderIndex(root);
      else renderList(root);
    },
    unmount: stopEverything
  });

  GL.songLibrary = { allSongs: allSongs, findSong: findSong };
}(window.GL = window.GL || {}));
