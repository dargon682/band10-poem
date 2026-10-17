// 正文数据层：仅在正文页引入，按“年级 + 篇名”O(1) 定位，避免重名冲突
import poemsData from "./poem-data.js"

// "年级\u0000篇名" -> 正文项
const poemMap = {}
for (let i = 0; i < poemsData.length; i++) {
  const g = poemsData[i]
  const items = (g && g.items) || []
  for (let j = 0; j < items.length; j++) {
    poemMap[g.name + "\u0000" + items[j].name] = items[j]
  }
}

export function getPoem(grade, name) {
  const item = poemMap[grade + "\u0000" + name]
  return item || null
}

export default {
  getPoem: getPoem
}
