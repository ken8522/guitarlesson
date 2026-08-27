/* tools.js -- the practice bench: tuner, metronome, and a sound check.

   These are the two things a player touches at the start of every session, so
   they are the first things the app does properly.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var clear = GL.app.clear;
  var notes = GL.notes;

  var tuner = null;
  var metronome = null;
  var beatLights = [];
  var rafId = null;

  /* =========================================================== the tuner === */

  function buildTuner() {
    var wrap = h('section.card.tuner');
    var status = h('p.tuner-status', 'The tuner listens through your microphone. Nothing is recorded or sent anywhere.');

    var noteEl = h('div.tuner-note', '--');
    var octEl = h('span.tuner-oct', '');
    var centsEl = h('div.tuner-cents', 'play a string');
    var needle = h('div.needle-marker');
    var needleWrap = h('div.needle', [
      h('div.needle-zone'),
      h('div.needle-centre'),
      needle,
      h('div.needle-scale', [
        h('span', '-50'), h('span', '-25'), h('span', '0'), h('span', '+25'), h('span', '+50')
      ])
    ]);

    var stringRow = h('div.string-row');
    var startBtn = h('button.btn.btn-primary', { type: 'button' }, 'Start tuner');

    var tuningSelect = h('select.select', {
      onchange: function () {
        GL.app.state.settings.tuning = this.value;
        GL.app.save();
        renderStrings();
        GL.app.toast('Tuning set to ' + notes.TUNINGS[this.value].name);
      }
    }, Object.keys(notes.TUNINGS).map(function (k) {
      return h('option', {
        value: k,
        selected: GL.app.state.settings.tuning === k
      }, notes.TUNINGS[k].name + '  (' + notes.TUNINGS[k].label + ')');
    }));

    function renderStrings() {
      var t = GL.app.tuning();
      clear(stringRow);
      /* Drawn 6th string first, the order you actually tune in. */
      for (var i = 0; i < 6; i++) {
        (function (si) {
          var midi = t[si];
          stringRow.appendChild(h('button.string-pad', {
            type: 'button',
            dataset: { string: si },
            title: 'Play a reference ' + notes.midiName(midi),
            onclick: function () {
              GL.audio.unlock();
              GL.guitar.note({ midi: midi, velocity: 0.75, tone: 'finger', stringIndex: si });
            }
          }, [
            h('span.string-num', String(notes.strNumber(si))),
            h('span.string-note', notes.pcName(midi)),
            h('span.string-oct', String(Math.floor(midi / 12) - 1))
          ]));
        }(i));
      }
    }
    renderStrings();

    function setReading(p) {
      if (!p) {
        noteEl.textContent = '--';
        octEl.textContent = '';
        centsEl.textContent = 'play a string';
        centsEl.className = 'tuner-cents';
        needle.style.left = '50%';
        needle.classList.remove('is-good');
        GL.app.$$('.string-pad').forEach(function (b) { b.classList.remove('is-hearing'); });
        return;
      }

      var t = GL.app.tuning();
      var nearestMidi = Math.round(p.midi);
      noteEl.textContent = notes.pcName(nearestMidi);
      octEl.textContent = String(Math.floor(nearestMidi / 12) - 1);

      var cents = p.cents;
      var inTune = Math.abs(cents) <= 5;
      centsEl.textContent = (cents > 0 ? '+' : '') + cents.toFixed(0) + ' cents  ' +
        (inTune ? 'in tune' : cents > 0 ? 'sharp - loosen' : 'flat - tighten');
      centsEl.className = 'tuner-cents' + (inTune ? ' is-good' : cents > 0 ? ' is-sharp' : ' is-flat');

      needle.style.left = (50 + Math.max(-50, Math.min(50, cents))) + '%';
      needle.classList.toggle('is-good', inTune);

      /* Light up whichever string this pitch is closest to. */
      var bestIdx = 0, bestDist = 1e9;
      t.forEach(function (m, i) {
        var d = Math.abs(m - p.midi);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      GL.app.$$('.string-pad').forEach(function (b) {
        var on = bestDist < 3.5 && Number(b.dataset.string) === bestIdx;
        b.classList.toggle('is-hearing', on);
        if (on) b.classList.toggle('is-intune', inTune && p.settled);
      });
    }

    function toggle() {
      if (tuner && tuner.isRunning()) {
        tuner.stop();
        startBtn.textContent = 'Start tuner';
        startBtn.classList.remove('is-live');
        status.textContent = 'Tuner stopped. The microphone is released.';
        setReading(null);
        return;
      }
      if (!tuner) {
        tuner = GL.pitch.create({
          onPitch: setReading,
          onError: function (msg) {
            status.textContent = msg;
            status.classList.add('is-error');
            startBtn.textContent = 'Start tuner';
            startBtn.classList.remove('is-live');
          }
        });
      }
      status.classList.remove('is-error');
      status.textContent = 'Listening. Pick one string at a time and let it ring.';
      startBtn.textContent = 'Stop tuner';
      startBtn.classList.add('is-live');
      tuner.start().catch(function () { /* onError already reported it */ });
    }

    startBtn.addEventListener('click', toggle);

    wrap.appendChild(h('header.card-head', [
      h('h2', 'Tuner'),
      h('span.card-tag', 'microphone')
    ]));
    wrap.appendChild(h('div.tuner-display', [
      h('div.tuner-noterow', [noteEl, octEl]),
      centsEl,
      needleWrap
    ]));
    wrap.appendChild(stringRow);
    wrap.appendChild(h('div.row.row-wrap', [
      startBtn,
      h('label.field', [h('span', 'Tuning'), tuningSelect])
    ]));
    wrap.appendChild(status);
    return wrap;
  }

  /* ======================================================== the metronome === */

  function buildMetronome() {
    var st = GL.app.state.metronome;
    var wrap = h('section.card.metro');

    var bpmEl = h('div.metro-bpm', String(st.bpm));
    var lights = h('div.metro-lights');

    function renderLights() {
      clear(lights);
      beatLights = [];
      for (var i = 0; i < st.beatsPerBar; i++) {
        var l = h('span.metro-light' + (i === 0 ? '.is-one' : ''));
        beatLights.push(l);
        lights.appendChild(l);
      }
    }

    function ensureMetronome() {
      if (metronome) return metronome;
      metronome = GL.metronome.create({
        bpm: st.bpm,
        beatsPerBar: st.beatsPerBar,
        subdivision: st.subdivision,
        onBeat: function (info) {
          if (!info.isBeat) return;
          /* The click is scheduled ahead of time; flash the light when it
             actually sounds, not when it was queued. */
          var delay = Math.max(0, (info.when - GL.audio.now()) * 1000);
          setTimeout(function () {
            var l = beatLights[info.beat];
            if (!l) return;
            l.classList.add('is-hit');
            setTimeout(function () { l.classList.remove('is-hit'); }, 90);
          }, delay);
          if (info.beat === 0) bpmEl.textContent = String(Math.round(info.bpm));
        }
      });
      metronome.state.mode = st.mode;
      metronome.state.swing = st.swing;
      return metronome;
    }

    function setBpm(v) {
      var m = ensureMetronome();
      st.bpm = m.setBpm(v);
      bpmEl.textContent = String(st.bpm);
      slider.value = st.bpm;
      GL.app.save();
    }

    var slider = h('input.slider', {
      type: 'range', min: 40, max: 240, step: 1, value: st.bpm,
      oninput: function () { setBpm(Number(this.value)); }
    });

    var startBtn = h('button.btn.btn-primary.btn-wide', {
      type: 'button',
      onclick: function () {
        var m = ensureMetronome();
        if (m.isRunning()) {
          m.stop();
          this.textContent = 'Start';
          this.classList.remove('is-live');
          beatLights.forEach(function (l) { l.classList.remove('is-hit'); });
        } else {
          m.start();
          this.textContent = 'Stop';
          this.classList.add('is-live');
        }
      }
    }, 'Start');

    /* Tap tempo: average the last few taps, drop anything implausible. */
    var taps = [];
    var tapBtn = h('button.btn', {
      type: 'button',
      onclick: function () {
        var now = performance.now();
        if (taps.length && now - taps[taps.length - 1] > 2500) taps = [];
        taps.push(now);
        if (taps.length > 5) taps.shift();
        if (taps.length < 2) { this.textContent = 'Tap...'; return; }
        var sum = 0;
        for (var i = 1; i < taps.length; i++) sum += taps[i] - taps[i - 1];
        var avg = sum / (taps.length - 1);
        setBpm(Math.round(60000 / avg));
        this.textContent = 'Tap tempo';
      }
    }, 'Tap tempo');

    var barsSelect = h('select.select', {
      onchange: function () {
        st.beatsPerBar = Number(this.value);
        ensureMetronome().state.beatsPerBar = st.beatsPerBar;
        renderLights();
        GL.app.save();
      }
    }, [2, 3, 4, 5, 6, 7, 8, 9, 12].map(function (n) {
      return h('option', { value: n, selected: st.beatsPerBar === n }, n + ' / bar');
    }));

    var subSelect = h('select.select', {
      onchange: function () {
        st.subdivision = Number(this.value);
        ensureMetronome().state.subdivision = st.subdivision;
        GL.app.save();
      }
    }, [
      { v: 1, l: 'Quarter notes' },
      { v: 2, l: 'Eighths' },
      { v: 3, l: 'Triplets' },
      { v: 4, l: 'Sixteenths' }
    ].map(function (o) {
      return h('option', { value: o.v, selected: st.subdivision === o.v }, o.l);
    }));

    var modeSelect = h('select.select', {
      onchange: function () {
        st.mode = this.value;
        ensureMetronome().state.mode = st.mode;
        GL.app.save();
      }
    }, [
      { v: 'all', l: 'Click every beat' },
      { v: 'backbeat', l: 'Click 2 and 4 only' },
      { v: 'barOnly', l: 'Click bar 1 only' }
    ].map(function (o) {
      return h('option', { value: o.v, selected: st.mode === o.v }, o.l);
    }));

    var swingSlider = h('input.slider', {
      type: 'range', min: 0, max: 66, step: 1, value: Math.round(st.swing * 100),
      oninput: function () {
        st.swing = Number(this.value) / 100;
        ensureMetronome().state.swing = st.swing;
        swingLabel.textContent = this.value === '0' ? 'straight' : this.value + '%';
        GL.app.save();
      }
    });
    var swingLabel = h('span.field-value', st.swing ? Math.round(st.swing * 100) + '%' : 'straight');

    /* Tempo ramp: the single most useful practice feature a metronome has. */
    var rampTo = h('input.input.input-num', { type: 'number', min: 40, max: 240, value: Math.min(240, st.bpm + 30) });
    var rampMin = h('input.input.input-num', { type: 'number', min: 1, max: 60, value: 5 });
    var rampBtn = h('button.btn', {
      type: 'button',
      onclick: function () {
        var m = ensureMetronome();
        if (!m.isRunning()) m.start();
        startBtn.textContent = 'Stop';
        startBtn.classList.add('is-live');
        m.rampTo(Number(rampTo.value), Number(rampMin.value) * 60);
        GL.app.toast('Climbing to ' + rampTo.value + ' bpm over ' + rampMin.value + ' minutes');
      }
    }, 'Start ramp');

    renderLights();

    wrap.appendChild(h('header.card-head', [
      h('h2', 'Metronome'),
      h('span.card-tag', 'audio clock')
    ]));
    wrap.appendChild(h('div.metro-main', [
      h('div.metro-readout', [bpmEl, h('span.metro-unit', 'bpm')]),
      lights
    ]));
    wrap.appendChild(slider);
    wrap.appendChild(h('div.row.row-wrap', [
      startBtn, tapBtn,
      h('button.btn.btn-icon', { type: 'button', onclick: function () { setBpm(st.bpm - 1); } }, '-'),
      h('button.btn.btn-icon', { type: 'button', onclick: function () { setBpm(st.bpm + 1); } }, '+')
    ]));
    wrap.appendChild(h('div.grid.grid-2', [
      h('label.field', [h('span', 'Beats'), barsSelect]),
      h('label.field', [h('span', 'Subdivision'), subSelect]),
      h('label.field', [h('span', 'Click pattern'), modeSelect]),
      h('label.field', [h('span', ['Swing ', swingLabel]), swingSlider])
    ]));
    wrap.appendChild(h('div.ramp', [
      h('span.ramp-label', 'Tempo ramp'),
      h('span', 'to'), rampTo,
      h('span', 'bpm over'), rampMin,
      h('span', 'min'),
      rampBtn
    ]));
    return wrap;
  }

  /* ======================================================= the sound check === */

  var DEMO_CHORDS = ['Am7', 'Cadd9', 'G', 'Dsus4', 'Fmaj7', 'Em9', 'A7sus4', 'Bm7b5'];

  function buildSoundCheck() {
    var wrap = h('section.card.soundcheck');
    var toneName = GL.app.state.settings.tone;

    var diagram = h('div.sc-diagram');
    var caption = h('p.sc-caption', 'Pick a chord. The shape, the fingering and the barre were all worked out by searching the fretboard for playable ways to sound those notes.');

    function playChord(symbol) {
      GL.audio.unlock();
      var v = GL.chords.voicings(symbol, {
        tuning: GL.app.tuning(),
        maxFret: 5,
        limit: 1
      })[0];
      if (!v) {
        v = GL.chords.voicings(symbol, { tuning: GL.app.tuning(), maxFret: 12, limit: 1 })[0];
      }
      if (!v) { GL.app.toast('No playable voicing found in this tuning', 'error'); return; }

      GL.guitar.strum({
        frets: v.frets,
        tuning: GL.app.tuning(),
        direction: 'down',
        velocity: 0.8,
        tone: toneName,
        capo: GL.app.state.settings.capo
      });

      var chord = GL.chords.parse(symbol);
      diagram.innerHTML = GL.render.voicingDiagram(v, { name: chord.symbol, size: 'lg' });
      caption.textContent = chord.root + ' ' + GL.chords.QUALITIES[chord.quality].name +
        '  -  ' + GL.chords.noteNames(chord).join(' ') +
        (v.caged ? '  -  ' + v.caged + ' shape' : '') +
        '  -  ' + v.strings + ' strings, ' + v.fingerCount + ' fingers';
    }

    var chordRow = h('div.row.row-wrap', DEMO_CHORDS.map(function (c) {
      return h('button.btn.btn-chip', { type: 'button', onclick: function () { playChord(c); } }, c);
    }));

    var toneRow = h('div.row.row-wrap', ['steel', 'finger', 'thumb', 'mute', 'harmonic'].map(function (t) {
      return h('button.btn.btn-chip' + (t === toneName ? '.is-on' : ''), {
        type: 'button',
        onclick: function () {
          toneName = t;
          GL.app.state.settings.tone = t;
          GL.app.save();
          GL.app.$$('.soundcheck .btn-chip').forEach(function (b) { b.classList.remove('is-on'); });
          this.classList.add('is-on');
        }
      }, t);
    }));

    /* An ascending run, to hear the model behave across the whole neck. */
    function playScale() {
      GL.audio.unlock();
      var t0 = GL.audio.now() + 0.08;
      var cells = GL.scales.positions('A', 'minorPentatonic', {
        tuning: GL.app.tuning(), mode: 'box'
      })[0];
      if (!cells) return;
      var seq = cells.cells.slice().sort(function (a, b) { return a.midi - b.midi; });
      seq.forEach(function (c, i) {
        GL.guitar.note({
          midi: c.midi, when: t0 + i * 0.135, velocity: 0.72,
          tone: toneName, stringIndex: c.stringIndex
        });
      });
    }

    function playTravis() {
      /* Alternating bass under a C chord: thumb on 5 and 4, fingers on top.
         Eight beats, so the string-choking behaviour is audible. */
      GL.audio.unlock();
      var t0 = GL.audio.now() + 0.08;
      var beat = 0.30;
      var tuning = GL.app.tuning();
      var frets = [-1, 3, 2, 0, 1, 0];   /* open C */
      var pattern = [
        { s: 1, t: 0.0, tone: 'thumb', v: 0.85 },
        { s: 5, t: 0.5, tone: 'finger', v: 0.6 },
        { s: 2, t: 1.0, tone: 'thumb', v: 0.8 },
        { s: 4, t: 1.5, tone: 'finger', v: 0.62 },
        { s: 1, t: 2.0, tone: 'thumb', v: 0.85 },
        { s: 3, t: 2.5, tone: 'finger', v: 0.6 },
        { s: 2, t: 3.0, tone: 'thumb', v: 0.8 },
        { s: 5, t: 3.5, tone: 'finger', v: 0.65 }
      ];
      for (var bar = 0; bar < 2; bar++) {
        pattern.forEach(function (p) {
          GL.guitar.note({
            midi: notes.fretMidi(tuning, p.s, frets[p.s]),
            when: t0 + (bar * 4 + p.t) * beat,
            velocity: p.v, tone: p.tone, stringIndex: p.s
          });
        });
      }
    }

    wrap.appendChild(h('header.card-head', [
      h('h2', 'Sound check'),
      h('span.card-tag', 'no samples, no downloads')
    ]));
    wrap.appendChild(h('p.card-intro',
      'The guitar you are about to hear is a physical model of a plucked string, ' +
      'synthesised in the browser. It is what plays every chord, scale and song in the app.'));
    wrap.appendChild(chordRow);
    wrap.appendChild(diagram);
    wrap.appendChild(caption);
    wrap.appendChild(h('div.row.row-wrap', [
      h('button.btn', { type: 'button', onclick: playScale }, 'Run an A minor pentatonic'),
      h('button.btn', { type: 'button', onclick: playTravis }, 'Alternating bass on C')
    ]));
    wrap.appendChild(h('div.field-inline', [h('span', 'Right hand'), toneRow]));
    return wrap;
  }

  /* ============================================================== the view === */

  GL.app.register('tools', {
    title: 'Practice bench',
    navLabel: 'Practice',
    icon: '&#9835;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'Practice bench'),
        h('p.view-sub', 'Tune up, set a tempo, and check the room before you start.')
      ]));
      root.appendChild(h('div.stack', [
        buildTuner(),
        buildMetronome(),
        buildSoundCheck()
      ]));
    },
    unmount: function () {
      if (tuner && tuner.isRunning()) tuner.stop();
      if (metronome && metronome.isRunning()) metronome.stop();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      beatLights = [];
      GL.guitar.stopAll();
    }
  });
}(window.GL = window.GL || {}));
