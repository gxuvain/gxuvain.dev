import { Schema, pipe } from 'effect'
import { Route } from 'foldkit'
import { defineRouteUnion, literal, schemaSegment, slash } from 'foldkit/route'

export const AppRoute = defineRouteUnion({
  Home: {},
  About: {},
  Blog: {},
  Post: { slug: Schema.String },
  NotFound: { path: Schema.String },
})

export type AppRoute = typeof AppRoute.Type

export const homeRouter = pipe(Route.root, Route.mapTo(AppRoute.Home))
export const aboutRouter = pipe(literal('about'), Route.mapTo(AppRoute.About))
export const blogRouter = pipe(literal('blog'), Route.mapTo(AppRoute.Blog))

export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const postRouter = pipe(
  literal('blog'),
  slash(
    schemaSegment(
      'slug',
      Schema.String.check(Schema.isPattern(POST_SLUG_PATTERN)),
    ),
  ),
  Route.mapTo(AppRoute.Post),
)

const routeParser = Route.oneOf(postRouter, blogRouter, aboutRouter, homeRouter)

export const urlToAppRoute = Route.parseUrlWithFallback(
  routeParser,
  AppRoute.NotFound,
)
