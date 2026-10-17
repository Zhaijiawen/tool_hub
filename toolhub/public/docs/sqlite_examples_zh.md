# SQLite 工具 — 使用示例

## 导入并查看一个现成库

**输入：** `chinook.sqlite3`（示例音乐库）
**操作：** 上传导入，点 `albums` 表
**输出：** 表格展示前 200 张专辑

不用装 SQLite 客户端，浏览器里直接翻。

## 建表并导出入 CSV

```sql
CREATE TABLE tasks(id INTEGER PRIMARY KEY, title TEXT, done INTEGER);
INSERT INTO tasks(title, done) VALUES ('写文档', 1), ('发版', 0);
SELECT * FROM tasks WHERE done = 0;
```

**输出：** 表格显示未完成任务，点「导出 CSV」拿到 `query-result.csv`。

## 新建内存库快速试 SQL

**操作：** 新建，选「内存」，跑一段临时查询
**说明：** 关页即丢，适合试语法、验证想法，不污染本地文件。

## 把改完的库导出来

**操作：** 顶栏「导出」
**输出：** 当前库的 `.sqlite3` 文件下载到本地

改完数据想长期保存或发给别人，就导出。
