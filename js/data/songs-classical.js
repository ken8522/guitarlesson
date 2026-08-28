/* songs-classical.js -- classical guitar repertoire and Renaissance tunes.
   All composers died well over a century ago; all public domain.
   See songs-folk.js for the schema. */
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  GL.songs.classical = [
    {
      id: 'romanza',
      title: 'Romanza (Spanish Romance)',
      origin: 'Anonymous, nineteenth century',
      key: 'Em', tempo: 92, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Classical', tags: ['arpeggio', 'pima', '3/4', 'melody'],
      about: 'The most played piece in the guitar repertoire, and nobody knows who wrote it. A single ' +
             'right-hand pattern -- p on the bass, then a-m-i repeating -- runs the whole way through, ' +
             'with the melody carried by the ring finger.',
      chords: ['Em', 'B7', 'E', 'A', 'Am'],
      form: [
        { name: 'A section (minor)', bars: ['Em', 'Em', 'B7', 'B7', 'Em', 'Em', 'B7', 'Em'] },
        { name: 'B section (major)', bars: ['E', 'E', 'A', 'E', 'B7', 'B7', 'E', 'E'] }
      ],
      tab: {
        name: 'Opening arpeggio', tempo: 92, timeSig: [3, 4], tone: 'finger',
        bars: [
          '6-0+1-12:1, 2-0:1, 3-0:1',
          '6-0+1-12:1, 2-0:1, 3-0:1',
          '6-0+1-11:1, 2-0:1, 3-0:1',
          '6-0+1-9:1, 2-0:1, 3-0:1'
        ]
      }
    },
    {
      id: 'lagrima',
      title: 'Lágrima',
      origin: 'Francisco Tárrega, c.1900',
      key: 'E', tempo: 76, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 4, genre: 'Classical', tags: ['tarrega', 'melody', 'slurs'],
      about: 'A short prelude that moves from E major to E minor and back. Tárrega wrote it as a ' +
             'study in tone rather than technique -- the difficulty is making it sing, not playing it.',
      chords: ['E', 'B7', 'A', 'Em', 'Am', 'F#7'],
      form: [
        { name: 'Major section', bars: ['E', 'B7', 'E', 'A', 'E', 'B7', 'E', 'E'] },
        { name: 'Minor section', bars: ['Em', 'Am', 'Em', 'B7', 'Em', 'Am', 'B7', 'Em'] }
      ]
    },
    {
      id: 'bourree-em',
      title: 'Bourrée in E minor',
      origin: 'J. S. Bach, BWV 996, c.1710 -- written for lute',
      key: 'Em', tempo: 104, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 4, genre: 'Classical', tags: ['bach', 'counterpoint', 'two voices'],
      about: 'Two independent lines played by one pair of hands. The bass is a tune in its own right, ' +
             'and the piece falls apart the moment you treat it as melody-plus-accompaniment.',
      chords: ['Em', 'B7', 'Am', 'D', 'G', 'C'],
      form: [
        { name: 'A section', bars: ['Em', 'Em', 'B7', 'Em', 'Am', 'D', 'G', 'B7'] },
        { name: 'B section', bars: ['Em', 'Am', 'D', 'G', 'C', 'Am', 'B7', 'Em'] }
      ]
    },
    {
      id: 'minuet-g',
      title: 'Minuet in G',
      origin: 'Christian Petzold, c.1725 (long attributed to Bach)',
      key: 'G', tempo: 116, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Classical', tags: ['baroque', '3/4', 'melody', 'first piece'],
      about: 'The easiest genuine baroque piece on the guitar, and a good first two-voice study. The ' +
             'melody stays in first position almost throughout.',
      chords: ['G', 'D', 'C', 'Am', 'D7'],
      form: [
        { name: 'A section', bars: ['G', 'G', 'D', 'G', 'C', 'G', 'D7', 'G'] },
        { name: 'B section', bars: ['D', 'D', 'G', 'D', 'Am', 'D7', 'G', 'G'] }
      ]
    },
    {
      id: 'greensleeves',
      title: 'Greensleeves',
      origin: 'Traditional English, registered 1580',
      key: 'Am', tempo: 96, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Classical', tags: ['renaissance', 'minor', '3/4', 'melody'],
      about: 'Four hundred years old and still the clearest example of the Renaissance minor sound: ' +
             'a natural minor scale with a raised seventh only in the cadences.',
      chords: ['Am', 'C', 'G', 'E7', 'F', 'Dm'],
      form: [
        { name: 'Verse', bars: ['Am', 'C', 'G', 'Am', 'Am', 'E7', 'Am', 'Am'] },
        { name: 'Refrain', bars: ['C', 'G', 'Am', 'E7', 'C', 'G', 'Am', 'E7'] }
      ]
    },
    {
      id: 'carcassi-study',
      title: 'Study in A minor, Op. 60 No. 3',
      origin: 'Matteo Carcassi, 1836',
      key: 'Am', tempo: 88, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Classical', tags: ['study', 'arpeggio', 'right hand'],
      about: 'A right-hand study disguised as a piece. One arpeggio pattern, held through changing ' +
             'harmony -- exactly the discipline the fingerstyle track is built on.',
      chords: ['Am', 'E7', 'Dm', 'G7', 'C', 'F'],
      form: [
        { name: 'A section', bars: ['Am', 'E7', 'Am', 'E7', 'Am', 'Dm', 'E7', 'Am'] },
        { name: 'B section', bars: ['C', 'G7', 'C', 'F', 'Dm', 'E7', 'Am', 'Am'] }
      ]
    }
  ];
}(window.GL = window.GL || {}));
