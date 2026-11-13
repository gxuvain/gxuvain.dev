import { Option } from "effect"
import {
  Command,
  Mount,
  Subscription,
  click,
  expect,
  given,
  role,
  scene,
  selector,
  text,
  within,
} from "foldkit/scene"
import { modifyFields } from "foldkit/struct"
import { describe, test } from "vitest"

import { Menu } from "@foldkit/ui"

import { type ThemePreference } from "./colorScheme"
import {
  ApplyTheme,
  Message,
  Model,
  SaveThemePreference,
  update,
  view,
} from "./main"
import { AppRoute } from "./route"

const initialModel = Model.make({
  route: AppRoute.Home(),
  maybeThemePreference: Option.none(),
  systemTheme: "Light",
  themeMenu: Menu.init({ id: "theme-menu" }),
})

const button = (preference: ThemePreference) =>
  role("button", { name: `Color scheme: ${preference}` })

const chooseColorScheme = (
  current: ThemePreference,
  next: ThemePreference,
  theme: "Dark" | "Light",
) =>
  [
    click(button(current)),
    Command.resolve(Menu.FocusItems, Menu.Message.CompletedFocusItems()),
    Mount.resolveAll(
      [Menu.AnchorMenu, Menu.Message.CompletedAnchorMenu()],
      [Menu.PortalMenuBackdrop, Menu.Message.CompletedPortalMenuBackdrop()],
    ),
    click(role("menuitem", { name: new RegExp(`^${next}`) })),
    Mount.expectEnded(Menu.AnchorMenu, Menu.PortalMenuBackdrop),
    Command.expectExact(
      Menu.FocusButton({ id: "theme-menu" }),
      ApplyTheme({ theme }),
      SaveThemePreference({ preference: next }),
    ),
    Command.resolve(Menu.FocusButton, Menu.Message.CompletedFocusButton()),
    Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
    Command.resolve(
      SaveThemePreference,
      Message.CompletedSaveThemePreference(),
    ),
    expect(button(next)).toExist(),
  ] as const

