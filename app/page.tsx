import Link from "next/link";
import { ProductGrid } from "@/components/site/product-grid";
import { SectionTitle } from "@/components/site/section-title";
import { cultureValues, factoryStrengths } from "@/lib/data/site-content";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-black/10 bg-[linear-gradient(120deg,#f7f3ea_0%,#fff_48%,#ead9b8_100%)]">
        <div className="section-shell grid min-h-[calc(100vh-64px)] items-center gap-10 py-14 md:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="inline-flex rounded-md border border-cinnabar/20 bg-white/70 px-3 py-1 text-sm font-medium text-cinnabar">
              江苏丹阳 · 三代世家造纸 · 长三角供货
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-ink md:text-6xl">
              慧缘纸制品
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-graphite/80">
              主营抽泡纸，覆盖黄纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸和定制加工。
              以传统信誉承接批发与零售需求，用数字化工具提升咨询、跟进和管理效率。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-[#87291f]"
              >
                发起询盘
              </Link>
              <Link
                href="/products"
                className="focus-ring rounded-md border border-black/15 bg-white px-5 py-3 text-center text-sm font-semibold text-ink transition hover:bg-black/5"
              >
                查看产品
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
            <div className="grid gap-3">
              {[
                ["主打产品", "抽泡纸"],
                ["客户类型", "批发商、零售商"],
                ["服务区域", "长三角"],
                ["经营特点", "传承、稳定、可定制"]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md bg-paper px-4 py-4"
                >
                  <span className="text-sm text-graphite/70">{label}</span>
                  <span className="font-semibold text-ink">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-md bg-[#20231f] p-5 text-white">
              <div className="text-sm text-white/60">AI 客服第一阶段</div>
              <p className="mt-2 text-xl font-semibold">先承接，后转人工</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                客服会先了解产品、数量和地区，再引导客户添加微信或提交询盘，
                重要报价与供货细节由人工确认。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <SectionTitle
          eyebrow="产品中心"
          title="围绕祭祀纸制品加工与批发的完整品类"
          description="第一版先展示核心分类，后续产品照片、设备照片和具体规格会接入后台管理。"
        />
        <div className="mt-9">
          <ProductGrid />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="工厂实力"
            title="传统纸品加工经验，配合现代销售管理"
            description="慧缘纸制品的第一阶段官网重点不夸大产能数字，而是先把长期经营、品类能力和客户跟进体系讲清楚。"
          />
          <div className="grid gap-3">
            {factoryStrengths.map((item) => (
              <div
                key={item}
                className="rounded-md border border-black/10 bg-paper px-5 py-4 text-sm leading-7 text-graphite"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <SectionTitle
          eyebrow="企业文化"
          title="传统行业也需要可持续的数字化能力"
          description="这个系统的价值不是做一个漂亮页面，而是把客户咨询、产品介绍、人工跟进和后台管理连成闭环。"
        />
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {cultureValues.map((value) => (
            <article
              key={value.title}
              className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-ink">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-graphite/75">
                {value.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

