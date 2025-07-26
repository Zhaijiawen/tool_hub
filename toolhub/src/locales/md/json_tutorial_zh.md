# JSON 使用教程

## 基本格式化

JSON 格式化工具可以帮助你整理和美化 JSON 数据，使其更易读和理解。

### 步骤 1：输入 JSON 数据

在左侧输入框中粘贴你的 JSON 数据，例如：

```json
{"name":"ToolHub","version":"1.0.0","features":["format","encrypt","convert"],"config":{"theme":"dark","language":"zh"}}
```

### 步骤 2：选择格式化选项

- **缩进大小**：选择 2 空格或 4 空格缩进
- **排序键**：可选择是否按字母顺序排序对象键
- **压缩格式**：移除所有空格和换行符

### 步骤 3：格式化结果

点击"格式化"按钮，右侧会显示格式化后的结果：

```json
{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": [
    "format",
    "encrypt",
    "convert"
  ],
  "config": {
    "theme": "dark",
    "language": "zh"
  }
}
```

## 高级功能

### 语法验证

工具会自动检查 JSON 语法错误，并在发现问题时显示具体错误信息。

### 复制功能

点击"复制"按钮可以快速复制格式化后的 JSON 到剪贴板。

### 清空功能

使用"清空"按钮可以快速清空输入和输出区域。 