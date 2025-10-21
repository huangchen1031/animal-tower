<template>
  <div class="home">
    <div class="home-button__list">
      <div class="home-button__list--item" @click="gotoGame">开始游戏</div>
      <div class="home-button__list--item" @click="continueGame">继续游戏</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const gotoGame = () => {
  localStorage.removeItem('animal-tower-level');
  continueGame();
};

const continueGame = () => {
  router.push('game');
};
</script>

<style scoped lang="scss">
.home {
  &-button__list {
    &--item {
      width: 200px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #42b983;
      color: white;
      font-size: 20px;
      border-radius: 8px;
      margin: 20px auto;
      cursor: pointer;
      user-select: none;
      transition: background 0.3s;

      &:hover {
        background: #369870;
      }
    }
  }
}
</style>
