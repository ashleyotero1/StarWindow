# StarWindow Styling Guide

How we style the app. Read this before adding UI.

## TL;DR

- We are **web-first, then porting to iOS/Android.** Because of that, **never write styles that only work on the web.**
- We style with **NativeWind** (Tailwind for React Native): `className="bg-background p-4"`. The same code renders on web **and** native — no rewrite when we port.
- **Theme colors are CSS variables** defined in [`src/global.css`](../src/global.css) and mapped to Tailwind color names in `tailwind.config.js`. Change a color in one place, it updates everywhere, on every platform.
- Light/dark theming is handled by the `dark:` variant + a `.dark` class. Runtime/brand themes use NativeWind's `vars()`.

---

## Why not "just use CSS"?

This is an Expo / React Native project (it targets native via React Native and web via `react-native-web`). The instinct for a web-first project is: build it with `global.css`, CSS Modules, `className`, and `var(--x)`, then port later.

**That doesn't port.** Native (iOS/Android) has **no CSS engine.** A raw `.css` file, a `.module.css`, or a bare `var(--x)` in inline styles only affects the *web* bundle. If we build the core concept in plain CSS, the "port to native" is really a **full rewrite of every screen's styles** — the most expensive outcome.

NativeWind solves this: you write Tailwind utility classes, and it **compiles them to native styles** at build time. You get the CSS-like authoring experience you want now, and the same components light up on iOS/Android later with zero style rewrite.

> Existing exception: you'll see `*.web.tsx` files paired with `*.module.css` (e.g. `animated-icon.web.tsx`). Those are deliberately web-only platform variants. That pattern is fine for genuinely web-only chrome, but it is **not** how we build shared product UI — shared UI uses NativeWind.

---

## The approach: NativeWind + CSS-variable theme

### 1. Mental model

| You wanted… | We do it with… |
| --- | --- |
| A global CSS variables file | `:root { --color-accent: … }` in `src/global.css` |
| A global theme | Tailwind `theme.colors` mapping names → those variables |
| `class="..."` styling | `className="..."` on RN components (NativeWind) |
| Dark mode | `dark:` variant + `.dark` class / `useColorScheme()` |
| Runtime theme switching | NativeWind's `vars()` helper |

### 2. Defining the theme (the part you asked about)

**`src/global.css`** holds the variables. Store colors as **space-separated RGB channels** (not `#hex`) so Tailwind's opacity modifiers like `bg-accent/50` work:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* StarWindow palette — channels are "R G B" */
  --color-background: 0 0 8;        /* #000008 */
  --color-accent: 0 212 255;        /* #00d4ff */
  --color-accent-muted: 10 26 46;   /* #0a1a2e */
  --color-card: 1 3 10;             /* #01030a */
  --color-card-border: 10 24 40;    /* #0a1828 */
  --color-input: 2 8 16;            /* #020810 */
  --color-input-border: 13 30 48;   /* #0d1e30 */
  --color-input-text: 170 187 204;  /* #aabbcc */
  --color-tagline: 51 68 85;        /* #334455 */
}

/* Optional light theme — same variable names, different values */
.dark {
  /* the app is already a dark space theme, so :root is effectively our dark.
     Define a light theme here only if/when we add one. */
}
```

**`tailwind.config.js`** maps friendly names to those variables:

```js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background:   'rgb(var(--color-background) / <alpha-value>)',
        accent:       'rgb(var(--color-accent) / <alpha-value>)',
        'accent-muted':'rgb(var(--color-accent-muted) / <alpha-value>)',
        card:         'rgb(var(--color-card) / <alpha-value>)',
        'card-border':'rgb(var(--color-card-border) / <alpha-value>)',
        input:        'rgb(var(--color-input) / <alpha-value>)',
        'input-border':'rgb(var(--color-input-border) / <alpha-value>)',
        'input-text': 'rgb(var(--color-input-text) / <alpha-value>)',
        tagline:      'rgb(var(--color-tagline) / <alpha-value>)',
      },
      borderRadius: { sm: '10px', lg: '20px' },
    },
  },
};
```

> The existing [`src/constants/tokens.ts`](../src/constants/tokens.ts) is the source of these values. As we migrate, `global.css` becomes the single source of truth and `tokens.ts` is retired (see Migration below).

### 3. Using it in components

```tsx
import { View, Text, TextInput } from 'react-native';

