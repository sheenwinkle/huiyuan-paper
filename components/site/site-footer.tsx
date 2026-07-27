export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#1f211f] text-white">
      <div className="section-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="text-lg font-semibold">慧缘纸制品</div>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
            扎根江苏丹阳丹北镇，面向长三角批发与零售客户，提供抽泡纸、黄纸、
            元宝纸、锡箔纸、纸扎、竹浆纸、板纸及定制加工服务。
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">地址</div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            江苏省镇江市丹阳市丹北镇埤城镇
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">业务范围</div>
          <p className="mt-3 text-sm leading-7 text-white/70">
            长三角批发、零售供货、定制加工、长期合作。
          </p>
        </div>
      </div>
    </footer>
  );
}

