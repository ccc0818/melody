<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    chunks?: number;
    analyzer?: AnalyserNode;
    play: boolean;
  }>(),
  {
    chunks: 64,
    play: false,
  }
);

let waveElRef = $ref<HTMLElement | null>(null);
let needdraw = true;

onBeforeUnmount(() => {
  needdraw = false;
});

watch(
  () => props.analyzer,
  n => {
    if (n) {
      n.fftSize = props.chunks * 2;
      if (props.play) {
        draw();
      }
    }
  }
);

let timer = 0;
watch(
  () => props.play,
  n => {
    clearTimeout(timer);

    if (n) {
      needdraw = true;
      draw();
    } else {
      timer = setTimeout(() => {
        needdraw = false;
      }, 1000);
    }
  }
);

const fps = 24;
const frameDelay = 1000 / fps;
function draw() {
  if (!waveElRef || !props.analyzer) {
    nextTick(() => {
      draw();
    });
    return;
  }

  let byteArray: Uint8Array = new Uint8Array(props.analyzer.frequencyBinCount);
  props.analyzer.getByteFrequencyData(byteArray); // 获取当前的频率数据

  const chunks: any = waveElRef.querySelectorAll(".chunk");

  // byteArray.forEach((v, i) => {
  //   chunks[i].style.height = Math.ceil(v * 100 / 255) + 6 + '%'
  // })

  let tempArr = byteArray.filter((v, i) => i % 2 === 0);

  for (let i = 0; i < tempArr.length; ++i) {
    chunks[i].style.height =
      Math.ceil((tempArr[tempArr.length - i - 1] * 100) / 255) + 6 + "%";
  }

  for (let i = tempArr.length; i < tempArr.length * 2; ++i) {
    chunks[i].style.height =
      Math.ceil((tempArr[i - tempArr.length] * 100) / 255) + 6 + "%";
  }

  if (needdraw) {
    // 减少渲染
    setTimeout(() => { 
      // requestAnimationFrame(draw);
      draw();
    }, frameDelay);
  }
}
</script>

<template>
  <div ref="waveElRef" class="audio-visable" v-if="analyzer">
    <div v-for="i in chunks" :key="i" class="chunk"></div>
  </div>
</template>

<style scoped lang="scss">
.audio-visable {
  width: 100%;
  height: 100%;
  // background-color: #2c2c2c77;
  border-radius: 8px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;

  .chunk {
    height: 6px;
    // width: 6px;
    flex: 1;
    margin: 0 2px;
    background-color: #fff;
    border-radius: 3px;
    // transform: scaleY(0);
    transition: 0.1s;
  }
}
</style>
