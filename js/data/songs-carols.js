/* songs-carols.js -- carols and seasonal traditional songs. All public domain.
   See songs-folk.js for the schema. */
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  GL.songs.carols = [
    {
      id: 'silent-night',
      title: 'Silent Night',
      origin: 'Franz Gruber and Joseph Mohr, 1818',
      key: 'C', tempo: 68, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Carols', tags: ['3/4', 'easy', 'chord melody'],
      about: 'Written for guitar in the first place -- the church organ at Oberndorf was broken. ' +
             'Three chords, in 3/4, and it works beautifully as a simple chord-melody arrangement.',
      chords: ['C', 'G7', 'F'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'G7', 'C', 'F', 'C', 'F', 'C', 'G7', 'C', 'C', 'C'] }]
    },
    {
      id: 'god-rest-ye',
      title: 'God Rest Ye Merry, Gentlemen',
      origin: 'Traditional English, printed 1760',
      key: 'Em', tempo: 104, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Carols', tags: ['minor', 'driving', 'modal'],
      about: 'One of very few carols in a minor key, and the one that sounds best with a hard, ' +
             'driving strum. The major chord at the end of each phrase is a Picardy third.',
      chords: ['Em', 'Am', 'B7', 'D', 'G', 'C'],
      form: [
        { name: 'Verse', bars: ['Em', 'Am', 'Em', 'B7', 'Em', 'Am', 'Em', 'B7'] },
        { name: 'Refrain', bars: ['G', 'D', 'Em', 'B7', 'Em', 'Am', 'B7', 'Em'] }
      ]
    },
    {
      id: 'what-child',
      title: 'What Child Is This',
      origin: 'Words William Chatterton Dix, 1865; tune "Greensleeves", 1580',
      key: 'Em', tempo: 92, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Carols', tags: ['greensleeves', '3/4', 'minor'],
      about: 'Greensleeves with different words. Worth learning alongside the original to hear how ' +
             'much a lyric changes the character of a melody.',
      chords: ['Em', 'D', 'G', 'B7', 'C', 'Am'],
      form: [
        { name: 'Verse', bars: ['Em', 'D', 'Em', 'B7', 'Em', 'D', 'Em', 'B7'] },
        { name: 'Refrain', bars: ['G', 'D', 'Em', 'B7', 'G', 'D', 'Em', 'B7'] }
      ]
    },
    {
      id: 'o-come-emmanuel',
      title: 'O Come, O Come, Emmanuel',
      origin: 'Fifteenth-century French processional; translated by J. M. Neale, 1851',
      key: 'Em', tempo: 76, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Carols', tags: ['modal', 'aeolian', 'ancient', 'slow'],
      about: 'Plainchant in origin, which is why it has no real sense of a key -- it is pure aeolian ' +
             'and it resists being harmonised in a conventional way. Try it with drones rather than ' +
             'chords.',
      chords: ['Em', 'D', 'G', 'Am', 'B7', 'C'],
      form: [
        { name: 'Verse', bars: ['Em', 'G', 'Em', 'D', 'Em', 'Am', 'B7', 'Em'] },
        { name: 'Refrain', bars: ['G', 'D', 'Em', 'C', 'Am', 'B7', 'Em', 'Em'] }
      ]
    },
    {
      id: 'coventry-carol',
      title: 'The Coventry Carol',
      origin: 'English, from the Coventry mystery plays; text 1534, melody 1591',
      key: 'Am', tempo: 84, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Carols', tags: ['minor', 'renaissance', 'picardy third', '3/4'],
      about: 'A lullaby for children about to be killed, which is why it is the bleakest thing in the ' +
             'carol repertoire. The final chord is major -- a Picardy third that resolves nothing.',
      chords: ['Am', 'E7', 'G', 'C', 'Dm', 'A'],
      form: [{ name: 'Verse', bars: ['Am', 'E7', 'Am', 'Am', 'C', 'G', 'Dm', 'A'] }]
    },
    {
      id: 'hark-herald',
      title: 'Hark! The Herald Angels Sing',
      origin: 'Mendelssohn, 1840; words Charles Wesley, 1739',
      key: 'G', tempo: 108, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Carols', tags: ['major', 'bright', 'strumming'],
      about: 'Mendelssohn wrote the tune for a completely different purpose and said it would never ' +
             'suit sacred words. He was outvoted.',
      chords: ['G', 'C', 'D7', 'Em', 'Am', 'B7'],
      form: [
        { name: 'Verse', bars: ['G', 'D7', 'G', 'G', 'C', 'G', 'D7', 'G'] },
        { name: 'Refrain', bars: ['C', 'G', 'Am', 'D7', 'G', 'C', 'D7', 'G'] }
      ]
    },
    {
      id: 'bleak-midwinter',
      title: 'In the Bleak Midwinter',
      origin: 'Gustav Holst, 1906; words Christina Rossetti, 1872',
      key: 'F', tempo: 72, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Carols', tags: ['slow', 'chord melody', 'harmony'],
      about: 'Richer harmony than most carols, with several chords that sit outside the key. Worth ' +
             'the effort of learning in F rather than transposing -- the voicings are part of it.',
      chords: ['F', 'C', 'Dm', 'Bb', 'Gm', 'C7', 'A7'],
      form: [
        { name: 'Verse', bars: ['F', 'Dm', 'Bb', 'F', 'Gm', 'C7', 'F', 'F'] },
        { name: 'Second half', bars: ['F', 'A7', 'Dm', 'Bb', 'F', 'C7', 'F', 'F'] }
      ]
    },
    {
      id: 'auld-lang-syne',
      title: 'Auld Lang Syne',
      origin: 'Robert Burns, 1788, set to a traditional Scottish tune',
      key: 'G', tempo: 88, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Carols', tags: ['pentatonic', 'easy', 'singalong'],
      about: 'The melody is pure major pentatonic, which is why everyone can sing it after several ' +
             'drinks. Three chords and a rising fourth to start it off.',
      chords: ['G', 'C', 'D', 'Em'],
      form: [
        { name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'C', 'D', 'G'] },
        { name: 'Refrain', bars: ['G', 'Em', 'C', 'G', 'G', 'C', 'D', 'G'] }
      ]
    }
  ];
}(window.GL = window.GL || {}));
