# 人生画廊

人生画廊是一款情绪记录与艺术生成应用。用户先记录当下情绪与事件，再通过三轮虚拟分身对谈逐步辨认更准确的情绪，最终将这次体验转化为个人画作。

## 当前 MVP

- 已完成移动端交互原型和主要页面流程
- 已通过 Supabase Edge Function 接入智谱 AI
- 已完成情绪确认、单句追问和三轮渐进式对谈
- 已加入回复格式校验、繁忙重试、超时和错误反馈
- 画作生成目前为交互演示，尚未接入图像生成 API
- 情绪与画作目前未进行账号级持久化存储

## 技术栈

React 18、TypeScript、Tailwind CSS v4、Motion、Vite 6、Supabase Edge Functions。

## 本地运行

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

## AI 服务

Edge Function 位于 `supabase/functions/server/index.tsx`。智谱 API Key 通过 Supabase Secret `ZHIPU_API_KEY` 配置，不应写入前端代码或提交到仓库。
