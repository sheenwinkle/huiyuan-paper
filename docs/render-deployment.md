# Render 全栈演示部署

Render 可以在不购买域名的情况下部署全栈版本，并提供 `*.onrender.com` HTTPS 地址。

## 推荐定位

把 Render 作为“全栈在线 Demo 环境”：

- 跑真实 Next.js 服务端路由。
- 跑管理员后台。
- 连接 PostgreSQL。
- 支持 Prisma 迁移和 seed。
- 面试时比 GitHub Pages 静态演示更接近真实生产。

不要把免费 Render Postgres 当长期生产库。Render 免费数据库 1GB，30 天后过期；免费 Web Service 闲置 15 分钟会休眠，首次唤醒约 1 分钟。

## 仓库配置

仓库根目录已经提供 `render.yaml`：

- Web Service: `huiyuan-paper-web`
- Database: `huiyuan-paper-db`
- Region: `singapore`
- Plan: `free`
- Health Check: `/api/health`
- Build:

```bash
npm ci && npm run db:generate && npx prisma migrate deploy && node prisma/seed.js && npm run build
```

- Start:

```bash
npm run start -- -p $PORT
```

Render 免费 Web Service 不支持 pre-deploy command，所以迁移和 seed 先放在 build command 里。升级付费生产后，更推荐把 `npx prisma migrate deploy` 移到 pre-deploy command。

## 创建步骤

1. 登录 Render。
2. New -> Blueprint。
3. 选择 GitHub 仓库 `sheenwinkle/huiyuan-paper`。
4. Render 会读取 `render.yaml`。
5. 创建时填写：

```env
ADMIN_EMAIL=你的管理员邮箱
ADMIN_PASSWORD=强密码
GOOGLE_GENERATIVE_AI_API_KEY=你的 Google Gemini API Key
```

`AUTH_SECRET` 会由 Render 自动生成。`DATABASE_URL` 会引用 Render Postgres。`GOOGLE_GENERATIVE_AI_API_KEY` 不要提交到 GitHub，只在 Render 环境变量里填写。

如果暂时不填写 Google API key，线上聊天会自动回退到规则客服，不会影响网站使用。

## 更好的长期免费绕法

如果你想尽量免费、但不想 30 天后数据库被删除：

- Web Service 继续用 Render free。
- PostgreSQL 改用 Supabase Free 或其他长期免费 Postgres。
- 在 Render Web Service 里手动设置 `DATABASE_URL` 为外部数据库连接串。
- 不创建 Render Postgres，或者后续删除 `huiyuan-paper-db`。

Supabase Free 也有暂停限制，但数据不会像 Render Free Postgres 那样 30 天后自动过期。它更适合长期作品集 Demo；Render Postgres 更适合一键快速验证。

## 需要注意

- 免费服务会休眠，面试前先打开一次链接预热。
- 不要上传图片到 Render 本地文件系统，重启会丢；继续使用后台 `imageUrl`。
- 免费数据库没有备份，不接真实客户数据。
- 如果切到真实业务，建议迁移到付费数据库或自己的云服务器 PostgreSQL。