describe("view", () => {
  test("renders the statically generated home page", () => {
    scene(
      { update, view },
      given(initialModel),
      expect(role("heading", { name: "gxuvain.dev" })).toExist(),
      expect(text("Hey! I'm Gauvain", { exact: false })).toExist(),
      expect(
        within(role("main"), role("link", { name: "About me →" })),
      ).toHaveAttr("href", "/about"),
    )
  })

  test("keeps navigation in the header and lets home occupy the main region", () => {
    scene(
      { update, view },
      given(initialModel),
      expect(role("banner")).toExist(),
      expect(
        within(role("banner"), role("navigation", { name: "Main navigation" })),
      ).toExist(),
      expect(
        within(
          role("banner"),
          role("button", { name: "Color scheme: System" }),
        ),
      ).toExist(),
      expect(
        within(role("main"), role("heading", { name: "gxuvain.dev" })),
      ).toExist(),
      expect(
        within(role("main"), role("navigation", { name: "Main navigation" })),
      ).not.toExist(),
    )
  })

  test("shows a footer with the three social profiles on every page", () => {
    scene(
      { update, view },
      given(initialModel),
      expect(role("contentinfo")).toExist(),
      expect(role("separator")).toExist(),
      expect(role("link", { name: "GitHub" })).toHaveText("gh"),
      expect(role("link", { name: "GitHub" })).toHaveAttr(
        "href",
        "https://github.com/gxuvain",
      ),
      expect(role("link", { name: "LinkedIn" })).toHaveText("in"),
      expect(role("link", { name: "LinkedIn" })).toHaveAttr(
        "href",
        "https://www.linkedin.com/in/gauvain-palanga",
      ),
      expect(role("link", { name: "X" })).toHaveText("x"),
      expect(role("link", { name: "X" })).toHaveAttr(
        "href",
        "https://x.com/gxuvain",
      ),
      expect(role("contentinfo")).toContainText("Built with Foldkit"),
      expect(role("link", { name: "Foldkit" })).toHaveAttr(
        "href",
        "https://foldkit.dev",
      ),
    )
    scene(
      { update, view },
      given(modifyFields(initialModel, { route: () => AppRoute.About() })),
      expect(role("contentinfo")).toExist(),
      expect(role("link", { name: "GitHub" })).toExist(),
      expect(role("link", { name: "Foldkit" })).toExist(),
    )
  })

  test("renders the authored markdown on the about route", () => {
    scene(
      { update, view },
      given(modifyFields(initialModel, { route: () => AppRoute.About() })),
      expect(role("heading", { name: "About" })).toExist(),
      expect(
        text("I spend most of my time building software", { exact: false }),
      ).toExist(),
    )
  })

  test("lists the post cover, title, date, author, description, and read more link", () => {
    scene(
      { update, view },
      given(modifyFields(initialModel, { route: () => AppRoute.Blog() })),
      expect(role("heading", { name: "Blog" })).toExist(),
      expect(selector("img")).toHaveAttr("src", "/blog/hello-world/cover.svg"),
      expect(role("heading", { name: "Hello world" })).toExist(),
      expect(selector("time")).toHaveText("September 8, 2026"),
      expect(text("Gauvain Palanga", { exact: false })).toExist(),
      expect(
        text("A first note to make sure the Markdown-powered blog is ready."),
      ).toExist(),
      expect(role("link", { name: "Read more: Hello world" })).toHaveAttr(
        "href",
        "/blog/hello-world",
      ),
      expect(role("link", { name: "Read more: Hello world" })).toHaveText(
        "Read more →",
      ),
    )
  })

  test("renders a Markdown post with its image and byline", () => {
    scene(
      { update, view },
      given(
        modifyFields(initialModel, {
          route: () => AppRoute.Post({ slug: "hello-world" }),
        }),
      ),
      expect(role("heading", { name: "Hello world" })).toExist(),
      expect(
        role("img", {
          name: "Hello world in white text on a near-black background",
        }),
      ).toHaveAttr("src", "/blog/hello-world/cover.svg"),
      expect(selector("time")).toHaveText("September 8, 2026"),
      expect(text("Gauvain Palanga", { exact: false })).toExist(),
      expect(role("heading", { name: "Welcome" })).toExist(),
      expect(text("This is the first post on the new site.")).toExist(),
      expect(role("link", { name: "← Blog" })).toHaveAttr("href", "/blog"),
    )
  })

  test("shows not found for an unknown blog post", () => {
    scene(
      { update, view },
      given(
        modifyFields(initialModel, {
          route: () => AppRoute.Post({ slug: "absent" }),
        }),
      ),
      expect(role("heading", { name: "Not found" })).toExist(),
    )
  })

  test("lets a visitor pick a color scheme from a dropdown menu", () => {
    scene(
      { update, view },
      given(initialModel),
      expect(button("System")).toExist(),
      ...chooseColorScheme("System", "Dark", "Dark"),
      ...chooseColorScheme("Dark", "Light", "Light"),
      ...chooseColorScheme("Light", "System", "Light"),
    )
  })

  test("uses the system scheme until a saved preference overrides it", () => {
    scene(
      { update, view },
      given(
        modifyFields(initialModel, {
          maybeThemePreference: () => Option.some("System"),
          systemTheme: () => "Dark",
        }),
      ),
      expect(button("System")).toExist(),
      Subscription.emit(Message.ChangedSystemTheme({ theme: "Light" })),
      Command.expectExact(ApplyTheme({ theme: "Light" })),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      ...chooseColorScheme("System", "Dark", "Dark"),
      Subscription.emit(Message.ChangedSystemTheme({ theme: "Light" })),
      Command.expectExact(ApplyTheme({ theme: "Dark" })),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
    )
  })
})
