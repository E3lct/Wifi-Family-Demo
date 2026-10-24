<template>
  <div class="logs-page">
    <h2>系统日志</h2>

    <div class="log-filters">
      <el-select v-model="logFilter" placeholder="选择日志类型">
        <el-option label="全部日志" value="all"></el-option>
        <el-option label="火灾检测" value="fire"></el-option>
        <el-option label="基本入侵检测" value="intrusion"></el-option>
        <el-option label="人物识别" value="people"></el-option>
        <el-option label="系统操作" value="system"></el-option>
      </el-select>
      <el-input
        v-model="logSearch"
        placeholder="搜索日志内容"
        :prefix-icon="Search"
        style="width: 300px; margin-left: 10px"
      />

      <el-button type="primary" size="small" @click="exportLogs" style="margin-left:12px">导出日志</el-button>
    </div>

    <el-table :data="filteredLogs" height="100%" class="logs-table">
      <el-table-column prop="time" label="时间" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template #default="scope">
          <el-tag :type="getLogTypeTag(scope.row.type)">{{ scope.row.typeText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { logFilter, logSearch, filteredLogs, getLogTypeTag, systemLogs } from '../composables/useLogs'

const exportLogs = () => {
  const rows = (filteredLogs && filteredLogs.length !== undefined) ? filteredLogs : systemLogs
  // filteredLogs is a computed ref, ensure we read .value
  const data = (filteredLogs && filteredLogs.value) ? filteredLogs.value : (systemLogs && systemLogs.value) ? systemLogs.value : []

  const escapeCsv = (s) => `"${String(s || '').replace(/"/g, '""')}"`
  const header = ['时间', '类型', '类型文本', '内容']
  const lines = data.map(r => [r.time, r.type, r.typeText, r.content].map(escapeCsv).join(','))
  const csv = [header.map(escapeCsv).join(','), ...lines].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')
  a.download = `system_logs_${ts}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.logs-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.log-filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logs-table {
  width: 100%;
  flex: 1;
}
</style>
