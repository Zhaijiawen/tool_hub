# Shell — 使用格式化工具

左边粘贴混乱的 Shell 脚本，右边出整齐可读的 Bash。

## Hello World

```bash
#!/bin/bash
echo "Hello, World!"
```

加上执行权限然后跑：

```bash
chmod +x script.sh
./script.sh
```

## 变量

```bash
name="John"
age=25
echo "Name: $name, Age: $age"

# 默认值
greeting=${1:-"Hello"}  # 用第一个参数，默认 "Hello"

# 命令替换
now=$(date)
files_count=$(ls | wc -l)
```

## 条件判断

```bash
if [[ "$age" -ge 18 ]]; then
  echo "Adult"
elif [[ "$age" -ge 13 ]]; then
  echo "Teenager"
else
  echo "Child"
fi

# 文件测试
if [[ -f "config.yaml" ]]; then echo "File exists"; fi
if [[ -d "/var/log" ]]; then echo "Directory exists"; fi

# 字符串测试
if [[ "$name" == "John" ]]; then echo "Match"; fi
if [[ -z "$var" ]]; then echo "Empty"; fi   # -z = 零长度
```

## 循环

```bash
# For 循环
for i in {1..5}; do
  echo "Number: $i"
done

for file in *.txt; do
  echo "Processing $file"
done

# While 循环
count=0
while [[ $count -lt 5 ]]; do
  echo "Count: $count"
  ((count++))
done

# 逐行读取文件
while IFS= read -r line; do
  echo "$line"
done < input.txt
```

## 函数

```bash
greet() {
  local name=$1
  echo "Hello, $name!"
}

greet "John"

# 带返回值的函数（0-255）
is_even() {
  (( $1 % 2 == 0 ))
}
```

## 实用建议

- 每个脚本顶部写 `#!/bin/bash` 和 `set -euo pipefail`
- 变量展开一定加引号：`"$var"`，不是 `$var`
- 用 `[[ ]]` 做测试，别用 `[ ]`——更安全、功能更多
- `shellcheck` 是你需要的 linter——在事故发生前揪出常见错误
