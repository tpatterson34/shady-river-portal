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
    }
  ];

  const bySlug = {};
  singlesList.forEach(s => {
    bySlug[s.slug] = s;
  });

  window.SINGLES_DATA = {
    hub: {
      title: "The Singles Vault",
      subtitle: "Standalone Narrative Singles & Listener Heritage Chronicles",
      artist: "The Shady River Bard",
      canonicalUrl: "https://theshadyriverbard.com/singles/",
      description: "Beyond the 27-album conceptual tapestry, The Singles Vault houses standalone narrative ballads, historical inquiries, and listener heritage chronicles—songs born directly from family heirlooms, clan histories, working-class archives, and lived memory shared on the porch."
    },
    singles: singlesList,
    bySlug: bySlug,
    featuredSingle: bySlug["the-greenock-slate-and-the-gold-watch"]
  };
})();
