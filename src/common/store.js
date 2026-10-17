// 本地持久化：收藏夹 / 最近阅读 / 正文字号（@system.storage 为异步接口，统一用回调）
import storage from "@system.storage"

const FAV_KEY = "cgz_favs"
const RECENT_KEY = "cgz_recent"
const SIZE_KEY = "cgz_fontsize"
const MEM_KEY = "cgz_memory"
const RECENT_MAX = 10

function parseArray(text) {
  let arr = []
  if (text) {
    try {
      const parsed = JSON.parse(text)
      if (parsed instanceof Array) {
        arr = parsed
      }
    } catch (e) {
      arr = []
    }
  }
  return arr
}

function readArray(key, cb) {
  try {
    storage.get({
      key: key,
      default: "[]",
      success: function (data) {
        cb(parseArray(data))
      },
      fail: function () {
        cb([])
      }
    })
  } catch (e) {
    cb([])
  }
}

function writeArray(key, arr) {
  try {
    storage.set({
      key: key,
      value: JSON.stringify(arr)
    })
  } catch (e) {
    // 忽略写入失败
  }
}

// 收藏条目统一格式：{ grade, name }
function getFavorites(cb) {
  readArray(FAV_KEY, cb)
}

function isFavorite(grade, name, cb) {
  getFavorites(function (arr) {
    let found = false
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].grade === grade && arr[i].name === name) {
        found = true
        break
      }
    }
    cb(found)
  })
}

// 切换收藏状态，回调返回切换后的结果
function toggleFavorite(grade, name, cb) {
  getFavorites(function (arr) {
    let index = -1
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].grade === grade && arr[i].name === name) {
        index = i
        break
      }
    }
    if (index >= 0) {
      arr.splice(index, 1)
      writeArray(FAV_KEY, arr)
      cb(false)
    } else {
      arr.push({ grade: grade, name: name })
      writeArray(FAV_KEY, arr)
      cb(true)
    }
  })
}

function getRecent(cb) {
  readArray(RECENT_KEY, cb)
}

// 记录最近阅读，去重后置顶，最多保留 RECENT_MAX 条
function pushRecent(grade, name) {
  getRecent(function (arr) {
    const next = [{ grade: grade, name: name }]
    for (let i = 0; i < arr.length; i++) {
      if (!(arr[i].grade === grade && arr[i].name === name)) {
        next.push(arr[i])
      }
    }
    writeArray(RECENT_KEY, next.slice(0, RECENT_MAX))
  })
}

function clearRecent() {
  writeArray(RECENT_KEY, [])
}

function getFontSize(cb) {
  try {
    storage.get({
      key: SIZE_KEY,
      default: "26",
      success: function (data) {
        const size = parseInt(data, 10)
        cb(isNaN(size) ? 26 : size)
      },
      fail: function () {
        cb(26)
      }
    })
  } catch (e) {
    cb(26)
  }
}

function setFontSize(size) {
  try {
    storage.set({ key: SIZE_KEY, value: String(size) })
  } catch (e) {
    // 忽略写入失败
  }
}

// ---------- 艾宾浩斯记忆计划 ----------
// 存储结构：{ "年级|篇名": { start: 起始时间戳, step: 已完成轮次 } }
function poemKey(grade, name) {
  return grade + "|" + name
}

function readMemory(cb) {
  try {
    storage.get({
      key: MEM_KEY,
      default: "{}",
      success: function (data) {
        let obj = {}
        if (data) {
          try {
            const parsed = JSON.parse(data)
            if (parsed && typeof parsed === "object") {
              obj = parsed
            }
          } catch (e) {
            obj = {}
          }
        }
        cb(obj)
      },
      fail: function () {
        cb({})
      }
    })
  } catch (e) {
    cb({})
  }
}

function writeMemory(obj) {
  try {
    storage.set({ key: MEM_KEY, value: JSON.stringify(obj) })
  } catch (e) {
    // 忽略写入失败
  }
}

// 读取全部记忆计划
function getMemoryMap(cb) {
  readMemory(cb)
}

// 读取单篇计划
function getPlan(grade, name, cb) {
  readMemory(function (m) {
    cb(m[poemKey(grade, name)] || null)
  })
}

// 写入/覆盖单篇计划
function setPlan(grade, name, plan, cb) {
  readMemory(function (m) {
    m[poemKey(grade, name)] = plan
    writeMemory(m)
    if (cb) {
      cb(plan)
    }
  })
}

// 删除单篇计划（取消“已背完”）
function removePlan(grade, name, cb) {
  readMemory(function (m) {
    delete m[poemKey(grade, name)]
    writeMemory(m)
    if (cb) {
      cb()
    }
  })
}

// 一次性读出收藏 / 最近阅读 / 记忆计划，供正文页在进入时建内存副本；
// 之后所有状态切换都基于内存副本，落盘只写不读，避免“写入后立即回读”拿不到新值
function getCaches(cb) {
  getFavorites(function (favs) {
    getRecent(function (recent) {
      readMemory(function (memMap) {
        cb({ favs: favs, recent: recent, memMap: memMap })
      })
    })
  })
}

// 只写不读的落盘接口
function saveFavorites(arr) {
  writeArray(FAV_KEY, arr)
}

function saveRecent(arr) {
  writeArray(RECENT_KEY, arr)
}

function saveMemoryMap(obj) {
  writeMemory(obj)
}

export default {
  getFavorites: getFavorites,
  getCaches: getCaches,
  saveFavorites: saveFavorites,
  saveRecent: saveRecent,
  saveMemoryMap: saveMemoryMap,
  isFavorite: isFavorite,
  toggleFavorite: toggleFavorite,
  getRecent: getRecent,
  pushRecent: pushRecent,
  clearRecent: clearRecent,
  getFontSize: getFontSize,
  setFontSize: setFontSize,
  poemKey: poemKey,
  getMemoryMap: getMemoryMap,
  getPlan: getPlan,
  setPlan: setPlan,
  removePlan: removePlan
}
