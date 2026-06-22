# Shell — Code Examples

## A Production-Ready Script

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

## Text Processing

```bash
# Top 10 IPs from access log
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Count HTTP status codes
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# Extract JSON field with jq
curl -s https://api.example.com/users | jq '.[].name'

# Find and replace in files
find . -name "*.txt" -exec sed -i 's/old/new/g' {} \;

# Monitor a log file in real time
tail -f /var/log/nginx/access.log | grep " 500 "
```

## Working with Files

```bash
# Batch rename: .jpeg to .jpg
for f in *.jpeg; do
  mv "$f" "${f%.jpeg}.jpg"
done

# Find large files (> 100MB)
find . -type f -size +100M -exec ls -lh {} \;

# Archive and compress
tar -czf backup.tar.gz /var/www /etc/nginx
```

## System Info

```bash
# Disk usage
df -h /
du -sh /* | sort -rh | head -10  # Top 10 directories by size

# Memory
free -h

# Running processes
ps aux --sort=-%mem | head -10  # Top memory consumers
```

## Error Handling

```bash
#!/bin/bash
set -euo pipefail

trap 'echo "Error on line $LINENO"' ERR

cleanup() {
  echo "Cleaning up..."
  rm -f /tmp/myapp-*.tmp
}
trap cleanup EXIT

# Your script logic here
```
