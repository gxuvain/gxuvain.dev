import { Effect, Option, Schema, Stream, pipe } from 'effect'
import { KeyValueStore } from 'effect/persistence'
import { Command, Dom, Runtime, Subscription, type Update } from 'foldkit'
import { type Document, type Html, type HtmlBuilder } from 'foldkit/html'
import { defineMessageUnion } from 'foldkit/message'
import { UrlRequest, load, pushUrl } from 'foldkit/navigation'
import { modifyFields } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import { BrowserKeyValueStore } from '@effect/platform-browser'
import * as Markdown from '@foldkit/markdown'

import {
  DARK_COLOR_SCHEME_QUERY,
  ResolvedTheme,
  THEME_STORAGE_KEY,
  ThemePreference,
  resolveTheme,
} from './colorScheme'
import aboutRaw from './content/about.md'
import { AppRoute, aboutRouter, homeRouter, urlToAppRoute } from './route'

const about = Markdown.decodeDocument(aboutRaw)

// MODEL

export const Model = Schema.Struct({
  route: AppRoute,
  count: Schema.Number,
  maybeThemePreference: Schema.Option(ThemePreference),
  systemTheme: ResolvedTheme,
})
export type Model = typeof Model.Type

// MESSAGE

export const Message = defineMessageUnion({
  ClickedIncrement: {},
  ClickedLink: { request: UrlRequest },
  ChangedUrl: { url: Url },
  CompletedNavigateInternal: {},
  CompletedLoadExternal: {},
  CompletedLoadBrowserTheme: {
    preference: ThemePreference,
    systemTheme: ResolvedTheme,
  },
  CompletedApplyTheme: {},
  CompletedSaveThemePreference: {},
  SelectedThemePreference: { value: Schema.String },
  ChangedSystemTheme: { theme: ResolvedTheme },
})

export type Message = typeof Message.Type

// INIT

export const init: Runtime.RoutingApplicationInit<Model, Message> = url => ({
  model: {
    route: urlToAppRoute(url),
    count: 0,
    maybeThemePreference: Option.none(),
    systemTheme: 'Light',
  },
  commands: [LoadBrowserTheme()],
})

// COMMAND

const NavigateInternal = Command.define('NavigateInternal', {
  args: { url: Schema.String },
  messages: [Message.CompletedNavigateInternal],
  execute: ({ url }) =>
    pushUrl(url).pipe(Effect.as(Message.CompletedNavigateInternal())),
})

const LoadExternal = Command.define('LoadExternal', {
  args: { href: Schema.String },
  messages: [Message.CompletedLoadExternal],
  execute: ({ href }) =>
    load(href).pipe(Effect.as(Message.CompletedLoadExternal())),
})

const LoadBrowserTheme = Command.define('LoadBrowserTheme', {
  messages: [Message.CompletedLoadBrowserTheme],
  execute: Effect.gen(function* () {
    const maybePreference = yield* Effect.gen(function* () {
      const store = yield* KeyValueStore.KeyValueStore
      const stored = yield* store.get(THEME_STORAGE_KEY)
      return Schema.decodeUnknownOption(ThemePreference)(stored)
    }).pipe(
      Effect.catch(() => Effect.succeed(Option.none<ThemePreference>())),
      Effect.provide(BrowserKeyValueStore.layerLocalStorage),
    )
    const systemTheme: ResolvedTheme = yield* Effect.sync(() =>
      window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches ? 'Dark' : 'Light',
    )

    return Message.CompletedLoadBrowserTheme({
      preference: Option.getOrElse(maybePreference, () => 'System'),
      systemTheme,
    })
  }),
})

export const ApplyTheme = Command.define('ApplyTheme', {
  args: { theme: ResolvedTheme },
  messages: [Message.CompletedApplyTheme],
  execute: ({ theme }) =>
    Effect.sync(() => {
      document.documentElement.dataset.theme = theme
      const themeColor = document.querySelector('meta[name="theme-color"]')
      if (themeColor !== null) {
        themeColor.setAttribute(
          'content',
          theme === 'Dark' ? '#161616' : '#faf9f6',
        )
      }
      return Message.CompletedApplyTheme()
    }),
})

export const SaveThemePreference = Command.define('SaveThemePreference', {
  args: { preference: ThemePreference },
  messages: [Message.CompletedSaveThemePreference],
  execute: ({ preference }) =>
    Effect.gen(function* () {
      const store = yield* KeyValueStore.KeyValueStore
      yield* store.set(THEME_STORAGE_KEY, preference)
      return Message.CompletedSaveThemePreference()
    }).pipe(
      Effect.catch(() =>
        Effect.succeed(Message.CompletedSaveThemePreference()),
      ),
      Effect.provide(BrowserKeyValueStore.layerLocalStorage),
    ),
})

// UPDATE

type UpdateReturn = Update.Return<Model, Message>

