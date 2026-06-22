# Shell — 代码示例

## 一个生产级别的脚本

```bash
#!/bin/bash
set -euo pipefail

CONFIG="${CONFIG_PATH:-/etc/myapp/config.yaml}"
LOG_DIR="/var/log/myapp"
MAX_AGE_DAYS=7

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

cleanup_old_logs() {
  log "Cleaning logs older than $MAX_AGE_DAYS days..."
  find "$LOG_DIR" -name "*.log" -mtime "+$MAX_AGE_DAYS" -delete
  log "Done."
}

process_file() {
  local file=$1
  if [[ ! -f "$file" ]]; then
    log "ERROR: File not found: $file"
    return 1
  fi
  log "Processing $file ($(wc -l < "$file") lines)"
}

main() {
  log "Starting..."

  if [[ ! -d "$LOG_DIR" ]]; then
    mkdir -p "$LOG_DIR"
  fi

  cleanup_old_logs

  for file in "$@"; do
    process_file "$file"
  done

  log "Finished."
}

main "$@"
```

## 文本处理

```bash
# 访问日志中 Top 10 IP
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# 统计 HTTP 状态码
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# 用 jq 提取 JSON 字段
curl -s https://api.example.com/users | jq '.[].name'

# 批量查找替换
find . -name "*.txt" -exec sed -i 's/old/new/g' {} \;

# 实时监控日志
tail -f /var/log/nginx/access.log | grep " 500 "
```

## 文件操作

```bash
# 批量重命名：.jpeg 改成 .jpg
for f in *.jpeg; do
  mv "$f" "${f%.jpeg}.jpg"
done

# 找大文件（> 100MB）
find . -type f -size +100M -exec ls -lh {} \;

# 归档压缩
tar -czf backup.tar.gz /var/www /etc/nginx
```

## 系统信息

```bash
# 磁盘使用
df -h /
du -sh /* | sort -rh | head -10  # 占用空间最大的 10 个目录

# 内存
free -h

# 运行中的进程
ps aux --sort=-%mem | head -10  # 内存消耗 Top 10
```

## 错误处理

```bash
#!/bin/bash
set -euo pipefail

trap 'echo "Error on line $LINENO"' ERR

cleanup() {
  echo "Cleaning up..."
  rm -f /tmp/myapp-*.tmp
}
trap cleanup EXIT

# 你的脚本逻辑
```
