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