export function Card() {
  return (
    <View className="w-full rounded-lg border border-card-border bg-card p-5">
      <TextInput
        className="mb-2.5 rounded-sm border border-input-border bg-input p-3 text-input-text"
        placeholder="Email"
        placeholderClassName="text-tagline"
      />
      <Text className="text-accent text-sm font-bold tracking-widest">SIGN IN</Text>
    </View>
  );
}
```

That same component renders on web today and on iOS/Android after the port — unchanged.

### 4. Dark mode

NativeWind reads the OS color scheme. Use the `dark:` variant for per-class overrides:

```tsx
<View className="bg-white dark:bg-background">
  <Text className="text-black dark:text-white">Hello</Text>
</View>
```

To force/toggle a scheme in code, use `useColorScheme()` from `nativewind` (not from `react-native`).

### 5. Runtime / brand themes

For themes you switch at runtime (e.g. a user-picked accent), override the variables with `vars()`:

```tsx
import { vars } from 'nativewind';

const oceanTheme = vars({ '--color-accent': '0 180 220' });

<View style={oceanTheme}>
  {/* everything using `accent` inside here re-themes */}
</View>
```

---

## One-time setup (not done yet)

> Verify versions against the current docs before running — NativeWind setup is version-sensitive and SDK 56 is recent. Stable NativeWind is **v4** (targets Tailwind CSS **v3.4**); **v5 is pre-release**. Docs: <https://www.nativewind.dev/docs/getting-started/installation> · Expo SDK 56: <https://docs.expo.dev/versions/v56.0.0/>

1. Install:
   ```
   npm install nativewind react-native-reanimated react-native-safe-area-context
   npm install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss
   npx tailwindcss init
   ```
   (`reanimated` and `safe-area-context` are already in this project.)
2. **`tailwind.config.js`** — add `presets: [require('nativewind/preset')]` and `content: ['./src/**/*.{ts,tsx}']` (see above).
3. **`global.css`** — add the `@tailwind` directives + `:root` variables (see above). It already exists at `src/global.css` and is already imported via `src/constants/theme.ts`.
4. **`babel.config.js`** — add the NativeWind preset:
   ```js
   presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
   ```
5. **`metro.config.js`** — wrap with `withNativeWind(config, { input: './src/global.css' })`.
6. **`app.json`** — ensure `"web": { "bundler": "metro" }`.
7. **`nativewind-env.d.ts`** — add `/// <reference types="nativewind/types" />` for `className` typing.

Ping the lead before doing this — it's a one-time, repo-wide change and should land in its own PR.

---

## Team conventions / rules

- **Default to `className`.** Reach for the `style` prop only for truly dynamic numeric values (animated interpolations, measured layout). Animated colors can still use the variables.
- **No hardcoded hex in components.** If a color isn't a token yet, add it to `global.css` + `tailwind.config.js` first, then use the class name. This keeps the theme global.
- **No raw `.css`/`.module.css` for shared product UI.** Those are web-only. CSS Modules are allowed *only* inside `*.web.tsx` platform-specific files for web-only chrome.
- **Use semantic names, not raw colors.** `bg-card`, `text-accent` — not `bg-[#01030a]`. Arbitrary values (`bg-[…]`) are a code-review smell; promote them to the theme.
- **Test web + at least one native target** (Expo Go / simulator) for any non-trivial layout before merging. Flexbox behaves slightly differently across platforms; catch it early.
- **Spacing & radius come from the Tailwind scale** (`p-4`, `rounded-lg`), not magic numbers.

---

## Migration path for existing screens

We already centralized colors in [`src/constants/tokens.ts`](../src/constants/tokens.ts) and use `StyleSheet.create` in [`src/pages/login-screen.tsx`](../src/pages/login-screen.tsx). To migrate:

1. Move each value from `tokens.ts` (`Palette`, `Radius`) into `global.css` as a CSS variable and into `tailwind.config.js` as a named color — same names, so it's a mechanical mapping.
2. Convert the screen's `StyleSheet` styles to `className` utilities, one component at a time.
3. Keep animated values (the `Animated.interpolate` border glows, the shooting-star animation) on the `style` prop — those are dynamic and stay imperative; just feed them the themed color variables.
4. Delete `tokens.ts` once nothing imports it.

`StyleSheet` + `tokens.ts` and NativeWind can coexist during the transition, so we don't need a big-bang rewrite — migrate screen by screen.
```
