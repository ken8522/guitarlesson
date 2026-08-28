/* songs-folk.js -- traditional folk. All public domain.

   Song schema:
     id, title, origin, about      what it is and where it came from
     key, tempo, timeSig, capo     how to play it
     tuning                        key into GL.notes.TUNINGS
     difficulty                    1 (easy) to 5 (hard)
     genre, tags                   for filtering
     chords                        every chord the song needs
     form                          [{ name, bars: [chord per bar] }]
     tab                           optional melody, in the tab DSL

   Nothing in these files is under copyright. Where a song has a known author,
   that author died long enough ago -- or the work was published early enough --
   that it is public domain in the United States.
*/
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  GL.songs.folk = [
    {
      id: 'rising-sun',
      title: 'House of the Rising Sun',
      origin: 'Traditional, English broadside ballad by descent; collected in Appalachia in the 1930s',
      key: 'Am', tempo: 76, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Folk', tags: ['minor', 'arpeggio', 'fingerstyle', '3/4'],
      about: 'The arpeggiated 6/8 version everyone knows is a twentieth-century arrangement of a much ' +
             'older ballad. Played in 3/4 with a rolling right hand it is the best possible exercise ' +
             'in keeping a pattern steady through a chord change.',
      chords: ['Am', 'C', 'D', 'F', 'E7'],
      form: [
        { name: 'Verse', bars: ['Am', 'C', 'D', 'F', 'Am', 'C', 'E7', 'E7'] },
        { name: 'Turnaround', bars: ['Am', 'C', 'D', 'F', 'Am', 'E7', 'Am', 'Am'] }
      ],
      tab: {
        name: 'The rolling pattern', tempo: 76, timeSig: [3, 4], tone: 'finger',
        bars: [
          '5-0:1, 3-2:1, 2-1:1',
          '5-3:1, 3-0:1, 2-1:1',
          '4-0:1, 3-2:1, 2-3:1',
          '4-3:1, 3-2:1, 2-1:1'
        ]
      }
    },

    {
      id: 'scarborough-fair',
      title: 'Scarborough Fair',
      origin: 'Traditional English ballad, descended from the medieval "Elfin Knight"',
      key: 'Dm', tempo: 92, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Folk', tags: ['dorian', 'fingerstyle', '3/4', 'modal'],
      about: 'A dorian tune, not a minor one -- listen for the B natural, which is what stops it ' +
             'sounding sad. Capo at the 7th fret and play it in Am shapes for the familiar sound.',
      chords: ['Dm', 'C', 'F', 'Gm', 'Am'],
      form: [
        { name: 'Verse', bars: ['Dm', 'Dm', 'C', 'Dm', 'F', 'C', 'Dm', 'Dm'] },
        { name: 'Refrain', bars: ['Dm', 'C', 'F', 'Dm', 'Gm', 'Dm', 'C', 'Dm'] }
      ]
    },

    {
      id: 'wayfaring-stranger',
      title: 'Wayfaring Stranger',
      origin: 'Traditional American spiritual, first printed in the 1850s',
      key: 'Am', tempo: 68, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Folk', tags: ['minor', 'spiritual', 'slow'],
      about: 'Three chords and enormous space. Almost every good version of this is built on ' +
             'dynamics rather than notes -- it wants to start very quietly.',
      chords: ['Am', 'C', 'Dm', 'E7', 'G'],
      form: [
        { name: 'Verse', bars: ['Am', 'Am', 'C', 'G', 'Am', 'Dm', 'Am', 'E7'] },
        { name: 'Chorus', bars: ['Am', 'C', 'G', 'Am', 'Dm', 'Am', 'E7', 'Am'] }
      ]
    },

    {
      id: 'constant-sorrow',
      title: 'Man of Constant Sorrow',
      origin: 'Dick Burnett, published 1913',
      key: 'G', tempo: 108, timeSig: [4, 4], capo: 2, tuning: 'standard',
      difficulty: 1, genre: 'Folk', tags: ['bluegrass', 'boom-chick', 'three chords'],
      about: 'The bluegrass standard. Three chords, and the whole character is in the rhythm ' +
             'guitar -- boom-chick with bass runs between every change.',
      chords: ['G', 'C', 'D'],
      form: [
        { name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'C', 'D', 'G'] }
      ]
    },

    {
      id: 'shady-grove',
      title: 'Shady Grove',
      origin: 'Traditional Appalachian, derived from the English ballad "Matty Groves"',
      key: 'Dm', tempo: 116, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Folk', tags: ['modal', 'dorian', 'old-time'],
      about: 'Usually played in D dorian or D mixolydian depending on who you learned it from. ' +
             'Two chords, endlessly, which makes it a good vehicle for modal improvisation.',
      chords: ['Dm', 'C'],
      form: [
        { name: 'Verse', bars: ['Dm', 'Dm', 'C', 'C', 'Dm', 'Dm', 'C', 'Dm'] }
      ],
      tab: {
        name: 'The tune', tempo: 116, tone: 'steel',
        bars: [
          '4-0:0.5 3-2:0.5, 2-3:1, 2-1:0.5 3-2:0.5, 4-0:1',
          '4-0:0.5 3-0:0.5, 3-2:1, 2-1:1, 2-3:1'
        ]
      }
    },

    {
      id: 'wildwood-flower',
      title: 'Wildwood Flower',
      origin: 'Maud Irving and J. P. Webster, 1860',
      key: 'C', tempo: 100, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Folk', tags: ['carter scratch', 'melody', 'old-time'],
      about: 'The Carter Family recording made this the template for melody-and-rhythm guitar: ' +
             'thumb plays the tune on the bass strings while the fingers brush the chord on the ' +
             'off-beats. If you learn one old-time guitar piece, learn this one.',
      chords: ['C', 'G7', 'F'],
      form: [
        { name: 'Verse', bars: ['C', 'C', 'C', 'G7', 'C', 'C', 'G7', 'C'] }
      ],
      tab: {
        name: 'Opening phrase, Carter style', tempo: 100, tone: 'steel',
        bars: [
          '5-3:0.5 5-3:0.5, 4-2:0.5 4-0:0.5, 4-2:1, 5-3:1',
          '4-0:0.5 3-0:0.5, 3-2:1, 3-0:0.5 4-2:0.5, 5-3:1'
        ]
      }
    },

    {
      id: 'oh-susanna',
      title: 'Oh! Susanna',
      origin: 'Stephen Foster, 1848',
      key: 'G', tempo: 132, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Folk', tags: ['three chords', 'fast', 'melody'],
      about: 'Foster at his most direct. Useful as a first flatpicking melody because the tune ' +
             'sits almost entirely inside the open G major scale.',
      chords: ['G', 'C', 'D7'],
      form: [
        { name: 'Verse', bars: ['G', 'G', 'D7', 'G', 'G', 'G', 'D7', 'G'] },
        { name: 'Chorus', bars: ['C', 'C', 'G', 'G', 'G', 'D7', 'G', 'G'] }
      ],
      tab: {
        name: 'The tune', tempo: 132, tone: 'steel',
        bars: [
          '4-0:0.5 4-2:0.5, 3-0:1, 3-2:0.5 3-0:0.5, 4-2:1',
          '4-0:0.5 4-2:0.5, 3-0:1, 3-2:1, 3-0:1'
        ]
      }
    },

    {
      id: 'red-river-valley',
      title: 'Red River Valley',
      origin: 'Traditional North American, in print by the 1890s',
      key: 'G', tempo: 96, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Folk', tags: ['three chords', 'waltz-feel', 'cowboy'],
      about: 'Three chords and a melody that almost sings itself. A good first attempt at ' +
             'chord-melody arranging, because the tune sits on the top two strings throughout.',
      chords: ['G', 'C', 'D7'],
      form: [
        { name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'D7', 'G'] },
        { name: 'Chorus', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }
      ]
    },

    {
      id: 'water-is-wide',
      title: 'The Water Is Wide',
      origin: 'Traditional Scottish, from the ballad "Waly, Waly"',
      key: 'D', tempo: 72, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Folk', tags: ['ballad', 'fingerstyle', 'slow'],
      about: 'One of the most reharmonised melodies in the folk repertoire, because the tune moves ' +
             'slowly enough to support almost any chord you can justify. A good place to practise ' +
             'the reharmonisation lesson.',
      chords: ['D', 'G', 'A', 'Bm', 'F#m', 'Em'],
      form: [
        { name: 'Verse', bars: ['D', 'G', 'D', 'Bm', 'G', 'A', 'D', 'D'] },
        { name: 'Second half', bars: ['D', 'F#m', 'G', 'D', 'Em', 'A', 'D', 'D'] }
      ]
    },

    {
      id: 'shenandoah',
      title: 'Shenandoah',
      origin: 'Traditional American river-boatmen song, printed by 1876',
      key: 'D', tempo: 64, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Folk', tags: ['ballad', 'slow', 'chord melody'],
      about: 'A wide, unhurried melody with long held notes -- which makes it ideal for chord melody, ' +
             'because there is room to move the harmony underneath a sustaining top note.',
      chords: ['D', 'G', 'A', 'Bm', 'Em', 'A7'],
      form: [
        { name: 'Verse', bars: ['D', 'D', 'G', 'D', 'Bm', 'A', 'D', 'D'] },
        { name: 'Refrain', bars: ['D', 'G', 'D', 'Em', 'A7', 'D', 'A', 'D'] }
      ]
    },

    {
      id: 'down-in-the-valley',
      title: 'Down in the Valley',
      origin: 'Traditional American, collected in the early 1900s',
      key: 'G', tempo: 100, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Folk', tags: ['waltz', 'two chords', 'easy'],
      about: 'Two chords in 3/4. Trivially simple to play and a genuinely good waltz-time exercise, ' +
             'because there is nothing to hide behind if the rhythm sags.',
      chords: ['G', 'D7'],
      form: [
        { name: 'Verse', bars: ['G', 'G', 'D7', 'D7', 'D7', 'D7', 'G', 'G'] }
      ]
    },

    {
      id: 'danny-boy',
      title: 'Danny Boy (Londonderry Air)',
      origin: 'Air traditional Irish, collected 1855; words by Frederic Weatherly, 1913',
      key: 'C', tempo: 68, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Folk', tags: ['ballad', 'chord melody', 'wide range'],
      about: 'The melody spans an octave and a half, which is why singers dread it and why it works ' +
             'so well on guitar -- that range gives a chord-melody arrangement somewhere to go.',
      chords: ['C', 'F', 'G', 'Am', 'Em', 'Dm', 'G7'],
      form: [
        { name: 'Verse', bars: ['C', 'F', 'C', 'C', 'F', 'C', 'G', 'G'] },
        { name: 'Bridge', bars: ['C', 'Am', 'F', 'C', 'Dm', 'G7', 'C', 'C'] }
      ]
    }
  ];
}(window.GL = window.GL || {}));
