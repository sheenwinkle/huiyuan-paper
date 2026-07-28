# Cloudflare Pages 免费演示部署

Cloudflare Pages 适合部署本项目的静态作品集演示版。它不适合直接承载真实数据库后台，真实业务版本应使用 Docker + PostgreSQL 部署。

## 免费能力

Cloudflare Pages 免费计划支持：

- Git 仓库触发构建
- `*.pages.dev` 免费子域名
- 自定义域名绑定
- 每月一定数量构建额度

注意：Cloudflare 提供免费托管和免费 `pages.dev` 子域名，但正式域名注册不是免费的。

## 推荐设置

在 Cloudflare Pages 新建项目时选择 GitHub 仓库。

构建设置：

```text
Framework preset: None
Build command: npm run build:sites-demo
Build output directory: dist
Root directory: /
```

环境变量：

```env
DEMO_MODE=true
AI_PROVIDER=rules
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/huiyuan_paper_demo
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
AUTH_SECRET=demo-only-secret
```

这些变量只用于构建阶段通过框架校验；静态演示版不会连接数据库。

## 部署后验证

访问：

```text
https://your-project.pages.dev
```

检查：

- 首页能打开
- 产品中心能显示
- 询盘表单能在演示环境保存到浏览器本地
- 后台演示能登录
- AI 客服能回复

默认演示账号：

```text
admin@example.com
change-me
```

## 自定义域名

有正式域名后，在 Cloudflare Pages 项目中添加 Custom domain。对于根域名，需要把域名接入 Cloudflare DNS；对于子域名，可以配置 CNAME 到 `*.pages.dev`。
