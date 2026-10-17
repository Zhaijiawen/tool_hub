# Python 运行器 — 技术背景

这个工具在浏览器里用 **Pyodide**（把 CPython 编译成 WebAssembly）直接运行 Python 代码。无需安装 Python、无需后端，代码和输出都在本地。

## 只支持标准库

> 重要：本工具**只包含 Python 标准库**，不预装 numpy、pandas、requests 等第三方包。Pyodide 的科学计算栈（numpy/scipy 等）需要从外部 CDN 加载，本项目刻意不引入，以保证纯本地、零外部依赖。

这意味着你能用 `statistics`、`re`、`json`、`datetime`、`collections`、`heapq` 等所有标准库模块，做数据处理、文本解析、日期运算、算法练习等——但无法 `import numpy`。

## 能做什么

- 写代码，点「运行」，看结果。
- 结果分三块展示：**返回值**（最后一个表达式的值）、**标准输出 stdout**、**标准错误 stderr**。
- 内置几个示例按钮：统计、JSON、正则、日期、算法，点一下把代码填进编辑器。

## 怎么用

适合快速验证一段 Python 逻辑、做小数据清洗、给学生演示算法——在浏览器里即写即跑，不用开终端、不用配环境。

## 隐私

代码完全在你本地执行，不上传。
