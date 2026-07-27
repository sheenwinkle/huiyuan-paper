import { SectionTitle } from "@/components/site/section-title";
import { factoryStrengths } from "@/lib/data/site-content";

export default function FactoryPage() {
  return (
    <main>
      <section className="bg-white py-14">
        <div className="section-shell">
          <SectionTitle
            eyebrow="工厂实力"
            title="江苏丹阳丹北镇的纸制品加工与供货能力"
            description="第一版不放虚假的设备图片，先用清晰的信息结构承接客户信任。等真实照片准备好后，替换为工厂、设备、仓储和出货场景。"
          />
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {factoryStrengths.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-black/10 bg-paper p-6 text-sm leading-7 text-graphite"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-shell py-14">
        <div className="rounded-lg border border-dashed border-black/20 bg-white p-8">
          <div className="text-sm font-semibold text-cinnabar">待补充素材</div>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            工厂照片、设备照片、产品实拍
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-graphite/75">
            后续建议拍摄门头、生产设备、原料、半成品、成品打包、装车发货等场景。
            这些照片会直接提升批发客户的信任度。
          </p>
        </div>
      </section>
    </main>
  );
}

