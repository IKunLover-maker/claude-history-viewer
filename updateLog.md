# 更新日志 UpdateLog

## v1.1.0 (2026-03-23)

### 新功能 Feature

#### 1. 中英文切换 (Language Switcher)
- 在每个页面的右上角添加了语言切换按钮
- 支持简体中文和英文两种语言
- 自动检测浏览器语言首次访问
- 记住用户语言偏好（localStorage 持久化）

**新增文件:**
- `lib/translations.ts` - 翻译词条文件
- `lib/i18n.tsx` - i18n 上下文提供者
- `components/language-switcher.tsx` - 语言切换组件
- `app/providers.tsx` - 客户端 Providers 包装器

**修改文件:**
- `app/layout.tsx` - 添加 I18nProvider

---

#### 2. 会话文件大小显示 (Session File Size Display)
- 在会话列表中显示每个会话文件的大小
- 支持 B, KB, MB, GB 单位自动转换
- 帮助用户判断会话的长度和复杂度

**修改文件:**
- `lib/types.ts` - 添加 `fileSize?: number` 字段
- `lib/claude-history.ts` - 获取会话文件大小
- `app/sessions/page.tsx` - 显示文件大小

---

### 性能优化 Optimization

#### 3. 首页加载速度优化 (Dashboard Stats API Optimization)
**问题:** 每次加载首页时统计数据非常慢

**原因分析:**
- `loadSessionDetail` 被调用多次（100+ 次）
- 所有会话文件串行读取
- 项目目录重复搜索

**优化措施:**
- 添加内存缓存 `sessionDetailCache` 避免重复读取
- 添加项目目录缓存 `sessionProjectCache` 和 `buildProjectCache()`
- 使用 `Promise.all` 并行加载会话文件
- 限制并发数（20个）避免过多文件句柄

**修改文件:**
- `app/api/stats/route.ts`
- `lib/claude-history.ts`

---

#### 4. 会话详情页虚拟滚动 (Session Detail Virtual Scrolling)
**问题:** 长对话（数百条消息）时页面严重卡顿

**原因分析:**
- 一次性渲染所有消息到 DOM
- 滚动事件处理遍历所有消息 refs
- 侧边导航点计算所有消息位置

**优化措施:**
- 使用 `@tanstack/react-virtual` 实现虚拟滚动
- 只渲染可见区域的约 15 个消息节点
- 添加 `overscan: 5` 预渲染缓冲区
- 移除侧边导航点（改用浮动按钮）
- 滚动事件处理添加 100ms 防抖
- 工具统计只在加载时计算一次

**修改文件:**
- `app/sessions/[id]/page.tsx`

**新增依赖:**
- `@tanstack/react-virtual@3.10.9`

---

### Bug 修复 Bug Fix

#### 5. 返回按钮导航修复 (Back Button Navigation Fix)
**问题:** 从项目筛选页面进入会话详情后，点击返回会回到全部项目列表而不是筛选后的列表

**修复:**
- 将硬编码的 `/sessions` 链接改为 `router.back()`
- 使用浏览器原生历史记录，支持正确的导航返回

**修改文件:**
- `app/sessions/[id]/page.tsx`

---

## v1.0.0 (Initial Release)

初始版本，包含：
- Claude Code 对话历史查看
- 会话列表与筛选
- 会话详情查看
- 关键词搜索
- 会话导出（Markdown/JSON/HTML）
- 仪表盘统计
- 浅色/深色主题
