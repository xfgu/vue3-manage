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
