/* ear.js -- ear training: intervals, chord qualities, and progressions.

   Every question plays a reference first. Almost nobody has absolute pitch, and
   a drill that assumes it teaches nothing except that you do not have it.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var INTERVALS = [
    { semi: 1, name: 'Minor 2nd' }, { semi: 2, name: 'Major 2nd' },
    { semi: 3, name: 'Minor 3rd' }, { semi: 4, name: 'Major 3rd' },
    { semi: 5, name: 'Perfect 4th' }, { semi: 6, name: 'Tritone' },
    { semi: 7, name: 'Perfect 5th' }, { semi: 8, name: 'Minor 6th' },
    { semi: 9, name: 'Major 6th' }, { semi: 10, name: 'Minor 7th' },
    { semi: 11, name: 'Major 7th' }, { semi: 12, name: 'Octave' }
  ];

  var QUALITIES = [
    { q: 'maj', name: 'Major' }, { q: 'm', name: 'Minor' },
    { q: 'dim', name: 'Diminished' }, { q: 'aug', name: 'Augmented' },
    { q: 'sus4', name: 'Sus4' }, { q: '7', name: 'Dominant 7th' },
    { q: 'maj7', name: 'Major 7th' }, { q: 'm7', name: 'Minor 7th' },
    { q: 'm7b5', name: 'Half-diminished' }
  ];

  var PROGRESSIONS = [
    { numerals: ['I', 'IV', 'V', 'I'], name: 'I - IV - V - I' },
    { numerals: ['I', 'V', 'vi', 'IV'], name: 'I - V - vi - IV' },
    { numerals: ['vi', 'IV', 'I', 'V'], name: 'vi - IV - I - V' },
    { numerals: ['I', 'vi', 'IV', 'V'], name: 'I - vi - IV - V' },
    { numerals: ['ii', 'V', 'I', 'I'], name: 'ii - V - I' },
    { numerals: ['I', 'bVII', 'IV', 'I'], name: 'I - bVII - IV - I' },
    { numerals: ['i', 'bVI', 'bIII', 'bVII'], name: 'i - bVI - bIII - bVII' },
    { numerals: ['I', 'IV', 'I', 'V'], name: 'I - IV - I - V' }
  ];

  var ui = { mode: 'interval', direction: 'ascending', pool: 'common' };
  var quiz = { running: false, asked: 0, right: 0, streak: 0, best: 0, current: null, locked: false };
  var els = {};

  /* ---------------------------------------------------------------- audio */

  function play(current) {
    GL.audio.unlock();
    GL.guitar.stopAll(0.05);
    var t = GL.audio.now() + 0.15;

    if (current.kind === 'interval') {
      var gap = 0.62;
      if (ui.direction === 'harmonic') {
        GL.guitar.note({ midi: current.root, when: t, velocity: 0.8, tone: 'finger' });
        GL.guitar.note({ midi: current.root + current.semi, when: t, velocity: 0.8, tone: 'finger' });
      } else {
        var second = ui.direction === 'descending' ? current.root - current.semi : current.root + current.semi;
        GL.guitar.note({ midi: current.root, when: t, velocity: 0.8, tone: 'finger' });
        GL.guitar.note({ midi: second, when: t + gap, velocity: 0.8, tone: 'finger' });
      }
    } else if (current.kind === 'quality') {
      var v = current.voicing;
      GL.guitar.strum({ frets: v.frets, tuning: GL.app.tuning(), when: t, velocity: 0.82, tone: 'steel' });
      /* Arpeggiate afterwards so the individual tones are audible too. */
      var step = 0;
      v.frets.forEach(function (f, si) {
        if (f < 0) return;
        GL.guitar.note({
          midi: notes.fretMidi(GL.app.tuning(), si, f),
          when: t + 1.3 + step * 0.24, velocity: 0.72, tone: 'finger', stringIndex: si
        });
        step++;
      });
    } else {
      var beat = 0.62;
      current.chords.forEach(function (c, i) {
        var vv = GL.chords.voicings(c.symbol, { tuning: GL.app.tuning(), maxFret: 9, limit: 1 })[0];
        if (!vv) return;
        GL.guitar.strum({
          frets: vv.frets, tuning: GL.app.tuning(), when: t + i * beat * 2,
          velocity: 0.8, tone: 'steel'
        });
      });
    }
  }

  /* ------------------------------------------------------------- questions */

  function nextQuestion() {
    quiz.locked = false;
    var pool;

    if (ui.mode === 'interval') {
      pool = ui.pool === 'common'
        ? INTERVALS.filter(function (i) { return [2, 3, 4, 5, 7, 9, 12].indexOf(i.semi) !== -1; })
        : INTERVALS;
      var iv = pool[Math.floor(Math.random() * pool.length)];
      /* Keep both notes on the guitar's range whichever direction we go. */
      var root = 52 + Math.floor(Math.random() * 8);
      quiz.current = { kind: 'interval', root: root, semi: iv.semi, answer: iv.name };
    } else if (ui.mode === 'quality') {
      pool = ui.pool === 'common'
        ? QUALITIES.filter(function (q) { return ['maj', 'm', '7', 'maj7', 'm7'].indexOf(q.q) !== -1; })
        : QUALITIES;
      var qq = pool[Math.floor(Math.random() * pool.length)];
      var rootName = ['C', 'D', 'E', 'F', 'G', 'A'][Math.floor(Math.random() * 6)];
      var sym = GL.chords.symbolOf(rootName, qq.q);
      var voicing = GL.chords.voicings(sym, { tuning: GL.app.tuning(), maxFret: 9, limit: 1 })[0];
      if (!voicing) { nextQuestion(); return; }
      quiz.current = { kind: 'quality', voicing: voicing, answer: qq.name, symbol: sym };
    } else {
      var p = PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];
      var key = ['C', 'G', 'D', 'A', 'F'][Math.floor(Math.random() * 5)];
      quiz.current = {
        kind: 'progression',
        chords: GL.progressions.realise(p.numerals, key),
        answer: p.name, key: key
      };
    }

    render();
    play(quiz.current);
  }

  function answer(text) {
    if (quiz.locked || !quiz.current) return;
    quiz.locked = true;
    quiz.asked++;
    var ok = text === quiz.current.answer;
    if (ok) { quiz.right++; quiz.streak++; quiz.best = Math.max(quiz.best, quiz.streak); }
    else quiz.streak = 0;

    els.feedback.textContent = ok
      ? 'Yes — ' + quiz.current.answer
      : 'That was ' + quiz.current.answer + (quiz.current.symbol ? ' (' + quiz.current.symbol + ')' : '');
    els.feedback.className = 'quiz-feedback ' + (ok ? 'is-right' : 'is-wrong');

    save(ok);
    renderScore();
    setTimeout(function () { if (quiz.running) nextQuestion(); }, ok ? 900 : 2000);
  }

  function save(ok) {
    var p = GL.app.state.progress;
    p.ear = p.ear || {};
    var rec = p.ear[ui.mode] || { asked: 0, right: 0, best: 0 };
    rec.asked++;
    if (ok) rec.right++;
    rec.best = Math.max(rec.best, quiz.best);
    p.ear[ui.mode] = rec;
    GL.app.save();
  }

  /* ---------------------------------------------------------------- render */

  function render() {
    clear(els.answers);
    if (!quiz.current) {
      els.prompt.textContent = 'Choose a drill and press start.';
      return;
    }

    var options;
    if (quiz.current.kind === 'interval') {
      els.prompt.textContent = ui.direction === 'harmonic'
        ? 'Both notes at once. What is the interval?'
        : 'Two notes, ' + ui.direction + '. What is the interval?';
      options = (ui.pool === 'common'
        ? INTERVALS.filter(function (i) { return [2, 3, 4, 5, 7, 9, 12].indexOf(i.semi) !== -1; })
        : INTERVALS).map(function (i) { return i.name; });
    } else if (quiz.current.kind === 'quality') {
      els.prompt.textContent = 'One chord, strummed then arpeggiated. What kind of chord is it?';
      options = (ui.pool === 'common'
        ? QUALITIES.filter(function (q) { return ['maj', 'm', '7', 'maj7', 'm7'].indexOf(q.q) !== -1; })
        : QUALITIES).map(function (q) { return q.name; });
    } else {
      els.prompt.textContent = 'Four chords in the key of ' + quiz.current.key + '. Which progression?';
      options = PROGRESSIONS.map(function (p) { return p.name; });
    }

    options.forEach(function (label) {
      els.answers.appendChild(h('button.btn.ear-btn', {
        type: 'button', onclick: function () { answer(label); }
      }, label));
    });

    els.answers.appendChild(h('button.btn.btn-chip', {
      type: 'button', onclick: function () { play(quiz.current); }
    }, 'Play again'));
  }

  function renderScore() {
    var pct = quiz.asked ? Math.round(quiz.right / quiz.asked * 100) : 0;
    clear(els.score);
    [[quiz.right + '/' + quiz.asked, 'correct'], [pct + '%', 'accuracy'],
     [String(quiz.streak), 'streak'], [quiz.best ? String(quiz.best) : '—', 'best']]
      .forEach(function (s) {
        els.score.appendChild(h('div.stat', [
          h('span.stat-value', s[0]), h('span.stat-label', s[1])
        ]));
      });
  }

  GL.app.register('ear', {
    title: 'Ear training',
    navLabel: 'Ear',
    icon: '&#9834;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Ear training'),
        h('p.view-sub', 'The skill everything else in the course depends on. Ten minutes a day beats an hour a week.')
      ]));

      els.prompt = h('p.quiz-prompt', 'Choose a drill and press start.');
      els.feedback = h('p.quiz-feedback');
      els.answers = h('div.row.row-wrap.answerrow');
      els.score = h('div.statrow');

      var startBtn = h('button.btn.btn-primary.btn-wide', {
        type: 'button',
        onclick: function () {
          if (quiz.running) {
            quiz.running = false;
            quiz.current = null;
            GL.guitar.stopAll(0.1);
            this.textContent = 'Start';
            this.classList.remove('is-live');
            els.feedback.textContent = '';
            render();
          } else {
            quiz.running = true;
            quiz.asked = 0; quiz.right = 0; quiz.streak = 0;
            this.textContent = 'Stop';
            this.classList.add('is-live');
            renderScore();
            nextQuestion();
          }
        }
      }, 'Start');

      var modeSelect = h('select.select', {
        onchange: function () {
          ui.mode = this.value;
          if (quiz.running) nextQuestion(); else render();
        }
      }, [
        { v: 'interval', l: 'Intervals' },
        { v: 'quality', l: 'Chord qualities' },
        { v: 'progression', l: 'Progressions' }
      ].map(function (o) { return h('option', { value: o.v, selected: ui.mode === o.v }, o.l); }));

      var dirSelect = h('select.select', {
        onchange: function () { ui.direction = this.value; if (quiz.running) nextQuestion(); }
      }, [
        { v: 'ascending', l: 'Ascending' },
        { v: 'descending', l: 'Descending' },
        { v: 'harmonic', l: 'Both at once' }
      ].map(function (o) { return h('option', { value: o.v, selected: ui.direction === o.v }, o.l); }));

      var poolSelect = h('select.select', {
        onchange: function () { ui.pool = this.value; if (quiz.running) nextQuestion(); else render(); }
      }, [
        { v: 'common', l: 'Common ones only' },
        { v: 'all', l: 'Everything' }
      ].map(function (o) { return h('option', { value: o.v, selected: ui.pool === o.v }, o.l); }));

      root.appendChild(h('section.card', [
        h('div.grid.grid-2', [
          h('label.field', [h('span', 'Drill'), modeSelect]),
          h('label.field', [h('span', 'Direction'), dirSelect]),
          h('label.field', [h('span', 'Difficulty'), poolSelect])
        ]),
        h('div.row.row-wrap', [startBtn])
      ]));

      root.appendChild(h('section.card.quizcard', [
        els.score, els.prompt, els.feedback, els.answers
      ]));

      renderScore();
      render();
    },
    unmount: function () {
      quiz.running = false;
      quiz.current = null;
      GL.guitar.stopAll();
      els = {};
    }
  });
}(window.GL = window.GL || {}));
