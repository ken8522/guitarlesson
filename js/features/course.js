/* course.js -- the lesson path: track list, lesson renderer, progress.

   Lessons are data (js/data/lessons-*.js), not markup. Every section type here
   renders itself from the same engines the rest of the app uses, so a chord
   printed in a lesson is a chord the voicing search found and can play, not a
   picture of one.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var TRACKS = [
    { id: 'A', key: 'barre', name: 'Barre chords and chord mastery',
      blurb: 'The whole neck from two shapes, then triads, slash chords, colour and substitution.' },
    { id: 'B', key: 'fingerstyle', name: 'Fingerstyle',
      blurb: 'Alternating bass, Travis picking, Piedmont blues, ragtime, percussion and chord melody.' },
    { id: 'C', key: 'fretboard', name: 'Fretboard and improvisation',
      blurb: 'Knowing the neck, the five positions, chord tones, phrasing, and playing the changes.' },
    { id: 'D', key: 'rhythm', name: 'Rhythm and groove',
      blurb: 'The sixteenth grid, boom-chick, shuffle, odd meters, dynamics and metronome discipline.' },
    { id: 'E', key: 'theory', name: 'Theory and ear',
      blurb: 'Intervals, keys, harmonising scales, hearing progressions, and transcribing.' },
    { id: 'F', key: 'tunings', name: 'Alternate tunings',
      blurb: 'DADGAD, open G, open D, drop D and more, each with its own shapes and repertoire.' }
  ];

  var metronome = null;
  var els = {};

  /* ---------------------------------------------------------------- state */

  function lessonsFor(track) {
    return (GL.lessons && GL.lessons[track.key]) || [];
  }

  function allLessons() {
    var out = [];
    TRACKS.forEach(function (t) {
      lessonsFor(t).forEach(function (l) { out.push(l); });
    });
    return out;
  }

  function findLesson(id) {
    return allLessons().filter(function (l) { return l.id === id; })[0] || null;
  }

  function record(id) {
    var p = GL.app.state.progress.lessons;
    if (!p[id]) p[id] = { done: false, checks: [], opened: null };
    return p[id];
  }

  function trackProgress(track) {
    var list = lessonsFor(track);
    var done = list.filter(function (l) {
      return (GL.app.state.progress.lessons[l.id] || {}).done;
    }).length;
    return { done: done, total: list.length };
  }

  /* -------------------------------------------------------------- playback */

  function tuning() { return GL.app.tuning(); }
  function tone() { return GL.app.state.settings.tone || 'steel'; }

  /* A section may pin its own tuning -- the alternate-tunings track does, and
     its shapes are meaningless in any other. Everything downstream takes the
     tuning as an argument rather than reading the app setting. */
  function tuningFor(section) {
    if (section && section.tuning && GL.notes.TUNINGS[section.tuning]) {
      return GL.notes.TUNINGS[section.tuning].strings;
    }
    return tuning();
  }

  /* Resolve a lesson's chord item to real frets: either the shape the lesson
     pins, or the best one the search finds in this section's tuning. */
  function shapeFor(item, tun) {
    tun = tun || tuning();
    if (item.frets) {
      var fing = GL.chords.fingering(item.frets);
      return {
        frets: item.frets,
        fingers: fing ? fing.fingers : [0, 0, 0, 0, 0, 0],
        barres: fing ? fing.barres : [],
        caged: GL.chords.cagedForm(item.frets, GL.chords.parse(item.symbol))
      };
    }
    return GL.chords.voicings(item.symbol, { tuning: tun, maxFret: 12, limit: 1 })[0] || null;
  }

  function strum(shape, when, velocity, direction, tun) {
    if (!shape) return;
    GL.guitar.strum({
      frets: shape.frets, tuning: tun || tuning(), when: when,
      direction: direction || 'down', velocity: velocity === undefined ? 0.8 : velocity,
      tone: tone()
    });
  }

  /* A plain folk strum, so a progression sounds like music rather than four
     block chords. Down on 1 and 3, up on the off-beats after 2 and 4. */
  function playProgression(section) {
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);
    var bpm = section.tempo || 84;
    var beat = 60 / bpm;
    var per = section.beatsPerChord || 4;
    var t0 = GL.audio.now() + 0.12;

    var tun = tuningFor(section);
    section.items.forEach(function (item, i) {
      var shape = shapeFor(item, tun);
      if (!shape) return;
      var bar = t0 + i * per * beat;
      strum(shape, bar, 0.85, 'down', tun);
      if (per >= 3) strum(shape, bar + 1.5 * beat, 0.5, 'up', tun);
      if (per >= 3) strum(shape, bar + 2 * beat, 0.72, 'down', tun);
      if (per >= 4) strum(shape, bar + 3.5 * beat, 0.55, 'up', tun);
    });
  }

  function playTab(section) {
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);
    var parsed = GL.tab.parseSong({ sections: [{ name: '', bars: section.bars }] });
    var bpm = section.tempo || 80;
    var beat = 60 / bpm;
    var t0 = GL.audio.now() + 0.12;
    var tun = tuningFor(section);
    parsed.events.forEach(function (e) {
      GL.guitar.note({
        midi: notes.fretMidi(tun, e.stringIndex, e.fret),
        when: t0 + e.beat * beat,
        dur: e.ring ? undefined : e.dur * beat,
        velocity: e.dead ? 0.4 : 0.78,
        tone: section.tone || 'finger',
        stringIndex: e.stringIndex,
        slideTo: e.artic && e.to !== null
          ? notes.fretMidi(tun, e.stringIndex, e.to) : undefined,
        slideTime: e.artic === 's' ? 0.12 : 0.05
      });
    });
    return parsed;
  }

  /* --------------------------------------------------------------- sections */

  function renderSection(s) {
    switch (s.type) {
      case 'heading':
        return h('h3.lesson-heading', s.body);

      case 'text':
        return h('p.lesson-text', s.body);

      case 'list':
        return h('ul.lesson-list', s.items.map(function (i) { return h('li', i); }));

      case 'callout':
        return h('div.callout.is-' + (s.kind || 'note'), [
          h('span.callout-tag', s.kind === 'tip' ? 'Tip' : s.kind === 'warning' ? 'Watch out' : 'Note'),
          h('p', s.body)
        ]);

      case 'chords':
        return renderChords(s);

      case 'progression':
        return renderProgression(s);

      case 'fretboard':
        return renderFretboard(s);

      case 'tab':
        return renderTab(s);

      default:
        return h('p.lesson-text', String(s.body || ''));
    }
  }

  function renderChords(s) {
    var tun = tuningFor(s);
    var row = h('div.lesson-chords', s.items.map(function (item) {
      var shape = shapeFor(item, tun);
      if (!shape) return h('div.empty', 'No shape for ' + item.symbol + ' in this tuning.');
      return h('button.lesson-chord', {
        type: 'button',
        onclick: function () {
          GL.audio.unlock();
          strum(shape, undefined, 0.82, 'down', tun);
        }
      }, [
        h('div', { html: GL.render.voicingDiagram(shape, { name: item.symbol, size: 'md' }) }),
        item.caption ? h('span.lesson-chord-cap', item.caption) : null
      ]);
    }));

    return h('div', [
      row,
      s.note ? h('p.hint', s.note) : null,
      h('div.row', [h('button.btn.btn-sm', {
        type: 'button',
        onclick: function () {
          GL.audio.unlock();
          GL.guitar.stopAll(0.05);
          var t0 = GL.audio.now() + 0.1;
          s.items.forEach(function (item, i) {
            strum(shapeFor(item, tun), t0 + i * 1.1, 0.82, 'down', tun);
          });
        }
      }, 'Play them in order')])
    ]);
  }

  function renderProgression(s) {
    var tun = tuningFor(s);
    var row = h('div.lesson-chords', s.items.map(function (item) {
      var shape = shapeFor(item, tun);
      if (!shape) return h('div.empty', item.symbol + '?');
      return h('button.lesson-chord', {
        type: 'button',
        onclick: function () { GL.audio.unlock(); strum(shape, undefined, 0.82, 'down', tun); }
      }, [
        h('div', { html: GL.render.voicingDiagram(shape, { name: item.symbol, size: 'sm' }) }),
        item.label ? h('span.lesson-chord-cap', item.label) : null
      ]);
    }));

    return h('div.lesson-prog', [
      row,
      h('div.row.row-wrap', [
        h('button.btn.btn-sm.btn-primary', {
          type: 'button',
          onclick: function () { playProgression(s); }
        }, 'Play the progression'),
        h('span.hint', (s.tempo || 84) + ' bpm, ' + (s.beatsPerChord || 4) + ' beats each')
      ]),
      s.caption ? h('p.hint', s.caption) : null
    ]);
  }

  function renderFretboard(s) {
    var cells;
    var tun = tuningFor(s);

    if (s.singleString !== undefined) {
      /* One string, named notes -- for learning where the roots live. */
      var si = notes.strIndex(s.singleString);
      var t = tun;
      cells = [];
      for (var f = 0; f <= (s.toFret || 12); f++) {
        var pc = notes.mod12(t[si] + f);
        cells.push({
          stringIndex: si, fret: f, pc: pc,
          note: notes.pcName(pc), label: notes.pcName(pc),
          isRoot: [0, 2, 4, 5, 7, 9, 11].indexOf(pc) !== -1 && !/#|b/.test(notes.pcName(pc))
        });
      }
    } else if (s.cells) {
      cells = s.cells;
    } else {
      var opts = { tuning: tun, maxFret: s.toFret || 15 };
      if (s.mode && s.mode !== 'whole') {
        var positions = GL.scales.positions(s.root, s.scale, {
          tuning: tun, mode: s.mode, maxFret: 17
        });
        var p = positions[s.position || 0];
        cells = p ? p.cells : [];
      } else {
        cells = GL.scales.onFretboard(s.root, s.scale, opts);
      }
    }

    return h('div', [
      h('div.neckwrap', {
        html: GL.render.fretboard({
          cells: cells, tuning: tun,
          toFret: s.toFret || (s.singleString !== undefined ? 12 : 15),
          label: s.label || 'degree'
        })
      }),
      s.caption ? h('p.hint', s.caption) : null,
      h('div.row', [h('button.btn.btn-sm', {
        type: 'button',
        onclick: function () {
          GL.audio.unlock();
          GL.guitar.stopAll(0.05);
          var t0 = GL.audio.now() + 0.1;
          var seq = cells.slice().sort(function (a, b) {
            return (a.midi || 0) - (b.midi || 0);
          });
          seq.forEach(function (c, i) {
            var midi = c.midi !== undefined ? c.midi : notes.fretMidi(tun, c.stringIndex, c.fret);
            GL.guitar.note({
              midi: midi, when: t0 + i * 0.16, velocity: 0.72,
              tone: 'finger', stringIndex: c.stringIndex
            });
          });
        }
      }, 'Play these notes')])
    ]);
  }

  function renderTab(s) {
    var parsed = GL.tab.parseSong({ sections: [{ name: s.name || '', bars: s.bars }] });
    return h('div.lesson-tab', [
      h('div.tabwrap', { html: GL.render.tabStaff({ parsed: parsed, showBeats: true }) }),
      h('div.row.row-wrap', [
        h('button.btn.btn-sm.btn-primary', {
          type: 'button', onclick: function () { playTab(s); }
        }, 'Play it'),
        h('span.hint', (s.tempo || 80) + ' bpm')
      ]),
      s.caption ? h('p.hint', s.caption) : null
    ]);
  }

  /* ----------------------------------------------------------- lesson view */

  function renderLesson(root, lesson) {
    var rec = record(lesson.id);
    rec.opened = new Date().toISOString();
    GL.app.save();

    var track = TRACKS.filter(function (t) { return t.id === lesson.track; })[0];
    var list = lessonsFor(track);
    var index = list.indexOf(lesson);

    root.appendChild(h('div.view-head', [
      h('button.btn.btn-sm.backlink', {
        type: 'button', onclick: function () { GL.app.navigate('course'); }
      }, '‹  All lessons'),
      h('p.lesson-track', track.id + ' · ' + track.name + '  ·  lesson ' + (index + 1) + ' of ' + list.length),
      h('h1', lesson.title),
      h('p.lesson-goal', lesson.goal),
      h('p.view-sub', 'About ' + lesson.time + ' minutes.')
    ]));

    var body = h('section.card.lesson-body');
    lesson.sections.forEach(function (s) {
      var el = renderSection(s);
      if (el) body.appendChild(el);
    });
    root.appendChild(body);

    if (lesson.drill) root.appendChild(renderDrill(lesson.drill));
    root.appendChild(renderChecks(lesson, rec));

    /* Move on. */
    var nav = h('div.lesson-nav');
    if (index > 0) {
      nav.appendChild(h('button.btn', {
        type: 'button',
        onclick: function () { GL.app.navigate('course', 'l=' + list[index - 1].id); }
      }, '‹  ' + list[index - 1].title));
    }
    if (index < list.length - 1) {
      nav.appendChild(h('button.btn', {
        type: 'button',
        onclick: function () { GL.app.navigate('course', 'l=' + list[index + 1].id); }
      }, list[index + 1].title + '  ›'));
    }
    root.appendChild(nav);
  }

  function renderDrill(drill) {
    var card = h('section.card.drill');
    card.appendChild(h('header.card-head', [
      h('h2', 'Practise this'),
      h('span.card-tag', drill.bpm ? drill.bpm.start + ' to ' + drill.bpm.target + ' bpm' : 'drill')
    ]));
    card.appendChild(h('h3.drill-name', drill.name));
    card.appendChild(h('p.lesson-text', drill.how));

    if (!drill.bpm) return card;

    var bpmLabel = h('span.drill-bpm', String(drill.bpm.start));

    function ensure() {
      if (metronome) return metronome;
      metronome = GL.metronome.create({
        bpm: drill.bpm.start,
        beatsPerBar: (drill.metronome && drill.metronome.beatsPerBar) || 4,
        subdivision: (drill.metronome && drill.metronome.subdivision) || 1,
        onBeat: function (info) {
          if (info.beat === 0 && info.isBeat) bpmLabel.textContent = String(Math.round(info.bpm));
        }
      });
      return metronome;
    }

    var startBtn = h('button.btn.btn-primary', {
      type: 'button',
      onclick: function () {
        var m = ensure();
        if (m.isRunning()) {
          m.stop();
          this.textContent = 'Start at ' + drill.bpm.start;
          this.classList.remove('is-live');
        } else {
          m.setBpm(drill.bpm.start);
          m.state.beatsPerBar = (drill.metronome && drill.metronome.beatsPerBar) || 4;
          m.state.subdivision = (drill.metronome && drill.metronome.subdivision) || 1;
          m.start();
          bpmLabel.textContent = String(drill.bpm.start);
          this.textContent = 'Stop';
          this.classList.add('is-live');
        }
      }
    }, 'Start at ' + drill.bpm.start);

    card.appendChild(h('div.row.row-wrap.drill-controls', [
      startBtn,
      h('button.btn', {
        type: 'button',
        onclick: function () {
          var m = ensure();
          if (!m.isRunning()) {
            m.setBpm(drill.bpm.start);
            m.start();
            startBtn.textContent = 'Stop';
            startBtn.classList.add('is-live');
          }
          m.rampTo(drill.bpm.target, 8 * 60);
          GL.app.toast('Climbing to ' + drill.bpm.target + ' bpm over 8 minutes');
        }
      }, 'Ramp to ' + drill.bpm.target),
      h('div.drill-readout', [bpmLabel, h('span.metro-unit', 'bpm')])
    ]));

    return card;
  }

  function renderChecks(lesson, rec) {
    var card = h('section.card.checks');
    card.appendChild(h('header.card-head', [
      h('h2', 'You have got it when'),
      h('span.card-tag', 'be honest')
    ]));

    var boxes = [];
    lesson.checks.forEach(function (text, i) {
      var input = h('input', {
        type: 'checkbox',
        checked: rec.checks[i] ? true : null,
        onchange: function () {
          rec.checks[i] = this.checked;
          GL.app.save();
          syncDone();
        }
      });
      boxes.push(input);
      card.appendChild(h('label.check.check-block', [input, h('span', text)]));
    });

    var doneBtn = h('button.btn.btn-primary', {
      type: 'button',
      onclick: function () {
        rec.done = !rec.done;
        rec.at = rec.done ? new Date().toISOString() : null;
        GL.app.save();
        syncDone();
        GL.app.toast(rec.done ? 'Marked complete' : 'Marked not done');
      }
    }, rec.done ? 'Completed' : 'Mark complete');

    function syncDone() {
      doneBtn.textContent = rec.done ? 'Completed' : 'Mark complete';
      doneBtn.classList.toggle('is-done', !!rec.done);
      var all = lesson.checks.length && lesson.checks.every(function (_, i) { return rec.checks[i]; });
      hint.textContent = rec.done ? ''
        : all ? 'All three ticked. Worth marking this one done.' : '';
    }
    var hint = h('p.hint');

    card.appendChild(h('div.row.row-wrap', [doneBtn]));
    card.appendChild(hint);
    syncDone();
    return card;
  }

  /* ------------------------------------------------------------ track list */

  function renderTrackList(root) {
    var lessons = allLessons();
    var doneCount = lessons.filter(function (l) {
      return (GL.app.state.progress.lessons[l.id] || {}).done;
    }).length;

    root.appendChild(h('div.view-head', [
      h('h1', 'The course'),
      h('p.view-sub',
        'Six tracks for a player who already has open chords under their fingers. ' +
        'They are independent — take them in any order, or run two at once.')
    ]));

    root.appendChild(h('section.card.course-summary', [
      h('div.statrow', [
        h('div.stat', [h('span.stat-value', doneCount + '/' + lessons.length), h('span.stat-label', 'lessons done')]),
        h('div.stat', [h('span.stat-value', String(TRACKS.length)), h('span.stat-label', 'tracks')]),
        h('div.stat', [h('span.stat-value',
          String(lessons.reduce(function (a, l) { return a + (l.time || 0); }, 0)) + 'm'),
          h('span.stat-label', 'total material')])
      ])
    ]));

    TRACKS.forEach(function (track) {
      var list = lessonsFor(track);
      var prog = trackProgress(track);
      var card = h('section.card.track');

      card.appendChild(h('header.track-head', [
        h('div', [
          h('span.track-id', track.id),
          h('h2', track.name),
          h('p.track-blurb', track.blurb)
        ]),
        h('div.track-count', [
          h('span.track-count-num', prog.done + '/' + prog.total),
          h('span.stat-label', 'done')
        ])
      ]));

      card.appendChild(h('div.track-bar', [
        h('div.track-bar-fill', {
          style: { width: (prog.total ? (prog.done / prog.total * 100) : 0) + '%' }
        })
      ]));

      if (!list.length) {
        card.appendChild(h('p.hint', 'Lessons for this track are still being written.'));
      } else {
        card.appendChild(h('ol.lesson-list-ol', list.map(function (l) {
          var rec = GL.app.state.progress.lessons[l.id] || {};
          return h('li.lesson-row' + (rec.done ? '.is-done' : ''), [
            h('button.lesson-link', {
              type: 'button',
              onclick: function () { GL.app.navigate('course', 'l=' + l.id); }
            }, [
              h('span.lesson-tick', rec.done ? '✓' : ''),
              h('span.lesson-row-title', l.title),
              h('span.lesson-row-goal', l.goal),
              h('span.lesson-row-time', l.time + 'm')
            ])
          ]);
        })));
      }

      root.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ view */

  GL.app.register('course', {
    title: 'Course',
    navLabel: 'Course',
    icon: '&#9834;',
    mount: function (root, params) {
      if (params && params.l) {
        var lesson = findLesson(params.l);
        if (lesson) { renderLesson(root, lesson); return; }
        GL.app.toast('No lesson called "' + params.l + '"', 'error');
      }
      renderTrackList(root);
    },
    unmount: function () {
      if (metronome && metronome.isRunning()) metronome.stop();
      GL.guitar.stopAll();
      els = {};
    }
  });

  GL.course = { TRACKS: TRACKS, allLessons: allLessons, findLesson: findLesson };
}(window.GL = window.GL || {}));
