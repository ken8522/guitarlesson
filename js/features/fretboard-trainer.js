/* fretboard-trainer.js -- drills for actually knowing the neck.

   Three modes, in the order they are worth doing:

     Name the note   a position is marked, say what it is. Recognition.
     Find the note   a note is named, find it. Recall, which is much harder.
     Find the interval  a root is marked, find the note a given interval above.
                     This is the one that makes CAGED and arpeggios usable,
                     because it is what you are really doing when you improvise.

   Every answer sounds the note. Knowing where the b7 is matters less than
   knowing what it does, and the two are learned together or not at all.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var NOTE_BUTTONS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  /* The intervals worth drilling, in the order they turn up in real playing. */
  var INTERVALS = [
    { semi: 3, label: 'b3' }, { semi: 4, label: '3' }, { semi: 7, label: '5' },
    { semi: 10, label: 'b7' }, { semi: 11, label: '7' }, { semi: 5, label: '4' },
    { semi: 9, label: '6' }, { semi: 2, label: '9' }, { semi: 6, label: 'b5' },
    { semi: 8, label: 'b6' }, { semi: 1, label: 'b2' }, { semi: 12, label: 'octave' }
  ];

  var ui = { mode: 'name', maxFret: 12, strings: [0, 1, 2, 3, 4, 5], sound: true };

  var quiz = {
    running: false, asked: 0, right: 0, streak: 0, bestStreak: 0,
    current: null, startedAt: 0, times: [], locked: false
  };

  var els = {};
  var clickListener = null;

  /* ---------------------------------------------------------------- helpers */

  function tuning() { return GL.app.tuning(); }

  function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function randomPosition() {
    var si = randomOf(ui.strings);
    /* Fret 0 is a freebie once you know the tuning, so it is not asked. */
    var fret = 1 + Math.floor(Math.random() * ui.maxFret);
    return { stringIndex: si, fret: fret, midi: tuning()[si] + fret };
  }

  /* Can this pitch be played anywhere on the drawn part of the neck? Any string
     counts, not just the ones being drilled -- the answer may legitimately be
     on another string. */
  function reachable(midi) {
    var t = tuning();
    for (var si = 0; si < 6; si++) {
      var f = midi - t[si];
      if (f >= 0 && f <= ui.maxFret) return true;
    }
    return false;
  }

  /* Pick a root and an interval whose target actually exists on screen.
     Without this the drill happily asks for the 6th above A#4 on a neck that
     stops at the 12th fret, which cannot be answered at all. */
  function solvableIntervalQuestion() {
    for (var tries = 0; tries < 60; tries++) {
      var root = randomPosition();
      var options = INTERVALS.filter(function (iv) { return reachable(root.midi + iv.semi); });
      if (options.length) return { root: root, interval: randomOf(options) };
    }
    /* Only reachable if the fret range is tiny; the octave of a low note
       always exists somewhere on a guitar. */
    var si = ui.strings[ui.strings.length - 1];
    var fallback = { stringIndex: si, fret: 1, midi: tuning()[si] + 1 };
    return { root: fallback, interval: INTERVALS[2] };
  }

  function sound(midi, ok) {
    if (!ui.sound) return;
    GL.audio.unlock();
    GL.guitar.note({ midi: midi, velocity: ok === false ? 0.5 : 0.8, tone: 'finger' });
  }

  /* --------------------------------------------------------------- questions */

  function nextQuestion() {
    quiz.locked = false;
    quiz.startedAt = performance.now();

    if (ui.mode === 'name') {
      var p = randomPosition();
      quiz.current = {
        kind: 'name',
        target: p,
        answerPc: notes.mod12(p.midi),
        prompt: 'String ' + notes.strNumber(p.stringIndex) + ', fret ' + p.fret + '. What note is this?'
      };
    } else if (ui.mode === 'find') {
      var si = randomOf(ui.strings);
      var pc = Math.floor(Math.random() * 12);
      quiz.current = {
        kind: 'find',
        stringIndex: si,
        answerPc: pc,
        prompt: 'Find ' + notes.pcName(pc) + ' on string ' + notes.strNumber(si) + '.'
      };
    } else {
      var q = solvableIntervalQuestion();
      quiz.current = {
        kind: 'interval',
        root: q.root,
        interval: q.interval,
        answerMidi: q.root.midi + q.interval.semi,
        prompt: 'The amber note is ' + notes.pcName(notes.mod12(q.root.midi)) +
                '. Find the ' + q.interval.label + ' above it.'
      };
    }

    render();
  }

  /* ---------------------------------------------------------------- answers */

  function judge(correct, detail, playMidi) {
    if (quiz.locked) return;
    quiz.locked = true;
    quiz.asked++;
    quiz.times.push(performance.now() - quiz.startedAt);

    if (correct) {
      quiz.right++;
      quiz.streak++;
      quiz.bestStreak = Math.max(quiz.bestStreak, quiz.streak);
    } else {
      quiz.streak = 0;
    }
    if (playMidi !== undefined) sound(playMidi, correct);

    els.feedback.textContent = detail;
    els.feedback.className = 'quiz-feedback ' + (correct ? 'is-right' : 'is-wrong');
    renderScore();
    saveBest(correct);

    setTimeout(function () {
      if (quiz.running) nextQuestion();
    }, correct ? 620 : 1500);
  }

  function answerNote(pc) {
    var c = quiz.current;
    if (!c || c.kind !== 'name') return;
    var ok = notes.mod12(pc) === c.answerPc;
    judge(ok,
      ok ? 'Yes — ' + notes.pcName(c.answerPc)
         : 'That was ' + notes.pcName(c.answerPc) + ', not ' + notes.pcName(pc),
      c.target.midi);
  }

  function answerFret(hit) {
    var c = quiz.current;
    if (!c) return;
    var midi = tuning()[hit.stringIndex] + hit.fret;

    if (c.kind === 'find') {
      /* Fret 0 counts: if the open string is the note asked for, that is where
         it is, and pretending otherwise teaches the wrong thing. */
      var ok = hit.stringIndex === c.stringIndex && notes.mod12(midi) === c.answerPc;
      judge(ok,
        ok ? 'Yes — fret ' + hit.fret
           : (hit.stringIndex !== c.stringIndex
              ? 'Wrong string — that is string ' + notes.strNumber(hit.stringIndex)
              : 'That is ' + notes.pcName(notes.mod12(midi)) + ', not ' + notes.pcName(c.answerPc)),
        midi);
    } else if (c.kind === 'interval') {
      var okI = midi === c.answerMidi;
      judge(okI,
        okI ? 'Yes — ' + notes.midiName(c.answerMidi)
            : 'That is ' + notes.midiName(midi) + '. You wanted ' + notes.midiName(c.answerMidi),
        midi);
    }
  }

  /* ---------------------------------------------------------------- render */

  function render() {
    var c = quiz.current;
    clear(els.board);

    if (!c) {
      els.prompt.textContent = 'Pick a mode and press start.';
      els.board.appendChild(h('div.neckwrap', {
        html: GL.render.fretboard({ cells: [], tuning: tuning(), toFret: ui.maxFret })
      }));
      clear(els.answers);
      return;
    }

    els.prompt.textContent = c.prompt;

    var cells = [];
    var highlight = [];

    if (c.kind === 'name') {
      highlight.push({ stringIndex: c.target.stringIndex, fret: c.target.fret });
    } else if (c.kind === 'interval') {
      cells.push({
        stringIndex: c.root.stringIndex, fret: c.root.fret,
        label: 'R', note: notes.pcName(notes.mod12(c.root.midi)), isRoot: true
      });
    }

    els.board.appendChild(h('div.neckwrap', {
      html: GL.render.fretboard({
        cells: cells,
        highlight: highlight,
        tuning: tuning(),
        toFret: ui.maxFret,
        label: c.kind === 'interval' ? 'degree' : 'none',
        interactive: c.kind !== 'name'
      })
    }));

    /* Answer buttons only for the recognition drill; the other two are
       answered on the neck itself. */
    clear(els.answers);
    if (c.kind === 'name') {
      NOTE_BUTTONS.forEach(function (n) {
        els.answers.appendChild(h('button.btn.note-btn', {
          type: 'button',
          onclick: function () { answerNote(notes.noteToPc(n)); }
        }, n));
      });
    } else {
      els.answers.appendChild(h('p.hint', 'Click the answer on the neck above.'));
    }
  }

  function renderScore() {
    var pct = quiz.asked ? Math.round(quiz.right / quiz.asked * 100) : 0;
    var avg = quiz.times.length
      ? (quiz.times.reduce(function (a, b) { return a + b; }, 0) / quiz.times.length / 1000)
      : 0;
    clear(els.score);
    els.score.appendChild(stat(quiz.right + '/' + quiz.asked, 'correct'));
    els.score.appendChild(stat(pct + '%', 'accuracy'));
    els.score.appendChild(stat(String(quiz.streak), 'streak'));
    els.score.appendChild(stat(quiz.bestStreak ? String(quiz.bestStreak) : '—', 'best'));
    els.score.appendChild(stat(avg ? avg.toFixed(1) + 's' : '—', 'average'));
  }

  function stat(value, label) {
    return h('div.stat', [h('span.stat-value', value), h('span.stat-label', label)]);
  }

  /* Lifetime totals per drill, so the Progress view has something real to show. */
  function saveBest(correct) {
    var p = GL.app.state.progress;
    p.trainer = p.trainer || {};
    var rec = p.trainer[ui.mode] || { bestStreak: 0, asked: 0, right: 0 };
    rec.bestStreak = Math.max(rec.bestStreak, quiz.bestStreak);
    rec.asked += 1;
    if (correct) rec.right += 1;
    p.trainer[ui.mode] = rec;
    GL.app.save();
  }

  /* ------------------------------------------------------------------ view */

  function start() {
    quiz.running = true;
    quiz.asked = 0; quiz.right = 0; quiz.streak = 0; quiz.times = [];
    els.startBtn.textContent = 'Stop';
    els.startBtn.classList.add('is-live');
    GL.audio.unlock();
    nextQuestion();
    renderScore();
  }

  function stop() {
    quiz.running = false;
    quiz.current = null;
    els.startBtn.textContent = 'Start';
    els.startBtn.classList.remove('is-live');
    els.feedback.textContent = '';
    els.feedback.className = 'quiz-feedback';
    render();
  }

  GL.app.register('trainer', {
    title: 'Fretboard trainer',
    navLabel: 'Trainer',
    icon: '&#9635;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Fretboard trainer'),
        h('p.view-sub', 'Knowing the neck is the difference between playing shapes and playing music.')
      ]));

      els.prompt = h('p.quiz-prompt', 'Pick a mode and press start.');
      els.feedback = h('p.quiz-feedback');
      els.board = h('div');
      els.answers = h('div.row.row-wrap.answerrow');
      els.score = h('div.statrow');

      els.startBtn = h('button.btn.btn-primary.btn-wide', {
        type: 'button',
        onclick: function () { if (quiz.running) stop(); else start(); }
      }, 'Start');

      var modeSelect = h('select.select', {
        onchange: function () {
          ui.mode = this.value;
          if (quiz.running) nextQuestion(); else render();
        }
      }, [
        { v: 'name', l: 'Name the note' },
        { v: 'find', l: 'Find the note' },
        { v: 'interval', l: 'Find the interval' }
      ].map(function (o) {
        return h('option', { value: o.v, selected: ui.mode === o.v }, o.l);
      }));

      var fretSlider = h('input.slider', {
        type: 'range', min: 5, max: 15, step: 1, value: ui.maxFret,
        oninput: function () {
          ui.maxFret = Number(this.value);
          fretLabel.textContent = 'frets 1 to ' + ui.maxFret;
          render();
        }
      });
      var fretLabel = h('span.field-value', 'frets 1 to ' + ui.maxFret);

      var stringChecks = h('div.row.row-wrap', [5, 4, 3, 2, 1, 0].map(function (si) {
        return h('label.check', [
          h('input', {
            type: 'checkbox',
            checked: ui.strings.indexOf(si) !== -1 || null,
            onchange: function () {
              var i = ui.strings.indexOf(si);
              if (this.checked && i === -1) ui.strings.push(si);
              else if (!this.checked && i !== -1) ui.strings.splice(i, 1);
              /* Never leave the drill with nothing to ask about. */
              if (!ui.strings.length) { ui.strings.push(si); this.checked = true; }
            }
          }),
          h('span', String(notes.strNumber(si)))
        ]);
      }));

      root.appendChild(h('section.card', [
        h('div.grid.grid-2', [
          h('label.field', [h('span', 'Drill'), modeSelect]),
          h('label.field', [h('span', fretLabel), fretSlider]),
          h('div.field', [h('span', 'Strings'), stringChecks]),
          h('div.field', [h('span', 'Sound'), h('label.check', [
            h('input', {
              type: 'checkbox', checked: ui.sound || null,
              onchange: function () { ui.sound = this.checked; }
            }),
            h('span', 'Play each answer')
          ])])
        ]),
        h('div.row.row-wrap', [els.startBtn])
      ]));

      var quizCard = h('section.card.quizcard', [
        els.score,
        els.prompt,
        els.board,
        els.feedback,
        els.answers
      ]);
      root.appendChild(quizCard);

      clickListener = GL.render.onFretClick(quizCard, answerFret);

      renderScore();
      render();
    },
    unmount: function () {
      quiz.running = false;
      quiz.current = null;
      GL.guitar.stopAll();
      clickListener = null;
      els = {};
    }
  });
}(window.GL = window.GL || {}));
