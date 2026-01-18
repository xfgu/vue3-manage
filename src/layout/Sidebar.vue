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
