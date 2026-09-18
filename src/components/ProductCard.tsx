import React from "react";
import { Product } from "../types";
import { Eye, ShoppingBag, MessageCircle, Sparkles } from "lucide-react";
import { FestiveDiyo } from "./FestiveCelebration";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  brandName?: string;
  festiveMode?: boolean;
  festiveDiscountPercent?: number;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappNumber,
  brandName = "Store",
  festiveMode = false,
  festiveDiscountPercent = 0,
  onSelect,
  onQuickAdd,
}) => {
  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const defaultSize = product.sizes[0] || "Free Size";

  const effectiveFestivePrice =
    festiveMode && festiveDiscountPercent > 0
      ? Math.round(product.priceNpr * (1 - festiveDiscountPercent / 100))
      : null;

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${
        festiveMode ? "hover:border-[#D97706]/60 border-[#E8E1D9]" : "hover:border-[#D1C7BD] border-[#E8E1D9]"
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#F4EFEA] overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {festiveMode && (
            <span className="bg-gradient-to-r from-[#701A28] to-[#991B1B] text-[#FDE68A] text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-[#F59E0B]/40 font-serif">
              <FestiveDiyo size={10} /> दसैँ-तिहार Offer
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#701A28] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
              New In
            </span>
          )}
          {product.featured && (
            <span className="bg-[#B45309] text-white text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles size={10} /> Exclusive
            </span>
          )}
        </div>

        {/* Stock status overlay if out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-[#701A28] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              Sold Out / Made to Order
            </span>
          </div>
        )}

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 bg-white/95 text-[#262322] hover:bg-white text-xs font-semibold py-2.5 px-3 rounded-lg shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors"
          >
            <Eye size={14} /> Quick View
          </button>
          {product.inStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product, defaultSize);
              }}
              className="bg-[#701A28] hover:bg-[#58121E] text-white p-2.5 rounded-lg shadow-md transition-colors"
              title={`Quick add ${defaultSize} to bag`}
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8C8278] uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span className="font-medium text-[#701A28]">{product.fabric}</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-lg font-bold text-[#262322] group-hover:text-[#701A28] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#6B6158] line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Sizes preview */}
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            <span className="text-[10px] text-[#8C8278] uppercase mr-1">Sizes:</span>
            {product.sizes.map((sz) => (
              <span
                key={sz}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-[#E8E1D9] text-[#5C544E] bg-[#FAF7F2]"
              >
                {sz}
              </span>
            ))}
          </div>

          {/* Pricing & Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE4]">
            <div>
              <div className="text-[11px] text-[#8C8278]">
                {effectiveFestivePrice ? "Festive Offer Price" : "Price (NPR)"}
              </div>
              <div className="flex items-baseline gap-1.5">
                {effectiveFestivePrice ? (
                  <>
                    <span className="text-base font-bold text-[#701A28]">
                      Rs. {effectiveFestivePrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#9E948A] line-through">
                      Rs. {product.priceNpr.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-bold text-[#701A28]">
                      Rs. {product.priceNpr.toLocaleString()}
                    </span>
                    {product.originalPriceNpr && (
                      <span className="text-xs text-[#9E948A] line-through">
                        Rs. {product.originalPriceNpr.toLocaleString()}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* WhatsApp direct order inquiry */}
              <a
                href={`https://wa.me/977${cleanPhone}?text=${encodeURIComponent(
                  `Hi ${brandName}! I'm interested in ordering "${product.name}" (Rs. ${(
                    effectiveFestivePrice || product.priceNpr
                  ).toLocaleString()}). Could you please share availability in my size?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-[#128C7E] hover:bg-[#25D366]/15 rounded-lg transition-colors border border-[#25D366]/30"
                title="Direct WhatsApp Order"
              >
                <MessageCircle size={16} />
              </a>

              {/* View / Buy */}
              <button
                onClick={() => onSelect(product)}
                className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#701A28] text-[#701A28] hover:text-white border border-[#D9D0C5] hover:border-[#701A28] text-xs font-semibold rounded-lg transition-all"
              >
                Select Size
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

