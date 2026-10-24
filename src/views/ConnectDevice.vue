<template>
  <div class="connect-page">
    <h2>设备连接与配置</h2>
    <p v-if="!deviceIntegrationEnabled" class="muted">设备接入预留页：未配置后端，当前无法保存或连接真实设备。</p>

    <el-card class="connect-card">
      <div class="form-row">
        <el-form :model="form" label-width="120px" class="config-form">
          <el-form-item label="MQTT 服务器">
            <el-input v-model="form.MQTT_SERVER" placeholder="例如 192.0.2.10"></el-input>
          </el-form-item>
          <el-form-item label="MQTT 端口">
            <el-input v-model="form.MQTT_PORT" type="number"></el-input>
          </el-form-item>
          <el-form-item label="MQTT 主题">
            <el-input v-model="form.MQTT_TOPIC" placeholder="esp/forward/#"></el-input>
          </el-form-item>
          <el-form-item label="设备 MAC (可选)">
            <el-input v-model="form.DEVICE_MAC" placeholder="例如 AA:BB:CC:DD:EE:FF"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveConfig" :loading="saving" :disabled="!deviceIntegrationEnabled">保存配置</el-button>
            <el-button @click="reconnectMqtt" :loading="reconnecting" :disabled="!deviceIntegrationEnabled" style="margin-left:8px">重连 MQTT</el-button>
            <el-button type="warning" @click="loadConfig" style="margin-left:8px">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="status-row">
        <div class="status-item">
          <div>Socket 状态</div>
          <div><el-tag :type="isConnected ? 'success' : 'info'">{{ isConnected ? '已连接' : '未连接' }}</el-tag></div>
        </div>
        <div class="status-item">
          <div>后端地址</div>
          <div class="muted">{{ serverUrl || '未配置（演示模式）' }}</div>
        </div>
      </div>

      <div class="csi-preview">
        <h4>最新 CSI 振幅（预览）</h4>
        <div v-if="latest && latest.length">
          <div class="bars">
            <div class="bar" v-for="(v, i) in latest" :key="i" :style="{ height: (v/255*80) + 'px' }"></div>
          </div>
        </div>
        <div v-else class="placeholder">暂无数据</div>
      </div>

      <div style="margin-top:12px; color:var(--muted); font-size:13px">
        提示：保存配置后请点击“重连 MQTT”使后端应用新配置。
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { deviceIntegrationEnabled, useSocket } from '../composables/useSocket'

const { socket, isConnected, csiData, subscribe, serverUrl } = useSocket(128)

const form = ref({
  MQTT_SERVER: '',
  MQTT_PORT: 1883,
  MQTT_TOPIC: 'esp/forward/#',
  DEVICE_MAC: ''
})

const latest = ref([])
let unsub
onMounted(() => {
  unsub = subscribe((arr) => { latest.value = arr.slice(0, 60) })
  loadConfig()
})
onUnmounted(() => { try { unsub && unsub() } catch (e) {} })

const saving = ref(false)
const reconnecting = ref(false)

async function loadConfig() {
  try {
    if (!deviceIntegrationEnabled) return;
    const resp = await fetch(new URL('/config', serverUrl))
    if (resp.ok) {
      const j = await resp.json()
      form.value.MQTT_SERVER = j.MQTT_SERVER || form.value.MQTT_SERVER
      form.value.MQTT_PORT = j.MQTT_PORT || form.value.MQTT_PORT
      form.value.MQTT_TOPIC = j.MQTT_TOPIC || form.value.MQTT_TOPIC
      form.value.DEVICE_MAC = j.DEVICE_MAC || form.value.DEVICE_MAC
    }
  } catch (e) {
    console.warn('无法读取后端配置', e)
  }
}

async function saveConfig() {
  saving.value = true
  try {
    const payload = {
      MQTT_SERVER: form.value.MQTT_SERVER,
      MQTT_PORT: Number(form.value.MQTT_PORT) || 1883,
      MQTT_TOPIC: form.value.MQTT_TOPIC,
      DEVICE_MAC: form.value.DEVICE_MAC
    }
    const resp = await fetch(new URL('/config', serverUrl), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!resp.ok) {
      const t = await resp.text()
      throw new Error(t || '保存失败')
    }
    alert('配置已保存')
  } catch (e) {
    alert('保存配置失败: ' + (e.message || e))
  } finally {
    saving.value = false
  }
}

async function reconnectMqtt() {
  reconnecting.value = true
  try {
    const resp = await fetch(new URL('/mqtt/reconnect', serverUrl), { method: 'POST' })
    if (!resp.ok) {
      const t = await resp.text()
      throw new Error(t || '重连失败')
    }
    alert('已请求后端重连 MQTT')
  } catch (e) {
    alert('重连失败: ' + (e.message || e))
  } finally {
    reconnecting.value = false
  }
}
</script>

<style scoped>
.connect-card { padding: 16px; max-width: 900px; }
.config-form { max-width: 680px; }
.form-row { display:flex; gap:20px; }
.status-row { display:flex; gap:24px; margin-top:12px; align-items:center }
.status-item { display:flex; flex-direction:column; gap:6px }
.muted { color: #94a3b8 }
.csi-preview { margin-top: 18px }
.bars { display:flex; gap:2px; align-items:end; height:80px }
.bar { width:4px; background: #38bdf8 }
.placeholder { color: #94a3b8 }
</style>
