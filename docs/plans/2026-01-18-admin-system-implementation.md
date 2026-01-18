# 后台管理系统实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个基于 Vue 3 的后台管理系统，实现用户权限管理和动态路由功能

**Architecture:** 使用 Vue 3 + Vite + Vue Router 4 + Pinia + Element Plus，通过动态路由和路由守卫实现权限控制

**Tech Stack:** Vue 3, Vue Router 4, Pinia, Element Plus, Axios

---

## Task 1: 安装依赖包

**Files:**
- Modify: `package.json`

**Step 1: 安装所需的 npm 包**

```bash
npm install vue-router@4 pinia element-plus axios @element-plus/icons-vue
```

**Step 2: 验证安装**

Run: `npm list vue-router pinia element-plus axios`
Expected: 显示已安装的包及其版本

**Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "chore: install vue-router, pinia, element-plus and axios"
```

---

## Task 2: 配置 Vue Router 基础结构

**Files:**
- Create: `src/router/index.js`

**Step 1: 创建 router 配置文件**

```javascript
import { createRouter, createWebHistory } from 'vue-router'

// 静态路由（不需要权限的路由）
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
```

**Step 2: 在 main.js 中引入 router**

修改 `src/main.js`:
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')
```

**Step 3: 验证配置**

Run: `npm run dev`
Expected: 项目正常启动，访问 /login 不报错

**Step 4: 提交**

```bash
git add src/router/index.js src/main.js
git commit -m "feat: setup vue router and element-plus"
```

---

## Task 3: 创建 Login 组件

**Files:**
- Create: `src/views/Login.vue`

**Step 1: 创建登录页面**

```vue
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>后台管理系统</h2>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 调用登录接口
        const res = {
          data: {
            token: 'mock-token-' + Date.now(),
            userInfo: {
              id: 1,
              username: loginForm.value.username,
              role: 'admin'
            }
          }
        }
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
        router.push('/')
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
}

h2 {
  margin: 0;
  text-align: center;
  color: #333;
}
</style>
```

**Step 2: 在 App.vue 中添加 router-view**

修改 `src/App.vue`:
```vue
<template>
  <router-view />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
```

**Step 3: 验证登录页**

Run: `npm run dev`
Expected: 访问 /login 显示登录表单，点击登录跳转到根路径

**Step 4: 提交**

```bash
git add src/views/Login.vue src/App.vue
git commit -m "feat: create login page"
```

---

## Task 4: 配置 Pinia Stores

**Files:**
- Create: `src/stores/user.js`
- Create: `src/stores/permission.js`
- Modify: `src/main.js`

**Step 1: 创建 user store**

创建 `src/stores/user.js`:
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
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
```

**Step 2: 创建 permission store**

创建 `src/stores/permission.js`:
```javascript
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
```

**Step 3: 在 main.js 中引入 Pinia**

修改 `src/main.js`:
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
```

**Step 4: 更新 Login 组件使用 store**

修改 `src/views/Login.vue` 的 script 部分:
```javascript
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = {
          data: {
            token: 'mock-token-' + Date.now(),
            userInfo: {
              id: 1,
              username: loginForm.value.username,
              role: 'admin'
            }
          }
        }
        userStore.setToken(res.data.token)
        userStore.setUserInfo(res.data.userInfo)
        router.push('/')
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>
```

**Step 5: 提交**

```bash
git add src/stores/ src/main.js src/views/Login.vue
git commit -m "feat: setup pinia stores for user and permission"
```

---

## Task 5: 封装 Axios 请求

**Files:**
- Create: `src/utils/request.js`

**Step 1: 创建 axios 封装**

```javascript
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.response.data.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

export default request
```

**Step 2: 创建 API 接口文件**

创建 `src/api/auth.js`:
```javascript
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}
```

**Step 3: 提交**

```bash
git add src/utils/request.js src/api/auth.js
git commit -m "feat: add axios request interceptor and api definitions"
```

---

## Task 6: 实现动态路由加载

**Files:**
- Modify: `src/router/index.js`
- Create: `src/router/async-routes.js`

**Step 1: 更新 router 配置**

修改 `src/router/index.js`:
```javascript
import { createRouter, createWebHistory } from 'vue-router'

// 静态路由（不需要权限的路由）
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// 重置路由方法（用于登出）
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher
}

export default router
```

**Step 2: 创建动态路由处理**

