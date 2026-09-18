import React, { useState } from "react";
import { CartItem, StoreSettings } from "../types";
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, ShieldCheck, Gift, Check, Tag } from "lucide-react";
import { FestiveDiyo } from "./FestiveCelebration";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToPayment: () => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToPayment,
  settings,
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<boolean>(true); // Auto-apply festive promo if festiveMode is ON

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceNpr * item.quantity,
    0
  );

  const isFestiveActive = settings.festiveMode && settings.festiveDiscountPercent > 0;
  const isDiscountActive = isFestiveActive && promoApplied;
  const festiveDiscountAmount = isDiscountActive
    ? Math.round((subtotal * settings.festiveDiscountPercent) / 100)
    : 0;

  const discountedSubtotal = subtotal - festiveDiscountAmount;
  const isFreeShipping = discountedSubtotal >= settings.freeShippingThreshold;
  const deliveryFee = items.length === 0 ? 0 : isFreeShipping ? 0 : settings.standardDeliveryFee;
  const grandTotal = discountedSubtotal + deliveryFee;

  const freeShippingDifference = Math.max(0, settings.freeShippingThreshold - discountedSubtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((discountedSubtotal / settings.freeShippingThreshold) * 100)
  );

  const cleanPhone = settings.whatsappNumber.replace(/\D/g, "");

  const bagSummaryText = items
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.product.name} (Size: ${it.selectedSize}) x${it.quantity} = Rs. ${(
          it.product.priceNpr * it.quantity
        ).toLocaleString()}`
    )
    .join("\n");

  const whatsappCheckoutMsg = `Hello ${settings.brandName}! 🌸
I would like to place an order for the following items in my bag:
${bagSummaryText}

Subtotal: Rs. ${subtotal.toLocaleString()}${
    isDiscountActive
      ? `\n🎁 Festive Offer (${settings.festivePromoCode || "UTSAV15"}, ${settings.festiveDiscountPercent}% OFF): -Rs. ${festiveDiscountAmount.toLocaleString()}`
      : ""
  }
Delivery Fee: ${isFreeShipping ? "FREE" : `Rs. ${deliveryFee}`}
Grand Total: Rs. ${grandTotal.toLocaleString()}

Please confirm availability and send payment QR details.`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#E8E1D9]">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#E8E1D9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#701A28]" />
              <h2 className="font-serif text-xl font-bold text-[#262322]">
                Your Shopping Bag
              </h2>
              <span className="text-xs bg-[#EFE8DF] text-[#701A28] px-2 py-0.5 rounded-full font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#786E65] hover:text-[#701A28] rounded-full hover:bg-[#FAF7F2]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="bg-[#FAF7F2] px-5 py-3 border-b border-[#E8E1D9]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#5C544E]">
                  {isFreeShipping ? (
                    <span className="text-[#15803D] font-bold">
                      🎉 You unlocked FREE Express Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong>Rs. {freeShippingDifference.toLocaleString()}</strong> more for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#701A28]">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="w-full bg-[#E8E1D9] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#701A28] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#EFE8DF] flex items-center justify-center text-[#701A28] mb-3">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#262322] mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#786E65] max-w-xs mb-5">
                  Explore Dawosti's bespoke luxury ethnic wear and contemporary apparel to begin your journey.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#701A28] text-white text-xs font-semibold rounded-xl hover:bg-[#58121E]"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] flex gap-3 shadow-sm"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-24 object-cover object-top rounded-lg shrink-0 bg-[#F4EFEA]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#262322] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#9E948A] hover:text-[#DC2626] p-1"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#786E65] mt-0.5">
                        Size: <strong className="text-[#262322]">{item.selectedSize}</strong> • {item.product.fabric}
                      </div>
                      <div className="text-xs font-bold text-[#701A28] mt-1">
                        Rs. {item.product.priceNpr.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFEA]">
                      <div className="flex items-center border border-[#D9D0C5] rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#4A443F] hover:bg-[#F4EFEA]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#262322]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#4A443F] hover:bg-[#F4EFEA]"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-bold text-[#262322]">
                        Rs. {(item.product.priceNpr * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8E1D9] space-y-3">
              {/* Festive Promo Box */}
              {isFestiveActive && (
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F59E0B]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#701A28]">
                      <FestiveDiyo size={13} />
                      <span>दसैँ-तिहार {settings.festiveDiscountPercent}% छुट Coupon</span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#701A28] text-[#FDE68A] px-2 py-0.5 rounded font-bold">
                      {settings.festivePromoCode || "UTSAV15"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={settings.festivePromoCode || "Enter promo code"}
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[#D9D0C5] bg-white uppercase font-mono tracking-wider focus:outline-none focus:border-[#701A28]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const targetCode = (settings.festivePromoCode || "UTSAV15").toUpperCase();
                        if (promoInput.trim() === targetCode || promoInput.trim() === "") {
                          setPromoApplied(true);
                        } else {
                          alert(`Invalid coupon code. Try using ${targetCode}`);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
              )}

              {/* Cost summary */}
              <div className="space-y-1.5 text-xs text-[#5C544E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#262322]">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {isDiscountActive && (
                  <div className="flex justify-between text-[#15803D] font-medium">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      Festive Discount ({settings.festiveDiscountPercent}%)
                    </span>
                    <span>-Rs. {festiveDiscountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery (Nepal)</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#15803D]">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#701A28] pt-2 border-t border-[#E8E1D9]">
                  <span>Total Payable</span>
                  <span className="text-base">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>


              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="btn-cart-proceed-checkout"
                  onClick={() => {
                    onProceedToPayment();
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Payment Gateway</span>
                  <ArrowRight size={15} />
                </button>

                <a
                  id="btn-cart-whatsapp-order"
                  href={`https://wa.me/977${cleanPhone}?text=${encodeURIComponent(
                    whatsappCheckoutMsg
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>Instant Order on WhatsApp (+977 {settings.whatsappNumber})</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C8278] pt-1">
                <ShieldCheck size={13} className="text-[#15803D]" />
                <span>eSewa • Khalti • Fonepay QR • Secure Proof Verification</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
