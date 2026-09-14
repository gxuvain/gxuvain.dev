<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryCollection("pages").path("/pages/home").first())
</script>

<template>
  <section class="mx-auto mt-10 max-w-3xl">
    <h1 class="mb-5 text-lg font-bold tracking-tight text-white sm:text-xl">
      {{ page?.title }}
    </h1>
    <ContentRenderer v-if="page" :value="page" class="space-y-6 text-sm leading-6 sm:text-base sm:leading-7" />
  </section>
</template>
