<template>
  <div class="home-container">
    <el-header class="header">
      <div class="header-title">Wifi-Family 家庭安全检测</div>
      <span class="demo-label">演示原型 · 状态与告警为模拟数据</span>
    </el-header>

    <div class="main-content">
      <!-- 折叠侧栏：默认仅显示图标，悬停展开显示文字 -->
      <el-aside class="aside sidebar" :style="{ zIndex: 100 }" tabindex="0">
        <el-menu
          :default-active="route.path"
          class="main-menu"
          router
        >
          <el-menu-item index="/overview">
            <span class="menu-icon">🏠</span>
            <span class="menu-label">总览</span>
          </el-menu-item>
          <el-menu-item index="/connect">
            <span class="menu-icon">🔗</span>
            <span class="menu-label">设备连接</span>
          </el-menu-item>
          <el-menu-item index="/visualization">
            <span class="menu-icon">📈</span>
            <span class="menu-label">数据可视化</span>
          </el-menu-item>
          <el-menu-item index="/logs">
            <span class="menu-icon">📚</span>
            <span class="menu-label">系统日志</span>
          </el-menu-item>
          <el-menu-item index="/ai">
            <span class="menu-icon">🤖</span>
            <span class="menu-label">AI助手</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="content-area">
        <!-- 右侧由路由决定显示具体视图 -->
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuActive = ref(route.path)

// keep selected item in sync when route changes
watch(() => route.path, (p) => {
  menuActive.value = p
})

onMounted(() => {
  menuActive.value = route.path
})
</script>

<style scoped>
.demo-label { margin-left:auto; padding-left:16px; color:#b8cce0; font-size:12px; }

/* 整体布局：单屏整块，不滚动 */
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部 header */
.header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: var(--topbar-bg, #0f1724);
  color: #fff;
  flex: 0 0 64px;
}

/* header title polish */
.header-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

/* 主体：侧栏 + 内容 */
.main-content {
  display: flex;
  flex: 1;
  min-height: 0; /* 防止 el-main 溢出 */
}

/* 侧栏折叠行为：
   - 默认宽度 64px（仅图标）
   - 悬停或聚焦时过渡到 200px 并显示文字
*/
.aside.sidebar {
  width: 64px;
  transition: width 220ms ease, background-color 200ms;
  background: var(--sidebar-bg, #071029);
  color: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
  overflow: hidden;
  position: relative;
}

/* 悬停或键盘聚焦展开 */
.aside.sidebar:hover,
.aside.sidebar:focus-within {
  width: 200px;
}

/* 菜单高度铺满 */
.main-menu {
  height: 100%;
  border-right: none;
  background: transparent;
  color: #fff;
  padding-top: 12px;
}

/* 菜单项布局 */
.el-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 16px !important;
  transition: background 160ms;
}

/* 图标固定显示 */
.menu-icon {
  width: 28px;
  text-align: center;
  font-size: 18px;
}

/* 文字默认隐藏：通过容器宽度控制显示 */
.menu-label {
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 160ms, transform 160ms;
  color: #e6eef8;
  font-size: 14px;
}

/* 当侧栏展开时显示标签 */
.aside.sidebar:hover .menu-label,
.aside.sidebar:focus-within .menu-label {
  opacity: 1;
  transform: translateX(0);
}

/* 高亮当前项 */
.el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border-left: 3px solid rgba(255,255,255,0.06);
}

/* 右侧内容区 */
.content-area {
  color: #e2e8f0;
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: var(--content-bg, #0b1220);
}

/* 适配小屏：折叠侧栏时仍可操作 */
@media (max-width: 800px) {
  .aside.sidebar { position: absolute; z-index: 200; left: 0; top: 64px; height: calc(100% - 64px); }
  .aside.sidebar:hover, .aside.sidebar:focus-within { width:64px; }
  .aside.sidebar:hover .menu-label, .aside.sidebar:focus-within .menu-label { opacity:0; }
  .content-area { padding: 10px 10px 10px 74px; }
}
@media (max-width: 520px) {
  .header { padding: 8px 12px; align-items:flex-start; justify-content:center; flex-direction:column; }
  .header-title { font-size:16px; }
  .demo-label { margin:0; padding:0; font-size:11px; }
}
@media (prefers-reduced-motion: reduce) {
  .aside.sidebar, .menu-label { transition:none; }
}
</style>
