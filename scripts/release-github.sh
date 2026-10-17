#!/usr/bin/env bash
# 一键：release 打包（JSC 字节码 + 签名）→ 创建 GitHub Release 并上传 rpk 资产
# 依赖环境变量：GH_TOKEN（GitHub PAT，需 repo 权限）
# 可选：GH_REPO（默认 dargon682/band10-poem）
set -e
cd "$(dirname "$0")/.."

VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"
REPO="${GH_REPO:-dargon682/band10-poem}"

if [ -z "$GH_TOKEN" ]; then
  echo "请先设置 GH_TOKEN 环境变量" >&2
  exit 1
fi

echo "==> release 打包中..."
npm run release

RPK=$(ls -t dist/*.rpk | head -1)
if [ -z "$RPK" ]; then
  echo "未找到 rpk 产物" >&2
  exit 1
fi
echo "==> 产物: $RPK"
md5sum "$RPK"

# 取或建 Release（用 python3 解析 JSON，避免正则误匹配）
release_id() {
  curl -s -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/releases/tags/${TAG}" \
    | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('id',''))" 2>/dev/null
}

ID=$(release_id)
if [ -z "$ID" ]; then
  echo "==> 创建 Release ${TAG}"
  curl -s -X POST -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/releases" \
    -d "{\"tag_name\":\"${TAG}\",\"name\":\"${TAG}\",\"body\":\"小米手环10 初高中古诗词 ${TAG}\"}" > /dev/null
  ID=$(release_id)
fi

echo "==> 上传资产到 Release ${TAG} (id=${ID})"
NAME=$(basename "$RPK")
curl -s -X POST -H "Authorization: Bearer $GH_TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@${RPK}" \
  "https://uploads.github.com/repos/${REPO}/releases/${ID}/assets?name=${NAME}" \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('browser_download_url', d))"
