# Shell — 幕后原理

Shell 既是 REPL 也是脚本语言。它是 Unix 系统的胶水——你敲命令，Shell 负责解析、展开、执行。Bash（1989）是大多数 Linux 发行版和 macOS 的默认 Shell。Zsh 从 macOS Catalina 起成为默认。Fish 是用户友好的新秀。

## 命令怎么执行

当你输入 `ls -la *.txt`，Shell 在执行前做了好几步：

1. **分词** — 拆成单词：`ls`、`-la`、`*.txt`
2. **展开** — `*.txt` 通过通配符展开成匹配的文件名
3. **重定向** — 设置 `>`、`<`、`|`、`2>&1`
4. **执行** — `fork()` + `exec()` 在子进程中运行 `ls`

管道 `|` 把前一个命令的 stdout 接到下一个命令的 stdin。一切皆文件描述符（stdin=0, stdout=1, stderr=2）。

## 脚本基础

```bash
#!/bin/bash
set -euo pipefail  # 出错退出、未定义变量报错、管道失败报错

NAME=${1:-World}   # 第一个参数，默认 "World"
echo "Hello, $NAME"

# 循环
for file in *.txt; do
  echo "Processing $file"
  wc -l "$file"
done

# 条件判断
if [[ -f config.yaml ]]; then
  echo "Config found"
else
  echo "No config"
fi
```

## 变量和引号

```bash
name="John"           # 等号两边不能有空格
greeting="Hello, $name"  # 双引号：变量会展开
literal='Hello, $name'   # 单引号：原样输出

# 命令替换
now=$(date +%Y-%m-%d)
files=$(ls /var/log)
```

黄金法则：**永远给变量展开加引号，除非你明确需要按空格拆分**。`"$var"` 是安全的；`$var` 遇到空格就拆成多个参数。

## 常用模式

```bash
# 查找并处理文件
find . -name "*.log" -mtime +7 -exec rm {} \;

# 文本处理管道
cat access.log | grep " 500 " | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 逐行读取
while IFS= read -r line; do
  echo "Got: $line"
done < file.txt
```

## `set -euo pipefail`

每个脚本顶部都该写上这个：
- `-e` — 任何命令失败立即退出
- `-u` — 未定义变量当错误处理
- `-o pipefail` — 管道中任何一个组件失败，整个管道就算失败

没有这些，脚本会在错误发生后继续默默执行——生产事故往往就是这么来的。
