# 后台管理系统设计文档

## 项目概述
构建一个基于 Vue 3 的轻量级后台管理系统，实现用户权限管理和动态路由功能。

## 技术栈
- Vue 3 + Vite
- Vue Router 4（动态路由）
- Pinia（状态管理）
- Element Plus（UI组件库）
- Axios（HTTP请求）

## 核心功能

### 1. 登录认证
- 用户名密码登录
- 获取并存储 token
- Token 持久化（localStorage）

### 2. 动态路由
- 后端返回用户的路由配置（包含角色权限）
- 前端使用 `router.addRoute()` 动态注册
- 解决刷新页面后路由丢失问题

### 3. 角色权限控制
- 不同角色看到不同的菜单和页面
- 路由守卫实现权限控制

### 4. 页面结构
- 登录页（/login）
- 布局页（包含侧边栏、顶部导航、内容区）
- 示例页面：首页（/dashboard）、用户页（/user）、设置页（/settings）

## 架构设计

### 动态路由刷新问题解决方案
**根本原因**：刷新页面后 Vue 实例重新初始化，动态添加的路由丢失

**解决方案**：
1. **路由白名单机制**：白名单路由（如登录页）直接放行
2. **路由注册状态管理**：在 Pinia store 中维护路由是否已注册的状态
3. **异步路由加载**：全局前置守卫中检查 token 和路由注册状态
   - 有 token 但路由未注册 → 获取路由配置 → 动态注册 → 继续导航
   - 无 token 且访问非白名单路由 → 重定向到登录页
4. **404 路由处理**：动态路由注册完成后最后添加 404 路由

### 目录结构
```
src/
├── api/              # 接口定义
│   └── auth.js       # 登录和获取路由接口
├── assets/           # 静态资源
├── components/       # 公共组件
├── layout/           # 布局组件
│   ├── Layout.vue    # 主布局
│   ├── Sidebar.vue   # 侧边栏
│   └── Header.vue    # 顶部导航
├── router/           # 路由配置
│   ├── index.js      # 静态路由和 router 实例
│   └── async-routes.js  # 动态路由处理逻辑
├── stores/           # Pinia stores
│   ├── user.js       # 用户信息（id, username, role, token）
│   └── permission.js # 权限和路由状态管理
├── views/            # 页面组件
│   ├── Login.vue
│   ├── Dashboard.vue
│   ├── User.vue
│   └── Settings.vue
├── utils/            # 工具函数
│   └── request.js    # axios 封装
└── main.js
```

## 数据流

### 登录流程
1. 用户输入账号密码 → 调用登录接口
2. 存储 token 到 localStorage 和 store
3. 跳转到首页
4. 首次进入 → 触发路由守卫 → 检测路由未注册
5. 调用获取路由接口 → 动态注册路由 → 渲染菜单

### 接口调用流程
1. axios 请求拦截器：从 localStorage 读取 token 并添加到请求头
2. axios 响应拦截器：统一处理 401（token失效），清除登录状态，跳转登录页

### 路由刷新流程
1. 用户刷新页面 → Vue 重启 → 全局路由守卫触发
2. 检测到有 token 但路由未注册
3. 重新获取路由配置 → 动态注册 → 放行到目标页面

## 组件设计

### 核心组件
- **Login.vue**：登录表单，包含用户名/密码输入、登录按钮
- **Layout.vue**：主布局组件
  - Sidebar（侧边栏菜单）：根据动态路由生成菜单
  - Header（顶部导航）：用户信息、退出按钮
  - Main（内容区）：router-view 渲染页面
- **Dashboard/User/Settings.vue**：示例页面组件

### 错误处理
1. **登录错误**：接口返回错误时显示 Element Plus Message 提示
2. **权限错误**：路由守卫拦截，显示无权限提示或重定向
3. **Token 失效**：axios 响应拦截器捕获 401，自动清除 token，跳转登录页
4. **路由注册失败**：获取路由接口失败时，重置路由注册状态，重新登录

## API 接口
- POST /api/login：用户登录
- GET /api/routes：获取用户的路由配置（包含权限信息）

## 依赖包
需要安装的 npm 包：
- vue-router
- pinia
- element-plus
- axios
- @element-plus/icons-vue
