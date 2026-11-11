import * as Alchemy from "alchemy"
import { Stack } from "alchemy/Stack"
import * as Effect from "effect/Effect"

import * as Cloudflare from "@alchemy.run/cloudflare"

export const Website = Cloudflare.Website.Foldkit(
  "Website",
  Stack.useSync(({ stage }) => ({
    assets: { htmlHandling: "drop-trailing-slash" },
    ...(stage === "prod" ? { domain: "gxuvain.dev" } : {}),
  })),
)

export type WebsiteEnv = Cloudflare.InferEnv<typeof Website>

export default Alchemy.Stack(
  "GxuvainDev",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const website = yield* Website

    return { url: website.url }
  }),
)
