// 轻量数据层：仅依赖年级数据，供首页/篇目列表/收藏页使用
// 正文数据（体积大）不在此引入，避免被打进每个页面
import gradesData from "./grade-data.js"

// 全部篇目扁平列表（仅需年级与篇名，用于随机与列表）
const allPoems = []
for (let i = 0; i < gradesData.length; i++) {
  const g = gradesData[i]
  const names = g.poems || []
  for (let j = 0; j < names.length; j++) {
    allPoems.push({ name: names[j], grade: g.name })
  }
}

export function getGrades() {
  return gradesData
}

// 取某年级下的篇目名列表（用于正文页上/下篇定位）
export function getPoemNames(grade) {
  for (let i = 0; i < gradesData.length; i++) {
    if (gradesData[i].name === grade) {
      return gradesData[i].poems || []
    }
  }
  return []
}

export function getAllPoems() {
  return allPoems
}

export default {
  getGrades: getGrades,
  getPoemNames: getPoemNames,
  getAllPoems: getAllPoems
}
