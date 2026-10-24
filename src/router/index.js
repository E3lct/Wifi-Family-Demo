import { createRouter, createWebHistory } from 'vue-router'
import HomeControl from '../views/HomeControl.vue'
import SystemOverview from '../views/SystemOverview.vue'
import DataVisualization from '../views/DataVisualization.vue'
import SystemLogs from '../views/SystemLogs.vue'
import ConnectDevice from '../views/ConnectDevice.vue'
import AIAssistant from '../views/AIAssistant.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeControl,
      children: [
        { path: '', redirect: 'overview' },
        { path: 'overview', component: SystemOverview },
        { path: 'visualization', component: DataVisualization },
        { path: 'logs', component: SystemLogs },
        { path: 'connect', component: ConnectDevice },
        { path: 'ai', component: AIAssistant }
      ]
    }
  ]
})

export default router