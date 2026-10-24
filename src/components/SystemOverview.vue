<template>
  <div class="overview-page">
    <h2>系统状态总览</h2>

    <div class="ark-mode-control-card">
      <div class="ark-deco-left">
        <div class="ark-deco-block-main"></div>
        <div class="ark-deco-block-sub"></div>
      </div>
      <div class="ark-card-main-content">
        <div class="ark-card-header">
          <h3 class="ark-header-title">检测模式控制</h3>
          <div class="ark-header-line"></div>
        </div>
        <div class="mode-controls-container">
          <div class="ark-deco-strip-container">
            <div class="ark-deco-strip left">
              <div class="ark-strip-block" style="width: 40px; background: linear-gradient(to right, var(--strip-color-start), var(--strip-color-end));"></div>
              <div class="ark-strip-block" style="width: 15px;"></div>
              <div class="ark-strip-block" style="width: 15px;"></div>
            </div>
            <div class="ark-deco-strip right">
              <div class="ark-strip-block" style="width: 15px;"></div>
              <div class="ark-strip-block" style="width: 15px;"></div>
              <div class="ark-strip-block" style="width: 40px; background: linear-gradient(to right, var(--strip-color-start), var(--strip-color-end));"></div>
            </div>
          </div>
          <div class="mode-controls">
            <div class="mode-item">
              <span>火灾检测</span>
              <el-tag type="success">已开启</el-tag>
              <span class="status-desc">（系统常驻功能）</span>
            </div>
            <div class="mode-item">
              <span>入侵检测</span>
              <el-switch
                class="ark-switch"
                :model-value="intrusionDetectionEnabled"
                active-text="开启"
                inactive-text="关闭"
                @update:model-value="$emit('update:intrusionDetectionEnabled', $event)"
                @change="$emit('intrusionDetectionChange', $event)"
              />
              <span class="status-desc">（建议离家时开启）</span>
            </div>
            <div class="mode-item">
              <span>人物识别</span>
              <el-tag :type="intrusionDetectionEnabled ? 'warning' : 'success'">
                {{ intrusionDetectionEnabled ? '已关闭' : '已开启' }}
              </el-tag>
              <span class="status-desc">（系统常驻功能，识别人员活动）</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ark-deco-right">
        <div class="ark-deco-block-main"></div>
        <div class="ark-deco-block-sub"></div>
      </div>
    </div>

    <div class="detection-status-main">
      <div class="detection-module" :class="fireStatus.class">
        <div class="module-header">
          <h3>火灾检测</h3>
        </div>
        <div class="module-content">
          <div
            class="status-circle"
            :class="fireStatus.danger ? 'danger' : fireStatus.alert ? 'warning' : 'normal'"
          >
            <div class="circle-ring">
              <div class="circle-ring-inner"></div>
              <div class="circle-ring-middle"></div>
              <div class="circle-ring-outer"></div>
            </div>
            <template v-if="fireStatus.danger">
              <div class="danger-alarm-container">危险报警</div>
            </template>
            <template v-else-if="fireStatus.alert">
              <el-icon class="status-icon warning-icon"><WarningFilled /></el-icon>
            </template>
            <template v-else>
              <el-icon class="status-icon normal-icon"><CircleCheck /></el-icon>
            </template>
          </div>
          <div
            class="status-text primary"
            :class="
              fireStatus.danger ? 'danger-text' : fireStatus.alert ? 'warning-text' : ''
            "
          >
            {{ fireStatus.status }}
          </div>
          <div class="status-text secondary">
            {{
              fireStatus.danger ? 'Danger' : fireStatus.status === '正常' ? 'Normal' : 'Alert'
            }}
          </div>
        </div>
        <div class="module-info">
          <div class="info-row">
            <span>检测状态</span>
            <span
              class="info-value"
              :class="
                fireStatus.danger ? 'danger-value' : fireStatus.alert ? 'warning-value' : ''
              "
              >{{ fireStatus.status }}</span
            >
          </div>
          <div class="info-row">
            <span>检测值</span>
            <span
              class="info-value"
              :class="
                fireStatus.danger ? 'danger-value' : fireStatus.alert ? 'warning-value' : ''
              "
            >
              {{ fireStatus.value }}
            </span>
          </div>
          <div v-if="fireStatus.isAlarmActive" class="alarm-controls">
            <el-button type="primary" @click="$emit('cancelAlarm', 'fire')" size="small" round style="margin-right: 10px;">
              确认并取消报警
            </el-button>
            <el-button type="danger" @click="$emit('cancelAlarm', 'fire', true)" size="small" round>
              确认为误报
            </el-button>
          </div>
        </div>
      </div>

      <div
        class="detection-module"
        :class="
          intrusionDetectionEnabled
            ? intrusionStatus.danger
              ? 'status-danger'
              : 'status-normal'
            : 'status-inactive'
        "
      >
        <div class="module-header">
          <h3>入侵检测</h3>
        </div>
        <div class="module-content">
          <div
            class="status-circle"
            :class="
              intrusionDetectionEnabled
                ? intrusionStatus.danger
                  ? 'danger'
                  : 'normal'
                : 'inactive'
            "
          >
            <div class="circle-ring">
              <div class="circle-ring-inner"></div>
              <div class="circle-ring-middle"></div>
              <div class="circle-ring-outer"></div>
            </div>
            <template v-if="intrusionDetectionEnabled && intrusionStatus.danger">
              <div class="danger-alarm-container">危险报警</div>
            </template>
            <template v-else-if="intrusionDetectionEnabled">
              <el-icon class="status-icon normal-icon"><Unlock /></el-icon>
            </template>
            <template v-else>
              <el-icon class="status-icon inactive-icon"><Lock /></el-icon>
            </template>
          </div>
          <div
            class="status-text primary"
            :class="
              intrusionDetectionEnabled
                ? intrusionStatus.danger
                  ? 'danger-text'
                  : ''
                : 'inactive-text'
            "
          >
            {{ intrusionDetectionEnabled ? intrusionStatus.status : '已关闭' }}
          </div>
          <div
            class="status-text secondary"
            :class="intrusionDetectionEnabled ? '' : 'inactive-text'"
          >
            {{
              intrusionDetectionEnabled
                ? intrusionStatus.danger
                  ? 'Danger'
                  : 'Normal'
                : 'Disabled'
            }}
          </div>
        </div>
        <div class="module-info">
          <div class="info-row">
            <span>检测状态</span>
            <span
              class="info-value"
              :class="
                intrusionDetectionEnabled
                  ? intrusionStatus.danger
                    ? 'danger-value'
                    : ''
                  : 'inactive-value'
              "
            >
              {{ intrusionDetectionEnabled ? intrusionStatus.status : '已关闭' }}
            </span>
          </div>
          <div class="info-row">
            <span>环境状态</span>
            <span
              class="info-value"
              :class="
                intrusionDetectionEnabled
                  ? intrusionStatus.danger
                    ? 'danger-value'
                    : ''
                  : 'inactive-value'
              "
            >
              {{ intrusionDetectionEnabled ? intrusionStatus.value : '未检测' }}
            </span>
          </div>
          <div v-if="intrusionStatus.isAlarmActive && intrusionDetectionEnabled" class="alarm-controls">
            <el-button type="primary" @click="$emit('cancelAlarm', 'intrusion')" size="small" round style="margin-right: 10px;">
              确认并取消报警
            </el-button>
            <el-button type="danger" @click="$emit('cancelAlarm', 'intrusion', true)" size="small" round>
              确认为误报
            </el-button>
          </div>
        </div>
      </div>

      <div
        class="detection-module"
        :class="
          intrusionDetectionEnabled
            ? 'status-inactive'
            : peopleRecognitionStatus.danger
              ? 'status-danger'
              : 'status-normal'
        "
      >
        <div class="module-header">
          <h3>人物识别</h3>
        </div>
        <div class="module-content">
          <div
            class="status-circle"
            :class="
              intrusionDetectionEnabled
                ? 'inactive'
                : peopleRecognitionStatus.danger
                  ? 'danger'
                  : 'normal'
            "
          >
            <div class="circle-ring">
              <div class="circle-ring-inner"></div>
              <div class="circle-ring-middle"></div>
              <div class="circle-ring-outer"></div>
            </div>
            <template v-if="intrusionDetectionEnabled">
              <el-icon class="status-icon inactive-icon"><User /></el-icon>
            </template>
            <template v-else-if="peopleRecognitionStatus.danger">
              <div class="danger-alarm-container">可疑人员</div>
            </template>
            <template v-else>
              <el-icon class="status-icon normal-icon"><User /></el-icon>
            </template>
          </div>
          <div
            class="status-text primary"
            :class="
              intrusionDetectionEnabled
                ? 'inactive-text'
                : peopleRecognitionStatus.danger
                  ? 'danger-text'
                  : ''
            "
          >
            {{
              intrusionDetectionEnabled
                ? '已关闭'
                : peopleRecognitionStatus.danger
                  ? '可疑人员'
                  : '正常'
            }}
          </div>
          <div
            class="status-text secondary"
            :class="intrusionDetectionEnabled ? 'inactive-text' : ''"
          >
            {{
              intrusionDetectionEnabled
                ? 'Disabled'
                : peopleRecognitionStatus.danger
                  ? 'Suspicious'
                  : 'Normal'
            }}
          </div>
        </div>
        <div class="module-info">
          <div class="info-row">
            <span>检测状态</span>
            <span
              class="info-value"
              :class="
                intrusionDetectionEnabled
                  ? 'inactive-value'
                  : peopleRecognitionStatus.danger
                    ? 'danger-value'
                    : peopleRecognitionStatus.alert
                      ? 'warning-value'
                      : ''
              "
            >
              {{ intrusionDetectionEnabled ? '已关闭' : peopleRecognitionStatus.status }}
            </span>
          </div>
          <div class="info-row">
            <span>人数</span>
            <span
              class="info-value"
              :class="
                intrusionDetectionEnabled
                  ? 'inactive-value'
                  : peopleRecognitionStatus.danger
                    ? 'danger-value'
                    : peopleRecognitionStatus.alert
                      ? 'warning-value'
                      : ''
              "
            >
              {{ intrusionDetectionEnabled ? '-' : peopleRecognitionStatus.peopleCount + '人' }}
            </span>
          </div>
          <div class="info-row">
            <span>活动状态</span>
            <span
              class="info-value"
              :class="
                intrusionDetectionEnabled
                  ? 'inactive-value'
                  : peopleRecognitionStatus.danger
                    ? 'danger-value'
                    : peopleRecognitionStatus.alert
                      ? 'warning-value'
                      : ''
              "
            >
              {{ intrusionDetectionEnabled ? '-' : peopleRecognitionStatus.activityStatus }}
            </span>
          </div>
          <div v-if="peopleRecognitionStatus.isAlarmActive && !intrusionDetectionEnabled" class="alarm-controls">
            <el-button type="primary" @click="$emit('cancelAlarm', 'people')" size="small" round style="margin-right: 10px;">
              确认并取消报警
            </el-button>
            <el-button type="danger" @click="$emit('cancelAlarm', 'people', true)" size="small" round>
              确认为误报
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="ark-suggestion-card-light" :class="suggestionStatusClass">
      <div class="ark-deco-left">
        <div class="ark-deco-block-main"></div>
        <div class="ark-deco-block-sub"></div>
      </div>
      <div class="ark-card-main-content">
        <div class="ark-card-header">
          <h3 class="ark-header-title">系统分析与建议</h3>
          <div class="ark-header-line"></div>
        </div>
        <div class="ark-card-content">
          <div class="ark-suggestion-text">
            <p v-for="msg in systemSuggestion" :key="msg.module + msg.status">
              <span class="module-name">{{ msg.module }}</span>模块{{ msg.status }}{{ msg.desc ? '：' + msg.desc : '' }}
            </p>
          </div>
        </div>
        <div class="ark-card-footer">
          <div class="ark-footer-line"></div>
          <span class="ark-footer-text">SYSTEM ANALYSIS TERMINAL</span>
        </div>
      </div>
      <div class="ark-deco-right">
        <div class="ark-deco-block-main"></div>
        <div class="ark-deco-block-sub"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Warning, WarningFilled, CircleCheck, Lock, Unlock, View, UserFilled, User } from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  intrusionDetectionEnabled: Boolean,
  fireStatus: Object,
  intrusionStatus: Object,
  peopleRecognitionStatus: Object,
})

