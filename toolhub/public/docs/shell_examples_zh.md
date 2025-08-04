# Shell 代码示例

本文档提供了涵盖核心概念的实用shell代码示例。

## 基本脚本示例

### Hello World 脚本

```bash
#!/bin/bash
echo "Hello, World!"
```

### 简单变量使用

```bash
#!/bin/bash

# 变量赋值
name="Shell"
version="5.0"
is_active=true

# 使用变量
echo "Name: $name"
echo "Version: $version"
echo "Active: $is_active"

# 命令替换
current_time=$(date)
echo "Current time: $current_time"

# 算术运算
a=10
b=5
sum=$((a + b))
echo "Sum: $sum"
```

### 文件操作

```bash
#!/bin/bash

# 创建文件
echo "Hello, Shell!" > output.txt

# 追加到文件
echo "This is a new line" >> output.txt

# 读取文件内容
content=$(cat output.txt)
echo "File content: $content"

# 检查文件是否存在
if [ -f "output.txt" ]; then
    echo "File exists"
else
    echo "File does not exist"
fi

# 复制文件
cp output.txt backup.txt

# 删除文件
rm output.txt
```

## 控制结构

### If-Else 语句

```bash
#!/bin/bash

# 数字比较
number=15

if [ $number -gt 10 ]; then
    echo "Number is greater than 10"
elif [ $number -eq 10 ]; then
    echo "Number is equal to 10"
else
    echo "Number is less than 10"
fi

# 字符串比较
name="John"

if [ "$name" = "John" ]; then
    echo "Hello, John!"
elif [ "$name" = "Jane" ]; then
    echo "Hello, Jane!"
else
    echo "Hello, stranger!"
fi

# 文件和目录检查
if [ -f "file.txt" ]; then
    echo "File exists"
fi

if [ -d "directory" ]; then
    echo "Directory exists"
fi
```

### 循环

```bash
#!/bin/bash

# 带范围的For循环
for i in {1..5}; do
    echo "Number: $i"
done

# 带列表的For循环
for fruit in apple banana orange; do
    echo "Fruit: $fruit"
done

# While循环
counter=0
while [ $counter -lt 5 ]; do
    echo "Counter: $counter"
    ((counter++))
done

# Until循环
count=0
until [ $count -ge 3 ]; do
    echo "Count: $count"
    ((count++))
done

# 文件For循环
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
    fi
done
```

### Case 语句

```bash
#!/bin/bash

# 简单case语句
day="Monday"

case $day in
    "Monday")
        echo "Start of the week"
        ;;
    "Tuesday"|"Wednesday"|"Thursday")
        echo "Mid week"
        ;;
    "Friday")
        echo "End of work week"
        ;;
    "Saturday"|"Sunday")
        echo "Weekend"
        ;;
    *)
        echo "Unknown day"
        ;;
esac
```

## 函数

### 基本函数

```bash
#!/bin/bash

# 函数定义
greet() {
    local name=$1
    echo "Hello, $name!"
}

# 函数调用
greet "Alice"
greet "Bob"

# 带多个参数的函数
calculate() {
    local a=$1
    local b=$2
    local operation=$3
    
    case $operation in
        "add")
            echo $((a + b))
            ;;
        "subtract")
            echo $((a - b))
            ;;
        "multiply")
            echo $((a * b))
            ;;
        "divide")
            echo $((a / b))
            ;;
        *)
            echo "Unknown operation"
            ;;
    esac
}

# 使用函数
result=$(calculate 10 5 "add")
echo "Result: $result"
```

### 带返回值的函数

```bash
#!/bin/bash

# 返回值的函数
is_even() {
    local number=$1
    if [ $((number % 2)) -eq 0 ]; then
        return 0  # 成功（偶数）
    else
        return 1  # 失败（奇数）
    fi
}

# 使用函数
for i in {1..10}; do
    if is_even $i; then
        echo "$i is even"
    else
        echo "$i is odd"
    fi
done
```

## 文本处理

### Grep 示例

```bash
#!/bin/bash

# 在文件中搜索模式
grep "pattern" file.txt

# 不区分大小写搜索
grep -i "pattern" file.txt

# 显示行号
grep -n "pattern" file.txt

# 反向匹配（显示不包含模式的行）
grep -v "pattern" file.txt

# 在目录中递归搜索
grep -r "pattern" directory/

# 计算匹配数
grep -c "pattern" file.txt
```

### Sed 示例

