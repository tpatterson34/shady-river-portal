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
      key_tempo_badge: "Celtic Folk-Rock // 1746 Highland Stand",
      key: "D Dorian / Minor",
      bpm: 68,
      duration: "05:28",
      release_year: 2026,
      release_status: "Official Audio & Music Video Out Now",
      title: "The Guns of Loch Fyne",
      title_accent_split: ["The Guns of", "Loch Fyne"],
      subtitle: "The 1746 Bombardment of Old Castle Lachlan & the Stand of the MacNair Tacksmen on the Cowal Shore",
      location: "Loch Fyne • Old Castle Lachlan (Strachur, Cowal Peninsula) • Drumossie Moor (Culloden)",
      genre: "Cinematic Gaelic & Highland Folk-Rock Ballad",
      thesis: "They could sail HMS Furnace up the saltwater tide to batter fifteenth-century stone into rubble and outlaw the tartan by royal decree, but as long as the tacksmen held the shallows with musket and lead while the women and children reached the bracken, the bloodline was never broken.",
      thesis_attribution: "— Historical Thesis • Inspired by Clan MacNair & Clan MacLachlan Lore Shared by Bob McNair",
      dedication: "Dedicated to subscriber Bob McNair (@bobmcnair9234) and the enduring bloodline of the MacNair tacksmen and Clan MacLachlan on the shores of Loch Fyne.",

      telemetry: [
        { label: "Historical Year", value: "Spring 1746", color_cls: "text-white" },
        { label: "Royal Navy Vessel", value: "HMS Furnace", color_cls: "text-retinal-400" },
        { label: "Ancestral Keep", value: "Castle Lachlan", color_cls: "text-amber-400" },
        { label: "Rearguard Line", value: "MacNair Tacksmen", color_cls: "text-emerald-400" }
      ],

      hero_art_caption_label: "Highland Resistance • Cowal Peninsula, 1746",
      hero_art_caption_title: "Old Castle Lachlan Under Bombardment on Loch Fyne",

      media: {
        youtubeVideoUrl: "https://youtu.be/T2WUvcxPLqw",
        spotifyUrl: "[INSERT_SPOTIFY_URL_OR_LEAVE_PENDING]",
        appleMusicUrl: "[INSERT_APPLE_MUSIC_URL_OR_LEAVE_PENDING]",
        amazonMusicUrl: "[INSERT_AMAZON_MUSIC_URL_OR_LEAVE_PENDING]"
      },

      art_banner: "assets/art/the-guns-of-loch-fyne-banner.webp",
      art_square: "assets/art/the-guns-of-loch-fyne-cover.webp",
      art_alt: "Across the churning misty waters of Loch Fyne in 1746, the ancient stone keep of Old Castle Lachlan stands wreathed in cannon smoke while the Royal Navy bomb vessel HMS Furnace fires broadsides from the saltwater loch; in the rocky foreground rest a Highland broadsword, targe shield, and flintlock musket.",

      pillar_badges: [
        "1746 Post-Culloden",
        "Clan MacLachlan & MacNair",
        "HMS Furnace Bombardment",
        "The Act of Proscription"
      ],

      tags: [
        "LochFyne",
        "CastleLachlan",
        "ClanMacNair",
        "ClanMacLachlan",
        "JacobiteRising",
        "Culloden1746",
        "HMSFurnace",
        "CelticFolkRock"
      ],

      quote: "Oh, the guns of Loch Fyne roared over the tide\nTore stone from the mortar where children would hide\nThey can batter the keep, they can outlaw the plaid\nThey can outlaw the tartan our fathers had had\nStand firm on the shoreline, MacNair hold the line\nThough Castle Lachlan must drown in Loch Fyne",

      bards_story: [
        "This song was sparked by a conversation with my friend and subscriber Bob McNair (@bobmcnair9234), who shared the deep oral and historical bond between his clan—the MacNairs—and Clan MacLachlan along the shores of Loch Fyne in Argyll. During the Jacobite Rising of 1745–1746, the MacLachlans were staunch Jacobites; their 17th Chief, Lachlan MacLachlan, served as aide-de-camp to Prince Charles Edward Stuart and rode north with his broadswords all the way to the frost and red clay of Drumossie Moor (Culloden), where he was killed leading the charge.",
        "While the Chief and the front-line Jacobite levy marched north, the MacNairs—who served as the trusted tacksmen (stewards, lieutenants, and enforcers of the estate)—were tasked with remaining behind on the Cowal peninsula to manage the lands, tend the cattle, and shield the women, children, and elderly left in the glen.",
        "Following the slaughter at Culloden in April 1746, Hanoverian retribution moved swiftly down the western sea lochs. Captain John Fergussone—notorious across the Highlands as 'The Black Captain'—sailed the Royal Navy bomb vessel HMS Furnace up the saltwater tides of Loch Fyne. Anchoring off Strachur, HMS Furnace turned its heavy naval artillery onto 15th-century Old Castle Lachlan, battering the ancestral keep into a roofless ruin while redcoat dragoons marched inland with torches under written immunity to pillage Jacobite estates and enforce the Disarming and Dress Acts outlawing the plaid and tartan.",
        "Yet when landing parties moved toward the beaches beneath the green hill, the MacNair tacksmen met them in the shallows with musket and lead—holding the shoreline long enough for the families of the estate to escape into the bracken by night. As Bob put it, the story called for a slow, deliberate, defiant Gaelic ballad in the spirit of Braveheart, anchored by low D tin whistle, Scottish smallpipes, weeping fiddle, cello, and thunderous bodhrán. (And a candid behind-the-scenes confession from the Bard: when generating the visual scenes for the video, I prompted the AI using the clan names assuming it knew the authentic MacLachlan and MacNair tartan sett—only to realize after uploading that the AI's tartan colors were completely off the mark! Consider it an unintended visual nod to the Dress Act of 1746, when the real tartans were outlawed anyway.)"
      ],

      musical_direction: {
        summary: "Solemn, Cinematic Gaelic & Highland Folk-Rock Ballad (68 BPM).",
        details: "Opens with a mournful low D tin whistle, weeping fiddle, and resonant cello over Loch Fyne mist before building into a slow, deliberate Highland march driven by Scottish smallpipes, acoustic guitar, double bass, and thunderous war-drum bodhrán—culminating in an anthemic gang-vocal chorus ('Hold the line! / Drown in Loch Fyne!')."
      },

      pillars_section: {
        badge: "Interactive Framework I // 3-Pillar Historical Matrix",
        title: "The Crown's Fury & The Tacksmen's Stand (1746)",
        intro: "After the Jacobite army fell at Drumossie Moor on April 16, 1746, the British Crown launched a systematic campaign of naval bombardment, estate burning, and cultural erasure across the Highlands and Western Isles—met on the shores of Loch Fyne by the rear-guard defiance of the tacksmen."
      },

      pillars: [
        {
          number: "I",
          code: "PILLAR I // THE CLAN COVENANT",
          title: "Drumossie Moor & The Tacksmen at the Threshold",
          stat_highlight: "April 16, 1746",
          stat_sub: "Chief Lachlan MacLachlan falls at Culloden while the MacNair tacksmen guard Cowal",
          icon: "fa-solid fa-people-roof",
          summary: "In the Highland clan structure, tacksmen held intermediate land leases ('tacks') from the Chief, serving as estate stewards, administrators, and military lieutenants responsible for the defense of the home glens.",
          analysis: "When Chief Lachlan MacLachlan led roughly 300 clansmen north to join the Atholl Brigade and the united MacLean/MacLachlan regiment at Culloden, the survival of the clan's families, cattle, and winter stores in Strathlachlan rested on the tacksmen left behind. When word arrived that the Chief had been killed by grape-shot on Drumossie Moor, the MacNairs stood as the sole shield between the bereaved glen and approaching government forces.",
          lyric_echo: "We kept the cattle, we shielded the glen / MacNair at the threshold for fallen men"
        },
        {
          number: "II",
          code: "PILLAR II // NAVAL TERROR",
          title: "Captain Fergussone & The Bombardment of HMS Furnace",
          stat_highlight: "HMS Furnace",
          stat_sub: "Royal Navy bomb vessel commanded by 'The Black Captain' John Fergussone",
          icon: "fa-solid fa-ship",
          summary: "Because Loch Fyne is a deep saltwater sea loch opening onto the Firth of Clyde, Royal Navy warships could sail directly into the heart of Argyll to shell Jacobite strongholds from the water.",
          analysis: "Captain John Fergussone of HMS Furnace became one of the most feared figures of the post-Culloden pacification—raiding Barra, Eigg, Raasay, and Loch Fyne. Anchoring off Garbhallt point,HMS Furnace unleashed its heavy cannon and mortars against Old Castle Lachlan's five-foot-thick medieval walls, tearing stone from mortar where women and children had sheltered.",
          lyric_echo: "The mast of the Furnace cut white through the foam / The Black Captain Fergusson hunting our home"
        },
        {
          number: "III",
          code: "PILLAR III // CULTURAL PROSCRIPTION",
          title: "The Dress Act of 1746 & The Unbroken Bloodline",
          stat_highlight: "1746–1782",
          stat_sub: "36 years under the Act of Proscription outlawing Highland dress, tartan & arms",
          icon: "fa-solid fa-ban",
          summary: "Alongside military raids, Parliament passed the Act of Proscription (1746), making it a crime punishable by imprisonment or seven years' transportation to the colonies to wear the plaid, philibeg, or tartan.",
          analysis: "While redcoat dragoons marched inland with torches under royal indemnity to burn crofts and confiscate broadswords, the MacNair tacksmen fought a desperate delaying skirmish in the rocky shallows of Loch Fyne. Though Old Castle Lachlan was battered into a silent stone ruin that still stands on the shore today, the families escaped into the hills—preserving the bloodline that would rebuild New Castle Lachlan generations later.",
          lyric_echo: "They can batter the keep, they can outlaw the plaid / Stand firm on the shoreline, MacNair hold the line"
        }
      ],

      timeline_section: {
        badge: "Interactive Framework II // Clan & Coastal Archive",
        title: "The Loch Fyne & Castle Lachlan Chronicle (1745–Present)",
        intro: "Follow the four acts of the Strathlachlan and Cowal peninsula defense—from the muster of 1745 and the smoke of Drumossie Moor to the bombardment on Loch Fyne and the living heritage carried today."
      },

      timeline: [
        {
          year: "Autumn 1745",
          era_badge: "ACT I // THE MUSTER OF STRATHLACHLAN",
          title: "The Chief Rides North & The Tacksmen's Charge",
          location: "Old Castle Lachlan, Cowal Peninsula, Argyll",
          icon: "fa-solid fa-flag",
          narrative: "Lachlan MacLachlan, 17th Chief of Clan MacLachlan, answers Prince Charles Edward Stuart's call and rides north with his broadswords. Before departing the hearths of the Cowal peninsula, the MacNair tacksmen—longtime stewards and enforcers for the MacLachlans—are entrusted with holding the threshold, tending the cattle, and guarding the families of the estate.",
          artifact_note: "Clan Covenant: The MacNair tacksmen entrusted with the defense of the Cowal peninsula"
        },
        {
          year: "April 16, 1746",
          era_badge: "ACT II // DRUMOSSIE MOOR",
          title: "Frost and Red Clay at Culloden",
          location: "Drumossie Moor (Culloden), Near Inverness",
          icon: "fa-solid fa-skull-crossbones",
          narrative: "On a sleet-swept moor at Culloden, Chief Lachlan MacLachlan leads the united regiment of MacLachlans and MacLeans into the teeth of Hanoverian canister shot and falls on the field. Word races back through the glens that the Jacobite army is scattered and royal dragoons and warships are moving west with orders of no quarter.",
          artifact_note: "Historical Record: Chief Lachlan MacLachlan killed in action at Drumossie Moor, April 16, 1746"
        },
        {
          year: "May–Summer 1746",
          era_badge: "ACT III // THE GUNS OF LOCH FYNE",
          title: "HMS Furnace & The Skirmish in the Shallows",
          location: "Saltwater Shores of Loch Fyne & Old Castle Lachlan",
          icon: "fa-solid fa-burst",
          narrative: "Captain John Fergussone ('The Black Captain') steers the Royal Navy bomb vessel HMS Furnace up Loch Fyne. While the ship's guns roar over the tide and batter Old Castle Lachlan's 15th-century stone walls, redcoats move to land and burn the estate. The MacNair tacksmen meet the landing parties in the shallows beneath the green hill with musket and lead while the women and children flee through the bracken by night.",
          artifact_note: "Coastal Stand: Old Castle Lachlan shelled by HMS Furnace; families shielded into the bracken"
        },
        {
          year: "1790–Present",
          era_badge: "ACT IV // THE RUIN & THE ROOT",
          title: "\"The Keep Was Broken, But the Bloodline Stood\"",
          location: "Strachur, Loch Fyne & Living Clan Memory",
          icon: "fa-solid fa-chess-rook",
          narrative: "Old Castle Lachlan was never inhabited again—its weathered stone walls still watch over the water gate of Loch Fyne today, while New Castle Lachlan was raised nearby in 1790 after the repeal of the Dress Act. Nearly three centuries later, subscriber Bob McNair carries the living oral history of the MacNair tacksmen who held the shoreline so the clan could endure.",
          artifact_note: "Enduring Monument: The 15th-century ruins of Old Castle Lachlan on the shore of Loch Fyne"
        }
      ],

      poeticsCallout: {
        badge: "EDITORIAL CALLOUT // THE TACKSMEN'S OATH & THEBARD'S TARTAN CONFESSION",
        title: "Stone vs. Bloodline: Why the Ruin on Loch Fyne Was a Victory",
        chorus_couple: "Stand firm on the shoreline, MacNair hold the line / Though Castle Lachlan must drown in Loch Fyne",
        intro: "At first glance, the bombardment of Old Castle Lachlan looks like another grim chapter in the post-Culloden clearances. Yet as Bob McNair emphasized when sharing his family's history, the stand on Loch Fyne reveals a deeper Highland truth—along with a humorous modern postscript from the video studio:",
        pillars: [
          {
            number: "01",
            title: "A Castle Is Mortar; A Clan Is Blood",
            body: "Captain Fergussone and HMS Furnace came to Loch Fyne expecting to crush the heart of the estate by battering its medieval stone keep. The MacNair tacksmen understood that fifteenth-century mortar could be sacrificed so long as the women, children, and elders escaped into the bracken. By holding the shallows with musket and lead, they traded a stone shell for a living future."
          },
          {
            number: "02",
            title: "The Unsung Role of the Tacksmen",
            body: "Popular histories of the '45 focus almost exclusively on princes, chiefs, and generals at Culloden. 'The Guns of Loch Fyne' honors the working spine of the clan—the tacksmen and stewards who stayed behind when the banners rode north, bearing the quiet duty of feeding the glen and standing at the threshold when the butcher men arrived."
          },
          {
            number: "03",
            title: "The Bard's Candid AI Tartan Confession",
            body: "A true confession from the making of the music video: when prompting the AI video generator with the historical clan names, the Bard assumed the model knew the authentic MacLachlan and MacNair tartan colors—only to discover after uploading that the AI's tartan patterns were completely off the mark! We like to think of it as an accidental tribute to the Dress Act of 1746: when the King outlawed the true tartan, the clans wore whatever defied the Crown."
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
