# 部署说明

本项目分两种部署方式：免费作品集演示和真实业务上线。

## 1. 免费作品集演示

适合目标：

- 面试展示
- 项目在线预览
- 不接真实客户数据
- 不需要真实数据库

构建命令：

```powershell
npm.cmd run build
```

该命令会完成两件事：

1. 构建完整 Next.js 全栈应用。
2. 生成 `dist/` 静态演示版本。

`dist/` 可以部署到支持静态站点的平台，例如 Cloudflare Pages。

## 2. 真实业务部署

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

## 3. 必须更换的生产变量

```env
POSTGRES_PASSWORD=
ADMIN_EMAIL=
ADMIN_PASSWORD=
AUTH_SECRET=
DEMO_MODE=false
```

生产环境不要使用默认密码。

## 4. 域名说明

`.cn` 域名和中国大陆服务器通常需要备案。备案前可以先用平台分配的临时域名或海外演示域名展示项目。

