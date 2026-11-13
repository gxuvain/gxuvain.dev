import { Effect, Match, Option, Schema, Stream } from "effect"
import { KeyValueStore } from "effect/persistence"
import { Command, Dom, Runtime, Subscription, Update } from "foldkit"
import {
  type Document,
  type Html,
  type HtmlBuilder,
  childAttributes,
  inertHtml as ih,
} from "foldkit/html"
import { defineMessageUnion } from "foldkit/message"
import { UrlRequest, load, pushUrl } from "foldkit/navigation"
import { modifyFields } from "foldkit/struct"
import { Url, toString as urlToString } from "foldkit/url"

import { BrowserKeyValueStore } from "@effect/platform-browser"
import * as Markdown from "@foldkit/markdown"
import { Menu } from "@foldkit/ui"

import { findPostBySlug, posts } from "./blog/posts"
import * as Blog from "./blog/view"
import {
  DARK_COLOR_SCHEME_QUERY,
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  ResolvedTheme,
  THEME_STORAGE_KEY,
  ThemePreference,
  resolveTheme,
} from "./colorScheme"
import aboutRaw from "./content/about.md"
import homeRaw from "./content/home.md"
import * as Icon from "./icon"
import {
  AppRoute,
  aboutRouter,
  blogRouter,
  homeRouter,
  urlToAppRoute,
} from "./route"

const about = Markdown.decodeDocument(aboutRaw)
const home = Markdown.decodeDocument(homeRaw)

// MODEL

export const Model = Schema.Struct({
  route: AppRoute,
  maybeThemePreference: Schema.Option(ThemePreference),
  systemTheme: ResolvedTheme,
  themeMenu: Menu.Model,
})
export type Model = typeof Model.Type

// MESSAGE

export const Message = defineMessageUnion({
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
  GotThemeMenuMessage: { message: Menu.Message },
  ChangedSystemTheme: { theme: ResolvedTheme },
})

export type Message = typeof Message.Type

// INIT

export const init: Runtime.RoutingApplicationInit<Model, Message> = url => ({
  model: {
    route: urlToAppRoute(url),
    maybeThemePreference: Option.none(),
    systemTheme: "Light",
    themeMenu: Menu.init({ id: "theme-menu" }),
  },
  commands: [LoadBrowserTheme()],
})

// COMMAND

export const NavigateInternal = Command.define("NavigateInternal", {
  args: { url: Schema.String },
  messages: [Message.CompletedNavigateInternal],
  execute: ({ url }) =>
    pushUrl(url).pipe(Effect.as(Message.CompletedNavigateInternal())),
})

export const LoadExternal = Command.define("LoadExternal", {
  args: { href: Schema.String },
  messages: [Message.CompletedLoadExternal],
  execute: ({ href }) =>
    load(href).pipe(Effect.as(Message.CompletedLoadExternal())),
})

export const LoadBrowserTheme = Command.define("LoadBrowserTheme", {
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
      window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches ? "Dark" : "Light",
    )

    return Message.CompletedLoadBrowserTheme({
      preference: Option.getOrElse(maybePreference, () => "System"),
      systemTheme,
    })
  }),
})

export const ApplyTheme = Command.define("ApplyTheme", {
  args: { theme: ResolvedTheme },
  messages: [Message.CompletedApplyTheme],
  execute: ({ theme }) =>
    Effect.sync(() => {
      document.documentElement.dataset.theme = theme
      const themeColor = document.querySelector("meta[name=theme-color]")
      if (themeColor !== null) {
        themeColor.setAttribute(
          "content",
          theme === "Dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR,
        )
      }
      return Message.CompletedApplyTheme()
    }),
})

