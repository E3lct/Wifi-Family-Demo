<template>
  <div class="ai-assistant-container">
    <p class="mode-note">{{ isDemoMode ? '演示模式：固定示例回复' : '代理模式：需自行部署服务' }}</p>
    <div class="chat-window" ref="chatMessages">
      <div v-for="(msg, index) in chatMessagesData" :key="index" class="message-wrapper" :class="{ user: msg.isUser }">
        <div class="message-content">
          <div class="avatar" :class="{ 'user-avatar': msg.isUser, 'ai-avatar': !msg.isUser }"></div>
          <div class="text-bubble">
            <div v-if="msg.isUser">{{ msg.text }}</div>
            <div v-else v-html="msg.text"></div>
            <div class="timestamp">{{ msg.time }}</div>
          </div>
        </div>
      </div>
      <div v-if="isLoading || isStreaming" class="message-wrapper">
        <div class="message-content">
          <div class="avatar ai-avatar"></div>
          <div class="text-bubble">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="suggestions">
      <button v-for="q in suggestedQuestions" :key="q" @click="quickSendQuestion(q)">
        {{ q }}
      </button>
    </div>

    <div class="input-area">
      <textarea
        v-model="userInput"
        aria-label="向家庭助手提问"
        placeholder="输入您的问题…"
        @keydown.enter="handleEnter"
        :disabled="isLoading"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
        <span v-if="!isLoading">发送</span>
        <span v-else>发送中...</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAiChat } from '@/composables/useAiChat.js';
import { onMounted, onActivated } from 'vue';

const {
  isDemoMode,
  userInput,
  chatMessagesData,
  isLoading,
  isStreaming,
  sendMessage,
  suggestedQuestions,
  chatMessages,
  selectQuestion,
  scrollToBottom
} = useAiChat();

function handleEnter(event) {
  if (event.isComposing) return;
  event.preventDefault();
  sendMessage();
}

const quickSendQuestion = (question) => {
  selectQuestion(question);
};

onMounted(() => {
  scrollToBottom();
});

onActivated(() => {
  scrollToBottom();
});
</script>

<style scoped>
.ai-assistant-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-window {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-wrapper {
  display: flex;
  max-width: 80%;
  align-self: flex-start;
}

.message-wrapper.user {
  align-self: flex-end;
}

.message-content {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.message-wrapper.user .message-content {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.user-avatar {
  background-color: #4a90e2;
}

.ai-avatar {
  background-color: #7f8c8d;
}

.text-bubble {
  background-color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.message-wrapper.user .text-bubble {
  background-color: #4a90e2;
  color: white;
}

.text-bubble p {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.timestamp {
  font-size: 0.75rem;
  color: #999;
  margin-top: 8px;
  text-align: right;
}

.message-wrapper.user .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.suggestions {
  padding: 10px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.suggestions button {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  padding: 8px 12px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.suggestions button:hover {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #c6e2ff;
}

.input-area {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
  flex-shrink: 0;
}

.input-area textarea {
  flex-grow: 1;
  border: 1px solid #dcdfe6;
  border-radius: 18px;
  padding: 10px 15px;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  max-height: 100px;
  transition: border-color 0.3s ease;
}

.input-area textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.input-area button {
  margin-left: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 18px;
  padding: 0 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.input-area button:disabled {
  background-color: #a0c7e8;
  cursor: not-allowed;
}

.input-area button:hover:not(:disabled) {
  background-color: #357abd;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background-color: #999;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>