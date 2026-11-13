import { Array } from "effect"
import type { Html, HtmlBuilder } from "foldkit/html"

import * as Markdown from "@foldkit/markdown"

import type { Message } from "../main"
import { blogRouter, postRouter } from "../route"
import { type Post, formatPostDate } from "./posts"

const bylineView = (post: Post, h: HtmlBuilder<Message>): Html =>
  h.p(
    [],
    [
      h.time(
        [h.Datetime(post.frontmatter.date)],
        [formatPostDate(post.frontmatter.date)],
      ),
      ` · ${post.frontmatter.author}`,
    ],
  )

const coverView = (
  post: Post,
  alt: string,
  isLazy: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.img([
    h.Src(post.frontmatter.image),
    h.Alt(alt),
    h.Width(post.frontmatter.imageWidth),
    h.Height(post.frontmatter.imageHeight),
    ...(isLazy ? [h.Loading("lazy")] : []),
    h.Class("blog-cover"),
  ])

const postEntryView = (
  post: Post,
  index: number,
  h: HtmlBuilder<Message>,
): Html =>
  h.keyed("li")(
    post.slug,
    [],
    [
      h.article(
        [h.Class("grid gap-3")],
        [
          h.a(
            [h.Href(postRouter({ slug: post.slug }))],
            [
              coverView(post, "", index !== 0, h),
              h.h2(
                [h.Class("mt-4 text-2xl font-bold")],
                [post.frontmatter.title],
              ),
            ],
          ),
          bylineView(post, h),
          h.p([], [post.frontmatter.description]),
          h.a(
            [
              h.Href(postRouter({ slug: post.slug })),
              h.AriaLabel(`Read more: ${post.frontmatter.title}`),
            ],
            ["Read more →"],
          ),
        ],
      ),
    ],
  )

export const indexView = (
  posts: ReadonlyArray<Post>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("grid gap-8")],
    [
      h.h1([h.Class("text-4xl font-bold")], ["Blog"]),
      Array.isReadonlyArrayEmpty(posts)
        ? h.p([], ["No posts yet."])
        : h.ul(
            [h.Class("grid gap-12")],
            posts.map((post, index) => postEntryView(post, index, h)),
          ),
    ],
  )

export const postView = (post: Post, h: HtmlBuilder<Message>): Html =>
  h.article(
    [h.Class("grid gap-6")],
    [
      h.a([h.Href(blogRouter())], ["← Blog"]),
      coverView(post, post.frontmatter.imageAlt, false, h),
      h.header(
        [h.Class("grid gap-3")],
        [
          h.h1([h.Class("text-4xl font-bold")], [post.frontmatter.title]),
          bylineView(post, h),
          h.p([], [post.frontmatter.description]),
        ],
      ),
      h.div(
        [h.Class("post-prose space-y-6")],
        Markdown.viewBlocks(post.document),
      ),
    ],
  )
