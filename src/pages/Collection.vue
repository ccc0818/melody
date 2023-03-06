<script setup lang="ts">
import { getUserPlaylist } from '@/service';
import useStore from '@/store';
import { storeToRefs } from 'pinia';

const { userStore} = useStore()
const { userState} = storeToRefs(userStore)

onBeforeMount(async () => { 
  const res = await getUserPlaylist(userState.value.uid)
  console.log(res);
})
</script>

<template>
  <h1>我的歌单</h1>
</template>

<style scoped lang="scss"></style>