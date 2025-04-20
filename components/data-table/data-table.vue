<script setup lang="ts" generic="TData extends RowData">
import { DataTableHeader } from "#components";
import type { TableColumn } from "@nuxt/ui";
import {
  getPaginationRowModel,
  type ColumnOrderState,
  type RowData,
  type VisibilityState,
} from "@tanstack/table-core";

const { loading, data, columns, columnOrder } = defineProps<{
  loading?: boolean;
  columns: TableColumn<TData>[];
  columnOrder?: ColumnOrderState;
  columnVisibility?: VisibilityState;
  data: TData[];
}>();

const internalColumns = computed(() =>
  columns.map((props) => {
    return {
      ...props,
      header: props.header
        ? ({ table, column, header }) =>
            h(DataTableHeader<TData>, { column }, () =>
              typeof props.header === "function"
                ? props.header({
                    header,
                    column,
                    table,
                  })
                : props.header,
            )
        : null,
    } as TableColumn<TData>;
  }),
);

const table = useTemplateRef("table");
const globalFilter = ref("");
const defaultPageSize = 50;
const pagination = ref({
  pageIndex: 0,
  pageSize: defaultPageSize,
});

const [DefinePagination, Pagination] = createReusableTemplate();
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <DefinePagination>
      <div class="flex items-center gap-2">
        <UPagination
          size="sm"
          :page="pagination.pageIndex + 1"
          :items-per-page="pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />

        <USelect
          v-model="pagination.pageSize"
          class="w-36"
          :items="
            [20, 50, 100, 200].map((value) => ({
              label:
                value === defaultPageSize
                  ? `${value} (${$t('default')})`
                  : String(value),
              value,
            }))
          "
        />
      </div>
    </DefinePagination>

    <div class="flex flex-wrap items-center gap-2">
      <UButtonGroup class="flex flex-1 shrink-0 [&>*]:shrink-0">
        <UInput
          v-model="globalFilter"
          class="flex-1"
          type="search"
          :placeholder="$t('search')"
        />

        <slot name="search-trailing" />
      </UButtonGroup>
    </div>

    <UTable
      ref="table"
      v-model:global-filter="globalFilter"
      v-model:pagination="pagination"
      class="flex-1"
      sticky
      :column-order
      :column-visibility
      :ui="{ thead: 'whitespace-nowrap', th: 'p-2', td: 'p-2 text-xs' }"
      :loading
      :data
      :columns="internalColumns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
    />

    <div class="flex items-center justify-center">
      <Pagination />
    </div>
  </div>
</template>
