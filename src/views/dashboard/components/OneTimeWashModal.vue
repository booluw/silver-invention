<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'


const router = useRouter()

const emit = defineEmits(['done', 'close'])
const { toast: toaster } = useToast()
const loading = ref(false)
const packageLoading = ref(false)
const packages: Ref<any[]> = ref([])

const formSchema = toTypedSchema(
  z.object({
    email: z.string().min(2).max(50).email('Please provide a valid email'),
    plate_number: z.string().min(3),
    package: z.number(),
    customer_name: z.string()
  })
)

const form = useForm({
  validationSchema: formSchema
})

const formatCash = (money) => {
  return '₦' + Intl.NumberFormat().format(money)
}

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  
  addNewWash(values)
})

const addNewWash = async function (values) {
  loading.value = true

  try {
    const { data, error } = await supabase.from('one-time-wash').insert({ ...values }).select('*')

    if (error) throw error

    router.push(`?action=reciept&id=${data[0].id}&type=one-time-wash`)
  } catch(error) {
    console.log(error)
  }

  loading.value = false
}

const fetchPackages = async function () {
  packageLoading.value = true
  try {
    const { error, data } = await supabase.from('packages').select('*')

    if (error) throw error
    packages.value = data

  } catch (error) {
    console.log(error)
    toaster({
      action: {
        label: 'Reload',
        onClick: () => fetchPackages()
      },
      description: 'An Error occurred while fetching packages',
      variant: 'destructive'
    })
    emit('close')
  }
  packageLoading.value = false
}


onMounted(async () => {
  await fetchPackages()
})
</script>
<template>
  <section class="">
    <h2 class="text-2xl">One Time Wash</h2>
    <form @submit="onSubmit" class="mt-3">
      <FormField v-slot="{ componentField }" name="customer_name">
        <FormItem>
          <FormLabel>Customer Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="John Doe" v-bind="componentField" class="text-black" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="user@email.com"
              v-bind="componentField"
              class="text-black"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="plate_number">
        <FormItem>
          <FormLabel>Plate Number</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Plate Number"
              v-bind="componentField"
              class="text-black"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="package">
        <FormItem>
          <FormLabel>Package</FormLabel>
          <FormControl>
            <Select v-bind="componentField" class="text-black" :disabled="packageLoading">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Packages</SelectLabel>
                  <SelectItem :value="plan.id" v-for="(plan, index) in packages" :key="index">
                    {{ plan.package_name }} - {{ formatCash(plan.amount) }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
        {{ loading ? 'Please Wait...' : 'Add One Time Wash' }}
      </Button>
    </form>
  </section>
</template>
