---
name: Aura Wellness
colors:
  surface: '#fff8f6'
  surface-dim: '#e8d6d1'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#fceae4'
  surface-container-high: '#f6e5df'
  surface-container-highest: '#f0dfd9'
  on-surface: '#221a16'
  on-surface-variant: '#54433b'
  inverse-surface: '#382e2a'
  inverse-on-surface: '#ffede7'
  outline: '#87736a'
  outline-variant: '#dac1b7'
  surface-tint: '#954921'
  primary: '#954921'
  on-primary: '#ffffff'
  primary-container: '#ff9d6e'
  on-primary-container: '#77320b'
  inverse-primary: '#ffb694'
  secondary: '#7d5354'
  on-secondary: '#ffffff'
  secondary-container: '#fec7c7'
  on-secondary-container: '#7a5051'
  tertiary: '#625b71'
  on-tertiary: '#ffffff'
  tertiary-container: '#bbb2cb'
  on-tertiary-container: '#4a4459'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb694'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#77320b'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#efb9b9'
  on-secondary-fixed: '#301214'
  on-secondary-fixed-variant: '#633c3d'
  tertiary-fixed: '#e8def8'
  tertiary-fixed-dim: '#ccc2dc'
  on-tertiary-fixed: '#1e192b'
  on-tertiary-fixed-variant: '#4a4458'
  background: '#fff8f6'
  on-background: '#221a16'
  surface-variant: '#f0dfd9'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system moves away from cold, technological efficiency toward a "Refined Wellness" philosophy. It evokes the serenity of a Mediterranean sunset—warm, optimistic, and deeply restorative. The brand personality is that of a wise, gentle companion: sophisticated but highly accessible.

The visual style is a hybrid of **Modern Minimalism** and **Glassmorphism**. It utilizes organic, cloud-like background gradients and translucent "soft glass" surfaces to create a sense of light and air. The aesthetic is high-end and editorial, prioritizing white space and elegant typography to reduce cognitive load and foster a sense of calm for the user.

## Colors

The palette is anchored in a "Sunset Glow" spectrum. The primary color is a soft, energized Peach (#FF9D6E) used for key actions and progress indicators. This is complemented by a palette of Muted Pinks and Warm Oranges that form the basis of the system's gradients.

The background is never pure white, but a warm Off-White (#FFF9F6) to reduce eye strain. Text is set in a deep, warm Charcoal (#4A3F3B) rather than black, maintaining high contrast while feeling softer and more natural. Interactive "glass" surfaces should use white at 40-60% opacity with a high background blur (20px-40px).

## Typography

This design system uses a high-contrast typographic pairing to balance luxury with utility. 

**Bodoni Moda** is the hero font, used for all headlines and emotional callouts. Its high-contrast strokes and elegant serifs provide a premium, editorial feel that distinguishes the app from standard utility trackers. 

**Lexend** is used for all functional text, data readouts, and navigation. Its hyper-legible, geometric construction ensures that even dense health data is easy to parse. Line heights are intentionally generous to maintain an open, "airy" feel throughout the interface.

## Layout & Spacing

The layout follows a fluid-to-fixed model. On mobile, it utilizes a 4-column grid with 24px side margins to provide ample breathing room. On larger screens, the content is centered with a max-width of 1200px.

The spacing rhythm is based on a 4px baseline, with a preference for larger gaps (32px+) between major sections to prevent visual clutter. Components should feel "floated" within the layout rather than boxed in, utilizing generous internal padding to emphasize the pebble-like shape of containers.

## Elevation & Depth

Depth is achieved through **Soft Tactility** rather than traditional elevation. 

1.  **Backdrop Blurs:** The primary method for creating hierarchy. Layered surfaces use a 30px-60px Gaussian blur on the background to suggest depth and focus.
2.  **Diffused Shadows:** Shadows are extremely soft (Blur: 30px, Spread: -5px) and tinted with a hint of the primary peach or warm neutral, avoiding grey/black shadows entirely.
3.  **Inner Glows:** To create a "pebble" effect, use a subtle 1px white inner border (20% opacity) on the top-left edge of containers and a soft inner shadow on the bottom-right to simulate physical volume.

## Shapes

The shape language is organic and "soft-touch." There are no sharp corners in this design system. Standard containers use a 1rem (16px) radius, but primary cards and the main navigation elements utilize a "Super-ellipse" or pebble-like rounding (up to 2rem/32px) to feel more comfortable and human. The "Suvi Orb" remains a perfect circle, acting as a geometric anchor in an otherwise fluid environment.

## Components

### The Core Orb
The central interaction point must be updated to a "Sunset Core." It features a multi-layered radial gradient: a bright golden-peach center (#FFD2A8) fading into a warm, translucent orange outer ring. It should pulse gently with an outer glow that matches the primary color.

### Buttons
Primary buttons are "Pill-shaped" (rounded-full). They use a solid fill of the primary color with a subtle drop shadow. Secondary buttons are "Glass buttons"—transparent with a white 1.5px border and a heavy background blur.

### Soft Glass Cards
Cards are the primary content container. They should be rendered with `rgba(255, 255, 255, 0.4)` background, a 40px blur, and a 1px white stroke at 30% opacity. They should appear to float over the colorful background gradients.

### Input Sliders
Sliders use a thick, translucent track with a large, tactile circular handle (#FF9D6E). The handle should have a soft, diffused shadow to make it appear "pressable."

### Chips & Tags
Small labels should use a lower-opacity version of the secondary color (#F8C1C1 at 20%) with dark neutral text to ensure readability without breaking the soft aesthetic.