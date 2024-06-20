<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/components/ui/toast/use-toast'

import { ADMIN_ROUTES, ROUTES } from './utils/constants'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

const loading = ref(false)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { toast } = useToast()

const user = computed(() => {
  return userStore.user
})

const user_routes = computed(() => {
  if (user.value.role! === 'SUPER_ADMIN') return ADMIN_ROUTES
  else return ROUTES
})

const signUserOut = async function () {
  loading.value = true

  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    toast({ description: 'You have been logged out' })
    userStore.resetUser()
    router.push('/')
  } catch (error) {
    console.log(error)
    toast({ title: 'An error occurred', description: error ?? error.message })
  }

  loading.value = false
}
</script>
<template>
  <section class="h-screen flex overflow-hidden bg-[#dfdfdf]">
    <div class="w-1/6 bg-gray-800 py-5">
      <router-link to="/">
        <img src="@/assets/imgs/logowitnobg.png" class="w-[150px] block my-0 mx-auto" />
      </router-link>
      <div class="flex flex-col gap-1 mt-5">
        <router-link
          class="p-3 flex items-center gap-5 text-white hover:bg-black"
          :class="{ 'bg-black border-r-2 border-primary': route.path === link.path }"
          :to="link.path"
          v-for="(link, index) in user_routes"
          :key="index"
        >
          <component :is="link.icon" class="w-[24px]" />
          <span class="hidden md:block">{{ link.title }}</span>
        </router-link>
      </div>
    </div>
    <div class="w-5/6 overflow-hidden relative">
      <header
        class="p-5 bg-gray-800 sticky top-0 z-10 flex items-center justify-between text-white"
      >
        <h1 class="text-xs">
          Welcome, <b>{{ user.fullname! ?? user.email! }}</b> 
        </h1>
        <Button
          type="button"
          class="text-white bg-primary font-bold"
          :disabled="loading"
          @click="signUserOut()"
        >
          <svg
            v-if="loading"
            class="animate-spin mr-2"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49998 0.849976C7.22383 0.849976 6.99998 1.07383 6.99998 1.34998V3.52234C6.99998 3.79848 7.22383 4.02234 7.49998 4.02234C7.77612 4.02234 7.99998 3.79848 7.99998 3.52234V1.8718C10.8862 2.12488 13.15 4.54806 13.15 7.49998C13.15 10.6204 10.6204 13.15 7.49998 13.15C4.37957 13.15 1.84998 10.6204 1.84998 7.49998C1.84998 6.10612 2.35407 4.83128 3.19049 3.8459C3.36919 3.63538 3.34339 3.31985 3.13286 3.14115C2.92234 2.96245 2.60681 2.98825 2.42811 3.19877C1.44405 4.35808 0.849976 5.86029 0.849976 7.49998C0.849976 11.1727 3.82728 14.15 7.49998 14.15C11.1727 14.15 14.15 11.1727 14.15 7.49998C14.15 3.82728 11.1727 0.849976 7.49998 0.849976ZM6.74049 8.08072L4.22363 4.57237C4.15231 4.47295 4.16346 4.33652 4.24998 4.25C4.33649 4.16348 4.47293 4.15233 4.57234 4.22365L8.08069 6.74051C8.56227 7.08599 8.61906 7.78091 8.19998 8.2C7.78089 8.61909 7.08597 8.56229 6.74049 8.08072Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          Sign Out
        </Button>
      </header>
      <ScrollArea class="p-5 h-full">
        <router-view />
      </ScrollArea>
    </div>
  </section>
</template>
