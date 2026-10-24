import axios from 'axios';

const getEnvVar = (key, defaultValue = '') => {
  try {
    return import.meta.env[key] || defaultValue;
  } catch (error) {
    console.warn(`无法读取环境变量 ${key}，使用默认值:`, defaultValue);
    return defaultValue;
  }
};

const aiApi = axios.create({
  baseURL: getEnvVar('VITE_AI_API_URL', 'https://api.siliconflow.cn'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getEnvVar('VITE_TRACK_FLOW_API_KEY')}`
  }
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockAiResponses = {
  checkConnection: {
    connected: true,
    data: {
      id: 'mock-connection-123',
      object: 'chat.completion',
      created: Date.now(),
      model: 'deepseek-r1',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'pong' }
      }]
    }
  },
  getResponseForMessage: (message) => {
    let mockResponse = "我是您的AI智慧家庭助手，这是一条模拟响应。在真实环境中，我会根据您的问题提供专业的家庭安全、能源管理和智能家居优化建议。";

    if (message.includes('安全') || message.includes('监控')) {
      mockResponse = "为了提高家庭安全性，我建议您：1) 在入口安装智能门锁和视频门铃；2) 设置门窗传感器，当检测到异常开启时及时报警；3) 考虑安装室内监控摄像头，但注意保护隐私区域。";
    } else if (message.includes('能源') || message.includes('省电')) {
      mockResponse = "关于能源管理，我有以下建议：1) 替换为LED节能灯泡，可节省约75%的照明用电；2) 安装智能温控系统，根据家庭成员活动自动调节温度；3) 使用智能插座，远程控制电器开关并监控用电情况。";
    } else if (message.includes('智能家居')) {
      mockResponse = "智能家居系统可以显著提升生活便利性。建议从核心设备开始：1) 智能音箱作为控制中心；2) 智能灯光系统；3) 智能窗帘和遮阳系统；4) 逐步扩展到厨房电器和安防设备。";
    }

    return {
      id: `mock-response-${Date.now()}`,
      object: 'chat.completion',
      created: Date.now(),
      model: 'deepseek-r1',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: mockResponse
        }
      }],
      usage: {
        prompt_tokens: message.length,
        completion_tokens: mockResponse.length,
        total_tokens: message.length + mockResponse.length
      }
    };
  }
};

export const checkAiConnection = async () => {
  const useMockApi = getEnvVar('VITE_USE_MOCK_API', 'true') === 'true';

  if (useMockApi) {
    console.log('使用模拟AI连接');
    await delay(500);
    return mockAiResponses.checkConnection;
  }

  try {
    console.log('使用真实AI连接，API URL:', import.meta.env.VITE_AI_API_URL);

    const testResponse = await aiApi.post('/v1/chat/completions', {
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 10
    });

    console.log('AI连接成功，响应数据:', testResponse.data);
    return { connected: true, data: testResponse.data };
  } catch (error) {
    console.error('AI连接失败：', error.response?.data || error.message);
    console.error('完整错误信息:', error);
    return { connected: false, error: error.message || '未知错误' };
  }
};

export const sendAiMessage = async (message) => {
  const useMockApi = getEnvVar('VITE_USE_MOCK_API', 'true') === 'true';

  if (useMockApi) {
    console.log('使用模拟AI消息响应');
    await delay(800);
    return mockAiResponses.getResponseForMessage(message);
  }

  try {
    console.log('使用真实AI消息响应');

    const response = await aiApi.post('/v1/chat/completions', {
      model: 'deepseek-r1',
      messages: [
        {
          role: "system",
          content: "你是一个专业的AI智慧家庭助手，需要为用户提供家庭安全、能源管理、智能家居优化、健康饮食和家庭生活等方面的专业建议。回答要友好、专业，语言简洁明了。"
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    return response.data;
  } catch (error) {
    console.error('AI消息发送失败：', error);
    throw error;
  }
};