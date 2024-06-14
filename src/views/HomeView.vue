<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/config/supabase'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'

const formSchema = toTypedSchema(
  z.object({
    email: z.string().min(2).max(50).email('Please provide a valid email'),
    password: z.string()
  })
)

const { toast } = useToast()
const loading = ref(false)
const userStore = useUserStore()
const router = useRouter()

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    const { email, password } = values;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    const { data: profile, error: profileError } = await supabase.from('staff_profile').select('*').eq('id', data.user.id);

    if (error) throw profileError;
    userStore.updateUser(profile[0])
    toast({ description: `Welcome Back, ${profile[0].fullname ?? email}` })
    router.push('/dashboard')
    
  } catch (error) {
    toast({ title: 'Login Error', description: error ?? error.message, variant: 'destructive', })
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
})
</script>

<template>
  <main class="flex items-center justify-center h-screen bg">
    <div class="md:w-1/3 md:min-h-2/3 rounded-lg border border-white/40 py-5 px-10 shadow-xl bg-white">
      <img src="@/assets/imgs/logo.jpg" class="w-[150px] block my-0 mx-auto rounded-xl" />
      <h1 class="mb-5 text-3xl">Log In</h1>
      <form @submit="onSubmit">
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
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="password"
                v-bind="componentField"
                class="text-black"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="w-full mt-10" :disabled="loading">
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
          {{  loading ? 'Please Wait...' : 'Log In' }}
        </Button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.671), #f70501a8),
    url('@/assets/imgs/servicepgbg.jpg');
  background-position: center;
  background-size: cover;
  position: relative;
}
</style>
