<script setup lang="ts">
const props = defineProps<{
  total: number;
  page: number;
  limit: number;
}>();

const emits = defineEmits<{
  (e: "update", page: number): void;
}>();

const showpages = 8;
const totalPageRef = computed(() => Math.ceil(props.total / props.limit));
const pagesRef = computed(() => {
  let min = 1,
    max = min + showpages - 1;

  if (props.page - showpages / 2 > 0) {
    // 需要改动
    min = props.page - showpages / 2;
    max = props.page + showpages / 2;
  }
  max = max > totalPageRef.value ? totalPageRef.value : max;

  let arr = [];
  for (let i = min; i < min + showpages; i++) {
    arr.push(i);
  }

  return arr;
});

// 更新页面
function updatePageHandle(page: number) {
  if (page < 0 || page > totalPageRef.value) {
    return;
  }

  emits("update", page);
}
</script>

<template>
  <div class="pager-container">
    <span class="page">{{ page }}/{{ totalPageRef }}</span>
    <span
      class="iconfont icon-houtui btn"
      @click="updatePageHandle(page - 1)"
    ></span>
    <span
      class="btn"
      :class="v === page ? 'selected' : ''"
      v-for="v in pagesRef"
      :key="v"
      @click="updatePageHandle(v)"
      >{{ v }}</span
    >
    <span
      class="iconfont icon-qianjin btn"
      @click="updatePageHandle(page + 1)"
    ></span>
  </div>
</template>

<style scoped lang="scss">
.pager-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  .page {
    display: block;
    height: 36px;
    box-sizing: content-box;
    padding: 0 10px;
    line-height: 36px;
    border: 2px solid var(--primary);
    text-align: center;
    border-radius: 15px;
    user-select: none;
  }

  .btn {
    display: block;
    width: 40px;
    height: 40px;
    line-height: 36px;
    text-align: center;
    aspect-ratio: 1/1;
    font-size: 1em;
    border: 2px solid var(--primary);
    margin: 5px;
    flex-shrink: 0;
    border-radius: 31% 33% 34% 35% / 29% 31% 31% 28%;
    user-select: none;

    &.selected {
      background-color: var(--primary);
    }

    &:hover {
      background-color: var(--primary-500);
      cursor: pointer;
    }

    &:active {
      border-width: 3px;
    }
  }
}
</style>
