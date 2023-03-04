let timer = -1
export function debounce(cb: () => void, delay: number = 500) { 
  clearTimeout(timer)
  timer = setTimeout(() => { 
    cb()
  }, delay)
}