创建 `src/router/async-routes.js`:
```javascript
import router from './index'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'
import { getRoutes } from '@/api/auth'
import { ElMessage } from 'element-plus'

// 路由白名单
const whiteList = ['/login', '/404']

/**
 * 动态添加路由
 * @returns {Promise<boolean>}
 */
export async function addDynamicRoutes() {
  const permissionStore = usePermissionStore()
  const userStore = useUserStore()

  // 如果路由已经添加，直接返回
  if (permissionStore.isRoutesAdded) {
    return true
  }

  try {
    // 调用接口获取路由配置
    const res = await getRoutes()
    const dynamicRoutes = res.data || []

    // 动态添加路由
    dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })

    // 添加 404 路由（必须在所有动态路由之后）
    router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    })

    // 更新 store 状态
    permissionStore.setRoutes(dynamicRoutes)

    return true
  } catch (error) {
    ElMessage.error('获取路由配置失败')
    console.error('获取路由配置失败:', error)
    return false
  }
}

/**
 * 路由守卫
 */
export function setupRouterGuard() {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const hasToken = userStore.token

    if (hasToken) {
      if (to.path === '/login') {
        // 已登录，跳转到首页
        next({ path: '/' })
      } else {
        // 判断是否已经获取过路由
        if (permissionStore.isRoutesAdded) {
          next()
        } else {
          try {
            // 添加动态路由
            const success = await addDynamicRoutes()
            if (success) {
              // 添加成功后，重新跳转到目标路由
              next({ ...to, replace: true })
            } else {
              // 添加失败，跳转到登录页
              userStore.logout()
              next(`/login?redirect=${to.path}`)
            }
          } catch (error) {
            // 出错，清除 token 并跳转到登录页
            userStore.logout()
            next(`/login?redirect=${to.path}`)
          }
        }
      }
    } else {
      // 没有 token
      if (whiteList.includes(to.path)) {
        // 在白名单中，直接放行
        next()
      } else {
        // 不在白名单中，跳转到登录页
        next(`/login?redirect=${to.path}`)
      }
    }
  })
}
```

**Step 3: 在 main.js 中启用路由守卫**

修改 `src/main.js`:
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupRouterGuard } from './router/async-routes'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 启用路由守卫
setupRouterGuard()

app.mount('#app')
```

**Step 4: 提交**

```bash
git add src/router/index.js src/router/async-routes.js src/main.js
git commit -m "feat: implement dynamic route loading and router guard"
```

---

## Task 7: 创建 404 页面

**Files:**
- Create: `src/views/404.vue`

**Step 1: 创建 404 页面**

```vue
<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}

h1 {
  font-size: 120px;
  color: #409eff;
  margin: 0 0 20px 0;
}

p {
  font-size: 20px;
  color: #666;
  margin-bottom: 30px;
}
</style>
```

**Step 2: 提交**

```bash
git add src/views/404.vue
git commit -m "feat: add 404 not found page"
```

---

## Task 8: 创建布局组件

**Files:**
- Create: `src/layout/Layout.vue`
- Create: `src/layout/Sidebar.vue`
- Create: `src/layout/Header.vue`

**Step 1: 创建侧边栏组件**

创建 `src/layout/Sidebar.vue`:
```vue
<template>
  <el-aside width="200px">
    <div class="logo">后台管理</div>
    <el-menu
      :default-active="activeMenu"
      :router="true"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <el-menu-item index="/">
        <el-icon><House /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="/user">
        <el-icon><User /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>系统设置</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { House, User, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.el-aside {
  background-color: #304156;
  height: 100vh;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
}

.el-menu {
  border-right: none;
}
</style>
```

**Step 2: 创建头部组件**

创建 `src/layout/Header.vue`:
```vue
<template>
  <el-header>
    <div class="header-content">
      <span class="username">{{ userInfo?.username }}</span>
      <el-button type="primary" link @click="handleLogout">退出登录</el-button>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { resetRouter } from '@/router'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    resetRouter()
    router.push('/login')
  } catch (error) {
    // 用户取消
  }
}
</script>

<style scoped>
.el-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.username {
  margin-right: 20px;
  color: #333;
}
</style>
```

**Step 3: 创建主布局组件**

创建 `src/layout/Layout.vue`:
```vue
<template>
  <el-container class="layout-container">
    <Sidebar />
    <el-container>
      <Header />
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
```

**Step 4: 提交**

```bash
git add src/layout/
git commit -m "feat: create layout components (Sidebar, Header, Layout)"
```

---

## Task 9: 创建示例页面

**Files:**
- Create: `src/views/Dashboard.vue`
- Create: `src/views/User.vue`
- Create: `src/views/Settings.vue`

**Step 1: 创建首页**

创建 `src/views/Dashboard.vue`:
```vue
<template>
  <el-card>
    <template #header>
      <h2>欢迎来到后台管理系统</h2>
    </template>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <h3>用户总数</h3>
          <p class="stat-number">1,234</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <h3>访问次数</h3>
          <p class="stat-number">5,678</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <h3>系统状态</h3>
          <p class="stat-number green">正常运行</p>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
