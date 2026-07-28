# 免费/低成本绕开方案

本项目先把能免费完成的工程闭环做完，外部付费或账号依赖统一放到上线前处理。

## 域名和展示

- 现在使用 GitHub Pages 免费地址展示作品集。
- 买 `.cn` 或 `.au` 域名后，再绑定到 GitHub Pages、Cloudflare Pages 或真实服务器。
- 中国大陆服务器加 `.cn` 正式经营通常需要备案，备案前可先用 GitHub Pages 或海外演示地址。

## 产品图片

- 第一版后台使用 `imageUrl` 字段，不做文件上传。
- 照片拍好后，可以先放到 GitHub、Cloudflare R2、阿里云 OSS、1688 图库或其他稳定图床，再把链接填入后台。
- 生产阶段如果需要批量上传，再接对象存储，避免把图片长期存服务器本地磁盘。

## AI 客服

- 当前支持 `AI_PROVIDER=google` 接入 Google Gemini；未配置 key 或调用失败时自动回退到规则客服。
- 知识库回答只承接基础问题，价格、发货、账期、库存统一转人工。
- 后续可以继续新增 OpenAI 或国产模型 provider，保留同一套客服入口。

## 1688 询盘

- 第一版先放 1688 店铺链接、微信二维码和人工引导。
- 如果 1688 没开放接口，就把网站询盘作为主线索池，1688 作为外部获客入口。
- 如果后续拿到开放平台能力，再做询盘同步或商品资料同步。

## 生产部署

- 作品集演示：GitHub Pages CD，免费。
- 全栈演示：Render Web Service，使用 `*.onrender.com`，不需要买域名。
- 更稳的长期免费数据：Render Web Service + Supabase Free PostgreSQL，避免 Render Free Postgres 30 天过期。
- 真实业务：Docker + PostgreSQL + HTTPS，等域名、服务器和备案准备好再上线。
- 数据库迁移文件已提交，生产环境可以执行 `prisma migrate deploy`。
