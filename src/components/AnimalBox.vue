<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { BASE, getCellLeftTop, getRotatedShape, getShapeWidthHeight } from '@/utils';
import { useDraggable, useKeyDown } from './hooks';
import type { AnimalPos, AnimalShape } from '@/data/types';

// 单元格基础大小
const cssSize = ref(BASE + 'px');

// 属性和事件
const {
  name,
  shape,
  size,
  droped,
  image,
  rotate: defaultRotate,
  rotateX: defaultRotateX,
} = defineProps<AnimalShape & Partial<AnimalPos>>();
const emit = defineEmits(['onDrag']);

// 放置区域
const dragArea = ref<HTMLDivElement>(document.createElement('div'));

// 旋转参数
const selected = ref(false);
const onSwitchSelected = () => {
  if (droped?.length) return;
  selected.value = !selected.value;
};
const { rotate, rotateX } = useKeyDown(selected, defaultRotate, defaultRotateX);

const showShape = computed(() => getRotatedShape(shape, rotate.value, Boolean(rotateX.value)));

// 拖拽事件
const { onDragStart, onDragEnd, onDrag, cellsPosition } = useDraggable(
  name,
  dragArea,
  showShape,
  droped,
  rotate,
  rotateX,
);

// 整体形状
const style = computed(() => ({
  ...getShapeWidthHeight(size, rotate.value),
}));

// 背景图片样式（只有背景图片旋转）
const backgroundStyle = computed(() => {
  if (!image) return {};

  const originalSize = getShapeWidthHeight(size, 0);
  const currentSize = getShapeWidthHeight(size, rotate.value);

  // 计算原始尺寸和当前尺寸的数值
  const originalW = parseFloat(originalSize.width);
  const originalH = parseFloat(originalSize.height);
  const currentW = parseFloat(currentSize.width);
  const currentH = parseFloat(currentSize.height);

  // 计算背景层应该移动的距离，使旋转后的背景与dragArea左上角对齐
  const translateX = (currentW - originalW) / 2;
  const translateY = (currentH - originalH) / 2;

  return {
    backgroundImage: `url(${image})`,
    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate.value * 90}deg) rotateX(${rotateX.value * 180}deg)`,
    transformOrigin: `${originalW / 2}px ${originalH / 2}px`,
    ...originalSize,
  };
});

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
      @click="onSwitchSelected"
    >
      <!-- 背景图片层，只有背景图片会旋转 -->
      <div v-if="image" class="background-layer" :style="backgroundStyle"></div>
      <!-- 形状层，不旋转 -->
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

  .background-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0; // 背景层在最底层
    transform-origin: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .cell {
    width: v-bind(cssSize);
    height: v-bind(cssSize);
    // background: #666;
    position: absolute;
    z-index: 1; // 形状层在背景层上方
  }
}
</style>
