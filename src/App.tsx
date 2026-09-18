import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  ProductCategory,
} from "./types";
import {
  initialProducts,
  initialOrders,
  initialStoreSettings,
} from "./data/initialProducts";
import { Navbar } from "./components/Navbar";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { HeroSection } from "./components/HeroSection";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { PaymentModal } from "./components/PaymentModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { Footer } from "./components/Footer";
import { Filter, SlidersHorizontal, Sparkles } from "lucide-react";
import { FestiveFloatingBlessing, FestiveDiyo, MarigoldFlower } from "./components/FestiveCelebration";

export default function App() {
  // Store Settings with localStorage persistence
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem("dawosti_settings");
    if (!saved) return initialStoreSettings;
    try {
      return { ...initialStoreSettings, ...JSON.parse(saved) };
    } catch {
      return initialStoreSettings;
    }
  });

  // Sync document title with brand details
  useEffect(() => {
    if (settings.brandName) {
      document.title = `${settings.brandName} - Women's Clothing & Payment Portal`;
    }
  }, [settings.brandName]);

  // Products with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("dawosti_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Orders with localStorage persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("dawosti_orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Shopping Bag Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("dawosti_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "newest">("featured");

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Ref to catalog section for smooth scrolling
  const catalogRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("dawosti_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("dawosti_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("dawosti_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("dawosti_cart", JSON.stringify(cart));
  }, [cart]);

  // Cart Management Handlers
  const handleAddToCart = (product: Product, selectedSize: string, quantity: number) => {
    const entryId = `${product.id}-${selectedSize}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === entryId);
      if (existing) {
        return prev.map((item) =>
          item.id === entryId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: entryId,
          product,
          selectedSize,
          quantity,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Instant Buy Flow (skips bag and goes straight to QR payment gateway)
  const handleInstantBuy = (product: Product, size: string, quantity: number) => {
    setDirectBuyItem({
      id: `${product.id}-${size}`,
      product,
      selectedSize: size,
      quantity,
    });
    setIsPaymentOpen(true);
  };

  // Order Placed Callback
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // If order was placed from general cart, clear the cart
    if (!directBuyItem) {
      setCart([]);
    }
  };

  // Admin Order Update
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  // Admin Product Actions
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Filtered and Sorted Products
  const visibleProducts = useMemo(() => {
    return products
      .filter((prod) => {
        const matchesCategory =
          selectedCategory === "All" || prod.category === selectedCategory;

        const matchesQuery =
          searchQuery.trim() === "" ||
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.priceNpr - b.priceNpr;
        if (sortBy === "price-high") return b.priceNpr - a.priceNpr;
        if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#262322] flex flex-col selection:bg-[#701A28] selection:text-white">
      {/* Top Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* Main Navigation Header */}
      <Navbar
        settings={settings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim().length > 0) scrollToCatalog();
        }}
      />

      <main className="flex-1">
        {/* Luxury Hero Banner */}
        <HeroSection settings={settings} onExploreClick={scrollToCatalog} />

        {/* Catalog Section */}
        <section ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Catalog Controls: Category & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D9]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#262322]">
                  {selectedCategory === "All" ? `${settings.brandName} Atelier Collection` : selectedCategory}
                </h2>
                <span className="text-xs bg-[#EFE8DF] text-[#701A28] px-2.5 py-0.5 rounded-full font-bold">
                  {visibleProducts.length} {visibleProducts.length === 1 ? "design" : "designs"}
                </span>
                {settings.festiveMode && (
                  <span className="text-xs bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 font-serif">
                    <FestiveDiyo size={12} /> दसैँ-तिहार विशेष छुट
                  </span>
                )}
              </div>
              <p className="text-xs text-[#786E65] mt-1">
                {settings.festiveMode
                  ? "शुभ विजयादशमी तथा दीपावली विशेष उपहार तथा पहिरन संग्रह। Instant QR Pay via eSewa, Khalti, & Fonepay."
                  : "Handcrafted with premium silks, velvets, and Himalayan cashmere. Scan & Pay via eSewa, Khalti, or Fonepay."}
              </p>
            </div>


            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#5C544E]">
                <SlidersHorizontal size={14} className="text-[#701A28]" />
                <span className="font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#D9D0C5] text-xs font-medium rounded-lg p-2 text-[#262322] outline-none cursor-pointer focus:border-[#701A28]"
                >
                  <option value="featured">Featured & Curated</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Search Indicator */}
          {searchQuery.trim() !== "" && (
            <div className="py-3 flex items-center justify-between text-xs text-[#5C544E]">
              <span>
                Showing results for: <strong>"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#701A28] hover:underline font-semibold"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Product Grid */}
          {visibleProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E1D9] p-12 text-center my-8 shadow-xs">
              <Sparkles size={32} className="text-[#B45309] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[#262322] mb-1">
                No attire found
              </h3>
              <p className="text-xs text-[#786E65] max-w-sm mx-auto mb-4">
                We couldn't find any designs matching your search. Browse other categories or contact our stylist directly on WhatsApp.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2 bg-[#701A28] text-white text-xs font-semibold rounded-xl"
              >
                View All Designs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={settings.whatsappNumber}
                  brandName={settings.brandName}
                  festiveMode={settings.festiveMode}
                  festiveDiscountPercent={settings.festiveDiscountPercent}
                  onSelect={(p) => setSelectedProduct(p)}
                  onQuickAdd={(p, sz) => handleAddToCart(p, sz, 1)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Cultural Dashain-Tihar Floating Greeting & Quick Promo Widget */}
      <FestiveFloatingBlessing settings={settings} />

      {/* Persistent Floating WhatsApp Consultation Button */}
      <WhatsAppFloat
        whatsappNumber={settings.whatsappNumber}
        brandName={settings.brandName}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          whatsappNumber={settings.whatsappNumber}
          brandName={settings.brandName}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
        />
      )}


      {/* Slide-over Shopping Bag */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToPayment={() => {
            setDirectBuyItem(null);
            setIsPaymentOpen(true);
          }}
          settings={settings}
        />
      )}

      {/* Payment Gateway Modal (eSewa, Khalti, Fonepay QR & WhatsApp Link) */}
      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setDirectBuyItem(null);
          }}
          items={cart}
          settings={settings}
          onOrderPlaced={handleOrderPlaced}
          directBuyItem={directBuyItem}
        />
      )}

      {/* Admin Logistics, Verification, Google Sheets & AI Description Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          settings={settings}
          onUpdateSettings={setSettings}
        />
      )}
    </div>
  );
}
