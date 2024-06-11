<script lang="ts" setup>
import { type Component, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

import { ScrollArea } from '@/components/ui/scroll-area'

defineProps<{
  child: Component,
  data?: any
}>()

const emit = defineEmits(['done', 'close'])
const target = ref(null)

onClickOutside(target, (event) => {
  if ((event.target as HTMLElement).id === 'modal') emit('close')
})

</script>
<template>
  <section class="fixed z-20 top-0 right-0 bottom-0 left-0 bg-black/70 flex items-center justify-center" id="modal">
    <ScrollArea class="bg-white md:h-2/3 md:w-1/3 rounded shadow" ref="target">
      <component :is="child" class="p-5" @done="emit('done')" @close="emit('close')" />
    </ScrollArea>
  </section>
</template>