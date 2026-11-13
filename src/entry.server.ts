import { Effect } from "effect"
import { Server } from "foldkit/experimental"

import { posts } from "./blog/posts"
import { LIGHT_THEME_COLOR } from "./colorScheme"
import { init, view } from "./main"
import { postRouter } from "./route"

export const renderDocument: typeof Server.renderDocument = (
  application,
  assets,
) =>
  Server.renderDocument(application, assets, {
    head: `<meta name="theme-color" content="${LIGHT_THEME_COLOR}"><script src="/theme-init.js"></script>`,
  })

export const prerenderPaths: ReadonlyArray<string> = [
  "/",
  "/about",
  "/blog",
  ...posts.map(post => postRouter({ slug: post.slug })),
]

export const statusForPage = (url: string): number =>
  prerenderPaths.includes(new URL(url).pathname) ? 200 : 404

export const renderPage = (request: Request): Promise<Server.EntryResult> =>
  Effect.runPromise(
    Effect.gen(function* () {
      const renderedApplication = yield* Server.renderToString(
        { routing: {}, init, view },
        { url: request.url },
      )

      return Server.Rendered(renderedApplication, {
        status: statusForPage(request.url),
      })
    }),
  )
