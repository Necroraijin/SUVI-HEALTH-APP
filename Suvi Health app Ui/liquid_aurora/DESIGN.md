---
name: Liquid Aurora
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ecb2ff'
  on-secondary: '#520071'
  secondary-container: '#cf5cff'
  on-secondary-container: '#480063'
  tertiary: '#f0f9ff'
  on-tertiary: '#17343f'
  tertiary-container: '#c3e0ee'
  on-tertiary-container: '#486470'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f8d8ff'
  secondary-fixed-dim: '#ecb2ff'
  on-secondary-fixed: '#320047'
  on-secondary-fixed-variant: '#74009f'
  tertiary-fixed: '#cae7f6'
  tertiary-fixed-dim: '#aecbd9'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#2f4a56'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Lexend
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-margin-mobile: 20px
  container-margin-desktop: 40px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is built upon a "Liquid Glass" aesthetic, merging the precision of modern health-tech with the organic, soothing movements of the Northern Lights. It targets individuals seeking a mental and physical sanctuary, moving away from cold, data-heavy clinical interfaces toward an empathetic, "human-first" digital companion.

The visual narrative is defined by:
- **Atmospheric Depth:** Using semi-transparent surfaces (Glassmorphism) to create a sense of lightness and breathability.
- **Organic Movement:** Backgrounds are not static colors but fluid, slow-moving gradients that evoke a sense of calm and life.
- **Sophisticated Futurism:** High-end execution of translucency and blur, avoiding "gimmicky" effects in favor of functional clarity and emotional resonance.
- **Empathetic Interaction:** Elements feel floating and soft, responding to user input with "squishy," fluid transitions rather than rigid snaps.

## Colors

The palette is optimized for a dark-mode-first experience to reduce eye strain and enhance the luminescence of the "Aurora" effects.

- **Primary (Neon Cyan):** Used for critical actions, progress indicators, and active states. It represents clarity and vitality.
- **Secondary (Soft Violet):** Used for accents, secondary highlights, and emotional resonance.
- **Tertiary (Deep Indigo/Teal):** The foundation of the "Liquid" depths. These shades form the base layers and containers.
- **Background Strategy:** Utilize dynamic mesh gradients blending Deep Teal (#081E26), Midnight Indigo (#0F172A), and muted Emerald.
- **Surface Strategy:** Glass layers use high-saturation blurs (30px+) with low-opacity white or primary-tinted overlays (5-10% opacity) to maintain legibility.

## Typography

This design system utilizes a dual-typeface approach to balance friendliness with systematic utility.

- **Lexend (Headlines):** Chosen for its exceptional readability and soft, welcoming character. It serves as the "voice" of the app.
- **Inter (Body & UI):** Provides a neutral, highly functional counterpoint for data, labels, and long-form reading.

**Hierarchy Guidance:**
- Use `display-lg` sparingly for high-impact emotional moments (e.g., daily summaries or welcome screens).
- Maintain generous line-heights (1.5x for body) to ensure the interface feels "airy" and unhurried.
- Letter spacing should be tightened slightly for headlines and tracked out for small labels to ensure legibility against blurred glass backgrounds.

## Layout & Spacing

The layout philosophy is based on a **Fluid Floating Grid**. Elements are rarely "locked" to a rigid edge; instead, they float within safe margins to emphasize the liquid aesthetic.

- **Grid:** A 12-column fluid grid for desktop and a 4-column grid for mobile.
- **Vertical Rhythm:** Built on an 8px base unit. Consistent spacing (stack-md) between cards and sections is critical to maintain a sense of organized calm.
- **Margins:** Large outer margins (20px+) prevent the UI from feeling "cramped," allowing the background gradients to peek through and provide visual "oxygen."
- **Adaptive Reflow:** On mobile, complex card groups should stack vertically, while on tablet/desktop, they can expand into side-by-side "islands."

## Elevation & Depth

Depth is conveyed through **refractive glass layering** rather than traditional drop shadows.

1.  **Base Layer:** The "Aurora" mesh gradient (Deep Teals/Purples).
2.  **Surface Level:** Semi-transparent containers with a `backdrop-filter: blur(24px)` and a `1px` inner border (stroke) using a 20% white gradient to simulate a glass edge catching light.
3.  **Floating Level:** Interactive elements (buttons, active chips) use a soft glow (Outer Glow) tinted with the primary cyan or secondary violet, rather than a black shadow.
4.  **Z-Index Logic:** Higher-priority items have a "lighter" glass fill (15% opacity), while background containers have a "heavier" tint (5% opacity).

## Shapes

The shape language is defined by extreme softness. 

- **Radius Strategy:** All primary containers and buttons utilize a "Pill-shaped" or `2xl` (24px+) radius. Sharp corners are entirely avoided to maintain the "user-first" empathetic personality.
- **Interactive States:** On hover or tap, shapes should subtly "swell" (scale 1.02) rather than just change color, reinforcing the "liquid" metaphor.
- **Inner Content:** Cards containing images or nested buttons should have a slightly smaller radius (16px) to maintain visual nesting harmony.

## Components

- **Glass Cards:** The primary container. Must have a 1px white-to-transparent linear-gradient border (top-left to bottom-right). Background: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(30px)`.
- **Luminescent Buttons:** High-priority buttons use a solid-to-gradient fill of Cyan to Violet. They should have a subtle outer glow of the same color to appear as if they are emitting light.
- **Ghost Buttons:** Transparent fill with a 1px Cyan border. On hover, they fill with 10% Cyan.
- **Floating Action Buttons (FAB):** Circular, floating 24px above the bottom-right margin, featuring a deep glass blur and a vibrant icon.
- **Fluid Progress Bars:** Thicker than standard (12px height), using a glowing gradient fill and rounded caps.
- **Selection Chips:** Pill-shaped, using the secondary violet for the active state and semi-transparent indigo for the inactive state.
- **Input Fields:** Bottom-aligned labels. The field itself is a glass plate with a subtle "inner glow" on focus to highlight the active entry point.