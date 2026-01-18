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
