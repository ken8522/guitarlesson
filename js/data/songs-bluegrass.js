/* songs-bluegrass.js -- old-time, bluegrass and fiddle tunes. All traditional
   and public domain. See songs-folk.js for the schema. */
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  GL.songs.bluegrass = [
    {
      id: 'cripple-creek',
      title: 'Cripple Creek',
      origin: 'Traditional American old-time fiddle and banjo tune',
      key: 'A', tempo: 120, timeSig: [4, 4], capo: 2, tuning: 'standard',
      difficulty: 2, genre: 'Bluegrass', tags: ['fiddle tune', 'flatpicking', 'AABB'],
      about: 'The first fiddle tune most people learn. Capo 2 and play in G shapes -- that is how it ' +
             'is done at every jam, and the open strings are half the sound.',
      chords: ['A', 'D', 'E'],
      form: [
        { name: 'A part', bars: ['A', 'A', 'A', 'E', 'A', 'A', 'E', 'A'] },
        { name: 'B part', bars: ['A', 'D', 'A', 'E', 'A', 'D', 'E', 'A'] }
      ],
      tab: {
        name: 'A part, in G shapes (capo 2)', tempo: 120, tone: 'steel',
        bars: [
          '3-0:0.5 2-0:0.5, 2-3:0.5 2-0:0.5, 3-0:0.5 3-2:0.5, 4-0:1',
          '3-0:0.5 2-0:0.5, 2-3:1, 2-0:0.5 3-0:0.5, 3-2:1'
        ]
      }
    },
    {
      id: 'old-joe-clark',
      title: 'Old Joe Clark',
      origin: 'Traditional American, from the Appalachians',
      key: 'A', tempo: 124, timeSig: [4, 4], capo: 2, tuning: 'standard',
      difficulty: 2, genre: 'Bluegrass', tags: ['mixolydian', 'fiddle tune', 'modal'],
      about: 'Mixolydian -- the flat 7 is what gives it that slightly wrong, entirely right sound. ' +
             'The G chord in the B part is the flat VII, and it is the whole character of the tune.',
      chords: ['A', 'G', 'E'],
      form: [
        { name: 'A part', bars: ['A', 'A', 'A', 'A', 'A', 'A', 'E', 'A'] },
        { name: 'B part', bars: ['G', 'G', 'A', 'A', 'G', 'G', 'E', 'A'] }
      ]
    },
    {
      id: 'soldiers-joy',
      title: "Soldier's Joy",
      origin: 'Traditional, printed in Scotland in the 1760s',
      key: 'D', tempo: 116, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Bluegrass', tags: ['fiddle tune', 'flatpicking', 'AABB'],
      about: 'One of the oldest tunes still in common circulation on both sides of the Atlantic. ' +
             'Good crosspicking practice: the melody moves in continuous eighth notes.',
      chords: ['D', 'G', 'A'],
      form: [
        { name: 'A part', bars: ['D', 'D', 'G', 'D', 'D', 'A', 'D', 'D'] },
        { name: 'B part', bars: ['D', 'D', 'G', 'D', 'D', 'A', 'D', 'D'] }
      ]
    },
    {
      id: 'arkansas-traveler',
      title: 'Arkansas Traveler',
      origin: 'Traditional American, c.1840',
      key: 'D', tempo: 120, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Bluegrass', tags: ['fiddle tune', 'flatpicking'],
      about: 'A jam standard, and a good test of alternate picking -- the A part is almost entirely ' +
             'eighth notes with no natural place to rest.',
      chords: ['D', 'G', 'A'],
      form: [
        { name: 'A part', bars: ['D', 'D', 'A', 'D', 'D', 'D', 'A', 'D'] },
        { name: 'B part', bars: ['G', 'G', 'D', 'D', 'G', 'D', 'A', 'D'] }
      ]
    },
    {
      id: 'angeline-baker',
      title: 'Angeline the Baker',
      origin: 'Stephen Foster, 1850, as "Angelina Baker"; reshaped by oral tradition',
      key: 'D', tempo: 112, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Bluegrass', tags: ['old-time', 'two chords', 'mixolydian'],
      about: 'Foster wrote it; old-time musicians rewrote it. Two chords, and the C natural in the ' +
             'melody makes it mixolydian rather than major.',
      chords: ['D', 'C', 'G'],
      form: [
        { name: 'A part', bars: ['D', 'D', 'D', 'D', 'C', 'C', 'D', 'D'] },
        { name: 'B part', bars: ['D', 'D', 'C', 'C', 'D', 'C', 'D', 'D'] }
      ]
    },
    {
      id: 'john-henry',
      title: 'John Henry',
      origin: 'Traditional American ballad, from the 1870s',
      key: 'G', tempo: 100, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Bluegrass', tags: ['ballad', 'blues', 'boom-chick'],
      about: 'A work song, a ballad and a blues at the same time. Played hard with a boom-chick and ' +
             'a bass run into every change.',
      chords: ['G', 'C', 'D'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D', 'G', 'G'] }]
    },
    {
      id: 'little-maggie',
      title: 'Little Maggie',
      origin: 'Traditional Appalachian',
      key: 'A', tempo: 116, timeSig: [4, 4], capo: 2, tuning: 'standard',
      difficulty: 2, genre: 'Bluegrass', tags: ['modal', 'mixolydian', 'banjo tune'],
      about: 'Modal and stubbornly major-ish despite the bleak lyric. The flat VII again -- a huge ' +
             'proportion of the old-time repertoire lives in mixolydian.',
      chords: ['A', 'G', 'D', 'E'],
      form: [{ name: 'Verse', bars: ['A', 'A', 'G', 'G', 'A', 'A', 'E', 'A'] }]
    },
    {
      id: 'darlin-corey',
      title: "Darlin' Corey",
      origin: 'Traditional Appalachian, recorded from the 1920s',
      key: 'A', tempo: 108, timeSig: [4, 4], capo: 2, tuning: 'standard',
      difficulty: 2, genre: 'Bluegrass', tags: ['modal', 'banjo tune', 'three chords'],
      about: 'A banjo tune that transfers well to guitar. Frequently played in open G tuning with a ' +
             'capo, which is worth trying once the tunings track makes sense.',
      chords: ['A', 'D', 'E', 'G'],
      form: [{ name: 'Verse', bars: ['A', 'A', 'D', 'A', 'A', 'E', 'A', 'A'] }]
    }
  ];
}(window.GL = window.GL || {}));