export const update = (model: Model, message: Message) =>
  Message.match<UpdateReturn>(message, {
    ClickedIncrement: () => ({
      model: modifyFields(model, { count: count => count + 1 }),
    }),
    ClickedLink: ({ request }) =>
      UrlRequest.match<UpdateReturn>(request, {
        Internal: ({ url }) => ({
          model,
          commands: [NavigateInternal({ url: urlToString(url) })],
        }),
        External: ({ href }) => ({
          model,
          commands: [LoadExternal({ href })],
        }),
      }),
    ChangedUrl: ({ url }) => ({
      model: modifyFields(model, { route: () => urlToAppRoute(url) }),
    }),
    CompletedLoadBrowserTheme: ({ preference, systemTheme }) => ({
      model: modifyFields(model, {
        maybeThemePreference: () => Option.some(preference),
        systemTheme: () => systemTheme,
      }),
      commands: [ApplyTheme({ theme: resolveTheme(preference, systemTheme) })],
    }),
    SelectedThemePreference: ({ value }) =>
      Option.match(Schema.decodeUnknownOption(ThemePreference)(value), {
        onNone: () => ({ model }),
        onSome: preference => ({
          model: modifyFields(model, {
            maybeThemePreference: () => Option.some(preference),
          }),
          commands: [
            ApplyTheme({ theme: resolveTheme(preference, model.systemTheme) }),
            SaveThemePreference({ preference }),
          ],
        }),
      }),
    ChangedSystemTheme: ({ theme }) => ({
      model: modifyFields(model, { systemTheme: () => theme }),
      commands: [
        ApplyTheme({
          theme: resolveTheme(
            Option.getOrElse(model.maybeThemePreference, () => 'System'),
            theme,
          ),
        }),
      ],
    }),
    CompletedNavigateInternal: () => ({ model }),
    CompletedLoadExternal: () => ({ model }),
    CompletedApplyTheme: () => ({ model }),
    CompletedSaveThemePreference: () => ({ model }),
  })

// VIEW

const APP_NAME = 'Foldkit App'

const appendAppName = (page: string): string => `${page} | ${APP_NAME}`

const routeTitle = (route: AppRoute): string =>
  pipe(
    AppRoute.match(route, {
      Home: () => 'Home',
      About: () => 'About',
      NotFound: () => 'Not Found',
    }),
    appendAppName,
  )

const navigationView = (h: HtmlBuilder<Message>): Html =>
  h.nav(
    [h.AriaLabel('Main navigation'), h.Class('flex gap-4')],
    [
      h.a([h.Href(homeRouter()), h.Class('underline')], ['Home']),
      h.a([h.Href(aboutRouter()), h.Class('underline')], ['About']),
    ],
  )

const pageView = (model: Model, h: HtmlBuilder<Message>): Html =>
  AppRoute.match(model.route, {
    Home: () =>
      h.section(
        [h.Class('grid gap-4')],
        [
          h.h1(
            [h.Id('page-title'), h.Class('text-4xl font-bold')],
            ['Statically generated home'],
          ),
          h.p(
            [],
            ['This route was rendered during the build and hydrated in place.'],
          ),
          h.button(
            [
              h.OnClick(Message.ClickedIncrement()),
              h.Class('counter-button w-fit px-4 py-2'),
            ],
            [`Count: ${model.count}`],
          ),
        ],
      ),
    About: () =>
      h.section(
        [h.Class('grid gap-4')],
        [
          h.h1([h.Id('page-title'), h.Class('text-4xl font-bold')], ['About']),
          Markdown.view(about),
        ],
      ),
    NotFound: ({ path }) =>
      h.section(
        [h.Class('grid gap-4')],
        [
          h.h1(
            [h.Id('page-title'), h.Class('text-4xl font-bold')],
            ['Not found'],
          ),
          h.p([], [`No statically generated page exists for ${path}.`]),
        ],
      ),
  })

const themeSelectorView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class('flex items-center gap-2')],
    [
      h.label([h.For('color-scheme')], ['Color scheme']),
      h.select(
        [
          h.Id('color-scheme'),
          h.Value(Option.getOrElse(model.maybeThemePreference, () => 'System')),
          h.OnChange(value => Message.SelectedThemePreference({ value })),
        ],
        [
          h.option([h.Value('System')], ['System']),
          h.option([h.Value('Dark')], ['Dark']),
          h.option([h.Value('Light')], ['Light']),
        ],
      ),
    ],
  )

export const subscriptions = Subscription.make<Model, Message>()(entry => ({
  systemTheme: entry(
    { isSystemPreference: Schema.Boolean },
    {
      modelToDependencies: model => ({
        isSystemPreference: Option.exists(
          model.maybeThemePreference,
          preference => preference === 'System',
        ),
      }),
      dependenciesToStream: ({ isSystemPreference }) =>
        Stream.when(
          Dom.streamFromMediaQuery({
            query: DARK_COLOR_SCHEME_QUERY,
            mapMatches: isDark =>
              Message.ChangedSystemTheme({ theme: isDark ? 'Dark' : 'Light' }),
          }),
          Effect.sync(() => isSystemPreference),
        ),
    },
  ),
}))

export const view = (model: Model, h: HtmlBuilder<Message>): Document => ({
  title: routeTitle(model.route),
  body: h.main(
    [h.Class('mx-auto grid min-h-screen max-w-3xl content-center gap-10 p-8')],
    [navigationView(h), themeSelectorView(model, h), pageView(model, h)],
  ),
})
