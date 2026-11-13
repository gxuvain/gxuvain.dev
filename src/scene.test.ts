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
import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect as expectFile, test } from "vitest"

import { Menu } from "@foldkit/ui"

import samplePostDocument, {
  frontmatter as samplePostFrontmatter,
} from "./blog/fixtures/sample-post.md"
import { makePost } from "./blog/posts"
import * as Blog from "./blog/view"
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

const samplePost = makePost(
  "sample-post",
  samplePostFrontmatter,
  samplePostDocument,
)

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
  test.each(["logo-white.svg", "logo-dark.svg"])(
    "the home logo %s exists in public",
    file => {
      expectFile(existsSync(join("public", file))).toBe(true)
    },
  )

  test("renders the statically generated home page", () => {
    scene(
      { update, view },
      given(initialModel),
      expect(selector(".home-logo-light")).toHaveAttr("src", "/logo-white.svg"),
      expect(selector(".home-logo-dark")).toHaveAttr("src", "/logo-dark.svg"),
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

  test("shows an empty state while no post is published", () => {
    scene(
      { update, view },
      given(modifyFields(initialModel, { route: () => AppRoute.Blog() })),
      expect(role("heading", { name: "Blog" })).toExist(),
      expect(text("No posts yet.")).toExist(),
    )
  })

  test("lists the post cover, title, date, author, description, and read more link", () => {
    scene(
      { update, view: (_model, h) => Blog.indexView([samplePost], h) },
      given(initialModel),
      expect(role("heading", { name: "Blog" })).toExist(),
      expect(selector("img")).toHaveAttr("src", "/blog/sample-post/cover.svg"),
      expect(role("heading", { name: "Sample post" })).toExist(),
      expect(selector("time")).toHaveText("September 8, 2026"),
      expect(text("Gauvain Palanga", { exact: false })).toExist(),
      expect(text("A test-only post that exercises the blog views.")).toExist(),
      expect(role("link", { name: "Read more: Sample post" })).toHaveAttr(
        "href",
        "/blog/sample-post",
      ),
      expect(role("link", { name: "Read more: Sample post" })).toHaveText(
        "Read more →",
      ),
    )
  })

  test("renders a Markdown post with its image and byline", () => {
    scene(
      { update, view: (_model, h) => Blog.postView(samplePost, h) },
      given(initialModel),
      expect(role("heading", { name: "Sample post" })).toExist(),
      expect(role("img", { name: "Sample post cover" })).toHaveAttr(
        "src",
        "/blog/sample-post/cover.svg",
      ),
      expect(selector("time")).toHaveText("September 8, 2026"),
      expect(text("Gauvain Palanga", { exact: false })).toExist(),
      expect(role("heading", { name: "Welcome" })).toExist(),
      expect(
        text("This post only exists for tests and is never published."),
      ).toExist(),
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
