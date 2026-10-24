import { ref, watch, nextTick, onMounted, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { readChatStream } from '../utils/chatStream.js';
import { useDetection } from './useDetection';

const aiSuggestion = ref('');
const chatMessagesData = ref([
  {
    text: '您好！我是您的AI智慧家庭助手，随时为您提供家庭安全、能源管理和智能家居优化等方面的专业建议。',
    isUser: false,
    time: new Date().toLocaleTimeString()
  }
]);
const userInput = ref('');
const isLoading = ref(false);
const isStreaming = ref(false);
const chatMessages = ref(null);

export function useAiChat() {
  const scrollToBottom = async () => {
    await nextTick();
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  };

  const { fireStatus, intrusionStatus, peopleRecognitionStatus } = useDetection();

  const systemSuggestion = computed(() => {
    if (fireStatus.isAlarmActive) {
      return '检测到火灾风险，请立即采取行动！建议立即撤离并联系紧急服务。';
    }
    if (intrusionStatus.isAlarmActive) {
      return '检测到入侵行为，系统已发出警报！建议立即核实情况并联系安保人员。';
    }
    if (peopleRecognitionStatus.isAlarmActive) {
      return '检测到可疑人员活动，请保持警惕。建议通过监控查看具体情况。';
    }
    return '当前一切正常，请保持门窗关闭，确保家庭安全。';
  });

  const isDemoMode = import.meta.env.VITE_CHAT_MODE !== 'proxy';
  const renderMessage = (text) => DOMPurify.sanitize(marked.parse(text));

  const suggestedQuestions = [
    '如何优化家庭能源消耗？',
    '家庭安全系统的最佳配置方案？',
    '智能设备如何节省用电？',
    '火灾预防的关键措施有哪些？',
    '如何提高网络安全防护等级？',
    '推荐几款适合家庭的智能设备'
  ];

  const getAIResponse = async (prompt, onStream) => {
    isStreaming.value = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      if (isDemoMode) {
        const answer = '**演示回复（固定示例，未调用大模型）**\n\n建议定期检查烟雾报警器、确认门窗状态，并核查设备离线情况。页面告警是模拟数据，不能作为真实安全判断。\n\n如需模型生成的回答，请由维护者接入服务端代理。';
        onStream(renderMessage(answer));
        return answer;
      }
      const endpoint = import.meta.env.VITE_CHAT_PROXY_PATH || '/api/chat';
      if (!endpoint.startsWith('/') || endpoint.startsWith('//')) {
        throw new Error('请配置同源代理路径，例如 /api/chat');
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], stream: true }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`服务请求失败（HTTP ${response.status}）`);
      if (!response.headers.get('content-type')?.includes('text/event-stream')) {
        throw new Error('代理需要返回 text/event-stream 数据流');
      }
      return await readChatStream(response.body, (text) => onStream(renderMessage(text)));
    } finally {
      clearTimeout(timeout);
      isStreaming.value = false;
    }
  };

  const sendMessage = async (messageText) => {
    const currentInput = (typeof messageText === 'string' ? messageText : userInput.value).trim();
    if (!currentInput || isLoading.value) return;

    chatMessagesData.value.push({
      text: currentInput,
      isUser: true,
      time: new Date().toLocaleTimeString()
    });

    userInput.value = '';

    isLoading.value = true;
    let aiResponse = {
      text: '',
      isUser: false,
      time: new Date().toLocaleTimeString()
    };
    chatMessagesData.value.push(aiResponse);
    const aiMessageIndex = chatMessagesData.value.length - 1;

    try {
      const fullResponse = await getAIResponse(currentInput, (streamedText) => {
        chatMessagesData.value[aiMessageIndex].text = streamedText;
      });
      aiSuggestion.value = fullResponse;
    } catch (error) {
      console.error('发送消息时出错:', error);
      chatMessagesData.value[aiMessageIndex].text = renderMessage(error.name === 'AbortError'
        ? '请求超时，请重试。'
        : `回复失败：${error.message}。可切回演示模式体验。`);
    } finally {
      isLoading.value = false;
    }
  };

  const quickSendQuestion = (question) => {
    userInput.value = question;
    sendMessage();
  };

  const initAISuggestion = () => {
    setTimeout(() => {
      aiSuggestion.value = '当前一切正常，请保持门窗关闭，确保家庭安全。';
    }, 3000);
  };

  const selectQuestion = (question) => {
    userInput.value = question;
    sendMessage(question);
  };

  onMounted(() => {
    initAISuggestion();
    scrollToBottom();
  });

  watch(
    () => chatMessagesData.value.length,
    () => {
      scrollToBottom();
    },
    { flush: 'post' }
  );

  watch(chatMessagesData, () => {
    scrollToBottom();
  }, { deep: true });

  return {
    aiSuggestion,
    isDemoMode,
    systemSuggestion,
    chatMessagesData,
    userInput,
    isLoading,
    isStreaming,
    chatMessages,
    suggestedQuestions,
    sendMessage,
    quickSendQuestion,
    initAISuggestion,
    selectQuestion,
    scrollToBottom,
    onMounted,
    watch
  };
}

export { aiSuggestion };
