<script setup lang="ts">
let useTrackEl = $ref<HTMLElement | null>(null)
let trackEl = $ref<HTMLElement | null>(null)
let thumbEl = $ref<HTMLElement | null>(null)
let trackWidth = $ref<number>(0)

const props = defineProps({
  max: {
    type: Number,
    default: 100
  },
  min: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Number,
    default: 0
  },
  stroke: {
    type: Number,
    default: 3
  },
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'drag', value: number): void
}>()

let innerValue = $ref<number>(props.modelValue)
let draging = false

watch(() => props.modelValue, n => { 
  
  if (draging === false) { 
    innerValue = n
  }
})

let value = $computed({
  get() {
    return innerValue
  },
  set(v: number) {
    innerValue = v
    emits('update:modelValue', v)
  }
})

let percent = $computed(() => {
  return value / (props.max - props.min)
})

let offset = $computed(() => {
  return trackWidth * percent
})

onMounted(() => {
  trackWidth = trackEl!.clientWidth - thumbEl!.clientWidth;

  const observer = new ResizeObserver(() => {
    if (trackEl && thumbEl) {
      trackWidth = trackEl.clientWidth - thumbEl.clientWidth;
    }
  })

  observer.observe(trackEl as HTMLElement)

  Paint()

  watch(() => offset, () => {
    Paint();
  })
})

function Paint() {
  useTrackEl!.style.width = offset + 'px';
  thumbEl!.style.left = offset + 'px'
}

let preX = 0;
function dragHandle(e: MouseEvent) {
  const offsetX = e.pageX - preX
  preX = e.pageX
  let newOffset = offset + offsetX;
  if (newOffset > trackWidth) {
    newOffset = trackWidth
  } else if (newOffset < 0) {
    newOffset = 0
  }

  const newPercent = newOffset / trackWidth;
  value = newPercent * (props.max - props.min);
  emits('drag', value);
}

function mousedownHandle(e: MouseEvent) {
  preX = e.pageX;
  draging = true

  function release() {
    emits('change', value)
    draging = false
    document.removeEventListener('mousemove', dragHandle)
    document.removeEventListener('mouseup', release)
  }

  document.addEventListener('mousemove', dragHandle)
  document.addEventListener('mouseup', release)
}

function clickTrackHandle(e: MouseEvent) {
  const newvalue = (e.offsetX / trackWidth) * (props.max - props.min)
  value = newvalue
  emits('change', newvalue)
}
</script>

<template>
  <div class="range" @click.stop>
    <div ref="trackEl" class="track" :style="`--stroke: ${stroke}px`" @click="clickTrackHandle">
      <div ref="useTrackEl" class="use"></div>
      <div ref="thumbEl" class="thumb" @click.stop @mousedown.stop="mousedownHandle"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.range {
  width: 100%;
  height: 20px;
  // border: 1px solid red;
  display: flex;
  align-items: center;
  user-select: none;

  .track {
    width: 100%;
    height: var(--stroke);
    background-color: var(--info);
    position: relative;
    display: flex;
    cursor: pointer;

    .use {
      width: 0;
      height: 100%;
      background-color: var(--primary);
      box-sizing: unset;
      padding-right: calc(var(--stroke) / 2);
    }

    .thumb {
      position: absolute;
      left: 0;
      top: -6px;
      width: calc(var(--stroke) + 12px);
      aspect-ratio: 1/1;
      background-color: var(--primary);
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid transparent;
      // transition: .3s;
      box-shadow: 0 0 12px var(--info);
      user-select: none;

      &:hover {
        border: 1px solid var(--primary);
        background-color: #fff;
      }
    }
  }
}
</style>