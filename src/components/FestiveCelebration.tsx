import React, { useState } from "react";
import { StoreSettings } from "../types";
import { Sparkles, Copy, Check, X, Flame, Gift } from "lucide-react";

interface FestiveCelebrationProps {
  settings: StoreSettings;
  onExploreFestive?: () => void;
}

/**
 * Traditional Nepali Earthen Diya (दीयो) with animated golden flame
 */
export const FestiveDiyo: React.FC<{ size?: number; className?: string }> = ({
  size = 22,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
      title="दीयो (Diya)"
      role="img"
      aria-label="Festive Diya"
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="diyaTerracotta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="60%" stopColor="#9A3412" />
            <stop offset="100%" stopColor="#7C2D12" />
          </linearGradient>
          <radialGradient id="diyaFlameGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient flame glow pulse */}
        <circle cx="16" cy="11" r="10" fill="url(#diyaFlameGlow)" className="animate-pulse" />

        {/* Terracotta Diya Clay Bowl */}
        <path
          d="M5 19C5 25 10 27 16 27C22 27 27 25 27 19C25 18 20 18 16 18C12 18 7 18 5 19Z"
          fill="url(#diyaTerracotta)"
          stroke="#7C2D12"
          strokeWidth="1"
        />
        {/* Diya Rim highlight */}
        <ellipse cx="16" cy="19" rx="11" ry="3" fill="#EA580C" />
        <ellipse cx="16" cy="19.5" rx="8" ry="1.5" fill="#7C2D12" />

        {/* Animated Flame */}
        <path
          d="M16 6C17 9 19 11 19 14C19 16 17.5 17.5 16 17.5C14.5 17.5 13 16 13 14C13 11 15 9 16 6Z"
          fill="#F59E0B"
          className="animate-pulse"
        />
        {/* Inner bright wick tip */}
        <path
          d="M16 9C16.5 11 17.5 12 17.5 14C17.5 15 16.8 15.5 16 15.5C15.2 15.5 14.5 15 14.5 14C14.5 12 15.5 11 16 9Z"
          fill="#FEF08A"
        />
      </svg>
    </span>
  );
};

/**
 * Traditional Nepali Sayapatri (Marigold) Flower Motif (सयपत्री फूल)
 */
export const MarigoldFlower: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="5" fill="#D97706" />
      {/* Petals */}
      <circle cx="12" cy="4.5" r="3.2" fill="#F59E0B" opacity="0.95" />
      <circle cx="12" cy="19.5" r="3.2" fill="#F59E0B" opacity="0.95" />
      <circle cx="4.5" cy="12" r="3.2" fill="#F59E0B" opacity="0.95" />
      <circle cx="19.5" cy="12" r="3.2" fill="#F59E0B" opacity="0.95" />
      <circle cx="6.5" cy="6.5" r="3.2" fill="#FBBF24" opacity="0.9" />
      <circle cx="17.5" cy="6.5" r="3.2" fill="#FBBF24" opacity="0.9" />
      <circle cx="6.5" cy="17.5" r="3.2" fill="#FBBF24" opacity="0.9" />
      <circle cx="17.5" cy="17.5" r="3.2" fill="#FBBF24" opacity="0.9" />
      {/* Center pollen */}
      <circle cx="12" cy="12" r="2.5" fill="#B45309" />
    </svg>
  );
};

/**
 * Traditional Nepali Sayapatri Toran / Garland Garland Ribbon (सयपत्री माला)
 */
export const FestiveGarland: React.FC<{ settings: StoreSettings }> = ({ settings }) => {
  if (!settings.festiveMode || !settings.festiveShowGarland) return null;

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden bg-gradient-to-r from-[#701A28] via-[#B45309] to-[#701A28] py-1 border-b border-[#F59E0B]/30 select-none shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-around gap-2 text-xs opacity-95">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            {/* Traditional Mango Leaf (आम्रपल्लव) Accent */}
            <span className="w-2.5 h-1.5 rounded-full bg-[#15803D] transform -rotate-45 opacity-85 hidden sm:inline-block"></span>
            {/* Sayapatri Marigold Flower */}
            <MarigoldFlower size={15} />
            {/* Subtle Makhamali Purple or Diya interval */}
            {i % 3 === 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] opacity-80 hidden md:inline-block" title="मखमली"></span>
            )}
            {i % 4 === 2 && settings.festiveShowDiyas && (
              <FestiveDiyo size={14} className="hidden sm:inline-flex" />
            )}
            <span className="w-2.5 h-1.5 rounded-full bg-[#15803D] transform rotate-45 opacity-85 hidden sm:inline-block"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Dashain & Tihar Celebration Banner with 1-Click Code Copy
 */
