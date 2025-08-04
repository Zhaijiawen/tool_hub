# Shell 使用教程

本教程提供了开始shell脚本和命令行使用的综合指南。

## 环境搭建

### 安装Shell

大多数类Unix系统都预装了shell：

**Linux**：Bash通常是默认shell
```bash
# 检查当前shell
echo $SHELL

# 安装额外的shell
sudo apt install zsh fish  # Ubuntu/Debian
sudo yum install zsh       # CentOS/RHEL
```

**macOS**：预装了Bash和Zsh
```bash
# 切换到Zsh（较新macOS的默认shell）
chsh -s /bin/zsh
```

**Windows**：安装WSL或使用Git Bash
```bash
# 安装WSL
wsl --install
```

### 终端设置

**选择终端模拟器**：
- **Linux**：GNOME Terminal、Konsole、xterm
- **macOS**：Terminal.app、iTerm2
- **Windows**：Windows Terminal、ConEmu

**配置您的Shell**：
```bash
# 编辑shell配置
nano ~/.bashrc    # 对于Bash
nano ~/.zshrc     # 对于Zsh
```

## 基本Shell命令

### 导航命令

```bash
# 更改目录
cd /path/to/directory
cd ~              # 主目录
cd ..             # 父目录
cd -              # 上一个目录

# 列出文件和目录
ls
ls -la           # 所有文件及详细信息
ls -lh           # 人类可读的大小
ls *.txt         # 列出特定文件类型

# 打印工作目录
pwd

# 创建目录
mkdir new_directory
mkdir -p parent/child  # 创建嵌套目录
```

### 文件操作

```bash
# 复制文件
cp source.txt destination.txt
cp -r directory/ destination/  # 复制目录

# 移动/重命名文件
mv oldname.txt newname.txt
mv file.txt /path/to/directory/

# 删除文件
rm file.txt
rm -rf directory/  # 删除目录及内容

# 查看文件内容
cat file.txt
less file.txt      # 可滚动视图
head -10 file.txt  # 前10行
tail -10 file.txt  # 后10行
```

### 文本处理

```bash
# 在文件中搜索
grep "pattern" file.txt
grep -i "pattern" file.txt  # 不区分大小写
grep -r "pattern" directory/  # 递归搜索

# 替换文本
sed 's/old/new/g' file.txt
sed -i 's/old/new/g' file.txt  # 就地编辑

# 使用awk处理文本
awk '{print $1}' file.txt  # 打印第一个字段
awk '/pattern/ {print $0}' file.txt  # 打印匹配行

# 排序和过滤
sort file.txt
sort -u file.txt  # 删除重复项
uniq file.txt     # 删除连续重复项
```

## Shell脚本基础

### 创建脚本

```bash
#!/bin/bash
# 这是注释
echo "Hello, World!"
```

**使脚本可执行**：
```bash
chmod +x script.sh
./script.sh
```

### 变量

```bash
#!/bin/bash

# 变量赋值
name="John"
age=25

# 使用变量
echo "Name: $name"
echo "Age: $age"

# 命令替换
current_date=$(date)
echo "Current date: $current_date"

# 读取用户输入
read -p "Enter your name: " user_name
echo "Hello, $user_name!"
```

### 控制结构

**If语句**：
```bash
#!/bin/bash

if [ $1 -gt 10 ]; then
    echo "Number is greater than 10"
elif [ $1 -eq 10 ]; then
    echo "Number is equal to 10"
else
    echo "Number is less than 10"
fi

# 字符串比较
if [ "$name" = "John" ]; then
    echo "Hello, John!"
fi
```

**循环**：
```bash
#!/bin/bash

# For循环
for i in {1..5}; do
    echo "Number: $i"
done

# While循环
counter=0
while [ $counter -lt 5 ]; do
    echo "Counter: $counter"
    ((counter++))
done

# 文件For循环
for file in *.txt; do
    echo "Processing: $file"
done
```

### 函数

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

# 带返回值的函数
calculate_sum() {
    local a=$1
    local b=$2
    echo $((a + b))
}

result=$(calculate_sum 5 3)
echo "Sum: $result"
```

## 高级功能

### I/O重定向

```bash
# 将输出重定向到文件
echo "Hello" > output.txt

# 追加到文件
echo "World" >> output.txt

# 从文件重定向输入
cat < input.txt

# 将输出管道到另一个命令
ls -la | grep "\.txt$"

# 重定向输出和错误
command > output.txt 2>&1
```

### 进程管理

```bash
# 在后台运行命令
sleep 10 &

# 列出后台作业
jobs

# 将作业带到前台
fg %1

# 将作业发送到后台
bg %1

# 终止进程
kill 1234
killall process_name
```

### 环境变量

```bash
# 设置环境变量
export PATH="/usr/local/bin:$PATH"

# 查看所有环境变量
env

# 使用特定变量
echo "User: $USER"
echo "Home: $HOME"
echo "Path: $PATH"
```

## 错误处理

### 退出代码

```bash
#!/bin/bash

# 检查命令是否成功
if command; then
    echo "Command succeeded"
else
    echo "Command failed with exit code $?"
fi

# 使用特定代码退出脚本
exit 1
```

### 错误捕获

```bash
#!/bin/bash

# 捕获错误
trap 'echo "Error occurred"; exit 1' ERR

# 设置严格错误处理
set -e  # 任何错误时退出
set -u  # 未定义变量时退出
```

## 最佳实践

### 脚本组织

```bash
#!/bin/bash

# 脚本头部
# Author: Your Name
# Date: 2024-01-01
# Description: Brief description

# 配置
CONFIG_FILE="/etc/config.conf"
LOG_FILE="/var/log/script.log"

# 函数
log_message() {
    echo "$(date): $1" >> "$LOG_FILE"
}

# 主脚本
main() {
    log_message "Script started"
    # 您的脚本逻辑在这里
    log_message "Script completed"
}

# 调用主函数
main "$@"
```

### 输入验证

```bash
#!/bin/bash

# 检查是否提供了必需的参数
if [ $# -lt 2 ]; then
    echo "Usage: $0 <arg1> <arg2>"
    exit 1
fi

# 验证文件存在性
if [ ! -f "$1" ]; then
    echo "Error: File $1 does not exist"
    exit 1
fi

# 检查目录是否可写
if [ ! -w "/tmp" ]; then
    echo "Error: Cannot write to /tmp"
    exit 1
fi
```

### 调试

```bash
#!/bin/bash

# 启用调试
set -x  # 执行前打印命令

# 您的脚本在这里

# 禁用调试
set +x
```

本教程涵盖了基本的shell概念和实践。继续探索shell功能以精通命令行使用和脚本编写。 