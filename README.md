# My Foldkit App

A statically generated Foldkit application built with Effect.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Markdown content

`@foldkit/markdown` compiles imported `.md` files during the Vite build. Home
and About are authored in `src/content/`. Blog posts live in
`src/content/blog/<slug>.md`; `src/blog/posts.ts` discovers them and the build
prerenders `/blog/<slug>` automatically. See `src/content/blog/hello-world.md`
for the required frontmatter: `title`, `description`, `author`, `date`
(`YYYY-MM-DD`), `image`, `imageAlt`, `imageWidth`, and `imageHeight`. Put each
cover in `public/blog/<slug>/cover.svg` (or png, webp, jpg), and use its
root-relative path in `image`. Blog frontmatter is validated by the same
Schema in Vite and Vitest. Markdown rejects raw HTML and unsafe links.

## Color scheme

The selector offers System, Dark, and Light. System follows the operating
system; an explicit choice is saved in localStorage. `public/theme-init.js`
applies the saved choice before CSS loads, and CSS media queries keep the
site readable in either scheme without JavaScript.

## Building and previewing

```bash
pnpm build
pnpm preview
```

The build is one `vite build`. `@foldkit/vite-plugin` builds the client bundle,
builds the server bundle, and generates a page for every path
`src/entry.server.ts` lists, all from that one command.

## Deploying to Cloudflare with Alchemy

`alchemy.run.ts` uses `Cloudflare.Website.Foldkit` to build and deploy this
Foldkit SSG site: prerendered pages and assets are served by Cloudflare, while
unknown paths reach the generated Worker and return a 404. Only the `prod`
stage declares `gxuvain.dev`. Staging has no custom domain; `www.gxuvain.dev`
is not served by the new Worker.

Following [Alchemy's Foldkit frontend guide](https://alchemy.run/cloudflare/frontend/foldkit/),
use `alchemy dev` for Foldkit's local Vite development server (with live reload),
then deploy a separate remote staging Worker to test on Cloudflare. With Node.js
24.11.1+ and a Cloudflare account with Workers enabled:

```bash
pnpm install
pnpm exec alchemy profile edit --add Cloudflare
pnpm exec alchemy dev
```

To test a remote staging deployment (in another terminal if dev is running):

```bash
pnpm exec alchemy deploy --stage staging
```

`deploy` shows its plan and asks for approval; `alchemy plan --stage staging` is
optional if you only want to inspect changes. Alchemy returns a Worker URL:
check `/`, `/about`, `/blog`, and `/blog/hello-world` there, and confirm an
unknown path returns 404. `alchemy dev` uses a separate local-dev stage by
default; **do not run it with `--stage staging`** against your remote staging
site. The first `dev`, `plan`, or `deploy` can bootstrap Alchemy's shared
Cloudflare state-store Worker. Keep using the same explicit stage for subsequent
staging deploys.

### Production and CI/CD

`gxuvain.dev` is served by the `prod` Worker; `www.gxuvain.dev` is not served or
redirected. Manual production deployments use
`pnpm exec alchemy deploy --stage prod`. The `.github/workflows/deploy.yml`
workflow runs typecheck, lint, tests,
and build for pull requests and pushes to `main`. Only a push to `main` deploys
the same `GxuvainDev` stack to its existing `prod` stage, after all checks pass.
It does not destroy the old Worker or create PR preview Workers.

Before the first CI deployment, use the separate Alchemy stack in
`stacks/github.ts` to mint a scoped Cloudflare deployment token and store it,
with the Cloudflare account ID, as GitHub Actions secrets. Following
[Alchemy's CI/CD tutorial](https://alchemy.run/cloudflare/tutorial/part-5/),
create an `admin` profile with **Cloudflare API Token/Key** credentials allowed
to create account API tokens (OAuth alone cannot), and GitHub credentials with
access to `gxuvain/gxuvain.dev`:

```bash
pnpm exec alchemy profile create admin
pnpm exec alchemy profile edit --config stacks/github.ts --profile admin --add Cloudflare
pnpm exec alchemy profile edit --config stacks/github.ts --profile admin --add GitHub
pnpm exec alchemy deploy --config stacks/github.ts --stage ci --profile admin
```

This credential stack is a one-time, privileged operation; do not use the admin
profile for normal site deploys. Confirm that `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` appear in the repository's **Settings → Secrets and
variables → Actions**. They must belong to the same Cloudflare account as the
existing `prod` state store and Worker. Never commit credentials. Optionally
configure required reviewers for the GitHub `production` environment and
require the `verify` check before merging into `main`. PR checks run once the
workflow is committed and pushed; the production deploy starts only after the
changes reach `main`.

## The build id

The build id does not make hydration correct. It makes hydration refuse when it
would otherwise be incorrect.

The generated page carries the id, and the client bundle carries its own copy.
Hydration compares the two before it reads the Flags payload or adopts DOM.
When they differ, startup stops and the document body is marked `inert`,
`aria-hidden`, and `data-foldkit-refused`. A nondismissable modal shield covers
its controls and existing top-layer content, then takes focus without closing
author-owned dialogs. Nothing moves, so no custom element reconnects and no
frame reloads.

Without that check, stale HTML from an earlier deployment can be hydrated by the
newer client. Where the old markup happens to line up with the new markup,
an input the old page called `email` can be adopted for whatever the new build
puts in that position, carrying what the visitor typed into it.

The comparison happens when a client boots against a page. A tab whose client
is already running when a deployment lands is not rechecked.

`@foldkit/vite-plugin` takes care of this. Each coordinated `vite build`
generates one opaque id and compiles it into Foldkit in the browser and server
artifacts. Supply `FOLDKIT_BUILD_ID` when those artifacts build in separate
jobs, or when you want the served id to name a deployment you can look up
later:

```bash
FOLDKIT_BUILD_ID="$CI_DEPLOYMENT_ID" pnpm build
```

The id is public HTML and must never contain a secret or be derived from one.
Every step of one deployment must share an id. Two deployments must never share
one. Reusing an id produces no warning because the ids agree and hydration
proceeds. Leave `FOLDKIT_BUILD_ID` unset when one `vite build` produces both
artifacts.

## Learn More

- [Foldkit Documentation](https://foldkit.dev)
- [Effect Documentation](https://effect.website)
