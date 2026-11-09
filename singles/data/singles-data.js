// The Shady River Bard — Standalone Singles & Listener Heritage Chronicles Data Engine
// Each single has an immutable dedicated permalink (/singles/<slug>/) suitable for YouTube descriptions,
// plus full representation in the top-level Singles Vault hub (/singles/).

(function() {
  const singlesList = [
    // =========================================================================
    // SINGLE 01: THE GREENOCK SLATE AND THE GOLD WATCH
    // Permalink: https://theshadyriverbard.com/singles/the-greenock-slate-and-the-gold-watch/
    // =========================================================================
    {
      id: "the-greenock-slate-and-the-gold-watch",
      slug: "the-greenock-slate-and-the-gold-watch",
      permalink: "https://theshadyriverbard.com/singles/the-greenock-slate-and-the-gold-watch/",
      relative_url: "the-greenock-slate-and-the-gold-watch/",
      number: 1,
      number_padded: "01",
      badge: "STANDALONE SINGLE 01 // LISTENER HERITAGE CHRONICLE",
      card_badge: "Single #01",
      key_tempo_badge: "Key of D Minor // 74 BPM",
      key: "D Minor",
      bpm: 74,
      duration: "06:59",
      release_year: 2026,
      release_status: "Official Audio & Music Video Out Now",
      title: "The Greenock Slate and the Gold Watch",
      title_accent_split: ["The Greenock Slate", "and the Gold Watch"],
      subtitle: "A True Family Chronicle of the Clyde, the Great War, and the Arithmetic of the Glens",
      location: "Greenock, Inverclyde • Portree (Isle of Skye) • The Angus Glens • The Somme",
      genre: "Somber Celtic-Americana & Intimate Acoustic Folk Ballad",
      thesis: "Numbers on a ledger can be debated by scholars in comfortable rooms, but an empty technical college, a silent glen in Skye, a one-legged slater climbing back onto the high roofs above the Clyde to earn his bread, and an heirloom gold watch cannot be argued away.",
      thesis_attribution: "— Historical Thesis • Inspired by the McNair Family Archive (Greenock, Scotland)",
      dedication: "Written in honor of subscriber Bob McNair and the memory of Great Uncle Wullie Smith McNair, Granddad Nicol John McNair, Father Wullie McNair, Brother Wullie McNair, Uncle Lammy, and the generation of Scottish working men who never crossed the foam.",

      telemetry: [
        { label: "Chronicle Span", value: "1907 – 2026", color_cls: "text-white" },
        { label: "Scottish Service Loss", value: "~26% Killed", color_cls: "text-retinal-400" },
        { label: "Parish Depopulation", value: "Up to 40%", color_cls: "text-amber-400" },
        { label: "Heirloom Anchor", value: "Wullie’s Watch", color_cls: "text-emerald-400" }
      ],

      hero_art_caption_label: "Heirloom Artifact • Greenock",
      hero_art_caption_title: "Great Uncle Wullie Smith McNair’s Open-Face Gold Watch",

      media: {
        youtubeVideoUrl: "https://youtu.be/9IWrmtCF4nQ",
        spotifyUrl: "[INSERT_SPOTIFY_URL_OR_LEAVE_PENDING]",
        appleMusicUrl: "[INSERT_APPLE_MUSIC_URL_OR_LEAVE_PENDING]",
        amazonMusicUrl: "[INSERT_AMAZON_MUSIC_URL_OR_LEAVE_PENDING]"
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

      pillars_section: {
        badge: "Interactive Framework I // 3-Pillar Historical Matrix",
        title: "The Ledger vs. Lived Memory",
        intro: "In recent decades, academic revisionists have sought to smooth out First World War mortality figures across the British Isles—arguing over decimal points in comfortable parlors. Yet demographic concentration, Pals battalion recruitment, and interwar economic collapse left scars across working-class Scotland that no aggregate spreadsheet can erase."
      },

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

      timeline_section: {
        badge: "Interactive Framework II // Family & Municipal Archive",
        title: "The McNair Family & Greenock Timeline (1907–Present)",
        intro: "Trace the four historical movements preserved by subscriber Bob McNair—from the high timber scaffolding of the Greenock Townhall in 1907 to the spinning gears of Great Uncle Wullie’s gold watch today."
      },

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
    },

    // =========================================================================
    // SINGLE 02: THE GUNS OF LOCH FYNE
    // Permalink: https://theshadyriverbard.com/singles/the-guns-of-loch-fyne/
    // =========================================================================
    {
      id: "the-guns-of-loch-fyne",
      slug: "the-guns-of-loch-fyne",
      permalink: "https://theshadyriverbard.com/singles/the-guns-of-loch-fyne/",
      relative_url: "the-guns-of-loch-fyne/",
      number: 2,
      number_padded: "02",
      badge: "STANDALONE SINGLE 02 // CLAN HERITAGE CHRONICLE",
      card_badge: "Single #02",
      key_tempo_badge: "Celtic Folk-Rock // 1745–1746 Highland Stand",
      key: "D Dorian / Minor",
      bpm: 68,
      duration: "05:28",
      release_year: 2026,
      release_status: "Official Audio & Music Video Out Now",
      title: "The Guns of Loch Fyne",
      title_accent_split: ["The Guns of", "Loch Fyne"],
      subtitle: "The 1745–1746 Loch Fyne Campaign, Old Castle Lachlan & the Stand of the MacNair Tacksmen on the Cowal Shore",
      location: "Loch Fyne • Old Castle Lachlan (Strachur, Cowal Peninsula) • Otter Ferry • Campbeltown • Drumossie Moor (Culloden)",
      genre: "Cinematic Gaelic & Highland Folk-Rock Ballad",
      thesis: "They could sail Royal Navy bomb vessels up the saltwater tide to smash the loch-boats, disguise shore bombardment in the ship's log as a royal birthday salute, and outlaw the tartan by royal decree—but so long as the MacNair tacksmen, Henny MacLachlan, and Duncan Fisher guarded the kin, the keys, and the charter box, the bloodline was never broken.",
      thesis_attribution: "— Historical Thesis • Reconciling the 1746 Ballad Tradition with the 1745 HMS Terror Logbooks & Family Archive of Bob McNair",
      dedication: "Dedicated to subscriber Bob McNair (@bobmcnair9234) and the enduring bloodline of his direct Strathlachlan ancestors—tacksmen Archibald MacNair (d. 1706) & Margrat Fisher, John MacNair (b. 1692), his son Archibald MacNair, kinsman Duncan Fisher, and Hellen ('Henny') MacLachlan—who held the line on the shores of Loch Fyne.",

      telemetry: [
        { label: "Campaign Span", value: "Nov 1745 – 1746", color_cls: "text-white" },
        { label: "Bomb Squadron", value: "Terror & Furnace", color_cls: "text-retinal-400" },
        { label: "Ancestral Keep", value: "Castle Lachlan", color_cls: "text-amber-400" },
        { label: "Direct Ancestors", value: "John & Archibald", color_cls: "text-emerald-400" }
      ],

      hero_art_caption_label: "Highland Resistance • Cowal Peninsula, 1745–1746",
      hero_art_caption_title: "Old Castle Lachlan & the Royal Navy Bomb Squadron on Loch Fyne",

      media: {
        youtubeVideoUrl: "https://youtu.be/T2WUvcxPLqw",
        spotifyUrl: "[INSERT_SPOTIFY_URL_OR_LEAVE_PENDING]",
        appleMusicUrl: "[INSERT_APPLE_MUSIC_URL_OR_LEAVE_PENDING]",
        amazonMusicUrl: "[INSERT_AMAZON_MUSIC_URL_OR_LEAVE_PENDING]"
      },

      art_banner: "assets/art/the-guns-of-loch-fyne-banner.webp",
      art_square: "assets/art/the-guns-of-loch-fyne-cover.webp",
      art_alt: "Across the churning misty waters of Loch Fyne, the ancient stone keep of Old Castle Lachlan stands wreathed in cannon smoke while a Royal Navy bomb vessel fires from the saltwater loch; in the rocky foreground rest a Highland broadsword, targe shield, and flintlock musket.",

      pillar_badges: [
        "1745–1746 Jacobite Rising",
        "Clan MacLachlan & MacNair",
        "HMS Terror & HMS Furnace",
        "19-Gun Logbook Ruse"
      ],

      tags: [
        "LochFyne",
        "CastleLachlan",
        "ClanMacNair",
        "ClanMacLachlan",
        "HMSTerror",
        "HMSFurnace",
        "CaptainRobertDuff",
        "Culloden1746"
      ],

      quote: "Oh, the guns of Loch Fyne roared over the tide\nTore stone from the mortar where children would hide\nThey can batter the keep, they can outlaw the plaid\nThey can outlaw the tartan our fathers had had\nStand firm on the shoreline, MacNair hold the line\nThough Castle Lachlan must drown in Loch Fyne",

      bards_story: [
        "This song was sparked by a conversation with my friend and subscriber Bob McNair (@bobmcnair9234), who shared the deep oral, genealogical, and archival bond between his family—the MacNairs (now McNair)—and Clan MacLachlan along the shores of Loch Fyne in Argyll. Speaking Gaelic, Scots, and English, Bob's ancestors served as the trusted tacksmen (stewards, military organizers, and enforcers) for Clan MacLachlan. Though the MacNairs were Presbyterian rather than Catholic or Episcopalian, they were loyal to the MacLachlans to their very core and bound by marriage across generations: Bob's direct ancestor Archibald MacNair (who died in 1706) was a clan tacksman married to Margrat (Margaret) Fisher, and John MacNair (born in 1692) was brought up by the MacLachlan Chief's brother Coll. John fought in the 1715 Jacobite Rising at the Battle of Sheriffmuir, and when the old MacLachlan chief was shot dead by the Campbells a few years later, John stood guard over young Lachlan MacLachlan—the very man who, as 17th Chief and aide-de-camp to Prince Charles Edward Stuart, rode north in 1745–1746 and became the only clan chief killed on the battlefield at Culloden (Drumossie Moor).",
        "When I first researched and wrote the lyrics for 'The Guns of Loch Fyne,' I anchored the ballad in the enduring post-Culloden tradition of Spring 1746—where Captain John Fergussone ('The Black Captain') and the Royal Navy bomb vessel HMS Furnace came to symbolize Hanoverian naval vengeance across the western sea lochs, battering Old Castle Lachlan into a roofless ruin while the MacNair tacksmen held the shallows so the women and children could escape into the bracken. After the video was released, Bob shared copies of the Royal Navy logbooks and prisoner testimonies that unlocked the rest of the story—revealing that the ballad's folklore and the Admiralty archives actually capture two chapters of the same two-ship bomb-vessel squadron operating in Loch Fyne between November 1745 and the aftermath of Culloden.",
        "As Bob's archival records show, five months before Culloden—in November 1745—Royal Navy Commander Robert Duff (an Aberdonian who despised Highlanders and was senior commander alongside Fergussone in the West Coast bomb-vessel flotilla) sailed HMS Furnace's sister bomb vessel, HMS Terror (shallow-drafted enough to cross the bar at Otter Ferry), up Loch Fyne. After pausing at a minor Campbell laird's residence just south of the castle (a figure later reviled in Gaelic poetry as 'the evil wicked spider'), Duff moved on Old Castle Lachlan to smash the small boats ferrying recruits across the loch—because in 1745 only muddy tracks existed ashore, making water transport vital. At Castle Lachlan, Captain Malcolm MacGregor of Comar (nephew of Rob Roy MacGregor) had been organizing a major Jacobite muster of 150 MacGregors and over 200 MacLachlans (roughly 400+ men in all), who marched out just hours before HMS Terror's landing party came ashore, leading to a sharp skirmish at the head of the loch. Even more fascinating is Bob's forensic discovery inside HMS Terror's logbook: the Duke of Argyll (directing West Coast naval operations from London) had explicitly forbidden bombarding the local Argyllshire population, and Admiralty rules required every cannonball and gunpowder barrel to be strictly accounted for. Yet HMS Terror's log officially records firing a '19-gun salute' in November 1745 to mark a royal birthday—when no royal birthday or royal visit existed! As Bob deduced, the '19-gun salute' was almost certainly Duff's logbook ruse to avoid a court-martial after firing live ordnance at the departing Jacobites and civilians along the east shore, while also handing a barrel of gunpowder to the pro-Hanoverian Campbell Argyll Militia (and quelling a brief mutiny aboard the Terror). Because modern archaeologists have never found cannonballs embedded in Old Castle Lachlan's walls, the keep was likely abandoned and occupied by the Argyll Militia rather than leveled by ship broadsides—and during that perilous occupation, Bob's kinsman Duncan Fisher secretly recovered the keys to Castle Lachlan along with a box of clan letters and papers for those loyal to the MacLachlans.",
        "Near the end of the rising, three generations of Bob's direct family stood on the razor's edge in Strathlachlan: 53-year-old John MacNair (b. 1692), his son Archibald MacNair, and his grandson. As the Jacobite army retreated toward Inverness in April 1746, young Archibald hurried north with clansmen to reach Chief Lachlan's side, arriving just a day late for the slaughter at Culloden. With Strathlachlan emptied of able-bodied men—half of whom never returned—and occupied by the Argyll Militia, a Campbell militia officer moved to murder Archibald, only to be stopped by the officer's own wife, Hellen ('Henny') MacLachlan, a clan kinswoman who saved Archibald's life. While some Strathlachlan MacNairs emigrated to North Carolina after the '45 and fought for American Independence, Bob's direct line endured in a now-abandoned settlement on the Loch Fyne shore north of Castle Lachlan—passing from Duncan MacNair (born at Otter Ferry) to Archibald MacNair (the Loch Fyne-born steamboat porter), to Thomas MacNair (who married Elizabeth Smith, daughter of a Campbeltown stonemason at the foot of the peninsula), and directly down to Greenock slaters William Smith ('Great Uncle Wullie') McNair and Nicol John McNair. (And two candid studio confessions from the making of the music video: first, when prompting the AI with the clan names, I assumed it knew the authentic tartan sett—only to realize after uploading that the colors were completely off, though as historians in the comments noted, codified clan tartans weren't formalized until King George IV's visit in 1822 anyway! Second, as Bob's sharp eye caught, the AI rendered the Royal Navy warship flying a post-1801 Red Ensign with St. Patrick's cross rather than the authentic 1745–1746 Red Ensign bearing only the crosses of St. George and St. Andrew in the canton.)"
      ],

      musical_direction: {
        summary: "Solemn, Cinematic Gaelic & Highland Folk-Rock Ballad (68 BPM).",
        details: "Opens with a mournful low D tin whistle, weeping fiddle, and resonant cello over Loch Fyne mist before building into a slow, deliberate Highland march driven by Scottish smallpipes, acoustic guitar, double bass, and thunderous war-drum bodhrán—culminating in an anthemic gang-vocal chorus ('Hold the line! / Drown in Loch Fyne!')."
      },

      pillars_section: {
        badge: "Interactive Framework I // 3-Pillar Historical Matrix",
        title: "Reconciling the Ballad & The Logbook (1715–1746)",
        intro: "By pairing the enduring post-Culloden ballad tradition of Spring 1746 with subscriber Bob McNair's family archives and copies of HMS Terror's November 1745 logbook, a richer portrait emerges—spanning two Royal Navy bomb vessels, a 19-gun logbook cover-up, and the named ancestors who kept the clan alive."
      },

      pillars: [
        {
          number: "I",
          code: "PILLAR I // THE CLAN COVENANT",
          title: "From Sheriffmuir (1715) to the Tacksmen's Threshold (1745–1746)",
          stat_highlight: "1715 – 1746",
          stat_sub: "John MacNair (b. 1692) & his son Archibald MacNair, Tacksmen of Strathlachlan",
          icon: "fa-solid fa-people-roof",
          summary: "Fluent in Gaelic, Scots, and English—and fiercely loyal to Clan MacLachlan despite being Presbyterian—the MacNair tacksmen served as the estate's military organizers, agricultural stewards, and protectors across generations.",
          analysis: "Raised by the MacLachlan Chief's brother Coll, Bob's ancestor John MacNair (b. 1692) fought at Sheriffmuir in 1715 and guarded young Lachlan MacLachlan after the previous chief was shot dead by Campbells. When Captain Malcolm MacGregor of Comar (Rob Roy's nephew) mustered 400+ Jacobites at Castle Lachlan in November 1745 and Chief Lachlan later fell at Culloden (the only clan chief killed on the field), 53-year-old John remained to shield the glen while his son Archibald hurried north toward Inverness—arriving a day late for Culloden.",
          lyric_echo: "We kept the cattle, we shielded the glen / MacNair at the threshold for fallen men"
        },
        {
          number: "II",
          code: "PILLAR II // THE TWO-SHIP RECORD",
          title: "HMS Terror (Nov 1745) vs. HMS Furnace (1746) & The 19-Gun Ruse",
          stat_highlight: "19-Gun Ruse",
          stat_sub: "Cmdr. Robert Duff (HMS Terror) & Capt. John Fergussone (HMS Furnace)",
          icon: "fa-solid fa-ship",
          summary: "While Highland folklore remembers Captain John Fergussone ('The Black Captain') and HMS Furnace from the 1746 post-Culloden sweeps, HMS Terror's ship log reveals Commander Robert Duff's crucial Loch Fyne raid five months earlier in November 1745.",
          analysis: "Both HMS Terror and HMS Furnace were converted shallow-draft bomb vessels operating in the same West Coast squadron. Crossing the bar at Otter Ferry in November 1745 to smash Jacobite boats on Loch Fyne, Duff arrived hours after the Jacobite levy marched out. Because the Duke of Argyll forbade bombarding local Argyllshire populations and Admiralty rules required accounting for every shot, Duff logged a fictitious '19-gun salute for a royal birthday' (when none existed) to cover up live shore bombardment, while handing a barrel of gunpowder to the Argyll Militia.",
          lyric_echo: "The mast of the Furnace cut white through the foam / The Black Captain Fergusson hunting our home"
        },
        {
          number: "III",
          code: "PILLAR III // SURVIVAL & RELICS",
          title: "Henny MacLachlan's Mercy, Duncan Fisher's Keys & The Bloodline",
          stat_highlight: "Keys & Bloodline",
          stat_sub: "Archaeological truth, secret recovery & the road from Strathlachlan to Greenock",
          icon: "fa-solid fa-key",
          summary: "Archaeological surveys of Old Castle Lachlan found no embedded cannonballs—confirming the keep was abandoned and occupied by the pro-Hanoverian Argyll Militia rather than leveled by broadsides.",
          analysis: "With Strathlachlan emptied of men (half of whom never returned from the '45), survival hung by a thread. When a Campbell officer in the Argyll Militia moved to murder Bob's ancestor Archibald MacNair, the officer's own wife—Hellen ('Henny') MacLachlan, a clan kinswoman—intervened and saved his life. Meanwhile, kinsman Duncan Fisher (linked by marriage to tacksman Archibald MacNair, d. 1706, and Margrat Fisher) secretly recovered the castle keys and a box of clan letters—preserving a bloodline that flowed from north of Castle Lachlan to Otter Ferry, Campbeltown, and Greenock.",
          lyric_echo: "They can batter the keep, they can outlaw the plaid / Stand firm on the shoreline, MacNair hold the line"
        }
      ],

      timeline_section: {
        badge: "Interactive Framework II // Clan & Coastal Archive",
        title: "The Loch Fyne & Castle Lachlan Chronicle (1692–Present)",
        intro: "Follow the four acts of the Strathlachlan and Cowal peninsula chronicle—reconciling the 1715–1746 clan covenant, the November 1745 logbook of HMS Terror, the post-Culloden crucible, and the direct lineage carried by Bob McNair today."
      },

      timeline: [
        {
          year: "1692–1715",
          era_badge: "ACT I // THE BLOOD COVENANT",
          title: "John MacNair, Sheriffmuir & Protecting the Young Chief",
          location: "Strathlachlan, Loch Fyne & Sheriffmuir",
          icon: "fa-solid fa-shield-halved",
          narrative: "Following in the footsteps of tacksman Archibald MacNair (d. 1706) and his wife Margrat (Margaret) Fisher, John MacNair (born 1692) is brought up by the MacLachlan Chief's brother Coll. John fights in the 1715 Jacobite Rising at the Battle of Sheriffmuir, and when the MacLachlan chief is shot dead by Campbells a few years later, John personally protects young Lachlan MacLachlan—forging an unbreakable bond before the '45 ever begins.",
          artifact_note: "Family Lineage: Archibald MacNair (d. 1706) & Margrat Fisher; John MacNair (b. 1692), veteran of Sheriffmuir"
        },
        {
          year: "November 1745",
          era_badge: "ACT II // THE TERROR LOGBOOK",
          title: "Rob Roy's Nephew, HMS Terror & The 19-Gun 'Royal Birthday' Ruse",
          location: "Otter Ferry, Old Castle Lachlan & Head of Loch Fyne",
          icon: "fa-solid fa-book-journal-whills",
          narrative: "While Chief Lachlan serves as aide-de-camp to Prince Charlie, Captain Malcolm MacGregor of Comar (nephew of Rob Roy MacGregor) gathers 150 MacGregors and 200+ MacLachlans (~400 men) at Castle Lachlan. Royal Navy Commander Robert Duff sails the bomb vessel HMS Terror over the Otter Ferry bar, pausing at a minor Campbell laird's house ('the wicked spider') before moving to smash the Loch Fyne boats. Arriving hours after the Jacobites march out, Duff logs a fake '19-gun salute for a royal birthday' to mask unauthorized shore bombardment against the Duke of Argyll's orders, hands a barrel of gunpowder to the Argyll Militia, and quells a brief mutiny aboard the Terror.",
          artifact_note: "Archival Proof: HMS Terror's Nov 1745 logbook recording the fictitious 19-gun 'royal birthday' salute"
        },
        {
          year: "April–Summer 1746",
          era_badge: "ACT III // CULLODEN & THE ARGYLL MILITIA",
          title: "Drumossie Moor, Henny MacLachlan's Mercy & The Castle Keys",
          location: "Drumossie Moor (Culloden) & Strathlachlan, Cowal Peninsula",
          icon: "fa-solid fa-key",
          narrative: "On April 16, 1746, Chief Lachlan MacLachlan falls at Culloden—the only clan chief killed on the field—while Captain John Fergussone ('The Black Captain') and sister bomb vessel HMS Furnace prowl the West Highland lochs. John MacNair's son Archibald hurries north toward Inverness with reinforcements, arriving a day late for the battle. Back in Strathlachlan, with Old Castle Lachlan abandoned to the Argyll Militia (archaeologists confirm no cannonballs struck its walls), Henny MacLachlan stops her Campbell militia officer husband from murdering Archibald MacNair, while kinsman Duncan Fisher secretly recovers the castle keys and a box of clan letters.",
          artifact_note: "Clan Survival: Henny MacLachlan saves Archibald MacNair; Duncan Fisher recovers the Castle Lachlan keys & letters"
        },
        {
          year: "1746–Present",
          era_badge: "ACT IV // OTTER FERRY TO GREENOCK",
          title: "\"The Keep Was Broken, But the Bloodline Stood\"",
          location: "North of Castle Lachlan • Otter Ferry • Campbeltown • Greenock",
          icon: "fa-solid fa-chess-rook",
          narrative: "Half of the men who marched from Strathlachlan never returned. While some MacNairs emigrated to Carolina and fought in the American War of Independence, Bob's ancestors survived in an abandoned settlement north of Castle Lachlan. The line passed to Duncan MacNair (born at Otter Ferry), to Archibald MacNair (steamboat porter, born on Loch Fyne), to Thomas MacNair (who married Elizabeth Smith, daughter of a Campbeltown stonemason at the foot of the peninsula), and down to Greenock slaters William Smith ('Great Uncle Wullie') McNair and Nicol John McNair—whose story continues in Single #01, 'The Greenock Slate and the Gold Watch.'",
          artifact_note: "Living Bloodline: From John & Archibald MacNair on Loch Fyne to Great Uncle Wullie's gold watch in Greenock"
        }
      ],

      poeticsCallout: {
        badge: "EDITORIAL CALLOUT // BALLAD LORE, SHIP LOGS & STUDIO CONFESSIONS",
        title: "Reconciling Ballad & Logbook: Stone, Bloodline, and Studio Confessions",
        chorus_couple: "Stand firm on the shoreline, MacNair hold the line / Though Castle Lachlan must drown in Loch Fyne",
        intro: "When 'The Guns of Loch Fyne' premiered on YouTube, subscriber Bob McNair—whose family lore inspired the track—shared archival ship logs and four generations of family records in the comments and by email. Together, the song and Bob's research illuminate three fascinating dimensions of history and modern AI craft:",
        pillars: [
          {
            number: "01",
            title: "Two Bomb Vessels, One Historical Scar",
            body: "Why does the song name HMS Furnace and 'The Black Captain' John Fergussone while Bob's logbooks name Commander Robert Duff and HMS Terror? Because both ships were sister bomb vessels in the same Royal Navy West Coast squadron! While Furnace and Fergussone became the enduring post-Culloden folkloric symbol of 1746 naval terror, Duff's HMS Terror executed the November 1745 Loch Fyne raid—logging a fictitious '19-gun royal birthday salute' to mask unauthorized firing against the Duke of Argyll's orders, while Old Castle Lachlan was abandoned to the Argyll Militia without a single cannonball embedded in its walls."
          },
          {
            number: "02",
            title: "The Tacksmen, Henny MacLachlan & The Castle Keys",
            body: "Popular histories of the '45 focus on princes and generals, but clan survival rested on the tacksmen and kin left at the threshold. In Strathlachlan, that meant 53-year-old John MacNair (b. 1692, veteran of Sheriffmuir) and his son Archibald (who marched north arriving a day late for Culloden), kinswoman Hellen ('Henny') MacLachlan (who stopped her Campbell militia officer husband from murdering Archibald), and kinsman Duncan Fisher (who secretly spirited away the Castle Lachlan keys and charter box)."
          },
          {
            number: "03",
            title: "The Bard's Candid Tartan & Red Ensign Confessions",
            body: "Two candid confessions from the AI video studio! First, when prompting the AI with the clan names, the Bard assumed it knew the authentic MacLachlan and MacNair tartan colors—though as historians in the comments noted, codified clan tartans didn't exist in 1746 anyway (they were formalized for King George IV's 1822 visit)! Second, Bob's sharp marine engineer's eye spotted that the warship in the video flies a post-1801 Red Ensign (with St. Patrick's red cross) rather than the authentic 1745 Red Ensign bearing only St. George's and St. Andrew's crosses in the canton."
          }
        ]
      },

      clean_lyrics_stanzas: [
        "[Verse 1]\nDrumossie was red with the frost and the clay\nWhen our Chief and his broadswords were scattered away\nLachlan rode north where the heather burned black\nLeft the hearths of the Cowal with no turning back\nWe kept the cattle, we shielded the glen\nMacNair at the threshold for fallen men\n(Shield the glen)",
        "[Verse 2]\nDown saltwater loch-tides the butcher men steer\nNo parley, no mercy, no pity to hear\nThe mast of the Furnace cut white through the foam\nThe Black Captain Fergusson hunting our home\nWith redcoat dragoons and the king's bitter law\nTo burn what remained in the lion's cold jaw\n(In the cold jaw)",
        "[Chorus]\nOh, the guns of Loch Fyne roared over the tide\nTore stone from the mortar where children would hide\nThey can batter the keep, they can outlaw the plaid\nThey can outlaw the tartan our fathers had had\nStand firm on the shoreline, MacNair hold the line\nThough Castle Lachlan must drown in Loch Fyne\n(Hold the line)\n(Drown in Loch Fyne)",
        "[Verse 3]\nThe redcoats marched inland with torches alight\nWhile the women took flight in the bracken by night\nImmunity written to slaughter at will\nYet we met them in shallows beneath the green hill\nWe held off the landing with musket and lead\nDefending the living, burying the dead\n(By night)",
        "[Chorus]\nOh, the guns of Loch Fyne roared over the tide\nTore stone from the mortar where children would hide\nThey can batter the keep, they can outlaw the plaid\nThey can outlaw the tartan our fathers had had\nStand firm on the shoreline, MacNair hold the line\nThough Castle Lachlan must drown in Loch Fyne\n(Hold the line)\n(Drown in Loch Fyne)",
        "[Bridge]\nThe water remembers each fallen estate\nThe salt on the stone at the water gate\nNo king on a throne tears the root from the glen\nA ruin of stone...\n(Never broken men)\nNever broken men!",
        "[Chorus]\nOh, the guns of Loch Fyne roared over the tide\nTore stone from the mortar where children would hide\nThey can batter the keep, they can outlaw the plaid\nThey can outlaw the tartan our fathers had had\nStand firm on the shoreline, MacNair hold the line\nThough Castle Lachlan must drown in Loch Fyne!\n(Hold the line!)\n(Drown in Loch Fyne!)",
        "[Outro]\nThe keep was broken, but the bloodline stood."
      ],

      copyright_notice: "© 2026 The Shady River Bard. All rights reserved."
    },

    // =========================================================================
    // SINGLE 03: AND THE PEOPLE CRY OUT
    // Permalink: https://theshadyriverbard.com/singles/and-the-people-cry-out/
    // =========================================================================
    {
      "id": "and-the-people-cry-out",
      "slug": "and-the-people-cry-out",
      "permalink": "https://theshadyriverbard.com/singles/and-the-people-cry-out/",
      "relative_url": "and-the-people-cry-out/",
      "number": 3,
      "number_padded": "03",
      "badge": "STANDALONE SINGLE 03 // GLOBAL SOLIDARITY CHRONICLE & FACT DOSSIER",
      "card_badge": "Single #03",
      "key_tempo_badge": "Key of D Minor // 78 BPM Solidarity Stomp",
      "key": "D Minor",
      "bpm": 78,
      "duration": "05:02",
      "release_year": 2026,
      "release_status": "Official Audio & Music Video Out Now",
      "title": "And the People Cry Out",
      "title_accent_split": [
            "And the People",
            "Cry Out"
      ],
      "subtitle": "A Trans-Continental Folk-Rock Dirge & Primary-Source Dossier on the $251 Trillion Squeeze, Corporate Sellers' Inflation, Media Capture, and the Awakening of the Global 99%",
      "location": "Sorrento Coast (Italy) • Indo-Gangetic Plain (India) • Lisbon • Madrid • Paris • Zvërnec (Albania) • Novi Sad & Belgrade (Serbia) • Sweden • US Heartland",
      "genre": "Somber Americana Funeral Dirge & Heavy Folk-Rock Solidarity March",
      "thesis": "When 1.5% of adults command $251 trillion—nearly half of all household wealth on Earth—while multinational conglomerates use every war and supply shock as a one-way ratchet on food, fuel, and shelter, the death of the middle class is not an accident of weather. Division by border and tongue is the oldest parlor trick of the manor, and as Serbian students just proved from the Novi Sad station vigil to parliament, the ledger turns the moment the 99% stand together.",
      "thesis_attribution": "— Macroeconomic & Civic Thesis • Inspired by Vanessa Wingårdh’s 'The Whole World Is Protesting' & Verified Against UBS, INSEE, and Primary Election Records",
      "dedication": "Special thanks to Swedish software engineer, researcher, and commentator Vanessa Wingårdh (@VanessaWingardh), whose investigative synthesis 'The Whole World Is Protesting' directly inspired this song and visual chronicle—and dedicated to the farmers, truckers, students, teachers, and working families standing shoulder to shoulder across borders.",
      "telemetry": [
            {
                  "label": "Top 1.5% Wealth",
                  "value": "$251T (48%)",
                  "color_cls": "text-retinal-400"
            },
            {
                  "label": "Corporate Reach",
                  "value": "185 / 195 Nations",
                  "color_cls": "text-amber-400"
            },
            {
                  "label": "Fronts Audited",
                  "value": "9 Global Flashpoints",
                  "color_cls": "text-white"
            },
            {
                  "label": "Ballot Breakthrough",
                  "value": "53% Serbia Win",
                  "color_cls": "text-emerald-400"
            }
      ],
      "hero_art_caption_label": "35mm Neo-Realist Witness • International Plaza",
      "hero_art_caption_title": "The Bard, Elena, Marcus & Rufus Overlooking the Global 99%",
      "media": {
            "youtubeVideoUrl": "https://youtu.be/0m2QBXRQli8",
            "inspirationVideoUrl": "https://youtu.be/8GLahLkHvxg",
            "inspirationVideoId": "8GLahLkHvxg",
            "inspirationTitle": "The Whole World Is Protesting",
            "inspirationCreator": "Vanessa Wingårdh (@VanessaWingardh)",
            "inspirationChannelUrl": "https://www.youtube.com/@VanessaWingardh",
            "spotifyUrl": "[INSERT_SPOTIFY_URL_OR_LEAVE_PENDING]",
            "appleMusicUrl": "[INSERT_APPLE_MUSIC_URL_OR_LEAVE_PENDING]",
            "amazonMusicUrl": "[INSERT_AMAZON_MUSIC_URL_OR_LEAVE_PENDING]"
      },
      "art_banner": "assets/art/and-the-people-cry-out-banner.webp",
      "art_square": "assets/art/and-the-people-cry-out-cover.webp",
      "art_alt": "Seen from behind on a wet stone rooftop parapet at twilight, The Shady River Bard holding a dreadnought acoustic guitar and duet vocalist Elena stand beside stationary Australian Shepherds Marcus and Rufus, looking down over a vast rain-slicked international plaza waving US, Scottish, Italian, French, and Indian flags around a 'NO KINGS' banner.",
      "pillar_badges": [
            "$251T Wealth Concentration",
            "Sellers' Inflation Ratchet",
            "Media Lens & Suppression",
            "Novi Sad to Parliament"
      ],
      "tags": [
            "WorkingClassSolidarity",
            "NoKings",
            "NoFarmersNoFood",
            "VanessaWingardh",
            "UBSWealthReport",
            "SellersInflation",
            "NoviSadToParliament",
            "Global99Percent"
      ],
      "quote": "And the people cry out from the fields and the factories\nFrom the tents in Madrid to the docks in the rain\n(And the people cry out!)\nYou have traded our blood for your luxury galleries\nAnd left us the rubble, the rust, and the chain\nWe are ninety-nine strong at the gates of the manor\nThe funeral is over, the sleepers awake\n(Hear the people cry out!)\nRaise the ledger of truth like a workingman's banner\nIt is time that you pay for the world that you take",
      "bards_story": [
            "This song and 43-scene neo-realist film were directly sparked by Swedish software developer and independent commentator Vanessa Wingårdh (@VanessaWingardh) and her remarkable 11-minute dispatch, 'The Whole World Is Protesting' (https://youtu.be/8GLahLkHvxg). Watching her connect a firsthand message from a friend staring at bare supermarket shelves on Italy's Sorrento coast to farmer blockades, housing tent cities, crumbling European classrooms, billionaire coastal land grabs, and a historic student election triumph in Serbia, it hit me like a bell: we are living through a single, connected global story—yet algorithmic feeds and billionaire-owned broadcast networks work overtime to keep each country convinced its misery is local and isolated.",
            "Follow the empirical ledger beneath the lyrics and the pattern becomes undeniable. According to the UBS Global Wealth Report, roughly 58 to 60 million adult US-dollar millionaires—just ~1.5% of the adult global population—now control 48% of all household wealth on Earth, approximately $251 trillion. For sixty years after World War II, working families across the West signed onto a simple, honest bargain: work hard, pay your taxes, and there will be a school without rats or falling plaster for your children, an affordable key to a front door, and a pension before your body breaks down. Today, France carries €3.6 trillion in public debt (119% of GDP, per INSEE) and answers with tens of billions in public-service austerity; Portuguese Prime Minister Luís Montenegro declares 55 properties ('55 imóveis' across urban residences and inherited rural plots) while scolding citizens 'not to be selfish' in a country where minimum wage is €920/month and 'affordable' rents hit €2,300; and even in Sweden—which abolished its wealth and inheritance taxes and ranks among the world's top ten nations for net wealth inequality—bank surveys show 1 in 4 citizens have less than 500 kronor (~$50 USD) left at the end of the month.",
            "Meanwhile, every geopolitical shock—from the 2020 pandemic blueprint to supply-chain crises in Ukraine, the Red Sea, and the Persian Gulf—functions as what UMass Amherst economist Isabella Weber calls 'sellers' inflation': multinational giants like Nestlé (operating in 185+ of 195 recognized countries) use headline emergencies to permanently ratchet up food and household margins, never lowering prices when input shocks fade. When Italian truckers and farmers parked their rigs across Campania in October 2026 because Gulf-war diesel spikes made harvesting a net loss, Berlusconi-controlled legacy television (MFE-MediaForEurope / Mediaset) barely showed northern Italians the bare southern shelves while TikTok slapped Community Guidelines warnings on eyewitness grocery videos. And when 550,000 French workers and students marched for crumbling schools, broadcast lenses zoomed tightly onto cracked glass at Christian Dior—headed by Delphine Arnault inside Bernard Arnault's ~$218 billion LVMH empire—refusing to pan two feet left to show 'TAXEZ LES RICHES' painted in red on the stone.",
            "Yet 'And the People Cry Out' is not a song of despair; it is a funeral for the illusion that our neighbors are our enemies, and a march for what comes next. On November 1, 2024, at 11:52 AM, a newly renovated concrete canopy at Serbia's Novi Sad railway station collapsed, killing 16 people and exposing systemic state-contracting corruption. University students stood up in the autumn rain, held silent 16-minute roadblocks across the nation, walked from town to town to speak directly with rural farmers beyond state media's reach, and on October 25, 2026, their youth-backed Student List won an absolute parliamentary majority (~53% of the vote on 69% turnout), ending fourteen years of entrenched rule. In our music video—shot in gritty 35mm AI photojournalism (and please pardon any AI-generated quirks on background protest signs!)—my duet partner Elena and I stand strictly with our backs to the camera on wet slate rooftops beside our silent Australian Shepherd witnesses Marcus and Rufus, because this song belongs to the plaza below."
      ],
      "musical_direction": {
            "summary": "Somber Americana Funeral Dirge building into a Heavy Folk-Rock & Country-Blues Solidarity Stomp in D Minor (76–78 BPM, 05:02).",
            "details": "Opens with a close-mic'd fingerpicked acoustic guitar, mournful solo cello dirge, and slow muffled work-boot and floor-tom heartbeat. Builds across verses with octave mandolin, weeping blues harmonica, and aggressive power-folk banjo before igniting into a full male/female rock harmony chorus (62% duet unison, 29% weathered baritone, 8.9% soaring female lead), a hushed spoken-word Bridge ('Every war is a reason to ratchet the price'), a searing electric-guitar and sawed-cello duel, European accordion (3:58) and brass swells (4:09), and a stripped acoustic D-minor ultimatum: 'Pay your share of the table. Or tend it yourself.'"
      },
      "inspirationDispatch": {
            "badge": "THE SPARK // INVESTIGATIVE INSPIRATION & SOURCE CROSSWALK",
            "title": "Inspired by Vanessa Wingårdh’s “The Whole World Is Protesting”",
            "creator": "Vanessa Wingårdh",
            "handle": "@VanessaWingardh",
            "videoUrl": "https://youtu.be/8GLahLkHvxg",
            "videoId": "8GLahLkHvxg",
            "channelUrl": "https://www.youtube.com/@VanessaWingardh",
            "duration": "10:56",
            "summary": "When Swedish software engineer and commentator Vanessa Wingårdh published 'The Whole World Is Protesting,' she connected dots that legacy newsrooms deliberately keep in separate silos: an expat friend's empty supermarket shelves on Italy's Sorrento coast, Berlusconi media consolidation, Portugal's 55-property Prime Minister, Spain's housing encampments, France's €3.6 trillion debt and the LVMH storefront camera trick, Jared Kushner's $1.4B Albanian coastal resort deal, corporate crisis-ratcheting across 185+ countries, Bilderberg secrecy, and Serbia's two-year march from the Novi Sad station tragedy to parliamentary victory. Every stanza of 'And the People Cry Out' was forged as a musical mirror to her report.",
            "crosswalk": [
                  {
                        "vanessa_ts": "00:00 – 01:47",
                        "vanessa_segment": "Sorrento bare grocery aisles, Iran/Gulf diesel spike, parked Italian trucks/tractors ('No Farmers, No Food'), TikTok Community Guidelines flags & Silvio Berlusconi's €6B media empire.",
                        "song_section": "Intro & Verse 1 (0:00 – 1:09)",
                        "lyric_match": "The diesel costs more than the wheat in the furrow / From the plains of the Ganges to the Sorrento coast... While the family who owns all the television screens / Tells the north that the south still has plenty of apples"
                  },
                  {
                        "vanessa_ts": "01:47 – 03:49",
                        "vanessa_segment": "Portugal's PM declaring 55 properties, hiding transparency records & calling critics 'selfish' against €920 minimum wage vs. €2,300 rents; Madrid & Málaga rent tent cities; Albania's Zvërnec/Sazan luxury resort vs. pink flamingos.",
                        "song_section": "Verse 2 & Chorus (1:09 – 2:14)",
                        "lyric_match": "Now the prime minister counts up his fifty-five houses / And calls us all greedy for wanting a key... And the people cry out from the fields and the factories / From the tents in Madrid to the docks in the rain"
                  },
                  {
                        "vanessa_ts": "03:49 – 05:24",
                        "vanessa_segment": "France's €3.6T debt (119% GDP), austerity cuts, Paris students blockading crumbling rat-infested schools, 550,000 marching for the 60-year social contract, and cameras zooming on Delphine/Bernard Arnault's ($218B) Dior window instead of 'TAX THE RICH' on stone.",
                        "song_section": "Verse 3 (2:14 – 2:59)",
                        "lyric_match": "In the streets of old Paris the youth are assembling / Where the plaster falls down on the desks in the cold... So they point every lens at a cracked piece of glass / Refusing to pan where the workingmen pass / And the words on the stone where the paint is still red"
                  },
                  {
                        "vanessa_ts": "05:24 – 09:05",
                        "vanessa_segment": "Sweden's #7 wealth-inequality paradox (1 in 4 under 500 SEK left), UBS data (1.5% hold 48% / $251T), Bilderberg closed-door corporate governance, and Nestlé (185/195 countries) using COVID & wars to permanently ratchet prices.",
                        "song_section": "Verse 3 & Spoken Bridge (2:30 – 3:14)",
                        "lyric_match": "With two hundred-fifty-one trillion in gold... [Spoken] Every war is a reason to ratchet the price. / Every crisis a harvest for the men at the top."
                  },
                  {
                        "vanessa_ts": "09:05 – 10:56",
                        "vanessa_segment": "Serbia's Novi Sad railway canopy collapse (16 killed), two years of student-led anti-corruption vigils, and the historic parliamentary majority proving the 99% win when they refuse engineered division.",
                        "song_section": "Bridge Eruption & Outro (3:14 – 5:02)",
                        "lyric_match": "But remember the station where the canopy fell! / When the students stood up in the autumn alone... And they marched into parliament and took back their own! ... Pay your share of the table. Or tend it yourself."
                  }
            ]
      },
      "pillars_section": {
            "badge": "Interactive Framework I // 3-Pillar Macroeconomic & Media Matrix",
            "title": "The Extraction Architecture & The Awakening",
            "intro": "Across nine countries and three continents, seemingly separate cost-of-living protests trace back to the same three structural mechanisms: extreme asset concentration eroding the post-war social contract, crisis-driven corporate price ratcheting shielded by billionaire media capture, and a rising civic refusal to let culture-war wedges divide the 99%."
      },
      "pillars": [
            {
                  "number": "I",
                  "code": "PILLAR I // THE BROKEN BARGAIN",
                  "title": "The $251 Trillion Oligarchy & The Evaporating Social Contract",
                  "stat_highlight": "1.5% Own 48%",
                  "stat_sub": "~$251 Trillion held by top adult USD millionaires (UBS Global Wealth Report)",
                  "icon": "fa-solid fa-scale-unbalanced",
                  "summary": "For sixty years, working families traded decades of labor and honest taxation for public schools, reachable housing, and a dignified pension. Today, untaxed asset compounding has gutted public balance sheets while pricing workers out of shelter.",
                  "analysis": "UBS global wealth telemetry confirms that roughly 58–60 million adults (~1.5% of the adult world) hold 48% of global household wealth (~$251T). Meanwhile, sovereign states starve public goods to service debt—France's public debt hit €3.6T (119% of GDP, per INSEE), prompting school and service cuts, while Sweden's abolition of wealth and inheritance taxes produced top-tier wealth concentration alongside 1 in 4 citizens ending the month with under 500 SEK (~$50).",
                  "lyric_echo": "We signed on the line for the honest man's bargain / Sixty years at the wheel for a roof and a bed"
            },
            {
                  "number": "II",
                  "code": "PILLAR II // THE RATCHET & THE LENS",
                  "title": "Corporate 'Sellers' Inflation' & Billionaire Media Framing",
                  "stat_highlight": "185 / 195 Nations",
                  "stat_sub": "Multinational conglomerate reach (Nestlé) & coordinated crisis margin expansion",
                  "icon": "fa-solid fa-video-slash",
                  "summary": "Since 2020, global conglomerates have discovered that wars, bottlenecks, and energy shocks allow synchronized price hikes that never come back down—while billionaire-owned media hides the root cause.",
                  "analysis": "Documented by economist Isabella Weber as 'sellers' inflation,' firms spanning 185+ nations use geopolitical shocks in Ukraine, the Red Sea, and the Persian Gulf to expand profit margins over essential food and staples. When citizens protest, Berlusconi-built media networks in Italy underplay southern shortages, social algorithms throttle eyewitness clips, and French cameras fixate on cracked glass at Bernard & Delphine Arnault's ($218B) Dior boutique rather than panning to 'TAXEZ LES RICHES' on the wall.",
                  "lyric_echo": "Every war is a reason to ratchet the price. / Every crisis a harvest for the men at the top."
            },
            {
                  "number": "III",
                  "code": "PILLAR III // CIVIC SOLIDARITY",
                  "title": "From Novi Sad to Parliament: Refusing the Engineered Wedge",
                  "stat_highlight": "53% Majority",
                  "stat_sub": "Serbia's youth-led Student List wins ~140/250 seats on 69% turnout (Oct 25, 2026)",
                  "icon": "fa-solid fa-landmark-flag",
                  "summary": "Whenever working people compare notes, oligarchs deploy division by border, language, and scapegoating. Yet when students, farmers, and workers unite around material accountability, entrenched machines fall.",
                  "analysis": "After 16 commuters died beneath the collapsed Novi Sad railway station canopy on November 1, 2024, Serbian university students refused partisan co-optation—holding daily 11:52 AM silent vigils and marching on foot to rural villages bypassed by state TV. On October 25, 2026, their Student List won an absolute parliamentary majority (~53%), proving alongside Indian and Italian farmers ('No Farmers, No Food') that solidarity converts grief into democratic power.",
                  "lyric_echo": "They turned all their grief into a tolling of the bell / And they marched into parliament and took back their own!"
            }
      ],
      "globalFlashpoints": [
            {
                  "id": "global-wealth",
                  "num": "01",
                  "category": "wealth",
                  "region": "Global Wealth & Governance",
                  "title": "The $251 Trillion Apex & Closed-Door Oligarchy",
                  "metric": "1.5% Hold 48% ($251T)",
                  "still": "assets/stills/01-wealth-vault.webp",
                  "still_caption": "Scene S24 • Ornate bronze doors of European financial citadels",
                  "vanessa_ts": "06:34 – 07:45",
                  "bard_ts": "02:30 – 02:44",
                  "lyric": "And the men in the boardrooms of Europe are trembling / With two hundred-fifty-one trillion in gold",
                  "facts": "According to the UBS Global Wealth Report (2025/2026 editions), global household wealth surpassed $510 trillion, with roughly 58–60 million adult USD millionaires—representing approximately 1.5% to 1.6% of the global adult population—controlling 48% to 48.4% of all net household wealth (~$250.6–$251 trillion). Parallel to this asset pyramid sits transnational elite coordination: at annual Bilderberg Meetings governed by strict Chatham House non-attribution rules, unelected defense, banking, pharma, and Big Tech executives routinely outnumber elected public officials without public minutes or press oversight.",
                  "sources": [
                        {
                              "label": "UBS Global Wealth Report (Official Research Portal)",
                              "url": "https://www.ubs.com/global/en/wealthmanagement/insights/global-wealth-report.html"
                        },
                        {
                              "label": "Bilderberg Meetings Official Participant & Chatham House Rules Archive",
                              "url": "https://www.bilderbergmeetings.org/"
                        }
                  ]
            },
            {
                  "id": "italy-sorrento",
                  "num": "02",
                  "category": "food",
                  "region": "Southern Italy • Campania & Sorrento Coast",
                  "title": "The Diesel Strike, Hollowed Grocery Aisles & Mediaset Capture",
                  "metric": "€150M–€200M Emergency Fuel Decree",
                  "still": "assets/stills/02-sorrento-blockade.webp",
                  "still_secondary": "assets/stills/02b-grocery-chapel.webp",
                  "still_caption": "Scene S02 & S06 • Sorrento cliffside tractor blockade & bare Campanian supermarket aisles",
                  "vanessa_ts": "00:00 – 01:47",
                  "bard_ts": "00:09 – 01:09",
                  "lyric": "The grocery aisles stand like a hollowed-out chapel / While the family who owns all the television screens / Tells the north that the south still has plenty of apples",
                  "facts": "In mid-to-late October 2026, surging diesel prices driven by Persian Gulf / Strait of Hormuz conflict pushed freight and harvesting costs past farmgate crop returns across southern Italy. Under the banner 'No Agricoltori, No Cibo' ('No Farmers, No Food'), truckers, farmers, and fishermen blockaded ports and highways across Campania (Naples, Salerno, Sorrento), Apulia, Calabria, and Sicily—leaving Sorrento supermarket shelves stripped bare, halting pasta makers (Rummo, La Molisana) and Stellantis plants, and forcing Rome to pass emergency fuel tax-credit decrees. Yet many northern Italians remained unaware because Italy's largest private TV group—MFE-MediaForEurope (formerly Mediaset, built by late three-time PM Silvio Berlusconi and controlled via Fininvest alongside a ~€6B family fortune by Pier Silvio and Marina Berlusconi)—minimized coverage while TikTok flagged citizen grocery footage under 'Community Guidelines.'",
                  "sources": [
                        {
                              "label": "MFE-MediaForEurope / Fininvest Ownership & Italian Broadcast Concentration (RSF Italy Profile)",
                              "url": "https://rsf.org/en/country/italy"
                        },
                        {
                              "label": "Coldiretti & Italian Agrarian/Haulier Fuel Cost Mobilizations",
                              "url": "https://www.coldiretti.it/"
                        }
                  ]
            },
            {
                  "id": "india-ganges",
                  "num": "03",
                  "category": "food",
                  "region": "India • Indo-Gangetic Plain",
                  "title": "Plains of the Ganges & The Global Birth of 'No Farmers, No Food'",
                  "metric": "Millions Mobilized for MSP Parity",
                  "still": "assets/stills/03-ganges-farmers.webp",
                  "still_caption": "Scene S03 • Stationary tractor caravan along wheat fields of the Ganges plain ('किसान एकता')",
                  "vanessa_ts": "00:46 – 01:05",
                  "bard_ts": "00:19 – 00:39",
                  "lyric": "The diesel costs more than the wheat in the furrow / From the plains of the Ganges to the Sorrento coast",
                  "facts": "Across the fertile Indo-Gangetic Plain (Punjab, Haryana, and Uttar Pradesh), farmer unions under the Samyukt Kisan Morcha (2020–2021 historic Delhi siege and renewed 2024–2026 'Dilli Chalo' highway mobilizations) confronted the exact input-price vise squeezing European smallholders: soaring diesel, fertilizer, and seed costs paired with corporate market deregulation and the absence of a legally guaranteed Minimum Support Price (MSP) benchmarked to the Swaminathan C2+50% cost formula. Their rallying cry—'No Farmers, No Food'—became the transnational slogan painted on tractor convoys from Amritsar to Brussels and Sorrento.",
                  "sources": [
                        {
                              "label": "PRS Legislative Research — Swaminathan Commission MSP (C2+50%) & Indian Farm Input Economics",
                              "url": "https://prsindia.org/"
                        },
                        {
                              "label": "FAO Global Food Price & Agricultural Input Cost Monitoring",
                              "url": "https://www.fao.org/worldfoodsituation/foodpricesindex/en/"
                        }
                  ]
            },
            {
                  "id": "portugal-housing",
                  "num": "04",
                  "category": "housing",
                  "region": "Portugal • Lisbon & Porto",
                  "title": "The Prime Minister's 55 Properties & Bundles of Keys in the Street",
                  "metric": "55 Declared Properties vs. €920 Min. Wage",
                  "still": "assets/stills/04-portugal-housing.webp",
                  "still_caption": "Scene S11 • Lisbon housing demonstration ('HABITAÇÃO É UM DIREITO') beneath darkened luxury flats",
                  "vanessa_ts": "01:47 – 02:38",
                  "bard_ts": "01:26 – 01:44",
                  "lyric": "Now the prime minister counts up his fifty-five houses / And calls us all greedy for wanting a key",
                  "facts": "Filings with Portugal's Entidade para a Transparência revealed that Prime Minister Luís Montenegro declared 55 real-estate assets ('55 imóveis'—comprising 6 urban residences/apartments in Espinho, Lisbon, Bragança, and Resende alongside 49 inherited rural plots, 'prédios rústicos') and sought court/registry restrictions shielding property details from public scrutiny, alongside controversy over his family consultancy Spinumviva. While advancing landlord-friendly tax breaks and faster eviction laws, Montenegro urged critics 'não sejam egoístas' ('don't be selfish'). In response, tens of thousands in the 'Casa Para Viver' movement marched through Lisbon and Porto shaking house keys—noting that officials label €2,300/month rents 'moderate' while Portugal's 2026 statutory minimum wage is €920/month.",
                  "sources": [
                        {
                              "label": "Entidade para a Transparência (Constitutional Court of Portugal Asset Declarations)",
                              "url": "https://entidadetransparencia.tribunalconstitucional.pt/"
                        },
                        {
                              "label": "PORDATA / INE Portugal — Statutory Minimum Wage & Median Urban Rent Statistics",
                              "url": "https://www.pordata.pt/"
                        }
                  ]
            },
            {
                  "id": "spain-madrid",
                  "num": "05",
                  "category": "housing",
                  "region": "Spain • Madrid, Málaga & Barcelona",
                  "title": "Tent Cities on the Plaza & 'La Vivienda No Es Un Negocio'",
                  "metric": "Up to 80–100% of Youth Wages Spent on Rent",
                  "still": "assets/stills/05-madrid-tents.webp",
                  "still_caption": "Scene S14 • Madrid & Málaga housing tent encampment ('LA VIVIENDA NO ES UN NEGOCIO')",
                  "vanessa_ts": "02:38 – 03:02",
                  "bard_ts": "01:44 – 01:55",
                  "lyric": "And the people cry out from the fields and the factories / From the tents in Madrid to the docks in the rain",
                  "facts": "Across Madrid, Málaga, Barcelona, and the Canary Islands, tenants' unions (Sindicato de Inquilinas / 'Málaga para vivir') launched mass marches and pitched symbolic protest tent encampments ('acampadas por el derecho a la vivienda') after institutional private-equity landlords ('fondos buitre'), golden-visa speculation, and short-term tourist conversions drove urban rents to consume 60% to 100% of an average young worker's net paycheck. Demonstrators demanded indefinite lease protections, caps on speculative bulk purchases, and the reclamation of empty investment apartments.",
                  "sources": [
                        {
                              "label": "Banco de España & INE Housing Affordability Reports",
                              "url": "https://www.bde.es/"
                        },
                        {
                              "label": "Sindicato de Inquilinas e Inquilinos de Madrid",
                              "url": "https://www.inquilinato.org/"
                        }
                  ]
            },
            {
                  "id": "france-paris",
                  "num": "06",
                  "category": "schools",
                  "region": "France • Paris & Nationwide",
                  "title": "€3.6 Trillion Debt, Falling Classroom Plaster & The $218B Dior Lens",
                  "metric": "€3.6T Debt (119% GDP) • 550,000 Marching",
                  "still": "assets/stills/06-paris-lvmh-lens.webp",
                  "still_secondary": "assets/stills/06b-paris-classroom.webp",
                  "still_caption": "Scene S26 & S22 • 'TAXEZ LES RICHES' beside luxury boutique glass & crumbling Paris classroom plaster",
                  "vanessa_ts": "03:49 – 05:24",
                  "bard_ts": "02:14 – 02:59",
                  "lyric": "So they point every lens at a cracked piece of glass / On a boulevard storefront of velvet and thread / Refusing to pan where the workingmen pass / And the words on the stone where the paint is still red",
                  "facts": "France's national statistical institute (INSEE) reported public debt climbing to roughly €3.6 trillion (~119% of GDP), triggering multi-billion-euro austerity budgets (mirrored in Belgium and Austria) that hit public education and social services hardest. Students blockaded Paris lycées and universities over unheated rooms, falling ceiling plaster, flooding, and rats, joining ~550,000 union marchers nationwide defending the post-war bargain of taxes for schools and pensions. Yet legacy TV cameras zoomed tightly onto a few dozen black-bloc vandals cracking windows at Christian Dior, Burberry, and Foot Locker—refusing to pan slightly to show 'TAXEZ LES RICHES' painted on the stone wall. Christian Dior CEO Delphine Arnault is the daughter of LVMH Chair Bernard Arnault (~$218 billion family fortune), who personally holds stakes in major French news outlets including Les Échos and Le Parisien.",
                  "sources": [
                        {
                              "label": "INSEE (Institut national de la statistique et des études économiques) — Maastricht Public Debt & GDP",
                              "url": "https://www.insee.fr/en/accueil"
                        },
                        {
                              "label": "Forbes Real-Time Billionaires Profile — Bernard Arnault & Family (LVMH / Christian Dior)",
                              "url": "https://www.forbes.com/profile/bernard-arnault/"
                        }
                  ]
            },
            {
                  "id": "albania-coast",
                  "num": "07",
                  "category": "housing",
                  "region": "Albania • Zvërnec & Sazan Island (Vjosa-Narta)",
                  "title": "Carving Up the Protected Coast: The $1.4B 'Flamingo Revolution'",
                  "metric": "$1.4B Luxury Enclave on Protected Wetland",
                  "still": "assets/stills/07-albania-coast.webp",
                  "still_caption": "Scene S31 • Coastal residents & students defending the Adriatic shore ('BREGDETI NUK ËSHTË NË SHITJE')",
                  "vanessa_ts": "03:02 – 03:49",
                  "bard_ts": "03:28 – 03:42",
                  "lyric": "You want us divided by border and tongue / While you carve up the coast for a billionaire's view",
                  "facts": "Along Albania's southern Adriatic and Ionian coastline, Affinity Partners—the private equity firm founded by Jared Kushner—secured preliminary 'Strategic Investor' approval for a $1.4 billion ultra-luxury resort project spanning Sazan Island and the Zvërnec peninsula inside the Vjosa-Narta Protected Landscape, a vital sanctuary for over 3,000–10,000 greater pink flamingos, Dalmatian pelicans, and endangered Mediterranean monk seals. In February 2024, Prime Minister Edi Rama's parliament amended Law No. 81/2017 on Protected Areas to allow five-star luxury complexes inside protected habitats despite warnings from the Bern Convention and European Parliament, while Zvërnec residents alleged ancestral coastal land seizures through falsified title records—igniting youth and environmental demonstrations dubbed the 'Flamingo Revolution.'",
                  "sources": [
                        {
                              "label": "Council of Europe (Bern Convention) — Vjosa-Narta Protected Area & Airport/Resort Case File",
                              "url": "https://www.coe.int/en/web/bern-convention"
                        },
                        {
                              "label": "EuroNatur & PPNEA Conservation Dossier on Vjosa-Narta & Albanian Protected Areas Law",
                              "url": "https://www.euronatur.org/en/"
                        }
                  ]
            },
            {
                  "id": "sellers-inflation",
                  "num": "08",
                  "category": "wealth",
                  "region": "Sweden & Transnational Supply Chains",
                  "title": "Sweden's 500-Kronor Paradox, Nestlé (185 Nations) & 'Sellers' Inflation'",
                  "metric": "1 in 4 Under 500 SEK • 185/195 Countries",
                  "still": "assets/stills/08-war-price-ratchet.webp",
                  "still_caption": "Scene S27 • Diesel, milk, and bread price totem beside Strait tanker crisis broadcast",
                  "vanessa_ts": "05:24 – 09:05",
                  "bard_ts": "02:59 – 03:14",
                  "lyric": "Every war is a reason to ratchet the price. / Every crisis a harvest for the men at the top.",
                  "facts": "Even in Nordic social democracies, asset deregulation has hollowed household buffers: having abolished wealth, inheritance, gift, and national property taxes, Sweden ranks among the most unequal countries on Earth in net wealth distribution (top-10 globally in billionaire-per-capita and wealth Gini metrics), while Swedish consumer banking surveys report roughly 1 in 4 residents have less than 500 SEK (~$50 USD) left after monthly bills. Globally, UMass Amherst economist Isabella Weber demonstrated how dominant conglomerates—exemplified by Nestlé, selling essentials in 185–188 of 195 countries—use overlapping crises (COVID-19, Ukraine grain/energy shocks, Red Sea shipping, Persian Gulf oil, DRC minerals, Taiwan semiconductors) as implicit coordination signals to hike prices beyond input costs ('sellers' inflation'), locking in permanently higher price floors.",
                  "sources": [
                        {
                              "label": "Isabella Weber & Evan Wasner (UMass Amherst PERI) — 'Sellers’ Inflation, Profits and Conflict'",
                              "url": "https://peri.umass.edu/"
                        },
                        {
                              "label": "Nestlé Annual Review — Global Geographic Footprint (185+ Countries)",
                              "url": "https://www.nestle.com/investors/annual-report"
                        }
                  ]
            },
            {
                  "id": "serbia-novi-sad",
                  "num": "09",
                  "category": "ballot",
                  "region": "Serbia • Novi Sad to Belgrade Parliament",
                  "title": "Where the Canopy Fell: Two Years of Grief Turned Into a 53% Majority",
                  "metric": "16 Lives Mourned → 53% Parliamentary Majority",
                  "still": "assets/stills/09-novi-sad-serbia.webp",
                  "still_caption": "Scene S29 • Silent candlelight and white-rose vigil outside Novi Sad railway station",
                  "vanessa_ts": "09:05 – 10:56",
                  "bard_ts": "03:14 – 03:28",
                  "lyric": "But remember the station where the canopy fell! / When the students stood up in the autumn alone / They turned all their grief into a tolling of the bell / And they marched into parliament and took back their own!",
                  "facts": "At 11:52 AM on November 1, 2024, the newly reconstructed concrete exterior canopy of the Novi Sad main railway station collapsed, killing 16 people (14 at the scene and 2 later in hospital) just months after officials boasted of its state-backed renovation. Refusing to let the deaths be buried by state-aligned tabloids, students occupied more than 60 university faculties across Serbia, observed daily silent 11:52 AM traffic standstills (one minute per victim), marched hundreds of kilometers on foot into rural towns to break the information blockade, and forced Prime Minister Miloš Vučević's resignation. Two years later, in Serbia's October 25, 2026 parliamentary election, the civic 'Student List' ('Studentska lista') won a historic absolute majority—capturing ~53% of the popular vote (~140–141 of 250 seats) on record ~69% turnout and peacefully ending the 14-year dominance of Aleksandar Vučić's SNS coalition.",
                  "sources": [
                        {
                              "label": "CRTA (Center for Research, Transparency and Accountability — Serbia Election & Civic Observation)",
                              "url": "https://crta.rs/en/"
                        },
                        {
                              "label": "European Parliament Briefing — Novi Sad Canopy Collapse & Rule-of-Law Protests in Serbia",
                              "url": "https://www.europarl.europa.eu/thinktank/en/home"
                        }
                  ]
            }
      ],
      "timeline_section": {
            "badge": "Interactive Framework III // 4-Act Composition & Film Architecture",
            "title": "From Funeral Dirge to the Banquet Table (0:00 – 5:02)",
            "intro": "Trace the four musical and cinematic movements of 'And the People Cry Out' across all 43 35mm neo-realist scenes—evolving from a lone acoustic guitar and weeping cello into an international solidarity stomp."
      },
      "timeline": [
            {
                  "year": "0:00 – 1:44",
                  "era_badge": "ACT I // THE HOLLOWED-OUT CHAPEL",
                  "title": "Sorrento Rigs, Ganges Furrows & The 60-Year Bargain",
                  "location": "Rooftop Parapet • Sorrento Coast • Ganges Plains • Lisbon",
                  "icon": "fa-solid fa-tractor",
                  "narrative": "Opening at ~78 BPM in D Minor with a sparse fingerpicked acoustic guitar, mournful cello dirge, and slow boot-stomp heartbeat, The Shady River Bard and Elena stand with their backs to the lens beside silent Australian Shepherds Marcus and Rufus. Below them unfold parked tractors on the Sorrento cliffs ('NO AGRICOLTORI, NO CIBO'), Indian farmer convoys ('किसान एकता'), bare supermarket chapels, Berlusconi-era television screens, and 55 darkened luxury apartments in Lisbon while Gulf oil shocks send the invoice due.",
                  "artifact_note": "Acoustic Telemetry: Close-mic'd dreadnought guitar, low cello drone, double bass & weeping blues harmonica"
            },
            {
                  "year": "1:44 – 2:59",
                  "era_badge": "ACT II // THE MANOR GATES & THE LENS",
                  "title": "Madrid Tent Cities, Crumbling Paris Desks & The $251T Vault",
                  "location": "Madrid Plazas • Rain-Soaked Docks • Paris Lycées & Boulevards",
                  "icon": "fa-solid fa-camera",
                  "narrative": "Heavy tribal floor toms and distorted bass ignite Chorus 1 as male baritone and soaring female rock harmony unite ('We are ninety-nine strong at the gates of the manor'), followed by an aggressive power-folk banjo and cello duel. Verse 3 moves into freezing Paris classrooms where ceiling plaster falls onto wooden desks while corporate boardrooms guard $251 trillion—exposing broadcast cameras that fixate on cracked luxury boutique glass while refusing to pan two feet left to 'TAXEZ LES RICHES' painted in red on stone.",
                  "artifact_note": "Acoustic Telemetry: Male/female unison chorus (62% duet profile), industrial-folk banjo lead & snare rimshots"
            },
            {
                  "year": "2:59 – 3:58",
                  "era_badge": "ACT III // THE RATCHET & THE CANOPY",
                  "title": "Sellers' Inflation, Novi Sad's Vigil & The March Into Parliament",
                  "location": "Novi Sad Station • Belgrade Parliament • Zvërnec Coast (Albania)",
                  "icon": "fa-solid fa-bell",
                  "narrative": "The arrangement drops to a single pulsing cello note and marching floor tom for the hushed spoken-word indictment: 'Every war is a reason to ratchet the price. Every crisis a harvest for the men at the top.' Crashing cymbals and overdriven electric guitars erupt on 'But remember the station where the canopy fell!'—honoring the 16 victims of Novi Sad, Serbia's two-year student vigil, their October 25, 2026 parliamentary triumph, and Albanian villagers defending their coast ('BREGDETI NUK ËSHTË NË SHITJE'), culminating in a searing electric-guitar and sawed-cello duel.",
                  "artifact_note": "Acoustic Telemetry: Hushed spoken bridge, high-tenor/female rock eruption & electric guitar vs. sawed cello duel"
            },
            {
                  "year": "3:58 – 5:02",
                  "era_badge": "ACT IV // THE BANQUET TABLE ULTIMATUM",
                  "title": "\"Pay Your Share of the Table. Or Tend It Yourself.\"",
                  "location": "Scottish Highlands • Tuscany • US Heartland • Rain-Soaked Banquet Table",
                  "icon": "fa-solid fa-wheat-awn",
                  "narrative": "Backed by a European accordion swell (3:58) and brass surge (4:09), the final chorus brings international flags billowing across the twilight plaza beneath 'PAY YOUR SHARE — NO KINGS.' In the stripped D-minor Outro, heavy drums fall away to leave lone acoustic guitar, solemn cello, and marching boots—closing on a rain-slicked street where farmers, truckers, and students stand with crossed arms beside a long wooden banquet table and an empty gilded chair bearing a single plate marked 'BILL DUE.'",
                  "artifact_note": "Acoustic Telemetry: Accordion (3:58) & horn swells (4:09) stripping back to lone D-minor guitar & cello fade"
            }
      ],
      "poeticsCallout": {
            "badge": "EDITORIAL & STUDIO CALLOUT // WITNESS FRAMING, MORAL ARITHMETIC & AI NEO-REALISM",
            "title": "Backs to the Camera, The Empty Gilded Chair & Candid 35mm Studio Notes",
            "chorus_couple": "No farmers, no food / No workers, no wealth / Pay your share of the table. / Or tend it yourself.",
            "intro": "Designing 'And the People Cry Out' required matching the moral gravity of real-world working-class movements without centering ourselves as saviors or smoothing away the gritty texture of documentary street photography. Three deliberate artistic and studio choices define the release:",
            "pillars": [
                  {
                        "number": "01",
                        "title": "The Rooftop Witness Rule (Why Our Backs Face the Lens)",
                        "body": "Across all 43 scenes of the official video, whenever The Shady River Bard and duet partner Elena appear on wet slate rooftops alongside Marcus (Black Tri-Color Australian Shepherd) and Rufus (Blue Merle Australian Shepherd), our backs are strictly to the camera—and Marcus and Rufus sit completely still as silent sentinels. Only 5 scenes (11.6%) feature on-camera singing, performed by frontline crowd organizers Mateo and Claire. A solidarity anthem belongs to the plaza, never the performer's ego."
                  },
                  {
                        "number": "02",
                        "title": "The Moral Arithmetic of 'Or Tend It Yourself'",
                        "body": "Financialization convinces boardrooms that wealth originates in tickers, derivatives, and Chatham House salons. The Outro strips $251 trillion of paper claims back to physical first principles: diesel, wheat in the furrow, Tuscan olive trees, freight docks, classrooms, and bread. Oligarchs cannot eat a stock buyback or harvest grain with an algorithm. Either capital pays its honest share of the social contract, or it can pick up the wrench and tend the furrow itself."
                  },
                  {
                        "number": "03",
                        "title": "Candid Studio Note on 35mm AI Street Signs",
                        "body": "As noted candidly in our YouTube description—'please pardon any AI-generated misspellings on the multilingual protest signs!'—rendering crowds across nine nations in gritty 35mm photojournalistic grain pushed image-to-video synthesis to its edge. While hero banners in Italian ('NO AGRICOLTORI, NO CIBO'), Hindi ('किसान एकता'), Portuguese ('HABITAÇÃO É UM DIREITO'), Spanish ('LA VIVIENDA NO ES UN NEGOCIO'), French ('TAXEZ LES RICHES'), and Albanian ('BREGDETI NUK ËSHTË NË SHITJE') locked cleanly, background placards occasionally carry imperfect AI lettering—left untouched rather than sterilely airbrushed."
                  }
            ]
      },
      "clean_lyrics_stanzas": [
            "[Verse 1]\nThe diesel costs more than the wheat in the furrow\nFrom the plains of the Ganges to the Sorrento coast\nThe rigs are all parked on the shoulder til tomorrow\nAnd the middle-class dream is a ledger and a ghost\nThe grocery aisles stand like a hollowed-out chapel\nWhile the family who owns all the television screens\nTells the north that the south still has plenty of apples\nAnd the algorithm buries what the camera really means",
            "[Verse 2]\nWe signed on the line for the honest man's bargain\nSixty years at the wheel for a roof and a bed\nA school for the kids without rats in the garden\nAnd a pension to keep us when the iron runs red\nNow the prime minister counts up his fifty-five houses\nAnd calls us all greedy for wanting a key\nWhile the war in the gulf sends the oil to the clouds\nAnd the invoice comes due for the land of the free",
            "[Chorus]\nAnd the people cry out from the fields and the factories\nFrom the tents in Madrid to the docks in the rain\n(And the people cry out!)\nYou have traded our blood for your luxury galleries\nAnd left us the rubble, the rust, and the chain\nWe are ninety-nine strong at the gates of the manor\nThe funeral is over, the sleepers awake\n(Hear the people cry out!)\nRaise the ledger of truth like a workingman's banner\nIt is time that you pay for the world that you take",
            "[Instrumental Interlude]",
            "[Verse 3]\nIn the streets of old Paris the youth are assembling\nWhere the plaster falls down on the desks in the cold\nAnd the men in the boardrooms of Europe are trembling\nWith two hundred-fifty-one trillion in gold\nSo they point every lens at a cracked piece of glass\nOn a boulevard storefront of velvet and thread\nRefusing to pan where the workingmen pass\nAnd the words on the stone where the paint is still red",
            "[Bridge]\nEvery war is a reason to ratchet the price.\nEvery crisis a harvest for the men at the top.\nBut remember the station where the canopy fell!\nWhen the students stood up in the autumn alone\nThey turned all their grief into a tolling of the bell\nAnd they marched into parliament and took back their own!\nYou want us divided by border and tongue\nWhile you carve up the coast for a billionaire's view\n(Stand together as one!)\nFrom the old river valleys to the songs of the young\nThe bill for the century is coming for you!",
            "[Guitar and Cello Duel]",
            "[Chorus]\nAnd the people cry out from the fields and the factories\nFrom the tents in Madrid to the docks in the rain\n(And the people cry out!)\nYou have traded our blood for your luxury galleries\nAnd left us the rubble, the rust, and the chain\nWe are ninety-nine strong at the gates of the manor\nThe funeral is over, the sleepers awake\n(Hear the people cry out!)\nRaise the ledger of truth like a workingman's banner\nIt is time that you pay for the world that you take",
            "[Outro]\nFrom the hills of the Highlands to the Tuscan olive trees\nFrom the heartland of America to the eastern seas\n(And the people cry out)\nNo farmers, no food\nNo workers, no wealth\nPay your share of the table.\nOr tend it yourself."
      ],
      "copyright_notice": "© 2026 The Shady River Bard / Shady River Homestead LLC. All rights reserved."
    },

    // =========================================================================
    // SINGLE 04: THE SEVEN MEN OF GLENMORISTON
    // Permalink: https://theshadyriverbard.com/singles/the-seven-men-of-glenmoriston/
    // =========================================================================
    {
      "id": "the-seven-men-of-glenmoriston",
      "slug": "the-seven-men-of-glenmoriston",
      "permalink": "https://theshadyriverbard.com/singles/the-seven-men-of-glenmoriston/",
      "relative_url": "the-seven-men-of-glenmoriston/",
      "number": 4,
      "number_padded": "04",
      "badge": "STANDALONE SINGLE 04 // 1746 HIGHLAND SANCTUARY & HISTORICAL DOSSIER",
      "card_badge": "Single #04",
      "key_tempo_badge": "Key of D Minor / D Dorian // 103 BPM Celtic Folk-Rock",
      "key": "D Minor / D Dorian",
      "bpm": 103,
      "duration": "06:20",
      "release_year": 2026,
      "release_status": "Official Historical Dossier Live • YouTube Music Video Uploading Soon",
      "title": "The Seven Men of Glenmoriston",
      "title_accent_split": [
            "The Seven Men of",
            "Glenmoriston"
      ],
      "subtitle": "July–August 1746 at the Cave of Coiraghoth (Coire Dho): Seven Starving Highland Outlaws, a £30,000 Hanover Crown Bounty, and the Unshakeable Right Hand of Ancient Sanctuary",
      "location": "Cave of Coiraghoth (Coire Dho) • Braes of Glenmoriston • Fort Augustus • Loch Ness • Drummossie Moor (Culloden) • Loch nan Uamh (Arisaig)",
      "genre": "Modal D-Dorian / D-Minor Celtic Folk-Rock & 1746 Highland Ballad",
      "thesis": "In late July 1746, seven outlawed, starving Highlanders hiding in the stream-cut boulder cave of Coiraghoth above Loch Ness held a £30,000 Hanover Crown bounty in the palms of their hands—enough gold to buy an earldom or rebuild every burned steading in Inverness-shire. The man kneeling by their embers was a Roman-born prince whose fatal command at Culloden had cost them their cattle, their roofs, and their brothers. Yet for three weeks they hid, fed, and guided him to safety without touching a single Hanover guinea—not out of courtly worship for a Stuart throne, but because the ancient Highland law of sanctuary (Aos-dàna / guest-right) and a Highlander's sworn word cannot be purchased by any king.",
      "thesis_attribution": "— Historical & Moral Thesis • Cave of Coiraghoth (Coire Dho), Braes of Glenmoriston, July–August 1746",
      "dedication": "Dedicated to the memory of the Seven Men of Glenmoriston—Hugh Chisholm, Patrick Grant ('Black Peter of Craskie'), Alexander MacDonald, Donald MacDonald, John MacDonald, Gregor MacGregor, and Alexander MacMillan—and to all who keep their sworn word when the price of betrayal could buy the world.",
      "telemetry": [
            {
                  "label": "Hanover Crown Bounty",
                  "value": "£30,000 Gold",
                  "color_cls": "text-retinal-400"
            },
            {
                  "label": "Sanctuary Span",
                  "value": "3 Weeks (1746)",
                  "color_cls": "text-amber-400"
            },
            {
                  "label": "Musical Pulse",
                  "value": "103 BPM • D Dorian",
                  "color_cls": "text-white"
            },
            {
                  "label": "Outlaws Sworn",
                  "value": "7 Highlanders",
                  "color_cls": "text-emerald-400"
            }
      ],
      "hero_art_caption_label": "Cave of Coiraghoth (Coire Dho) • Braes of Glenmoriston, July 1746",
      "hero_art_caption_title": "Hugh Chisholm, the Outlaws of Glenmoriston, the Fugitive & Silent Witness Glen",
      "media": {
            "youtubeVideoUrl": "[INSERT_YOUTUBE_URL_OR_LEAVE_PENDING]",
            "youtubePlaceholderNote": "Official Music Video Uploading Soon",
            "spotifyUrl": "[INSERT_SPOTIFY_URL_OR_LEAVE_PENDING]",
            "appleMusicUrl": "[INSERT_APPLE_MUSIC_URL_OR_LEAVE_PENDING]",
            "amazonMusicUrl": "[INSERT_AMAZON_MUSIC_URL_OR_LEAVE_PENDING]"
      },
      "art_banner": "assets/art/the-seven-men-of-glenmoriston-banner.webp",
      "art_square": "assets/art/the-seven-men-of-glenmoriston-cover.webp",
      "art_alt": "Inside the wet black basalt mouth of the Cave of Coiraghoth in 1746, gaunt Highland outlaw Hugh Chisholm with his peat-blackened right hand stands unbowed beside fellow outlaws in amber peat firelight as a mud-caked fugitive kneels by the embers and Glen, a black-and-white Scottish Border Collie, keeps watch at the rain-lashed cave lip.",
      "pillar_badges": [
            "£30,000 Hanover Bounty Refused",
            "Cave of Coiraghoth (July–Aug 1746)",
            "Law of Sanctuary (Aos-dàna)",
            "Hugh Chisholm's Unshaken Hand"
      ],
      "tags": [
            "SevenMenOfGlenmoriston",
            "Coiraghoth",
            "CoireDho",
            "HughChisholm",
            "PatrickGrant",
            "Culloden1746",
            "LHeureux",
            "HighlandSanctuary"
      ],
      "quote": "Keep your thirty thousand pounds of the Butcher's blood coin!\nThere is no winter cold enough to make a Highlander join!\nYou can burn down the cottage and outlaw the clan\nYou can hunt us with dragoons across our own land\nWe swore on the dirk in the dark of the glen\nThat a king cannot purchase the honor of men!\nLet the Hanover magistrates count out their fee\nOur roofs are in ashes, our souls are still free!",
      "bards_story": [
            "In the brutal summer following the Battle of Culloden (April 16, 1746), government Redcoat columns and Campbell militia operating out of Fort Augustus scoured the Great Glen and Inverness-shire under the orders of Prince William Augustus, Duke of Cumberland—burning steadings, driving off cattle, gutting parish kirks, and hunting Jacobite survivors. High in the rocky mountain braes of Glenmoriston, sheltering in the stream-hidden boulder cave of Coiraghoth (Coire Dho), seven outlawed, starving Highlanders banded together to protect their families and survive on wild roots, marrow cracked from bones, coarse barley oatcakes, and brine salt smuggled past night pickets: Hugh Chisholm, Patrick Grant ('Black Peter of Craskie'), Alexander MacDonald, Donald MacDonald, John MacDonald, Gregor MacGregor, and Alexander MacMillan.",
            "In late July 1746, an exhausted, lice-ridden fugitive stumbled through the weeping mountain mist into their basalt sanctuary carrying a £30,000 Hanover Crown bounty on his head—a sum sufficient in 1746 to purchase a Scottish earldom or rebuild every burned roof in Inverness-shire (tens of millions of dollars in modern purchasing power). One whisper down by the loch at Fort Augustus would have ransomed their flocks, bought back their rusted ploughshares, and fed their wives and children digging wild nettles from the sod.",
            "The tragic irony at the heart of the Glenmoriston chronicle is that the seven broken-down outlaws who risked the gallows to shelter Charles Edward Stuart were protecting a Roman-born aristocrat who had never set foot in Scotland until fourteen months earlier, spoke with an Italian-French accent, overrode his best field commander Lord George Murray to force a suicidal stand on Drummossie Moor, and would soon sail back to French velvet and wine aboard the 34-gun Saint-Malo privateer frigate L'Heureux. Yet for three weeks they hid, fed, and guided him safely through the cordon of patrols without touching a penny of Hanover blood coin.",
            "Why? As the bridge of the song declares: 'For it was not for Charlie we stood in that cave! / It was for the old law that our ancestors gave!' They stood for the ancient Highland covenant of sanctuary, hospitality (Aos-dàna / guest-right), and a sworn word that no German king in London or Butcher's garrison could buy. According to Highland tradition, Hugh Chisholm vowed never again to shake another man's hand with the right hand that had pledged that oath—not for silver, and not for fear. Throughout the accompanying music video, our silent witness Glen—a black-and-white Scottish Border Collie seated on wet black basalt at the lip of Coiraghoth cave—watches the rain wash thirty thousand pounds from the palms of seven free men."
      ],
      "musical_direction": {
            "summary": "Modal D-Minor / D-Dorian Celtic Folk-Rock & 1746 Highland Ballad at 103 BPM (06:20).",
            "details": "Opens with a stark spoken cold open over rain-lashed acoustic guitar and low bass drone ('Thirty thousand pounds of Hanover gold...'), erupting at 0:27 into a mournful yet defiant Highland fiddle, cello, and European accordion theme. Driven by a weathered male baritone and a relentless 103 BPM folk-rock heartbeat, the arrangement builds across three narrative verses and roaring D-Dorian choruses—including the crag-top vocal echo at 3:01 ('Our souls are still free!'), a dramatic hospitality-oath pause at 3:51, a soaring historical bridge at 4:36, a searing guitar and fiddle solo over the upright Highland dirk at 5:05, and a stripped spoken epilogue at 6:05: 'They took the cattle. They took the tartan. They never got the word.'"
      },
      "sevenMenDossier": {
            "badge": "PART I // THE CAVE OF COIRAGHOTH (COIRE DHO) & THE LAW OF SANCTUARY",
            "title": "The Seven Men of Glenmoriston (July–August 1746)",
            "location": "Cave of Coiraghoth (Coire Dho), Braes of Glenmoriston, Inverness-shire",
            "bounty": "£30,000 Hanover Crown Bounty (Equivalent to a Scottish Earldom / Tens of Millions Today)",
            "intro": "In the brutal summer following the Battle of Culloden (April 16, 1746), government Redcoat columns and Campbell militia operating out of Fort Augustus scoured the Great Glen and Inverness-shire—burning steadings, driving off cattle, and hunting Highland Jacobite fugitives. High in the rocky mountain braes of Glenmoriston, first sheltering in the stream-hidden boulder cave of Coiraghoth (Coire Dho), seven outlawed, starving Highlanders banded together to protect their families and survive on wild roots, cracked marrow bones, coarse barley oatcakes, and brine salt smuggled past night pickets.",
            "irony_and_oath": "In late July 1746, an exhausted, lice-ridden fugitive stumbled into their mountain sanctuary carrying a £30,000 Hanover Crown bounty on his head. The tragic irony at the heart of the Glenmoriston dossier is that the seven outlawed Highlanders who risked the gallows to shelter Charles Edward Stuart were protecting a prince who had never set foot in Scotland until a year earlier, spoke with an Italian-French accent, and ultimately left their shattered clan society behind. Yet for three weeks they hid, fed, and guided him safely through the cordon of patrols without touching a penny of Hanover blood money—not out of blind courtly worship ('It was not for Charlie we stood in that cave / It was for the old law that our ancestors gave'), but out of the ancient Highland law of sanctuary, hospitality (Aos-dàna / guest-right), and sworn honor. According to Highland tradition, Hugh Chisholm vowed never again to shake another man's hand with the right hand that had pledged that oath—not for silver, and not for fear.",
            "men": [
                  {
                        "num": "01",
                        "name": "Hugh Chisholm",
                        "epithet": "The Unshakeable Right Hand of Coiraghoth",
                        "clan_note": "Strathglass / Glenmoriston Outlaw & Sanctuary Oath-Keeper",
                        "role": "Looked into the sunken eyes of the ragged fugitive without bowing as a courtier bows, clasped his hand in sanctuary with a palm blistered and blackened by peat soot, and vowed never again to shake another man's right hand for silver or fear."
                  },
                  {
                        "num": "02",
                        "name": "Patrick Grant",
                        "epithet": "\"Black Peter of Craskie\" (Pàdraig Dubh)",
                        "clan_note": "Grant of Craskie, Glencannich / Glenmoriston Night Scout",
                        "role": "Crept by night past the scarlet picket lines and Campbell militia campfires a mile from Fort Augustus to smuggle back a coarse barley oatcake and a horn of brine salt to season the cave vault."
                  },
                  {
                        "num": "03",
                        "name": "Donald MacDonald",
                        "epithet": "Defender of the Hearth Covenant",
                        "clan_note": "Glengarry / Glenmoriston Clansman",
                        "role": "Watched the smoke of burned kinsmen's roofs curling through the birches while families dug weeds from the sod, yet swore that the waters of Loch Ness would run backward in shame before they sold out a guest at their fire."
                  },
                  {
                        "num": "04",
                        "name": "Alexander MacDonald",
                        "epithet": "Sentinel of the Braes",
                        "clan_note": "Glengarry / Glenmoriston Outlaw Brother",
                        "role": "Stood watch on the rain-lashed granite crags above the Great Glen, tracking dragoon patrols along the flooded military road between Fort Augustus and Inverness."
                  },
                  {
                        "num": "05",
                        "name": "John MacDonald",
                        "epithet": "Keeper of the Stream-Hidden Vault",
                        "clan_note": "Glengarry / Glenmoriston Outlaw Kinsman",
                        "role": "Guarded the boulder-strewn threshold of Coiraghoth where the mountain burn poured past heather bedding and wet black basalt doors."
                  },
                  {
                        "num": "06",
                        "name": "Gregor MacGregor",
                        "epithet": "Outlaw of the Children of the Mist",
                        "clan_note": "Clan Gregor Fugitive in the Great Glen",
                        "role": "Already bearing a proscribed surname under royal decree, he shared cracked marrow bones and wild roots in the dark of the glen rather than touch the Butcher's blood coin."
                  },
                  {
                        "num": "07",
                        "name": "Alexander MacMillan",
                        "epithet": "Guide Through the Mountain Cordon",
                        "clan_note": "Lochaber / Glenmoriston Highlander",
                        "role": "Helped guide the fugitive across the sodden braes and mountain passes out of Cumberland's net toward Lochaber and the west coast."
                  }
            ]
      },
      "pillars_section": {
            "badge": "Interactive Framework I // 3-Pillar Moral & Historical Matrix",
            "title": "The £30,000 Temptation, The Tragic Irony & The Old Law",
            "intro": "Why did seven starving men whose cottages were in ashes and whose families were digging wild nettles in the mud refuse thirty thousand pounds of gold for a prince who had led their clans to ruin? Three historical pillars unlock the Cave of Coiraghoth."
      },
      "pillars": [
            {
                  "number": "I",
                  "code": "PILLAR I // THE ECONOMIC TEMPTATION",
                  "title": "£30,000 of Hanover Gold vs. Seven Starving Men in the Basalt",
                  "stat_highlight": "£30,000 Bounty",
                  "stat_sub": "Enough in 1746 to buy a Scottish earldom or rebuild every burned roof in Inverness-shire",
                  "icon": "fa-solid fa-coins",
                  "summary": "Following Culloden, the British Crown under George II and the Duke of Cumberland weaponized famine and an astronomical £30,000 treason reward to shatter Highland clan solidarity.",
                  "analysis": "To impoverished tenant farmers whose cattle had been driven off to Fort Augustus and whose steadings were smoking rubble, £30,000 (tens of millions of dollars in modern purchasing power) was an unimaginable fortune. One quiet word to the garrison a mile away by Loch Ness meant instant royal pardon, a warm hearth, and bread for starving children—yet not one of the seven men of Coiraghoth broke ranks.",
                  "lyric_echo": "One whisper at Fort Augustus down by the loch / Would have bought back our ploughshares and ransomed our flock"
            },
            {
                  "number": "II",
                  "code": "PILLAR II // THE TRAGIC IRONY",
                  "title": "A Roman-Born Courtier Who Cost Them Their Sons & Sailed Back to Velvet",
                  "stat_highlight": "Rome → Coire Dho → Paris",
                  "stat_sub": "Born at Palazzo Muti (1720) • Defeated at Drummossie Moor (April 1746) • Rescued on L'Heureux (Sept 1746)",
                  "icon": "fa-solid fa-crown",
                  "summary": "The fugitive kneeling by their peat embers was no native Highland chieftain; he was an Italian-raised aristocrat whose fatal tactical arrogance at Culloden destroyed clan society.",
                  "analysis": "Raised in Rome on a Vatican pension speaking Italian and French, Charles Edward Stuart overruled his brilliant field commander Lord George Murray to fight on flat, boggy Drummossie Moor against British artillery. Five months later, after Highlanders died or starved to keep him alive, he boarded the 34-gun French privateer L'Heureux at Loch nan Uamh back to continental velvet and wine.",
                  "lyric_echo": "He had cost us our sons and the roofs overhead / He had marched us on biscuits to sleep with the dead"
            },
            {
                  "number": "III",
                  "code": "PILLAR III // AOS-DÀNA & THE RIGHT HAND",
                  "title": "\"It Was Not for Charlie We Stood in That Cave—It Was for the Old Law\"",
                  "stat_highlight": "Aos-dàna Sanctuary",
                  "stat_sub": "Ancient Highland guest-right & Hugh Chisholm's lifelong vow never to shake hands for silver",
                  "icon": "fa-solid fa-hand-fist",
                  "summary": "The Seven Men did not guard the cave out of servile royalism; they guarded their own souls and the ancient ancestral law of Highland sanctuary.",
                  "analysis": "Under the Highland code of hospitality and sanctuary, once a stranger in flight knelt by your embers and received your word, selling him for 'the coin of a German or fear of the law' would dishonor every ancestor in the glen. When Hugh Chisholm pledged that oath with his blistered, peat-blackened right hand, he vowed never again to let another man's hand touch it for silver or fear.",
                  "lyric_echo": "For it was not for Charlie we stood in that cave! / It was for the old law that our ancestors gave!"
            }
      ],
      "historicalDeepDive": [
            {
                  "id": "origins-rome",
                  "num": "01",
                  "category": "prince",
                  "region": "Rome (Palazzo Muti) to the Outer Hebrides",
                  "title": "1. His Origins: A Scottish Prince Born in Rome (December 31, 1720)",
                  "metric": "Born in Rome • Landed in Scotland July 1745 (Age 24)",
                  "still": "assets/stills/01-roman-courtier-vs-fugitive.webp",
                  "still_secondary": "assets/stills/film-s18-fugitive-embers.webp",
                  "still_caption": "The Roman Courtier of Palazzo Muti vs. The Lice-Ridden Fugitive of Coire Dho",
                  "era_tag": "1688 – July 1745",
                  "bard_ts": "01:34 – 02:24",
                  "lyric": "Then down through the bracken a beggar man crept / In a lice-ridden plaid where the mountain mist wept ... Hugh Chisholm stepped forward and looked in his eyes / No bow to a palace, no courtier's lies",
                  "lead": "Charles Edward Stuart—known to history as 'Bonnie Prince Charlie' or 'The Young Pretender'—was the grandson of the deposed Catholic King James II and VII, making him the figurehead of the final armed bid to reclaim the British throne for the exiled Stuart dynasty. Although the Stuart dynasty was originally Scottish (descending from Robert the Bruce's family and ruling Scotland since 1371 before inheriting the English crown in 1603), Charles Edward Louis John Casimir Sylvester Severino Maria Stuart was born in Rome on December 31, 1720, at the Palazzo Muti.",
                  "bullets": [
                        {
                              "heading": "The Exile (1688)",
                              "text": "In 1688, his Catholic grandfather, King James II & VII, was overthrown by the Protestant British Parliament in the 'Glorious Revolution.'"
                        },
                        {
                              "heading": "His Parents",
                              "text": "Charles's father was James Francis Edward Stuart ('The Old Pretender'—meaning 'claimant,' from the French prétendant), and his mother was Maria Clementina Sobieska, a Polish princess and granddaughter of the Polish king Jan III Sobieski."
                        },
                        {
                              "heading": "Upbringing in the Papal States",
                              "text": "Raised in the papal states of Italy as a Catholic aristocrat on a Vatican pension, Charles grew up speaking Italian, French, and accented English. Before landing in the Hebrides in July 1745 at age 24, he had only ever known Scotland through stories told by exiled Jacobite courtiers."
                        }
                  ],
                  "sources": [
                        {
                              "label": "Charles Edward Stuart ('Bonnie Prince Charlie') — Biographical & Historical Archive",
                              "url": "https://en.wikipedia.org/wiki/Charles_Edward_Stuart"
                        },
                        {
                              "label": "Palazzo Muti (Rome) — Birthplace & Papal Exile Residence of the Stuart Court",
                              "url": "https://en.wikipedia.org/wiki/Palazzo_Muti"
                        }
                  ]
            },
            {
                  "id": "hanover-bounty",
                  "num": "02",
                  "category": "bounty",
                  "region": "London, Hanover & Fort Augustus (Loch Ness)",
                  "title": "2. Why the 'Germans' (House of Hanover) Put a £30,000 Bounty on His Head",
                  "metric": "1701 Act of Settlement • £30,000 Crown Treason Bounty",
                  "still": "assets/stills/02-hanover-bounty-fort-augustus.webp",
                  "still_secondary": "assets/stills/film-s16-hanover-bounty.webp",
                  "still_caption": "The £30,000 Hanover Gold Bounty & Redcoat Columns at Fort Augustus",
                  "era_tag": "1701 – Summer 1746",
                  "bard_ts": "00:06 – 00:27 & 02:24 – 03:06",
                  "lyric": "Keep your thirty thousand pounds of the Butcher's blood coin! / There is no winter cold enough to make a Highlander join! ... Let the Hanover magistrates count out their fee / Our roofs are in ashes, our souls are still free!",
                  "lead": "The 'Hanover gold' and 'coin of a German' in the song refer to the British Crown, which was ruled at the time by the German House of Hanover.",
                  "bullets": [
                        {
                              "heading": "The 1701 Act of Settlement",
                              "text": "To guarantee a permanent Protestant monarchy and prevent the Catholic Stuarts from returning, the English Parliament passed a law bypassing over fifty closer Catholic relatives to hand the British succession to Sophia of Hanover (a German granddaughter of King James I) and her heirs."
                        },
                        {
                              "heading": "King George II & 'Butcher' Cumberland",
                              "text": "In 1714, George Louis, Elector of Hanover, became King George I of Great Britain. By 1745, his son, King George II—who was born in Hanover, Germany, and spoke English with a thick German accent—sat on the throne in London. The commander who crushed the Highlanders at Culloden and ordered the burning of Inverness-shire from Fort Augustus was George II's younger son, Prince William Augustus, Duke of Cumberland."
                        },
                        {
                              "heading": "The £30,000 Bounty",
                              "text": "To the Hanoverian government in London, Charles wasn't a foreign prince of war; he was an existential threat to the Protestant state and a rebel guilty of high treason. The £30,000 bounty offered by the Crown was designed to shatter Highland clan loyalty with a sum of money incomprehensible to impoverished tenant farmers."
                        }
                  ],
                  "sources": [
                        {
                              "label": "UK Statute Law Database — The Act of Settlement (1701) Original Statutory Text",
                              "url": "https://www.legislation.gov.uk/aep/Will3/12-13/2/contents"
                        },
                        {
                              "label": "Prince William Augustus, Duke of Cumberland & The Fort Augustus Pacification Campaign",
                              "url": "https://en.wikipedia.org/wiki/Prince_William,_Duke_of_Cumberland"
                        }
                  ]
            },
            {
                  "id": "culloden-stand",
                  "num": "03",
                  "category": "culloden",
                  "region": "Glenfinnan, Derby & Drummossie Moor (Culloden)",
                  "title": "3. Why He Led the Scots at the Battle of Culloden (April 16, 1746)",
                  "metric": "Glenfinnan to Derby (125 mi from London) • Fatal Stand at Culloden",
                  "still": "assets/stills/03-culloden-drummossie-moor.webp",
                  "still_secondary": "assets/stills/film-s17-culloden-bonnet.webp",
                  "still_caption": "The Sleet-Lashed Charge on Drummossie Moor & The Burned Croft Aftermath",
                  "era_tag": "July 1745 – April 16, 1746",
                  "bard_ts": "00:59 – 01:55",
                  "lyric": "Our cattle were driven, our brothers lay cold / Where the sleet of Culloden turned heather to mold ... He had cost us our sons and the roofs overhead / He had marched us on biscuits to sleep with the dead",
                  "lead": "The supporters of the exiled Stuarts were called Jacobites (from Jacobus, the Latin name for King James). Charles landed in Scotland in July 1745 to launch a rising on behalf of his aging father, intending to march on London and overthrow George II.",
                  "bullets": [
                        {
                              "heading": "Why the Highlanders Joined Him",
                              "text": "Many Highland clans (both Catholic and Episcopalian, alongside anti-Union Presbyterians) despised the 1707 Act of Union that abolished the Scottish Parliament, resented London's heavy taxation and military garrisons, and viewed the Stuarts as Scotland's rightful, native bloodline. Even reluctant chiefs like Donald Cameron of Lochiel were won over by Charles's personal charisma and the realization that he had landed without a French army, throwing himself entirely on Highland honor."
                        },
                        {
                              "heading": "The Road to Culloden (April 16, 1746)",
                              "text": "After raising his standard at Glenfinnan, Charles's Highland army captured Edinburgh, routed government forces at Prestonpans, and marched into England as far south as Derby (just 125 miles from London). When promised French reinforcements and English Jacobite recruits failed to materialize, his clan chiefs forced a retreat back into Scotland."
                        },
                        {
                              "heading": "The Fatal Mistake on Drummossie Moor",
                              "text": "Exhausted, starving (rationed to a single biscuit per man on the eve of battle), and out of money, the Jacobite army made a final stand on Drummossie Moor (Culloden) near Inverness. Against the fierce protests of his best field commander, Lord George Murray—who warned that the flat, boggy moor was suicide against British artillery and cavalry—Charles insisted on taking supreme command and fighting on open ground. In less than an hour, Cumberland's artillery shredded the Highland charge, destroying the Jacobite cause forever."
                        }
                  ],
                  "sources": [
                        {
                              "label": "Battle of Culloden (Drummossie Moor, April 16, 1746) — Campaign & Battlefield Record",
                              "url": "https://en.wikipedia.org/wiki/Battle_of_Culloden"
                        },
                        {
                              "label": "Lord George Murray — Jacobite General & Tactician of the 1745 Rising",
                              "url": "https://en.wikipedia.org/wiki/Lord_George_Murray"
                        }
                  ]
            },
            {
                  "id": "flight-to-france",
                  "num": "04",
                  "category": "france",
                  "region": "Outer Hebrides, Skye, Glenmoriston & Paris",
                  "title": "4. Why He Went Back to France: Survival & The Treaty of Aix-la-Chapelle",
                  "metric": "5 Months on the Run • 1748 Expulsion from France • Died in Rome (1788)",
                  "still": "assets/stills/film-s48-velvet-and-wine.webp",
                  "still_secondary": "assets/stills/film-s35-fort-augustus.webp",
                  "still_caption": "'Back to Velvet and Wine That the Glen Never Knew' vs. Fort Augustus Garrison",
                  "era_tag": "April 1746 – 1748 (d. 1788)",
                  "bard_ts": "04:36 – 04:51",
                  "lyric": "The Prince sailed for France when the autumn wind blew / Back to velvet and wine that the glen never knew / And Hugh Chisholm walked onward through exile and years / Never shaking that right hand for silver or fears",
                  "lead": "Charles fled back to France in September 1746 for two distinct reasons: immediate physical survival and European geopolitical strategy.",
                  "bullets": [
                        {
                              "heading": "Immediate Survival Against Tower Hill",
                              "text": "After Culloden, Scotland became a death trap. Thousands of government Redcoats and Campbell militia scoured the Highlands and islands, burning steadings and executing rebels. After five months on the run across the Outer Hebrides, Skye (aided by Flora MacDonald), and the mainland braes of Glenmoriston and Badenoch, staying meant inevitable capture and execution on Tower Hill in London."
                        },
                        {
                              "heading": "The French Alliance & War of the Austrian Succession",
                              "text": "Throughout the 1740s, Britain and France were locked in the War of the Austrian Succession. France was the primary financial and military backer of the Jacobites, using the Stuart claim to destabilize Britain. Charles returned to Paris hoping to convince King Louis XV to give him a full French army to invade Britain a second time."
                        },
                        {
                              "heading": "The 1748 Treaty of Aix-la-Chapelle",
                              "text": "Instead, when Britain and France signed the Treaty of Aix-la-Chapelle in 1748, Louis XV agreed to expel Charles from France as a condition of peace—leaving the prince to spend the rest of his life drifting into bitter, alcoholic exile in Italy until his death in 1788, while the Highland clans bore the Disarming Act and the destruction of their way of life."
                        }
                  ],
                  "sources": [
                        {
                              "label": "Treaty of Aix-la-Chapelle (1748) — Anglo-French Peace & Expulsion of the Stuart Claimant",
                              "url": "https://en.wikipedia.org/wiki/Treaty_of_Aix-la-Chapelle_(1748)"
                        },
                        {
                              "label": "The Jacobite Rising of 1745 — Post-Culloden Flight & Highland Pacification",
                              "url": "https://en.wikipedia.org/wiki/Jacobite_rising_of_1745"
                        }
                  ]
            },
            {
                  "id": "ship-lheureux",
                  "num": "05",
                  "category": "france",
                  "region": "Loch nan Uamh (Arisaig) to Roscoff, Brittany",
                  "title": "5. What Sort of Ship Carried Him Back to France? (The Frigate L'Heureux)",
                  "metric": "30-to-34-Gun Saint-Malo Privateer Frigate • Sept 20 – Oct 10, 1746",
                  "still": "assets/stills/04-lheureux-frigate-arisaig.webp",
                  "still_secondary": "assets/stills/film-s47-lheureux-frigate.webp",
                  "still_caption": "The 34-Gun Saint-Malo Privateer Frigate L'Heureux & Consort Le Prince de Conti at Loch nan Uamh",
                  "era_tag": "Sept 20 – Oct 10, 1746",
                  "bard_ts": "04:33 – 04:46",
                  "lyric": "The Prince sailed for France when the autumn wind blew / Back to velvet and wine that the glen never knew",
                  "lead": "In the early hours of September 20, 1746 (often recorded as September 19 in naval logs), Charles boarded the L'Heureux ('The Happy' or 'The Fortunate') at Loch nan Uamh in Arisaig—the exact same sea loch where he had first stepped ashore fourteen months earlier.",
                  "bullets": [
                        {
                              "heading": "The Vessel Type (Frégate Corsaire)",
                              "text": "L'Heureux was a 30-to-34-gun French privateer frigate operating out of Saint-Malo in Brittany, sailing alongside a smaller 30-gun consort vessel named Le Prince de Conti."
                        },
                        {
                              "heading": "How She Was Built and Armed",
                              "text": "In 1746, a Saint-Malo privateer frigate (frégate corsaire) was a sleek, three-masted, square-rigged wooden warship built specifically for speed, weatherliness, and outrunning heavy British Royal Navy ships-of-the-line in the rough waters of the North Atlantic and the Minch. Roughly 100 to 115 feet along the gun deck and displacing around 300 to 400 tons, she carried iron nine-pounder or six-pounder cannons along a single main gun deck, with lighter swivel guns mounted on the quarterdeck and forecastle rails."
                        },
                        {
                              "heading": "The Rescue Mission to Roscoff",
                              "text": "The two ships were organized and commanded by Colonel Richard Warren, an Irish Jacobite officer in the French service, and captained by Beaulieu Tremegon. Slipping through the Royal Navy blockade under cover of autumn fog and heavy weather, L'Heureux took Charles, Lochiel, and roughly a hundred other Jacobite fugitives aboard, landing them safely at Roscoff in Brittany on October 10, 1746."
                        }
                  ],
                  "sources": [
                        {
                              "label": "Loch nan Uamh (Arisaig) — Landing (1745) & Final Embarkation aboard L'Heureux (Sept 20, 1746)",
                              "url": "https://en.wikipedia.org/wiki/Loch_nan_Uamh"
                        },
                        {
                              "label": "Colonel Richard Warren — Commander of the French Rescue Expedition (L'Heureux & Le Prince de Conti)",
                              "url": "https://en.wikipedia.org/wiki/Richard_Warren_(Jacobite)"
                        }
                  ]
            },
            {
                  "id": "sanctuary-relics-hand",
                  "num": "06",
                  "category": "sanctuary",
                  "region": "Cave of Coiraghoth (Coire Dho) & Strathglass",
                  "title": "6. The Unshakeable Right Hand, The Sanctuary Relics & Silent Witness Glen",
                  "metric": "Bog-Oak Dirk • Barley Oatcake & Brine Salt • Untouched Gold Guinea",
                  "still": "assets/stills/05-sanctuary-relics-dirk-glen.webp",
                  "still_secondary": "assets/stills/film-s64-glen-and-dirk.webp",
                  "still_caption": "Upright Bog-Oak Dirk, Oatcake, Brine Salt, Untouched Guinea & Silent Witness Glen",
                  "era_tag": "August 1746 – Lifelong Oath",
                  "bard_ts": "02:07 – 02:24 & 05:59 – 06:19",
                  "lyric": "And Hugh Chisholm walked onward through exile and years / Never shaking that right hand for silver or fears ... They took the cattle. They took the tartan. They never got the word.",
                  "lead": "At the threshold of Coiraghoth cave, four physical relics anchor the visual story alongside Glen, our black-and-white Scottish Border Collie witness:",
                  "bullets": [
                        {
                              "heading": "The Upright Bog-Oak Highland Dirk",
                              "text": "Driven upright into a crevice of wet black basalt at the cave lip—the blade upon which the seven men swore in the dark of the glen that 'a king cannot purchase the honor of men.'"
                        },
                        {
                              "heading": "The Coarse Barley Oatcake & Pinch of Brine Salt",
                              "text": "Smuggled past Campbell militia pickets at night by Patrick Grant ('Black Peter of Craskie'). Under Highland guest-right (Aos-dàna), once bread and salt were shared by the peat embers, the guest's life was sacred above £30,000 of gold."
                        },
                        {
                              "heading": "Hugh Chisholm's Peat-Blackened Right Hand",
                              "text": "Blistered and blackened with ground-in peat soot, Hugh's right hand steadied the fugitive's wrist in sanctuary and later clenched in refusal when offered lace-cuffed silver coins—honoring his lifelong vow never to shake another man's hand with the hand that had sealed that oath."
                        }
                  ],
                  "sources": [
                        {
                              "label": "Bishop Robert Forbes (1708–1775) — 'The Lyon in Mourning' Vol. I (Digitized Primary Source, Internet Archive)",
                              "url": "https://archive.org/details/lyoninmourningor01forb"
                        },
                        {
                              "label": "Glenmoriston & The Seven Men of Glenmoriston — Historical Geography & Clan Tradition",
                              "url": "https://en.wikipedia.org/wiki/Glenmoriston"
                        }
                  ]
            }
      ],
      "storyChapters": [
            {
                  "time": "0:00",
                  "title": "Thirty Thousand Pounds of Hanover Gold",
                  "scenes": "Chapter I",
                  "note": "Spoken Cold Open over rain-lashed acoustic guitar; a Hanover gold guinea lies beside an upright bog-oak dirk and watchful Border Collie Glen."
            },
            {
                  "time": "0:27",
                  "title": "Highland Fiddle in the Burned Braes",
                  "scenes": "Chapter II",
                  "note": "Soot-stained Highlander hands draw a horsehair bow across an 18th-century fiddle as steading smoke hangs in wet silver birches above Loch Ness."
            },
            {
                  "time": "0:59",
                  "title": "Verse I: Smoke in the Birch & Marrow Bone",
                  "scenes": "Chapter III",
                  "note": "Seven gaunt outlaws in the Cave of Coiraghoth survive on wild roots and marrow cracked from bone after the sleet of Culloden."
            },
            {
                  "time": "1:34",
                  "title": "Verse II: A Beggar in the Bracken",
                  "scenes": "Chapter IV",
                  "note": "A lice-ridden fugitive with a £30,000 bounty from the German King's throne creeps through weeping mountain mist and kneels by the cave embers."
            },
            {
                  "time": "2:07",
                  "title": "Hugh Chisholm's Peat-Blackened Hand",
                  "scenes": "Chapter V",
                  "note": "No bow to a palace, no courtier's lies—Hugh Chisholm's blistered, peat-blackened right hand clasps the stranger's wrist in sanctuary."
            },
            {
                  "time": "2:24",
                  "title": "Chorus: Keep the Butcher's Blood Coin",
                  "scenes": "Chapter VI",
                  "note": "Full D-Dorian folk-rock eruption at the cave mouth: 'We swore on the dirk in the dark of the glen / That a king cannot purchase the honor of men!'"
            },
            {
                  "time": "3:01",
                  "title": "Echo on the Crag: Our Souls Are Still Free",
                  "scenes": "Chapter VII",
                  "note": "Unscripted crag-top baritone echo over storm-swept Loch Ness before a lone golden eagle glides above the Coiraghoth cliffs."
            },
            {
                  "time": "3:07",
                  "title": "Verse III: Three Weeks Above Fort Augustus",
                  "scenes": "Chapter VIII",
                  "note": "Patrick Grant creeps past Redcoat pickets for an oatcake and brine salt while Highland wives dig weeds from the sod a mile from Fort Augustus."
            },
            {
                  "time": "3:51",
                  "title": "Oath on the Hilt: The Law of Sanctuary",
                  "scenes": "Chapter IX",
                  "note": "Hugh lays his cold palm on his dirk hilt: 'If we sell out a guest, then our fathers have died!' leading into the second chorus."
            },
            {
                  "time": "4:33",
                  "title": "Bridge: Not for Charlie—For the Old Law",
                  "scenes": "Chapter X",
                  "note": "The 34-gun frigate L'Heureux sails for French velvet and wine while Hugh Chisholm refuses silver handshakes for life: 'It was not for Charlie we stood in that cave!'"
            },
            {
                  "time": "5:11",
                  "title": "Final Chorus: Honor Beyond Purchase",
                  "scenes": "Chapter XI",
                  "note": "After the searing guitar and fiddle solo over Glen and the upright dirk, seven poor outlaws let £30,000 wash from their open palms in the Highland rain."
            },
            {
                  "time": "5:59",
                  "title": "Spoken Epilogue: They Never Got the Word",
                  "scenes": "Chapter XII",
                  "note": "Rainwater fills empty cattle hoofprints as Glen keeps final watch beside the upright dirk: 'They took the cattle. They took the tartan. They never got the word.'"
            }
      ],
      "timeline_section": {
            "badge": "Interactive Framework III // 4-Act Historical & Musical Arc",
            "title": "From the Ashes of Culloden to the Cave of Coiraghoth (0:00 – 6:20)",
            "intro": "Follow the four dramatic movements of 'The Seven Men of Glenmoriston' from the smoking steadings of Inverness-shire to the autumn gale at Loch nan Uamh."
      },
      "timeline": [
            {
                  "year": "0:00 – 1:34",
                  "era_badge": "ACT I // THE ASHES OF INVERNESS-SHIRE",
                  "title": "£30,000 of Hanover Gold & Seven Shadows in Coiraghoth Cave",
                  "location": "Fort Augustus Magistrate Chamber • Burned Braes • Cave of Coiraghoth",
                  "icon": "fa-solid fa-fire-flame-simple",
                  "narrative": "Opening in cold storm-slate and wet black basalt, Hanoverian magistrate hands stack 1746 gold guineas beside brass scales while rain lashes the smoking, roofless stone steadings of Inverness-shire. At the lip of Coiraghoth cave, Scottish Border Collie Glen watches the rain before seven gaunt outlaw silhouettes surviving on wild roots and marrow cracked from bone as Highland fiddle and cello ignite the 103 BPM pulse.",
                  "artifact_note": "Spoken Cold Open, Highland Fiddle Intro & Verse 1"
            },
            {
                  "year": "1:34 – 3:07",
                  "era_badge": "ACT II // THE BEGGAR IN THE BRACKEN",
                  "title": "The Lice-Ridden Fugitive, The Peat-Blackened Hand & Chorus I",
                  "location": "Weeping Mountain Bracken • Coiraghoth Cave Embers • Crags Above Loch Ness",
                  "icon": "fa-solid fa-hand-holding-hand",
                  "narrative": "Out of the sodden russet bracken creeps a broken 26-year-old fugitive carrying a £30,000 price from the German King's throne—the very commander who had marched the clans on biscuits to sleep with the dead at Culloden. When he kneels half-blind by the peat embers, Hugh Chisholm steps forward without a courtier's bow, steadying the stranger's wrist with his blistered, peat-blackened right hand before belting the defiant Chorus 1 anthem and its crag-top echo at 3:01: 'Our souls are still free!'",
                  "artifact_note": "Verse 2, The Sanctuary Clasp & Chorus 1 + Crag Echo"
            },
            {
                  "year": "3:07 – 4:33",
                  "era_badge": "ACT III // THREE WEEKS ABOVE FORT AUGUSTUS",
                  "title": "Black Peter's Night Salt, Starving Kin & The Oath on the Dirk Hilt",
                  "location": "Campbell Picket Lines • Fort Augustus Bastions • Coiraghoth Vault",
                  "icon": "fa-solid fa-dagger",
                  "narrative": "For three weeks the outlaws hide him where eagles scarce fly while Campbell militia march below. Patrick Grant ('Black Peter of Craskie') slips past redcoat sentry fires by night for a barley oatcake and brine salt while Highland wives dig wild nettles in the mud. When Donald MacDonald points to the smoke over starving homes, Hugh lays his cold palm on his bog-oak dirk hilt: 'If we sell out a guest, then our fathers have died!'",
                  "artifact_note": "Verse 3, The Hospitality Oath & Chorus 2 Climax"
            },
            {
                  "year": "4:33 – 6:20",
                  "era_badge": "ACT IV // L'HEUREUX & THE UNSHAKEN HAND",
                  "title": "Velvet and Wine, The Ancient Law & 'They Never Got the Word'",
                  "location": "Loch nan Uamh (Frigate L'Heureux) • Lonely Highland Ridge • Coiraghoth Threshold",
                  "icon": "fa-solid fa-ship",
                  "narrative": "In September 1746 the 34-gun French privateer frigate L'Heureux carries the Prince back to 'velvet and wine that the glen never knew,' while Hugh Chisholm walks onward through exile and years—refusing lace-cuffed silver coins with his clenched right hand ('For it was not for Charlie we stood in that cave / It was for the old law that our ancestors gave!'). After a searing guitar and fiddle solo over Glen and the upright dirk, Highland rain washes Hugh's empty palm clean as the spoken epilogue seals the chronicle: 'They took the cattle. They took the tartan. They never got the word.'",
                  "artifact_note": "Bridge, Guitar & Fiddle Solo, Final Chorus & Spoken Epilogue"
            }
      ],
      "poeticsCallout": {
            "badge": "EDITORIAL CALLOUT // HIGHLAND CHIAROSCURO, SILENT WITNESS GLEN & DUAL LYRIC ARCHIVE",
            "title": "Peat Embers & Wet Basalt: Silent Witness Glen, Sanctuary Relics & The Two Lyric Texts",
            "chorus_couple": "For it was not for Charlie we stood in that cave! / It was for the old law that our ancestors gave!",
            "intro": "Bringing the 1746 chronicle of 'The Seven Men of Glenmoriston' to life rests on three deliberate historical, visual, and archival threads:",
            "pillars": [
                  {
                        "number": "01",
                        "title": "Silent Witness Glen & The 4 Sanctuary Relics",
                        "body": "Throughout the visual chronicle, Glen—a black-and-white Scottish Border Collie seated on wet black basalt at the threshold of Coiraghoth cave—serves as our silent witness. Keeping watch over the mist-choked glen above Loch Ness, Glen sits beside four recurring physical symbols of Highland honor: the upright bog-oak dirk, Patrick Grant's coarse barley oatcake and pinch of white brine salt, and a single mud-splattered Hanover gold guinea left untouched in the rain."
                  },
                  {
                        "number": "02",
                        "title": "Peat Embers vs. Storm-Slate Chiaroscuro",
                        "body": "The visual aesthetic contrasts the cold storm-slate blues, wet black basalt, weeping mountain mist, and bruised autumn bracken of hunted Inverness-shire against the warm, low-key peat-ember firelight inside the cave of Coiraghoth and the tarnished gleam of Hanover gold—mirroring the moral divide between Fort Augustus and the sanctuary fire."
                  },
                  {
                        "number": "03",
                        "title": "Studio Master Audio Lyrics vs. Extended Ballad Manuscript",
                        "body": "In the Lyrics Vault below, we preserve both versions of the ballad: (1) the Studio Master Audio Lyrics sung word-for-word on the 6:20 recording, and (2) the Extended Literary Ballad Manuscript from the songwriter's notebook (which includes Donald MacDonald's extended speech: 'Then the water of Ness would run backward in shame!'). Toggle freely between both editions."
                  }
            ]
      },
      "clean_lyrics_stanzas": [
            "[Spoken Cold Open (0:06 – 0:27)]\nThirty thousand pounds of Hanover gold.\nEnough to buy an earldom.\nEnough to rebuild every burned roof in Inverness.\nAnd seven starving men in a hole in the rock,\nwith nothing left to their names but the rain.",
            "[Instrumental Intro — Highland Fiddle, Cello & Accordion (0:27 – 0:59)]",
            "[Verse 1 (0:59 – 1:29)]\nThe smoke of our steadings still hung in the birch\nFrom the Braes of Glenmoriston down to the church\nOur cattle were driven, our brothers lay cold\nWhere the sleet of Culloden turned heather to mold\nSeven gaunt outlaws in that mountain cave\nWith no roof for the winter, no harvest to save\nChisholms and Grants with our backs to the stone\nEating wild roots and marrow we cracked from the bone",
            "[Verse 2 (1:34 – 2:24)]\nThen down through the bracken a beggar man crept\nIn a lice-ridden plaid where the mountain mist wept\nWith a price on his head from the German King's throne\nThirty thousand in gold if we gave up his bone\nHe had cost us our sons and the roofs overhead\nHe had marched us on biscuits to sleep with the dead\nYet he knelt by our embers, half-blind in the rain\nAnd asked for the shelter of broken-down men\nHugh Chisholm stepped forward and looked in his eyes\nNo bow to a palace, no courtier's lies\nJust a hand that was blistered and blackened with peat\nThat refused to take bread from a traitor's receipt",
            "[Chorus 1 (2:24 – 3:06)]\nKeep your thirty thousand pounds of the Butcher's blood coin!\nThere is no winter cold enough to make a Highlander join!\nYou can burn down the cottage and outlaw the clan\nYou can hunt us with dragoons across our own land\nWe swore on the dirk in the dark of the glen\nThat a king cannot purchase the honor of men!\nLet the Hanover magistrates count out their fee\nOur roofs are in ashes, our souls are still free!\n(Our souls are still free!)",
            "[Verse 3 (3:10 – 3:57)]\nFor three weeks we hid him where eagles scarce fly\nWhile Campbell militia men marched under sky\nPatrick Grant crept by night past the red picket line\nTo bring back an oatcake and salt from the brine\nWe watched our own wives digging weeds from the sod\nWhile we guarded a fortune that answered to God\nOne whisper at Fort Augustus down by the loch\nWould have bought back our ploughshares and ransomed our flock\nMy young brother whispered, look down at the smoke\nOur children are starving beneath the King's yoke\nI laid my cold palm on the hilt at my side\nIf we sell out a guest, then our fathers have died",
            "[Chorus 2 (3:57 – 4:32)]\nKeep your thirty thousand pounds of the Butcher's blood coin!\nThere is no winter cold enough to make a Highlander join!\nYou can burn down the cottage and outlaw the clan\nYou can hunt us with dragoons across our own land\nWe swore on the dirk in the dark of the glen\nThat a king cannot purchase the honor of men!\nLet the Hanover magistrates count out their fee\nOur roofs are in ashes, our souls are still free!",
            "[Bridge (4:36 – 5:05)]\nThe Prince sailed for France when the autumn wind blew\nBack to velvet and wine that the glen never knew\nAnd Hugh Chisholm walked onward through exile and years\nNever shaking that right hand for silver or fears\nFor it was not for Charlie we stood in that cave!\nIt was for the old law that our ancestors gave!",
            "[Guitar & Highland Fiddle Solo (5:05 – 5:11)]",
            "[Final Chorus (5:11 – 5:59)]\nKeep your thirty thousand pounds of the Butcher's blood coin!\nThere is no winter cold enough to make a Highlander join!\nYou can burn down the cottage and outlaw the clan\nYou can hunt us with dragoons across our own land\nWe swore on the dirk in the dark of the glen\nThat a king cannot purchase the honor of men!\nLet the Hanover magistrates count out their fee\nOur roofs are in ashes, our souls are still free!\nSeven poor outlaws in Glenmoriston stone\nNot a penny of silver, not an acre to own",
            "[Spoken Outro (6:05 – 6:14)]\nThey took the cattle.\nThey took the tartan.\nThey never got the word."
      ],
      "manuscript_lyrics_stanzas": [
            "[Spoken Cold Open (0:06 – 0:27)]\n\"Thirty thousand pounds of Hanover gold. Enough to buy an earldom. Enough to rebuild every burned roof in Inverness. And seven starving men in a hole in the rock, with nothing left to their names but the rain.\"",
            "[Verse 1 (0:59 – 1:34)]\nThe smoke was still curling through Glenmoriston's birch\nWhere the dragoons had ridden and gutted the kirk\nWe were seven gaunt shadows with prices to pay\nSince the sleet on the moorland had washed us away\nIn the cave of Coiraghoth where the mountain stream pours\nWith the heather for bedding and basalt for doors\nWe were chewing on roots and the marrow of bone\nWhile the patrols of the Butcher went riding alone",
            "[Verse 2 (1:34 – 2:24)]\nThen out of the bracken, half-blind in the mist\nCame a beggar in rags with a price on his wrist\nWith the lice in his plaid and the mud on his knees\nAnd a thirty-thousand-pound bounty carried on the breeze\nEnough gold to buy back the cattle they drove\nEnough for a pardon, a hearth, and a stove\nSeven broken-down outlaws, and there at our feet\nWas the head that could purchase the bread we could eat\nAnd Hugh Chisholm looked down at the hand at his side\nAll blackened with peat-smoke and blistered and dried\nThey did not bow down as a courtier bows\nIn a palace of velvet and easily-made vows\nThey took the cold hand of a stranger in flight\nAnd they gave him the word of the hills in the night",
            "[Chorus (2:24 – 3:06)]\nKeep your thirty thousand pounds of the Butcher's blood coin!\nThere is gold in London that we'll never join!\nThough our steadings are ashes and the gallows stand high\nAnd the redcoats are hunting beneath the grey sky\nYou can starve seven men in the rocks of the glen\nTill we're nothing but shadows and ghosts of clan men\nA king cannot purchase the honor of men\nYou have taken our land, our souls are still free!\n(Echo: Our souls are still free!)",
            "[Verse 3 (3:07 – 4:18)]\nFor three weeks we kept him where the eagles look down\nWith the pickets of Campbell a mile from the town\nPatrick Grant crept by night for a handful of salt\nAnd an oatcake of barley to season the vault\nWhile our wives in the valley dug weeds from the sod\nAnd the garrisons marched by the bayonets' nod\nNot a whisper went down to the fort by the loch\nThough the famine was grinding our bones on the rock\nDonald MacDonald looked out at the smoke in the trees\nWhere the roofs of his kinsmen were brought to their knees\nHe said, \"If I traded a guest at my fire\nFor the cattle of Stirling or gold of the shire\nThen the water of Ness would run backward in shame\nAnd my children would spit when they spoke of my name!\"\nSo I'll tighten my belt on the hunger inside\nBefore I would sell out a guest at my door\nFor the coin of a German or fear of the law\nWhat we swore in the heather, we keep in the straw\nWith our backs to the stone and the rain in our eyes\nWhere the oath of a Highlander never dies!",
            "[Chorus 2 (4:18 – 4:33)]\nA king cannot purchase the honor of men\nYou have taken our land, our souls are still free!",
            "[Bridge (4:33 – 5:11)]\nHe sailed back to France when the autumn winds blew\nTo the velvet and wine that a prince always knew\nAnd Hugh Chisholm walked out through the long lonely years\nAnd he never shook hands for their silver or fears\nFor it was not for Charlie we stood in that cave!\nIt was for the old law that our ancestors gave!",
            "[Final Chorus (5:33 – 5:59)]\nA king cannot purchase the honor of men\nYou have taken our land, our souls are still free!\nJust seven poor outlaws in Glenmoriston stone\nWho had thirty thousand pounds in the palms of their hands\nAnd let it wash out in the rain...",
            "[Spoken Outro (6:05 – 6:13)]\n\"They took the cattle. They took the tartan. They never got the word.\""
      ],
      "copyright_notice": "© 2026 The Shady River Bard / Shady River Homestead LLC. All rights reserved."
}
  ];

  const bySlug = {};
  singlesList.forEach(s => {
    bySlug[s.slug] = s;
  });

  window.SINGLES_DATA = {
    hub: {
      title: "The Singles Vault",
      subtitle: "Standalone Narrative Singles, Global Dispatches & Listener Heritage Chronicles",
      artist: "The Shady River Bard",
      canonicalUrl: "https://theshadyriverbard.com/singles/",
      description: "Beyond the 27-album conceptual tapestry, The Singles Vault houses standalone narrative ballads, historical inquiries, and listener heritage chronicles—songs born directly from family heirlooms, clan histories, working-class archives, and lived memory shared on the porch."
    },
    singles: singlesList,
    bySlug: bySlug,
    featuredSingle: bySlug["the-greenock-slate-and-the-gold-watch"]
  };
})();
