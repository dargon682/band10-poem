#!/usr/bin/env bash
# 一键：release 打包（含 JSC 字节码 + 签名）并上传到匿名网盘 gofile
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

# gofile: 取上传节点 + 申请 guest token
SERVER=$(curl -s https://api.gofile.io/servers | sed -E 's/.*"servers":\[\{"name":"([^"]+)".*/\1/')
TOKEN=$(curl -s -X POST https://api.gofile.io/accounts | sed -E 's/.*"token":"([^"]+)".*/\1/')

echo "==> 上传至 $SERVER ..."
RESP=$(curl -s -X POST "https://${SERVER}.gofile.io/contents/uploadfile" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@${RPK}")

echo "$RESP"
echo "==> 下载页："
echo "$RESP" | grep -o 'https://gofile.io/d/[A-Za-z0-9]*' | head -1
