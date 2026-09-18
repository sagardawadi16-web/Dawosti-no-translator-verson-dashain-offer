import React from "react";
import { StoreSettings } from "../types";
import {
  MessageCircle,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Heart,
  Lock,
} from "lucide-react";

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, "");

  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2] border-t border-[#2E2926] mt-20">
      {/* Upper features bar */}
      <div className="border-b border-[#2E2926] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E2926] flex items-center justify-center text-[#F59E0B]">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                All Nepal Delivery
              </h4>
              <p className="text-[11px] text-[#A89F95]">
                Express delivery inside Kathmandu Valley & nationwide dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E2926] flex items-center justify-center text-[#15803D]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Verified Payment Gateways
              </h4>
              <p className="text-[11px] text-[#A89F95]">
                Instant QR payment via eSewa, Khalti & Fonepay mobile banking.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E2926] flex items-center justify-center text-[#25D366]">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                WhatsApp Personal Stylist
              </h4>
              <p className="text-[11px] text-[#A89F95]">
                Direct assistance & custom fittings on +977 {settings.whatsappNumber}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-bold tracking-wider text-white uppercase">
                {settings.brandName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></span>
            </div>
            <p className="text-xs text-[#A89F95] leading-relaxed">
              {settings.brandStory ||
                "Bespoke and contemporary women's fashion in Nepal. Handcrafted kurtas, artisanal silk co-ords, pure organza sarees, and generational Himalayan pashminas."}
            </p>
            <div className="pt-1">
              <span className="text-[10px] text-[#786E65] uppercase tracking-widest font-semibold">
                Authentic Craftsmanship Guaranteed
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D1C7BD]">
              Collections
            </h4>
            <ul className="text-xs text-[#A89F95] space-y-2">
              <li>Festive Velvet & Zari Anarkalis</li>
              <li>Mulberry Silk Co-ord Sets</li>
              <li>Pure Organza Embroidered Sarees</li>
              <li>Handspun Kashmiri Pashmina Shawls</li>
              <li>Contemporary Minimalist Dresses</li>
            </ul>
          </div>

          {/* Payment Gateways accepted */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D1C7BD]">
              Supported Gateways
            </h4>
            <p className="text-xs text-[#A89F95]">
              Scan and pay with your preferred digital wallet or mobile banking:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-[#2E2926] text-[#4ADE80] rounded text-[11px] font-bold">
                eSewa QR
              </span>
              <span className="px-2.5 py-1 bg-[#2E2926] text-[#C084FC] rounded text-[11px] font-bold">
                Khalti Wallet
              </span>
              <span className="px-2.5 py-1 bg-[#2E2926] text-[#F87171] rounded text-[11px] font-bold">
                Fonepay QR
              </span>
              <span className="px-2.5 py-1 bg-[#2E2926] text-[#38BDF8] rounded text-[11px] font-bold">
                Mobile Banking
              </span>
            </div>
          </div>

          {/* Contact & Atelier */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D1C7BD]">
              Atelier & Contact
            </h4>
            <div className="text-xs text-[#A89F95] space-y-2">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-[#B45309] shrink-0" />
                <span>{settings.storeAddress || "Baluwatar & Jhamsikhel, Kathmandu"}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#B45309] shrink-0" />
                <span>+977 {settings.whatsappNumber}</span>
              </p>
              {settings.supportEmail && (
                <p className="text-xs text-[#A89F95]">
                  Email: <a href={`mailto:${settings.supportEmail}`} className="text-[#D1C7BD] hover:underline">{settings.supportEmail}</a>
                </p>
              )}
              {settings.instagramHandle && (
                <p className="text-xs text-[#A89F95]">
                  Instagram: <span className="text-[#D1C7BD]">{settings.instagramHandle}</span>
                </p>
              )}
              <a
                href={`https://wa.me/977${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#4ADE80] hover:underline pt-1"
              >
                <MessageCircle size={14} />
                <span>Direct WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & admin toggle */}
        <div className="mt-10 pt-6 border-t border-[#2E2926] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#786E65]">
          <div>
            © {new Date().getFullYear()} {settings.brandName} Atelier. {settings.copyrightText || "All rights reserved. Made for Nepal."}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-[#A89F95] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Lock size={12} />
              <span>Admin Logistics Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