export const FestiveTopOfferStrip: React.FC<{ settings: StoreSettings }> = ({
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!settings.festiveMode) return null;

  const promoCode = settings.festivePromoCode || "UTSAV15";
  const discountPercent = settings.festiveDiscountPercent || 15;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bg-gradient-to-r from-[#5B101E] via-[#7B1828] to-[#5B101E] text-[#FFF9F2] text-xs py-2 px-4 border-b border-[#F59E0B]/30 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Festive Blessings & Offer Title */}
        <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <FestiveDiyo size={18} />
          <span className="font-serif font-bold text-[#FDE68A] tracking-wide text-xs sm:text-sm">
            {settings.festiveTitle || "बडा दसैँ तथा शुभ दीपावली महा-उत्सव २०८३"}
          </span>
          <span className="hidden md:inline-block text-[#F59E0B]">•</span>
          <span className="text-[11px] sm:text-xs text-[#FDE68A]/90 font-medium">
            दसैँ-तिहार विशेष छुट: <strong>Flat {discountPercent}% OFF</strong> on luxury attires
          </span>
        </div>

        {/* Right: Interactive 1-Click Code Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyCode}
            id="btn-copy-festive-code"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 border border-[#F59E0B]/60 text-[#FDE68A] text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Click to copy festive promo code"
          >
            <Gift size={12} className="text-[#FBBF24]" />
            <span>Code: <strong>{promoCode}</strong></span>
            {copied ? (
              <span className="text-[#86EFAC] flex items-center gap-0.5">
                <Check size={12} /> Copied!
              </span>
            ) : (
              <Copy size={11} className="opacity-80" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Floating Nepali Cultural Greeting & Diya Widget (Bottom Left)
 */
export const FestiveFloatingBlessing: React.FC<{
  settings: StoreSettings;
  onExploreCatalog?: () => void;
}> = ({ settings, onExploreCatalog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!settings.festiveMode) return null;

  const promoCode = settings.festivePromoCode || "UTSAV15";
  const discountPercent = settings.festiveDiscountPercent || 15;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      {/* Floating Diya Trigger Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="btn-festive-blessing-float"
          aria-label="Dashain Tihar Festive Blessings & Offers"
          className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-[#701A28] via-[#881337] to-[#701A28] hover:from-[#58121E] hover:to-[#58121E] text-white rounded-full shadow-xl border border-[#F59E0B]/60 transition-all transform hover:scale-105 active:scale-95"
        >
          {/* Subtle Golden Glow aura */}
          <span className="absolute -inset-1 rounded-full bg-[#F59E0B]/25 blur-sm -z-10 group-hover:bg-[#F59E0B]/40 transition-colors" />
          <FestiveDiyo size={22} />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-[#FDE68A] leading-tight font-serif">
              शुभ दसैँ-तिहार!
            </span>
            <span className="text-[9px] text-[#F3F4F6] font-medium leading-none">
              Flat {discountPercent}% OFF Offer
            </span>
          </div>
        </button>
      </div>

      {/* Greeting Modal / Card */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full border-2 border-[#D97706]/40 shadow-2xl overflow-hidden relative">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#701A28] via-[#881337] to-[#701A28] p-5 text-white text-center relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-[#FDE68A]/80 hover:text-white p-1 rounded-full hover:bg-black/20 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex justify-center items-center gap-2 mb-2">
                <MarigoldFlower size={20} />
                <FestiveDiyo size={26} />
                <MarigoldFlower size={20} />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FDE68A] tracking-wide">
                शुभ विजया दशमी तथा दीपावली
              </h3>
              <p className="text-xs text-[#FDE68A]/90 mt-1 font-medium">
                हार्दिक मंगलमय शुभकामना | २०८३
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div className="text-xs text-[#4A443F] leading-relaxed space-y-2 text-center">
                <p className="font-medium text-[#701A28]">
                  बडा दसैँको रातो टीका र जमराको आशीर्वाद तथा तिहारको झिलिमिली बत्ती र सयपत्रीको सुगन्धले तपाईं र तपाईंको परिवारमा सुख, शान्ति र समृद्धि छाओस्।
                </p>
                <p className="text-[11px] text-[#786E65]">
                  Celebrate Nepali heritage in elegance with handcrafted silk sarees, zari anarkalis, and generational Himalayan pashminas tailored for your family gatherings and Bhai Tika.
                </p>
              </div>

              {/* Offer Card */}
              <div className="bg-white rounded-xl p-4 border border-[#F59E0B]/40 shadow-xs space-y-2.5 text-center">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                  <Sparkles size={12} className="text-[#F59E0B]" />
                  <span>Festive Celebration Promo</span>
                </div>

                <div className="text-2xl font-display font-extrabold text-[#701A28]">
                  FLAT {discountPercent}% OFF
                </div>

                <p className="text-[11px] text-[#5C544E]">
                  Applicable across the entire {settings.brandName} collection during checkout.
                </p>

                <div className="pt-1 flex items-center justify-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F5ECE1] border border-[#D97706]/50 rounded-lg text-xs font-mono font-bold text-[#701A28] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>{promoCode}</span>
                    {copied ? (
                      <span className="text-[#15803D] flex items-center gap-0.5 text-[11px]">
                        <Check size={13} /> Copied!
                      </span>
                    ) : (
                      <Copy size={13} className="text-[#B45309]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onExploreCatalog) onExploreCatalog();
                  }}
                  className="flex-1 py-3 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] text-center"
                >
                  Explore Festive Collection
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 bg-white hover:bg-[#F5ECE1] border border-[#D9D0C5] text-[#4A443F] text-xs font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
