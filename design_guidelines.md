# NBA Stats Tracker - Design Guidelines

## Design Approach

**Reference-Based Hybrid**: ESPN's bold data presentation + NBA.com's premium aesthetic, enhanced with glassmorphism and gradients. **Utility-focused** with experience enhancements—data clarity paramount.

**Principles**: Premium sports broadcasting aesthetic • Bold, scannable hierarchy • Glassmorphism depth • Energetic NBA colors • Hero-driven sections

---

## Color System

**Primary**:
- Deep Court Blue `#1E3A8A` - backgrounds, navigation
- Electric Orange `#FB923C` - CTAs, live indicators, highlights
- Vibrant Purple `#7C3AED` - secondary accents, stats
- Neon Cyan `#06B6D4` - data viz, trends

**Neutral**: White `#FFFFFF` • Off-White `#F9FAFB` • Slate Gray `#64748B` • Deep Charcoal `#0F172A`

**Semantic**: Win Green `#10B981` • Loss Red `#EF4444` • Warning Amber `#F59E0B`

**Gradients**:
- Hero: Deep Blue → Purple (135deg)
- Card: Blue → transparent (radial top-left)
- Stat Highlight: Orange → Purple (horizontal)
- Live Glow: Pulsing orange → cyan

**Glassmorphism**: `backdrop-blur-xl` • 80-90% bg opacity • `border: 1px solid rgba(255,255,255,0.18)` • Large soft shadows

---

## Typography

**Fonts**:
- **Inter** - UI, navigation, body
- **Bebas Neue** - Scores, hero headlines
- **Roboto Mono** - Statistics, numerical data

**Scale**:
- Hero Scores: `text-8xl` (96px), Bebas Neue, `font-bold`, `tracking-tight`
- Large Display: `text-6xl` (60px), Bebas Neue, `font-bold`
- Section Headers: `text-4xl` (36px), Inter, `font-bold`
- Card Titles: `text-2xl` (24px), Inter, `font-semibold`
- Stats Values: `text-3xl` (30px), Roboto Mono, `font-bold`
- Body: `text-base` (16px), Inter, `font-medium`
- Labels: `text-sm` (14px) • Meta: `text-xs` (12px), Inter

**Rules**: Scores/stats use Bebas Neue or Roboto Mono • 7:1 contrast minimum • `tracking-tight` display, `tracking-normal` body

---

## Layout

**Spacing**: `3` (inline stats) • `6` (cards, gaps) • `8` (sections, grids) • `12` (major separation, hero)

**Grid**: Container `max-w-7xl mx-auto px-6` • Dashboard `grid-cols-12 gap-6` • Cards: 4-col desktop, 2-col tablet, 1-col mobile

---

## Components

### Hero Section
- Full-width gradient (Deep Blue → Purple)
- Height: `min-h-screen` (landing), `min-h-[600px]` (dashboard)
- Team logos `w-32 h-32` flanking score
- Score: `text-8xl` Bebas Neue, white
- Live status: pulsing orange dot
- Glassmorphic CTAs with `backdrop-blur-lg`
- Decorative gradient orbs (`absolute`, `blur-3xl`, `opacity-20`)

### Navigation
**Top Nav**: Fixed glassmorphic `backdrop-blur-xl bg-slate-900/80` • `h-20` • Active: `border-b-3 border-orange-500` • Orange logo glow • Gradient underline hover

**Tabs**: Glassmorphic pills `backdrop-blur-md` • Active: orange→purple gradient • Horizontal scroll mobile with snap

### Dashboard Cards
**Stat Cards**:
- Glassmorphic `p-8 rounded-2xl` • Border `1px white/10` • Large shadow
- Hover: `scale-[1.02]` with lift
- Value: `text-5xl` Roboto Mono, gradient text (orange→purple)
- Label: `text-sm uppercase tracking-wide`
- Trend arrow with green/red badge

**Player/Team Cards**:
- Horizontal layout (image left, stats right)
- Photo: `rounded-xl w-24 h-24` gradient border
- Name: `text-2xl font-bold`
- Stats: 3-column grid + mini sparkline

