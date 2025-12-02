<template>
  <div class="baseBeverage" :style="{ backgroundColor: props.color }"></div>
</template>

<script setup lang="ts">
  type Props = { color: string };
  const props = defineProps<Props>();
</script>

<style scoped>
.baseBeverage {
  position: relative;
  width: 100%;
  height: 100%;
  bottom: 0;
  animation: pour-tea 2s;
  z-index: 300; 
}
</style>
