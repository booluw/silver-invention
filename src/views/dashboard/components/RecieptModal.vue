<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/config/supabase'

import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'

import logoVue from '@/components/icons/logo.vue'

import { formatDate } from '../utils/functions'

const router = useRouter()
const route = useRoute()
const { toast: toaster } = useToast()

const loading = ref(true)
const reciept = ref({})

const printReciept = async function () {
  var mywindow = window.open('', 'PRINT', 'height=400,width=600')

  mywindow.document.write('<html><head><title>' + document.title + '</title>')
  mywindow.document.write(
    '<style>* {-webkit-print-color-adjust: exact !important; margin: 0; padding: 0;} .printer-hide{display:none} @page { size: auto!important;  margin: 0mm!important; -webkit-print-color-adjust: exact !important; }</style>'
  )
  mywindow.document.write('</head><body>')
  mywindow.document.write(document.getElementById('section-to-print').innerHTML)
  mywindow.document.write('</body></html>')

  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/

  mywindow.print()
  mywindow.close()

  return true
}

const formatCash = (money) => {
  return '₦' + Intl.NumberFormat().format(money)
}

const loadReciept = async function () {
  loading.value = true

  try {
    if (route.query.type === 'one-time-wash') {
      const { data, error } = await supabase
        .from('one-time-wash')
        .select('*, package(*)')
        .eq('id', route.query.id)

      if (error) throw error

      reciept.value = data[0]
    } else {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*, package(*)')
        .eq('email', route.query.id)

      if (error) throw error

      reciept.value = data[0]
    }

    loading.value = false
  } catch (err) {
    console.log(err)
    toaster({
      action: {
        label: 'Reload',
        onClick: () => loadReciept()
      },
      description: 'An Error occurred while fetching reciept details',
      variant: 'destructive'
    })
  }
}

onMounted(async () => await loadReciept())
</script>
<template>
  <section class="">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl">Reciept</h2>
      <Button type="submit" class="w-[1/3]" :disabled="loading" @click="printReciept()">
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
        Print
      </Button>
    </div>
    <div class="h-full flex items-center justify-center" v-if="loading">
      <svg
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
    </div>
    <div class="h-full" id="section-to-print" v-else>
      <div style="text-align: center">
        <logoVue width="50px" height="auto" style="margin: 5px auto 0; border-radius: 5px;" class="w-[100px] printer-hide" />
        <h1 class="!text-2xl" style="font-size: 20px; font-weight: bold; margin: 0;">Gleamwave Detailing Studio</h1>
        <div style="font-size: 14px">
          <p>No. 225 Abak Road, Uyo, Akwa Ibom</p>
          <p>0811-845-2796</p>
        </div>
        <div
          style="text-align: left; margin: 10px;"
          class="!m-0"
        >
          <div v-if="route.query.type === 'one-time-wash'">INVOICE: OTW{{ reciept.id! }}</div>
          <div>
            {{ route.query.type === 'one-time-wash' ? 'Processed' : 'Subscription ends' }}:
            {{ route.query.type === 'one-time-wash' ? formatDate(reciept.created_at) : formatDate(reciept.subscription_end) }}
          </div>
          <div>Printed: {{ formatDate(Date()) }}</div>
        </div>
      </div>

      <table style="width: 100%; margin: 10px 0 0;" v-if="route.query.type === 'one-time-wash'">
        <tr style="border-bottom: 1px #eee solid">
          <th>Description</th>
          <th>Car Type</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td style="text-align: center">{{ reciept.package.package_name }}</td>
          <td style="text-align: center">{{  reciept.car_type }}</td>
          <td style="text-align: center">{{ formatCash(reciept.car_type === 'SALOON' ? reciept.package.one_time_wash_amount : reciept.package.one_time_wash_suv_amount) }}</td>
          <td style="text-align: center">
            {{ formatCash(reciept.car_type === 'SALOON' ? reciept.package.one_time_wash_amount : reciept.package.one_time_wash_suv_amount) }}
          </td>
        </tr>
        <tr style="border-top: 1px grey solid">
          <td></td>
          <td></td>
          <td style="text-align: center">Total</td>
          <td style="text-align: center; font-weight: bold" v-if="route.query.type === 'one-time-wash'">
            {{ formatCash(reciept.car_type === 'SALOON' ? reciept.package.one_time_wash_amount : reciept.package.one_time_wash_suv_amount) }}
          </td>
          <td style="text-align: center; font-weight: bold" v-else>
            {{ formatCash(reciept.package.amount * reciept.number_of_cars) }}
          </td>
        </tr>
      </table>
      
      <div v-else>
        <b>Subscription package:</b> {{ reciept.package.package_name }}
        <br />
        <b>Duration:</b> {{ reciept.duration }} months
        <br />
        <b>Wash Left:</b> {{ reciept.wash_left }}
        <br /><br />
      </div>
      <hr />
      <div style="margin: 10px 10px 0;">
        <b>NOTE:</b>
        <ul style="margin: 0 0 10px;">
          <li>Save the reciept to pickup your car</li>
          <li>Without a reciept, no car will be released</li>
        </ul>
        <p>THANK YOU FOR YOUR PATRONAGE</p>
        <p>NO REFUND</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media print {
  body {
    visibility: hidden;
  }
  #section-to-print {
    visibility: visible;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
