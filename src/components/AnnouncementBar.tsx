import React, { useState } from "react";
import { Sparkles, PhoneCall, Gift, Check, Copy } from "lucide-react";
import { StoreSettings } from "../types";
import { FestiveDiyo, MarigoldFlower } from "./FestiveCelebration";

interface AnnouncementBarProps {
  settings: StoreSettings;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings }) => {
  const [codeCopied, setCodeCopied] = useState(false);

  const isFestive = settings.festiveMode;
  const promoCode = settings.festivePromoCode || "UTSAV15";
  const bannerContent = isFestive && settings.festiveBannerText
    ? settings.festiveBannerText
    : settings.announcement;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div
      className={`text-[11px] sm:text-xs py-2 px-4 border-b transition-colors relative z-30 ${
        isFestive
          ? "bg-gradient-to-r from-[#60121F] via-[#7B1828] to-[#60121F] text-[#FFF9F2] border-[#F59E0B]/40 shadow-xs"
          : "bg-[#701A28] text-[#FAF7F2] border-[#58121E]"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 font-medium tracking-wide flex-wrap">
          {isFestive ? (
            <>
              <FestiveDiyo size={16} />
              <MarigoldFlower size={14} className="hidden sm:inline-block" />
            </>
          ) : (
            <Sparkles size={13} className="text-[#F59E0B] shrink-0" />
          )}
          <span>{bannerContent}</span>

          {isFestive && (
            <button
              onClick={handleCopyCode}
              id="btn-announcement-copy-code"
              className="inline-flex items-center gap-1 ml-1.5 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/25 hover:bg-[#F59E0B]/35 border border-[#F59E0B]/50 text-[#FDE68A] text-[10px] font-bold transition-all cursor-pointer"
              title="Click to copy festive promo code"
            >
              <Gift size={10} className="text-[#FBBF24]" />
              <span>Use: {promoCode}</span>
              {codeCopied ? (
                <span className="text-[#86EFAC] flex items-center gap-0.5 text-[9px]">
                  <Check size={10} /> Copied
                </span>
              ) : (
                <Copy size={9} className="opacity-70" />
              )}
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 text-[#E6D7CC]">
          <span className="flex items-center gap-1">
            <PhoneCall size={12} className="text-[#F59E0B]" />
            Direct Line: <strong className="text-white">{settings.whatsappNumber}</strong>
          </span>
          <span className="text-[#8F4F5B]">•</span>
          <span>Verified eSewa / Khalti / Fonepay</span>
        </div>
      </div>
    </div>
  );
};

