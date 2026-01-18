import router from './index'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'
import { getRoutes } from '@/api/auth'
import { ElMessage } from 'element-plus'

// 路由白名单
const whiteList = ['/login', '/404']

// 预加载所有视图组件
const viewsModules = import.meta.glob('../views/**/*.vue')
const layoutModules = import.meta.glob('../layout/**/*.vue')

console.log('可用的 views 模块:', Object.keys(viewsModules))
console.log('可用的 layout 模块:', Object.keys(layoutModules))

/**
 * 加载视图组件
 * @param {string} path 组件路径，如 '@/views/Dashboard' 或 '@/layout/Layout'
 * @returns {Function} 动态导入函数
 */
function loadView(path) {
  console.log('加载组件:', path)

  // 移除 @/ 或 / 前缀，以及 .vue 后缀
  const relativePath = path.replace(/^@\//, '').replace(/^\//, '').replace(/\.vue$/, '')
  console.log('相对路径:', relativePath)

  // 判断是 views 还是 layout
  if (relativePath.startsWith('views/')) {
    const viewPath = relativePath.replace('views/', '../views/')
    const component = viewsModules[`${viewPath}.vue`] || (() => import('../views/404.vue'))
    console.log('Views 组件路径:', `${viewPath}.vue`, '组件存在:', !!viewsModules[`${viewPath}.vue`])
    return component
  } else if (relativePath.startsWith('layout/')) {
    const layoutPath = relativePath.replace('layout/', '../layout/')
    const component = layoutModules[`${layoutPath}.vue`] || (() => import('../views/404.vue'))
    console.log('Layout 组件路径:', `${layoutPath}.vue`, '组件存在:', !!layoutModules[`${layoutPath}.vue`])
    return component
  }

  // 默认返回 404
  console.log('使用默认 404 组件')
  return () => import('../views/404.vue')
}

/**
 * 将路由配置中的字符串路径转换为异步导入函数
 * @param {Object} route 路由配置
 * @returns {Object} 处理后的路由配置
 */
function transformRoute(route) {
  const transformed = { ...route }

  // 将 component 字符串转换为异步导入函数
  if (typeof transformed.component === 'string') {
    transformed.component = loadView(transformed.component)
  }

  // 递归处理子路由
  if (transformed.children && Array.isArray(transformed.children)) {
    transformed.children = transformed.children.map(transformRoute)
  }

  return transformed
}

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
    // 调试：检查localStorage中的token
    const token = localStorage.getItem('token')
    console.log('动态路由前localStorage token:', token)
    console.log('userStore token:', userStore.token)
    
    // 调用接口获取路由配置
    const res = await getRoutes()
    const dynamicRoutes = res.data || []

    console.log('原始路由配置:', dynamicRoutes)

    // 转换路由配置并动态添加
    dynamicRoutes.forEach((route, index) => {
      const transformed = transformRoute(route)
      console.log(`转换后的路由 ${index}:`, transformed)
      router.addRoute(transformed)
    })

    console.log('当前所有路由:', router.getRoutes())

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
    console.error('错误详情:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : '无response对象')
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
