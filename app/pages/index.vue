<script setup lang="ts">
const { data: page } = await useAsyncData("home-page", () => queryCollection("pages").path("/pages/home").first());
</script>

<template>
  <section class="mx-auto mt-15 max-w-3xl">
    <h1 class="mb-5 text-xl font-bold tracking-tight text-white">
      {{ page?.title }}
    </h1>
    <ContentRenderer :value="page" class="space-y-6" />
  </section>
</template>
