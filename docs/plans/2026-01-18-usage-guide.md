# 后台管理系统使用指南

## 启动步骤

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动 Mock 服务器
```bash
pnpm run mock
```

### 3. 启动开发服务器
```bash
pnpm run dev
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