**Live Game Cards**:
- Compact horizontal scoreboards
- Pulsing orange border for live
- Logos `w-16 h-16`, scores `text-4xl` Bebas Neue
- Gradient based on leading team

### Data Tables
- Glassmorphic container, sticky gradient header
- Header: `text-xs uppercase tracking-wider white/90`
- Hover row: orange left border accent
- Numerical: Roboto Mono, right-aligned
- Top performers: gradient badge + star
- Sortable: animated chevrons

**Standings**: Gradient rank numbers (#1 gold) • Team color dot • Win/Loss green/red bg • Streak flame icon • Gradient playoff separator

### Visualizations
**Shot Chart** (700x650px):
- Dark court, neon SVG lines
- Gradient dots: green (makes), red (misses)
- Heatmap: blue→orange/red
- Glassmorphic tooltips + controls

**Play-by-Play** (900x530px):
- Dramatic lighting gradient
- Team color player dots + numbers
- Glowing orange ball with trail
- Glassmorphic timeline scrubber
- Orange progress fill

**Performance Charts** (600x400px):
- Gradient fills beneath curves
- Glassmorphic tooltips
- Grid lines `white/10`
- Axis: `text-xs uppercase`

### Modals & Overlays
**Player Modal**:
- Deep blue gradient overlay
- Glassmorphic `max-w-5xl` container
- Gradient name treatment
- Tabbed nav with gradient indicator

**Live Sidebar**:
- Slide-in right `w-[480px]`
- Glassmorphic with team gradient
- Play-by-play list + box score
- Custom orange scrollbar

### Buttons & Controls
**Hierarchy**:
- Primary: Gradient (orange→purple), white, `px-8 py-4 text-lg font-semibold rounded-xl`
- Secondary: Glassmorphic border, `backdrop-blur-md px-8 py-4`
- Icon: `w-12 h-12` glassmorphic circles
- Links: Gradient underline on hover

**On Images/Hero**: Always `backdrop-blur-xl` with semi-transparent bg • No custom hover states

**Forms**: Search glassmorphic `h-12 rounded-xl` • Toggles gradient track (orange→purple) • Sliders gradient fill

---

## Images

**Hero** (1920x1080px min):
- Dynamic game action photography
- Gradient overlay (deep blue→transparent)
- Background with subtle parallax
- Mid-dunk/celebration moments

**Players/Teams**:
- Headshots: `w-12 h-12` (tables), `w-28 h-28` (cards), `w-40 h-40` (modals), circular
- Logos: `w-10 h-10` (tables), `w-20 h-20` (cards), `w-32 h-32` (hero), square
- Team color glow + gradient borders

**Court**: Custom SVG neon lines, gradient shading for depth

---

## Animations

**Use**:
- Hero: Staggered fade-in (`duration-700`, 100ms delays)
- Cards: Hover `scale-[1.02] duration-300`
- Live: `pulse-slow` opacity
- Score updates: Count-up `duration-500`
- Charts: Draw-in `duration-800 ease-out`
- Buttons: Gradient shift `duration-200`
- Modals: Slide-up + fade `duration-400`

**Avoid**: Page transitions • Scroll effects • Particle effects

---

## Accessibility

- Touch targets: `h-12 w-12` minimum
- Contrast: 7:1 ratio all text
- Focus: Prominent orange ring with offset
- Glassmorphism: Solid fallback backgrounds
- Alt text all images
- ARIA labels icon-only buttons
- Keyboard nav with visible focus
- Screen reader live score announcements
- Gradient readability checks

---

## Responsive

**Mobile (<768px)**: Hero `min-h-[500px]` • Cards full-width `p-6` • Tables horizontal scroll • Reduced blur • Fonts -30%

**Tablet (768-1024px)**: Hero `min-h-[600px]` • 2-col grid • Drawer nav

**Desktop (1024px+)**: Full treatments • 4-col layouts • Multi-panel • PiP live games