import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: "page",
      source: "pages/**",
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      schema: z.object({ date: z.string() }),
    }),
  },
});
