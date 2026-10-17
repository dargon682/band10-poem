// 正文数据层：按“年级 + 篇名”O(1) 定位，避免重名冲突
import poemsData from "./poem-data.js"

const SEP = "\u0000"

// "年级\u0000篇名" -> 正文项
const poemMap = {}
// 检索用元数据（篇名 + 年级 + 作者），不含正文
const metaList = []
for (let i = 0; i < poemsData.length; i++) {
  const g = poemsData[i]
  const items = (g && g.items) || []
  for (let j = 0; j < items.length; j++) {
    const it = items[j]
    poemMap[g.name + SEP + it.name] = it
    metaList.push({ name: it.name, grade: g.name, author: it.author })
  }
}

export function getPoem(grade, name) {
  const item = poemMap[grade + SEP + name]
  return item || null
}

export function getMeta() {
  return metaList
}

export default {
  getPoem: getPoem,
  getMeta: getMeta
}
