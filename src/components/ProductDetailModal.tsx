import React, { useState } from "react";
import { Product, StoreSettings } from "../types";
import {
  X,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Check,
  Ruler,
  ShieldCheck,
  Truck,
  Sparkles,
  Gift,
} from "lucide-react";
import { FestiveDiyo } from "./FestiveCelebration";

interface ProductDetailModalProps {
  product: Product | null;
  whatsappNumber: string;
  brandName?: string;
  settings?: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onInstantBuy: (product: Product, size: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  whatsappNumber,
  brandName = "Dawosti",
  settings,
  onClose,
  onAddToCart,
  onInstantBuy,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0] || "Free Size"
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product?.images[0] || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  if (!product) return null;

  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const effectiveBrand = settings?.brandName || brandName;
  const isFestive = settings?.festiveMode && (settings?.festiveDiscountPercent || 0) > 0;
  const festiveDiscountPercent = settings?.festiveDiscountPercent || 0;
  const festivePrice = isFestive
    ? Math.round(product.priceNpr * (1 - festiveDiscountPercent / 100))
    : null;


  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const whatsappMessage = `Hello ${effectiveBrand}! 🌸
I would like to purchase the following bespoke piece:
• Product: ${product.name}
• Size: ${selectedSize}
• Quantity: ${quantity}
• Price: Rs. ${((festivePrice || product.priceNpr) * quantity).toLocaleString()}${
    isFestive ? ` (दसैँ-तिहार Offer ${festiveDiscountPercent}% OFF applied)` : ""
  }
• Fabric: ${product.fabric}

Please advise on payment via eSewa / Khalti / Fonepay and delivery timeframe. Thank you!`;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#E8E1D9] flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 text-[#4A443F] hover:text-[#701A28] bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#F4EFEA] flex flex-col justify-between p-4 sm:p-6">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner bg-white">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-[#701A28] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                New Season
              </span>
            )}
          </div>

          {/* Thumbnail list if multiple */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? "border-[#701A28] shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Order Controls */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header category */}
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#8C8278] font-semibold mb-1">
              <span>{product.category}</span>
              <span className="text-[#B45309] font-medium flex items-center gap-1">
                <Sparkles size={12} /> {product.fabric}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#262322] leading-snug">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex flex-wrap items-baseline gap-3 my-3">
              {festivePrice ? (
                <>
                  <span className="text-2xl font-bold text-[#701A28]">
                    Rs. {festivePrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#9E948A] line-through">
                    Rs. {product.priceNpr.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#92400E] bg-[#FEF3C7] border border-[#F59E0B]/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-serif">
                    <FestiveDiyo size={11} /> {festiveDiscountPercent}% दसैँ-तिहार Offer
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-[#701A28]">
                    Rs. {product.priceNpr.toLocaleString()}
                  </span>
                  {product.originalPriceNpr && (
                    <span className="text-sm text-[#9E948A] line-through">
                      Rs. {product.originalPriceNpr.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                    Inclusive of all taxes
                  </span>
                </>
              )}
            </div>


            <p className="text-sm text-[#5C544E] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A443F]">
                  Select Size
                </label>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#701A28] hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler size={13} /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === sz
                        ? "bg-[#701A28] text-white border-[#701A28] shadow-sm"
                        : "bg-white text-[#4A443F] border-[#D9D0C5] hover:border-[#701A28]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A443F]">
                Quantity
              </span>
              <div className="flex items-center border border-[#D9D0C5] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-[#4A443F] hover:bg-[#F4EFEA]"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#262322]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-[#4A443F] hover:bg-[#F4EFEA]"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#8C8278]">
                Total: <strong>Rs. {(product.priceNpr * quantity).toLocaleString()}</strong>
              </span>
            </div>

            {/* Highlights bullet points */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-5 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE8DF]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#701A28] mb-2 flex items-center gap-1">
                  <Check size={14} /> Craft & Details
                </div>
                <ul className="text-xs text-[#5C544E] space-y-1.5 list-disc list-inside">
                  {product.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Wash care */}
            {product.washCare && (
              <div className="text-[11px] text-[#786E65] mb-5">
                <strong>Care:</strong> {product.washCare}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-3 border-t border-[#E8E1D9]">
            <div className="flex gap-2">
              {/* Add to Cart */}
              <button
                id="btn-modal-add-cart"
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#FAF7F2] hover:bg-[#EFE8DF] text-[#701A28] border border-[#701A28] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
              >
                <ShoppingBag size={16} />
                {addedToast ? "Added to Bag! ✓" : "Add to Bag"}
              </button>

              {/* Instant Buy via QR / Gateway */}
              <button
                id="btn-modal-instant-pay"
                onClick={() => {
                  onInstantBuy(product, selectedSize, quantity);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-[#701A28] hover:bg-[#58121E] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors active:scale-[0.99]"
              >
                <CreditCard size={16} />
                Pay via QR (eSewa / Khalti)
              </button>
            </div>

            {/* Direct WhatsApp Ordering */}
            <a
              id="btn-modal-whatsapp-order"
              href={`https://wa.me/977${cleanPhone}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageCircle size={16} />
              Order Instantly via WhatsApp (+977 {whatsappNumber})
            </a>

            {/* Trust Badges */}
            <div className="flex items-center justify-between text-[11px] text-[#8C8278] pt-1">
              <span className="flex items-center gap-1">
                <Truck size={13} className="text-[#B45309]" /> All Nepal Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#15803D]" /> Verified Payment Proof
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-[#E8E1D9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D9]">
              <h3 className="font-serif text-lg font-bold text-[#701A28]">
                {effectiveBrand} Sizing Reference (Inches)
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-[#8C8278] hover:text-[#262322]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 text-xs text-[#5C544E]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E8E1D9] bg-[#FAF7F2]">
                    <th className="py-2 px-2.5 font-bold">Size</th>
                    <th className="py-2 px-2.5 font-bold">Bust</th>
                    <th className="py-2 px-2.5 font-bold">Waist</th>
                    <th className="py-2 px-2.5 font-bold">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE4]">
                  <tr>
                    <td className="py-2 px-2.5 font-bold text-[#701A28]">XS</td>
                    <td className="py-2 px-2.5">32"</td>
                    <td className="py-2 px-2.5">26"</td>
                    <td className="py-2 px-2.5">35"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-bold text-[#701A28]">S</td>
                    <td className="py-2 px-2.5">34"</td>
                    <td className="py-2 px-2.5">28"</td>
                    <td className="py-2 px-2.5">37"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-bold text-[#701A28]">M</td>
                    <td className="py-2 px-2.5">36"</td>
                    <td className="py-2 px-2.5">30"</td>
                    <td className="py-2 px-2.5">39"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-bold text-[#701A28]">L</td>
                    <td className="py-2 px-2.5">38"</td>
                    <td className="py-2 px-2.5">32"</td>
                    <td className="py-2 px-2.5">41"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-bold text-[#701A28]">XL</td>
                    <td className="py-2 px-2.5">40"</td>
                    <td className="py-2 px-2.5">34"</td>
                    <td className="py-2 px-2.5">43"</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 font-bold text-[#701A28]">Free Size</td>
                    <td className="py-2 px-2.5" colSpan={3}>
                      Fluid adaptable silhouette fitting sizes S to XL comfortably
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-[#8C8278]">
                * Need custom tailoring or length adjustments? Click "Order Instantly via WhatsApp" to speak with our master tailor.
              </p>
            </div>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="mt-4 w-full py-2 bg-[#701A28] text-white text-xs font-semibold rounded-lg"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
