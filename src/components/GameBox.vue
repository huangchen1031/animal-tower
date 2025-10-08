<script setup lang="ts">
import Animal from '@/components/Animal.vue';
import { ANIMAL_SHAPE, Animals } from '@/data/const';
import { ref, computed } from 'vue';
import {
  BASE,
  getCellLeftTop,
  getCellOverlap,
  getShapeCellsPosition,
  getShapeWidthHeight,
} from '@/utils';
import type { Level, Pos } from '@/data/types';
import { useDraggable } from './hooks';

const { star, animals, shape, size, color, index } = defineProps<
  Level<Animals> & { index: number }
>();

// 单元格基础大小
const cssSize = ref(BASE + 'px');

// 整体形状
const style = computed(() => getShapeWidthHeight(size));

// 放置区域
const gameBoxArea = ref<HTMLDivElement>();

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();

  // 长度对齐
  if (cellOverlap.value.length === originCellsPosition.value.length) {
  }
};

// 坐标组
const originCellsPosition = ref<Pos[]>([]);
const targetCellsPosition = computed(() => {
  const { offsetTop, offsetLeft } = gameBoxArea.value || {};
  return getShapeCellsPosition(offsetTop, offsetLeft, shape);
});

const onDrag = (cellsPosition: Pos[]) => {
  originCellsPosition.value = cellsPosition;
};

const cellOverlap = computed(() =>
  getCellOverlap(originCellsPosition.value, targetCellsPosition.value),
);
</script>

<template>
  <div class="game-box">
    <div class="game-box__shape" :style="{ background: color }">
      <div
        class="game-box__area"
        ref="gameBoxArea"
        :style="style"
        @dragover="onDragOver"
        @drop="onDrop"
      >
        <div
          v-for="(cell, index) in shape"
          class="cell"
          :style="{
            ...getCellLeftTop(cell),
            background: cellOverlap.includes(index) ? 'red' : 'white',
          }"
        ></div>
      </div>
    </div>
    <div class="game-box__animal">
      <div class="level">第{{ index + 1 }}关</div>
      <div class="star">难易度 <template v-for="i in star">★</template></div>
      <animal v-for="animal in animals" v-bind="ANIMAL_SHAPE[animal]" @on-drag="onDrag" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-box {
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  &__shape {
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__area {
    position: relative;
    .cell {
      width: v-bind(cssSize);
      height: v-bind(cssSize);
      background: #fff;
      position: absolute;
      border: 1px dashed;
      border-color: v-bind(color);
    }
  }
}
</style>
