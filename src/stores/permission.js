import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])
  const isRoutesAdded = ref(false)

  const setRoutes = (newRoutes) => {
    routes.value = newRoutes
    isRoutesAdded.value = true
  }

  const resetRoutes = () => {
    routes.value = []
    isRoutesAdded.value = false
  }

  return {
    routes,
    isRoutesAdded,
    setRoutes,
    resetRoutes
  }
})
