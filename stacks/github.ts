import * as Alchemy from "alchemy"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Redacted from "effect/Redacted"

import * as Cloudflare from "@alchemy.run/cloudflare"
import * as GitHub from "@alchemy.run/github"

export default Alchemy.Stack(
  "GxuvainDevCI",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { accountId } = yield* yield* Cloudflare.CloudflareEnvironment

    const token = yield* Cloudflare.ApiToken.AccountApiToken("DeployToken", {
      accountId,
      policies: [
        {
          effect: "allow",
          permissionGroups: [
            "Secrets Store Write",
            "Workers Scripts Write",
            "Account Settings Write",
          ],
          resources: { [`com.cloudflare.api.account.${accountId}`]: "*" },
        },
      ],
    })

    yield* GitHub.Secret("CloudflareDeployToken", {
      owner: "gxuvain",
      repository: "gxuvain.dev",
      name: "CLOUDFLARE_API_TOKEN",
      value: token.value,
    })

    yield* GitHub.Secret("CloudflareAccountId", {
      owner: "gxuvain",
      repository: "gxuvain.dev",
      name: "CLOUDFLARE_ACCOUNT_ID",
      value: Redacted.make(accountId),
    })
  }),
)
