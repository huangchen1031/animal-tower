<script setup lang="ts">
import AnimalBox from '@/components/AnimalBox.vue';
import { ANIMAL_SHAPE, Animals } from '@/data/const';
import { ref, computed, watch } from 'vue';
import {
  BASE,
  getCellLeftTop,
  getCellOverlap,
  getShapeCellsPosition,
  getShapeWidthHeight,
} from '@/utils';
import type { AnimalPos, Level, Pos } from '@/data/types';
import union from 'lodash-es/union';
import intersection from 'lodash-es/intersection';

const { star, animals, shape, size, color, index } = defineProps<
  Level<Animals> & { index: number }
>();

// 单元格基础大小
const cssSize = ref(BASE + 'px');

// 整体形状
const style = computed(() => getShapeWidthHeight(size));

// 放置区域
const gameBoxArea = ref<HTMLDivElement>();

const dropedShape = ref<string[]>([]);
const dropedAnimals = ref<AnimalPos[]>([]);

watch(dropedShape, (newVal) => {
  if (newVal.length === shape.length) {
    alert('恭喜过关！');
  }
});

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

// 放置事件
const onDrop = (event: DragEvent) => {
  // 判断是否放置成功， 重叠部分与原始长度相同，且与已放置部分无交集
  if (
    posOverlap.value.length === originCellsPosition.value.length &&
    intersection(posOverlap.value, dropedShape.value).length === 0
  ) {
    // 获取放置位置
    const { offsetTop, offsetLeft } = gameBoxArea.value!;
    const animal = event.dataTransfer?.getData('animal') as Animals;

    dropedAnimals.value = [
      {
        position: getCellLeftTop(posOverlap.value[0]!, offsetTop, offsetLeft),
        animal,
      },
      ...dropedAnimals.value.filter((item) => item.animal !== animal),
    ];

    // 记录已放置的单元格
    dropedShape.value = union(dropedShape.value, posOverlap.value);
  }
  originCellsPosition.value = [];
};

// 坐标组
const originCellsPosition = ref<Pos[]>([]);
const targetCellsPosition = computed(() => {
  const { offsetTop, offsetLeft } = gameBoxArea.value || {};
  return getShapeCellsPosition(offsetTop, offsetLeft, shape);
});

// 拖拽事件
const onDrag = (cellsPosition: Pos[]) => {
  originCellsPosition.value = cellsPosition;
};

// 重叠单元格
const cellOverlap = computed(() =>
  getCellOverlap(originCellsPosition.value, targetCellsPosition.value),
);

const posOverlap = computed(() => cellOverlap.value.map((i) => shape[i]!));
</script>

<template>
  <div class="game-box">
    <div
      class="game-box__shape"
      :style="{ background: color }"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <!-- 放置区域 -->
      <div class="game-box__area" ref="gameBoxArea" :style="style">
        <div
          v-for="(cell, index) in shape"
          class="cell"
          :key="index"
          :style="{
            ...getCellLeftTop(cell),
            background: cellOverlap.includes(index) ? 'red' : 'white',
          }"
        ></div>
      </div>

      <!-- 已放置的形状 -->
      <div class="game-box__animals">
        <animal-box
          class="animal_wrap"
          v-for="item in dropedAnimals"
          :key="item.animal"
          :style="item.position"
          v-bind="ANIMAL_SHAPE[item.animal]"
          @on-drag="onDrag"
        >
        </animal-box>
      </div>
    </div>
    <div class="game-box__info">
      <div class="level">第{{ index + 1 }}关</div>
      <div class="star">难易度 <template v-for="i in star" :key="i">★</template></div>
      <div class="animal_wrap">
        <animal-box
          v-for="animal in animals"
          :key="animal"
          :style="{
            visibility: dropedAnimals.some((item) => item.animal === animal) ? 'hidden' : 'visible',
          }"
          v-bind="ANIMAL_SHAPE[animal]"
          @on-drag="onDrag"
        />
      </div>
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

  &__animals {
    position: absolute;
    width: 1px;
    height: 1px;
    left: 0;
    top: 0;

    .animal-box {
      position: absolute;
    }
  }

  &__info {
    .animal-box {
      padding: 10px;
    }
  }
}
</style>
