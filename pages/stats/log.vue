<script setup lang="ts">
import { UBadge } from "#components";
import type { BadgeProps, TableColumn } from "@nuxt/ui";
import type { LogWithSeq } from "~/typings";

const { t } = useI18n();

useHead({
  title: formatPageTitle(t("log")),
});

const { webSocket, paused, logs, clearAll } = useLog();

const columns = computed<TableColumn<LogWithSeq>[]>(() => [
  {
    header: () => t("sequence"),
    accessorKey: "seq",
    accessorFn: (original) => original.seq,
  },
  {
    header: () => t("type"),
    accessorKey: "type",
    accessorFn: (original) => original.type,
    cell: ({ row }) => {
      const colorMap: Record<string, BadgeProps["color"]> = {
        info: "primary",
        error: "error",
        warn: "warning",
      };

      return h(
        UBadge,
        {
          size: "xs",
          color: colorMap[row.original.type],
        },
        () => row.original.type,
      );
    },
  },
  {
    header: () => t("payload"),
    enableSorting: false,
    accessorKey: "payload",
    accessorFn: (original) => original.payload,
  },
]);
</script>

<template>
  <div class="h-full">
    <DataTable
      :loading="webSocket.status.value === 'CONNECTING'"
      :data="logs"
      :columns
    >
      <template #search-trailing>
        <UButton
          :icon="paused ? 'lucide:play' : 'lucide:pause'"
          :color="paused ? 'primary' : 'secondary'"
          @click="paused = !paused"
        />

        <UButton icon="lucide:x" color="error" @click="clearAll" />
      </template>
    </DataTable>
  </div>
</template>
