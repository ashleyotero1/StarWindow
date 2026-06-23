/**
 * Design tokens for the StarWindow UI.
 *
 * These are the cross-platform equivalent of CSS variables: a single source of
 * truth for the palette and shape values, referenced from `StyleSheet.create`
 * so the same values work on native (iOS/Android) and web.
 */

export const Palette = {
  /** Deep space background */
  background: '#000008',
  /** Brand cyan accent / glow */
  accent: '#00d4ff',
  /** Subtle accent used as the new-user button's resting border */
  accentMuted: '#0a1a2e',
  white: '#ffffff',

  cardBackground: '#01030a',
  cardBorder: '#0a1828',

  inputBackground: '#020810',
  inputBorder: '#0d1e30',
  inputText: '#aabbcc',
  placeholder: '#2a4055',

  signInBackground: '#00111f',
  newUserText: '#336688',

  tagline: '#334455',
  divider: '#080f18',
  dividerText: '#1a2a3a',
} as const;

export const Radius = {
  sm: 10,
  lg: 20,
} as const;
