# SQLite 工具 — 使用教程

## 打开一个已有的库

1. 选「上传导入」，选一个 `.sqlite3` 文件。
2. 给它在 OPFS 里的名字（默认用文件名），点「导入」。
3. 左侧出现表列表，点表名浏览数据；或右侧写 SQL 查询。

## 新建一个库

1. 选「新建」，填名字。
2. 选存储位置：**OPFS**（持久）或 **内存**（临时）。
3. 在 SQL 编辑器里建表、插数据，比如：

```sql
CREATE TABLE notes(id INTEGER PRIMARY KEY, body TEXT);
INSERT INTO notes(body) VALUES ('hello');
SELECT * FROM notes;
```

## 查询与导出

- 写 `SELECT` 点运行，结果以表格展示，点「导出 CSV」下载。
- 写改数据的语句，会显示影响行数。
- 顶栏「导出」把整个库下载成 `.sqlite3`。

## 已保存的库

切到「已保存」标签页能看到之前存进 OPFS 的库，可打开或删除。注意：删除是从 OPFS 永久移除。

## 小提示

- 不支持 OPFS 时，新建只能用内存模式，关页就丢，记得及时导出。
- 表名、列名含特殊字符时用双引号包裹，如 `SELECT * FROM "my table"`。