h2 {
  margin: 0;
  color: #333;
}

.stat-card {
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 16px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin: 0;
}

.stat-number.green {
  color: #67c23a;
}
</style>
```

**Step 2: 创建用户页面**

创建 `src/views/User.vue`:
```vue
<template>
  <el-card>
    <template #header>
      <div class="header">
        <h2>用户管理</h2>
        <el-button type="primary" @click="handleAdd">添加用户</el-button>
      </div>
    </template>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([
  { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: '普通用户' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: '普通用户' }
])

const handleAdd = () => {
  ElMessage.info('添加用户功能待实现')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑用户：${row.username}`)
}

const handleDelete = (row) => {
  ElMessage.info(`删除用户：${row.username}`)
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  color: #333;
}
</style>
```

**Step 3: 创建设置页面**

创建 `src/views/Settings.vue`:
```vue
<template>
  <el-card>
    <template #header>
      <h2>系统设置</h2>
    </template>
    <el-form :model="form" label-width="120px">
      <el-form-item label="系统名称">
        <el-input v-model="form.systemName" />
      </el-form-item>
      <el-form-item label="管理员邮箱">
        <el-input v-model="form.adminEmail" />
      </el-form-item>
      <el-form-item label="主题颜色">
        <el-color-picker v-model="form.themeColor" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存设置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  systemName: '后台管理系统',
  adminEmail: 'admin@example.com',
  themeColor: '#409eff'
})

const handleSave = () => {
  ElMessage.success('设置已保存')
}
</script>

<style scoped>
h2 {
  margin: 0;
  color: #333;
}
</style>
```

**Step 4: 提交**

```bash
git add src/views/Dashboard.vue src/views/User.vue src/views/Settings.vue
git commit -m "feat: add sample pages (Dashboard, User, Settings)"
```

---

## Task 10: 添加 mock API 服务器

**Files:**
- Create: `vite.config.js` (修改)
- Create: `mock/server.js`

**Step 1: 配置 Vite 代理**

修改 `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    vue(),
    viteCommonjs()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

**Step 2: 创建 mock 服务器**

创建 `mock/server.js`:
```javascript
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// 用户数据
const users = {
  admin: { password: '123456', role: 'admin', username: '管理员' },
  user: { password: '123456', role: 'user', username: '普通用户' }
}

// 路由配置数据
const routesMap = {
  admin: [
    {
      path: '/',
      name: 'Home',
      component: '/layout/Layout',
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: '/views/Dashboard',
          meta: { title: '首页' }
        },
        {
          path: 'user',
          name: 'User',
          component: '/views/User',
          meta: { title: '用户管理' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: '/views/Settings',
          meta: { title: '系统设置' }
        }
      ]
    }
  ],
  user: [
    {
      path: '/',
      name: 'Home',
      component: '/layout/Layout',
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: '/views/Dashboard',
          meta: { title: '首页' }
        }
      ]
    }
  ]
}

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = users[username]

  if (user && user.password === password) {
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: user.username,
          role: user.role
        }
      }
    })
  } else {
    res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    })
  }
})

// 获取路由接口
app.get('/api/routes', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未授权'
    })
  }

  // 从 token 中提取角色（简化处理）
  const role = token.includes('admin') ? 'admin' : 'user'
  const routes = routesMap[role] || []

  // 转换路由格式
  const formattedRoutes = routes.map(route => ({
    ...route,
    component: route.component.replace(/^\//, '@/')
  }))

  res.json({
    code: 200,
    data: formattedRoutes
  })
})

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`)
})
```

**Step 3: 安装 mock 服务器依赖**

```bash
npm install express cors @originjs/vite-plugin-commonjs -D
```

**Step 4: 更新 package.json 添加 mock 脚本**

修改 `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "mock": "node mock/server.js"
  }
}
```

**Step 5: 提交**

```bash
git add vite.config.js mock/server.js package.json
git commit -m "feat: add mock api server"
```

---

## Task 11: 集成真实 API 调用

**Files:**
- Modify: `src/views/Login.vue`
- Modify: `src/router/async-routes.js`

**Step 1: 更新登录组件使用真实 API**

