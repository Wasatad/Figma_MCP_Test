# KRON Design Tokens & UI Library

Design tokens and foundational UI building blocks extracted from the KRON Figma libraries:

- **Design system:** https://www.figma.com/design/B4rPwSme90DfmqZBPWTDTS
- **Components:** https://www.figma.com/design/4HQeCy54NZ7HCh0v4ku5fX

## Folder structure

```
├── design-tokens/
│   ├── colors.css          # Color & gradient tokens
│   ├── spacing.css         # Spacing + radius scale
│   ├── typography.css      # Type ramps (display, text, labels)
│   └── variables.css       # Aggregated entry + shadow/focus tokens
└── components/ui/
    ├── _variables.css      # Component-level CSS custom properties
    ├── button/
    │   ├── _button.css
    │   └── button.html
    ├── input/
    │   ├── _input.css
    │   └── input.html
    ├── dropdown/
    │   ├── _dropdown.css
    │   ├── dropdown.html
    │   └── dropdown.js
    ├── checkbox/
    │   ├── _checkbox.css
    │   └── checkbox.html
    └── index.css           # Public entry that imports all components
```

## Using the tokens

Import the token entry file once at the root of your application CSS:

```css
@import './design-tokens/variables.css';

body {
  font: var(--text-md-regular);
  color: var(--gray-900);
}
```

Token names mirror the Figma variable naming (e.g. `--primary-500`, `--num-4`, `--display-lg-semibold`). When Figma updates, re-run the export script or update the values in place to keep parity.

## Using the UI components

1. Import the bundled component CSS:

   ```html
   <link rel="stylesheet" href="components/ui/index.css" />
   ```

2. Copy the markup from each `*.html` file. The CSS follows strict BEM naming:

   - `btn`, `btn__icon`, `btn--primary`, `btn--ghost`, `btn--lg`, `btn--block`
   - `field`, `field--error`, `input__control`, `textarea__control`
   - `dropdown`, `dropdown__trigger`, `dropdown__option`, `dropdown__token`
   - `checkbox`, `checkbox--disabled`, `checkbox__box`, `checkbox__hint`

3. Keep the provided ARIA attributes (`aria-expanded`, `aria-invalid`, `aria-disabled`, `aria-checked`) for accessibility.

4. For interactive elements, load the JavaScript module(s):

   ```html
   <script src="components/ui/dropdown/dropdown.js" type="module"></script>
   ```

   The dropdown script enhances any node with `[data-dropdown]`, supports search, keyboard navigation, and multi-select tokens.

### Responsive behaviour

- Buttons become full-width on screens `<600px` when the `btn--block` modifier is used.
- Inputs, dropdowns, and checkbox groups collapse to 100% width on mobile while respecting the desktop max width defined in `_variables.css`.

### Extending components

- Override any component variables after importing `_variables.css`, e.g. to adjust button rounding:

  ```css
  :root {
    --btn-radius: var(--radius-8);
  }
  ```

- New component layers should import `../_variables.css` to gain access to the shared tokens.

## Accessibility & states

- Button, input, dropdown, and checkbox states (hover, focus, active, disabled, destructive) map directly to the variants shipping in the KRON Figma component set.
- Focus rings reuse `--focus-ring-…` tokens for consistent visible outlines.
- Dropdown and checkbox examples include `aria-live` regions and `aria-checked="mixed"` for indeterminate scenarios.

## Next steps

- Wire these static examples into your framework of choice by transforming the HTML into components (React, Vue, etc.).
- Automate token refreshes via the Figma Variables API if you need continuous sync.
- Add remaining KRON components (toggle, dropdown menu headers, form helpers) following the same structure.
