<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import AppModal from '@/components/AppModal.vue'

import CarWashIcon from "./components/CarWash.vue"
import OneTimeWashModal from './components/OneTimeWashModal.vue'
import NewSubscriberModal from './components/NewSubscriberModal.vue'
import RecieptModal from './components/RecieptModal.vue'

const router = useRouter()
const route = useRoute()
</script>
<template>
  <section class="!h-screen">
    <div class="flex gap-3 items-center">
      <CarWashIcon class="w-[40px]" />
      <h1 class="text-2xl font-bold">Services</h1>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5 py-3">
      <div class="border border-slate-500 p-5 rounded group hover:shadow-xl flex flex-col justify-between">
        <h3 class="font-semibold text-xl">One Time Wash</h3>
        <p class="my-3">For non subscribers and one time users</p>
        <Button type="button" class="mt-2" @click="router.push('?action=one-time-wash')">Add One-Time Wash</Button>
      </div>
      <div class="border border-slate-500 p-5 rounded group hover:shadow-xl flex flex-col justify-between">
        <h3 class="font-semibold text-xl">New Subscriber</h3>
        <p class="my-3">
          Register new subscriber
        </p>
        <Button type="button" class="mt-2" @click="router.push('?action=add-new-subscriber')">Add New Subscriber</Button>
      </div>
      <div class="border border-slate-500 p-5 rounded group hover:shadow-xl flex flex-col justify-between">
        <h3 class="font-semibold text-xl">Existing Subscriber</h3>
        <p class="my-3">Record new wash for an existing subscriber</p>
        <Button type="button" class="mt-2" @click="router.push('?action=existing-subscriber')">Check Existing Subscriber</Button>
      </div>
      <div class="border border-slate-500 p-5 rounded group hover:shadow-xl flex flex-col justify-between">
        <h3 class="font-semibold text-xl">Renew Subscription</h3>
        <p class="my-3">Renew expired subscription</p>
        <Button type="button" class="mt-2" @click="router.push('?action=renew-subscription')">Renew Subscription</Button>
      </div>
    </div>

    <AppModal
      :child="OneTimeWashModal"
      @done="router.push(route.path)"
      @close="router.push(route.path)"
      v-if="route.query.action === 'one-time-wash'"
    />
    <AppModal
      :child="NewSubscriberModal"
      @done="router.push(route.path)"
      @close="router.push(route.path)"
      v-if="route.query.action === 'add-new-subscriber'"
    />
    <AppModal
      :child="RecieptModal"
      @done="router.push(route.path)"
      @close="router.push(route.path)"
      v-if="route.query.action === 'reciept'"
    />
  </section>
</template>