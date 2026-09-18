import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Lock,
  MessageCircle,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { StoreSettings, ProductCategory } from "../types";
import { FestiveGarland, FestiveDiyo } from "./FestiveCelebration";

interface NavbarProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: ProductCategory[] = [
  "All",
  "Kurtas & Anarkalis",
  "Co-ord Sets",
  "Dresses & Gowns",
  "Sarees & Lehengas",
  "Pashminas & Shawls",
  "Casual Chic",
];

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A443F] hover:text-[#701A28] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Identity / Logo */}
          <div className="flex flex-col items-center sm:items-start cursor-pointer" onClick={() => onSelectCategory("All")}>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-3xl sm:text-4xl font-semibold tracking-wider text-[#701A28] uppercase">
                {settings.brandName}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B45309]"></span>
              {settings.festiveMode && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#B45309] border border-[#F59E0B]/40 shadow-2xs font-serif">
                  <FestiveDiyo size={11} /> दसैँ-तिहार
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#786E65] uppercase font-medium">
              {settings.brandSubtext || "Kathmandu • Luxury Atelier"}
            </span>
          </div>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center space-x-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`nav-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => onSelectCategory(cat)}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  selectedCategory === cat
                    ? "text-[#701A28] font-semibold"
                    : "text-[#5C544E] hover:text-[#701A28]"
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#701A28] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Input Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-white border border-[#D9D0C5] rounded-full px-3 py-1.5 shadow-sm w-48 sm:w-64">
                  <Search size={16} className="text-[#8C8278] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search attire, silk, zari..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="w-full text-xs text-[#262322] bg-transparent outline-none placeholder-[#A89F95]"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange("");
                    }}
                    className="text-[#8C8278] hover:text-[#262322] text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  id="btn-search-toggle"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#5C544E] hover:text-[#701A28] transition-colors rounded-full hover:bg-[#EFE8DF]"
                  title="Search Dawosti catalog"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Direct WhatsApp Link */}
            <a
              id="nav-whatsapp-link"
              href={`https://wa.me/977${cleanWhatsappNumber}?text=${encodeURIComponent(
                `Hello ${settings.brandName}! I am browsing your collection and would like personal styling assistance.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle size={15} />
              <span>+977 {settings.whatsappNumber}</span>
            </a>

            {/* Admin Portal Button */}
            <button
              id="btn-open-admin"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#4A443F] hover:text-[#701A28] border border-[#D9D0C5] hover:border-[#701A28] rounded-full bg-white/80 transition-colors"
              title="Admin & Payment Logistics Portal"
            >
              <Lock size={13} className="text-[#701A28]" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative p-2.5 bg-[#701A28] text-white hover:bg-[#58121E] rounded-full transition-transform active:scale-95 shadow-md"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B45309] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E1D9] bg-[#FAF7F2] px-4 pt-3 pb-5 space-y-2">
          <div className="text-xs font-semibold text-[#8C8278] uppercase tracking-wider px-2 pt-1">
            Collections
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#701A28] text-white font-medium"
                    : "text-[#4A443F] hover:bg-[#EFE8DF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E1D9] flex flex-col gap-2">
            <a
              href={`https://wa.me/977${cleanWhatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#128C7E] bg-[#25D366]/10 rounded-lg"
            >
              <MessageCircle size={16} />
              WhatsApp: +977 {settings.whatsappNumber}
            </a>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#4A443F] border border-[#D9D0C5] rounded-lg bg-white"
            >
              <Lock size={14} className="text-[#701A28]" />
              Admin Logistics & Payment Gateway Portal
            </button>
          </div>
        </div>
      )}

      {/* Traditional Nepali Sayapatri Garland Toran */}
      <FestiveGarland settings={settings} />
    </header>
  );
};

