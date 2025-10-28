# NBA Stats Tracker - Design Guidelines

## Design Approach

**Hybrid Approach**: Combining ESPN/NBA.com reference patterns with Material Design system for data-dense components. This application is **utility-focused** with complex data visualization needs requiring custom interactive elements alongside established patterns for tables, filters, and navigation.

**Key Design Principles**:
- Data clarity over decoration
- Immediate information accessibility
- Scannable hierarchy for stats and metrics
- Purposeful interactions that enhance data exploration
- Court visualizations as hero elements

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - for UI, stats, tables
- Secondary: Roboto Mono (Google Fonts) - for numerical data, scores

**Type Scale**:
- Display (Game Scores): text-6xl (60px), font-bold
- Heading 1 (Page Titles): text-4xl (36px), font-bold
- Heading 2 (Section Headers): text-2xl (24px), font-semibold
- Heading 3 (Card Titles): text-xl (20px), font-semibold
- Body (Stats Labels): text-base (16px), font-medium
- Small (Meta Info): text-sm (14px), font-normal
- Tiny (Timestamps): text-xs (12px), font-normal

**Numerical Data**: Use Roboto Mono at font-semibold for all statistics to ensure alignment and readability

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 (p-2, p-4, m-6, gap-8)
- Tight spacing (2): Between related stat items
- Standard spacing (4): Card padding, button gaps
- Comfortable spacing (6): Section padding, card gaps
- Generous spacing (8): Major section separation

**Grid System**:
- Container: max-w-7xl mx-auto px-4
- Dashboard Grid: grid grid-cols-12 gap-6
- Stat Cards: 3-column on desktop (grid-cols-3), 2-column tablet (md:grid-cols-2), 1-column mobile
- Data Tables: Full width with horizontal scroll on mobile

**Breakpoints**:
- Mobile: base (< 768px)
- Tablet: md (768px)
- Desktop: lg (1024px)
- Wide: xl (1280px)

---

## Component Library

### Navigation

**Top Navigation Bar**:
- Fixed position with backdrop blur
- Height: h-16
- Horizontal layout with logo left, main nav center, user actions right
- Nav items: text-sm font-medium with p-4
- Active state: underline decoration-2 underline-offset-8

**Secondary Navigation (Tabs)**:
- Horizontal scrollable tabs for conference switching (East/West/All)
- Pill-style tabs with px-6 py-2
- Active tab uses subtle border-b-2

### Dashboard Layout

**Sidebar (Desktop)**:
- Fixed left sidebar, w-64
- Quick filters and navigation
- Collapsible sections with chevron icons (Heroicons)
- Team/Player search at top with p-4

**Main Content Area**:
- Flexible width filling remaining space
- Sticky section headers during scroll

### Data Display Components

**Stat Cards**:
- Compact card with p-6 rounded-lg
- Large numeric value (text-4xl font-bold Roboto Mono)
- Label above (text-sm font-medium)
- Change indicator below (text-xs with up/down arrow icon)
- Trend sparkline (optional mini chart)

**League Standings Table**:
- Sticky header row
- Alternating row treatment for readability
- Team logo + name in first column (w-48)
- Stat columns: W, L, PCT, GB, STRK (each w-16 text-center)
- Hover row highlights entire row
- Conference separator with divider

**Player Stats Table**:
- Sortable columns (chevron icons)
- Avatar + player name column (w-64)
- Fixed left column during horizontal scroll
- Stat columns: MIN, PTS, REB, AST, STL, BLK, FG%, 3P%, FT% (each w-20)
- Top performers highlighted with subtle badge
- Filterable by position, team

**Live Game Scoreboard**:
- Horizontal card layout (h-24)
- Team logos facing center with scores (text-3xl font-bold)
- Quarter/Time below scores (text-sm)
- Live indicator (pulsing dot with "LIVE" text)
- Click to expand for detailed view

### Interactive Visualizations

**Basketball Court Shot Chart**:
- SVG court illustration at 600x550px
- Court lines in subtle stroke
- Plotted shots as circles (r-4 for makes, r-3 for misses)
- Heatmap overlay using gradient opacity
- Legend showing efficiency zones
- Toggle between shot chart and heatmap view
- Pan/zoom controls (bottom-right)

**Animated Play-by-Play Court**:
- Full court view (800x470px)
- Player dots (w-8 h-8 rounded-full) with jersey numbers (text-xs)
- Ball visualization (w-4 h-4 rounded-full)
- Movement trails (stroke-2 dashed)
- Timeline scrubber below court:
  - Progress bar showing game time
  - Play markers on timeline
  - Playback controls: Previous Play, Play/Pause, Next Play (icon buttons w-10 h-10)
  - Speed control: 0.5x, 1x, 2x (text-xs buttons)

