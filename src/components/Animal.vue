<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { BASE, getCellLeftTop, getShapeWidthHeight } from '@/utils';
import { useDraggable, useKeyDown } from './hooks';
import type { AnimalShape } from '@/data/types';

// 单元格基础大小
const cssSize = ref(BASE + 'px');

// 属性和事件
const { name, shape, size } = defineProps<AnimalShape>();
const emit = defineEmits(['onDrag']);

// 整体形状
const style = computed(() => ({
  ...getShapeWidthHeight(size),
  transform: `rotate(${rotate.value}deg) rotateX(${rotateX.value}deg)`,
}));

// 放置区域
const dragArea = ref<HTMLDivElement>(document.createElement('div'));

// 拖拽事件
const { onDragStart, onDragEnd, onDrag, cellsPosition, isDragging, top, left } = useDraggable(
  dragArea,
  shape,
);

// 旋转参数
const { rotate, rotateX } = useKeyDown(isDragging);

watch(cellsPosition, () => {
  emit('onDrag', cellsPosition.value);
});
</script>

<template>
  <div class="animal-wrap">
    <div
      ref="dragArea"
      :class="['animal', name]"
      :style="style"
      draggable="true"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd"
    >
      <div v-for="cell in shape" class="cell" :style="getCellLeftTop(cell)"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.animal {
  position: relative;
  cursor: grab;

  &-wrap {
    padding: 10px;
  }
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
