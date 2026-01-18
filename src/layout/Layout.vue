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
