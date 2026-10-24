import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

// 默认缓冲区长度
const DEFAULT_BUFFER_LEN = 128;

// 固定后端地址为局域网部署的 web_server（修改为你的机器 IP）
const SOCKET_SERVER_URL = import.meta.env.VITE_DEVICE_SERVER_URL || '';
export const deviceIntegrationEnabled = Boolean(SOCKET_SERVER_URL);

export function useSocket(bufferLen = DEFAULT_BUFFER_LEN) {
  const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,
    reconnection: true,
    // allow engine to choose transport (polling -> websocket) to avoid immediate websocket rejection
    // transports: ['websocket'],
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000
  });

  const isConnected = ref(false);
  // sliding buffer，存放最近的 CSI 振幅数组（每次来自后端是一个数组）
  const csiData = ref([]);

  // 内部监听集合，允许组件注册回调
  const listeners = new Set();

  function pushData(arr) {
    if (!Array.isArray(arr)) return;
    // 保持为一维数值数组
    const numeric = arr.map(v => Number(v) || 0);
    csiData.value = numeric; // 保留最新一帧（组件可自己做历史视图）

    // 调用订阅者回调（传递拷贝）
    const copy = numeric.slice();
    listeners.forEach(fn => { try { fn(copy); } catch (e) { console.error('listener error', e); } });
  }

  socket.on('connect', () => {
    console.info('socket connected', SOCKET_SERVER_URL);
    isConnected.value = true;
  });

  socket.on('disconnect', () => {
    console.warn('socket disconnected');
    isConnected.value = false;
  });

  socket.on('connect_error', (err) => {
    console.error('socket connect_error', err);
  });

  socket.on('csi_data', (data) => {
    try {
      if (data && data.amplitude) {
        pushData(data.amplitude);
      } else if (Array.isArray(data)) {
        pushData(data);
      }
    } catch (e) { console.error('csi_data handler error', e); }
  });

  onMounted(() => {
    if (deviceIntegrationEnabled && !socket.connected) socket.connect();
  });

  onUnmounted(() => {
    try { socket.disconnect(); } catch (e) {}
  });

  // 订阅/退订回调（用于图表等）
  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  return { socket, isConnected, csiData, subscribe, serverUrl: SOCKET_SERVER_URL };
}
