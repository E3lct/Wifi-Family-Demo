import { ref, reactive, onMounted } from 'vue';
import { addSystemLog } from './useLogs';

const intrusionDetectionEnabled = ref(false);

const fireStatus = reactive({
  status: '正常',
  value: '无烟雾',
  danger: false,
  alert: false,
  isAlarmActive: false,
  class: 'status-normal'
});

const intrusionStatus = reactive({
  status: '安全',
  value: '环境正常',
  danger: false,
  isAlarmActive: false
});

const peopleRecognitionStatus = reactive({
  status: '正常',
  peopleCount: 1,
  activityStatus: '正常活动',
  danger: false,
  alert: false,
  isAlarmActive: false
});

const handleIntrusionDetectionChange = (value) => {
  intrusionDetectionEnabled.value = value;
  const logMessage = `入侵检测模式已${value ? '开启' : '关闭'}`;
  addSystemLog(logMessage, 'system');
  if (value) {
    Object.assign(peopleRecognitionStatus, {
      status: '正常',
      peopleCount: 0,
      activityStatus: '无',
      danger: false,
      alert: false,
      isAlarmActive: false
    });
    addSystemLog('人物识别功能已暂停，入侵检测优先。', 'system');
  } else {
    addSystemLog('人物识别功能已恢复。', 'system');
  }
};

const cancelAlarm = (type, isFalseAlarm = false) => {
  const logPrefix = isFalseAlarm ? '确认为误报，已取消' : '用户确认，已取消';

  if (type === 'fire' && fireStatus.isAlarmActive) {
    fireStatus.isAlarmActive = false;
    fireStatus.danger = false;
    fireStatus.alert = false;
    fireStatus.status = '正常';
    fireStatus.value = '无烟雾';
    fireStatus.class = 'status-normal';
    addSystemLog(`${logPrefix}火灾警报。`, 'system');
  } else if (type === 'intrusion' && intrusionStatus.isAlarmActive) {
    intrusionStatus.isAlarmActive = false;
    intrusionStatus.danger = false;
    intrusionStatus.status = '安全';
    intrusionStatus.value = '环境正常';
    addSystemLog(`${logPrefix}入侵警报。`, 'system');
  } else if (type === 'people' && peopleRecognitionStatus.isAlarmActive) {
    peopleRecognitionStatus.isAlarmActive = false;
    peopleRecognitionStatus.danger = false;
    peopleRecognitionStatus.status = '正常';
    addSystemLog(`${logPrefix}可疑人员警报。`, 'system');
  }
};

const simulateDetectionUpdates = () => {
  setInterval(() => {
    if (Math.random() < 0.05 && !fireStatus.isAlarmActive) {
      fireStatus.status = '危险';
      fireStatus.value = '检测到烟雾';
      fireStatus.danger = true;
      fireStatus.alert = false;
      fireStatus.isAlarmActive = true;
      fireStatus.class = 'status-danger';
      addSystemLog('检测到火灾风险，已触发警报！', 'fire');
    }
  }, 5000);

  setInterval(() => {
    if (intrusionDetectionEnabled.value && Math.random() < 0.1 && !intrusionStatus.isAlarmActive) {
      intrusionStatus.status = '危险';
      intrusionStatus.value = '检测到入侵';
      intrusionStatus.danger = true;
      intrusionStatus.isAlarmActive = true;
      addSystemLog('检测到入侵行为，已触发警报！', 'intrusion');
    }
  }, 7000);

  setInterval(() => {
    if (!intrusionDetectionEnabled.value && Math.random() < 0.15 && !peopleRecognitionStatus.isAlarmActive) {
      peopleRecognitionStatus.status = '可疑';
      peopleRecognitionStatus.danger = true;
      peopleRecognitionStatus.isAlarmActive = true;
      peopleRecognitionStatus.activityStatus = '异常徘徊';
      addSystemLog('检测到可疑人员，已触发警报！', 'people');
    }
  }, 8000);
};

export function useDetection() {
  onMounted(() => {
    simulateDetectionUpdates();
  });

  return {
    intrusionDetectionEnabled,
    fireStatus,
    intrusionStatus,
    peopleRecognitionStatus,
    handleIntrusionDetectionChange,
    cancelAlarm
  };
}

export { intrusionDetectionEnabled, fireStatus, intrusionStatus, peopleRecognitionStatus, handleIntrusionDetectionChange, cancelAlarm };
