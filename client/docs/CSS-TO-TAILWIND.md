# Plain CSS → Tailwind Cheat Sheet

For teammates who know plain CSS and are new to Tailwind/NativeWind. Keep this open while you work. See [STYLING.md](./STYLING.md) for the bigger picture.

## The one idea

**Each Tailwind class = one line of CSS.** You stack them in `className` instead of writing a rule.

```css
/* CSS */
.box { padding: 16px; background: #01030a; border-radius: 20px; }
```
```tsx
{/* Tailwind */}
<View className="p-4 bg-card rounded-lg" />
```

That's the whole trick. No separate stylesheet, no class names to invent — you read the styles right on the element.

## Rules of thumb

1. **Numbers go up in steps of 4px. The class number is `px ÷ 4`.** `p-4` = 16px. `m-2` = 8px. `mt-6` = 24px. (Memorize: `4`=16, `2`=8, `1`=4.)
2. **First letter(s) = the property, the rest = the value.** `bg-` background, `text-` text color/size, `p-` padding, `m-` margin, `border-` border, `rounded-` border-radius, `w-`/`h-` width/height.
3. **Direction is a letter after the property.** `t` top, `b` bottom, `l` left, `r` right, `x` left+right, `y` top+bottom. So `px-4` = `padding-left/right: 16px`, `mt-2` = `margin-top: 8px`.
4. **Colors are names, not hex.** Use our theme names (`bg-accent`, `text-tagline`) — never paste a hex code. New color? Add it to the theme first (see STYLING.md).
5. **Can't find a class? Use the escape hatch:** square brackets hold a literal value → `mt-[13px]`, `bg-[#01030a]`, `w-[420px]`. Works, but if you reuse it, promote it to the theme.
6. **Stuck on a class name?** Search <https://nativewind.dev> or the Tailwind docs — type the CSS property, it shows the class.

## Translation table

### Spacing
| CSS | Class |
| --- | --- |
| `padding: 16px` | `p-4` |
| `padding: 12px 20px` | `py-3 px-5` |
| `padding-top: 8px` | `pt-2` |
| `margin: 0 auto` | `mx-auto` |
| `margin-bottom: 10px` | `mb-2.5` |
| `gap: 8px` | `gap-2` |

### Size
| CSS | Class |
| --- | --- |
| `width: 100%` | `w-full` |
| `width: 128px` | `w-32` (128÷4) |
| `max-width: 420px` | `max-w-[420px]` |
| `height: 100%` | `h-full` |
| `width: 50%` | `w-1/2` |

### Flexbox (this is how you lay things out in RN)
| CSS | Class |
| --- | --- |
| `display: flex` | (already on by default — see gotcha #1) |
| `flex-direction: row` | `flex-row` |
| `flex-direction: column` | `flex-col` |
| `align-items: center` | `items-center` |
| `justify-content: center` | `justify-center` |
| `justify-content: space-between` | `justify-between` |
| `flex: 1` | `flex-1` |
| `flex-grow: 1` | `grow` |

### Colors & background
| CSS | Class |
| --- | --- |
| `background: var(--color-card)` | `bg-card` |
| `color: var(--color-accent)` | `text-accent` |
| `background: transparent` | `bg-transparent` |
| `opacity: 0.6` | `opacity-60` |
| `background: rgba(accent, 0.5)` | `bg-accent/50` |

### Text
| CSS | Class |
| --- | --- |
| `font-size: 13px` | `text-sm` (use the named scale: `xs sm base lg xl 2xl…`) |
| `font-weight: bold` | `font-bold` |
| `font-weight: 900` | `font-black` |
| `text-align: center` | `text-center` |
| `letter-spacing: 4px` | `tracking-[4px]` |
| `text-transform: uppercase` | `uppercase` |

### Border & radius
| CSS | Class |
| --- | --- |
| `border: 1px solid var(--color-card-border)` | `border border-card-border` |
| `border-width: 1px` | `border` |
| `border-radius: 20px` | `rounded-lg` (our theme: `sm`=10, `lg`=20) |
| `border-radius: 9999px` | `rounded-full` |

### Position
| CSS | Class |
| --- | --- |
| `position: absolute` | `absolute` |
| `position: relative` | `relative` |
| `top: 0; left: 0` | `top-0 left-0` |
| `inset: 0` | `inset-0` |
| `z-index: 1000` | `z-[1000]` |

### States & responsive (prefix, then `:`)
| CSS | Class |
| --- | --- |
| `@media (min-width: 768px) { … }` | `md:…` e.g. `md:text-xl` |
| `.dark { … }` | `dark:…` e.g. `dark:bg-background` |
| `:hover { … }` *(web)* | `hover:…` |

## Worked example

Translating a real block from our login card:

```css
/* CSS you'd have written */
.card {
  width: 100%;
  background: #01030a;
  border-radius: 20px;
  border: 1px solid #0a1828;
  padding: 20px;
}
```
```tsx
{/* The className version */}
<View className="w-full bg-card rounded-lg border border-card-border p-5" />
```

Read it left to right: full width, card background, large radius, 1px card-border border, 20px padding. Same info, one line, right on the element.

## Gotchas coming from plain CSS

1. **Everything is already `display: flex`, and the default direction is `column`, not `row`.** This is React Native, not the web. To put things in a row you must say `flex-row`. There is no `display: block`/`inline`.
2. **No cascade / inheritance like the web.** Text styles don't inherit down — put `text-*` classes on the `<Text>` element itself, not a parent `<View>`. All text must live inside a `<Text>`.
3. **Numbers are density-independent units, not pixels.** `w-32` ≈ 128 units, which scales per device. Don't think in literal screen pixels.
4. **No CSS files for shared UI.** You don't create `.css` files — styling lives in `className`. (Plain `.css`/`var(--x)` only work on web and won't port to phones.) The theme variables are the *only* CSS we hand-write, and they live in one place.
5. **Not every CSS property exists.** No `float`, limited `grid` — use flexbox for layout. `:hover`/`:focus` work on web but do nothing on phones, so don't rely on them for core behavior.
6. **Dynamic/animated values stay on the `style` prop.** Anything computed at runtime (animations, measured sizes) uses `style={{ ... }}` like normal RN. Static looks use `className`.
```
