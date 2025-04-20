export const useTraffic = createSharedComposable(() => {
  const { wsUrl } = useRequest();
  const webSocket = useWebSocket(`${wsUrl.value}/traffic`, {
    autoConnect: true,
  });

  const traffics = ref<{ time: Date; download: number; upload: number }[]>([]);

  watch(webSocket.data, (traffic) => {
    const parsed = JSON.parse(traffic) as { down: number; up: number };

    traffics.value = [
      ...traffics.value,
      {
        time: new Date(),
        download: parsed.down,
        upload: parsed.up,
      },
    ].slice(-50);
  });

  return {
    webSocket,
    traffics,
  };
});
