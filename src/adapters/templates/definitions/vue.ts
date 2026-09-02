// vue.ts

export function createVueTemplate(fileName: string): string {
  return `<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const title = ref('${fileName} Component');
</script>

<style scoped>
/* Component styles */
</style>
`;
}
