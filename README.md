# Claude Code History Viewer

一个用于查看和搜索 Claude Code 对话历史的 Web 应用。

## 功能特性

- **会话列表** - 浏览所有对话历史，按时间和项目筛选
- **会话详情** - 查看完整的对话内容，包括用户消息、AI回复和工具调用
- **全文搜索** - 搜索所有对话中的关键词
- **导出功能** - 将对话导出为 Markdown、JSON 或 HTML 格式
- **响应式设计** - 支持桌面和移动设备

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式
- **date-fns** - 日期格式化
- **Lucide React** - 图标库

## 安装

```bash
npm install
```

## 运行

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

## 配置

应用默认读取 `~/.claude` 目录下的对话历史。如需修改，设置环境变量：

```bash
export CLAUDE_DIR=/path/to/your/.claude
```

## 项目结构

```
claude-history-viewer/
├── app/
│   ├── api/                    # API 路由
│   │   ├── sessions/           # 会话列表和详情 API
│   │   └── search/             # 搜索 API
│   ├── sessions/               # 会话页面
│   │   ├── page.tsx            # 会话列表
│   │   └── [id]/page.tsx       # 会话详情
│   ├── search/page.tsx         # 搜索页面
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/
│   └── ui/                     # UI 组件
├── lib/
│   ├── claude-history.ts       # 数据层
│   ├── types.ts                # 类型定义
│   └── utils.ts                # 工具函数
└── package.json
```

## 后续扩展

- 添加用户认证（NextAuth.js）
- 支持多用户和团队共享
- 添加标签和收藏功能
- 实时监控新对话
- 部署到 Vercel/自托管服务器
