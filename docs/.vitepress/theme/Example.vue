<script setup lang="ts">
// Live example: the Storybook story embedded in the page (exactly what is tested), in the
// docs' theme. The code to copy is written right below it in the Markdown page.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const props = withDefaults(defineProps<{
  /** Storybook story id, e.g. "shell-dsaasfrtoolbar--start-and-end". */
  story: string
  /** Accessible name of the frame. */
  title: string
  /** Height in pixels. */
  height?: number
}>(), { height: 320 })

const { isDark } = useData()
const storybook = computed(() => (import.meta.env.DEV ? 'http://localhost:6006/' : withBase('/storybook/')))
const src = computed(() =>
  `${storybook.value}iframe.html?id=${props.story}&viewMode=story&globals=theme:${isDark.value ? 'dark' : 'light'}`)
const link = computed(() => `${storybook.value}?path=/story/${props.story}`)
</script>

<template>
  <figure class="dsaasfr-example">
    <iframe
      :key="src"
      :src="src"
      :title="`Exemple : ${title}`"
      :style="{ height: `${height}px` }"
      loading="lazy"
    />
    <figcaption>
      <span>Exemple en direct : {{ title }}</span>
      <a
        :href="link"
        target="_blank"
        rel="noopener"
      >Ouvrir dans Storybook</a>
    </figcaption>
  </figure>
</template>

<style scoped>
.dsaasfr-example {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

iframe {
  display: block;
  width: 100%;
  border: 0;
  background: var(--vp-c-bg);
}

figcaption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
