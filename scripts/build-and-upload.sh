#!/usr/bin/env bash
# 一键：release 打包（JSC 字节码 + 签名）并上传到匿名网盘 gofile
# 说明：api.gofile.io 不稳定时，脚本会回退到可用的 store 上传节点 + 本地缓存的 guest token
set -e
cd "$(dirname "$0")/.."

echo "==> release 打包中..."
npm run release

RPK=$(ls -t dist/*.rpk | head -1)
if [ -z "$RPK" ]; then
  echo "未找到 rpk 产物" >&2
  exit 1
fi
echo "==> 产物: $RPK"
md5sum "$RPK"

# 上传节点：优先 api.gofile.io，失败回退 store1
SERVER=$(curl -s -m 15 https://api.gofile.io/servers | sed -E 's/.*"servers":\[\{"name":"([^"]+)".*/\1/')
if [ -z "$SERVER" ]; then
  SERVER=store1
fi

# guest token：优先环境变量 GOFILE_TOKEN，其次本地缓存，最后 api 申请
if [ -z "$GOFILE_TOKEN" ]; then
  if [ -f scripts/.gofile_token ]; then
    GOFILE_TOKEN=$(cat scripts/.gofile_token)
  else
    GOFILE_TOKEN=$(curl -s -m 15 -X POST https://api.gofile.io/accounts | sed -E 's/.*"token":"([^"]+)".*/\1/')
  fi
fi
if [ -z "$GOFILE_TOKEN" ]; then
  echo "无法获取 gofile guest token，请设置环境变量 GOFILE_TOKEN 后重试" >&2
  exit 1
fi
echo "$GOFILE_TOKEN" > scripts/.gofile_token

echo "==> 上传至 $SERVER ..."
RESP=$(curl -s -m 300 -X POST "https://${SERVER}.gofile.io/contents/uploadfile" \
  -H "Authorization: Bearer ${GOFILE_TOKEN}" \
  -F "file=@${RPK}")

echo "$RESP"
echo "==> 下载页："
echo "$RESP" | grep -o 'https://gofile.io/d/[A-Za-z0-9]*' | head -1
