<template>
  <el-card>
    <template #header>
      <h2>欢迎来到后台管理系统</h2>
    </template>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <h3>用户总数</h3>
          <p class="stat-number">1,234</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <h3>访问次数</h3>
          <p class="stat-number">5,678</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <h3>系统状态</h3>
          <p class="stat-number green">正常运行</p>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
h2 {
  margin: 0;
  color: #333;
}

.stat-card {
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 16px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin: 0;
}

.stat-number.green {
  color: #67c23a;
}
</style>
