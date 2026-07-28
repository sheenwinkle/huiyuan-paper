# 部署说明

本项目分三种部署方式：免费静态作品集演示、免费/低成本全栈演示和真实业务上线。

## 1. 免费作品集演示

适合目标：

- 面试展示
- 项目在线预览
- 不接真实客户数据
- 不需要真实数据库

构建命令：

```powershell
npm.cmd run build:sites-demo
```

该命令会完成两件事：

1. 构建完整 Next.js 全栈应用。
2. 生成 `dist/` 静态演示版本。

`dist/` 可以部署到支持静态站点的平台，例如 Cloudflare Pages。

## 2. Render 全栈演示

适合目标：

- 面试展示完整后台
- 验证真实 API 和数据库链路
- 不购买域名
- 不接真实客户数据

仓库根目录提供 `render.yaml`。在 Render 中选择 Blueprint 并连接 GitHub 仓库后，Render 会创建：

- `huiyuan-paper-web`
- `huiyuan-paper-db`

免费限制：

- Web Service 闲置会休眠。
- 免费 Postgres 30 天后过期。
- 本地文件系统是临时的，图片继续使用 `imageUrl`。

更详细步骤见 `docs/render-deployment.md`。

## 3. 真实业务部署

适合目标：

- 工厂真实官网
- 管理后台真实使用
- 保存真实询盘
- 管理真实产品资料

推荐架构：

- 云服务器：阿里云 ECS 或其他 Linux VPS
- Runtime：Docker Compose
- Database：PostgreSQL
- Reverse Proxy：Nginx 或 Caddy
- HTTPS：Cloudflare 或服务器侧证书

启动：

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

## 4. 必须更换的生产变量

```env
POSTGRES_PASSWORD=
ADMIN_EMAIL=
ADMIN_PASSWORD=
AUTH_SECRET=
AI_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=
GOOGLE_GEMINI_MODEL=gemini-2.5-flash-lite
DEMO_MODE=false
```

生产环境不要使用默认密码。

## 5. 域名说明

`.cn` 域名和中国大陆服务器通常需要备案。备案前可以先用平台分配的临时域名或海外演示域名展示项目。
