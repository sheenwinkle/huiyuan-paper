# 慧缘纸制品数字化官网

GitHub: https://github.com/sheenwinkle/huiyuan-paper

面向中国长三角纸制祭祀用品加工与销售场景的全栈数字化系统。项目以丹阳市丹北镇慧缘纸制品为真实业务背景，覆盖官网展示、客户询盘、管理员后台、产品管理、AI 客服知识库和部署工程化。

这个项目不是普通静态官网，而是一个小微制造业数字化样板：用软件把传统线下销售中的产品展示、客户咨询、人工跟进和资料沉淀连接起来。

## 项目亮点

- 真实业务场景：江苏丹阳纸制祭祀用品加工厂，主打抽泡纸，服务长三角批发和零售客户。
- 全栈闭环：首页、产品中心、询盘表单、后台登录、产品管理、询盘管理、AI 知识库。
- AI 应用落地：客服先基于知识库承接问题，再引导客户添加微信或留下联系方式，避免乱报价。
- 工程化完整：Next.js、TypeScript、Prisma、PostgreSQL、Docker、健康检查、部署说明、GitHub Actions。
- 作品集表达：体现“AI + 软件工程帮助下沉市场小微企业获得数字化红利”。

## 功能范围

### 官网

- 中文首页
- 产品中心
- 工厂实力
- 企业文化
- 在线咨询
- 悬浮 AI 客服

### 后台

- 管理员登录
- 运营总览
- 询盘列表
- 询盘状态流转
- 产品分类管理
- 产品新增、编辑、上下架、删除
- AI 知识库新增、编辑、启用、停用、删除

### AI 客服

- 默认使用 `AI_PROVIDER=rules`
- 支持知识库检索
- 可在没有付费 API key 的情况下演示
- 对价格、发货、账期、库存等高风险问题引导人工确认
- 后续可扩展 OpenAI、Gemini 或国产模型 Provider

## 技术栈

- Framework: Next.js App Router
- Language: TypeScript
- UI: Tailwind CSS
- Database: PostgreSQL
- ORM: Prisma
- Auth: HttpOnly Cookie + HMAC 签名 token
- AI: Rule-based provider + knowledge retrieval
- Deployment: Docker Compose / Cloudflare Pages 静态演示 / Sites 演示

## 本地运行

```powershell
npm.cmd install
docker compose up -d
npm.cmd run db:generate
npm.cmd run db:migrate -- --name init
npm.cmd run db:seed
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

访问：

```text
http://127.0.0.1:3000
```

后台：

```text
http://127.0.0.1:3000/admin/login
```

默认开发账号：

```text
admin@example.com
change-me
```

上线前必须更换 `ADMIN_PASSWORD` 和 `AUTH_SECRET`。

## 常用命令

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd exec prisma validate
npm.cmd run db:studio
```

## 环境变量

参考 `.env.example`：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/huiyuan_paper"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me"
AUTH_SECRET="change-this-long-random-secret-before-deploy"
AI_PROVIDER="rules"
DEMO_MODE="false"
OPENAI_API_KEY=""
GOOGLE_GENERATIVE_AI_API_KEY=""
```

## 部署路线

### 免费作品集演示

Cloudflare Pages 可以免费托管静态演示版，并提供 `*.pages.dev` 免费子域名。当前项目的 `npm run build` 会额外生成 `dist/`，用于静态演示部署。

### 真实业务上线

真实业务版本需要数据库和后台持久化，建议部署到云服务器：

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose --env-file .env.production -f docker-compose.prod.yml exec app node prisma/seed.js
```

如果使用中国大陆服务器和 `.cn` 域名，需要按法规完成备案。

## 文档

- [架构说明](docs/architecture.md)
- [部署说明](docs/deployment.md)
- [Cloudflare Pages 免费演示部署](docs/cloudflare-pages.md)
- [作品集包装](docs/portfolio.md)
- [上线检查清单](docs/production-checklist.md)

## 当前状态

- GitHub 仓库已发布
- 本地全栈代码可构建
- Sites 演示站已部署
- Docker 生产部署配置已准备
- GitHub Actions CI 已配置
- 真实域名和云服务器属于后续付费步骤

