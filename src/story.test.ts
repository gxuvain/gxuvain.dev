import { Option } from 'effect'
import { Command, given, message, model, story } from 'foldkit/story'
import { describe, expect, test } from 'vitest'

import { ApplyTheme, Message, Model, update } from './main'
import { AppRoute } from './route'

const initialModel = Model.make({
  route: AppRoute.Home(),
  count: 0,
  maybeThemePreference: Option.none(),
  systemTheme: 'Light',
})

describe('color scheme', () => {
  test('restores an explicit preference independently of the system scheme', () => {
    story(
      update,
      given(initialModel),
      message(
        Message.CompletedLoadBrowserTheme({
          preference: 'Light',
          systemTheme: 'Dark',
        }),
      ),
      Command.expectExact(ApplyTheme({ theme: 'Light' })),
      model(model => {
        expect(model.maybeThemePreference).toEqual(Option.some('Light'))
      }),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
    )
  })

  test('ignores an invalid value from the native selector', () => {
    story(
      update,
      given(initialModel),
      message(Message.SelectedThemePreference({ value: 'invalid' })),
      Command.expectNone(),
      model(model => {
        expect(model.maybeThemePreference).toEqual(Option.none())
      }),
    )
  })
})
