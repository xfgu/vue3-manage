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
