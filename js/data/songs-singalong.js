/* songs-singalong.js -- songs to sing with other people, with the words.

   EVERY SONG IN THIS FILE CARRIES A `published` YEAR OF 1930 OR EARLIER.

   That is not decoration. US copyright runs 95 years, so 1930 is the line in
   2026 and it is the only reason the lyrics can be printed here at all. The
   verification pass asserts it over the data. If you add a song, add its
   publication year, and if you cannot establish one, do not add it.

   Be careful with "traditional" as a label -- published campfire song lists
   routinely file You Are My Sunshine (1939), Kookaburra (1934) and Edelweiss
   (1959) under Traditional, and all three are firmly in copyright.

   Lyrics use ChordPro brackets: the chord sounds on the syllable right after
   it. See js/render/lyrics.js.
*/
(function (GL) {
  'use strict';
  GL.songs = GL.songs || {};

  function S(o) {
    o.genre = 'Sing-along';
    o.tuning = o.tuning || 'standard';
    o.timeSig = o.timeSig || [4, 4];
    o.capo = o.capo || 0;
    return o;
  }

  GL.songs.singalong = [

    /* ---------------------------------------------------- sea shanties --- */

    S({
      id: 'drunken-sailor', title: 'Drunken Sailor',
      origin: 'Traditional sea shanty', published: 1824,
      key: 'Dm', tempo: 116, difficulty: 1, tags: ['shanty', 'two chords', 'dorian'],
      about: 'Two chords and a shout-along chorus. A capstan shanty, meant to be sung while walking in a circle pushing a bar.',
      chords: ['Dm', 'C'],
      form: [{ name: 'Verse', bars: ['Dm', 'Dm', 'C', 'C', 'Dm', 'Dm', 'C', 'Dm'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'What shall we [Dm]do with a drunken sailor,',
          'What shall we [C]do with a drunken sailor,',
          'What shall we [Dm]do with a drunken sailor,',
          'Ear-[C]ly in the [Dm]morning?'
        ] },
        { section: 'Chorus', lines: [
          '[Dm]Way hay and up she rises,',
          '[C]Way hay and up she rises,',
          '[Dm]Way hay and up she rises,',
          'Ear-[C]ly in the [Dm]morning!'
        ] },
        { section: 'More verses', lines: [
          'Put him in the long boat till he\'s sober,',
          'Pull out the plug and wet him all over,',
          'Shave his belly with a rusty razor,',
          'That\'s what we do with a drunken sailor.'
        ] }
      ]
    }),

    S({
      id: 'wellerman', title: 'Soon May the Wellerman Come',
      origin: 'Traditional New Zealand whaling song', published: 1860,
      key: 'Am', tempo: 108, difficulty: 2, tags: ['shanty', 'minor', 'story song'],
      about: 'A whaling song from the Weller brothers\' supply ships. Not technically a shanty -- it was sung for pleasure, not for work.',
      chords: ['Am', 'C', 'G', 'E7', 'F'],
      form: [{ name: 'Verse', bars: ['Am', 'Am', 'C', 'C', 'Am', 'Am', 'E7', 'Am'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'There once was a [Am]ship that put to sea,',
          'And the name of that ship was the [C]Billy o\' Tea.',
          'The winds blew hard, her [Am]bow dipped down,',
          'Blow, me bully boys, [E7]blow. [Am]'
        ] },
        { section: 'Chorus', lines: [
          'Soon may the [Am]Wellerman come',
          'To bring us sugar and [C]tea and rum.',
          'One day, when the [Am]tonguin\' is done,',
          'We\'ll take our leave and [E7]go. [Am]'
        ] },
        { section: 'Verse 2', lines: [
          'She had not been two [Am]weeks from shore',
          'When down on her a right whale [C]bore.',
          'The captain called all [Am]hands and swore',
          'He\'d take that whale in [E7]tow. [Am]'
        ] }
      ]
    }),

    S({
      id: 'blow-man-down', title: 'Blow the Man Down',
      origin: 'Traditional halyard shanty', published: 1879,
      key: 'G', tempo: 100, timeSig: [6, 4], difficulty: 1, tags: ['shanty', '6/8', 'three chords'],
      about: 'A halyard shanty in a rolling 6/8, sung while hauling on a rope. The pull came on "blow".',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'Come [G]all ye young fellows that follow the sea,',
          'To me [D7]way, hey, blow the man [G]down,',
          'And [G]pray pay attention and [C]listen to me,',
          'Give me [G]some time to [D7]blow the man [G]down.'
        ] },
        { section: 'Chorus', lines: [
          '[G]Blow the man down, bullies, blow the man down,',
          'To me [D7]way, hey, blow the man [G]down,',
          '[G]Blow the man down, bullies, [C]blow him right down,',
          'Give me [G]some time to [D7]blow the man [G]down.'
        ] }
      ]
    }),

    S({
      id: 'south-australia', title: 'South Australia',
      origin: 'Traditional wool-trade shanty', published: 1881,
      key: 'G', tempo: 120, difficulty: 1, tags: ['shanty', 'three chords', 'fast'],
      about: 'A capstan shanty from the Australian wool trade. Fast, loud, and impossible to sing quietly.',
      chords: ['G', 'C', 'D'],
      form: [{ name: 'Verse', bars: ['G', 'C', 'G', 'D', 'G', 'C', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'In [G]South Australia I was [C]born,',
          '[G]Heave away, [D]haul away,',
          'In [G]South Australia round Cape [C]Horn,',
          'We\'re [G]bound for South Aus-[D]tra-[G]lia.'
        ] },
        { section: 'Chorus', lines: [
          '[G]Haul away, you rollin\' [C]king,',
          '[G]Heave away, [D]haul away,',
          '[G]Haul away, you\'ll hear me [C]sing,',
          'We\'re [G]bound for South Aus-[D]tra-[G]lia.'
        ] }
      ]
    }),

    /* -------------------------------------------- Irish and Scottish --- */

    S({
      id: 'wild-rover', title: 'The Wild Rover',
      origin: 'Traditional, sung across Ireland, Scotland and England', published: 1810,
      key: 'G', tempo: 116, difficulty: 1, tags: ['pub song', 'three chords', 'clapping'],
      about: 'The pub singalong. Everyone claps four times in the gap after "no, nay, never" -- that is the entire point of the song.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'C', 'G', 'D7', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'I\'ve been a wild [G]rover for many a [C]year,',
          'And I [G]spent all me [C]money on whiskey and [D7]beer.',
          'But [G]now I\'m returning with [C]gold in great [D7]store,',
          'And I [G]never will [C]play the wild [D7]rover no [G]more.'
        ] },
        { section: 'Chorus', lines: [
          'And it\'s [G]no, nay, never,   [C](clap clap clap clap)',
          '[G]No, nay, never no [D7]more,',
          'Will I [G]play the wild [C]rover,',
          'No [D7]never, no [G]more.'
        ] },
        { section: 'Verse 2', lines: [
          'I went to an [G]alehouse I used to fre-[C]quent,',
          'And I [G]told the land-[C]lady me money was [D7]spent.',
          'I [G]asked her for credit, she [C]answered me [D7]"nay,',
          'Such a [G]custom as [C]yours I could [D7]have any [G]day."'
        ] }
      ]
    }),

    S({
      id: 'whiskey-in-jar', title: 'Whiskey in the Jar',
      origin: 'Traditional Irish highwayman ballad', published: 1850,
      key: 'G', tempo: 112, difficulty: 2, tags: ['pub song', 'story song', 'four chords'],
      about: 'A highwayman robs an officer and is betrayed by his lover. The chorus is nonsense syllables, which is why nobody ever forgets it.',
      chords: ['G', 'Em', 'C', 'D'],
      form: [{ name: 'Verse', bars: ['G', 'Em', 'C', 'G', 'G', 'Em', 'D', 'G'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'As I was a-goin\' over the [G]far famed Kerry moun-[Em]tains,',
          'I [C]met with Captain Farrell and his [G]money he was countin\'.',
          'I [G]first produced me pistol and I [Em]then produced me rapier,',
          'Sayin\' [C]stand and deliver, for you [G]are a bold decei-[D]ver.'
        ] },
        { section: 'Chorus', lines: [
          '[G]Musha ring dum a doo dum a [Em]da,',
          '[C]Whack for my daddy-[G]o,',
          '[C]Whack for my daddy-[G]o,',
          'There\'s [D]whiskey in the [G]jar.'
        ] },
        { section: 'Verse 2', lines: [
          'I counted out his [G]money and it made a pretty [Em]penny,',
          'I [C]put it in me pocket and I [G]took it home to Jenny.',
          'She [G]sighed and she swore that she [Em]never would deceive me,',
          'But the [C]devil take the women, for they [G]never can be [D]easy.'
        ] }
      ]
    }),

    S({
      id: 'molly-malone', title: 'Molly Malone',
      origin: 'Traditional Dublin song by James Yorkston', published: 1884,
      key: 'C', tempo: 96, timeSig: [3, 4], difficulty: 2, tags: ['pub song', 'waltz', 'Dublin'],
      about: 'The unofficial anthem of Dublin, in waltz time. She sells shellfish, catches a fever, and haunts the streets -- all in three verses.',
      chords: ['C', 'Am', 'Dm', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'Am', 'Dm', 'G7', 'C', 'Am', 'Dm', 'G7'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'In [C]Dublin\'s fair [Am]city, where [Dm]girls are so [G7]pretty,',
          'I [C]first set my [Am]eyes on sweet [Dm]Molly Ma-[G7]lone.',
          'As she [C]wheeled her wheel-[Am]barrow through [Dm]streets broad and [G7]narrow,',
          'Crying [C]cockles and [G7]mussels, alive, alive-[C]o.'
        ] },
        { section: 'Chorus', lines: [
          'A-[C]live, alive-[Am]o, a-[Dm]live, alive-[G7]o,',
          'Crying [C]cockles and [G7]mussels, alive, alive-[C]o.'
        ] },
        { section: 'Verse 2', lines: [
          'She [C]was a fish-[Am]monger, and [Dm]sure \'twas no [G7]wonder,',
          'For [C]so were her [Am]father and [Dm]mother be-[G7]fore.',
          'And they [C]each wheeled their [Am]barrow through [Dm]streets broad and [G7]narrow,',
          'Crying [C]cockles and [G7]mussels, alive, alive-[C]o.'
        ] }
      ]
    }),

    S({
      id: 'ill-tell-me-ma', title: 'I\'ll Tell Me Ma',
      origin: 'Traditional Irish and English children\'s street song', published: 1900,
      key: 'G', tempo: 132, difficulty: 1, tags: ['pub song', 'fast', 'three chords'],
      about: 'A skipping-rope rhyme that grew into a pub song. Fast, cheerful and over before you can get tired of it.',
      chords: ['G', 'C', 'D'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'D', 'G', 'G', 'C', 'D', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'I\'ll tell me [G]ma when I go home,',
          'The boys won\'t leave the [D]girls alone.',
          'They pulled my hair, they [G]stole my comb,',
          'But that\'s all [D]right till I go [G]home.'
        ] },
        { section: 'Chorus', lines: [
          'She is [G]handsome, she is pretty,',
          'She is the belle of [D]Belfast city.',
          'She is courtin\', [G]one, two, three,',
          'Please won\'t you [D]tell me who is [G]she?'
        ] }
      ]
    }),

    S({
      id: 'loch-lomond', title: 'The Bonnie Banks o\' Loch Lomond',
      origin: 'Traditional Scottish', published: 1841,
      key: 'G', tempo: 100, difficulty: 2, tags: ['scottish', 'ballad', 'pentatonic'],
      about: 'Two soldiers, one going home by the high road and one -- who will not be coming home -- by the low road.',
      chords: ['G', 'C', 'D', 'Em'],
      form: [{ name: 'Verse', bars: ['G', 'C', 'G', 'D', 'G', 'C', 'D', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'By yon [G]bonnie banks and by [C]yon bonnie [G]braes,',
          'Where the [G]sun shines bright on Loch [D]Lomond,',
          'Where [G]me and my true love were [C]ever wont to [G]gae,',
          'On the [G]bonnie, bonnie banks o\' Loch [D]Lo-[G]mond.'
        ] },
        { section: 'Chorus', lines: [
          'Oh, ye\'ll [G]take the high road and [C]I\'ll take the [G]low road,',
          'And [G]I\'ll be in Scotland a-[D]fore ye,',
          'But [G]me and my true love will [C]never meet a-[G]gain,',
          'On the [G]bonnie, bonnie banks o\' Loch [D]Lo-[G]mond.'
        ] }
      ]
    }),

    /* --------------------------------------------- campfire and scout --- */

    S({
      id: 'coming-round-mountain', title: 'She\'ll Be Coming Round the Mountain',
      origin: 'Traditional American, from the spiritual "When the Chariot Comes"', published: 1899,
      key: 'G', tempo: 120, difficulty: 1, tags: ['campfire', 'three chords', 'easy'],
      about: 'The first campfire song most people learn. Add a shouted action after each line and it will run for twenty minutes.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'G', 'G', 'C', 'G', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'She\'ll be [G]coming round the mountain when she comes,',
          'She\'ll be coming round the mountain when she [D7]comes,',
          'She\'ll be [G]coming round the [G7]mountain, she\'ll be [C]coming round the mountain,',
          'She\'ll be [G]coming round the [D7]mountain when she [G]comes.'
        ] },
        { section: 'More verses', lines: [
          'She\'ll be driving six white horses when she comes,',
          'Oh, we\'ll all go out to meet her when she comes,',
          'She\'ll be wearing red pyjamas when she comes,',
          'And we\'ll all have chicken and dumplings when she comes.'
        ] }
      ],
      extraChords: ['G7']
    }),

    S({
      id: 'my-bonnie', title: 'My Bonnie Lies Over the Ocean',
      origin: 'Traditional Scottish', published: 1881,
      key: 'G', tempo: 108, timeSig: [3, 4], difficulty: 1, tags: ['campfire', 'waltz', 'three chords'],
      about: 'A waltz, and a game: everyone stands up or sits down on every word starting with B.',
      chords: ['G', 'C', 'D7', 'Em'],
      form: [{ name: 'Verse', bars: ['G', 'C', 'G', 'D7', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'My [G]Bonnie lies [C]over the [G]ocean,',
          'My [Em]Bonnie lies [C]over the [D7]sea,',
          'My [G]Bonnie lies [C]over the [G]ocean,',
          'Oh [C]bring back my [D7]Bonnie to [G]me.'
        ] },
        { section: 'Chorus', lines: [
          '[C]Bring back, [G]bring back,',
          'Oh [A7]bring back my Bonnie to [D7]me, to me.',
          '[C]Bring back, [G]bring back,',
          'Oh [C]bring back my [D7]Bonnie to [G]me.'
        ] }
      ],
      extraChords: ['A7']
    }),

    S({
      id: 'clementine', title: 'Oh My Darling Clementine',
      origin: 'Percy Montrose (attributed)', published: 1884,
      key: 'C', tempo: 112, timeSig: [3, 4], difficulty: 1, tags: ['campfire', 'waltz', 'two chords'],
      about: 'A gold-rush ballad about a girl who drowns because her boyfriend cannot swim. Sung cheerfully, always.',
      chords: ['C', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'G7', 'G7', 'G7', 'G7', 'C', 'C'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'In a [C]cavern, in a canyon, exca-[G7]vating for a mine,',
          'Dwelt a [G7]miner, forty-niner, and his [C]daughter Clementine.'
        ] },
        { section: 'Chorus', lines: [
          'Oh my [C]darling, oh my darling, oh my [G7]darling Clementine,',
          'You are [G7]lost and gone forever, dreadful [C]sorry, Clementine.'
        ] },
        { section: 'Verse 2', lines: [
          'Light she [C]was and like a fairy, and her [G7]shoes were number nine,',
          'Herring [G7]boxes without topses, sandals [C]were for Clementine.'
        ] }
      ]
    }),

    S({
      id: 'home-on-range', title: 'Home on the Range',
      origin: 'Brewster Higley and Daniel Kelley', published: 1873,
      key: 'G', tempo: 96, timeSig: [3, 4], difficulty: 2, tags: ['campfire', 'cowboy', 'waltz'],
      about: 'The state song of Kansas, and the most-sung cowboy song there is. Slow waltz, big open chords.',
      chords: ['G', 'C', 'D7', 'A7'],
      form: [{ name: 'Verse', bars: ['G', 'C', 'G', 'D7', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'Oh give me a [G]home where the [C]buffalo [G]roam,',
          'Where the deer and the [A7]antelope [D7]play,',
          'Where [G]seldom is [G7]heard a dis-[C]couraging word,',
          'And the [G]skies are not [D7]cloudy all [G]day.'
        ] },
        { section: 'Chorus', lines: [
          '[G]Home, home on the [C]range, [G]',
          'Where the deer and the [A7]antelope [D7]play,',
          'Where [G]seldom is [G7]heard a dis-[C]couraging word,',
          'And the [G]skies are not [D7]cloudy all [G]day.'
        ] }
      ],
      extraChords: ['G7']
    }),

    S({
      id: 'michael-row', title: 'Michael, Row the Boat Ashore',
      origin: 'African-American spiritual from the Sea Islands, Georgia', published: 1867,
      key: 'C', tempo: 96, difficulty: 1, tags: ['campfire', 'spiritual', 'three chords'],
      about: 'Collected from freed slaves on St. Helena Island in the 1860s. Two lines, endlessly repeatable, perfect for a group.',
      chords: ['C', 'F', 'Am', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'F', 'C', 'Am', 'C', 'F', 'G7', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          '[C]Michael, row the [F]boat a-[C]shore, halle-[Am]lu-[G7]jah,',
          '[C]Michael, row the [F]boat a-[C]shore, halle-[G7]lu-[C]jah.'
        ] },
        { section: 'More verses', lines: [
          'Sister, help to trim the sail, hallelujah,',
          'The river Jordan is chilly and cold, hallelujah,',
          'Chills the body but not the soul, hallelujah.'
        ] }
      ]
    }),

    S({
      id: 'kumbaya', title: 'Kumbaya',
      origin: 'African-American spiritual, Gullah origin', published: 1926,
      key: 'C', tempo: 76, difficulty: 1, tags: ['campfire', 'spiritual', 'slow', 'three chords'],
      about: 'The title is Gullah for "come by here". Slow, quiet, and traditionally the last song of the night.',
      chords: ['C', 'F', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'F', 'C', 'C', 'F', 'G7', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          '[C]Kumbaya my [F]Lord, kum-[C]baya,',
          '[C]Kumbaya my [F]Lord, kum-[G7]baya,',
          '[C]Kumbaya my [F]Lord, kum-[C]baya,',
          'Oh [F]Lord, kum-[C]ba-[G7]ya. [C]'
        ] },
        { section: 'More verses', lines: [
          'Someone\'s singing, Lord, kumbaya,',
          'Someone\'s laughing, Lord, kumbaya,',
          'Someone\'s crying, Lord, kumbaya,',
          'Someone\'s praying, Lord, kumbaya.'
        ] }
      ]
    }),

    /* -------------------------------------------- spirituals and gospel --- */

    S({
      id: 'swing-low', title: 'Swing Low, Sweet Chariot',
      origin: 'African-American spiritual, attributed to Wallace Willis', published: 1873,
      key: 'G', tempo: 84, difficulty: 1, tags: ['spiritual', 'three chords', 'slow'],
      about: 'One of the best-known spirituals in the world. Sing the chorus twice as loud as the verse.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Chorus', bars: ['G', 'C', 'G', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          '[G]Swing low, sweet [C]chari-[G]ot,',
          'Coming for to carry me [D7]home,',
          '[G]Swing low, sweet [C]chari-[G]ot,',
          'Coming for to [D7]carry me [G]home.'
        ] },
        { section: 'Verse', lines: [
          'I [G]looked over Jordan and [C]what did I [G]see,',
          'Coming for to carry me [D7]home,',
          'A [G]band of angels [C]coming after [G]me,',
          'Coming for to [D7]carry me [G]home.'
        ] }
      ]
    }),

    S({
      id: 'when-saints', title: 'When the Saints Go Marching In',
      origin: 'American gospel hymn, adopted by New Orleans jazz bands', published: 1896,
      key: 'G', tempo: 120, difficulty: 1, tags: ['gospel', 'jazz', 'three chords', 'easy'],
      about: 'A funeral hymn that became a party. The melody uses only four notes to start, which is why everyone can sing it.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'G', 'G', 'G', 'C', 'G', 'D7'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'Oh when the [G]saints go marching in,',
          'Oh when the saints go marching [D7]in,',
          'Oh [G]Lord, I want to [G7]be in that [C]number,',
          'When the [G]saints go [D7]marching [G]in.'
        ] },
        { section: 'More verses', lines: [
          'Oh when the sun refuse to shine,',
          'Oh when the new world is revealed,',
          'Oh when the trumpet sounds its call.'
        ] }
      ],
      extraChords: ['G7']
    }),

    S({
      id: 'down-by-riverside', title: 'Down by the Riverside',
      origin: 'African-American spiritual, sung since before the Civil War', published: 1918,
      key: 'G', tempo: 112, difficulty: 1, tags: ['spiritual', 'gospel', 'three chords'],
      about: 'A spiritual that became an anti-war song. The "study war no more" line is why.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'Gonna lay down my [G]sword and shield,',
          'Down by the [C]riverside, down by the [G]riverside,',
          'Down by the riverside,',
          'Gonna lay down my [G]sword and shield,',
          'Down by the [C]riverside,',
          'Gonna [G]study [D7]war no [G]more.'
        ] },
        { section: 'Chorus', lines: [
          'I ain\'t gonna [G]study war no more,',
          'Ain\'t gonna [C]study war no [G]more,',
          'Ain\'t gonna [D7]study war no [G]more.'
        ] }
      ]
    }),

    S({
      id: 'this-train', title: 'This Train Is Bound for Glory',
      origin: 'African-American gospel song', published: 1922,
      key: 'G', tempo: 128, difficulty: 1, tags: ['gospel', 'fast', 'three chords'],
      about: 'A driving gospel song. Take it fast, with a hard boom-chick, and it plays itself.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'This train is [G]bound for glory, this train,',
          'This train is bound for glory, this [D7]train,',
          'This train is [G]bound for glory,',
          'Don\'t carry nothing but the [C]righteous and the holy,',
          'This [G]train is [D7]bound for glory, this [G]train.'
        ] }
      ]
    }),

    S({
      id: 'circle-unbroken', title: 'Will the Circle Be Unbroken',
      origin: 'Ada Habershon and Charles Gabriel', published: 1907,
      key: 'G', tempo: 100, difficulty: 1, tags: ['gospel', 'bluegrass', 'three chords'],
      about: 'A gospel hymn that bluegrass adopted completely. Everyone joins in on the chorus whether they know the verses or not.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          'Will the [G]circle be un-[C]broken,',
          'By and [G]by, Lord, by and [D7]by?',
          'There\'s a [G]better home a-[C]waiting,',
          'In the [G]sky, Lord, [D7]in the [G]sky.'
        ] },
        { section: 'Verse', lines: [
          'I was [G]standing by my [C]window,',
          'On a [G]cold and cloudy [D7]day,',
          'When I [G]saw the hearse come [C]rolling,',
          'For to [G]carry my [D7]mother a-[G]way.'
        ] }
      ]
    }),

    S({
      id: 'go-tell-it', title: 'Go Tell It on the Mountain',
      origin: 'African-American spiritual, collected by John Wesley Work Jr.', published: 1907,
      key: 'G', tempo: 108, difficulty: 1, tags: ['spiritual', 'christmas', 'three chords'],
      about: 'A Christmas spiritual, though it works all year. Big, open and loud.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Chorus', bars: ['G', 'C', 'G', 'D7', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          '[G]Go tell it on the [C]moun-[G]tain,',
          'Over the hills and every-[D7]where,',
          '[G]Go tell it on the [C]moun-[G]tain,',
          'That [G]Jesus Christ is [D7]born. [G]'
        ] },
        { section: 'Verse', lines: [
          'While [G]shepherds kept their [C]watching,',
          'O\'er [G]silent flocks by [D7]night,',
          'Be-[G]hold, throughout the [C]heavens,',
          'There [G]shone a holy [D7]light. [G]'
        ] }
      ]
    }),

    S({
      id: 'amazing-grace-sing', title: 'Amazing Grace',
      origin: 'Words John Newton (1779), tune "New Britain" (1835)', published: 1835,
      key: 'G', tempo: 76, timeSig: [3, 4], difficulty: 1, tags: ['hymn', 'waltz', 'pentatonic', 'easy'],
      about: 'The most sung hymn in the English language. The melody is pure major pentatonic, which is why it never sounds wrong.',
      chords: ['G', 'C', 'D7', 'Em'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'Em', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse 1', lines: [
          'A-[G]mazing grace, how [C]sweet the [G]sound,',
          'That saved a wretch like [Em]me. [D7]',
          'I [G]once was lost, but [C]now am [G]found,',
          'Was [Em]blind but [D7]now I [G]see.'
        ] },
        { section: 'Verse 2', lines: [
          '\'Twas [G]grace that taught my [C]heart to [G]fear,',
          'And grace my fears re-[Em]lieved. [D7]',
          'How [G]precious did that [C]grace ap-[G]pear,',
          'The [Em]hour I [D7]first be-[G]lieved.'
        ] }
      ]
    }),

    /* ------------------------------------------------- old-time American --- */

    S({
      id: 'ball-game', title: 'Take Me Out to the Ball Game',
      origin: 'Jack Norworth and Albert Von Tilzer', published: 1908,
      key: 'C', tempo: 116, timeSig: [3, 4], difficulty: 2, tags: ['waltz', 'singalong', 'standard'],
      about: 'Neither writer had been to a baseball game when they wrote it. Everyone knows the chorus and nobody knows the verse.',
      chords: ['C', 'G7', 'F', 'D7', 'A7', 'Dm'],
      form: [{ name: 'Chorus', bars: ['C', 'C', 'D7', 'G7', 'C', 'C', 'G7', 'C'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          'Take me [C]out to the ball game,',
          'Take me [A7]out with the crowd.',
          '[D7]Buy me some peanuts and [G7]Cracker Jack,',
          'I [D7]don\'t care if I [G7]never get back.',
          'Let me [C]root, root, root for the [F]home team,',
          'If they [C]don\'t win it\'s a [A7]shame.',
          'For it\'s [C]one, [F]two, [C]three strikes you\'re out,',
          'At the [D7]old [G7]ball [C]game.'
        ] }
      ]
    }),

    S({
      id: 'big-rock-candy', title: 'Big Rock Candy Mountain',
      origin: 'Harry McClintock', published: 1928,
      key: 'G', tempo: 112, difficulty: 1, tags: ['hobo', 'country', 'three chords'],
      about: 'A hobo\'s paradise where the hens lay soft-boiled eggs. Originally much less child-friendly than the version people sing now.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'One evening as the [G]sun went down and the jungle fire was [C]burning,',
          'Down the [G]track came a hobo hiking and he [D7]said, "Boys, I\'m not [G]turning.',
          'I\'m headed for a [G]land that\'s far away beside the crystal [C]fountains,',
          'So [G]come with me, we\'ll [D7]go and see the Big Rock Candy [G]Mountains."'
        ] },
        { section: 'Chorus', lines: [
          'In the [G]Big Rock Candy Mountains there\'s a land that\'s fair and [C]bright,',
          'Where the [G]handouts grow on bushes and you [D7]sleep out every [G]night.',
          'Oh the [G]boxcars all are empty and the sun shines every [C]day,',
          'I\'m [G]bound to go where [D7]there ain\'t no snow, in the Big Rock Candy Moun-[G]tains.'
        ] }
      ]
    }),

    S({
      id: 'erie-canal', title: 'The Erie Canal (Low Bridge)',
      origin: 'Thomas S. Allen', published: 1905,
      key: 'Dm', tempo: 108, difficulty: 2, tags: ['work song', 'minor', 'story song'],
      about: 'Written when the canal mules were being replaced by engines. Minor verse, major chorus -- an easy trick and a very effective one.',
      chords: ['Dm', 'A7', 'F', 'C', 'Gm'],
      form: [{ name: 'Verse', bars: ['Dm', 'Dm', 'A7', 'Dm', 'Dm', 'Dm', 'A7', 'Dm'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'I\'ve got a [Dm]mule and her name is Sal,',
          '[A7]Fifteen miles on the Erie Ca-[Dm]nal.',
          'She\'s a good old worker and a good old pal,',
          '[A7]Fifteen miles on the Erie Ca-[Dm]nal.'
        ] },
        { section: 'Chorus', lines: [
          '[F]Low bridge, everybody down,',
          '[C]Low bridge, for we\'re coming to a [F]town.',
          'And you\'ll [F]always know your neighbour,',
          '[Dm]You\'ll always know your pal,',
          'If you\'ve [Gm]ever navigated on the [A7]Erie Ca-[Dm]nal.'
        ] }
      ]
    }),

    S({
      id: 'yellow-rose', title: 'The Yellow Rose of Texas',
      origin: 'Traditional American', published: 1858,
      key: 'G', tempo: 124, difficulty: 1, tags: ['campfire', 'marching', 'three chords'],
      about: 'A marching song from the Texas Revolution. Brisk, and it wants a boom-chick.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'D7', 'G', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'There\'s a [G]yellow rose in Texas that I am going to see,',
          'No other fellow knows her, no [D7]other, only me.',
          'She [G]cried so when I left her, it like to broke my [C]heart,',
          'And [G]if I ever find her we [D7]never more will [G]part.'
        ] },
        { section: 'Chorus', lines: [
          'She\'s the [G]sweetest rose of colour this fellow ever knew,',
          'Her eyes are bright as diamonds, they [D7]sparkle like the dew.',
          'You may [G]talk about your dearest maids and sing of Rosie [C]Lee,',
          'But the [G]yellow rose of [D7]Texas beats the belles of Ten-[G]nessee.'
        ] }
      ]
    }),

    S({
      id: 'sloop-john-b', title: 'The John B. Sails (Sloop John B)',
      origin: 'Traditional Bahamian folk song, collected by Richard Le Gallienne', published: 1916,
      key: 'G', tempo: 108, difficulty: 1, tags: ['campfire', 'three chords', 'easy'],
      about: 'A Nassau folk song about a disastrous trip. Three chords, and a chorus everyone joins whether invited or not.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'G', 'G', 'C', 'C', 'G', 'D7'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'We come on the [G]sloop John B,',
          'My grandfather and me,',
          'Around Nassau town we did [D7]roam.',
          'Drinking all [G]night, got into a [G7]fight,',
          'I [C]feel so break up, [G]I want to go [D7]home. [G]'
        ] },
        { section: 'Chorus', lines: [
          'So [G]hoist up the John B\'s sail,',
          'See how the mainsail sets,',
          'Send for the captain ashore, let me go [D7]home.',
          'I want to go [G]home, I want to go [G7]home,',
          'I [C]feel so break up, [G]I want to go [D7]home. [G]'
        ] }
      ],
      extraChords: ['G7']
    }),

    S({
      id: 'tom-dooley', title: 'Tom Dooley',
      origin: 'Traditional Appalachian murder ballad about Tom Dula', published: 1867,
      key: 'G', tempo: 108, difficulty: 1, tags: ['ballad', 'two chords', 'easy'],
      about: 'Two chords, a true story from 1866, and one of the simplest songs in the whole library.',
      chords: ['G', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'D7', 'D7', 'D7', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          'Hang down your [G]head, Tom Dooley,',
          'Hang down your head and [D7]cry,',
          'Hang down your head, Tom Dooley,',
          'Poor boy, you\'re bound to [G]die.'
        ] },
        { section: 'Verse', lines: [
          'I met her on the [G]mountain,',
          'There I took her [D7]life,',
          'Met her on the mountain,',
          'Stabbed her with my [G]knife.'
        ] }
      ]
    }),

    S({
      id: 'in-the-pines', title: 'In the Pines',
      origin: 'Traditional Appalachian, collected by Cecil Sharp', published: 1917,
      key: 'Am', tempo: 84, difficulty: 2, tags: ['ballad', 'minor', 'dark'],
      about: 'One of the bleakest songs in the tradition, and one of the most re-recorded. Sing it slowly.',
      chords: ['Am', 'C', 'G', 'Em', 'D'],
      form: [{ name: 'Verse', bars: ['Am', 'Am', 'C', 'G', 'Am', 'Em', 'Am', 'Am'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          'In the [Am]pines, in the [C]pines,',
          'Where the [G]sun never [Em]shines,',
          'And we [Am]shiver when the [Em]cold wind [Am]blows.'
        ] },
        { section: 'Verse', lines: [
          'My [Am]girl, my [C]girl, don\'t you [G]lie to [Em]me,',
          'Tell me [Am]where did you [Em]sleep last [Am]night?',
          'In the [Am]pines, in the [C]pines, where the [G]sun never [Em]shines,',
          'I would [Am]shiver the [Em]whole night [Am]through.'
        ] }
      ]
    }),

    S({
      id: 'banks-of-ohio', title: 'Banks of the Ohio',
      origin: 'Traditional American murder ballad', published: 1927,
      key: 'G', tempo: 100, difficulty: 1, tags: ['ballad', 'three chords', 'country'],
      about: 'A murder ballad sung in close harmony at every bluegrass jam. Cheerful tune, grim story.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'I asked my [G]love to take a walk,',
          'To take a walk, just a little [D7]walk,',
          'Down be-[G]side where the waters [C]flow,',
          'Down by the [G]banks of the [D7]Ohi-[G]o.'
        ] },
        { section: 'Chorus', lines: [
          'And only [G]say that you\'ll be mine,',
          'In no other arms entwine,',
          'Down be-[G]side where the waters [C]flow,',
          'Down by the [G]banks of the [D7]Ohi-[G]o.'
        ] }
      ]
    }),

    /* ------------------------------------ music hall and old singalongs --- */

    S({
      id: 'daisy-bell', title: 'Daisy Bell (Bicycle Built for Two)',
      origin: 'Harry Dacre', published: 1892,
      key: 'G', tempo: 108, timeSig: [3, 4], difficulty: 2, tags: ['music hall', 'waltz', 'singalong'],
      about: 'A music-hall waltz, and the first song ever sung by a computer -- an IBM 704 in 1961.',
      chords: ['G', 'C', 'D7', 'A7', 'E7', 'Am'],
      form: [{ name: 'Chorus', bars: ['G', 'G', 'D7', 'G', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          '[G]Daisy, Daisy, [D7]give me your answer [G]do,',
          'I\'m half [E7]crazy, [A7]all for the love of [D7]you.',
          'It [G]won\'t be a stylish [B7]marriage,',
          'I [E7]can\'t afford a [A7]carriage,',
          'But you\'ll look [G]sweet up-[C]on the [G]seat',
          'Of a [D7]bicycle built for [G]two.'
        ] }
      ],
      extraChords: ['B7']
    }),

    S({
      id: 'tipperary', title: 'It\'s a Long Way to Tipperary',
      origin: 'Jack Judge and Harry Williams', published: 1912,
      key: 'C', tempo: 116, difficulty: 2, tags: ['music hall', 'marching', 'singalong'],
      about: 'A music-hall song that the British Army adopted in 1914 and never gave back.',
      chords: ['C', 'F', 'G7', 'D7', 'A7', 'Dm'],
      form: [{ name: 'Chorus', bars: ['C', 'C', 'F', 'C', 'C', 'D7', 'G7', 'C'] }],
      lyrics: [
        { section: 'Chorus', lines: [
          'It\'s a [C]long way to Tippe-[F]rary,',
          'It\'s a [C]long way to [D7]go.',
          'It\'s a [G7]long way to Tippe-[C]rary,',
          'To the [F]sweetest girl I [G7]know.',
          'Good-[C]bye Picca-[E7]dilly,',
          'Fare-[Am]well Leicester [D7]Square.',
          'It\'s a [C]long, long way to [F]Tipperary,',
          'But my [C]heart\'s [G7]right [C]there.'
        ] }
      ],
      extraChords: ['E7', 'Am']
    }),

    S({
      id: 'show-me-way-home', title: 'Show Me the Way to Go Home',
      origin: 'Irving King (James Campbell and Reginald Connelly)', published: 1925,
      key: 'C', tempo: 100, difficulty: 1, tags: ['music hall', 'singalong', 'closing song'],
      about: 'The song everyone sings at closing time, in every pub, everywhere. Short enough to sing four times.',
      chords: ['C', 'F', 'G7', 'C7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'F', 'C', 'C', 'G7', 'C', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          '[C]Show me the way to go [F]home,',
          'I\'m [C]tired and I want to go to [G7]bed.',
          'I had a [C]little drink about an [C7]hour ago,',
          'And it [F]went right to my [G7]head.',
          'Wherever I may [C]roam,',
          'On [C7]land or sea or [F]foam,',
          'You will [C]always hear me [Am]singing this song,',
          '[C]Show me the [G7]way to go [C]home.'
        ] }
      ],
      extraChords: ['Am']
    }),

    S({
      id: 'grandfathers-clock', title: 'My Grandfather\'s Clock',
      origin: 'Henry Clay Work', published: 1876,
      key: 'G', tempo: 112, difficulty: 1, tags: ['story song', 'three chords', 'singalong'],
      about: 'The song that gave the grandfather clock its name -- before this, they were just longcase clocks.',
      chords: ['G', 'C', 'D7', 'Em'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'C', 'G', 'G', 'D7', 'G', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'My [G]grandfather\'s clock was too large for the shelf,',
          'So it [C]stood ninety years on the [G]floor.',
          'It was taller by half than the old man himself,',
          'Though it [D7]weighed not a pennyweight [G]more.'
        ] },
        { section: 'Chorus', lines: [
          'But it [G]stopped short, never to go again,',
          'When the [D7]old man [G]died.',
          'Ninety years without slumbering, tick tock tick tock,',
          'His [C]life seconds numbering, [G]tick tock tick tock,',
          'It [G]stopped short, never to go again,',
          'When the [D7]old man [G]died.'
        ] }
      ]
    }),

    S({
      id: 'waltzing-matilda', title: 'Waltzing Matilda',
      origin: 'Banjo Paterson, set to the tune "Craigielee"', published: 1895,
      key: 'C', tempo: 108, difficulty: 2, tags: ['australian', 'story song', 'singalong'],
      about: 'Australia\'s unofficial anthem, about a sheep thief who drowns himself rather than be arrested.',
      chords: ['C', 'F', 'G7', 'Am', 'Dm'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'F', 'C', 'C', 'G7', 'C', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'Once a [C]jolly swagman camped by a [Am]billabong,',
          '[F]Under the shade of a [C]coolibah tree,',
          'And he [C]sang as he watched and waited till his [Am]billy boiled,',
          '"[F]You\'ll come a-waltzing Ma-[G7]tilda with [C]me."'
        ] },
        { section: 'Chorus', lines: [
          'Waltzing Ma-[C]tilda, waltzing Ma-[Am]tilda,',
          '"[F]You\'ll come a-waltzing Ma-[C]tilda with me,"',
          'And he [C]sang as he watched and waited till his [Am]billy boiled,',
          '"[F]You\'ll come a-waltzing Ma-[G7]tilda with [C]me."'
        ] }
      ]
    }),

    /* ------------------------------------------- rounds and children's --- */

    S({
      id: 'row-your-boat', title: 'Row, Row, Row Your Boat',
      origin: 'Traditional American nursery rhyme and round', published: 1852,
      key: 'C', tempo: 108, timeSig: [6, 4], difficulty: 1, tags: ['round', 'children', 'easy'],
      about: 'A four-part round. Split the group, start each part two bars apart, and it harmonises itself.',
      chords: ['C', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'C', 'G7', 'C', 'C'] }],
      lyrics: [
        { section: 'Round', lines: [
          '[C]Row, row, row your boat,',
          'Gently down the stream.',
          'Merrily, merrily, merrily, merrily,',
          '[G7]Life is but a [C]dream.'
        ] }
      ]
    }),

    S({
      id: 'twinkle-twinkle', title: 'Twinkle, Twinkle, Little Star',
      origin: 'Words Jane Taylor (1806), tune "Ah! vous dirai-je, maman" (1761)', published: 1806,
      key: 'C', tempo: 96, difficulty: 1, tags: ['children', 'easy', 'three chords'],
      about: 'The same tune as the alphabet song and Baa Baa Black Sheep. Mozart wrote twelve variations on it.',
      chords: ['C', 'F', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'F', 'C', 'G7', 'C', 'G7', 'C', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          '[C]Twinkle, twinkle, [F]little [C]star,',
          '[F]How I [C]wonder [G7]what you [C]are.',
          '[C]Up a-[G7]bove the [C]world so [G7]high,',
          '[C]Like a [G7]diamond [C]in the [G7]sky.',
          '[C]Twinkle, twinkle, [F]little [C]star,',
          '[F]How I [C]wonder [G7]what you [C]are.'
        ] }
      ]
    }),

    S({
      id: 'old-macdonald', title: 'Old MacDonald Had a Farm',
      origin: 'Traditional, in this form from a WWI-era songbook', published: 1917,
      key: 'G', tempo: 116, difficulty: 1, tags: ['children', 'easy', 'three chords'],
      about: 'The animal noises are the song. Let the smallest person present choose each animal.',
      chords: ['G', 'C', 'D7'],
      form: [{ name: 'Verse', bars: ['G', 'G', 'D7', 'G', 'G', 'C', 'D7', 'G'] }],
      lyrics: [
        { section: 'Verse', lines: [
          'Old Mac-[G]Donald had a [C]farm, [G]E-I-E-I-[D7]O,',
          'And [G]on that farm he had a [C]cow, [G]E-I-E-I-[D7]O.',
          'With a [G]moo moo here and a moo moo there,',
          'Here a moo, there a moo, everywhere a moo moo.',
          'Old Mac-[G]Donald had a [C]farm, [G]E-I-E-I-[D7]O. [G]'
        ] }
      ]
    }),

    S({
      id: 'london-bridge', title: 'London Bridge Is Falling Down',
      origin: 'Traditional English nursery rhyme', published: 1744,
      key: 'C', tempo: 112, difficulty: 1, tags: ['children', 'easy', 'two chords'],
      about: 'Sung in some form since at least the 1600s. Two chords and a game.',
      chords: ['C', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'G7', 'C', 'G7', 'C', 'G7', 'C', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          '[C]London Bridge is [G7]falling [C]down,',
          'Falling down, falling [G7]down.',
          '[C]London Bridge is [G7]falling [C]down,',
          'My fair [G7]la-[C]dy.'
        ] }
      ]
    }),

    S({
      id: 'happy-birthday', title: 'Happy Birthday to You',
      origin: 'Tune by Patty and Mildred Hill; ruled public domain by a US court in 2016', published: 1893,
      key: 'C', tempo: 100, timeSig: [3, 4], difficulty: 1, tags: ['singalong', 'easy', 'three chords'],
      about: 'A US court invalidated the copyright claim in 2016 and it is now firmly public domain. Worth being able to play in any key at a moment\'s notice.',
      chords: ['C', 'F', 'G7'],
      form: [{ name: 'Verse', bars: ['C', 'C', 'G7', 'G7', 'C', 'F', 'C', 'C'] }],
      lyrics: [
        { section: 'Verse', lines: [
          '[C]Happy birthday to [G7]you,',
          'Happy birthday to [C]you,',
          'Happy birthday dear [F]—————,',
          '[C]Happy [G7]birthday to [C]you.'
        ] }
      ]
    })
  ];

  /* A few songs use a passing chord that is not in their main list. Fold those
     in so the "chords" field really is every chord the song needs -- the
     verification pass checks exactly that. */
  GL.songs.singalong.forEach(function (s) {
    (s.extraChords || []).forEach(function (c) {
      if (s.chords.indexOf(c) === -1) s.chords.push(c);
    });
    delete s.extraChords;
  });
}(window.GL = window.GL || {}));
