<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { BASE, getCellLeftTop, getRotatedShape, getShapeWidthHeight } from '@/utils';
import { useDraggable, useKeyDown } from './hooks';
import type { AnimalShape } from '@/data/types';

// 单元格基础大小
const cssSize = ref(BASE + 'px');

// 属性和事件
const { name, shape, size, droped } = defineProps<AnimalShape & { droped?: string[] }>();
const emit = defineEmits(['onDrag']);

// 放置区域
const dragArea = ref<HTMLDivElement>(document.createElement('div'));

// 旋转参数
const selected = ref(false);
const { rotate, rotateX } = useKeyDown(selected);

const showShape = computed(() => getRotatedShape(shape, rotate.value, Boolean(rotateX.value)));

// 拖拽事件
const { onDragStart, onDragEnd, onDrag, cellsPosition } = useDraggable(
  name,
  dragArea,
  showShape,
  droped,
);

// 整体形状
const style = computed(() => ({
  ...getShapeWidthHeight(size, rotate.value),
  // transform: `rotate(${rotate.value * 90}deg) rotateX(${rotateX.value * 180}deg)`,
}));

watch(cellsPosition, () => {
  emit('onDrag', cellsPosition.value);
});
</script>

<template>
  <div class="animal-box">
    <div
      ref="dragArea"
      :class="['animal', name, { selected }]"
      :style="style"
      draggable="true"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd"
      @click="selected = !selected"
    >
      <div v-for="cell in showShape" class="cell" :key="cell" :style="getCellLeftTop(cell)"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.animal {
  position: relative;
  cursor: grab;

  &.selected {
    box-shadow:
      0 0 10px rgba(255, 0, 0, 0.5),
      0 0 20px rgba(255, 50, 50, 0.3),
      0 0 30px rgba(255, 100, 100, 0.1);
  }
  .row {
    display: flex;
  }

  .cell {
    width: v-bind(cssSize);
    height: v-bind(cssSize);
    background: #666;
    position: absolute;
  }
}
</style>
