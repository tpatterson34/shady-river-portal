// The Shady River Bard — Standalone Singles & Listener Heritage Chronicles Data Engine
// Configure media & streaming URLs in `featuredSingle.media` below for instant UI updates.

window.SINGLES_DATA = {
  hub: {
    title: "The Singles Vault",
    subtitle: "Standalone Narrative Singles & Listener Heritage Chronicles",
    artist: "The Shady River Bard",
    canonicalUrl: "https://theshadyriverbard.com/singles/",
    substackDeconstructedUrl: "https://theshadyriverbard.substack.com/s/deconstructed",
    description: "Beyond the 27-album conceptual tapestry, The Singles Vault houses standalone narrative ballads, historical inquiries, and listener heritage chronicles—songs born directly from family heirlooms, working-class archives, and lived memory shared on the porch."
  },

  featuredSingle: {
    id: "the-greenock-slate-and-the-gold-watch",
    slug: "the-greenock-slate-and-the-gold-watch",
    number: 1,
    number_padded: "01",
    badge: "STANDALONE SINGLE // LISTENER HERITAGE CHRONICLE",
    card_badge: "Single Release",
    key_tempo_badge: "Key of D Minor // 74 BPM",
    key: "D Minor",
    bpm: 74,
    duration: "06:59",
    release_year: 2026,
    release_status: "Audio Finalised • Music Video in Post-Production",
    title: "The Greenock Slate and the Gold Watch",
    subtitle: "A True Family Chronicle of the Clyde, the Great War, and the Arithmetic of the Glens",
    location: "Greenock, Inverclyde • Portree (Isle of Skye) • The Angus Glens • The Somme",
    genre: "Somber Celtic-Americana & Intimate Acoustic Folk Ballad",
    thesis: "Numbers on a ledger can be debated by scholars in comfortable rooms, but an empty technical college, a silent glen in Skye, a one-legged slater climbing back onto the high roofs above the Clyde to earn his bread, and an heirloom gold watch cannot be argued away.",
    dedication: "Written in honor of subscriber Bob McNair and the memory of Great Uncle Wullie Smith McNair, Granddad Nicol John McNair, Father Wullie McNair, Brother Wullie McNair, Uncle Lammy, and the generation of Scottish working men who never crossed the foam.",

    // =========================================================================
    // MEDIA & STREAMING PLACEHOLDERS (Configure here for instant UI switching)
    // =========================================================================
    // NOTE: Leave `youtubeVideoUrl: ""` while the Music Video is in post-production.
    // When `youtubeVideoUrl` is empty, the banner CTA renders a dignified amber badge
    // reading "Music Video Premiering Soon" with aria-disabled="true".
    // As soon as a valid YouTube URL or 11-character Video ID is placed in `youtubeVideoUrl`,
    // the UI automatically activates the red YouTube "Watch Video" trigger & in-page modal.
    media: {
      youtubeVideoUrl: "",
      spotifyUrl: "[INSERT_SPOTIFY_URL_OR_LEAVE_PENDING]",
      appleMusicUrl: "[INSERT_APPLE_MUSIC_URL_OR_LEAVE_PENDING]",
      amazonMusicUrl: "[INSERT_AMAZON_MUSIC_URL_OR_LEAVE_PENDING]",
      substackDeconstructedUrl: "https://theshadyriverbard.substack.com/s/deconstructed"
    },

    art_banner: "assets/art/the-greenock-slate-and-the-gold-watch-banner.webp",
    art_square: "assets/art/the-greenock-slate-and-the-gold-watch-cover.webp",
    art_alt: "On a weathered dark oak workbench beside an iron slater's hammer and grey Scottish roof slate, an antique open-face retinal gold pocket watch gleams in warm candlelight; through a rain-streaked workshop window behind it, the silhouette of the historic Greenock Townhall clock tower rises over the misty River Clyde.",

    pillar_badges: [
      "Working-Class Heritage",
      "Clyde Shipyards",
      "WWI Scottish Divisions",
      "The Ledger vs. Memory"
    ],

    tags: [
      "Greenock",
      "RiverClyde",
      "ScottishHistory",
      "GreatWar",
      "PalsBattalions",
      "Portree",
      "AngusGlens",
      "WorkingClassMemory"
    ],

    quote: "Tell that to the silent heather, tell it to the empty pews\nTell it to the mothers waiting on the Portree coastal views\nWhen forty out of every hundred never crossed the foam\nAnd a pocket watch in Greenock is the only thing come home",

    bards_story: [
      "This song began with a message from subscriber Bob McNair—a true family chronicle reaching back over a century to the high roofs above the River Clyde. Seven years before the guns of August 1914, Bob's Great Uncle Wullie Smith McNair and his younger brother, Granddad Nicol John McNair, worked the towering timber scaffolding slating the roof of the Greenock Townhall. When a photographer from the Greenock Telegraph ('The Telly') was sent up to capture their portrait overlooking the smoking shipyards, young Nicol John—being the junior apprentice—had to hump the heavy early-era plate camera contraption all the way up the ladders, only for the brothers to discover they had forgotten their lunch sandwiches (locally called 'pieces'). After heatedly blaming each other on the windswept slate, Nicol John was sent all the way back down to fetch the pieces, raging every step of the way while Wullie looked out over a town brimming with young apprentices.",
      "When war was declared in 1914, that entire world of shipyard apprentices, technical college classmates, and rural Highland cousins marched off together. Next door to the McNairs lived the Dell family, whose 16-year-old son lied about his age to enlist, rode the direct British military rail lines from London to the Western Front, was hosed down in the backyard on brief home leave to clear trench lice, and secretly kept a forbidden trench diary—an offense for which he could have been shot—recording how his regiment stormed half-naked Prussian Guards before he was killed on the Somme at age sixteen.",
      "When the transport ships finally pulled back into Greenock after the Armistice, the McNairs were told they had 'got off light' because Great Uncle Wullie came down the gangplank alive—leaning on wooden crutches with an empty trouser leg pinned up. Yet in the brutal 1920s Clyde depression that followed, 'the King's own shilling couldn't buy a working man his bread.' With no safety net sufficient to sustain him, Wullie hauled himself back up the steep wet Greenock slate roofs on one good leg to earn his keep, looking down on technical college classrooms that sat as empty as chapels in the rain until an old man decades later wept with joy on a carriage train just to see young people filling the seats again.",
      "Today, while academic revisionists in comfortable parlors debate whether Scottish casualty ledgers were statistically exaggerated, Bob McNair holds Great Uncle Wullie's antique open-face retinal gold pocket watch in his palm—an heirloom bridging three generations of Wullies (Great Uncle Wullie, Bob's late father Wullie, a gregarious singer named in his honor, and Bob's late older brother Wullie, a Clint Eastwood-built shipyard character). The scholars can average out the dead in ink instead of red, but the slate is still on the Greenock courthouse, and the gold watch is still ticking in Bob's hand."
    ],

    musical_direction: {
      summary: "Somber Celtic-Americana & Intimate Acoustic Folk Ballad in D Minor (74 BPM).",
      details: "Built on a close-mic'd fingerpicked acoustic guitar playing a steady, unhurried pocket-watch clockwork rhythm, paired with a weeping low cello, subtle distant fiddle swells, a calm weathered Scottish male baritone lead vocal, and an ethereal female harmony vocal joining on the choruses and bridge to evoke the voices of the mothers waiting along the Portree coast and the Angus Glens."
    },

    // Framework 1: 3-Pillar Thematic Matrix
    pillars: [
      {
        number: "I",
        code: "PILLAR I // IMPERIAL DOCTRINE",
        title: "The \"Martial Race\" Myth & Frontline Concentration",
        stat_highlight: "~26% Fatalities",
        stat_sub: "100,000–148,000 Scottish dead from a 4.8M population (vs. 11–12% UK military average)",
        icon: "fa-solid fa-shield-halved",
        summary: "How imperial command flattered displaced Highlanders and working-class Lowlanders as 'natural warriors'—funneling Scottish regiments (9th, 15th, and 51st Highland Divisions) into frontline shock assault roles at Loos, Arras, and the Somme.",
        analysis: "Within a century of the Highland Clearances, Westminster and the War Office weaponized romanticized tartan mythology into a lethal operational doctrine. Designated as shock troops—'the sharpest of the spear'—Scottish divisions were repeatedly committed to the most heavily fortified sectors of the Western Front. While modern academic debates attempt to smooth out national mortality curves across Britain, the demographic shock across Scottish industrial towns and rural parishes remains indelible.",
        lyric_echo: "They called the Highland regiments the sharpest of the spear / Put the kilts and Lowland bonnets where the lead was flying near"
      },
      {
        number: "II",
        code: "PILLAR II // COMMUNAL RECRUITMENT",
        title: "The Territorial System & The Pals Battalions",
        stat_highlight: "Up to 40% Lost",
        stat_sub: "Entire cohorts of young men erased in rural parishes like Portree (Skye) & the Angus Glens",
        icon: "fa-solid fa-users-slash",
        summary: "Before 1916 conscription, recruitment pulled entire streets, Greenock shipyards, technical college classes, and rural estates into the same battalions. When a single morning of artillery struck, it annihilated a single postcode.",
        analysis: "Because cousins, workshop apprentices, and classmates enlisted side by side under local landlords, factors, and civic drives, casualties were never distributed evenly across the map. One zero-hour barrage at Loos or the Somme did not merely increment a Whitehall ledger—it silenced an entire technical college bench in Greenock and left coastal kirks in Portree and the Angus Glens without a single young man to work the crofts.",
        lyric_echo: "Pals from every workshop, cousins side by side / Marched into the furnace where a quarter of them died"
      },
      {
        number: "III",
        code: "PILLAR III // AUSTERITY & SURVIVAL",
        title: "The Post-War Hollowing & The King's Shilling",
        stat_highlight: "400,000 Emigrants",
        stat_sub: "1920s Clyde depression, empty technical benches & disabled veterans working high slate",
        icon: "fa-solid fa-hammer",
        summary: "Returning to severe 1920s economic depression along the Clyde and nearly 400,000 emigrants leaving Scotland, disabled veterans found that the meager military pension ('the King's own shilling') couldn't buy a working man his bread.",
        analysis: "When the transport ships docked at Greenock, families whose sons returned missing a limb were told they had 'got off light.' Yet the state that spent working-class bodies like coal and lamping oil offered disability pensions too meager to survive on. While technical schools and apprenticeship benches sat half-empty like chapels in the rain, amputees like Great Uncle Wullie McNair had to haul themselves back onto rain-slicked slate roofs on one good leg to earn their bread.",
        lyric_echo: "The King's own shilling couldn't buy a working man his bread / So he climbed back up the slate on one good leg to earn his stead"
      }
    ],

    // Framework 2: The McNair Family & Greenock Timeline (1907–Present)
    timeline: [
      {
        year: "1907",
        era_badge: "ACT I // SEVEN YEARS BEFORE THE GUNS",
        title: "High Above the Clyde: The Townhall Roof & \"The Pieces\"",
        location: "Greenock Townhall Scaffolding, Overlooking the Clyde",
        icon: "fa-solid fa-camera-retro",
        narrative: "Seven years before the guns of August, Great Uncle Wullie Smith McNair and his younger brother, Nicol John McNair, work the high scaffolding slating the roof of the Greenock Townhall. A photographer from the Greenock Telegraph ('The Telly') is sent up to capture their portrait overlooking the shipyards. Because Nicol John is the youngest, he has to hump the heavy early-era camera contraption all the way up the scaffolding—only for the brothers to realize they forgot their sandwiches (locally called 'pieces'). Blaming each other, Nicol John is sent all the way back down for the pieces, raging while Wullie peers out over the Clyde.",
        artifact_note: "Archival Family Memory: The 1907 Greenock Telegraph rooftop photograph & the forgotten 'pieces'"
      },
      {
        year: "1914–1918",
        era_badge: "ACT II // THE WESTERN FRONT",
        title: "The Furnace of the Somme & The 16-Year-Old's Forbidden Diary",
        location: "Greenock • Portree • Angus Glens • The Somme",
        icon: "fa-solid fa-book-skull",
        narrative: "The young men of Greenock, Portree, and the Angus Glens march off in a wave of communal euphoria. Next door to Bob McNair's home lived the Dell family—whose 16-year-old son lied about his age to enlist, rode the direct British military rail lines from London to the Western Front, was hosed down in the backyard on leave to clear trench lice, and secretly kept a forbidden trench diary (for which he could have been shot) recording how his regiment stormed half-naked Prussian Guards before he was killed at the Somme at age 16.",
        artifact_note: "Archival Neighbour Testimony: Mr. Dell's 16-year-old brother's contraband Somme diary"
      },
      {
        year: "1919–1930s",
        era_badge: "ACT III // THE INTERWAR HOLLOWING",
        title: "\"Got Off Light\" & One Good Leg on the High Slate",
        location: "Greenock Quayside, High Slate Roofs & Clyde Carriages",
        icon: "fa-solid fa-crutch",
        narrative: "Great Uncle Wullie survives the war and comes off the transport ship at Greenock leaning on wooden crutches with a trouser leg to pin. Because entire families lost every son they had, the McNairs are considered to have 'got off light.' Because the King's pension cannot feed a working man, Wullie climbs back up the steep slate roofs above the Clyde on one good leg to earn his stead. Decades later, after a generation of empty apprenticeship benches, an old man on a train smiles through tears just to see young folks filling the carriages again.",
        artifact_note: "Lived Reality: Wooden crutches at the quay, empty technical college benches, and working high roofs on one leg"
      },
      {
        year: "Present Day",
        era_badge: "ACT IV // THE LIVING HEIRLOOM",
        title: "Three Generations of Wullie & The Retinal Gold Watch",
        location: "Passed Down into Bob McNair's Hand Today",
        icon: "fa-regular fa-clock",
        narrative: "Passed down from Great Uncle Wullie—and honoring a family line that includes Bob's late father Wullie (a gregarious singer named after his uncle), Bob's late older brother Wullie (a Clint Eastwood-built shipyard character), and Uncle Lammy the master baker—the antique open-face retinal gold watch rests in Bob McNair's hand today. Its spinning gears stand as an unanswerable physical rebuttal to every revisionist ledger.",
        artifact_note: "Heirloom Witness: Great Uncle Wullie Smith McNair's open-face retinal gold pocket watch"
      }
    ],

    // Framework 3: Dedicated Callout Section — The Poetics of the Watch
    poeticsCallout: {
      badge: "EDITORIAL CALLOUT // THE POETICS OF THE WATCH",
      title: "The Poetics of the Watch: Why the Heirloom Stands for a Generation",
      chorus_couple: "When forty out of every hundred never crossed the foam / And a pocket watch in Greenock is the only thing come home.",
      intro: "Listeners often notice the deliberate tension between the verses and the chorus: in Verse 3 and Verse 4, Great Uncle Wullie survives the transport ship on wooden crutches and climbs back onto the Greenock slate on one good leg—yet the Chorus declares that 'a pocket watch in Greenock is the only thing come home.' That line carries a triple historical weight:",
      pillars: [
        {
          number: "01",
          title: "Synecdoche for the Pals Who Stayed Behind",
          body: "While Verse 3 and Verse 4 tell Great Uncle Wullie's personal survival story—leaning on wooden crutches with a pinned trouser leg and climbing back onto the roofs on one good leg—the Chorus zooms out to the macro-tragedy of his generation. Because Pals battalions recruited classmates and workshop friends side by side, Wullie returned carrying the memory of the apprentices and neighbors who remained beneath the French clay. For those boys, that ticking watch in Greenock is the only piece of their shared youth that made it back."
        },
        {
          number: "02",
          title: "The War Office Parcels of Greenock",
          body: "On Bob's own street, all that returned of Mr. Dell's 16-year-old brother from the Somme was a forbidden trench diary. Across Scotland, thousands of mothers untied the twine on small brown War Office parcels containing only a dead boy's pocket watch or badge. The watch in the Chorus honors every kitchen table where an heirloom arrived in place of a son."
        },
        {
          number: "03",
          title: "The Last Witness Across a Century",
          body: "'Come home' doesn't just mean crossing the Channel in 1918—it means surviving to the present day to testify. Today, the soldiers of the Somme are gone. Great Uncle Wullie, Granddad Nicol John, Uncle Lammy the master baker, Bob's father Wullie, and Bob's brother Wullie are all gone. Across a hundred years of working-class brotherhood, grit, and grief, the spinning gears of that retinal gold watch in Bob's palm are literally the only physical witness left standing to prove they were here."
        }
      ]
    },

    // Strictly Reconciled Verbatim Clean Lyrics
    clean_lyrics_stanzas: [
      "[Verse 1]\nSeven years before the guns, high above the Clyde\nWullie and my granddad worked the scaffolding with pride\nSlating Greenock Townhall roof against the autumn gale\nTwo brothers with their hammers and an apron full of nails\nThey could see the shipyards smoking down along the quay\nThe technical colleges buzzing with the boys they used to be\nBefore the posters on the kirk, before the sergeant's drum\nBefore the empire counted up the harvest yet to come",
      "[Verse 2]\nThey called the Highland regiments the sharpest of the spear\nPut the kilts and Lowland bonnets where the lead was flying near\nFrom the crofts around Portree and down the Angus Glens\nThe factor and the recruiter took a generation's men\nPals from every workshop, cousins side by side\nMarched into the furnace where a quarter of them died\nTwenty six in every hundred left beneath the clay\nWhile the clerks inside the ministry just filed the names away",
      "[Chorus]\nAnd the scholars in their parlors argue over decimal points\nSaying Scotland bled no deeper than the rest of Britain's joints\nTell that to the silent heather, tell it to the empty pews\nTell it to the mothers waiting on the Portree coastal views\nWhen forty out of every hundred never crossed the foam\nAnd a pocket watch in Greenock is the only thing come home",
      "[Verse 3]\nOur family got off lightly when the transport ship pulled in\nWullie leaned on wooden crutches with a trouser leg to pin\nThe King's own shilling couldn't buy a working man his bread\nSo he climbed back up the slate on one good leg to earn his stead\nWhile the technical classrooms echoed with no young lads on the train\nNo apprentices at the benches, just a chapel in the rain\nUntil an old man decades later smiled through his tears\nSaying how good it is to see the young folks after all these years",
      "[Chorus]\nStill the scholars in their parlors argue over decimal points\nSaying Scotland bled no deeper than the rest of Britain's joints\nTell that to the silent heather, tell it to the empty pews\nTell it to the mothers waiting on the Portree coastal views\nWhen forty out of every hundred never crossed the foam\nAnd a pocket watch in Greenock is the only thing come home",
      "[Bridge]\nFrance gave up a million sons upon her broken soil\nAnd the crowns of Europe spent the poor like coal and lamping oil\nThey flattered us as warriors so we would take the wire\nThen debated on the ledger who had stood the longest fire",
      "[Verse 4]\nNow I hold great uncle Wullie's retinal gold watch inside my hand\nPassed down from a roofer who survived a shattered land\nThe gears are spinning softly like the years he had to bide\nWorking on one leg upon the roofs above the Clyde\nYou can trim the rolls of Serbia, you can average out the dead\nYou can write your tidy histories in ink instead of red\nIn ink instead of red",
      "[Outro]\nBut the slate is on the courthouse, and the gold is in my palm\nAnd the glens are still remembering the storm before the calm\nRest easy, Uncle Wullie."
    ],

    copyright_notice: "© 2026 The Shady River Bard. All rights reserved."
  }
};
