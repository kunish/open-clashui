<script setup lang="ts">
import { UBadge, UButton } from "#components";
import type { TableColumn } from "@nuxt/ui";
import byteSize from "byte-size";
import dayjs from "dayjs";
import { useConnection } from "~/composables/connection";
import { CONNECTIONS_TABLE_ACCESSOR_KEY } from "~/constants";
import type { Connection } from "~/typings";

const { t } = useI18n();

useHead({
  title: formatPageTitle(t("connection")),
});

const {
  paused,
  webSocket,
  connections,
  closeAll,
  closeConnection,
  columnOrder,
  columnVisibility,
} = useConnection();

const columns = computed<TableColumn<Connection>[]>(() => [
  {
    header: () => t("close"),
    enableGrouping: false,
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Close,
    cell: ({ row }) =>
      h(UButton, {
        size: "xs",
        icon: "lucide:x",
        variant: "soft",
        color: "error",
        loadingAuto: true,
        onClick: async () => {
          await closeConnection(row.original.id);
        },
      }),
  },
  {
    header: () => t("ID"),
    enableGrouping: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.ID,
    accessorFn: (original) => original.id,
  },
  {
    header: () => t("type"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Type,
    accessorFn: (original) =>
      `${original.metadata.type}(${original.metadata.network})`,
  },
  {
    header: () => t("process"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Process,
    accessorFn: (original) =>
      original.metadata.process ||
      original.metadata.processPath.replace(/^.*[/\\](.*)$/, "$1") ||
      "-",
  },
  {
    header: () => t("host"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Host,
    accessorFn: (original) =>
      `${
        original.metadata.host
          ? original.metadata.host
          : original.metadata.destinationIP
      }:${original.metadata.destinationPort}`,
  },
  {
    header: () => t("sniffHost"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.SniffHost,
    accessorFn: (original) => original.metadata.sniffHost || "-",
  },
  {
    header: () => t("rule"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Rule,
    accessorFn: (original) =>
      !original.rulePayload
        ? original.rule || "-"
        : `${original.rule} :: ${original.rulePayload}`,
    cell: ({ column, row }) =>
      h(UBadge, { size: "xs" }, () => row.renderValue(column.id)),
  },
  {
    header: () => t("chains"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Chains,
    accessorFn: (original) => original.chains.slice().reverse().join(" :: "),
    cell: ({ column, row }) =>
      h(UBadge, { size: "xs" }, () => row.renderValue(column.id)),
  },
  {
    header: () => t("connectTime"),
    enableGrouping: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.ConnectTime,
    accessorFn: (original) => dayjs(original.start).fromNow(),
    sortingFn: (prev, next) =>
      dayjs(prev.original.start).valueOf() -
      dayjs(next.original.start).valueOf(),
  },
  {
    header: () => t("dlSpeed"),
    enableGrouping: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.DlSpeed,
    accessorFn: (original) => `${byteSize(original.downloadSpeed)}/s`,
    sortingFn: (prev, next) =>
      prev.original.downloadSpeed - next.original.downloadSpeed,
  },
  {
    header: () => t("ulSpeed"),
    enableGrouping: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.UlSpeed,
    accessorFn: (original) => `${byteSize(original.uploadSpeed)}/s`,
    sortingFn: (prev, next) =>
      prev.original.uploadSpeed - next.original.uploadSpeed,
  },
  {
    header: () => t("dl"),
    enableGrouping: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Download,
    accessorFn: (original) => byteSize(original.download),
    sortingFn: (prev, next) => prev.original.download - next.original.download,
  },
  {
    header: () => t("ul"),
    enableGrouping: false,
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Upload,
    accessorFn: (original) => byteSize(original.upload),
    sortingFn: (prev, next) => prev.original.upload - next.original.upload,
  },
  {
    header: t("sourceIP"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.SourceIP,
    accessorFn: (original) => {
      const sourceIP = original.metadata.sourceIP || t("inner");
      return sourceIP;
    },
  },
  {
    header: () => t("sourcePort"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.SourcePort,
    accessorFn: (original) => {
      const sourcePort = original.metadata.sourcePort;
      return sourcePort === "0" ? "-" : sourcePort;
    },
  },
  {
    header: () => t("destination"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.Destination,
    accessorFn: (original) =>
      original.metadata.remoteDestination ||
      original.metadata.destinationIP ||
      original.metadata.host,
  },
  {
    header: () => t("inboundUser"),
    accessorKey: CONNECTIONS_TABLE_ACCESSOR_KEY.InboundUser,
    accessorFn: (original) => {
      const inboundUser =
        original.metadata.inboundUser ||
        original.metadata.inboundName ||
        original.metadata.inboundPort;

      return inboundUser === "0" ? "-" : inboundUser;
    },
  },
]);
</script>

<template>
  <DataTable
    :loading="webSocket.status.value === 'CONNECTING'"
    :data="connections"
    :columns
    :column-order
    :column-visibility
  >
    <template #search-trailing>
      <UButton
        :icon="paused ? 'lucide:play' : 'lucide:pause'"
        :color="paused ? 'primary' : 'secondary'"
        @click="paused = !paused"
      />

      <UButton icon="lucide:x" color="error" loading-auto @click="closeAll" />

      <ConnectionSettingsModel>
        <UButton icon="lucide:settings" />
      </ConnectionSettingsModel>
    </template>
  </DataTable>
</template>
