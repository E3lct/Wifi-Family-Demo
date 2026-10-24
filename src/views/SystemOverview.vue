<template>
  <div class="overview-page">
    <h2>系统状态总览</h2>

    <el-card class="mode-control-card">
      <h3>检测模式控制</h3>
      <div class="mode-controls">
        <div class="mode-item">
          <span>火灾检测</span>
          <el-tag type="success">已开启</el-tag>
          <span class="status-desc">（系统常驻功能）</span>
        </div>
        <div class="mode-item">
          <span>入侵检测</span>
          <el-switch
            v-model="intrusionDetectionEnabled"
            active-text="开启"
            inactive-text="关闭"
            @change="handleIntrusionDetectionChange"
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
    </el-card>

    <div class="detection-status-main">
      <div class="detection-module" :class="fireStatus.class">
        <div class="module-header">
          <h3>火灾检测</h3>
        </div>
        <div class="module-content">
          <div class="status-circle" :class="fireStatus.danger ? 'danger' : fireStatus.alert ? 'warning' : 'normal'">
            <div class="circle-ring">
              <div class="circle-ring-inner"></div>
              <div class="circle-ring-middle"></div>
              <div class="circle-ring-outer"></div>
            </div>
            <template v-if="fireStatus.danger">
              <div class="danger-alarm-container">危险报警</div>
            </template>
            <template v-else-if="fireStatus.alert">
              <el-icon class="status-icon warning-icon"><Warning /></el-icon>
            </template>
            <template v-else>
              <el-icon class="status-icon normal-icon"><Warning /></el-icon>
            </template>
          </div>
          <div class="status-text primary" :class="fireStatus.danger ? 'danger-text' : fireStatus.alert ? 'warning-text' : ''">
            {{ fireStatus.status }}
          </div>
          <div class="status-text secondary">
            {{ fireStatus.danger ? 'Danger' : fireStatus.status === '正常' ? 'Normal' : 'Alert' }}
          </div>
        </div>
        <div class="module-info">
          <div class="info-row">
            <span>检测状态</span>
            <span class="info-value" :class="fireStatus.danger ? 'danger-value' : fireStatus.alert ? 'warning-value' : ''">
              {{ fireStatus.status }}
            </span>
          </div>
          <div class="info-row">
            <span>检测值</span>
            <span class="info-value" :class="fireStatus.danger ? 'danger-value' : fireStatus.alert ? 'warning-value' : ''">
              {{ fireStatus.value }}
            </span>
          </div>
          <div v-if="fireStatus.isAlarmActive" class="alarm-controls">
            <el-button type="primary" @click="cancelAlarm('fire')" size="small" style="margin-right: 10px;">
              确认并取消报警
            </el-button>
            <el-button type="danger" @click="cancelAlarm('fire', true)" size="small">
              确认为误报
            </el-button>
          </div>
        </div>
      </div>

      <div class="detection-module" :class="intrusionDetectionEnabled ? intrusionStatus.danger ? 'status-danger' : 'status-normal' : 'status-inactive'">
        <div class="module-header">
          <h3>入侵检测</h3>
        </div>
        <div class="module-content">
          <div class="status-circle" :class="intrusionDetectionEnabled ? intrusionStatus.danger ? 'danger' : 'normal' : 'inactive'">
            <div class="circle-ring">
              <div class="circle-ring-inner"></div>
              <div class="circle-ring-middle"></div>
              <div class="circle-ring-outer"></div>
            </div>
            <template v-if="intrusionDetectionEnabled && intrusionStatus.danger">
              <div class="danger-alarm-container">危险报警</div>
            </template>
            <template v-else-if="intrusionDetectionEnabled">
              <el-icon class="status-icon normal-icon"><UserFilled /></el-icon>
            </template>
            <template v-else>
              <el-icon class="status-icon inactive-icon"><UserFilled /></el-icon>
            </template>
          </div>
          <div class="status-text primary" :class="intrusionDetectionEnabled ? intrusionStatus.danger ? 'danger-text' : '' : 'inactive-text'">
            {{ intrusionDetectionEnabled ? intrusionStatus.status : '已关闭' }}
          </div>
          <div class="status-text secondary" :class="intrusionDetectionEnabled ? '' : 'inactive-text'">
            {{ intrusionDetectionEnabled ? intrusionStatus.danger ? 'Danger' : 'Normal' : 'Disabled' }}
          </div>
        </div>
        <div class="module-info">
          <div class="info-row">
            <span>检测状态</span>
            <span class="info-value" :class="intrusionDetectionEnabled ? intrusionStatus.danger ? 'danger-value' : '' : 'inactive-value'">
              {{ intrusionDetectionEnabled ? intrusionStatus.status : '已关闭' }}
            </span>
          </div>
          <div class="info-row">
            <span>环境状态</span>
            <span class="info-value" :class="intrusionDetectionEnabled ? intrusionStatus.danger ? 'danger-value' : '' : 'inactive-value'">
              {{ intrusionDetectionEnabled ? intrusionStatus.value : '未检测' }}
            </span>
          </div>
          <div v-if="intrusionStatus.isAlarmActive && intrusionDetectionEnabled" class="alarm-controls">
            <el-button type="primary" @click="cancelAlarm('intrusion')" size="small" style="margin-right: 10px;">
              确认并取消报警
            </el-button>
            <el-button type="danger" @click="cancelAlarm('intrusion', true)" size="small">
              确认为误报
            </el-button>
          </div>
        </div>
      </div>

      <div class="detection-module" :class="intrusionDetectionEnabled ? 'status-inactive' : peopleRecognitionStatus.danger ? 'status-danger' : 'status-normal'">
        <div class="module-header">
          <h3>人物识别</h3>
        </div>
        <div class="module-content">
          <div class="status-circle" :class="intrusionDetectionEnabled ? 'inactive' : peopleRecognitionStatus.danger ? 'danger' : 'normal'">
            <div class="circle-ring">
              <div class="circle-ring-inner"></div>
              <div class="circle-ring-middle"></div>
              <div class="circle-ring-outer"></div>
            </div>
            <template v-if="intrusionDetectionEnabled">
              <el-icon class="status-icon inactive-icon"><UserFilled /></el-icon>
            </template>
            <template v-else-if="peopleRecognitionStatus.danger">
              <div class="danger-alarm-container">可疑人员</div>
            </template>
            <template v-else>
              <el-icon class="status-icon normal-icon"><UserFilled /></el-icon>
            </template>
          </div>
          <div class="status-text primary" :class="intrusionDetectionEnabled ? 'inactive-text' : peopleRecognitionStatus.danger ? 'danger-text' : ''">
            {{ intrusionDetectionEnabled ? '已关闭' : peopleRecognitionStatus.danger ? '可疑人员' : '正常' }}
          </div>
          <div class="status-text secondary" :class="intrusionDetectionEnabled ? 'inactive-text' : ''">
            {{ intrusionDetectionEnabled ? 'Disabled' : peopleRecognitionStatus.danger ? 'Suspicious' : 'Normal' }}
          </div>
        </div>
        <div class="module-info">
          <div class="info-row">
            <span>检测状态</span>
            <span class="info-value" :class="intrusionDetectionEnabled ? 'inactive-value' : peopleRecognitionStatus.danger ? 'danger-value' : peopleRecognitionStatus.alert ? 'warning-value' : ''">
              {{ intrusionDetectionEnabled ? '已关闭' : peopleRecognitionStatus.status }}
            </span>
          </div>
          <div class="info-row">
            <span>人数</span>
            <span class="info-value" :class="intrusionDetectionEnabled ? 'inactive-value' : peopleRecognitionStatus.danger ? 'danger-value' : peopleRecognitionStatus.alert ? 'warning-value' : ''">
              {{ intrusionDetectionEnabled ? '-' : peopleRecognitionStatus.peopleCount + '人' }}
            </span>
          </div>
          <div class="info-row">
            <span>活动状态</span>
            <span class="info-value" :class="intrusionDetectionEnabled ? 'inactive-value' : peopleRecognitionStatus.danger ? 'danger-value' : peopleRecognitionStatus.alert ? 'warning-value' : ''">
              {{ intrusionDetectionEnabled ? '-' : peopleRecognitionStatus.activityStatus }}
            </span>
          </div>
          <div v-if="peopleRecognitionStatus.isAlarmActive && !intrusionDetectionEnabled" class="alarm-controls">
            <el-button type="primary" @click="cancelAlarm('people')" size="small" style="margin-right: 10px;">
              确认并取消报警
            </el-button>
            <el-button type="danger" @click="cancelAlarm('people', true)" size="small">
              确认为误报
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-card class="ai-suggestion-card">
      <h3>系统建议</h3>
      <div class="ai-suggestion-content">
        <div v-if="aiSuggestion" class="suggestion-text">{{ aiSuggestion }}</div>
        <div v-else class="suggestion-placeholder">系统正在分析...</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Warning, UserFilled } from '@element-plus/icons-vue'
import {
  intrusionDetectionEnabled,
  fireStatus,
  intrusionStatus,
  peopleRecognitionStatus,
  cancelAlarm,
  handleIntrusionDetectionChange
} from '../composables/useDetection'
import { aiSuggestion } from '../composables/useAiChat'
</script>

<style scoped>
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.alarm-controls {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.danger-alarm-container {
  z-index: 1;
  color: #ef4444;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  animation: shake 0.3s infinite;
}

.ai-suggestion-card {
  background-color: #f0f9ff;
  border-left: 4px solid #36cfc9;
}

.ai-suggestion-content {
  min-height: 80px;
  display: flex;
  align-items: center;
}

.suggestion-text {
  font-size: 16px;
  color: #303133;
}

.suggestion-placeholder {
  color: #909399;
  font-style: italic;
}
</style>
