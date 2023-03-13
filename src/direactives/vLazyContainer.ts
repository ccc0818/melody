import { debounce } from "@/utils";
export default (el: HTMLElement, binding: any) => {
  const lazyNodes = el.querySelectorAll(binding.value.selector);
  if (!lazyNodes.length) {
    return;
  }

  const update = (e?: Event) => {
    nextTick(() => {
      const sizeEl = el.getBoundingClientRect();

      // 延迟加载
      debounce(() => {
        lazyNodes.forEach((v: HTMLElement) => {
          const rect = v.getBoundingClientRect();

          if (rect.y > sizeEl.y && rect.y < sizeEl.y + sizeEl.height) {
            // 在可视区域内
            v.setAttribute("src", v.dataset.src ?? "");
          }
        });
      }, 200);
    })
  };

  // 挂载后立即执行一次
  update();

  el.onscroll = update;
};
