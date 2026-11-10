import { Match, Schema } from 'effect'

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'
export const THEME_STORAGE_KEY = 'theme-preference'

export const ThemePreference = Schema.Literals(['Dark', 'Light', 'System'])
export type ThemePreference = typeof ThemePreference.Type

export const ResolvedTheme = Schema.Literals(['Dark', 'Light'])
export type ResolvedTheme = typeof ResolvedTheme.Type

export const resolveTheme = (
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme =>
  Match.value(preference).pipe(
    Match.withReturnType<ResolvedTheme>(),
    Match.when('Dark', () => 'Dark'),
    Match.when('Light', () => 'Light'),
    Match.when('System', () => systemTheme),
    Match.exhaustive,
  )
