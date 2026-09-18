import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppFloatProps {
  whatsappNumber: string;
  brandName: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({
  whatsappNumber,
  brandName,
}) => {
  const cleanPhone = whatsappNumber.replace(/\D/g, "");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center group">
      <a
        id="btn-whatsapp-floating"
        href={`https://wa.me/977${cleanPhone}?text=${encodeURIComponent(
          `Hello ${brandName}! 🌸 I would like to inquire about sizing, custom tailoring, and placing an order.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#1EBE5D] transition-transform hover:scale-110 active:scale-95"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#DC2626] rounded-full border-2 border-white animate-pulse" />
      </a>

      {/* Tooltip on hover */}
      <div className="mr-3 hidden sm:group-hover:block bg-[#262322] text-white text-[11px] font-medium py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn">
        Chat with {brandName} Stylist (+977 {whatsappNumber})
      </div>
    </div>
  );
};