const systemSuggestion = computed(() => {
  let messages = [];

  if (props.fireStatus?.danger) {
    messages.push({ module: '火灾检测', status: '报警', desc: '检测到火灾风险，请立即检查！' });
  } else if (props.fireStatus?.alert) {
    messages.push({ module: '火灾检测', status: '警告', desc: '检测到潜在火灾风险，请注意！' });
  } else {
    messages.push({ module: '火灾检测', status: '正常运行' });
  }

  if (props.intrusionDetectionEnabled) {
    if (props.intrusionStatus?.danger) {
      messages.push({ module: '入侵检测', status: '报警', desc: '检测到入侵行为，请立即处理！' });
    } else {
      messages.push({ module: '入侵检测', status: '正常运行' });
    }
  } else {
    if (props.peopleRecognitionStatus?.danger) {
      messages.push({ module: '人物识别', status: '报警', desc: '检测到可疑人员，请注意！' });
    } else {
      messages.push({ module: '人物识别', status: '正常运行' });
    }
  }

  return messages;
});

const suggestionStatusClass = computed(() => {
  if (props.fireStatus?.danger || props.intrusionStatus?.danger || props.peopleRecognitionStatus?.danger) {
    return 'status-danger';
  }
  return 'status-normal';
});

defineEmits(['update:intrusionDetectionEnabled', 'intrusionDetectionChange', 'cancelAlarm'])
</script>

