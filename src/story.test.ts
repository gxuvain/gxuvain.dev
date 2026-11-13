import { Effect, Option } from "effect"
import { UrlRequest } from "foldkit/navigation"
import { Command, given, message, model, story } from "foldkit/story"
import { fromString as urlFromString } from "foldkit/url"
import { afterEach, describe, expect, test } from "vitest"

import { Menu } from "@foldkit/ui"

import { THEME_STORAGE_KEY } from "./colorScheme"
import {
  ApplyTheme,
  LoadBrowserTheme,
  LoadExternal,
  Message,
  Model,
  NavigateInternal,
  SaveThemePreference,
  update,
} from "./main"
import { AppRoute } from "./route"

const initialModel = Model.make({
  route: AppRoute.Home(),
  maybeThemePreference: Option.none(),
  systemTheme: "Light",
  themeMenu: Menu.init({ id: "theme-menu" }),
})

describe("color scheme", () => {
  test("restores an explicit preference independently of the system scheme", () => {
    story(
      update,
      given(initialModel),
      message(
        Message.CompletedLoadBrowserTheme({
          preference: "Light",
          systemTheme: "Dark",
        }),
      ),
      Command.expectExact(ApplyTheme({ theme: "Light" })),
      model(model => {
        expect(model.maybeThemePreference).toEqual(Option.some("Light"))
      }),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
    )
  })

  test("selecting a menu item saves and applies the preference", () => {
    story(
      update,
      given(
        Model.make({
          ...initialModel,
          maybeThemePreference: Option.some("Light"),
        }),
      ),
      message(
        Message.GotThemeMenuMessage({
          message: Menu.Message.SelectedItem({ index: 0, item: "System" }),
        }),
      ),
      Command.expectExact(
        ApplyTheme({ theme: "Light" }),
        SaveThemePreference({ preference: "System" }),
      ),
      model(model => {
        expect(model.maybeThemePreference).toEqual(Option.some("System"))
      }),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
    )
  })
})

const url = (href: string) => Option.getOrThrow(urlFromString(href))

describe("navigation", () => {
  test("an internal link pushes the URL instead of reloading", () => {
    story(
      update,
      given(initialModel),
      message(
        Message.ClickedLink({
          request: UrlRequest.Internal({
            url: url("https://gxuvain.dev/about"),
          }),
        }),
      ),
      Command.expectExact(
        NavigateInternal({ url: "https://gxuvain.dev/about" }),
      ),
      Command.resolve(NavigateInternal, Message.CompletedNavigateInternal()),
      message(Message.ChangedUrl({ url: url("https://gxuvain.dev/about") })),
      model(model => {
        expect(model.route).toEqual(AppRoute.About())
      }),
    )
  })

  test("an external link loads the page in the browser", () => {
    story(
      update,
      given(initialModel),
      message(
        Message.ClickedLink({
          request: UrlRequest.External({ href: "https://github.com/gxuvain" }),
        }),
      ),
      Command.expectExact(LoadExternal({ href: "https://github.com/gxuvain" })),
      Command.resolve(LoadExternal, Message.CompletedLoadExternal()),
      model(model => {
        expect(model.route).toEqual(AppRoute.Home())
      }),
    )
  })

  test("changing page closes an open theme menu", () => {
    story(
      update,
      given(
        Model.make({
          ...initialModel,
          themeMenu: { ...initialModel.themeMenu, isOpen: true },
        }),
      ),
      message(Message.ChangedUrl({ url: url("https://gxuvain.dev/blog") })),
      model(model => {
        expect(model.route).toEqual(AppRoute.Blog())
        expect(model.themeMenu.isOpen).toBe(false)
      }),
      Command.expectExact(Menu.FocusButton({ id: "theme-menu" })),
      Command.resolve(Menu.FocusButton, Menu.Message.CompletedFocusButton()),
    )
  })
})

describe("loading the saved color scheme", () => {
  afterEach(() => {
    localStorage.clear()
  })

  const load = () => Effect.runPromise(LoadBrowserTheme().effect)

  test("falls back to System when nothing is saved", async () => {
    expect(await load()).toMatchObject({ preference: "System" })
  })

  test("falls back to System when the saved value is invalid", async () => {
    localStorage.setItem(THEME_STORAGE_KEY, "Purple")
    expect(await load()).toMatchObject({ preference: "System" })
  })

  test.each(["Dark", "Light", "System"] as const)(
    "restores a saved %s preference",
    async preference => {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
      expect(await load()).toMatchObject({ preference })
    },
  )
})
