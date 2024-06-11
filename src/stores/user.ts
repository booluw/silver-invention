import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
  const user = ref({})

  function updateUser(payload) {
    user.value = payload
  }

  function resetUser() {
    user.value = {}
  }

  return { user, updateUser, resetUser }
},
  {
  persist: true
})