```bash
#!/bin/bash

# 替换文本
sed 's/old/new/g' file.txt

# 每行只替换第一个匹配项
sed 's/old/new/' file.txt

# 就地编辑
sed -i 's/old/new/g' file.txt

# 删除包含模式的行
sed '/pattern/d' file.txt

# 只打印第5-10行
sed -n '5,10p' file.txt

# 在每行开头添加文本
sed 's/^/prefix: /' file.txt
```

### Awk 示例

```bash
#!/bin/bash

# 打印每行的第一个字段
awk '{print $1}' file.txt

# 打印匹配模式的行
awk '/pattern/ {print $0}' file.txt

# 打印第3个字段大于10的行
awk '$3 > 10 {print $0}' file.txt

# 计算第2个字段的总和
awk '{sum += $2} END {print "Sum:", sum}' file.txt

# 打印格式化输出
awk '{printf "Name: %s, Age: %s\n", $1, $2}' file.txt
```

## 文件和目录操作

### 目录导航

```bash
#!/bin/bash

# 获取当前目录
current_dir=$(pwd)
echo "Current directory: $current_dir"

# 更改目录
cd /path/to/directory

# 转到主目录
cd ~

# 转到父目录
cd ..

# 创建目录
mkdir new_directory

# 创建嵌套目录
mkdir -p parent/child/grandchild

# 列出目录内容
ls -la

# 只列出目录
ls -d */
```

### 文件管理

```bash
#!/bin/bash

# 复制文件
cp source.txt destination.txt

# 递归复制目录
cp -r source_dir/ destination_dir/

# 移动/重命名文件
mv oldname.txt newname.txt

# 删除文件
rm file.txt

# 删除目录及内容
rm -rf directory/

# 创建符号链接
ln -s target_file link_name

# 按名称查找文件
find . -name "*.txt"

# 按大小查找文件（大于1MB）
find . -size +1M
```

## 进程管理

### 进程控制

```bash
#!/bin/bash

# 在后台运行命令
sleep 10 &

# 列出后台作业
jobs

# 将作业带到前台
fg %1

# 将作业发送到后台
bg %1

# 按PID终止进程
kill 1234

# 按名称终止进程
killall process_name

# 检查进程是否运行
if pgrep -x "process_name" > /dev/null; then
    echo "Process is running"
else
    echo "Process is not running"
fi
```

### 系统信息

```bash
#!/bin/bash

# 获取系统信息
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "Current date: $(date)"
echo "Uptime: $(uptime)"

# 获取磁盘使用情况
df -h

# 获取内存使用情况
free -h

# 获取CPU信息
lscpu

# 获取进程列表
ps aux

# 获取网络连接
netstat -tuln
```

## 错误处理

### 退出代码和错误检查

```bash
#!/bin/bash

# 检查命令是否成功
if command; then
    echo "Command succeeded"
else
    echo "Command failed with exit code $?"
fi

# 处理前检查文件是否存在
if [ -f "input.txt" ]; then
    echo "Processing input.txt"
    # 处理文件
else
    echo "Error: input.txt not found"
    exit 1
fi

# 检查目录是否可写
if [ -w "/tmp" ]; then
    echo "Directory is writable"
else
    echo "Error: Cannot write to directory"
    exit 1
fi
```

### 错误捕获

```bash
#!/bin/bash

# 捕获错误并退出
trap 'echo "Error occurred on line $LINENO"; exit 1' ERR

# 捕获脚本退出
trap 'echo "Script completed"' EXIT

# 设置严格错误处理
set -e  # 任何错误时退出
set -u  # 未定义变量时退出

# 您的脚本逻辑在这里
echo "Script is running"
# 这将导致错误并退出
undefined_variable

echo "This line will not be reached"
```

## 高级功能

### 数组

```bash
#!/bin/bash

# 声明数组
fruits=("apple" "banana" "orange")

# 访问数组元素
echo "First fruit: ${fruits[0]}"
echo "All fruits: ${fruits[@]}"

# 数组长度
echo "Number of fruits: ${#fruits[@]}"

# 向数组添加元素
fruits+=("grape")

# 遍历数组
for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done

# 关联数组（Bash 4+）
declare -A person
person["name"]="John"
person["age"]="25"
echo "Name: ${person["name"]}"
```

### Here 文档

```bash
#!/bin/bash

# 使用here文档创建文件
cat > config.txt << EOF
# Configuration file
HOST=localhost
PORT=8080
DEBUG=true
EOF

# 使用here文档作为命令输入
grep "pattern" << EOF
line 1
line 2 with pattern
line 3
EOF
```

这些示例演示了核心shell概念和有效shell脚本编写的最佳实践。 