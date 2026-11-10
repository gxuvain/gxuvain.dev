import {
  Array,
  DateTime,
  Option,
  Order,
  Record,
  Schema,
  String,
  pipe,
} from 'effect'

import * as Markdown from '@foldkit/markdown'

import { PostFrontmatter } from './frontmatter'

const documentsByPath = import.meta.glob<unknown>('../content/blog/*.md', {
  eager: true,
  import: 'default',
})
const frontmatterByPath = import.meta.glob<unknown>('../content/blog/*.md', {
  eager: true,
  import: 'frontmatter',
})

export type Post = Readonly<{
  slug: string
  frontmatter: PostFrontmatter
  document: Markdown.MarkdownDocument
}>

const pathToSlug = (path: string): string =>
  pipe(
    path,
    String.replace('../content/blog/', ''),
    String.replace(/\.md$/, ''),
  )

const toPost = (path: string, rawDocument: unknown): Post => {
  const slug = pathToSlug(path)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid blog post slug: ${slug}`)
  }

  const rawFrontmatter = Option.getOrThrowWith(
    Option.flatMap(Record.get(frontmatterByPath, path), Option.fromNullishOr),
    () => new Error(`Blog post ${path} has no frontmatter`),
  )
  const frontmatter = Schema.decodeUnknownSync(PostFrontmatter)(rawFrontmatter)
  if (!frontmatter.image.startsWith(`/blog/${slug}/`)) {
    throw new Error(`Blog post ${path} must use its own cover image`)
  }

  return {
    slug,
    frontmatter,
    document: Markdown.decodeDocument(rawDocument),
  }
}

const byDateThenSlugDescending = Order.flip(
  Order.combine(
    Order.mapInput(Order.String, (post: Post) => post.frontmatter.date),
    Order.mapInput(Order.String, (post: Post) => post.slug),
  ),
)

export const posts: ReadonlyArray<Post> = pipe(
  Object.entries(documentsByPath),
  Array.map(([path, document]) => toPost(path, document)),
  Array.sort(byDateThenSlugDescending),
)

export const findPostBySlug = (slug: string): Option.Option<Post> =>
  Array.findFirst(posts, post => post.slug === slug)

export const formatPostDate = (date: string): string =>
  Option.match(DateTime.make(date), {
    onNone: () => date,
    onSome: value =>
      DateTime.formatUtc(value, { dateStyle: 'long', locale: 'en-US' }),
  })
