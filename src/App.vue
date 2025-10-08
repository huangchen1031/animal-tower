<script setup lang="ts">
import GameBox from '@/components/GameBox.vue';
import { LEVEL_LIST } from '@/data/const';

const index = 0;
const level = LEVEL_LIST[index];
</script>

<template>
  <game-box :index="index" v-bind="level" />
</template>

<style>
body {
  margin: 0 !important;
}
</style>
