---
paths:
  - "**/*.{tsx,jsx,vue,svelte,astro}"
  - "**/*.{css,scss}"
  - "**/*.html"
---

# Frontend and UI defaults

The project's component library, design tokens and existing screens win over these.

- Look for an existing component before building one, and compose from the project's primitives.
- Start from the semantic element (`button`, `a`, `label`, `nav`, `dialog`, `table`). Add ARIA only for what no element expresses.
- Everything reachable by mouse is reachable by keyboard, with a visible focus state and a sensible focus order. Every input has a label; every meaningful image has alt text.
- Build all the states: loading, empty, error, partial, and long content, alongside the happy path.
- Take colour, spacing, radius and type from the project's tokens. A raw hex value or pixel number in a component is a token that is missing.
- Lay out for the narrowest supported width first. Reserve space for images and async content so the page does not shift.
- Honour `prefers-reduced-motion` and `prefers-color-scheme`. Text meets a 4.5:1 contrast ratio.
- Keep server state in the data layer the project already uses, and derive values during render where a second piece of state would have to be kept in sync.
- Check the result in a real browser at phone and desktop width before saying it works.
