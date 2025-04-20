<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash-es";
import Draggable from "vuedraggable";
import type { CONNECTIONS_TABLE_ACCESSOR_KEY } from "~/constants";
import {
  CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER,
  CONNECTIONS_TABLE_INITIAL_COLUMN_VISIBILITY,
} from "~/constants";

const { columnOrder, columnVisibility } = useConnection();

const isClean = computed(() => {
  return (
    isEqual(columnOrder.value, CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER) &&
    isEqual(columnVisibility.value, CONNECTIONS_TABLE_INITIAL_COLUMN_VISIBILITY)
  );
});

const reset = () => {
  columnOrder.value = cloneDeep(CONNECTIONS_TABLE_INITIAL_COLUMN_ORDER);
  columnVisibility.value = cloneDeep(
    CONNECTIONS_TABLE_INITIAL_COLUMN_VISIBILITY,
  );
};
</script>

<template>
  <UModal :title="$t('connectionSettings')">
    <slot />

    <template #body>
      <div>
        <Draggable
          v-model="columnOrder"
          group="connectionsTable"
          :item-key="(item: CONNECTIONS_TABLE_ACCESSOR_KEY) => item"
        >
          <template
            #item="{ element }: { element: CONNECTIONS_TABLE_ACCESSOR_KEY }"
          >
            <div
              class="bg-default flex cursor-grab items-center gap-2 rounded-md p-1"
            >
              <USwitch v-model="columnVisibility[element]" />

              {{ $t(element) }}
            </div>
          </template>
        </Draggable>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end">
        <UButton :disabled="isClean" @click="reset">{{ $t("reset") }}</UButton>
      </div>
    </template>
  </UModal>
</template>
