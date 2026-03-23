# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 提供本仓库的开发指南。

## 项目概述

Claude Code History Viewer 是一个基于 Next.js 14 的 Web 应用，用于查看、搜索和分析 Claude Code 的对话历史。应用从本地 `~/.claude` 目录读取 Claude Code 存储的数据。

## 开发命令

```bash
# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 运行 ESLint 检查
npm run lint
```

## 架构说明

### 数据源

应用从文件系统读取 Claude Code 历史数据：
- `~/.claude/history.jsonl` - 会话元数据（每行一个 JSON 对象）
- `~/.claude/projects/{hash}/{sessionId}.jsonl` - 完整对话消息

可通过 `CLAUDE_DIR` 环境变量覆盖默认路径。

### 核心文件

- `lib/claude-history.ts` - 核心数据加载逻辑、文件解析、搜索和导出功能
- `lib/types.ts` - TypeScript 接口定义（会话、消息、API 响应）
- `lib/xml-utils.ts` - 从用户消息中提取 `<summary>` 标签的 XML 解析工具
- `app/api/` - Next.js API 路由（会话、搜索、统计、导出）

### 消息类型

解析器处理会话 JSONL 文件中的以下消息类型：
- `user` - 用户消息（过滤掉 tool_result 内容数组）
- `assistant` - AI 回复（通过 `message.role` 检测）
- `tool_use` - 工具调用
- `tool_result` - 工具执行结果
- `file-history-snapshot` - 不显示

内容可以是字符串、数组（含思考块）或对象 - 参考 `lib/claude-history.ts` 中的 `extractContent()` 和 `contentToString()`。

### 导出格式

会话可导出为：
- Markdown (`md`) - 带标题的格式化对话
- JSON (`json`) - 原始会话数据
- HTML (`html`) - 带样式的独立页面

### 部署方式

Docker（推荐）：
```bash
docker-compose up -d
```

PM2：
```bash
# 先更新 ecosystem.config.cjs 中的实际路径
pm2 start ecosystem.config.cjs
```

生产/Docker 环境使用 3100 端口，开发环境使用 3000 端口。
