# Architecture

项目架构说明维护在仓库外交付文档中：`outputs/huiyuan-paper-architecture.md`。后续稳定后会同步到本目录。

## 第二阶段补充

- 询盘提交通过 Prisma 写入 PostgreSQL。
- `/admin` 和 `/admin/inquiries` 需要管理员登录。
- 管理员登录使用 HttpOnly Cookie 和 HMAC 签名 token。
- 本地开发通过 `docker-compose.yml` 启动 PostgreSQL。
- `/admin/products` 支持新增产品分类和产品。
- 官网 `/products` 优先读取数据库产品资料，数据库不可用时回退静态分类。
- `/admin/products` 支持编辑、上下架和删除产品。
- `/admin/inquiries` 支持修改询盘状态。
- `/admin/knowledge` 支持维护 AI 客服知识库。
- `/api/chat` 通过 support agent provider 调用规则客服和知识库检索。
