# 丹阳市丹北镇慧缘纸制品数字化官网

面向长三角纸制祭祀用品加工与销售场景的全栈项目。第一阶段目标是完成中文主站、AI 客服入口、询盘提交和管理后台雏形；后续迭代接入数据库、RAG 知识库、管理员权限、Docker 和云端部署。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- AI Provider 抽象，先支持规则客服，后续接 OpenAI、Gemini 或国产模型

## 本地运行

```bash
npm install
npm run db:generate
npm run dev
```

访问 `http://localhost:3000`。

## 本地数据库

第一阶段使用 PostgreSQL + Prisma。开发环境可以用 Docker 启动数据库：

```bash
docker compose up -d
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

默认后台账号来自 `.env`：

- 邮箱：`admin@example.com`
- 密码：`change-me`

上线前必须更换 `ADMIN_PASSWORD` 和 `AUTH_SECRET`。

## 生产部署草案

服务器上使用 Docker Compose：

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose --env-file .env.production -f docker-compose.prod.yml exec app node prisma/seed.js
```

健康检查：

```text
/api/health
```

## 当前阶段

- 中文主站首版
- 产品分类和企业优势展示
- 网页 AI 客服入口
- 询盘提交 API，支持 Prisma 入库
- 管理后台登录保护
- 后台询盘列表
- 后台产品分类和产品新增
- 后台产品编辑、上下架、删除
- 后台询盘状态流转
- 后台 AI 知识库管理
- AI 客服读取启用知识库后再回复
- 官网产品页数据库优先展示
- Prisma 数据模型

## AI 客服设计

当前默认使用 `AI_PROVIDER=rules`：规则客服 + 知识库检索。这样没有 API key 也能稳定运行，并且不会乱报价格。

后续接模型 API 时，只需要扩展 `lib/ai/support-agent.ts`，前端聊天窗口和后台知识库不需要重写。
