import { ref, reactive, onMounted, onUnmounted } from 'vue';

const csiDataStream = reactive(Array(20).fill(0).map(() => Array(50).fill(0)));
const currentTimeRange = ref('最近 10 秒');

// chart container refs used by DataVisualization.vue
const fireChartRef = ref(null);
const peopleChartRef = ref(null);

const detectedFlames = ref([]);
const detectedSmokes = ref([]);

const getSpectrogramOpacity = (rowIndex, colIndex) => {
  return csiDataStream[rowIndex][colIndex];
};

let csiInterval, yoloInterval;

const simulateCsiDataUpdates = () => {
  csiInterval = setInterval(() => {
    for (let i = 0; i < csiDataStream.length; i++) {
      for (let j = 0; j < csiDataStream[i].length; j++) {
        csiDataStream[i][j] = Math.max(0, csiDataStream[i][j] - 0.05);
      }
    }

    const randomRow = Math.floor(Math.random() * 20);
    const randomCol = Math.floor(Math.random() * 50);
    csiDataStream[randomRow][randomCol] = Math.random() * 0.8 + 0.2;

  }, 200);
};

const simulateYoloDetectionUpdates = () => {
  yoloInterval = setInterval(() => {
    if (Math.random() > 0.5) {
      if (detectedFlames.value.length < 3) {
        detectedFlames.value.push({
          id: `flame-${Date.now()}`,
          x: Math.random() * 200 + 50,
          y: Math.random() * 100 + 20,
          width: Math.random() * 30 + 20,
          height: Math.random() * 40 + 20,
          confidence: (Math.random() * 30 + 70).toFixed(1)
        });
      }
    } else {
      if (detectedFlames.value.length > 0) {
        detectedFlames.value.splice(Math.floor(Math.random() * detectedFlames.value.length), 1);
      }
    }

    if (Math.random() > 0.7) {
      if (detectedSmokes.value.length < 2) {
        detectedSmokes.value.push({
          id: `smoke-${Date.now()}`,
          x: Math.random() * 150,
          y: Math.random() * 80,
          width: Math.random() * 50 + 30,
          height: Math.random() * 50 + 30,
          confidence: (Math.random() * 40 + 60).toFixed(1)
        });
      }
    } else {
      if (detectedSmokes.value.length > 0) {
        detectedSmokes.value.splice(Math.floor(Math.random() * detectedSmokes.value.length), 1);
      }
    }
  }, 1500);
};

export function useVisualization() {
  onMounted(() => {
    simulateCsiDataUpdates();
    simulateYoloDetectionUpdates();
  });

  onUnmounted(() => {
    clearInterval(csiInterval);
    clearInterval(yoloInterval);
  });

  return {
    csiDataStream,
    currentTimeRange,
    detectedFlames,
    detectedSmokes,
    getSpectrogramOpacity
  };
}

// named exports for direct imports from components
export { csiDataStream, currentTimeRange, detectedFlames, detectedSmokes, getSpectrogramOpacity, fireChartRef, peopleChartRef };
