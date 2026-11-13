import { readFileSync } from "node:fs"
import { describe, expect, test } from "vitest"

import { DARK_THEME_COLOR, LIGHT_THEME_COLOR } from "./colorScheme"

const styles = readFileSync("src/styles.css", "utf8")

const pageBackgroundIn = (selector: string): string | undefined => {
  const start = styles.indexOf(`${selector} {`)
  if (start === -1) {
    return undefined
  }
  const block = styles.slice(start, styles.indexOf("}", start))
  return /--page-background:\s*(#[0-9a-fA-F]{6})/.exec(block)?.[1]
}

describe("theme color", () => {
  test("the light page background matches the light theme color", () => {
    expect(pageBackgroundIn(":root")).toBe(LIGHT_THEME_COLOR)
  })

  test("the system-dark page background matches the dark theme color", () => {
    expect(pageBackgroundIn(':root:not([data-theme="Light"])')).toBe(
      DARK_THEME_COLOR,
    )
  })

  test("the explicit dark page background matches the dark theme color", () => {
    expect(pageBackgroundIn(':root[data-theme="Dark"]')).toBe(DARK_THEME_COLOR)
  })
})
