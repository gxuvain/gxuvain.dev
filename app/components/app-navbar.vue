<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

function toggleTheme() {
  colorMode.preference = isDark.value ? "light" : "dark";
}

const links = [
  { to: "/", label: "Home", icon: "hugeicons:home-05" },
  { to: "/blog", label: "Blog", icon: "hugeicons:news" },
];

const socialLinks = [
  { href: "https://x.com/gxuvain", label: "X", icon: "hugeicons:new-twitter" },
  { href: "https://www.linkedin.com/in/gauvain-palanga", label: "LinkedIn", icon: "cib:linkedin" },
  { href: "https://github.com/gxuvain", label: "GitHub", icon: "cib:github" },
];
</script>

<template>
  <nav class="site-nav mx-auto flex w-full max-w-3xl items-center gap-4">
    <NuxtLink v-for="link in links" :key="link.to" :to="link.to" :aria-label="link.label">
      <Icon :name="link.icon" size="20" aria-hidden="true" />
    </NuxtLink>
    <span class="h-4 w-px bg-neutral-700" />
    <a
      v-for="link in socialLinks" :key="link.href" :href="link.href" :aria-label="link.label" target="_blank"
      rel="noopener noreferrer"
    >
      <Icon :name="link.icon" size="20" aria-hidden="true" />
    </a>
    <span class="h-4 w-px bg-neutral-700" />
    <button :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
      <Icon :name="isDark ? 'hugeicons:moon-02' : 'hugeicons:sun-03'" size="20" aria-hidden="true" />
    </button>
    <button aria-label="Translate">
      <Icon name="hugeicons:translate" size="20" aria-hidden="true" />
    </button>
  </nav>
</template>
