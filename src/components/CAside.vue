<script setup lang="ts"></script>

<template>
  <ul class="aside">
    <li class="active">
      <RouterLink :to="{ name: 'home' }">发现音乐</RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'collection' }">我的收藏</RouterLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">

.aside {
  width: 200px;
  position: absolute;
  left: 0;
  top: 50vh;
  transform: translateY(-50%);
  text-align: center;
  padding: 20px 10px;

  li {
    box-sizing: content-box;
    width: 100%;
    padding: 10px 0;
    cursor: pointer;
    font-size: 1.5em;
    font-weight: 800;
    border-radius: 8px;
    user-select: none;

    .router-link-active {
      color: var(--primary);
    }

    &:hover {
      background-color: var(--info);
    }
  }
}
</style>