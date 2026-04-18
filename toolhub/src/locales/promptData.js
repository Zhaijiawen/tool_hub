// Prompt 工具箱内置数据 - 避免 i18n 转义问题，中英文分开存储

export const builtinPrompts = [
  // ── 代码类 ─────────────────────────────────────────────
  {
    id: 'builtin-code-explain',
    category: 'code',
    title: '代码解释',
    desc: '解释一段代码的功能和逻辑',
    content: '请详细解释以下 {{language}} 代码的功能、逻辑流程和关键实现细节：\n\n```{{language}}\n{{code}}\n```\n\n请包含：1. 总体功能说明 2. 逐步逻辑分析 3. 关键技术点说明'
  },
  {
    id: 'builtin-code-review',
    category: 'code',
    title: 'Code Review',
    desc: '对代码进行全面的代码审查',
    content: '请对以下 {{language}} 代码进行 Code Review，重点关注：\n1. 代码质量和可读性\n2. 潜在的 Bug 和边界情况\n3. 性能优化建议\n4. 安全问题\n5. 最佳实践\n\n```{{language}}\n{{code}}\n```'
  },
  {
    id: 'builtin-code-refactor',
    category: 'code',
    title: '代码重构',
    desc: '重构代码以提升质量',
    content: '请重构以下 {{language}} 代码，目标是：提升可读性、减少重复代码、遵循 {{style}} 规范。请提供重构后的完整代码并说明改动原因。\n\n```{{language}}\n{{code}}\n```'
  },
  {
    id: 'builtin-code-test',
    category: 'code',
    title: '生成单元测试',
    desc: '为代码生成测试用例',
    content: '请为以下 {{language}} 函数/类生成完整的单元测试，使用 {{framework}} 框架，覆盖正常情况、边界情况和异常情况：\n\n```{{language}}\n{{code}}\n```'
  },
  {
    id: 'builtin-code-debug',
    category: 'code',
    title: '排查 Bug',
    desc: '分析代码问题并给出修复建议',
    content: '以下 {{language}} 代码出现了问题：\n\n错误信息：{{error}}\n\n代码：\n```{{language}}\n{{code}}\n```\n\n请分析问题原因并提供修复方案。'
  },
  // ── 写作类 ─────────────────────────────────────────────
  {
    id: 'builtin-write-polish',
    category: 'writing',
    title: '文章润色',
    desc: '优化文章表达和可读性',
    content: '请对以下文章进行润色，保持原意的同时优化语言表达、逻辑结构和可读性，语言风格保持{{style}}：\n\n{{text}}'
  },
  {
    id: 'builtin-write-translate',
    category: 'writing',
    title: '专业翻译',
    desc: '高质量翻译，保留专业术语',
    content: '请将以下内容翻译成{{target_lang}}，要求：1. 准确传达原意 2. 保留专业术语 3. 语言自然流畅 4. 符合目标语言习惯\n\n{{text}}'
  },
  {
    id: 'builtin-write-summary',
    category: 'writing',
    title: '内容总结',
    desc: '对长文本进行摘要提炼',
    content: '请对以下内容进行总结，提炼核心要点，用{{num}}条清晰的要点呈现：\n\n{{text}}'
  },
  {
    id: 'builtin-write-email',
    category: 'writing',
    title: '商务邮件',
    desc: '撰写专业商务邮件',
    content: '请帮我写一封专业的商务邮件：\n- 收件人身份：{{recipient}}\n- 邮件目的：{{purpose}}\n- 关键信息：{{key_info}}\n- 语气风格：{{tone}}\n\n请确保邮件简洁、礼貌、专业。'
  },
  // ── 分析类 ─────────────────────────────────────────────
  {
    id: 'builtin-analyze-pros-cons',
    category: 'analysis',
    title: '优缺点分析',
    desc: '全面分析某个方案或决策',
    content: '请对「{{topic}}」进行全面的优缺点分析：\n\n**优点（Pros）：**\n\n**缺点（Cons）：**\n\n**综合建议：**'
  },
  {
    id: 'builtin-analyze-compare',
    category: 'analysis',
    title: '方案对比',
    desc: '对比多个方案的差异',
    content: '请从以下维度对比 {{option_a}} 和 {{option_b}} 的差异：\n1. 性能/效率\n2. 易用性/学习成本\n3. 适用场景\n4. 优劣势\n5. 选型建议'
  },
  {
    id: 'builtin-analyze-root-cause',
    category: 'analysis',
    title: '根因分析',
    desc: '深入分析问题的根本原因',
    content: '请对以下问题进行根因分析：\n\n问题描述：{{problem}}\n\n请使用5-Why方法逐层分析，最终给出根本原因和改进建议。'
  },
  // ── 角色扮演类 ─────────────────────────────────────────
  {
    id: 'builtin-role-expert',
    category: 'role',
    title: '领域专家',
    desc: '让 AI 扮演特定领域专家',
    content: '你现在是一位资深的 {{domain}} 专家，拥有 {{years}} 年的实践经验。请以专业、严谨但通俗易懂的方式回答我的问题。\n\n我的问题是：{{question}}'
  },
  {
    id: 'builtin-role-interviewer',
    category: 'role',
    title: '模拟面试官',
    desc: '模拟技术面试场景',
    content: '你现在是一位 {{company}} 的资深技术面试官，正在面试一位应聘 {{position}} 的候选人。请根据岗位要求提出有深度的面试问题，并在候选人回答后给出专业的评价和追问。\n\n开始面试。'
  },
  // ── 通用增强类 ─────────────────────────────────────────
  {
    id: 'builtin-enhance-detail',
    category: 'enhance',
    title: '扩写内容',
    desc: '将简短内容扩写成详细版本',
    content: '请将以下内容扩写成约 {{word_count}} 字的详细版本，保持核心观点不变，增加具体细节、例子和论据：\n\n{{content}}'
  },
  {
    id: 'builtin-enhance-structure',
    category: 'enhance',
    title: '结构化输出',
    desc: '要求 AI 以结构化格式输出',
    content: '请将以下内容整理成结构化格式，使用 Markdown 表格或层级列表呈现，便于阅读和参考：\n\n{{content}}'
  }
]

