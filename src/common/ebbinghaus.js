// 艾宾浩斯遗忘曲线复习排程（纯逻辑，无系统依赖，便于独立测试）
// 标准 8 轮间隔：5 分钟 / 30 分钟 / 12 小时 / 1 天 / 2 天 / 4 天 / 7 天 / 15 天
export const INTERVALS = [
  5 * 60 * 1000,
  30 * 60 * 1000,
  12 * 60 * 60 * 1000,
  1 * 24 * 60 * 60 * 1000,
  2 * 24 * 60 * 60 * 1000,
  4 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  15 * 24 * 60 * 60 * 1000
]

export const TOTAL = INTERVALS.length

export const LABELS = ["5分钟", "30分钟", "12小时", "1天", "2天", "4天", "7天", "15天"]

// 第 step 轮（从 0 开始计数）的到期时间戳；所有轮次已完成时返回 null
export function dueAt(start, step) {
  if (step >= TOTAL) {
    return null
  }
  return start + INTERVALS[step]
}

// 是否到达复习时间
export function isDue(plan, now) {
  if (!plan) {
    return false
  }
  const at = dueAt(plan.start, plan.step)
  if (at === null) {
    return false
  }
  return now >= at
}

// 是否已完成全部轮次
export function isFinished(plan) {
  return !!plan && plan.step >= TOTAL
}

// 完成一轮复习，返回新的计划对象
export function advance(plan) {
  const next = plan.step + 1
  return { start: plan.start, step: next > TOTAL ? TOTAL : next }
}

// 创建计划：从当前时间开始第 1 轮
export function createPlan(now) {
  return { start: now, step: 0 }
}

// 人类可读的进度描述
export function progressText(plan) {
  if (!plan) {
    return ""
  }
  if (isFinished(plan)) {
    return "已背完"
  }
  return "待复习 " + (plan.step + 1) + "/" + TOTAL + " 轮"
}

// 距离下次复习还有多久（人类可读）
export function remainText(plan, now) {
  if (!plan) {
    return ""
  }
  if (isFinished(plan)) {
    return "已完成"
  }
  const at = dueAt(plan.start, plan.step)
  const diff = at - now
  if (diff <= 0) {
    return "该复习了"
  }
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff >= day) {
    return "还需 " + Math.ceil(diff / day) + " 天"
  }
  if (diff >= hour) {
    return "还需 " + Math.ceil(diff / hour) + " 小时"
  }
  return "还需 " + Math.max(1, Math.ceil(diff / minute)) + " 分钟"
}

// 距离下次复习还有多久（紧凑写法，供窄屏状态行使用）
export function remainShort(plan, now) {
  if (!plan) {
    return ""
  }
  if (isFinished(plan)) {
    return "已背完"
  }
  const at = dueAt(plan.start, plan.step)
  const diff = at - now
  if (diff <= 0) {
    return "该复习"
  }
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff >= day) {
    return Math.ceil(diff / day) + "天"
  }
  if (diff >= hour) {
    return Math.ceil(diff / hour) + "时"
  }
  return Math.max(1, Math.ceil(diff / minute)) + "分"
}

export default {
  INTERVALS: INTERVALS,
  TOTAL: TOTAL,
  LABELS: LABELS,
  dueAt: dueAt,
  isDue: isDue,
  isFinished: isFinished,
  advance: advance,
  createPlan: createPlan,
  progressText: progressText,
  remainText: remainText,
  remainShort: remainShort
}
