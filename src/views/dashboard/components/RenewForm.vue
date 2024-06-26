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
const props = defineProps<{
  subscriber: any
}>()

const emit = defineEmits(['done', 'close'])
const { toast: toaster } = useToast()
const loading = ref(false)
const packageLoading = ref(false)
const packages: Ref<any[]> = ref([])
const plate_numbers: Ref<[]> = ref([])
const allowedCars: Ref<number> = ref(0)

const formSchema = toTypedSchema(
  z.object({
    number_of_cars: z.number(),
    package: z.number(),
    duration: z.string()
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
  const amount = packages.value.filter((item) => {
    if (item.id === values.package) return item
  })

  if (values.number_of_cars > amount[0].max_number_of_cars) {
    toast('Number of cars exceeded for this package', {
      description: `${amount[0].package_name} allows only ${amount[0].max_number_of_cars}`
    })
    allowedCars.value = amount[0].max_number_of_cars
    plate_numbers.value = []
    loading.value = false
    return
  }

  try {
    const { error } = await supabase
      .from('subscribers')
      .update({
        ...values,
        plate_number: plate_numbers.value.filter(item => { if(item !== null) return item }),
        duration: Number(values.duration),
        wash_left: [3, 4].includes(values.package)
          ? amount[0].number_of_wash * Number(values.duration)
          : amount[0].number_of_wash,
        subscription_end: new Date(new Date().setDate(new Date().getDate() + 31 * Number(values.duration)))
      })
      .eq('email', props.subscriber.email)

    if (error) throw error

    toast('Subscription Renewed', { description: '' })
    router.push(`?action=reciept&id=${props.subscriber.email}&type=existing-subscriber`)
  } catch (error) {
    console.log(error)
    toaster({
      description:
        error.message === 'duplicate key value violates unique constraint "customers_email_key"'
          ? 'This user already has a subscription'
          : error.message,
      variant: 'destructive'
    })
  }

  loading.value = false
})

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
  <form @submit="onSubmit" class="mt-3">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    {{ plan.package_name }} - {{ formatCash(plan.amount_for_subscription) }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="duration">
        <FormItem>
          <FormLabel>Duration</FormLabel>
          <FormControl>
            <Select v-bind="componentField" class="text-black">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem :value="'1'"> 1 Month </SelectItem>
                  <SelectItem :value="'3'"> 3 Months </SelectItem>
                  <SelectItem :value="'6'"> 6 Months </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField v-slot="{ componentField }" name="number_of_cars" v-model:model-value="allowedCars">
        <FormItem>
          <FormLabel>Number of Cars</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Number of Cars"
              v-bind="componentField"
              class="text-black"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <div class="grid grid-cols-3 mt-2 gap-3">
          <div 
            v-for="index in allowedCars"
            :key="index"
          >
            <FormLabel>Plate Number {{ index }}</FormLabel>
            <Input
              type="text"
              v-model="plate_numbers[index]"
              placeholder="Plate Number"
              class="text-black"
            />
          </div>
        </div>
      </FormField>

    <Button type="submit" class="w-full mt-5" :disabled="loading" @click="onSubmit">
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
      {{ loading ? 'Please Wait...' : 'Renew Subscriber' }}
    </Button>
  </form>
</template>