<style scoped>
.ark-mode-control-card {
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07), 0 3px 6px rgba(0, 0, 0, 0.05);
  padding: 10px 20px;
  margin-bottom: 20px;
  display: flex;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  --strip-color-start: rgba(100, 181, 246, 0.3);
  --strip-color-end: rgba(100, 181, 246, 0.7);
}

.ark-mode-control-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  border: 2px solid transparent;
  box-shadow: inset 0 0 0 2px #fff;
  pointer-events: none;
  z-index: 1;
}

.ark-mode-control-card .ark-card-main-content {
  flex-grow: 1;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 20px;
}

.ark-mode-control-card .ark-card-header {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.ark-mode-control-card .ark-header-title {
  color: #343a40;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.ark-mode-control-card .ark-header-line {
  height: 40px;
  width: 2px;
  background-color: #dee2e6;
  margin-top: 0;
}

.mode-controls-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ark-deco-strip-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0;
  height: 8px;
}

.ark-deco-strip {
  display: flex;
  height: 100%;
}

.ark-deco-strip.left {
  transform: skewX(-30deg);
  transform-origin: left;
}

.ark-deco-strip.right {
  transform: skewX(-30deg);
  transform-origin: right;
}

.ark-strip-block {
  height: 100%;
  background-color: #e9ecef;
  margin-right: 4px;
}

