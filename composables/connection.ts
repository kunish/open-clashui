import { cloneDeep } from "lodash-es";
import {
  CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER,
  CONNECTIONS_TABLE_INITIAL_COLUMN_VISIBILITY,
} from "~/constants";
import type { Connection } from "~/typings";

export const useConnection = createSharedComposable(() => {
  const { request, wsUrl } = useRequest();
  const paused = ref(false);
  const webSocket = useWebSocket(`${wsUrl.value}/connections`, {
    autoReconnect: true,
  });

  const uploadTotal = computed(() => {
    const message: {
      uploadTotal: number;
    } | null = JSON.parse(webSocket.data.value);

    return message?.uploadTotal || 0;
  });

  const downloadTotal = computed(() => {
    const message: {
      downloadTotal: number;
    } | null = JSON.parse(webSocket.data.value);
    return message?.downloadTotal || 0;
  });

  const connections = computed<Connection[]>((prev) => {
    if (paused.value) return prev || [];

    const message: {
      downloadTotal: number;
      uploadTotal: number;
      memory: number;
      connections: Connection[];
    } | null = JSON.parse(webSocket.data.value);

    return (
      message?.connections.map((conn) => ({
        ...conn,
        downloadSpeed:
          conn.download - (prev?.find((c) => c.id === conn.id)?.download || 0),
        uploadSpeed:
          conn.upload - (prev?.find((c) => c.id === conn.id)?.upload || 0),
      })) || []
    );
  });

  const closeAll = async () => {
    await request.value.delete("connections").json();
  };
  const closeConnection = (id: string) =>
    request.value.delete(`connections/${id}`);

  const columnOrder = useLocalStorage(
    "open-clashui:connection-table/column-order",
    cloneDeep(CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER),
  );

  const columnVisibility = useLocalStorage(
    "open-clashui:connection-table/column-visibility",
    cloneDeep(CONNECTIONS_TABLE_INITIAL_COLUMN_VISIBILITY),
  );

  return {
    paused,
    webSocket,
    connections,
    closeAll,
    closeConnection,
    uploadTotal,
    downloadTotal,
    columnOrder,
    columnVisibility,
  };
});
