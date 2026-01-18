import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const rawToken = localStorage.getItem('token')
  const token = ref(rawToken && rawToken !== 'undefined' ? rawToken : '')
  const rawUserInfo = localStorage.getItem('userInfo')
  const userInfo = ref(rawUserInfo && rawUserInfo !== 'undefined' ? JSON.parse(rawUserInfo) : null)

  const setToken = (newToken) => {
    const safeToken = newToken === undefined || newToken === null ? '' : newToken
    token.value = safeToken
    localStorage.setItem('token', safeToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info === undefined ? null : info))
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout
  }
})
