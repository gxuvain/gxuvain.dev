import { Effect } from 'effect'
import { Server } from 'foldkit/experimental'

import { init, view } from './main'

export const renderDocument: typeof Server.renderDocument = (
  application,
  assets,
) =>
  Server.renderDocument(application, assets, {
    head: '<meta name="theme-color" content="#faf9f6"><script src="/theme-init.js"></script>',
  })

export const prerenderPaths: ReadonlyArray<string> = ['/', '/about']

export const renderPage = (request: Request): Promise<Server.EntryResult> =>
  Effect.runPromise(
    Effect.gen(function* () {
      const renderedApplication = yield* Server.renderToString(
        { routing: {}, init, view },
        { url: request.url },
      )

      return Server.Rendered(renderedApplication)
    }),
  )
