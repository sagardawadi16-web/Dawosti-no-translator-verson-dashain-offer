import React, { useState } from "react";
import { StoreSettings } from "../types";
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Gift, Check, Copy } from "lucide-react";
import { FestiveDiyo, MarigoldFlower } from "./FestiveCelebration";

interface HeroSectionProps {
  settings: StoreSettings;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExploreClick,
}) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, "");
  const isFestive = settings.festiveMode;
  const promoCode = settings.festivePromoCode || "UTSAV15";
  const discountPercent = settings.festiveDiscountPercent || 15;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <section className={`relative overflow-hidden border-b transition-colors py-12 sm:py-20 ${
      isFestive
        ? "bg-gradient-to-b from-[#FDF8F3] via-[#FAF7F2] to-[#FBF6EE] border-[#F59E0B]/30"
        : "bg-[#FAF7F2] border-[#E8E1D9]"
    }`}>
      {/* Subtle decorative background accents with golden-crimson festive tone */}
      <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors ${
        isFestive ? "bg-[#F59E0B]/15" : "bg-[#EFE8DF]/60"
      }`} />
      <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors ${
        isFestive ? "bg-[#991B1B]/10" : "bg-[#701A28]/5"
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {isFestive ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FFF5EB] to-[#FFFBF5] border border-[#F59E0B]/60 shadow-xs text-xs font-bold text-[#881337]">
                <FestiveDiyo size={15} />
                <span className="font-serif tracking-wide text-[11px] sm:text-xs">
                  {settings.festiveTitle || "बडा दसैँ तथा शुभ दीपावली महा-उत्सव २०८३"}
                </span>
                <span className="bg-[#701A28] text-[#FDE68A] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                  {discountPercent}% OFF
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D9D0C5] shadow-xs text-xs font-semibold text-[#701A28]">
                <Sparkles size={13} className="text-[#B45309]" />
                <span className="uppercase tracking-widest text-[11px]">
                  {settings.heroBadge || "Spring & Festive Couture 2026"}
                </span>
              </div>
            )}

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-[#262322] tracking-tight leading-[1.08]">
              {settings.heroTitle || "Elegance woven into every thread."}
            </h1>

            <p className="text-sm sm:text-base text-[#5C544E] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {isFestive && settings.festiveSubtitle ? (
                <span>{settings.festiveSubtitle}</span>
              ) : settings.heroSubtitle ? (
                <span>{settings.heroSubtitle}</span>
              ) : (
                <>
                  Welcome to <strong className="text-[#701A28]">{settings.brandName}</strong>. Designed for the modern woman who cherishes artisanal heritage, regal silks, and contemporary silhouettes. Instant QR payment via eSewa, Khalti, and Fonepay with personalized WhatsApp verification.
                </>
              )}
            </p>

            {/* Festive Coupon Promo Box if Festive Mode is ON */}
            {isFestive && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-[#F59E0B]/40 shadow-xs max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center shrink-0">
                    <Gift size={18} className="text-[#B45309]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#262322] flex items-center gap-1.5">
                      <span>दसैँ-तिहार उत्सव Promo Offer</span>
                      <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-bold">
                        Save {discountPercent}%
                      </span>
                    </div>
                    <div className="text-[11px] text-[#786E65]">
                      Use code at checkout or scan to pay with instant savings
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full sm:w-auto px-4 py-1.5 bg-[#FAF7F2] hover:bg-[#F5ECE1] border border-[#D97706]/40 rounded-xl text-xs font-mono font-bold text-[#701A28] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Click to copy coupon code"
                >
                  <span>{promoCode}</span>
                  {codeCopied ? (
                    <span className="text-[#15803D] flex items-center gap-0.5 text-[10px]">
                      <Check size={12} /> Copied!
                    </span>
                  ) : (
                    <Copy size={12} className="text-[#B45309]" />
                  )}
                </button>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="btn-hero-explore"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>{isFestive ? "Explore Festive Attires" : "Browse Catalog"}</span>
                <ArrowRight size={16} />
              </button>

              <a
                id="btn-hero-whatsapp"
                href={`https://wa.me/977${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${settings.brandName}! 🌸 I'm visiting your online boutique during Dashain & Tihar and would love to consult with a stylist.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#128C7E] border border-[#25D366]/40 text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={17} className="text-[#25D366]" />
                <span>WhatsApp: +977 {settings.whatsappNumber}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#786E65]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#15803D]" />
                <span>Verified eSewa & Khalti Merchant</span>
              </div>
              <span>•</span>
              <div>Fonepay QR Compatible</div>
              <span>•</span>
              <div>Nationwide Express Logistics</div>
            </div>
          </div>

          {/* Right Visual Bento */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#E8E1D9] relative group">
                <img
                  src={
                    settings.heroImage1 ||
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={`${settings.brandName} ${settings.heroImage1Caption || "Velvet & Hand-Zari"}`}
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-medium flex items-center justify-between">
                  <span>{settings.heroImage1Caption || "Velvet & Hand-Zari"}</span>
                  {isFestive && <MarigoldFlower size={14} className="text-[#FBBF24]" />}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E1D9] shadow-xs text-center">
                <div className="text-base font-bold text-[#701A28] flex items-center justify-center gap-1">
                  {isFestive && <FestiveDiyo size={15} />}
                  <span>{settings.heroStat1Title || "100% Artisanal"}</span>
                </div>
                <div className="text-[10px] text-[#786E65] uppercase">
                  {settings.heroStat1Subtitle || "Master Tailored"}
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
              <div className="p-3.5 rounded-xl bg-[#701A28] text-white shadow-md text-center border border-[#F59E0B]/30">
                <div className="text-sm font-bold flex items-center justify-center gap-1 text-[#FDE68A]">
                  <span>{settings.heroStat2Title || "Direct QR Gateway"}</span>
                </div>
                <div className="text-[10px] text-[#FAF7F2]/80 uppercase">
                  {settings.heroStat2Subtitle || "No Hidden Surcharges"}
                </div>
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#E8E1D9] relative group">
                <img
                  src={
                    settings.heroImage2 ||
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={`${settings.brandName} ${settings.heroImage2Caption || "Mulberry Silk Co-ord"}`}
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-medium flex items-center justify-between">
                  <span>{settings.heroImage2Caption || "Mulberry Silk Co-ord"}</span>
                  {isFestive && <MarigoldFlower size={14} className="text-[#FBBF24]" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