.ark-strip-block:last-child {
  margin-right: 0;
}

.mode-controls {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mode-item span:first-child {
  font-weight: 600;
  color: #303133;
}

.ark-switch {
  --el-switch-on-color: #409eff;
  --el-switch-off-color: #dcdfe6;
  --el-border-color-base: #dcdfe6;
}

.ark-switch .el-switch__core {
  background-color: var(--el-switch-off-color);
  border-radius: 10px;
  height: 20px;
  width: 40px;
}

.ark-switch.is-checked .el-switch__core {
  background-color: var(--el-switch-on-color);
}

.ark-switch .el-switch__core .el-switch__action {
  background-color: #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  top: 1px;
  left: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.ark-switch.is-checked .el-switch__core .el-switch__action {
  left: 100%;
  margin-left: -17px;
  background-color: #fff;
}

.ark-switch .el-switch__label {
  display: none;
}

.alarm-controls {
  margin-top: auto;
  display: flex;
  gap: 10px;
}

@keyframes alarm-flash {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.detection-module.status-danger {
  animation: alarm-flash 1s infinite;
}

.mode-control-card {
  margin-bottom: 20px;
}

.mode-controls {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-desc {
  color: #909399;
  font-size: 12px;
}

.detection-status-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.detection-card {
  flex: 1;
  min-width: 250px;
  transition: all 0.3s;
}

.detection-card.status-normal {
  border-left: 4px solid #67c23a;
}

.detection-card.status-warning {
  border-left: 4px solid #e6a23c;
  background-color: #fdf6ec;
}

.detection-card.status-danger {
  border-left: 4px solid #f56c6c;
  background-color: #fef0f0;
}

.detection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.detection-content {
  text-align: center;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.status-value {
  color: #606266;
}

.detection-status-main {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.detection-module {
  flex: 0 0 400px;
  border-radius: 12px;
  padding: 20px;
  background-color: white;
  color: #111827;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  min-height: 440px;
}

.detection-module:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.single-module {
  flex: 0 0 400px;
}

.module-header {
  text-align: center;
  margin-bottom: 15px;
}

.module-header h3 {
  font-size: 16px;
  color: #374151;
  margin: 0;
  font-weight: 600;
}

.module-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.status-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.status-circle.normal {
  background-color: rgba(16, 185, 129, 0.1);
}

.status-circle.warning {
  background-color: rgba(245, 158, 11, 0.1);
}

.status-circle.danger {
  background-color: rgba(239, 68, 68, 0.1);
}

.circle-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-ring-inner,
.circle-ring-middle,
.circle-ring-outer {
  position: absolute;
  border: 3px solid transparent;
  border-top-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
}

.status-normal .circle-ring-inner,
.status-normal .circle-ring-middle,
.status-normal .circle-ring-outer {
  border-top-color: #10b981;
  border-right-color: #10b981;
  border-bottom-color: #10b981;
}

.status-warning .circle-ring-inner,
.status-warning .circle-ring-middle,
.status-warning .circle-ring-outer {
  border-top-color: #f59e0b;
  border-right-color: #f59e0b;
  border-bottom-color: #f59e0b;
}

.status-danger .circle-ring-inner,
.status-danger .circle-ring-middle,
.status-danger .circle-ring-outer {
  border-top-color: #ef4444;
  border-right-color: #ef4444;
  border-bottom-color: #ef4444;
}

.status-inactive .circle-ring-inner,
.status-inactive .circle-ring-middle,
.status-inactive .circle-ring-outer {
  border-top-color: #9ca3af;
  border-right-color: #9ca3af;
  border-bottom-color: #9ca3af;
}

.status-circle.inactive {
  background-color: rgba(156, 163, 175, 0.1);
}

.inactive-icon {
  color: #9ca3af;
}

.inactive-text {
  color: #9ca3af;
}

.inactive-value {
  color: #9ca3af;
  font-weight: 500;
}

.circle-ring-inner {
  width: 60%;
  height: 60%;
  animation: rotate 4s linear infinite;
}

.circle-ring-middle {
  width: 80%;
  height: 80%;
  animation: rotate 6s linear infinite reverse;
}

.circle-ring-outer {
  width: 100%;
  height: 100%;
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.status-icon {
  font-size: 48px;
  z-index: 1;
}

.normal-icon {
  color: #10b981;
}

.warning-icon {
  color: #f59e0b;
}

.danger-icon {
  color: #ef4444;
}

.fall-icon-container {
  z-index: 1;
  color: #f59e0b;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.danger-alarm-container {
  z-index: 1;
  color: #ef4444;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  animation: shake 0.3s infinite;
}

.status-text.primary {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #111827;
}

.status-text.primary.warning-text {
  color: #f59e0b;
  animation: shake 0.5s infinite;
}

.status-text.primary.danger-text {
  color: #ef4444;
  animation: shake 0.3s infinite;
}

.status-text.secondary {
  font-size: 14px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.module-info {
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
  height: 120px;
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row span:first-child {
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  color: #111827;
  font-weight: 600;
}

.info-value.warning-value {
  color: #f59e0b;
  font-weight: 700;
  animation: pulse 1s infinite;
}

.info-value.danger-value {
  color: #ef4444;
  font-weight: 700;
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.ark-suggestion-card-light {
  --status-color-normal: #10b981;
  --status-color-warning: #f59e0b;
  --status-color-danger: #ef4444;
  --current-status-color: var(--status-color-normal);

  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
  font-family: 'Helvetica Neue', 'Arial', 'Noto Sans SC', sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.ark-suggestion-card-light.status-normal {
  --current-status-color: var(--status-color-normal);
}
.ark-suggestion-card-light.status-warning {
  --current-status-color: var(--status-color-warning);
  background-color: #fffbeb;
}
.ark-suggestion-card-light.status-danger {
  --current-status-color: var(--status-color-danger);
  background-color: #fef0f0;
  animation: ark-pulse-danger 1.5s infinite;
}

.ark-card-main-content {
  flex-grow: 1;
  text-align: left;
}

.ark-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.ark-header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--current-status-color);
  margin: 0;
  transition: color 0.3s ease;
}

.ark-header-line {
  flex-grow: 1;
  height: 1px;
  background-color: #e5e7eb;
  margin-left: 16px;
}

.ark-suggestion-text {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
}

.ark-suggestion-text p {
  margin: 0 0 8px 0;
}

.ark-suggestion-text p:last-child {
  margin-bottom: 0;
}

.module-name {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 2px 6px;
  font-weight: 600;
  color: #374151;
  margin-right: 4px;
}

.ark-card-footer {
  margin-top: 15px;
  text-align: center;
}

.ark-footer-line {
  height: 1px;
  background-color: #e5e7eb;
  margin-bottom: 8px;
}

.ark-footer-text {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.ark-deco-left, .ark-deco-right {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 12px;
}

.ark-deco-left {
  margin-right: 20px;
}

.ark-deco-right {
  margin-left: 20px;
}

.ark-deco-block-main, .ark-deco-block-sub {
  width: 100%;
  transition: background-color 0.3s ease;
  transform: skewX(-15deg);
}

.ark-deco-block-main {
  height: 25px;
  background-color: var(--current-status-color);
}

.ark-deco-block-sub {
  height: 12px;
  background-color: #d1d5db;
}

.ark-deco-right .ark-deco-block-main {
  align-self: flex-end;
}
.ark-deco-right .ark-deco-block-sub {
  align-self: flex-end;
}

@keyframes ark-pulse-danger {
  0%, 100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0);
  }
  50% {
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
  }
}
</style>