修改 `src/views/Login.vue` 的 handleLogin 函数:
```javascript
const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login(loginForm.value)
        userStore.setToken(res.data.token)
        userStore.setUserInfo(res.data.userInfo)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        loading.value = false
      }
    }
  })
}
```

**Step 2: 更新路由导入**

确保 `src/views/Login.vue` 已导入 login:
```javascript
import { login } from '@/api/auth'
```

**Step 3: 提交**

```bash
git add src/views/Login.vue
git commit -m "feat: integrate real api calls in login"
```

---

## Task 12: 添加环境变量配置

**Files:**
- Create: `.env`
- Create: `.env.development`

**Step 1: 创建环境变量文件**

创建 `.env`:
```env
VITE_API_BASE_URL=/api
```

创建 `.env.development`:
```env
VITE_API_BASE_URL=/api
```

**Step 2: 提交**

```bash
git add .env .env.development
git commit -m "feat: add environment variables"
```

---

## Task 13: 更新侧边栏菜单以支持动态路由

**Files:**
- Modify: `src/layout/Sidebar.vue`

**Step 1: 更新侧边栏组件以使用动态路由**

```vue
<template>
  <el-aside width="200px">
    <div class="logo">后台管理</div>
    <el-menu
      :default-active="activeMenu"
      :router="true"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <el-menu-item
        v-for="route in menuRoutes"
        :key="route.path"
        :index="route.path"
      >
        <el-icon><component :is="getIcon(route.meta?.icon)" /></el-icon>
        <template #title>{{ route.meta?.title }}</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { House, User, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const permissionStore = usePermissionStore()
const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  const routes = permissionStore.routes
  if (routes.length > 0 && routes[0].children) {
    return routes[0].children
  }
  return []
})

const getIcon = (iconName) => {
  const iconMap = {
    'House': House,
    'User': User,
    'Setting': Setting
  }
  return iconMap[iconName] || House
}
</script>

<style scoped>
.el-aside {
  background-color: #304156;
  height: 100vh;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
}

.el-menu {
  border-right: none;
}
</style>
```

**Step 2: 更新 mock 路由数据添加图标**

修改 `mock/server.js` 的 routesMap:
```javascript
const routesMap = {
  admin: [
    {
      path: '/',
      name: 'Home',
      component: '/layout/Layout',
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: '/views/Dashboard',
          meta: { title: '首页', icon: 'House' }
        },
        {
          path: 'user',
          name: 'User',
          component: '/views/User',
          meta: { title: '用户管理', icon: 'User' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: '/views/Settings',
          meta: { title: '系统设置', icon: 'Setting' }
        }
      ]
    }
  ],
  user: [
    {
      path: '/',
      name: 'Home',
      component: '/layout/Layout',
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: '/views/Dashboard',
          meta: { title: '首页', icon: 'House' }
        }
      ]
    }
  ]
}
```

**Step 3: 提交**

```bash
git add src/layout/Sidebar.vue mock/server.js
git commit -m "feat: support dynamic menu routes in sidebar"
```

---

## Task 14: 测试和文档

**Step 1: 测试完整流程**

1. 启动 mock 服务器：
   ```bash
   npm run mock
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 测试场景：
   - 访问 /login 显示登录页
   - 使用 admin/123456 登录，成功后跳转到首页
   - 检查侧边栏菜单是否正确显示（admin 应该看到所有菜单）
   - 使用 user/123456 登录，检查只显示首页菜单
   - 刷新页面，确保路由正常工作
   - 点击退出登录，清除 token 并跳转到登录页
   - 未登录时访问受保护路由，跳转到登录页

**Step 2: 创建 README**

创建 `docs/plans/2026-01-18-usage-guide.md`:
```markdown
# 后台管理系统使用指南

## 启动步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 启动 Mock 服务器
```bash
npm run mock
```

### 3. 启动开发服务器
```bash
npm run dev
```

## 测试账号

### 管理员账号
- 用户名: admin
- 密码: 123456
- 权限: 可访问所有页面

### 普通用户账号
- 用户名: user
- 密码: 123456
- 权限: 仅可访问首页

## 功能特性

1. 用户登录认证
2. 基于角色的动态路由
3. 路由权限控制
4. Token 持久化
5. 刷新页面后路由保持
6. 退出登录

## 技术栈

- Vue 3
- Vue Router 4
- Pinia
- Element Plus
- Axios
```

**Step 3: 提交**

```bash
git add docs/plans/2026-01-18-usage-guide.md
git commit -m "docs: add usage guide"
```

---

## 完成

所有任务已完成！系统已具备完整的用户权限管理和动态路由功能。
