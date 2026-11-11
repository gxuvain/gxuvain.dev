import { Option } from "effect"
import {
  Command,
  Subscription,
  change,
  expect,
  given,
  label,
  role,
  scene,
  selector,
  text,
  within,
} from "foldkit/scene"
import { modifyFields } from "foldkit/struct"
import { describe, test } from "vitest"

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
})

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
      expect(within(role("banner"), label("Color scheme"))).toExist(),
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

  test("lets a visitor choose a color scheme with a native select", () => {
    scene(
      { update, view },
      given(initialModel),
      expect(label("Color scheme")).toHaveValue("System"),
      change(label("Color scheme"), "Dark"),
      expect(label("Color scheme")).toHaveValue("Dark"),
      Command.expectExact(
        ApplyTheme({ theme: "Dark" }),
        SaveThemePreference({ preference: "Dark" }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
      change(label("Color scheme"), "Light"),
      expect(label("Color scheme")).toHaveValue("Light"),
      Command.expectExact(
        ApplyTheme({ theme: "Light" }),
        SaveThemePreference({ preference: "Light" }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
      change(label("Color scheme"), "System"),
      expect(label("Color scheme")).toHaveValue("System"),
      Command.expectExact(
        ApplyTheme({ theme: "Light" }),
        SaveThemePreference({ preference: "System" }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
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
      expect(label("Color scheme")).toHaveValue("System"),
      Subscription.emit(Message.ChangedSystemTheme({ theme: "Light" })),
      Command.expectExact(ApplyTheme({ theme: "Light" })),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      change(label("Color scheme"), "Dark"),
      Command.expectExact(
        ApplyTheme({ theme: "Dark" }),
        SaveThemePreference({ preference: "Dark" }),
      ),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      Command.resolve(
        SaveThemePreference,
        Message.CompletedSaveThemePreference(),
      ),
      Subscription.emit(Message.ChangedSystemTheme({ theme: "Light" })),
      Command.expectExact(ApplyTheme({ theme: "Dark" })),
      Command.resolve(ApplyTheme, Message.CompletedApplyTheme()),
      expect(label("Color scheme")).toHaveValue("Dark"),
    )
  })
})
