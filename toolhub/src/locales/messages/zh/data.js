// 数据工具
export default {
  data: {
    sqlite: {
      title: "SQLite 数据库",
      description: "在浏览器中运行 SQLite：上传 .db 文件查询、执行 SQL、浏览表结构，支持 OPFS 持久化存储，全部本地完成不上传",
      modes: {
        upload: "上传数据库",
        saved: "已保存的库",
        new: "新建数据库"
      },
      opfsUnavailable: "当前环境不支持 OPFS 持久化存储（需要跨域隔离 COOP/COEP 与专用 Worker 支持），仅能使用临时内存数据库，刷新后数据丢失",
      uploadHint: "点击或拖拽 .db / .sqlite 文件到此处",
      uploadSubHint: "文件在本地导入浏览器存储，不会上传到任何服务器",
      dbNameLabel: "数据库名称",
      dbNamePlaceholder: "如 my-database",
      uploadNameHint: "导入后以此名称保存在浏览器 OPFS 存储中，可重复打开；仅支持字母、数字、点、连字符与下划线",
      newNamePlaceholder: "如 my-database",
      importButton: "导入并打开",
      refreshList: "刷新列表",
      savedHint: "以下数据库保存在本浏览器的 OPFS 存储中，仅本设备本浏览器可见",
      noSaved: "还没有保存过数据库，先通过「上传数据库」或「新建数据库」创建一个",
      colName: "名称",
      colSize: "大小",
      colActions: "操作",
      open: "打开",
      createButton: "创建并打开",
      kindOpfs: "持久化存储 (OPFS)",
      kindMemory: "临时内存库",
      kindOpfsHint: "保存在浏览器 Origin Private File System，关闭页面后仍在，可随时重新打开",
      kindMemoryHint: "仅在当前页面有效，刷新或关闭后数据丢失，适合临时演算",
      sizeLabel: "大小",
      exportButton: "导出 .db",
      closeButton: "关闭",
      tablesTitle: "表与视图",
      tableTag: "表",
      viewTag: "视图",
      noTables: "空数据库，用右侧 SQL 编辑器建表开始",
      sqlPlaceholder: "输入 SQL，例如：SELECT * FROM sqlite_master;",
      runButton: "执行 SQL",
      execHint: "支持多条语句依次执行；结果取第一条查询的列与行，下方显示受影响行数",
      fillSelect: "填入 SELECT",
      changesLabel: "受影响行数",
      rowsLabel: "结果行数",
      exportCsv: "导出 CSV",
      noRows: "查询没有返回任何行",
      phaseDownloading: "正在下载 SQLite 引擎...",
      phaseWorking: "执行中...",
      failed: "操作失败",
      imported: "已导入并打开 {name}",
      deleted: "已删除 {name}",
      exported: "已导出 {name}",
      errors: {
        notDbFile: "请选择 SQLite 数据库文件（.db / .sqlite / .sqlite3）",
        notSqliteFile: "该文件不是有效的 SQLite 数据库",
        importFailed: "导入失败，文件可能已损坏或不是有效的 SQLite 数据库",
        openFailed: "打开数据库失败",
        deserializeFailed: "读取数据库文件失败，文件可能已损坏",
        opfsUnavailable: "当前环境不支持 OPFS 持久化存储",
        nameRequired: "请填写数据库名称",
        dbNotOpen: "数据库尚未打开",
        workerNotReady: "SQLite 引擎尚未就绪",
        workerError: "SQLite 引擎发生错误",
        initTimeout: "SQLite 引擎初始化超时"
      },
      infoTitle: "使用说明",
      infoContent: "本工具基于 SQLite 官方 WebAssembly 版本在浏览器本地运行，数据库文件不会上传到任何服务器。上传的 .db 文件经校验后导入浏览器 OPFS 持久化存储（需要跨域隔离环境），之后刷新页面仍可从「已保存的库」重新打开；也可以创建临时内存库做快速演算。右侧 SQL 编辑器支持任意 SQL（建表、INSERT/UPDATE/DELETE、SELECT、JOIN、事务等），点击左侧表名可快速浏览前 200 行，查询结果可导出为 CSV，整个数据库可导出为 .db 文件。"
    },
    python: {
      title: "Python 运行器",
      description: "在浏览器里运行 Python 代码（Pyodide WebAssembly），支持标准库运算与文本处理，纯本地运行不上传代码",
      stdlibOnly: "当前为标准库模式：支持 json / re / datetime / math / statistics / collections 等 Python 标准库，不含 numpy、pandas 等科学计算库（需额外下载且依赖外部 CDN）。",
      engineNote: "Python 引擎约 11MB（首次使用需下载并缓存），完全在浏览器本地运行，代码不会发送到任何服务器。",
      examples: "示例代码：",
      examplesList: {
        stats: {
          label: "统计计算"
        },
        json: {
          label: "JSON 处理"
        },
        regex: {
          label: "正则提取"
        },
        datetime: {
          label: "日期计算"
        },
        algo: {
          label: "算法实现"
        }
      },
      placeholder: "# 在此编写 Python 代码\nprint(\"Hello, Python!\")",
      run: "运行代码",
      running: "运行中...",
      resultValue: "返回值",
      stdout: "标准输出 (stdout)",
      stderr: "错误输出 (stderr)",
      noOutput: "代码已执行，无输出内容",
      phaseDownloading: "正在下载 Python 引擎（约 9MB，可取消）...",
      phaseLoading: "正在加载 Python 运行时...",
      phaseRunning: "执行中...",
      failed: "执行失败",
      errors: {
        workerNotReady: "Python 引擎尚未就绪",
        workerError: "Python 引擎发生错误",
        initTimeout: "Python 引擎初始化超时，请检查网络后刷新重试"
      },
      emptyTip: "点击上方示例按钮，或直接编写 Python 代码后运行",
      infoTitle: "使用说明",
      infoContent: "本工具基于 Pyodide（CPython 3.13 编译为 WebAssembly）在浏览器本地运行，代码不会上传到任何服务器。首次使用需下载引擎（约 11MB，有进度提示且可取消），之后自动缓存。执行结果、print 输出与错误信息分开显示；Python 脚本耗时不可预知，故进度条在执行阶段显示为 95%。注意：这是标准库模式，不含 numpy / pandas 等科学计算库——若需矩阵运算或复杂数据分析，建议使用本地的 Python 环境。"
    }
  }
}
