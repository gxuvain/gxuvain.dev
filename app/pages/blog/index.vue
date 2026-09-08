<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-posts", () => queryCollection("blog")
  .select("title", "description", "path", "date")
  .order("date", "DESC")
  .all());
</script>

<template>
  <section class="mx-auto mt-15 max-w-3xl">
    <h1 class="mb-5 text-xl font-bold tracking-tight text-white">
      Blog
    </h1>

    <div class="space-y-8">
      <article v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path" class="group block">
          <time :datetime="post.date" class="text-xs text-neutral-500">
            {{ formatDate(post.date) }}
          </time>
          <h2 class="mt-1 font-bold text-white transition-colors duration-300 group-hover:text-neutral-300">
            {{ post.title }}
          </h2>
          <p class="mt-1 text-sm leading-6 text-neutral-400">
            {{ post.description }}
          </p>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>
