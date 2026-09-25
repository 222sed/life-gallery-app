# 人生画廊

人生画廊是一款情绪记录与艺术生成应用。用户先记录当下情绪与事件，再通过三轮虚拟分身对谈逐步辨认更准确的情绪，最终将这次体验转化为个人画作。

## 当前 MVP

- 已完成移动端交互原型和主要页面流程
- 已通过 Supabase Edge Function 接入智谱 AI
- 已完成情绪确认、单句追问和三轮渐进式对谈
- 已加入回复格式校验、繁忙重试、超时和错误反馈
- 已接入图像生成 API，支持用户确认画面情景、选择绘画工具并生成画作
- 生成画作可保存到人生画廊或日常速写间，刷新后仍会保留
- 当前采用浏览器本地存储，尚未进行账号级云端同步

## 评委快速体验

线上版本：[https://222sed.github.io/life-gallery-app/](https://222sed.github.io/life-gallery-app/)

建议体验流程：

1. 进入应用并完成分身塑形与简短偏好问答。
2. 点击底部中央的加号，选择情绪与强度并描述一件此刻想记录的事。
3. 通过三轮虚拟分身对谈逐步确认更准确的情绪。
4. 确认画面情景并选择绘画工具，等待 AI 生成画作。
5. 将画作挂入人生画廊或存入日常速写间，查看作品置顶与刷新保留效果。

AI 对谈和生图依赖网络服务，生成画作通常需要几十秒。登录页为 MVP 演示入口，不校验真实账户。

## 技术栈

React 18、TypeScript、Tailwind CSS v4、Motion、Vite 6、Supabase Edge Functions。

## 本地运行

需要 Node.js 20 或更高版本，并安装 pnpm。

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

## AI 服务

前端默认调用当前已部署的 Supabase Edge Function，因此本地启动后即可体验现有线上 AI 服务。

Edge Function 源码位于 `supabase/functions/server/index.tsx`。如需部署到新的 Supabase 项目，应在服务端 Secret 中配置 `ZHIPU_API_KEY`。密钥不会写入前端代码或提交到仓库。