export const SaveThemePreference = Command.define("SaveThemePreference", {
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

const THEME_PREFERENCES: ReadonlyArray<ThemePreference> = [
  "System",
  "Dark",
  "Light",
]

const ThemeMenu = Menu.create<ThemePreference>()

const foldThemeMenuOutMessage = Menu.OutMessage.match<
  Update.Step<Model, Message>,
  Menu.OutMessage<ThemePreference>
>({
  Selected:
    ({ value: preference }) =>
    model => ({
      model: modifyFields(model, {
        maybeThemePreference: () => Option.some(preference),
      }),
      commands: [
        ApplyTheme({ theme: resolveTheme(preference, model.systemTheme) }),
        SaveThemePreference({ preference }),
      ],
    }),
})

const readThemeMenu = (model: Model): Option.Option<Menu.Model> =>
  Option.some(model.themeMenu)

const writeThemeMenu = (model: Model, nextThemeMenu: Menu.Model): Model =>
  modifyFields(model, { themeMenu: () => nextThemeMenu })

const toGotThemeMenuMessage = (message: Menu.Message): Message =>
  Message.GotThemeMenuMessage({ message })

const foldThemeMenu = Update.foldChild({
  update: ThemeMenu.update,
  read: readThemeMenu,
  write: writeThemeMenu,
  toParentMessage: toGotThemeMenuMessage,
  foldOutMessage: foldThemeMenuOutMessage,
})

const foldThemeMenuClose = Update.foldChildStep({
  update: ThemeMenu.close,
  read: readThemeMenu,
  write: writeThemeMenu,
  toParentMessage: toGotThemeMenuMessage,
  foldOutMessage: foldThemeMenuOutMessage,
})

export const update = (model: Model, message: Message) =>
  Message.match<UpdateReturn>(message, {
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
    ChangedUrl: ({ url }) =>
      Update.combine(model, [
        current => ({
          model: modifyFields(current, { route: () => urlToAppRoute(url) }),
        }),
        foldThemeMenuClose,
      ]),
    CompletedLoadBrowserTheme: ({ preference, systemTheme }) => ({
      model: modifyFields(model, {
        maybeThemePreference: () => Option.some(preference),
        systemTheme: () => systemTheme,
      }),
      commands: [ApplyTheme({ theme: resolveTheme(preference, systemTheme) })],
    }),
    GotThemeMenuMessage: ({ message }) => foldThemeMenu(model, message),
    ChangedSystemTheme: ({ theme }) => ({
      model: modifyFields(model, { systemTheme: () => theme }),
      commands: [
        ApplyTheme({
          theme: resolveTheme(
            Option.getOrElse(model.maybeThemePreference, () => "System"),
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

const routeTitle = (route: AppRoute): string =>
  AppRoute.match(route, {
    Home: () => "gxuvain.dev",
    About: () => "About | gxuvain.dev",
    Blog: () => "Blog | gxuvain.dev",
    Post: ({ slug }) =>
      Option.match(findPostBySlug(slug), {
        onNone: () => "Not Found | gxuvain.dev",
        onSome: post => `${post.frontmatter.title} | gxuvain.dev`,
      }),
    NotFound: () => "Not Found | gxuvain.dev",
  })

const navigationView = (h: HtmlBuilder<Message>): Html =>
  h.nav(
    [h.AriaLabel("Main navigation"), h.Class("flex gap-4")],
    [
      h.a([h.Href(homeRouter()), h.Class("underline")], ["Home"]),
      h.a([h.Href(aboutRouter()), h.Class("underline")], ["About"]),
      h.a([h.Href(blogRouter()), h.Class("underline")], ["Blog"]),
    ],
  )

const notFoundView = (path: string, h: HtmlBuilder<Message>): Html =>
  h.section(
    [h.Class("grid gap-4")],
    [
      h.h1([h.Id("page-title"), h.Class("text-4xl font-bold")], ["Not found"]),
      h.p([], [`No statically generated page exists for ${path}.`]),
    ],
  )

const homeLogoView = (h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("home-logo")],
    [
      h.img([
        h.Src("/logo-white.svg"),
        h.Alt(""),
        h.Width("80"),
        h.Height("80"),
        h.Class("home-logo-light"),
      ]),
      h.img([
        h.Src("/logo-dark.svg"),
        h.Alt(""),
        h.Width("80"),
        h.Height("80"),
        h.Class("home-logo-dark"),
      ]),
    ],
  )

const pageView = (model: Model, h: HtmlBuilder<Message>): Html =>
  AppRoute.match(model.route, {
    Home: () =>
      h.section(
        [h.Class("home-prose grid gap-4")],
        [homeLogoView(h), ...Markdown.viewBlocks(home)],
      ),
    About: () =>
      h.section(
        [h.Class("grid gap-4")],
        [
          h.h1([h.Id("page-title"), h.Class("text-4xl font-bold")], ["About"]),
          h.div([h.Class("space-y-6")], Markdown.viewBlocks(about)),
        ],
      ),
    Blog: () => Blog.indexView(posts, h),
    Post: ({ slug }) =>
      Option.match(findPostBySlug(slug), {
        onNone: () => notFoundView(`/blog/${slug}`, h),
        onSome: post => Blog.postView(post, h),
      }),
    NotFound: ({ path }) => notFoundView(path, h),
  })

const themePreferenceIcon = (
  preference: ThemePreference,
  className: string,
): Html =>
  Match.value(preference).pipe(
    Match.when("System", () => Icon.computer(className)),
    Match.when("Dark", () => Icon.moon(className)),
    Match.when("Light", () => Icon.sun(className)),
    Match.exhaustive,
  )

const THEME_MENU_ANCHOR: Menu.AnchorConfig = {
  placement: "bottom-end",
  gap: 8,
  padding: 8,
}

const themeMenuView = (model: Model, h: HtmlBuilder<Message>): Html => {
  const activePreference = Option.getOrElse(
    model.maybeThemePreference,
    (): ThemePreference => "System",
  )

  return h.submodel({
    slotId: "theme-menu",
    model: model.themeMenu,
    view: ThemeMenu.view,
    viewInputs: {
      anchor: THEME_MENU_ANCHOR,
      ariaLabel: `Color scheme: ${activePreference}`,
      items: THEME_PREFERENCES,
      itemToConfig: preference => {
        const isSelected = preference === activePreference

        return {
          className:
            "theme-menu-item w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm",
          content: ih.div(
            [ih.Class("flex w-full items-center gap-3")],
            [
              themePreferenceIcon(preference, "size-5 shrink-0"),
              ih.span([ih.Class("flex-1")], [preference]),
              Icon.check(
                isSelected ? "size-4 shrink-0" : "invisible size-4 shrink-0",
              ),
              ...(isSelected
                ? [ih.span([ih.Class("sr-only")], ["(selected)"])]
                : []),
            ],
          ),
        }
      },
      buttonContent: themePreferenceIcon(activePreference, "size-5"),
      buttonAttributes: childAttributes([
        ih.Class(
          "inline-flex size-8 cursor-pointer items-center justify-center rounded-md transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
      ]),
      itemsAttributes: childAttributes([
        ih.Class(
          "theme-menu-items z-[70] min-w-40 rounded-md border p-2 shadow-lg",
        ),
      ]),
      backdropAttributes: childAttributes([ih.Class("fixed inset-0 z-[60]")]),
      attributes: childAttributes([ih.Class("inline-flex")]),
    },
    toParentMessage: message => Message.GotThemeMenuMessage({ message }),
  })
}

export const subscriptions = Subscription.make<Model, Message>()(entry => ({
  systemTheme: entry(
    { isSystemPreference: Schema.Boolean },
    {
      modelToDependencies: model => ({
        isSystemPreference: Option.exists(
          model.maybeThemePreference,
          preference => preference === "System",
        ),
      }),
      dependenciesToStream: ({ isSystemPreference }) =>
        Stream.when(
          Dom.streamFromMediaQuery({
            query: DARK_COLOR_SCHEME_QUERY,
            mapMatches: isDark =>
              Message.ChangedSystemTheme({ theme: isDark ? "Dark" : "Light" }),
          }),
          Effect.sync(() => isSystemPreference),
        ),
    },
  ),
}))

const profiles = [
  { label: "gh", name: "GitHub", href: "https://github.com/gxuvain" },
  {
    label: "in",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/gauvain-palanga",
  },
  { label: "x", name: "X", href: "https://x.com/gxuvain" },
]

const footerView = (h: HtmlBuilder<Message>): Html =>
  h.footer(
    [h.Class("site-footer pb-8")],
    [
      h.hr([h.Class("mb-5")]),
      h.div(
        [
          h.Class(
            "flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
          ),
        ],
        [
          h.nav(
            [h.AriaLabel("Social links")],
            [
              h.ul(
                [h.Class("flex gap-6")],
                profiles.map(({ label, name, href }) =>
                  h.keyed("li")(
                    href,
                    [],
                    [
                      h.a(
                        [h.Href(href), h.AriaLabel(name), h.Rel("me")],
                        [label],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          h.p(
            [],
            ["Built with ", h.a([h.Href("https://foldkit.dev")], ["Foldkit"])],
          ),
        ],
      ),
    ],
  )

export const view = (model: Model, h: HtmlBuilder<Message>): Document => ({
  title: routeTitle(model.route),
  body: h.div(
    [h.Class("site-shell mx-auto max-w-3xl px-8")],
    [
      h.header(
        [h.Class("site-header sticky top-0 z-10")],
        [
          h.div(
            [
              h.Class(
                "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4",
              ),
            ],
            [navigationView(h), themeMenuView(model, h)],
          ),
        ],
      ),
      h.main(
        [
          h.Class(
            model.route._tag === "Home"
              ? "flex flex-1 flex-col justify-center py-8"
              : "flex-1 py-8",
          ),
        ],
        [pageView(model, h)],
      ),
      footerView(h),
    ],
  ),
})
