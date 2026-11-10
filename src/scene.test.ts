import { Option } from 'effect'
import {
  Command,
  Subscription,
  change,
  click,
  expect,
  given,
  label,
  role,
  scene,
  text,
} from 'foldkit/scene'
import { modifyFields } from 'foldkit/struct'
import { describe, test } from 'vitest'

import {
  ApplyTheme,
  Message,
  Model,
  SaveThemePreference,
  update,
  view,
} from './main'
import { AppRoute } from './route'

const initialModel = Model.make({
  route: AppRoute.Home(),
  count: 0,
  maybeThemePreference: Option.none(),
  systemTheme: 'Light',
})

describe('view', () => {
  test('renders the statically generated home page', () => {
    scene(
      { update, view },
      given(initialModel),
      expect(text('Statically generated home')).toExist(),
      expect(role('button', { name: 'Count: 0' })).toExist(),
    )
  })

  test('renders the authored markdown on the about route', () => {
    scene(
      { update, view },
      given(modifyFields(initialModel, { route: () => AppRoute.About() })),
      expect(role('heading', { name: 'About' })).toExist(),
      expect(text('This page is authored in', { exact: false })).toExist(),
      expect(text('Markdown')).toExist(),
    )
  })

  test('lets a visitor choose a color scheme with a native select', () => {
    scene(
      { update, view },
      given(initialModel),
      expect(label('Color scheme')).toHaveValue('System'),
      change(label('Color scheme'), 'Dark'),
      expect(label('Color scheme')).toHaveValue('Dark'),
      Command.expectExact(
        ApplyTheme({ theme: 'Dark' }),
        SaveThemePreference({ preference: 'Dark' }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
      change(label('Color scheme'), 'Light'),
      expect(label('Color scheme')).toHaveValue('Light'),
      Command.expectExact(
        ApplyTheme({ theme: 'Light' }),
        SaveThemePreference({ preference: 'Light' }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
      change(label('Color scheme'), 'System'),
      expect(label('Color scheme')).toHaveValue('System'),
      Command.expectExact(
        ApplyTheme({ theme: 'Light' }),
        SaveThemePreference({ preference: 'System' }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
    )
  })

  test('uses the system scheme until a saved preference overrides it', () => {
    scene(
      { update, view },
      given(
        modifyFields(initialModel, {
          maybeThemePreference: () => Option.some('System'),
          systemTheme: () => 'Dark',
        }),
      ),
      expect(label('Color scheme')).toHaveValue('System'),
      Subscription.emit(Message.ChangedSystemTheme({ theme: 'Light' })),
      Command.expectExact(ApplyTheme({ theme: 'Light' })),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      change(label('Color scheme'), 'Dark'),
      Command.expectExact(
        ApplyTheme({ theme: 'Dark' }),
        SaveThemePreference({ preference: 'Dark' }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
      Subscription.emit(Message.ChangedSystemTheme({ theme: 'Light' })),
      Command.expectExact(ApplyTheme({ theme: 'Dark' })),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      expect(label('Color scheme')).toHaveValue('Dark'),
    )
  })

  test('clicking the counter increments the count', () => {
    scene(
      { update, view },
      given(initialModel),
      click(role('button', { name: 'Count: 0' })),
      expect(role('button', { name: 'Count: 1' })).toExist(),
    )
  })
})
