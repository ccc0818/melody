<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder: string;
  }>(),
  {
    modelValue: "",
    placeholder: ''
  }
);

const emits = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: 'change', v: string): void
}>();

function inputHandle(e: Event) {
  const target = e.target as HTMLInputElement
  emits("update:modelValue", target.value);
}

function changeHandle(e: Event) { 
  const target = e.target as HTMLInputElement
  emits("change", target.value);
}
</script>

<template>
  <div class="search-comp">
    <div class="input-container">
      <span class="iconfont icon-sousuo"></span>
      <input
        class="input"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        :value="modelValue"
        @input="inputHandle"
        @change="changeHandle"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-comp {
  display: flex;
  align-items: center;
  justify-content: center;

  .input-container {
    width: 300px;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 8px;
    background-color: var(--info-a50);
    border: 1px solid transparent;

    &:focus-within {
      border: 1px solid var(--primary);
    }

    .iconfont {
      font-weight: 800;
      margin-right: 5px;
      font-size: 1.4em;
    }

    .input {
      height: 100%;
      flex: 1;
      font-size: 1em;
      background-color: transparent;
      outline: none;
      box-shadow: none;
      border: none;
      color: inherit;

      &:focus-visible {
        box-shadow: none;
      }
    }
  }
}
</style>
