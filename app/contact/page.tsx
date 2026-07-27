import { InquiryForm } from "@/components/site/inquiry-form";
import { SectionTitle } from "@/components/site/section-title";

export default function ContactPage() {
  return (
    <main className="section-shell grid gap-10 py-14 lg:grid-cols-[0.82fr_1.18fr]">
      <div>
        <SectionTitle
          eyebrow="在线咨询"
          title="留下产品和数量需求，方便人工销售继续跟进"
          description="AI 客服可以先了解大致需求，但具体价格、库存、运输和账期仍建议由人工确认。"
        />
        <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
          <div className="text-sm font-semibold text-cinnabar">工厂地址</div>
          <p className="mt-3 text-base leading-8 text-graphite">
            江苏省镇江市丹阳市丹北镇埤城镇
          </p>
          <div className="mt-6 text-sm font-semibold text-cinnabar">适合咨询</div>
          <p className="mt-3 text-base leading-8 text-graphite">
            抽泡纸批发、祭祀纸制品供货、区域零售补货、规格定制、长期合作。
          </p>
        </div>
      </div>
      <InquiryForm />
    </main>
  );
}

