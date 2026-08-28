/* songs-blues.js -- pre-1930 blues and early jazz standards. All public domain
   in the United States. See songs-folk.js for the schema. */
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  GL.songs.blues = [
    {
      id: 'st-james',
      title: 'St. James Infirmary',
      origin: 'Traditional, descended from the English broadside "The Unfortunate Rake"',
      key: 'Dm', tempo: 76, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Blues', tags: ['minor', 'slow', 'eight-bar'],
      about: 'An eight-bar minor blues rather than a twelve-bar. The harmony is closer to early jazz ' +
             'than to Delta blues, which is why it sits so well with a walking bass underneath.',
      chords: ['Dm', 'A7', 'Gm', 'C7', 'F'],
      form: [{ name: 'Verse', bars: ['Dm', 'A7', 'Dm', 'Dm', 'Gm', 'Dm', 'A7', 'Dm'] }]
    },
    {
      id: 'careless-love',
      title: 'Careless Love',
      origin: 'Traditional American, in circulation by the 1890s',
      key: 'G', tempo: 88, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Blues', tags: ['sixteen-bar', 'fingerstyle', 'swing'],
      about: 'A sixteen-bar form built almost entirely on the circle of fifths, which makes it a ' +
             'gentle introduction to secondary dominants: the E7 and A7 are both out of the key.',
      chords: ['G', 'E7', 'A7', 'D7', 'C'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'E7', 'E7', 'A7', 'A7', 'D7', 'D7', 'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G'] }]
    },
    {
      id: 'frankie-johnny',
      title: 'Frankie and Johnny',
      origin: 'Traditional American murder ballad, first published 1904',
      key: 'C', tempo: 96, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Blues', tags: ['twelve-bar', 'ragtime', 'fingerstyle'],
      about: 'A twelve-bar with a ragtime bent. The G7 in bar 9 wants a bass run into it, and the ' +
             'whole thing sits well with a swung alternating bass.',
      chords: ['C', 'C7', 'F', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'C', 'C7', 'F', 'F', 'C', 'C', 'G7', 'G7', 'C', 'G7'] }]
    },
    {
      id: 'nobody-knows-you',
      title: "Nobody Knows You When You're Down and Out",
      origin: 'Jimmy Cox, 1923',
      key: 'C', tempo: 84, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Blues', tags: ['sixteen-bar', 'jazz', 'diminished'],
      about: 'Richer harmony than most blues of the period -- a diminished passing chord, a secondary ' +
             'dominant and a proper ii-V. Good practice for the substitution lesson in track A.',
      chords: ['C', 'E7', 'A7', 'Dm', 'F', 'Fm', 'G7', 'C7'],
      form: [{ name: 'Verse', bars: ['C', 'E7', 'A7', 'A7', 'Dm', 'Dm', 'F', 'Fm', 'C', 'A7', 'Dm', 'G7', 'C', 'F', 'C', 'G7'] }]
    },
    {
      id: 'midnight-special',
      title: 'Midnight Special',
      origin: 'Traditional American prison song, collected by the Lomaxes in the 1930s',
      key: 'A', tempo: 104, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Blues', tags: ['three chords', 'shuffle', 'easy'],
      about: 'Three chords, a shuffle feel and a chorus everyone can sing. The simplest thing in the ' +
             'library, and a good one to test whether your shuffle is actually swinging.',
      chords: ['A', 'D', 'E7'],
      form: [{ name: 'Verse', bars: ['A', 'A', 'D', 'D', 'A', 'A', 'E7', 'A'] }]
    },
    {
      id: 'stagger-lee',
      title: "Stagger Lee (Stack O'Lee Blues)",
      origin: 'Traditional, from an 1895 St. Louis killing; recorded from 1923',
      key: 'E', tempo: 100, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Blues', tags: ['twelve-bar', 'fingerstyle', 'open E'],
      about: 'A twelve-bar in E, which means every chord has an open bass string. That is what makes ' +
             'the Piedmont-style alternating bass possible at speed.',
      chords: ['E7', 'A7', 'B7'],
      form: [{ name: 'Verse', bars: ['E7', 'E7', 'E7', 'E7', 'A7', 'A7', 'E7', 'E7', 'B7', 'A7', 'E7', 'B7'] }],
      tab: {
        name: 'Turnaround in E', tempo: 92, tone: 'finger',
        bars: ['6-0+3-4:1, 6-0+3-3:1, 6-0+3-2:1, 6-0+3-1:1', '6-0+3-1:2, 5-2+4-1:2']
      }
    },
    {
      id: 'corrina',
      title: 'Corrina, Corrina',
      origin: 'Traditional; first recorded 1928',
      key: 'C', tempo: 92, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Blues', tags: ['eight-bar', 'swing', 'fingerstyle'],
      about: 'An eight-bar blues with an unusually singable melody. The form is short enough that ' +
             'you get plenty of turnarounds to practise.',
      chords: ['C', 'E7', 'A7', 'D7', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'E7', 'A7', 'D7', 'G7', 'C', 'G7'] }]
    },
    {
      id: 'motherless-children',
      title: 'Motherless Children',
      origin: 'Traditional American spiritual; recorded by Blind Willie Johnson, 1927',
      key: 'D', tempo: 108, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Blues', tags: ['slide', 'open D', 'gospel'],
      about: 'Usually played in open D or open G with a slide. In standard tuning it works as a ' +
             'driving three-chord gospel blues, and the melody sits high enough to bend into.',
      chords: ['D', 'G', 'A7'],
      form: [{ name: 'Verse', bars: ['D', 'D', 'G', 'D', 'D', 'A7', 'D', 'D'] }]
    }
  ];
}(window.GL = window.GL || {}));
