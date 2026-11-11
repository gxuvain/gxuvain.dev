import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { describe, expect, test } from "vitest"

const themeInit = readFileSync("public/theme-init.js", "utf8")

const runThemeInit = (
  storedPreference: string | undefined,
  isSystemDark: boolean,
  isStorageBlocked = false,
) => {
  const documentElement = { dataset: { theme: "" } }
  const themeColor = { content: "" }

  runInNewContext(themeInit, {
    localStorage: {
      getItem: () => {
        if (isStorageBlocked) {
          throw new Error("Storage unavailable")
        }
        return storedPreference
      },
    },
    window: {
      matchMedia: (query: string) => {
        if (query !== "(prefers-color-scheme: dark)") {
          throw new Error(`Unexpected media query: ${query}`)
        }
        return { matches: isSystemDark }
      },
    },
    document: {
      documentElement,
      querySelector: () => ({
        setAttribute: (_name: string, content: string) => {
          themeColor.content = content
        },
      }),
    },
  })

  return { theme: documentElement.dataset.theme, color: themeColor.content }
}

describe("prepaint color scheme", () => {
  test("uses the system scheme without a saved choice", () => {
    expect(runThemeInit(undefined, true)).toEqual({
      theme: "Dark",
      color: "#161616",
    })
    expect(runThemeInit(undefined, false)).toEqual({
      theme: "Light",
      color: "#faf9f6",
    })
  })

  test("saved light and dark choices override the system scheme", () => {
    expect(runThemeInit("Light", true)).toEqual({
      theme: "Light",
      color: "#faf9f6",
    })
    expect(runThemeInit("Dark", false)).toEqual({
      theme: "Dark",
      color: "#161616",
    })
  })

  test("still paints if storage is unavailable or invalid", () => {
    expect(runThemeInit(undefined, true, true).theme).toBe("Dark")
    expect(runThemeInit("invalid", true).theme).toBe("Dark")
  })
})
