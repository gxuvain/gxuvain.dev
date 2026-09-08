<script lang="ts" setup>
const route = useRoute();
const { data: post } = await useAsyncData(route.path, () => queryCollection("blog").path(route.path).first());

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}
</script>

<template>
  <article
    class="mx-auto mt-15 max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)] lg:gap-x-10"
  >
    <header class="lg:col-start-2">
      <NuxtLink
        to="/blog"
        class="mb-8 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors duration-300 hover:text-white"
      >
        <Icon name="hugeicons:arrow-left-01" size="14" aria-hidden="true" />
        Back to blog
      </NuxtLink>

      <time :datetime="post.date" class="text-xs text-neutral-500">
        {{ formatDate(post.date) }}
      </time>
      <h1 class="mt-1 text-2xl font-bold tracking-tight text-white">
        {{ post.title }}
      </h1>
      <p v-if="post.description" class="mt-2 text-sm leading-6 text-neutral-400">
        {{ post.description }}
      </p>
    </header>

    <aside
      v-if="post.body?.toc?.links?.length"
      aria-label="Table of contents"
      class="mt-10 lg:sticky lg:top-8 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start"
    >
      <TableOfContents
        :toc="post.body.toc"
        title="On this page"
        smooth
        class="post-toc"
      />
    </aside>

    <ContentRenderer
      :value="post"
      class="mt-10 space-y-5 leading-7 lg:col-start-2 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/20 [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_h2]:pt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:pt-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
    />
  </article>
</template>
