import { describe, expect, test } from "vitest"

import { statusForPage } from "./entry.server"

describe("static page delivery", () => {
  test.each(["/", "/about", "/blog"])("serves %s successfully", path => {
    expect(statusForPage(`https://example.com${path}`)).toBe(200)
  })

  test.each(["/missing", "/blog/missing", "/blog/hello-world"])(
    "returns 404 for %s instead of rendering a new page at the edge",
    path => {
      expect(statusForPage(`https://example.com${path}`)).toBe(404)
    },
  )
})
