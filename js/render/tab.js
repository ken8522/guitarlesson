/* tab.js -- the tab notation format, its parser, and its renderer.

   Songs are stored as short strings rather than note objects, because a
   hundred-and-fifty-song library written as JSON would be unreadable and
   unmaintainable. One bar looks like this:

       "6-3:1, 4-0+3-0:1, 2-1:0.5 2-3:0.5, 1-0h2:1"

   Read it as: string 6 fret 3 for one beat; then strings 4 and 3 together for
   one beat; then two half-beat notes on string 2; then string 1 fret 0
   hammered to fret 2.

     n-f       string n (6 = low E), fret f
     a+b       sounded together
     :d        duration in beats, default 1
     h / p / s hammer-on, pull-off, slide to the fret that follows
     b         bend up (fret after b is where it arrives)
     r         rest
     x         dead/muted note
     ~         let ring (suppresses the usual damp at the note's end)

   The parser turns that into events the tab renderer draws and the scheduler
   plays, so the two can never disagree about what the song says.
*/
(function (GL) {
  'use strict';

  GL.render = GL.render || {};

  /* --------------------------------------------------------------- parsing */

  /* One bar string -> [{ dur, rest, notes:[{ stringIndex, fret, artic, to, ring }] }]

     Commas and spaces both separate events. The distinction is purely for the
     human writing the tab: a comma per beat and spaces inside it keeps a bar of
     sixteenths readable, and 150 hand-written songs is a lot of bars to read. */
  function parseBar(str) {
    if (!str) return [];
    return String(str).split(/[\s,]+/).map(function (chunk) {
      return chunk.trim();
    }).filter(Boolean).map(parseGroup).filter(Boolean);
  }

  function parseGroup(token) {
    var dur = 1;
    var body = token;
    var colon = token.lastIndexOf(':');
    if (colon !== -1) {
      var d = parseFloat(token.slice(colon + 1));
      if (!isNaN(d)) { dur = d; body = token.slice(0, colon); }
    }
    body = body.trim();
    if (!body || body === 'r' || body === 'R') return { dur: dur, rest: true, notes: [] };

    var notes = body.split('+').map(function (part) {
      part = part.trim();
      var ring = false;
      if (part.indexOf('~') !== -1) { ring = true; part = part.replace(/~/g, ''); }

      /* string-fret, then an optional articulation and destination fret. */
      var m = part.match(/^(\d)-(x|X|\d+)(?:([hpsb])(\d+))?$/);
      if (!m) return null;
      var stringNo = parseInt(m[1], 10);
      if (stringNo < 1 || stringNo > 6) return null;

      var dead = (m[2] === 'x' || m[2] === 'X');
      return {
        stringIndex: 6 - stringNo,
        string: stringNo,
        fret: dead ? 0 : parseInt(m[2], 10),
        dead: dead,
        artic: m[3] || null,
        to: m[4] !== undefined ? parseInt(m[4], 10) : null,
        ring: ring
      };
    }).filter(Boolean);

    return { dur: dur, rest: notes.length === 0, notes: notes };
  }

  /* A whole song -> a flat, beat-stamped event list plus bar boundaries.
     Repeats are expanded here, so playback and display always agree. */
  function parseSong(song) {
    var events = [];
    var bars = [];
    var beat = 0;

    (song.sections || []).forEach(function (section, si) {
      var reps = section.repeat || 1;
      for (var rep = 0; rep < reps; rep++) {
        (section.bars || []).forEach(function (barStr, bi) {
          var start = beat;
          parseBar(barStr).forEach(function (group) {
            if (!group.rest) {
              group.notes.forEach(function (n) {
                events.push({
                  beat: beat, dur: group.dur, stringIndex: n.stringIndex,
                  string: n.string, fret: n.fret, dead: n.dead,
                  artic: n.artic, to: n.to, ring: n.ring,
                  section: si, bar: bars.length
                });
              });
            }
            beat += group.dur;
          });
          bars.push({
            index: bars.length, start: start, end: beat,
            section: si, sectionName: section.name || '',
            repeat: rep, ofRepeats: reps, sourceBar: bi
          });
        });
      }
    });

    return { events: events, bars: bars, totalBeats: beat, song: song };
  }

  /* -------------------------------------------------------------- rendering */

  /* opts:
       parsed      result of parseSong, or { events, bars, totalBeats }
       fromBar     first bar to draw (default 0)
       barCount    how many bars (default all)
       pxPerBeat   horizontal scale, default 46
       showBeats   faint gridline per beat
  */
  function tabStaff(opts) {
    var parsed = opts.parsed;
    var bars = parsed.bars;
    if (!bars.length) return '<div class="tab-empty">No notation yet.</div>';

    var fromBar = opts.fromBar || 0;
    var barCount = opts.barCount || bars.length - fromBar;
    var slice = bars.slice(fromBar, fromBar + barCount);
    if (!slice.length) return '<div class="tab-empty">No notation yet.</div>';

    var startBeat = slice[0].start;
    var endBeat = slice[slice.length - 1].end;
    var beats = endBeat - startBeat;

    var ppb = opts.pxPerBeat || 46;
    var padL = 26, padR = 16, padT = 26, padB = 22;
    var lineGap = 15;
    var staffH = lineGap * 5;
    var width = padL + padR + beats * ppb;
    var height = staffH + padT + padB;

    function x(b) { return padL + (b - startBeat) * ppb; }
    /* String 1 (high E) on the top line, as tab is always written. */
    function y(si) { return padT + (5 - si) * lineGap; }

    var s = [];
    s.push('<svg class="tab" viewBox="0 0 ' + r(width) + ' ' + r(height) + '" width="' + r(width) +
           '" height="' + r(height) + '" role="img" aria-label="guitar tablature">');

    /* Six lines. */
    for (var si = 0; si < 6; si++) {
      s.push('<line class="tab-line" x1="' + r(padL) + '" y1="' + r(y(si)) +
             '" x2="' + r(width - padR) + '" y2="' + r(y(si)) + '"/>');
    }

    /* "TAB" clef down the left edge. */
    s.push('<text class="tab-clef" x="' + r(padL - 8) + '" y="' + r(padT + staffH / 2 + 4) +
           '" text-anchor="end">TAB</text>');

    /* Bar lines and section labels. */
    slice.forEach(function (bar, i) {
      s.push('<line class="tab-bar" x1="' + r(x(bar.start)) + '" y1="' + r(y(5)) +
             '" x2="' + r(x(bar.start)) + '" y2="' + r(y(0)) + '"/>');
      s.push('<text class="tab-barnum" x="' + r(x(bar.start) + 3) + '" y="' + r(padT - 12) +
             '">' + (bar.index + 1) + '</text>');
      if (i === 0 || bar.section !== slice[i - 1].section || bar.sectionName !== slice[i - 1].sectionName) {
        if (bar.sectionName) {
          s.push('<text class="tab-section" x="' + r(x(bar.start) + 3) + '" y="' + r(padT - 1) +
                 '">' + esc(bar.sectionName) + '</text>');
        }
      }
      if (opts.showBeats) {
        for (var b = bar.start + 1; b < bar.end; b++) {
          s.push('<line class="tab-beat" x1="' + r(x(b)) + '" y1="' + r(y(5)) +
                 '" x2="' + r(x(b)) + '" y2="' + r(y(0)) + '"/>');
        }
      }
    });
    s.push('<line class="tab-bar" x1="' + r(x(endBeat)) + '" y1="' + r(y(5)) +
           '" x2="' + r(x(endBeat)) + '" y2="' + r(y(0)) + '"/>');

    /* Fret numbers. */
    parsed.events.forEach(function (e) {
      if (e.beat < startBeat || e.beat >= endBeat) return;
      var label = e.dead ? 'x' : String(e.fret);
      var cx = x(e.beat);
      var cy = y(e.stringIndex);
      /* A pad behind the digit so the staff line does not run through it. */
      s.push('<rect class="tab-pad" x="' + r(cx - 5 - label.length * 1.6) + '" y="' + r(cy - 6) +
             '" width="' + r(10 + label.length * 3.2) + '" height="12" rx="2"/>');
      s.push('<text class="tab-fret" x="' + r(cx) + '" y="' + r(cy + 3.6) +
             '" text-anchor="middle">' + label + '</text>');

      if (e.artic && e.to !== null) {
        var toX = cx + e.dur * ppb;
        s.push('<path class="tab-slur" d="M' + r(cx + 5) + ' ' + r(cy - 7) +
               ' Q ' + r((cx + toX) / 2) + ' ' + r(cy - 15) + ' ' + r(toX - 5) + ' ' + r(cy - 7) + '"/>');
        s.push('<text class="tab-artic" x="' + r((cx + toX) / 2) + '" y="' + r(cy - 16) +
               '" text-anchor="middle">' + esc(e.artic.toUpperCase()) + '</text>');
        s.push('<rect class="tab-pad" x="' + r(toX - 6) + '" y="' + r(cy - 6) +
               '" width="12" height="12" rx="2"/>');
        s.push('<text class="tab-fret" x="' + r(toX) + '" y="' + r(cy + 3.6) +
               '" text-anchor="middle">' + e.to + '</text>');
      }
    });

    /* Playhead, parked off-screen until the transport moves it. */
    s.push('<line class="tab-playhead" id="' + (opts.playheadId || 'tabPlayhead') +
           '" x1="-10" y1="' + r(padT - 6) + '" x2="-10" y2="' + r(padT + staffH + 6) + '"/>');

    s.push('</svg>');

    return s.join('');
  }

  /* Move a rendered playhead to a beat position. Cheap enough for rAF. */
  function movePlayhead(svgRoot, beatPos, opts) {
    var line = svgRoot.querySelector('.tab-playhead');
    if (!line) return;
    var ppb = (opts && opts.pxPerBeat) || 46;
    var startBeat = (opts && opts.startBeat) || 0;
    var px = 26 + (beatPos - startBeat) * ppb;
    line.setAttribute('x1', px);
    line.setAttribute('x2', px);
  }

  function r(n) { return Math.round(n * 100) / 100; }
  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  GL.tab = { parseBar: parseBar, parseSong: parseSong };
  GL.render.tabStaff = tabStaff;
  GL.render.movePlayhead = movePlayhead;
}(window.GL = window.GL || {}));
