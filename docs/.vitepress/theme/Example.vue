<script setup lang="ts">
// Live example: the Storybook story embedded in the page (exactly what is tested), in the
// docs' theme. The code to copy is written right below it in the Markdown page.
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useData, withBase } from 'vitepress'

const props = withDefaults(defineProps<{
  /** Storybook story id, e.g. "shell-dsaasfrtoolbar--start-and-end". */
  story: string
  /** Accessible name of the frame. */
  title: string
  /** Visible height in pixels. */
  height?: number
  /**
   * Width the story is rendered at, then scaled down to fit the page. Components change
   * layout below 62em (992px), so examples render at a desktop width by default.
   */
  viewport?: number
}>(), { height: 320, viewport: 1000 })

// Scale the desktop-width frame down to the available width.
const box = useTemplateRef<HTMLElement>('box')
const scale = ref(1)
let observer: ResizeObserver | undefined
onMounted(() => {
  const update = () => {
    if (box.value) scale.value = Math.min(1, box.value.clientWidth / props.viewport)
  }
  update()
  observer = new ResizeObserver(update)
  if (box.value) observer.observe(box.value)
})
onBeforeUnmount(() => observer?.disconnect())
const frameStyle = computed(() => ({
  width: `${props.viewport}px`,
  height: `${props.height / scale.value}px`,
  transform: `scale(${scale.value})`,
}))

const { isDark } = useData()
const storybook = computed(() => (import.meta.env.DEV ? 'http://localhost:6006/' : withBase('/storybook/')))
const src = computed(() =>
  `${storybook.value}iframe.html?id=${props.story}&viewMode=story&globals=theme:${isDark.value ? 'dark' : 'light'}`)
const link = computed(() => `${storybook.value}?path=/story/${props.story}`)
</script>

<template>
  <figure class="dsaasfr-example">
    <div
      ref="box"
      class="dsaasfr-example__box"
      :style="{ height: `${height}px` }"
    >
      <iframe
        :key="src"
        :src="src"
        :title="`Exemple : ${title}`"
        :style="frameStyle"
        loading="lazy"
      />
    </div>
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

.dsaasfr-example__box {
  overflow: hidden;
}

iframe {
  display: block;
  border: 0;
  background: var(--vp-c-bg);
  transform-origin: 0 0;
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
