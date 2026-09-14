<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")
const isMenuOpen = ref(false)

function toggleTheme() {
  colorMode.preference = isDark.value ? "light" : "dark"
}

function closeMenu() {
  isMenuOpen.value = false
}

const links = [
  { to: "/", label: "Home", icon: "hugeicons:home-05" },
  { to: "/blog", label: "Blog", icon: "hugeicons:news" },
]

const socialLinks = [
  { href: "https://x.com/gxuvain", label: "X", icon: "hugeicons:new-twitter" },
  { href: "https://www.linkedin.com/in/gauvain-palanga", label: "LinkedIn", icon: "cib:linkedin" },
  { href: "https://github.com/gxuvain", label: "GitHub", icon: "cib:github" },
]
</script>

<template>
  <nav class="site-nav relative mx-auto flex w-full max-w-3xl items-center justify-end sm:justify-start">
    <button class="sm:hidden" @click="isMenuOpen = !isMenuOpen">
      <Icon name="hugeicons:more-horizontal-square-01" size="20" />
    </button>
    <div class="hidden items-center gap-4 sm:flex">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">
        <Icon :name="link.icon" size="20" />
      </NuxtLink>
      <span class="h-4 w-px bg-neutral-700" />
      <a v-for="link in socialLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">
        <Icon :name="link.icon" size="20" />
      </a>
      <span class="h-4 w-px bg-neutral-700" />
      <button @click="toggleTheme">
        <Icon :name="isDark ? 'hugeicons:moon-02' : 'hugeicons:sun-03'" size="20" />
      </button>
      <button>
        <Icon name="hugeicons:translate" size="20" />
      </button>
    </div>
    <div
      v-if="isMenuOpen"
      class="absolute right-0 top-9 z-10 grid min-w-40 gap-3 rounded-xl border border-white/10 bg-[var(--nav-menu-bg)] p-4 text-sm shadow-xl sm:hidden"
    >
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="flex items-center gap-2" @click="closeMenu">
        <Icon :name="link.icon" size="18" />
        {{ link.label }}
      </NuxtLink>
      <a
        v-for="link in socialLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer"
        class="flex items-center gap-2" @click="closeMenu"
      >
        <Icon :name="link.icon" size="18" />
        {{ link.label }}
      </a>
      <button class="flex items-center gap-2 text-left" @click="toggleTheme">
        <Icon :name="isDark ? 'hugeicons:moon-02' : 'hugeicons:sun-03'" size="18" />
        {{ isDark ? "Dark" : "Light" }}
      </button>
      <button class="flex items-center gap-2 text-left" @click="closeMenu">
        <Icon name="hugeicons:translate" size="18" />
        Translate
      </button>
    </div>
  </nav>
</template>