// 英文版内置 Prompts
export const builtinPromptsEn = [
  // ── Code ──────────────────────────────────────────────
  {
    id: 'builtin-code-explain',
    category: 'code',
    title: 'Explain Code',
    desc: 'Explain the function and logic of a code snippet',
    content: 'Please explain in detail the functionality, logic flow and key implementation details of the following {{language}} code:\n\n```{{language}}\n{{code}}\n```\n\nInclude: 1. Overall functionality 2. Step-by-step logic analysis 3. Key technical points'
  },
  {
    id: 'builtin-code-review',
    category: 'code',
    title: 'Code Review',
    desc: 'Perform a thorough code review',
    content: 'Please perform a Code Review on the following {{language}} code, focusing on:\n1. Code quality and readability\n2. Potential bugs and edge cases\n3. Performance optimization suggestions\n4. Security issues\n5. Best practices\n\n```{{language}}\n{{code}}\n```'
  },
  {
    id: 'builtin-code-refactor',
    category: 'code',
    title: 'Refactor Code',
    desc: 'Refactor code to improve quality',
    content: 'Please refactor the following {{language}} code to: improve readability, reduce duplication, and follow {{style}} conventions. Provide the complete refactored code with explanations.\n\n```{{language}}\n{{code}}\n```'
  },
  {
    id: 'builtin-code-test',
    category: 'code',
    title: 'Generate Unit Tests',
    desc: 'Generate test cases for code',
    content: 'Please generate comprehensive unit tests for the following {{language}} function/class using the {{framework}} framework, covering normal cases, edge cases and error cases:\n\n```{{language}}\n{{code}}\n```'
  },
  {
    id: 'builtin-code-debug',
    category: 'code',
    title: 'Debug Code',
    desc: 'Analyze code issues and provide fixes',
    content: 'The following {{language}} code has a problem:\n\nError message: {{error}}\n\nCode:\n```{{language}}\n{{code}}\n```\n\nPlease analyze the root cause and provide a fix.'
  },
  // ── Writing ────────────────────────────────────────────
  {
    id: 'builtin-write-polish',
    category: 'writing',
    title: 'Polish Writing',
    desc: 'Improve article expression and readability',
    content: 'Please polish the following text while preserving the original meaning. Improve language expression, logical structure and readability. Keep the tone {{style}}:\n\n{{text}}'
  },
  {
    id: 'builtin-write-translate',
    category: 'writing',
    title: 'Professional Translation',
    desc: 'High-quality translation preserving terminology',
    content: 'Please translate the following content into {{target_lang}}, requirements: 1. Accurately convey the original meaning 2. Preserve technical terms 3. Natural and fluent language 4. Conform to target language conventions\n\n{{text}}'
  },
  {
    id: 'builtin-write-summary',
    category: 'writing',
    title: 'Summarize Content',
    desc: 'Distill key points from long text',
    content: 'Please summarize the following content, extracting the core points and presenting them in {{num}} clear bullet points:\n\n{{text}}'
  },
  {
    id: 'builtin-write-email',
    category: 'writing',
    title: 'Business Email',
    desc: 'Write a professional business email',
    content: 'Please help me write a professional business email:\n- Recipient role: {{recipient}}\n- Email purpose: {{purpose}}\n- Key information: {{key_info}}\n- Tone/style: {{tone}}\n\nPlease ensure the email is concise, polite and professional.'
  },
  // ── Analysis ───────────────────────────────────────────
  {
    id: 'builtin-analyze-pros-cons',
    category: 'analysis',
    title: 'Pros & Cons Analysis',
    desc: 'Comprehensively analyze a solution or decision',
    content: 'Please provide a comprehensive pros and cons analysis of "{{topic}}":\n\n**Pros:**\n\n**Cons:**\n\n**Overall Recommendation:**'
  },
  {
    id: 'builtin-analyze-compare',
    category: 'analysis',
    title: 'Solution Comparison',
    desc: 'Compare differences between multiple solutions',
    content: 'Please compare {{option_a}} and {{option_b}} across the following dimensions:\n1. Performance/Efficiency\n2. Ease of use/Learning curve\n3. Use cases\n4. Strengths and weaknesses\n5. Recommendation'
  },
  {
    id: 'builtin-analyze-root-cause',
    category: 'analysis',
    title: 'Root Cause Analysis',
    desc: 'Deeply analyze the root cause of a problem',
    content: 'Please perform a root cause analysis on the following issue:\n\nProblem description: {{problem}}\n\nUse the 5-Why method to analyze layer by layer, and conclude with the root cause and improvement suggestions.'
  },
  // ── Role ───────────────────────────────────────────────
  {
    id: 'builtin-role-expert',
    category: 'role',
    title: 'Domain Expert',
    desc: 'Have AI act as a domain expert',
    content: 'You are now a senior {{domain}} expert with {{years}} years of hands-on experience. Please answer my questions in a professional, rigorous yet accessible way.\n\nMy question: {{question}}'
  },
  {
    id: 'builtin-role-interviewer',
    category: 'role',
    title: 'Mock Interviewer',
    desc: 'Simulate a technical interview scenario',
    content: 'You are now a senior technical interviewer at {{company}}, interviewing a candidate for the {{position}} role. Ask in-depth questions based on the job requirements, and provide professional feedback and follow-up questions after the candidate answers.\n\nBegin the interview.'
  },
  // ── Enhance ────────────────────────────────────────────
  {
    id: 'builtin-enhance-detail',
    category: 'enhance',
    title: 'Expand Content',
    desc: 'Expand a brief piece into a detailed version',
    content: 'Please expand the following content into approximately {{word_count}} words while keeping the core ideas intact. Add specific details, examples and supporting arguments:\n\n{{content}}'
  },
  {
    id: 'builtin-enhance-structure',
    category: 'enhance',
    title: 'Structure Output',
    desc: 'Request AI to output in structured format',
    content: 'Please organize the following content into a structured format using Markdown tables or hierarchical lists for easier reading and reference:\n\n{{content}}'
  }
]

