/* songs-celtic.js -- Irish, Scottish and English traditional. All public domain.
   Several of these are given in DADGAD, which is where the modern Celtic guitar
   repertoire actually lives. See songs-folk.js for the schema. */
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  GL.songs.celtic = [
    {
      id: 'star-county-down',
      title: 'The Star of the County Down',
      origin: 'Traditional Irish; the air is "Gilderoy", printed in the 1700s',
      key: 'Em', tempo: 108, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Celtic', tags: ['dorian', 'session', 'modal'],
      about: 'E dorian, not E minor -- the C# is what gives it the lift. A session standard, and one ' +
             'of the best tunes for hearing what dorian actually does.',
      chords: ['Em', 'D', 'G', 'Bm', 'C'],
      form: [
        { name: 'Verse', bars: ['Em', 'Em', 'D', 'D', 'Em', 'G', 'Em', 'Em'] },
        { name: 'Chorus', bars: ['G', 'D', 'Em', 'Em', 'G', 'D', 'Em', 'Em'] }
      ]
    },
    {
      id: 'wild-mountain-thyme',
      title: 'Wild Mountain Thyme',
      origin: 'Traditional Scottish, from Robert Tannahill\'s "The Braes of Balquhither", c.1810',
      key: 'D', tempo: 84, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 1, genre: 'Celtic', tags: ['ballad', 'singalong', 'easy'],
      about: 'Three chords, slow, and built for singing in a room full of people. Try it in DADGAD ' +
             'with everything ringing.',
      chords: ['D', 'G', 'A', 'Bm'],
      form: [
        { name: 'Verse', bars: ['D', 'D', 'G', 'D', 'D', 'Bm', 'A', 'D'] },
        { name: 'Chorus', bars: ['D', 'G', 'D', 'Bm', 'G', 'A', 'D', 'D'] }
      ]
    },
    {
      id: 'parting-glass',
      title: 'The Parting Glass',
      origin: 'Traditional Scottish and Irish; printed by 1770',
      key: 'Am', tempo: 76, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Celtic', tags: ['ballad', 'minor', 'closing song'],
      about: 'The song you end the night with. Simple harmony, and it survives being sung ' +
             'unaccompanied -- which is a good test of whether your arrangement is adding anything.',
      chords: ['Am', 'C', 'G', 'F', 'Em'],
      form: [
        { name: 'Verse', bars: ['Am', 'C', 'G', 'Am', 'Am', 'F', 'G', 'Am'] },
        { name: 'Refrain', bars: ['C', 'G', 'Am', 'Em', 'F', 'G', 'Am', 'Am'] }
      ]
    },
    {
      id: 'si-bheag',
      title: 'Sí Bheag, Sí Mhór',
      origin: "Turlough O'Carolan, c.1691 -- reputedly his first composition",
      key: 'D', tempo: 96, timeSig: [3, 4], capo: 0, tuning: 'standard',
      difficulty: 3, genre: 'Celtic', tags: ['harp tune', 'fingerstyle', '3/4', 'melody'],
      about: 'An O\'Carolan harp tune, and the single most-played Celtic piece on guitar. The melody ' +
             'is entirely diatonic and mostly stepwise, which makes it an ideal first chord-melody ' +
             'arrangement.',
      chords: ['D', 'G', 'A', 'Bm', 'Em', 'A7'],
      form: [
        { name: 'A part', bars: ['D', 'D', 'G', 'D', 'D', 'A', 'D', 'D'] },
        { name: 'B part', bars: ['D', 'Bm', 'G', 'D', 'Em', 'A7', 'D', 'D'] }
      ]
    },
    {
      id: 'salley-gardens',
      title: 'Down by the Salley Gardens',
      origin: 'Air traditional Irish ("The Maids of Mourne Shore"); words by W. B. Yeats, 1889',
      key: 'G', tempo: 80, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 2, genre: 'Celtic', tags: ['air', 'slow', 'fingerstyle'],
      about: 'A slow air. Play it far slower than feels comfortable and let each note finish -- these ' +
             'tunes are ruined by being played in time rather than in phrases.',
      chords: ['G', 'C', 'D', 'Em', 'Am'],
      form: [
        { name: 'Verse', bars: ['G', 'C', 'G', 'Em', 'C', 'D', 'G', 'G'] },
        { name: 'Second half', bars: ['G', 'Am', 'C', 'G', 'Em', 'D', 'G', 'G'] }
      ]
    },
    {
      id: 'she-moved-through-fair',
      title: 'She Moved Through the Fair',
      origin: 'Traditional Irish; the air is thought to be medieval',
      key: 'Dm', tempo: 72, timeSig: [4, 4], capo: 0, tuning: 'dadgad',
      difficulty: 3, genre: 'Celtic', tags: ['dadgad', 'mixolydian', 'drone', 'modal'],
      about: 'Mixolydian, and one of the oldest melodies in the repertoire. Written here for DADGAD, ' +
             'where the open drones do most of the work and the tune sits on the top two strings.',
      chords: ['Dsus4', 'D', 'G', 'Am'],
      form: [
        { name: 'Verse', bars: ['Dsus4', 'Dsus4', 'G', 'Dsus4', 'Am', 'G', 'Dsus4', 'Dsus4'] }
      ]
    },
    {
      id: 'cooleys',
      title: "Cooley's Reel",
      origin: 'Traditional Irish reel, named for Joe Cooley (1924-1973); the tune is older',
      key: 'Em', tempo: 112, timeSig: [4, 4], capo: 0, tuning: 'standard',
      difficulty: 4, genre: 'Celtic', tags: ['reel', 'session', 'fast', 'flatpicking'],
      about: 'One of the first reels anyone learns at a session. Written at a practice tempo here; ' +
             'in a session it will be nearer 220 and nobody will wait for you.',
      chords: ['Em', 'D', 'G', 'Bm'],
      form: [
        { name: 'A part', bars: ['Em', 'Em', 'D', 'D', 'Em', 'Em', 'D', 'Em'] },
        { name: 'B part', bars: ['G', 'D', 'Em', 'D', 'G', 'D', 'Em', 'Em'] }
      ]
    },
    {
      id: 'butterfly',
      title: 'The Butterfly',
      origin: 'Traditional Irish slip jig',
      key: 'Em', tempo: 132, timeSig: [9, 4], capo: 0, tuning: 'standard',
      difficulty: 4, genre: 'Celtic', tags: ['slip jig', '9/8', 'modal', 'odd meter'],
      about: 'A slip jig, which is 9/8 -- three groups of three. Counted here as nine beats a bar so ' +
             'the metronome lines up. Feel it as three big beats, not nine small ones.',
      chords: ['Em', 'D', 'G', 'Bm'],
      form: [
        { name: 'A part', bars: ['Em', 'D', 'Em', 'Bm', 'Em', 'D', 'G', 'Em'] },
        { name: 'B part', bars: ['G', 'D', 'Em', 'Bm', 'G', 'D', 'Em', 'Em'] }
      ]
    }
  ];
}(window.GL = window.GL || {}));
