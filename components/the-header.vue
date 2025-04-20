<template>
  <header class="border-default z-50 border-b backdrop-blur">
    <UContainer class="flex h-16 items-center justify-between gap-4">
      <div class="w-1/2">
        <slot name="leading" />
      </div>

      <slot />

      <div class="flex w-1/2 items-center justify-end gap-2">
        <slot name="trailing" />
      </div>
    </UContainer>
  </header>
</template>