**Shot Distribution Charts**:
- Donut chart showing 2PT vs 3PT vs FT percentages
- Court zones bar chart (Paint, Mid-Range, 3PT by section)
- Shooting percentage by quarter line chart
- SVG-based charts at 400x300px

**Performance Trend Lines**:
- Time-series line chart showing stats over games/season
- Multi-line for comparing players
- Interactive tooltips on hover
- Date range selector

### Interactive Tables

**Features**:
- Column sorting (click header, shows ascending/descending icon)
- Multi-column sorting (shift+click)
- Column filtering (dropdown icons in headers)
- Comparison mode (checkbox selection, highlights 2-3 rows)
- Sticky headers during scroll
- Export button (CSV download) in table toolbar

**Table Toolbar**:
- Height: h-12
- Search input (w-64) with search icon
- Filter chips showing active filters
- View options (compact/comfortable toggle)
- Export button (right-aligned)

### Forms & Controls

**Search Input**:
- Height: h-10
- Leading icon (search icon from Heroicons)
- Placeholder text: text-sm
- Autocomplete dropdown with player/team suggestions
- Rounded-lg border

**Dropdown Filters**:
- Height: h-10
- Chevron icon indicating expandable
- Multi-select with checkboxes
- Apply/Clear buttons in dropdown footer

**Toggle Switches**:
- Standard Material Design switch
- Use for binary options (Conference filter, Live only, etc.)

**Button Hierarchy**:
- Primary: px-6 py-2.5 rounded-lg font-semibold
- Secondary: px-6 py-2.5 rounded-lg font-medium border
- Icon buttons: w-10 h-10 rounded-lg (for toolbar actions)
- Text buttons: font-medium underline-offset-4 (for subtle actions)

### Modals & Overlays

**Player Detail Modal**:
- Full-screen overlay on mobile, centered modal on desktop (max-w-4xl)
- Header with player photo, name, team, position
- Tabbed content: Overview, Stats, Shot Chart, Recent Games
- Close button (top-right, w-10 h-10)

**Game Detail Sidebar**:
- Slide-in from right
- Width: w-96
- Box score, play-by-play list, team stats tabs
- Scrollable content area

---

## Animations

**Minimal & Purposeful**:
- Table row hover: translate-y-[-2px] (lift effect)
- Button hover: No custom animation (browser default)
- Live game pulse: Subtle opacity animation on live indicator only
- Shot chart plot: Fade-in on load
- Play-by-play animation: Smooth position transitions (duration-500)
- Chart data: Staggered fade-in on load (duration-300)

**No Animations**:
- Page transitions
- Scroll effects
- Decorative animations

---

## Icons

**Library**: Heroicons (via CDN)

**Common Icons**:
- Navigation: ChevronDown, ChevronUp, ChevronLeft, ChevronRight
- Actions: MagnifyingGlass, XMark, AdjustmentsHorizontal
- Stats: ArrowTrendingUp, ArrowTrendingDown
- Media: Play, Pause, Forward, Backward
- Data: TableCells, ChartBar, MapPin

**Icon Sizing**:
- Small: w-4 h-4 (inline with text)
- Medium: w-5 h-5 (buttons, labels)
- Large: w-6 h-6 (section headers)

---

## Images

**Hero Image**: Not applicable - this is a data-focused dashboard application

**Player/Team Photos**:
- Player headshots: Circular avatars at w-12 h-12 (tables), w-24 h-24 (cards), w-32 h-32 (modals)
- Team logos: Square at w-8 h-8 (tables), w-16 h-16 (scoreboards)
- Placeholder: Use team color or neutral background with initials

**Court Illustrations**:
- Custom SVG basketball court diagrams for shot charts and play-by-play
- Maintain NBA regulation proportions
- Use as background for data overlays

---

## Accessibility

- All interactive elements have min-height/width of h-10/w-10 for touch targets
- Tables include scope attributes and proper header relationships
- Form inputs have associated labels (visible or aria-label)
- Color is never the only indicator (use icons, text, patterns)
- Focus states visible on all interactive elements (ring-2 ring-offset-2)
- Keyboard navigation supported throughout (tab order, arrow keys for tables)
- Screen reader announcements for live score updates
- Alt text for all player/team images

---

## Responsive Behavior

**Mobile (< 768px)**:
- Sidebar collapses to hamburger menu
- Tables scroll horizontally with fixed first column
- Court visualizations scale down to full viewport width
- Stack stat cards vertically
- Simplified play-by-play (list view instead of court animation)

**Tablet (768px - 1024px)**:
- 2-column stat card grid
- Sidebar remains visible but narrower (w-48)
- Tables show fewer columns by default (expandable)

**Desktop (1024px+)**:
- Full 3-column layouts
- Side-by-side comparisons
- Picture-in-picture for live games while browsing stats
- Multi-panel views (standings + live games + highlights)