# 大小写转换 -- 实际示例

日常开发中真正会遇到的场景。

## 规范化乱七八糟的用户输入

用户输入的大小写经常是灾难现场，一键搞定：

**输入（用户敲的）：**
```
hELLO wORLD this IS a TEST
```

**句首大写输出：**
```
Hello world this is a test
```

看起来像正常人写的了，一个点击的事。

## 把 API 字段名变成展示用标签

后端返回的字段名通常是 snake_case，直接展示给用户看不太友好：

**输入（API 字段名）：**
```
user_first_name
user_last_name
email_address
```

**首字母大写输出：**
```
User First Name
User Last Name
Email Address
```

现在看起来像正常的标签文字了，不用手动改。

## 生成常量名

有一组配置键或错误码要写成全大写下划线风格？丢进来点全大写：

**输入：**
```
maximum retry count
database connection timeout
api rate limit exceeded
```

**全大写输出：**
```
MAXIMUM RETRY COUNT
DATABASE CONNECTION TIMEOUT
API RATE LIMIT EXCEEDED
```

然后用查找替换把空格换成下划线就搞定了。大小写的脏活工具帮你干了。

## 生成 URL 路径片段

把标题或导航名转成 URL 友好的小写文本：

**输入：**
```
My Button Component
Header Navigation Bar
Footer Social Links
```

**全小写输出：**
```
my button component
header navigation bar
footer social links
```

再把空格换成连字符，干净的 URL slug 就有了。大小写这步工具搞定，剩下就是个简单的文本替换。
