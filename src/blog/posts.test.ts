import { Option, Schema } from "effect"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, test } from "vitest"

import sampleDocument, {
  frontmatter as sampleFrontmatter,
} from "./fixtures/sample-post.md"
import { PostFrontmatter } from "./frontmatter"
import { findPostBySlug, makePost, posts } from "./posts"

const completePost = {
  title: "A post",
  description: "A description",
  author: "Gauvain Palanga",
  date: "2026-09-08",
  image: "/blog/a-post/cover.svg",
  imageAlt: "A cover",
  imageWidth: "1200",
  imageHeight: "630",
}

const decode = Schema.decodeUnknownSync(PostFrontmatter)

describe("blog posts", () => {
  test("every published post can be found by its slug", () => {
    posts.forEach(post => {
      expect(Option.isSome(findPostBySlug(post.slug)), post.slug).toBe(true)
    })
    expect(Option.isNone(findPostBySlug("missing"))).toBe(true)
  })

  test("builds a post from Markdown", () => {
    const post = makePost("sample-post", sampleFrontmatter, sampleDocument)
    expect(post.frontmatter.title).toBe("Sample post")
  })

  test("rejects a cover image outside the post's own folder", () => {
    expect(() =>
      makePost(
        "sample-post",
        { ...completePost, image: "/blog/other-post/cover.svg" },
        sampleDocument,
      ),
    ).toThrow()
  })

  test("rejects an invalid slug", () => {
    expect(() =>
      makePost("Not A Slug", sampleFrontmatter, sampleDocument),
    ).toThrow()
  })

  test("every cover exists in public at the declared path", () => {
    posts.forEach(post => {
      expect(
        existsSync(join("public", post.frontmatter.image)),
        post.slug,
      ).toBe(true)
    })
  })

  test("rejects a missing image or author", () => {
    expect(() => decode({ ...completePost, image: undefined })).toThrow()
    expect(() => decode({ ...completePost, author: undefined })).toThrow()
  })

  test.each(["2026-02-30", "2025-02-29", "2026-13-01", "2026-01-00"])(
    "rejects invalid date %s",
    date => {
      expect(() => decode({ ...completePost, date })).toThrow()
    },
  )

  test("accepts leap-day dates", () => {
    expect(decode({ ...completePost, date: "2024-02-29" }).date).toBe(
      "2024-02-29",
    )
  })
})
