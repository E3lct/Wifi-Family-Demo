<template>
  <div class="ai-page">
    <h2>家庭助手</h2>
    <p class="mode-note">{{ isDemoMode ? '演示模式 · 固定示例回复，无需密钥' : '代理模式 · 需自行部署模型服务' }}</p>
    <el-card class="ai-card">
      <div class="chat-window" ref="chatMessages" role="log" aria-live="polite" aria-label="聊天记录">
        <div v-for="(m, idx) in chatMessagesData" :key="idx" :class="['chat-row', m.isUser ? 'user' : 'bot']">
          <div v-if="m.isUser" class="chat-bubble">{{ m.text }}</div>
          <div v-else class="chat-bubble" v-html="m.text"></div>
          <div class="chat-time">{{ m.time }}</div>
        </div>
      </div>
      <div class="quick-questions">
        <el-button v-for="q in suggestedQuestions" :key="q" @click="selectQuestion(q)" :disabled="isLoading" size="small">{{ q }}</el-button>
      </div>
      <div class="chat-input">
        <el-input v-model="userInput" aria-label="向家庭助手提问" placeholder="输入家庭安全问题…" :disabled="isLoading" @keydown.enter="handleEnter"></el-input>
        <el-button type="primary" @click="sendMessage" :loading="isLoading" :disabled="!userInput.trim()">发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useAiChat } from '../composables/useAiChat'

const {
  isDemoMode,
  chatMessages,
  chatMessagesData,
  userInput,
  isLoading,
  suggestedQuestions,
  sendMessage,
  selectQuestion
} = useAiChat()

function handleEnter(event) {
  if (event.isComposing) return
  event.preventDefault()
  sendMessage()
}
</script>

<style scoped>
.mode-note { color: #94a3b8; line-height: 1.6; }
.quick-questions { display:flex; flex-wrap:wrap; gap:8px; }
.quick-questions .el-button { margin-left:0; }
.chat-bubble { color:#e2e8f0; overflow-wrap:anywhere; }
.chat-bubble :deep(pre) { overflow-x:auto; max-width:100%; }
.ai-card { padding: 12px; max-width: 900px; background:#152236; border-color:#29415b; }
@media (max-width:520px) {
  .ai-card { padding:0; }
  .ai-card :deep(.el-card__body) { padding:12px; }
  .chat-window { padding:8px; max-height:340px; }
  .ai-page .chat-bubble { max-width:100%; box-sizing:border-box; font-size:14px; line-height:1.65; }
}
.chat-window { max-height: 400px; overflow:auto; padding:8px; background:#0b1220; }
.chat-row { margin:8px 0; display:flex; flex-direction:column; }
.chat-row.user { align-items:flex-end; }
.chat-bubble { background: rgba(255,255,255,0.04); padding:8px 12px; border-radius:8px; max-width:70%; }
.chat-row.user .chat-bubble { background: linear-gradient(90deg,#0ea5e9,#8fd3ff); color:#042; }
.chat-time { font-size:12px; color:#7fa4c9; margin-top:4px; }
.chat-input { display:flex; gap:8px; margin-top:10px; }
.quick-questions { margin-top:8px; }
</style>
