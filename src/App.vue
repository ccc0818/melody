<script setup lang="ts">
import Aside from '@/components/CAside.vue';
import Header from './components/CHeader.vue';
import useStore from './store';
import { saveCache, restoreCache} from '@/utils/cache'

window.addEventListener('beforeunload', () => { 
  saveCache();
})

const { playerStore } = useStore()
restoreCache()
const { initPlayerStore } = playerStore
initPlayerStore();
</script>

<template>
  <div class="app">
    <div class="header">
      <Header />
    </div>

    <Aside />
    
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  $aside-width: 200px;
  $header-height: 80px;
  height: 100%;
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $header-height;
    border-bottom: 1px solid var(--info-500);
    z-index: 99;
  }

  .content {
    width: 100%;
    padding-top: $header-height;
    padding-left: $aside-width;
  }
}
</style>