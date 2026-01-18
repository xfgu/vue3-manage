# Vue 3 后台管理系统

一个基于 Vue 3 的后台管理系统，实现用户权限管理和动态路由功能。

## 功能特性

- 用户登录认证
- 基于角色的动态路由
- 路由权限控制
- Token 持久化
- 刷新页面后路由保持
- 退出登录

## 技术栈

- Vue 3
- Vue Router 4
- Pinia
- Element Plus
- Axios

## 快速开始

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

## 详细文档

查看 [使用指南](./docs/plans/2026-01-18-usage-guide.md) 了解更多详情。

