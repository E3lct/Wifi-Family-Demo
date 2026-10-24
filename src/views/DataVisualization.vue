<template>
  <div class="visualization-page">
    <h2>数据可视化</h2>

    <div class="fire-detection-area">
      <el-card class="csi-spectrogram-card">
        <h3>CSI时频谱图</h3>
        <div class="csi-spectrogram-container">
          <div class="spectrogram-visual">
            <div class="spectrogram-gradient"></div>
            <div v-for="(row, rowIndex) in 20" :key="rowIndex" class="spectrogram-row">
              <div v-for="(pixel, colIndex) in 50" :key="colIndex" class="spectrogram-pixel"
                :style="{ opacity: getSpectrogramOpacity(rowIndex, colIndex) }">
              </div>
            </div>
          </div>
          <div class="spectrogram-info">
            <div class="info-item">
              <span>时间范围:</span>
              <span>{{ currentTimeRange }}</span>
            </div>
            <div class="info-item">
              <span>区域覆盖:</span>
              <span>全屋示意（未实测）</span>
            </div>
            <div class="info-item">
              <span>识别评估:</span>
              <span>未测评（模拟数据）</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="yolo-detection-card">
        <h3>火焰 / 烟雾检测结果（模拟）</h3>
        <div class="yolo-detection-container">
          <div class="detection-preview">
            <div class="preview-image">
              <div v-for="flame in detectedFlames" :key="flame.id" class="detection-bbox flame-bbox"
                :style="{
                  left: flame.x + 'px',
                  top: flame.y + 'px',
                  width: flame.width + 'px',
                  height: flame.height + 'px'
                }">
                <div class="bbox-label">火焰 ({{ flame.confidence }}%)</div>
              </div>
              <div v-for="smoke in detectedSmokes" :key="smoke.id" class="detection-bbox smoke-bbox"
                :style="{
                  left: smoke.x + 'px',
                  top: smoke.y + 'px',
                  width: smoke.width + 'px',
                  height: smoke.height + 'px'
                }">
                <div class="bbox-label">烟雾 ({{ smoke.confidence }}%)</div>
              </div>
            </div>
          </div>
          <div class="detection-stats">
            <div class="stat-item">
              <span class="stat-label">检测到火焰:</span>
              <span class="stat-value flame-count">{{ detectedFlames.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">检测到烟雾:</span>
              <span class="stat-value smoke-count">{{ detectedSmokes.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">演示置信度阈值:</span>
              <span class="stat-value">0.65</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="charts-container">
      <el-card class="chart-card">
        <h3>火灾检测数据趋势</h3>
        <div class="chart-wrapper" ref="fireChartRef"></div>
      </el-card>

      <el-card class="chart-card">
        <h3>人物识别统计</h3>
        <div class="chart-wrapper" ref="peopleChartRef"></div>
      </el-card>
    </div>

    <el-card class="data-stream-card">
      <h3>人物识别实时流</h3>
      <div class="data-stream-container">
        <div v-for="(data, index) in csiDataStream" :key="index" class="data-stream-item">
          {{ data }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {
  csiDataStream,
  fireChartRef,
  peopleChartRef,
  currentTimeRange,
  detectedFlames,
  detectedSmokes,
  getSpectrogramOpacity
} from '../composables/useVisualization'
</script>

<style scoped>
.fire-detection-area {
  margin-bottom: 30px;
}

.csi-spectrogram-card {
  margin-bottom: 20px;
}

.csi-spectrogram-container {
  display: flex;
  gap: 20px;
  align-items: center;
}

.spectrogram-visual {
  flex: 1;
  height: 200px;
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.spectrogram-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #000033, #000099, #0066ff, #00ccff, #66ffcc, #ffffcc, #ffcc99, #ff9966, #ff6600, #ff0000);
  opacity: 0.3;
}

.spectrogram-row {
  display: flex;
  height: 10px;
}

.spectrogram-pixel {
  flex: 1;
  background-color: #fff;
  opacity: 0;
}

.spectrogram-info {
  width: 200px;
  font-size: 14px;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.info-item span:first-child {
  color: #6b7280;
}

.info-item span:last-child {
  color: #111827;
  font-weight: 600;
}

.yolo-detection-card {
  margin-bottom: 20px;
}

.yolo-detection-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.detection-preview {
  flex: 1;
  min-height: 300px;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 300px;
  background-color: #e5e7eb;
  position: relative;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity="0.15"><rect x="0" height="50" width="50"/><rect x="50" y="50" height="50" width="50"/></svg>');
}

.detection-bbox {
  position: absolute;
  border: 2px solid;
  box-sizing: border-box;
}

.flame-bbox {
  border-color: #ef4444;
}

.smoke-bbox {
  border-color: #9ca3af;
}

.bbox-label {
  position: absolute;
  top: -20px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  white-space: nowrap;
}

.detection-stats {
  width: 200px;
  font-size: 14px;
}

.stat-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.stat-label {
  display: block;
  color: #6b7280;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #111827;
}

.flame-count {
  color: #ef4444;
}

.smoke-count {
  color: #9ca3af;
}

.charts-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.chart-card {
  flex: 1;
  min-width: 400px;
}

.chart-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 1px dashed #dcdfe6;
  color: #909399;
  font-size: 14px;
}

.data-stream-card {
  margin-top: 20px;
}

.data-stream-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f8f9fa;
  font-family: monospace;
  font-size: 12px;
}

.data-stream-item {
  margin: 5px 0;
  color: #303133;
}
</style>
