<script lang="ts" setup>
const route = useRoute()
const { data: post } = await useAsyncData(() => queryCollection("blog").path(route.path).first())
</script>

<template>
  <article
    class="mx-auto mt-15 max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)] lg:gap-x-10"
  >
    <header class="lg:col-start-2">
      <div class="flex flex-col">
        <NuxtLink
          to="/blog"
          class="mb-8 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors duration-300 hover:text-white"
        >
          <Icon name="hugeicons:arrow-left-01" size="14" />
          Back to blog
        </NuxtLink>
        <time v-if="post" :datetime="post.date" class="text-xs text-neutral-500">
          {{ formatDate(post.date) }}
        </time>
      </div>
      <h1 class="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
        {{ post?.title }}
      </h1>
      <p v-if="post?.description" class="mt-2 text-xs leading-5 text-neutral-400 sm:text-sm sm:leading-6">
        {{ post.description }}
      </p>
    </header>
    <aside
      v-if="post?.body?.toc?.links?.length"
      class="mt-10 lg:sticky lg:top-8 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start"
    >
      <TableOfContents :toc="post.body.toc" title="On this page" smooth class="post-toc" />
    </aside>
    <ContentRenderer
      v-if="post" :value="post"
      class="mt-10 space-y-5 text-sm leading-6 lg:col-start-2 sm:text-base sm:leading-7 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/20 [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_h2]:pt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white sm:[&_h2]:text-xl [&_h3]:pt-4 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white sm:[&_h3]:text-lg [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
    />
  </article>
</template>
