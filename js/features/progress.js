/* progress.js -- the practice routine, the log, and what you have covered.

   The routine builder is the point of this view. Practising is mostly a
   scheduling problem: people practise what they are already good at because it
   is more enjoyable, and a written routine with a timer is the cheapest known
   fix for that.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;

  var DEFAULT_ROUTINE = [
    { name: 'Tune up and warm up', minutes: 3, note: 'Tuner, then anything slow with a metronome.' },
    { name: 'Technique drill', minutes: 10, note: 'Whatever the current lesson\'s drill is. Use the tempo ramp.' },
    { name: 'Fretboard or ear', minutes: 7, note: 'Trainer or ear training. Alternate days.' },
    { name: 'Repertoire', minutes: 15, note: 'A piece you are learning, played slowly and completely.' },
    { name: 'Play something you enjoy', minutes: 5, note: 'Non-negotiable. This is what keeps you coming back.' }
  ];

  var timer = null;
  var els = {};

  function state() {
    var p = GL.app.state.progress;
    if (!p.routine) p.routine = DEFAULT_ROUTINE.map(function (r) { return Object.assign({}, r); });
    if (!p.practiceLog) p.practiceLog = [];
    return p;
  }

  /* ------------------------------------------------------------------ stats */

  function lessonStats() {
    var tracks = (GL.course && GL.course.TRACKS) || [];
    var lessons = (GL.course && GL.course.allLessons()) || [];
    var done = lessons.filter(function (l) {
      return (GL.app.state.progress.lessons[l.id] || {}).done;
    });
    return { tracks: tracks, total: lessons.length, done: done.length, lessons: lessons };
  }

  /* Consecutive days with a logged session, counting back from today. */
  function streak() {
    var log = state().practiceLog;
    if (!log.length) return 0;
    var days = {};
    log.forEach(function (e) { days[e.date] = 1; });
    var n = 0;
    var d = new Date();
    for (;;) {
      var key = d.toISOString().slice(0, 10);
      if (days[key]) { n++; d.setDate(d.getDate() - 1); continue; }
      /* Today not yet logged does not break a streak that ran to yesterday. */
      if (n === 0 && key === new Date().toISOString().slice(0, 10)) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
    return n;
  }

  function totalMinutes() {
    return state().practiceLog.reduce(function (a, e) { return a + (e.minutes || 0); }, 0);
  }

  /* ---------------------------------------------------------------- routine */

  function renderRoutine(root) {
    var p = state();
    var card = h('section.card');
    card.appendChild(h('header.card-head', [
      h('h2', 'Practice routine'),
      h('span.card-tag', p.routine.reduce(function (a, r) { return a + r.minutes; }, 0) + ' minutes')
    ]));

    var list = h('div.routine');

    function draw() {
      clear(list);
      p.routine.forEach(function (item, i) {
        list.appendChild(h('div.routine-item', [
          h('div.routine-main', [
            h('input.input.routine-name', {
              value: item.name,
              oninput: function () { item.name = this.value; GL.app.save(); }
            }),
            h('p.hint', item.note || '')
          ]),
          h('input.input.input-num', {
            type: 'number', min: 1, max: 120, value: item.minutes,
            oninput: function () { item.minutes = Number(this.value) || 1; GL.app.save(); }
          }),
          h('button.btn.btn-sm', {
            type: 'button',
            onclick: function () { startTimer(item); }
          }, 'Start'),
          h('button.btn.btn-sm.btn-icon', {
            type: 'button', title: 'Remove',
            onclick: function () { p.routine.splice(i, 1); GL.app.save(); draw(); }
          }, '×')
        ]));
      });
      list.appendChild(h('button.btn.btn-sm', {
        type: 'button',
        onclick: function () {
          p.routine.push({ name: 'New item', minutes: 5, note: '' });
          GL.app.save();
          draw();
        }
      }, '+ Add an item'));
    }
    draw();

    els.timerDisplay = h('div.timer-display', '--:--');
    els.timerLabel = h('p.hint', 'Pick an item and press start.');

    card.appendChild(list);
    card.appendChild(h('div.timer', [
      els.timerDisplay,
      h('div', [
        els.timerLabel,
        h('div.row.row-wrap', [
          h('button.btn', { type: 'button', onclick: stopTimer }, 'Stop'),
          h('button.btn.btn-primary', {
            type: 'button',
            onclick: function () { logSession(); }
          }, 'Log this session')
        ])
      ])
    ]));
    root.appendChild(card);
  }

  function startTimer(item) {
    stopTimer();
    var remaining = item.minutes * 60;
    els.timerLabel.textContent = item.name;
    tick();
    timer = setInterval(tick, 1000);

    function tick() {
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      els.timerDisplay.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      if (remaining <= 0) {
        stopTimer();
        els.timerLabel.textContent = item.name + ' — time.';
        /* Three taps on the hi-hat, so it is audible without being alarming. */
        GL.audio.unlock().then(function () {
          var t = GL.audio.now();
          [0, 0.18, 0.36].forEach(function (d) { GL.drums.hat(t + d, 0.5); });
        });
        return;
      }
      remaining--;
    }
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function logSession() {
    var p = state();
    var minutes = p.routine.reduce(function (a, r) { return a + r.minutes; }, 0);
    p.practiceLog.push({
      date: new Date().toISOString().slice(0, 10),
      at: new Date().toISOString(),
      minutes: minutes
    });
    GL.app.save();
    GL.app.toast('Logged ' + minutes + ' minutes. Streak: ' + streak() + ' days.');
    GL.app.navigate('progress');
  }

  /* -------------------------------------------------------------- dashboard */

  function renderDashboard(root) {
    var st = lessonStats();
    var p = state();

    root.appendChild(h('section.card', [
      h('div.statrow', [
        stat(String(streak()), 'day streak'),
        stat(st.done + '/' + st.total, 'lessons done'),
        stat(String(p.practiceLog.length), 'sessions'),
        stat(Math.round(totalMinutes() / 60) + 'h', 'logged'),
        stat(String((GL.app.state.favorites.chords || []).length), 'saved chords')
      ])
    ]));

    /* Per-track progress. */
    var trackCard = h('section.card');
    trackCard.appendChild(h('header.card-head', [h('h2', 'The course'), h('span.card-tag', 'six tracks')]));
    st.tracks.forEach(function (t) {
      var list = (GL.lessons && GL.lessons[t.key]) || [];
      var done = list.filter(function (l) {
        return (GL.app.state.progress.lessons[l.id] || {}).done;
      }).length;
      trackCard.appendChild(h('div.trackline', [
        h('span.track-id', t.id),
        h('span.trackline-name', t.name),
        h('div.track-bar', [h('div.track-bar-fill', {
          style: { width: (list.length ? done / list.length * 100 : 0) + '%' }
        })]),
        h('span.trackline-count', done + '/' + list.length)
      ]));
    });
    trackCard.appendChild(h('div.row', [h('button.btn.btn-sm', {
      type: 'button', onclick: function () { GL.app.navigate('course'); }
    }, 'Go to the course')]));
    root.appendChild(trackCard);

    /* Drills. */
    var drills = h('section.card');
    drills.appendChild(h('header.card-head', [h('h2', 'Drills'), h('span.card-tag', 'lifetime')]));
    var rows = [];
    var tr = GL.app.state.progress.trainer || {};
    Object.keys(tr).forEach(function (k) {
      rows.push(['Fretboard: ' + k, tr[k]]);
    });
    var ea = GL.app.state.progress.ear || {};
    Object.keys(ea).forEach(function (k) {
      rows.push(['Ear: ' + k, ea[k]]);
    });
    if (!rows.length) {
      drills.appendChild(h('p.hint', 'Nothing recorded yet. The Trainer and Ear sections log every answer.'));
    } else {
      rows.forEach(function (r) {
        var rec = r[1];
        var pct = rec.asked ? Math.round(rec.right / rec.asked * 100) : 0;
        drills.appendChild(h('div.trackline', [
          h('span.trackline-name', r[0]),
          h('div.track-bar', [h('div.track-bar-fill', { style: { width: pct + '%' } })]),
          h('span.trackline-count', pct + '%  ·  ' + rec.asked + ' asked  ·  best streak ' + (rec.bestStreak || rec.best || 0))
        ]));
      });
    }
    root.appendChild(drills);

    /* Recent sessions. */
    var logCard = h('section.card');
    logCard.appendChild(h('header.card-head', [h('h2', 'Practice log'), h('span.card-tag', 'last 14 sessions')]));
    if (!p.practiceLog.length) {
      logCard.appendChild(h('p.hint', 'No sessions logged. Use the routine below and press "log this session" when you finish.'));
    } else {
      var recent = p.practiceLog.slice(-14).reverse();
      logCard.appendChild(h('div.loglist', recent.map(function (e) {
        return h('div.logrow', [
          h('span.logrow-date', e.date),
          h('div.track-bar', [h('div.track-bar-fill', {
            style: { width: Math.min(100, e.minutes / 60 * 100) + '%' }
          })]),
          h('span.logrow-min', e.minutes + 'm')
        ]);
      })));
      logCard.appendChild(h('div.row', [h('button.btn.btn-sm', {
        type: 'button',
        onclick: function () {
          if (!window.confirm('Clear the whole practice log? This cannot be undone.')) return;
          p.practiceLog = [];
          GL.app.save();
          GL.app.navigate('progress');
        }
      }, 'Clear log')]));
    }
    root.appendChild(logCard);
  }

  function stat(value, label) {
    return h('div.stat', [h('span.stat-value', value), h('span.stat-label', label)]);
  }

  GL.app.register('progress', {
    title: 'Progress',
    navLabel: 'Progress',
    icon: '&#9633;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Progress'),
        h('p.view-sub', 'What you have covered, and what to do in the next half hour.')
      ]));
      renderDashboard(root);
      renderRoutine(root);
    },
    unmount: function () { stopTimer(); }
  });
}(window.GL = window.GL || {}));
