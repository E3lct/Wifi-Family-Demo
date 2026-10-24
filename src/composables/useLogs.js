import { ref, computed } from 'vue'

export const systemLogs = ref([])

export const logFilter = ref('all')

export const logSearch = ref('')

export const filteredLogs = computed(() => {
  let logs = systemLogs.value

  if (logFilter.value !== 'all') {
    logs = logs.filter(log => log.type === logFilter.value)
  }

  if (logSearch.value) {
    logs = logs.filter(log =>
      log.content.toLowerCase().includes(logSearch.value.toLowerCase())
    )
  }

  return logs
})

export const getLogTypeTag = (type) => {
  const tagMap = {
    system: 'info',
    fire: 'danger',
    intrusion: 'warning',
    people: 'success'
  }
  return tagMap[type] || 'info'
}

export const addSystemLog = (content, type = 'system') => {
  const typeTextMap = {
    system: '系统',
    fire: '火灾检测',
    intrusion: '基本入侵检测',
    people: '人物识别',
  }

  systemLogs.value.unshift({
    time: new Date().toLocaleString(),
    type,
    typeText: typeTextMap[type],
    content,
  })

  if (systemLogs.value.length > 1000) {
    systemLogs.value.pop()
  }
}

addSystemLog('系统启动成功', 'system');
addSystemLog('火灾检测模块已加载', 'fire');
addSystemLog('人物识别模块已加载', 'people');
addSystemLog('入侵检测模块已加载', 'intrusion');