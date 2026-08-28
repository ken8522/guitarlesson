/* howto.js -- the instructions.

   Written plainly on purpose. Short sentences, every music word explained the
   first time it turns up, and no paragraph longer than three sentences. The
   diagrams are rendered live by the real renderers rather than described,
   because showing someone a chord box beats explaining one.
*/
(function (GL) {
  'use strict';

  var h = GL.app.h;
  var notes = GL.notes;

  var SECTIONS = [
    { id: 'tools', name: 'Practice bench', what:
      'Tune your guitar here using your microphone, and set a metronome — that is the clicking sound ' +
      'that keeps you in time. Start every practice here.' },
    { id: 'course', name: 'Course', what:
      '50 lessons, split into six groups. Each one tells you what to learn, shows you how, and gives ' +
      'you one thing to practise. Start anywhere you like.' },
    { id: 'chords', name: 'Chords', what:
      'Type any chord and see every way to play it on the neck. It also tells you which songs and ' +
      'keys that chord belongs to.' },
    { id: 'scales', name: 'Scales', what:
      'A scale is a set of notes that sound good together. This shows you where they are on the neck ' +
      'and plays them for you.' },
    { id: 'trainer', name: 'Trainer', what:
      'A quiz that helps you memorise where the notes are. Three minutes a day makes a real ' +
      'difference within a couple of weeks.' },
    { id: 'songs', name: 'Songs', what:
      '50 songs you can play right now, including sing-along songs with the words on screen. There ' +
      'is also a list of 290 famous songs with their chords and links to where you can find them.' },
    { id: 'jam', name: 'Jam', what:
      'A pretend band — drums, bass and a second guitar — that plays along with you in any key and ' +
      'any style. Good for practising solos or just having fun.' },
    { id: 'ear', name: 'Ear', what:
      'Trains you to recognise sounds without looking. This is how you learn to work out songs by ' +
      'listening instead of looking them up.' },
    { id: 'theory', name: 'Theory', what:
      'A wheel showing how all the keys connect. Click any key to see which chords belong in it.' },
    { id: 'progress', name: 'Progress', what:
      'Your practice plan, a timer, and a record of what you have done. Tick things off here.' }
  ];

  function jump(id, label) {
    return h('button.btn.btn-sm', {
      type: 'button', onclick: function () { GL.app.navigate(id); }
    }, label || 'Go there');
  }

  GL.app.register('how', {
    title: 'How to use this app',
    navLabel: 'How to use',
    icon: '&#9432;',
    mount: function (root) {
      root.appendChild(h('div.view-head', [
        h('h1', 'How to use this app'),
        h('p.view-sub', 'Five minutes of reading, and you will know where everything is.')
      ]));

      /* --- what it is --- */
      root.appendChild(h('section.card', [
        h('h2', 'What this is'),
        h('p.lesson-text',
          'This is a guitar teacher that lives in your browser. It listens to your guitar, plays ' +
          'examples for you, and keeps track of what you have learned.'),
        h('p.lesson-text',
          'Everything works offline. There is no account, no password, and nothing gets sent ' +
          'anywhere.')
      ]));

      /* --- first two things --- */
      root.appendChild(h('section.card.howto-first', [
        h('h2', 'Do these two things first'),
        h('div.howstep', [
          h('span.howstep-num', '1'),
          h('div', [
            h('h3', 'Click anywhere to turn the sound on'),
            h('p.lesson-text',
              'Web browsers keep sound switched off until you click something. If you cannot hear ' +
              'anything, that is almost always why. One click fixes it.')
          ])
        ]),
        h('div.howstep', [
          h('span.howstep-num', '2'),
          h('div', [
            h('h3', 'Tune your guitar'),
            h('p.lesson-text',
              'Go to the Practice bench and press "Start tuner". Allow the microphone when your ' +
              'browser asks. Then play one string at a time.'),
            h('p.lesson-text',
              'The needle shows if the string is too low (flat) or too high (sharp). Turn the ' +
              'tuning peg until the needle sits in the middle and turns green.'),
            h('div.row', [jump('tools', 'Open the tuner')])
          ])
        ])
      ]));

      /* --- the sections --- */
      var list = h('div.howgrid');
      SECTIONS.forEach(function (s) {
        list.appendChild(h('div.howcard', [
          h('h3', s.name),
          h('p.lesson-text', s.what),
          h('div.row', [jump(s.id)])
        ]));
      });
      root.appendChild(h('section.card', [
        h('h2', 'What each part is for'),
        h('p.lesson-text', 'These are the buttons down the left side of the screen.'),
        list
      ]));

      /* --- reading the diagrams --- */
      root.appendChild(buildDiagramGuide());

      /* --- first week --- */
      root.appendChild(h('section.card', [
        h('h2', 'What to do in your first week'),
        h('p.lesson-text',
          'You do not have to do it this way. But if you are not sure where to start, this works.'),
        h('ol.lesson-list', [
          h('li', ['Day 1 — Tune up. Then read ', link('course', 'l=a1', 'the first lesson on barre chords'), ' and try the five shapes slowly.']),
          h('li', ['Day 2 — Same lesson again, with the metronome at 60. Then play a sing-along song you already know.']),
          h('li', ['Day 3 — Try ', link('course', 'l=b2', 'the alternating bass lesson'), '. This is the fingerpicking pattern behind most folk music.']),
          h('li', 'Day 4 — Five minutes in the Trainer. Then pick a song from the Songs section and learn the first verse.'),
          h('li', 'Day 5 — Start the Jam band on a slow blues and just play over it. No goal. This is the fun day, and it matters as much as the others.'),
          h('li', 'Day 6 and 7 — Go back to whichever of those you enjoyed most.')
        ]),
        h('div.row.row-wrap', [jump('course', 'Open the course'), jump('progress', 'Set up a practice plan')])
      ]));

      /* --- saving --- */
      root.appendChild(h('section.card', [
        h('h2', 'Where your work is saved'),
        h('p.lesson-text',
          'Your progress is saved inside this browser, on this computer. You do not need to press ' +
          'save — it happens on its own.'),
        h('p.lesson-text',
          'It will not follow you to another computer. And if you clear your browsing data, it ' +
          'goes too.')
      ]));

      /* --- honesty about the song library --- */
      root.appendChild(h('section.card', [
        h('h2', 'Why some songs have words and others do not'),
        h('p.lesson-text',
          'Song lyrics are protected by copyright for 95 years. So this app can only print the ' +
          'words to songs published in 1930 or earlier.'),
        h('p.lesson-text',
          'That covers a huge amount of what people actually sing together — campfire songs, sea ' +
          'shanties, Irish pub songs, spirituals and old singalongs. Those all have the full words ' +
          'here.'),
        h('p.lesson-text',
          'Newer songs are still listed, with their key and their chords, and a link to a site that ' +
          'is allowed to show you the words. You can also press "Jam the changes" on any of them to ' +
          'practise along.'),
        h('div.row', [jump('songs', 'Open the songs')])
      ]));
    }
  });

  function link(view, params, label) {
    return h('button.linkbtn', {
      type: 'button', onclick: function () { GL.app.navigate(view, params); }
    }, label);
  }

  /* Live examples of each kind of diagram, with the parts named. */
  function buildDiagramGuide() {
    var card = h('section.card', [
      h('h2', 'How to read the pictures'),
      h('p.lesson-text', 'There are four kinds. Here is what each one means.')
    ]);

    /* 1. chord box */
    var g = GL.chords.voicings('G', { tuning: notes.TUNINGS.standard.strings, limit: 1 })[0];
    card.appendChild(h('div.howdiagram', [
      h('div.howdiagram-art', { html: GL.render.voicingDiagram(g, { name: 'G', size: 'lg' }) }),
      h('div', [
        h('h3', 'A chord box'),
        h('p.lesson-text',
          'This is the neck of the guitar seen standing up, looking at it from the front. The thick ' +
          'bar at the top is the nut, at the very end of the neck.'),
        h('ul.lesson-list', [
          h('li', 'The six vertical lines are the strings. The thickest string is on the left.'),
          h('li', 'The horizontal lines are the metal frets.'),
          h('li', 'A dot means put a finger there. The number inside the dot is which finger: 1 is your index finger, 4 is your little finger.'),
          h('li', 'A circle above a string means play it without holding it down. That is called an open string.'),
          h('li', 'An X above a string means do not play that string at all.'),
          h('li', 'A number to the left tells you which fret the box starts on, if it is not the nut.')
        ]),
        h('p.hint', 'Click any chord box anywhere in the app to hear it.')
      ])
    ]));

    /* 2. neck diagram */
    var cells = GL.scales.positions('G', 'majorPentatonic', {
      tuning: notes.TUNINGS.standard.strings, mode: 'box'
    })[0];
    card.appendChild(h('div.howdiagram.is-wide', [
      h('div', [
        h('h3', 'A neck diagram'),
        h('p.lesson-text',
          'Same guitar, but lying down this time, the way it sits when you play. The thinnest ' +
          'string is on top.'),
        h('ul.lesson-list', [
          h('li', 'Each dot is a note you can play.'),
          h('li', 'Amber dots are the most important note — the one the scale is named after. It is called the root.'),
          h('li', 'The numbers on the dots say how far each note is from the root.'),
          h('li', 'The numbers along the bottom are the fret numbers.')
        ])
      ]),
      h('div.neckwrap', {
        html: GL.render.fretboard({
          cells: cells ? cells.cells : [],
          tuning: notes.TUNINGS.standard.strings,
          fromFret: 0, toFret: 8, label: 'degree'
        })
      })
    ]));

    /* 3. tab */
    var parsed = GL.tab.parseSong({
      sections: [{ bars: ['6-3:1, 5-2:1, 4-0:1, 3-0:1', '3-0:0.5 2-0:0.5, 1-3:2, r:1'] }]
    });
    card.appendChild(h('div.howdiagram.is-wide', [
      h('div', [
        h('h3', 'Tab'),
        h('p.lesson-text',
          'Tab is a way of writing music made just for guitar. You do not need to read normal music ' +
          'to use it.'),
        h('ul.lesson-list', [
          h('li', 'The six lines are the six strings. The top line is the thinnest string.'),
          h('li', 'A number on a line means press that fret on that string. A 0 means play it open.'),
          h('li', 'Read left to right. Numbers stacked on top of each other are played together.'),
          h('li', 'A curved line joining two numbers means slide or hammer between them instead of picking twice.')
        ]),
        h('p.hint', 'Every piece of tab in the app has a Play button, so you can hear it first.')
      ]),
      h('div.tabwrap', { html: GL.render.tabStaff({ parsed: parsed, showBeats: true }) })
    ]));

    /* 4. lyric sheet */
    var demo = {
      key: 'G',
      lyrics: [{ section: 'Example', lines: ['[G]Row, row, row your [C]boat, gently [G]down the stream'] }]
    };
    card.appendChild(h('div.howdiagram.is-wide', [
      h('div', [
        h('h3', 'A sing-along sheet'),
        h('p.lesson-text',
          'The chord name sits above the exact word where you change to that chord.'),
        h('p.lesson-text',
          'So in the line below, you start on G, change to C on the word "boat", and change back to ' +
          'G on the word "down".'),
        h('ul.lesson-list', [
          h('li', 'Use the − and + buttons to move the whole song up or down until it suits your voice. The chord shapes change too.'),
          h('li', 'Turn on Big text if you are reading from further away.'),
          h('li', 'Auto-scroll moves the page down slowly so you do not have to let go of the guitar.')
        ])
      ]),
      h('div.sheet', { html: GL.render.lyricSheet(demo, {}) })
    ]));

    return card;
  }
}(window.GL = window.GL || {}));
