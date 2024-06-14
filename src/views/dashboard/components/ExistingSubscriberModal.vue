<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

import { formatDate } from '../utils/functions'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'

const router = useRouter()
const tab = ref('search')
const { toast: toaster } = useToast()
const loading = ref(false)
const subscriber = ref({})

const searchSchema = toTypedSchema(
  z.object({
    email: z.string().email('Please provide a valid email')
  })
)

const searchForm = useForm({ validationSchema: searchSchema })

const onSearch = searchForm.handleSubmit(async (values) => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*, package(*)')
      .eq('email', values.email)

    if (error) throw error
    if (data.length === 0) throw { message: 'No subscriber found for ' + values.email }

    subscriber.value = data[0]
    tab.value = 'add-wash'
  } catch (error) {
    console.log(error)
    toaster({
      description: error.message,
      variant: 'destructive'
    })
  }
  loading.value = false
})

const updateWash = async function (email: string) {
  loading.value = true
  try {
    const { error } = await supabase
      .from('subscribers')
      .update({ wash_left: subscriber.value.wash_left - 1 })
      .eq('email', email)

    if (error) throw error

    router.push(`?action=reciept&id=${subscriber.value.email}&type=existing-subscriber`)
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
</script>
<template>
  <section>
    <h2 class="text-2xl">Existing Subscriber</h2>
    <div class="" v-if="tab === 'search'">
      <form @submit="onSearch" class="mt-3">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Customer Email</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="John.doe@gmail.com"
                v-bind="componentField"
                class="text-black"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="w-full mt-5" :disabled="loading">
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
          {{ loading ? 'Please Wait...' : 'Search' }}
        </Button>
      </form>
    </div>
    <div class="" v-if="tab === 'add-wash'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="">
          <h1 class="font-semibold">Customer Name</h1>
          {{ subscriber.customer_name }}
        </div>

        <div class="">
          <h1 class="font-semibold">Customer Email</h1>
          {{ subscriber.email }}
        </div>

        <div class="">
          <h1 class="font-semibold">Plate Number</h1>
          {{ subscriber.plate_number }}
        </div>

        <div class="">
          <h1 class="font-semibold">Number of Cars</h1>
          {{ subscriber.number_of_cars }}
        </div>

        <div class="">
          <h1 class="font-semibold">Package Name</h1>
          {{ subscriber.package.package_name }}
        </div>

        <div class="">
          <h1 class="font-semibold">Duration</h1>
          {{ subscriber.duration }} Months
        </div>

        <div class="">
          <h1 class="font-semibold">Wash Left</h1>
          {{ subscriber.wash_left }}
        </div>

        <div class="">
          <h1 class="font-semibold">Subscription Started</h1>
          {{ formatDate(subscriber.subscription_started) }}
        </div>
      </div>

      <Button
        type="submit"
        class="w-full mt-5"
        @click="updateWash(subscriber.email)"
        :disabled="loading"
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
        {{ loading ? 'Please Wait...' : 'Show Wash Reciept' }}
      </Button>
    </div>
  </section>
</template>
