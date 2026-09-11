# Trevor Swistchew — Publishing Portal & Digital Compendium

An interactive, multi-dimensional digital compendium and publishing portal for **Trevor Swistchew**, Scotland-based musician, songwriter, essayist, and cultural thinker.

---

## 1. Directory Structure & Architecture

```text
trevor-swistchew-portal/
├── index.html                      # Central Literary Salon Archive & Compendium Hub
├── templates/
│   └── essay-template.html         # Canonical interactive essay template
├── essays/                         # Production essays directory
│   └── <essay-slug>/
│       ├── index.html              # Rendered interactive essay experience
│       ├── banner.webp             # 16:9 banner artwork
│       └── audio/                  # Companion audio track (optional)
├── assets/
│   ├── css/
│   │   ├── salon-theme.css         # Tri-state reading themes (Peat, Stone, Parchment), drop-caps, tooltips
│   │   └── a11y.css                # WCAG 2.1 AA accessibility (skip-links, focus rings, reduced motion)
│   ├── js/
│   │   ├── reading-experience.js   # Reading theme switcher, font size adjuster, progress bar, footnote popovers
│   │   └── audio-companion.js      # Companion audio player controller, scrubber, track metadata
│   ├── images/
│   │   └── banner-placeholder.svg  # Default 16:9 atmospheric Scottish landscape banner
│   └── audio/                      # Shared audio assets
└── README.md                       # Editorial architecture & ingestion manual
```

---

## 2. Design System: Scottish Literary Salon

### Color Tokens
- **Peat & Loch (Dark)**: Deep peat charcoal (`#121110`), loch navy accents (`#0f172a`), muted parchment text (`#ece5da`).
- **Edinburgh Stone (Light)**: Weathered Edinburgh sandstone (`#f7f4ed`), dark slate ink (`#1e1b18`), tartan brass accents (`#9e7930`).
- **Aged Parchment (Sepia)**: Warm literary archive ivory (`#f2e8d5`), warm sepia text (`#292017`), antique gold accents (`#966c25`).
- **Accents**:
  - Tartan Brass & Gold: `#c5a059`
  - Rowan Thistle: `#9d2b45`
  - Highland Loch: `#38bdf8`

### Typography Stack
- **Headings & Display**: `Playfair Display` & `Cinzel`
- **Long-Form Reading Body**: `Source Serif 4` & `Lora` (18px base, 1.82 line-height)
- **Interface & Metadata**: `Inter`
- **Citations & Timestamps**: `JetBrains Mono`

---

## 3. The 4-Pillar Essay Exploration Architecture

Each published piece is structured into four immersive layers:

1. **Hero & Thesis Header**:
   - Thematic category badges, publication date, reading time, and word count.
   - 16:9 widescreen evocative banner art with image provenance.
   - Companion Song Badge with quick-listen integration.

2. **The Empirical Dossier / Infographic Component**:
   - Rigorous fact-finding and historical research synthesis.
   - Interactive Comparative Matrix / Chronological Timeline tabbed interface.

3. **Curated Reading Experience**:
   - Classical drop caps and numbered Roman numeral section dividers.
   - Prominently styled pull quotes with tartan/thistle accents.
   - Non-disruptive footnote tooltips (prevents bare digit leaks like `word.6`).
   - 100% verbatim authenticity to Trevor Swistchew's voice.

4. **The Musical Connection**:
   - Embedded HTML5 audio player with scrubber, time readout, and volume control.
   - Side-by-side adapted song lyrics and creative genesis liner notes.
   - Sticky header mini-player allowing readers to listen seamlessly while scrolling.

---

## 4. Ingestion Workflow (Feeding New Essays)

When ingesting a new essay:
1. Provide:
   - **Title & Theme**: Title of the essay and core topics.
   - **Raw Text / File Path**: Word doc, markdown, or plain text.
   - **Companion Song / Music**: Audio file, link, or lyrics adaptation (if available).
   - **Thematic Focus**: Key questions and historical/philosophical framework.
2. The pipeline will:
   - Perform deep empirical research on the topics discussed.
   - Generate the custom comparative matrix or timeline.
   - Clean citations into interactive footnote tooltips and endnotes.
   - Create `/essays/<essay-slug>/index.html` and update the compendium catalog in `index.html`.
