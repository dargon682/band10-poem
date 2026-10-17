// 篇目检索（纯逻辑，无系统依赖，便于独立测试）
// metnList 元素格式：{ name, author, grade }

// 按题目或作者关键字检索，大小写不敏感
export function match(metaList, keyword) {
  const kw = (keyword || "").trim().toLowerCase()
  if (!kw) {
    return []
  }
  const out = []
  for (let i = 0; i < metaList.length; i++) {
    const item = metaList[i]
    const name = (item.name || "").toLowerCase()
    const author = (item.author || "").toLowerCase()
    if (name.indexOf(kw) >= 0 || author.indexOf(kw) >= 0) {
      out.push(item)
    }
  }
  return out
}

export default {
  match: match
}
