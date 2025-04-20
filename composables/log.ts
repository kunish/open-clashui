import type { LogWithSeq } from "~/typings";

export const useLog = createSharedComposable(() => {
  const { wsUrl } = useRequest();
  const webSocket = useWebSocket(`${wsUrl.value}/logs`, {
    autoReconnect: true,
  });

  const paused = ref(false);

  const seq = ref(0);
  const logs = ref<LogWithSeq[]>([]);

  const clearAll = () => {
    seq.value = 0;
    logs.value = [];
  };

  watch(webSocket.data, (log) => {
    if (paused.value) {
      return log;
    }

    logs.value = [{ seq: seq.value, ...JSON.parse(log) }, ...logs.value].slice(
      0,
      1000,
    );

    seq.value++;
  });

  return {
    webSocket,
    paused,
    logs,
    clearAll,
  };
});
