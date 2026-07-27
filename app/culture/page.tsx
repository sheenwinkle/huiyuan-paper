import { SectionTitle } from "@/components/site/section-title";
import { cultureValues } from "@/lib/data/site-content";

export default function CulturePage() {
  return (
    <main className="section-shell py-14">
      <SectionTitle
        eyebrow="企业文化"
        title="三代世家造纸，把传统生意做得更清楚"
        description="祭祀纸制品行业重视信任、稳定和长期合作。慧缘纸制品的数字化建设，会围绕客户咨询、产品资料、人工跟进和后台管理逐步升级。"
      />
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {cultureValues.map((value) => (
          <article
            key={value.title}
            className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-ink">{value.title}</h2>
            <p className="mt-3 text-sm leading-7 text-graphite/75">{value.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

