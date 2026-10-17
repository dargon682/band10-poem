// 本地持久化：收藏夹 / 最近阅读 / 正文字号（@system.storage 为异步接口，统一用回调）
import storage from "@system.storage"

const FAV_KEY = "cgz_favs"
const RECENT_KEY = "cgz_recent"
const SIZE_KEY = "cgz_fontsize"
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

export default {
  getFavorites: getFavorites,
  isFavorite: isFavorite,
  toggleFavorite: toggleFavorite,
  getRecent: getRecent,
  pushRecent: pushRecent,
  clearRecent: clearRecent,
  getFontSize: getFontSize,
  setFontSize: setFontSize
}
