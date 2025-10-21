<template>
  <GameBox :index="index" v-bind="level" @on-success="onSuccess" :key="index" />
</template>

<script lang="ts" setup>
import GameBox from '@/components/GameBox.vue';
import { Animals, LEVEL_LIST } from '@/data/const';
import type { Level } from '@/data/types';
import { DialogPlugin } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';

const index = ref(
  localStorage.getItem('animal-tower-level')
    ? Number(localStorage.getItem('animal-tower-level'))
    : 0,
);
watch(index, (newVal) => {
  localStorage.setItem('animal-tower-level', String(newVal));
});

const level = computed<Level<Animals>>(() => LEVEL_LIST[index.value]!);

const onSuccess = () => {
  const dialogInstance = DialogPlugin.confirm({
    theme: 'success',
    header: '恭喜过关！',
    body: '是否进入下一关？',
    confirmBtn: '下一关',
    cancelBtn: null,
    onConfirm: () => {
      if (index.value < LEVEL_LIST.length - 1) {
        index.value += 1;
      }
      dialogInstance.destroy();
    },
  });
};
</script>
