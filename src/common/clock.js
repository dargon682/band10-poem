// 顶部时间显示：统一格式化逻辑，避免各页面重复实现
export function nowHM() {
  const date = new Date()
  const hour = date.getHours().toString().padStart(2, "0")
  const minute = date.getMinutes().toString().padStart(2, "0")
  return hour + ":" + minute
}

// 返回定时器 id，页面 onDestroy 时 clearInterval 即可
export function startClock(onTick) {
  onTick(nowHM())
  return setInterval(function () {
    onTick(nowHM())
  }, 60000)
}

export default {
  nowHM: nowHM,
  startClock: startClock
}
