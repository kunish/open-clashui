export const useMemoryUsage = createSharedComposable(() => {
  const { wsUrl } = useRequest();
  const webSocket = useWebSocket(`${wsUrl.value}/memory`, {
    autoConnect: true,
  });

  const memoryUsage = computed<{ inuse: number }>(() => {
    const data = webSocket.data.value;

    if (!data) return { inuse: 0 };

    return JSON.parse(data) as { inuse: number };
  });

  return {
    webSocket,
    memoryUsage,
  };
});
