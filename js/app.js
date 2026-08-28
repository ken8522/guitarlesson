/* app.js -- shell, router, saved state, and the DOM helpers everything uses.

   Views register themselves with GL.app.register() at load time and are mounted
   on demand, so adding a feature never means editing this file.
*/
(function (GL) {
  'use strict';

  var STORAGE_KEY = 'fretwork.v1';

  var DEFAULT_STATE = {
    v: 1,
    settings: {
      tuning: 'standard',
      capo: 0,
      volume: 0.9,
      reverb: 0.16,
      tone: 'steel',
      a4: 440
    },
    metronome: { bpm: 90, beatsPerBar: 4, subdivision: 1, mode: 'all', swing: 0 },
    progress: { lessons: {}, practiceLog: [], lastSeen: null },
    favorites: { chords: [], scales: [], songs: [] }
  };

  /* ----------------------------------------------------------------- state */

  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepCopy(DEFAULT_STATE);
      var saved = JSON.parse(raw);
      /* Merge rather than replace: a state file written by an older phase must
         still work after a new phase adds fields. */
      return merge(deepCopy(DEFAULT_STATE), saved);
    } catch (e) {
      return deepCopy(DEFAULT_STATE);
    }
  }

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) { /* private browsing, quota -- the app still works */ }
    }, 250);
  }

  function merge(base, over) {
    if (!over || typeof over !== 'object') return base;
    Object.keys(over).forEach(function (k) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) &&
          base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        merge(base[k], over[k]);
      } else if (over[k] !== undefined) {
        base[k] = over[k];
      }
    });
    return base;
  }

  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

  function tuning() {
    return (GL.notes.TUNINGS[state.settings.tuning] || GL.notes.TUNINGS.standard).strings;
  }

  /* ----------------------------------------------------------- DOM helpers */

  /* h('div.card', { onclick: fn }, [ 'text', h('span', 'more') ]) */
  function h(spec, attrs, children) {
    var parts = String(spec).split(/(?=[.#])/);
    var el = document.createElement(parts[0] || 'div');
    parts.slice(1).forEach(function (p) {
      if (p[0] === '.') el.classList.add(p.slice(1));
      else if (p[0] === '#') el.id = p.slice(1);
    });

    if (Array.isArray(attrs) || typeof attrs === 'string' || attrs instanceof Node) {
      children = attrs;
      attrs = null;
    }

    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
          el.addEventListener(k.slice(2), v);
        } else if (k === 'dataset') {
          Object.keys(v).forEach(function (d) { el.dataset[d] = v[d]; });
        } else if (k === 'style' && typeof v === 'object') {
          Object.keys(v).forEach(function (p) { el.style[p] = v[p]; });
        } else {
          el.setAttribute(k, v === true ? '' : v);
        }
      });
    }

    append(el, children);
    return el;
  }

  function append(el, children) {
    if (children === null || children === undefined) return el;
    if (Array.isArray(children)) {
      children.forEach(function (c) { append(el, c); });
    } else if (children instanceof Node) {
      el.appendChild(children);
    } else {
      el.appendChild(document.createTextNode(String(children)));
    }
    return el;
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---------------------------------------------------------------- router */

  var views = {};
  var order = [];
  var currentId = null;
  var currentView = null;

  function register(id, def) {
    views[id] = def;
    if (order.indexOf(id) === -1) order.push(id);
  }

  /* Nav order would otherwise be script-load order, which puts every stub after
     every built feature. Anything not listed keeps its registration order at the
     end. The first entry is also the default route. */
  function setNavOrder(ids) {
    order.sort(function (a, b) {
      var ia = ids.indexOf(a), ib = ids.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  }

  function navigate(id, params) {
    var target = views[id] ? id : order[0];
    var hash = '#/' + target + (params ? '?' + params : '');
    if (location.hash === hash) mount(target, params);
    else location.hash = hash;
  }

  /* Where an empty hash lands. First run gets the instructions; after that it
     goes straight to the practice bench, because landing on a help page every
     session would be irritating. "First run" means nothing has been done yet. */
  function defaultView() {
    var p = state.progress;
    var touched = Object.keys(p.lessons || {}).length > 0 ||
                  (p.practiceLog || []).length > 0 ||
                  Object.keys(p.trainer || {}).length > 0;
    if (!touched && views.how) return 'how';
    return views.tools ? 'tools' : order[0];
  }

  function parseHash() {
    var raw = location.hash.replace(/^#\/?/, '');
    var q = raw.indexOf('?');
    return {
      id: (q === -1 ? raw : raw.slice(0, q)) || defaultView(),
      params: q === -1 ? '' : raw.slice(q + 1)
    };
  }

  function mount(id, params) {
    var def = views[id];
    var root = $('#viewRoot');
    if (!def || !root) return;

    if (currentView && currentView.unmount) {
      try { currentView.unmount(); } catch (e) { console.error(e); }
    }

    clear(root);
    currentId = id;
    currentView = def;
    document.title = def.title ? def.title + ' - Fretwork' : 'Fretwork';

    $$('.nav-item').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.view === id);
    });

    try {
      def.mount(root, parseParams(params));
    } catch (e) {
      console.error('View "' + id + '" failed to mount:', e);
      root.appendChild(h('div.notice.is-error', [
        h('strong', 'This view hit an error.'),
        h('p', String(e && e.message ? e.message : e))
      ]));
    }
    root.scrollTop = 0;
  }

  function parseParams(str) {
    var out = {};
    (str || '').split('&').filter(Boolean).forEach(function (pair) {
      var i = pair.indexOf('=');
      out[decodeURIComponent(i === -1 ? pair : pair.slice(0, i))] =
        i === -1 ? true : decodeURIComponent(pair.slice(i + 1));
    });
    return out;
  }

  function onHashChange() {
    var r = parseHash();
    mount(views[r.id] ? r.id : defaultView(), r.params);
  }

  /* ------------------------------------------------------------------ chrome */

  function buildNav() {
    var nav = $('#nav');
    if (!nav) return;
    clear(nav);
    order.forEach(function (id) {
      var def = views[id];
      nav.appendChild(h('button.nav-item', {
        dataset: { view: id },
        type: 'button',
        onclick: function () { navigate(id); }
      }, [
        h('span.nav-icon', { html: def.icon || '' }),
        h('span.nav-label', def.navLabel || def.title || id)
      ]));
    });
  }

  /* A one-off banner: browsers keep audio suspended until the user acts. */
  function audioGate() {
    var bar = $('#audioGate');
    if (!bar) return;
    function ready() {
      bar.classList.add('is-hidden');
    }
    function wake() {
      GL.audio.unlock().then(function () {
        GL.audio.setMasterVolume(state.settings.volume);
        GL.audio.setReverb(state.settings.reverb);
        ready();
      });
    }
    bar.addEventListener('click', wake);
    /* Any click anywhere counts as the gesture the browser wants. */
    document.addEventListener('click', function once() {
      document.removeEventListener('click', once);
      wake();
    });
  }

  function toast(message, kind) {
    var host = $('#toasts');
    if (!host) return;
    var t = h('div.toast' + (kind ? '.is-' + kind : ''), message);
    host.appendChild(t);
    setTimeout(function () { t.classList.add('is-out'); }, 2600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  /* Placeholder view for phases not yet built, so the nav never lies. */
  function stub(id, title, icon, blurb, phase) {
    register(id, {
      title: title,
      icon: icon,
      mount: function (root) {
        root.appendChild(h('div.stub', [
          h('div.stub-icon', { html: icon }),
          h('h2', title),
          h('p', blurb),
          h('p.stub-phase', 'Arriving in phase ' + phase + '.')
        ]));
      }
    });
  }

  function start() {
    buildNav();
    audioGate();
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    state.progress.lastSeen = new Date().toISOString();
    save();
  }

  GL.app = {
    state: state,
    save: save,
    tuning: tuning,
    register: register,
    setNavOrder: setNavOrder,
    stub: stub,
    navigate: navigate,
    toast: toast,
    start: start,
    h: h, append: append, clear: clear, $: $, $$: $$
  };
}(window.GL = window.GL || {}));
