import React, { useState } from "react";
import {
  X,
  Lock,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Send,
  Eye,
  Upload,
  Image as ImageIcon,
  Palette,
  CreditCard,
  Globe,
} from "lucide-react";
import {
  Order,
  Product,
  StoreSettings,
  LogisticsStatus,
  PaymentStatus,
  ProductCategory,
} from "../types";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

type AdminTab = "logistics" | "products" | "brand" | "gateways" | "sheets";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrder,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  settings,
  onUpdateSettings,
}) => {
  // Security Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("logistics");

  // Logistics Filter & Search
  const [logisticsFilter, setLogisticsFilter] = useState<string>("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [viewingProofOrder, setViewingProofOrder] = useState<Order | null>(null);

  // Copy Feedback
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Google Sheets Sync State
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsSyncResult, setSheetsSyncResult] = useState<string | null>(null);

  // Product Management Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Product Form State
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState<ProductCategory>("Kurtas & Anarkalis");
  const [pPrice, setPPrice] = useState<number>(3500);
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(4200);
  const [pFabric, setPFabric] = useState("Pure Silk & Organza");
  const [pDescription, setPDescription] = useState("");
  const [pHighlights, setPHighlights] = useState<string[]>([]);
  const [pHighlightInput, setPHighlightInput] = useState("");
  const [pWashCare, setPWashCare] = useState("Dry clean only.");
  const [pSizes, setPSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [pImageUrl, setPImageUrl] = useState("");
  const [pInStock, setPInStock] = useState(true);

  // Store Settings Local State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Synchronize localSettings whenever external settings update
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Curated Luxury Stock Presets for Fast Admin Selection
  const FASHION_STOCK_PRESETS = [
    {
      title: "Royal Velvet Anarkali",
      category: "Kurtas & Anarkalis",
      caption: "Velvet & Hand-Zari",
      url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Mulberry Silk Co-ord",
      category: "Co-ord Sets",
      caption: "Mulberry Silk Co-ord",
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Pastel Organza Saree",
      category: "Sarees & Lehengas",
      caption: "Pastel Organza Saree",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Himalayan Pashmina",
      category: "Pashminas & Shawls",
      caption: "Generational Pashmina",
      url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Emerald Evening Gown",
      category: "Dresses & Gowns",
      caption: "Evening Silk Gown",
      url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Chanderi Floral Kurti",
      category: "Kurtas & Anarkalis",
      caption: "Chanderi Zari Kurti",
      url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Crimson Bridal Lehenga",
      category: "Sarees & Lehengas",
      caption: "Bridal Zari Couture",
      url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Linen Tailored Chic",
      category: "Casual Chic",
      caption: "Contemporary Linen",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  // Helper to read an uploaded local image file as Data URL
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle PIN authentication
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === settings.adminPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Open Product Form (Add or Edit)
  const openProductForm = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setPName(prod.name);
      setPCategory(prod.category);
      setPPrice(prod.priceNpr);
      setPOriginalPrice(prod.originalPriceNpr || Math.round(prod.priceNpr * 1.2));
      setPFabric(prod.fabric);
      setPDescription(prod.description);
      setPHighlights(prod.highlights || []);
      setPWashCare(prod.washCare);
      setPSizes(prod.sizes);
      setPImageUrl(prod.images[0] || "");
      setPInStock(prod.inStock);
    } else {
      setEditingProduct(null);
      setPName("");
      setPCategory("Kurtas & Anarkalis");
      setPPrice(3500);
      setPOriginalPrice(4200);
      setPFabric("Raw Silk & Chiffon");
      setPDescription("");
      setPHighlights([
        "Intricate artisanal hand needlework",
        "Regal silhouette crafted for comfort and festive poise",
        "Breathable pure fabric with premium interior lining",
      ]);
      setPWashCare("Dry clean recommended.");
      setPSizes(["S", "M", "L", "XL"]);
      setPImageUrl(
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
      );
      setPInStock(true);
    }
    setAiError(null);
    setIsProductModalOpen(true);
  };

  // AI Product Description Automation using server-side Gemini API
  const handleGenerateAiDescription = async () => {
    if (!pName.trim()) {
      setAiError("Please type a Product Name first (e.g. 'Royal Velvet Zari Anarkali')");
      return;
    }

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: pName,
          category: pCategory,
          fabric: pFabric,
          tone: "Luxury, Poised, Regal & Contemporary",
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      if (data.description) {
        setPDescription(data.description);
      }
      if (Array.isArray(data.highlights) && data.highlights.length > 0) {
        setPHighlights(data.highlights);
      }
      if (data.washCare) {
        setPWashCare(data.washCare);
      }
    } catch (err: any) {
      console.warn("AI generation failed, providing smart fallback:", err);
      setPDescription(
        `Elegance reimagined. Dawosti's ${pName} combines heritage artistry with modern tailored grace. Meticulously handcrafted from premium ${pFabric}, each detail reflects timeless opulence for the contemporary woman.`
      );
      setPHighlights([
        `Handcrafted from premium ${pFabric}`,
        "Flattering, movement-friendly luxury silhouette",
        "Bespoke Dawosti finishing with pure comfort lining",
      ]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now().toString().slice(-4)}`,
      name: pName.trim(),
      category: pCategory,
      priceNpr: Number(pPrice),
      originalPriceNpr: Number(pOriginalPrice),
      sizes: pSizes.length > 0 ? pSizes : ["Free Size"],
      images: [pImageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"],
      description: pDescription.trim() || `Exclusive ${pName} designed by ${settings.brandName} Atelier.`,
      highlights: pHighlights,
      fabric: pFabric.trim(),
      washCare: pWashCare.trim(),
      inStock: pInStock,
      tags: [settings.brandName, pCategory],
      isNew: true,
      featured: true,
    };

    if (editingProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }

    setIsProductModalOpen(false);
  };

  // Toggle size in product form
  const toggleSizeSelection = (sz: string) => {
    if (pSizes.includes(sz)) {
      setPSizes(pSizes.filter((s) => s !== sz));
    } else {
      setPSizes([...pSizes, sz]);
    }
  };

  // Save Store Settings ("Antigravity Editability")
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  // 1-Click Export to Google Sheets CSV
  const handleExportGoogleSheetsCsv = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "Delivery City",
      "Address",
      "Items",
      "Total NPR",
      "Payment Method",
      "Transaction ID",
      "Payment Status",
      "Logistics Status",
      "Verified At",
      "Admin Notes",
    ];

    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.deliveryCity.replace(/"/g, '""')}"`,
      `"${o.deliveryAddress.replace(/"/g, '""')}"`,
      `"${o.itemsSummary.replace(/"/g, '""')}"`,
      o.totalNpr,
      o.paymentMethod.toUpperCase(),
      `"${o.transactionId || ""}"`,
      o.paymentStatus.toUpperCase(),
      o.logisticsStatus.toUpperCase(),
      `"${o.verifiedAt || ""}"`,
      `"${(o.adminNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const brandSlug = (settings.brandName || "Store").replace(/\s+/g, "_");
    link.setAttribute("download", `${brandSlug}_Logistics_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy TSV for direct Google Sheet Paste (Ctrl + V)
  const handleCopyGoogleSheetsTsv = () => {
    const headers = [
      "Order ID\tDate\tCustomer Name\tPhone\tCity\tAddress\tItems\tTotal (NPR)\tPayment Method\tTransaction ID\tPayment Status\tLogistics Status",
    ];
    const rows = orders.map(
      (o) =>
        `${o.id}\t${new Date(o.createdAt).toLocaleDateString()}\t${o.customerName}\t${o.customerPhone}\t${o.deliveryCity}\t${o.deliveryAddress}\t${o.itemsSummary}\t${o.totalNpr}\t${o.paymentMethod.toUpperCase()}\t${o.transactionId || ""}\t${o.paymentStatus}\t${o.logisticsStatus}`
    );
    const tsv = [headers, ...rows].join("\n");
    navigator.clipboard.writeText(tsv);
    setCopiedStatus("tsv");
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  // Live Sync to Google Sheets Webhook API
  const handleTriggerSheetsSync = async () => {
    setIsSyncingSheets(true);
    setSheetsSyncResult(null);

    try {
      const response = await fetch("/api/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: settings.googleSheetsWebhookUrl,
          orders,
        }),
      });

      const data = await response.json();
      if (data.webhookStatus === "success") {
        setSheetsSyncResult("✅ Live Webhook synced successfully to your Google Sheet!");
      } else if (data.webhookStatus === "no_url_configured") {
        setSheetsSyncResult(
          "ℹ️ Formatted CSV ready. (Configure your Google Apps Script Webhook URL in Settings to automate live sync)."
        );
      } else {
        setSheetsSyncResult(`Sync completed: ${data.webhookStatus}`);
      }
    } catch (err: any) {
      setSheetsSyncResult(`Sync error: ${err.message}`);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerPhone.includes(orderSearchQuery) ||
      (order.transactionId && order.transactionId.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (logisticsFilter === "all") return true;
    if (logisticsFilter === "pending") return order.logisticsStatus === "pending" || order.paymentStatus === "pending_verification";
    if (logisticsFilter === "verified") return order.paymentStatus === "verified";
    if (logisticsFilter === "processing") return order.logisticsStatus === "processing";
    if (logisticsFilter === "dispatched") return order.logisticsStatus === "dispatched";
    if (logisticsFilter === "delivered") return order.logisticsStatus === "delivered";

    return true;
  });

  // Verification helper
  const handleVerifyPayment = (order: Order, verified: boolean) => {
    const updated: Order = {
      ...order,
      paymentStatus: verified ? "verified" : "rejected",
      logisticsStatus: verified ? "processing" : "cancelled",
      verifiedAt: verified ? new Date().toISOString() : undefined,
      adminNotes: verified
        ? `Payment verified by Dawosti Admin on ${new Date().toLocaleTimeString()}. Queued for packaging.`
        : `Payment flagged / rejected by Admin.`,
    };
    onUpdateOrder(updated);
  };

  // Logistics status updater
  const handleUpdateLogistics = (order: Order, newStatus: LogisticsStatus) => {
    const updated: Order = {
      ...order,
      logisticsStatus: newStatus,
      adminNotes: `Logistics status updated to ${newStatus.toUpperCase()} on ${new Date().toLocaleDateString()}.`,
    };
    onUpdateOrder(updated);
  };

  // WhatsApp customer notification helper
  const getCustomerWhatsAppUrl = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/\D/g, "");
    let msg = "";

    if (order.paymentStatus === "verified") {
      msg = `Hello ${order.customerName}! 🌸\n\nThis is the ${settings.brandName} Atelier team. We are pleased to confirm that your payment for Order ${order.id} (Rs. ${order.totalNpr.toLocaleString()}) via ${order.paymentMethod.toUpperCase()} has been verified!\n\nYour luxury attire is currently being prepared with care and will be dispatched soon to ${order.deliveryAddress}, ${order.deliveryCity}.\n\nThank you for choosing ${settings.brandName}!`;
    } else {
      msg = `Hello ${order.customerName}! 🌸\n\nThis is ${settings.brandName} Atelier regarding your Order ${order.id}. Could you please confirm your Transaction Reference ID (${order.transactionId || "pending"}) or share the payment receipt screenshot so we can process your dispatch? Thank you!`;
    }

    return `https://wa.me/977${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "verified")
    .reduce((sum, o) => sum + o.totalNpr, 0);
  const pendingVerificationCount = orders.filter(
    (o) => o.paymentStatus === "pending_verification"
  ).length;
  const deliveredCount = orders.filter((o) => o.logisticsStatus === "delivered").length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#FAF7F2] rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#E8E1D9] flex flex-col h-[92vh]">
        {/* Top Bar */}
        <div className="bg-[#701A28] text-white p-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58121E] rounded-lg">
              <Lock size={18} className="text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-wider uppercase">
                  {settings.brandName} Atelier Admin
                </h2>
                <span className="text-[10px] bg-[#B45309] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Logistics & Gateways
                </span>
              </div>
              <p className="text-xs text-[#E6D7CC]">
                eSewa • Khalti • Fonepay • Google Sheets Logistics • AI Descriptions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-[#58121E]"
            aria-label="Close Admin"
          >
            <X size={20} />
          </button>
        </div>

        {/* Security Screen if NOT Authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D9] shadow-lg max-w-sm w-full text-center space-y-4">
              <div className="w-14 h-14 bg-[#FAF7F2] text-[#701A28] rounded-full flex items-center justify-center mx-auto border border-[#E8E1D9]">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#262322]">
                  Admin Security Access
                </h3>
                <p className="text-xs text-[#786E65] mt-1">
                  Enter your secure 4-digit PIN to access logistics, payment verification, and inventory controls.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3">
                <div>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter Admin PIN (Default: 1234)"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    autoFocus
                    className="w-full text-center tracking-[0.5em] text-lg font-bold p-2.5 rounded-xl border border-[#D9D0C5] focus:border-[#701A28] outline-none"
                  />
                  {pinError && (
                    <p className="text-xs text-[#DC2626] mt-1">
                      Incorrect PIN. (Default is 1234).
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  id="btn-admin-login"
                  className="w-full py-2.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Unlock Admin Portal
                </button>
              </form>
              <div className="text-[11px] text-[#8C8278] bg-[#FAF7F2] p-2 rounded-lg">
                💡 Default demo PIN is <strong className="text-[#701A28]">1234</strong>. You can change this in the Settings tab anytime.
              </div>
            </div>
          </div>
        ) : (
          /* ================= AUTHENTICATED ADMIN CONSOLE ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-white border-b border-[#E8E1D9] px-4 sm:px-6 flex items-center justify-between overflow-x-auto">
              <div className="flex space-x-1 sm:space-x-4">
                <button
                  id="tab-admin-logistics"
                  onClick={() => setActiveTab("logistics")}
                  className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "logistics"
                      ? "border-[#701A28] text-[#701A28]"
                      : "border-transparent text-[#6B6158] hover:text-[#262322]"
                  }`}
                >
                  <Package size={16} />
                  <span>Orders & Logistics</span>
                  {pendingVerificationCount > 0 && (
                    <span className="bg-[#DC2626] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {pendingVerificationCount}
                    </span>
                  )}
                </button>

                <button
                  id="tab-admin-products"
                  onClick={() => setActiveTab("products")}
                  className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "products"
                      ? "border-[#701A28] text-[#701A28]"
                      : "border-transparent text-[#6B6158] hover:text-[#262322]"
                  }`}
                >
                  <Sparkles size={16} />
                  <span>Products & Stock</span>
                </button>

                <button
                  id="tab-admin-brand"
                  onClick={() => setActiveTab("brand")}
                  className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "brand"
                      ? "border-[#701A28] text-[#701A28]"
                      : "border-transparent text-[#6B6158] hover:text-[#262322]"
                  }`}
                >
                  <Palette size={16} />
                  <span>Brand & Hero Visuals</span>
                </button>

                <button
                  id="tab-admin-gateways"
                  onClick={() => setActiveTab("gateways")}
                  className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "gateways"
                      ? "border-[#701A28] text-[#701A28]"
                      : "border-transparent text-[#6B6158] hover:text-[#262322]"
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Payment Gateways & Delivery</span>
                </button>

                <button
                  id="tab-admin-sheets"
                  onClick={() => setActiveTab("sheets")}
                  className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "sheets"
                      ? "border-[#701A28] text-[#701A28]"
                      : "border-transparent text-[#6B6158] hover:text-[#262322]"
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  <span>Google Sheets Sync</span>
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-[#786E65]">
                <span>Verified Revenue: <strong className="text-[#15803D]">Rs. {totalRevenue.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* ================= TAB 1: LOGISTICS & PAYMENT VERIFICATION ================= */}
              {activeTab === "logistics" && (
                <div className="space-y-5">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] shadow-sm">
                      <div className="text-[11px] text-[#8C8278] uppercase font-bold">Total Orders</div>
                      <div className="text-xl font-bold text-[#262322] mt-1">{orders.length}</div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] shadow-sm">
                      <div className="text-[11px] text-[#DC2626] uppercase font-bold flex items-center gap-1">
                        <Clock size={12} /> Pending Proof
                      </div>
                      <div className="text-xl font-bold text-[#DC2626] mt-1">
                        {pendingVerificationCount}
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] shadow-sm">
                      <div className="text-[11px] text-[#15803D] uppercase font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Delivered
                      </div>
                      <div className="text-xl font-bold text-[#15803D] mt-1">{deliveredCount}</div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] shadow-sm">
                      <div className="text-[11px] text-[#701A28] uppercase font-bold">Verified Revenue</div>
                      <div className="text-xl font-bold text-[#701A28] mt-1">
                        Rs. {totalRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8E1D9]">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {["all", "pending", "verified", "processing", "dispatched", "delivered"].map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => setLogisticsFilter(st)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                              logisticsFilter === st
                                ? "bg-[#701A28] text-white"
                                : "bg-[#FAF7F2] text-[#5C544E] hover:bg-[#EFE8DF]"
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search size={15} className="absolute left-3 top-2.5 text-[#8C8278]" />
                      <input
                        type="text"
                        placeholder="Search ID, customer, phone..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#D9D0C5] outline-none"
                      />
                    </div>
                  </div>

                  {/* Orders List Table / Cards */}
                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <div className="bg-white p-8 rounded-xl text-center text-xs text-[#8C8278] border border-[#E8E1D9]">
                        No orders match your filter criteria.
                      </div>
                    ) : (
                      filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className={`bg-white rounded-xl border p-4 sm:p-5 shadow-sm transition-all ${
                            order.paymentStatus === "pending_verification"
                              ? "border-[#FCA5A5] ring-1 ring-[#FCA5A5]/40"
                              : "border-[#E8E1D9]"
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Order Info */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-sm font-bold text-[#701A28]">
                                  {order.id}
                                </span>
                                <span className="text-[11px] text-[#8C8278]">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>

                                {/* Payment Method Badge */}
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                    order.paymentMethod === "esewa"
                                      ? "bg-[#1B7A3C]/15 text-[#1B7A3C]"
                                      : order.paymentMethod === "khalti"
                                      ? "bg-[#5C2D91]/15 text-[#5C2D91]"
                                      : order.paymentMethod === "fonepay"
                                      ? "bg-[#A31D1D]/15 text-[#A31D1D]"
                                      : "bg-[#25D366]/15 text-[#128C7E]"
                                  }`}
                                >
                                  {order.paymentMethod}
                                </span>

                                {/* Payment Status Badge */}
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                    order.paymentStatus === "verified"
                                      ? "bg-[#DCFCE7] text-[#15803D]"
                                      : order.paymentStatus === "rejected"
                                      ? "bg-[#FEE2E2] text-[#B91C1C]"
                                      : "bg-[#FEF3C7] text-[#B45309] animate-pulse"
                                  }`}
                                >
                                  {order.paymentStatus.replace("_", " ")}
                                </span>

                                {/* Logistics Status Badge */}
                                <span className="text-[10px] font-semibold bg-[#FAF7F2] border border-[#D9D0C5] text-[#4A443F] px-2 py-0.5 rounded uppercase">
                                  📦 {order.logisticsStatus}
                                </span>
                              </div>

                              <div className="text-sm font-bold text-[#262322]">
                                {order.customerName} •{" "}
                                <a
                                  href={`tel:${order.customerPhone}`}
                                  className="text-[#701A28] hover:underline"
                                >
                                  {order.customerPhone}
                                </a>
                              </div>

                              <div className="text-xs text-[#5C544E]">
                                📍 <strong>{order.deliveryCity}:</strong> {order.deliveryAddress}
                              </div>

                              <div className="text-xs text-[#786E65] bg-[#FAF7F2] p-2 rounded-lg border border-[#EFE8DF]">
                                <strong>Items:</strong> {order.itemsSummary}
                                {order.orderNotes && (
                                  <div className="text-[11px] text-[#B45309] mt-0.5">
                                    <em>Note: {order.orderNotes}</em>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Verification Actions & Details */}
                            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0">
                              <div className="text-left lg:text-right">
                                <div className="text-xs text-[#8C8278]">Total Amount</div>
                                <div className="text-lg font-bold text-[#701A28]">
                                  Rs. {order.totalNpr.toLocaleString()}
                                </div>
                                {order.transactionId && (
                                  <div className="text-xs text-[#4A443F] font-mono">
                                    Txn ID: <strong>{order.transactionId}</strong>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* View Proof Screenshot Button if uploaded */}
                                {order.paymentProofUrl && (
                                  <button
                                    onClick={() => setViewingProofOrder(order)}
                                    className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE8DF] border border-[#D9D0C5] text-[#701A28] rounded-lg flex items-center gap-1"
                                    title="View attached receipt screenshot"
                                  >
                                    <Eye size={13} /> View Receipt
                                  </button>
                                )}

                                {/* Payment Verification Buttons */}
                                {order.paymentStatus === "pending_verification" && (
                                  <>
                                    <button
                                      id={`btn-verify-order-${order.id}`}
                                      onClick={() => handleVerifyPayment(order, true)}
                                      className="px-3 py-1.5 text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white rounded-lg flex items-center gap-1 shadow-sm transition-all"
                                    >
                                      <CheckCircle2 size={14} /> Verify & Approve
                                    </button>
                                    <button
                                      onClick={() => handleVerifyPayment(order, false)}
                                      className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-lg"
                                    >
                                      Flag
                                    </button>
                                  </>
                                )}

                                {/* Logistics Dropdown */}
                                <select
                                  value={order.logisticsStatus}
                                  onChange={(e) =>
                                    handleUpdateLogistics(order, e.target.value as LogisticsStatus)
                                  }
                                  className="text-xs font-semibold p-1.5 rounded-lg border border-[#D9D0C5] bg-white text-[#262322] outline-none"
                                >
                                  <option value="pending">Logistics: Pending</option>
                                  <option value="processing">Logistics: Processing & Packing</option>
                                  <option value="dispatched">Logistics: Dispatched</option>
                                  <option value="delivered">Logistics: Delivered</option>
                                  <option value="cancelled">Logistics: Cancelled</option>
                                </select>

                                {/* Direct WhatsApp Notify Customer */}
                                <a
                                  href={getCustomerWhatsAppUrl(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] rounded-lg border border-[#25D366]/30 transition-colors"
                                  title="Send Status Update on WhatsApp"
                                >
                                  <MessageCircle size={16} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ================= TAB 2: GOOGLE SHEETS AUTOMATION ================= */}
              {activeTab === "sheets" && (
                <div className="space-y-6">
                  {/* Google Sheets Header Box */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#15803D]">
                      <FileSpreadsheet size={20} />
                      <span>Google Sheets Pending & Done Logistics Automation</span>
                    </div>

                    <p className="text-xs text-[#5C544E] leading-relaxed max-w-3xl">
                      Dawosti automates your entire delivery logistics flow. You can instantly export all pending and completed orders into Google Sheets CSV format, copy tabular TSV directly for immediate pasting, or set up real-time automatic webhook synchronization.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {/* Export CSV */}
                      <button
                        id="btn-export-sheets-csv"
                        onClick={handleExportGoogleSheetsCsv}
                        className="px-4 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                      >
                        <FileSpreadsheet size={16} />
                        <span>Export Logistics CSV (Google Sheets)</span>
                      </button>

                      {/* Copy TSV */}
                      <button
                        id="btn-copy-sheets-tsv"
                        onClick={handleCopyGoogleSheetsTsv}
                        className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE8DF] border border-[#D9D0C5] text-[#262322] text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                      >
                        {copiedStatus === "tsv" ? <Check size={16} className="text-[#15803D]" /> : <Copy size={16} />}
                        <span>{copiedStatus === "tsv" ? "Copied to Clipboard!" : "Copy for Direct Google Sheet (Ctrl+V)"}</span>
                      </button>

                      {/* Live Webhook Sync */}
                      <button
                        onClick={handleTriggerSheetsSync}
                        disabled={isSyncingSheets}
                        className="px-4 py-2.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-60"
                      >
                        <RefreshCw size={16} className={isSyncingSheets ? "animate-spin" : ""} />
                        <span>{isSyncingSheets ? "Syncing API..." : "Live Sync API Now"}</span>
                      </button>
                    </div>

                    {sheetsSyncResult && (
                      <div className="p-3 bg-[#FAF7F2] border border-[#D9D0C5] rounded-xl text-xs text-[#262322]">
                        {sheetsSyncResult}
                      </div>
                    )}
                  </div>

                  {/* 1-Minute Google Apps Script Automation Blueprint */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-bold text-[#262322]">
                        Automated Google Sheets Webhook Script
                      </h4>
                      <button
                        onClick={() => {
                          const script = `// Dawosti Google Sheets Orders Auto-Sync Script
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var orders = data.orders || [];
  
  orders.forEach(function(order) {
    sheet.appendRow([
      order.id,
      new Date().toLocaleDateString(),
      order.customerName,
      order.customerPhone,
      order.deliveryCity,
      order.deliveryAddress,
      order.itemsSummary,
      order.totalNpr,
      order.paymentMethod,
      order.transactionId || "",
      order.paymentStatus,
      order.logisticsStatus
    ]);
  });
  
  return ContentService.createTextOutput(JSON.stringify({result: "success"})).setMimeType(ContentService.MimeType.JSON);
}`;
                          navigator.clipboard.writeText(script);
                          setCopiedStatus("script");
                          setTimeout(() => setCopiedStatus(null), 2500);
                        }}
                        className="text-xs text-[#701A28] hover:underline font-semibold flex items-center gap-1"
                      >
                        {copiedStatus === "script" ? <Check size={14} /> : <Copy size={14} />}
                        {copiedStatus === "script" ? "Script Copied!" : "Copy Script"}
                      </button>
                    </div>

                    <p className="text-xs text-[#6B6158]">
                      Follow these 3 quick steps to automate real-time order sync:
                    </p>
                    <ol className="list-decimal list-inside text-xs text-[#4A443F] space-y-1.5 pl-1">
                      <li>Open any Google Sheet, click <strong>Extensions &gt; Apps Script</strong>.</li>
                      <li>Paste the copyable script below and click <strong>Deploy &gt; New deployment</strong> as a Web App (Access: Anyone).</li>
                      <li>Copy the generated Webhook URL and paste it into the <strong>Settings</strong> tab!</li>
                    </ol>

                    <div className="bg-[#1C1917] text-[#FAF7F2] p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                      <code>{`// Paste this in Google Sheets > Extensions > Apps Script:
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var orders = data.orders || [];
  orders.forEach(function(o) {
    sheet.appendRow([o.id, new Date(), o.customerName, o.customerPhone, o.deliveryCity, o.itemsSummary, o.totalNpr, o.paymentMethod, o.transactionId, o.paymentStatus, o.logisticsStatus]);
  });
  return ContentService.createTextOutput(JSON.stringify({status:"ok"}));
}`}</code>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: PRODUCTS & AI GENERATOR ================= */}
              {activeTab === "products" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#262322]">
                        Dawosti Catalog & Inventory
                      </h3>
                      <p className="text-xs text-[#786E65]">
                        Manage bespoke clothing items and auto-generate luxury descriptions using Gemini AI.
                      </p>
                    </div>
                    <button
                      id="btn-add-product"
                      onClick={() => openProductForm()}
                      className="px-4 py-2 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus size={16} /> Add New Attire
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-xl border border-[#E8E1D9] p-4 flex gap-3 shadow-sm hover:border-[#701A28] transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-20 h-28 object-cover object-top rounded-lg bg-[#FAF7F2] shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-[#8C8278] uppercase font-bold">
                              <span>{prod.category}</span>
                              <span className={prod.inStock ? "text-[#15803D]" : "text-[#DC2626]"}>
                                {prod.inStock ? "In Stock" : "Sold Out"}
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-sm text-[#262322] line-clamp-1 mt-0.5">
                              {prod.name}
                            </h4>
                            <div className="text-xs font-bold text-[#701A28] mt-1">
                              Rs. {prod.priceNpr.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-[#786E65] line-clamp-2 mt-1">
                              {prod.description}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-[#F4EFEA]">
                            <button
                              onClick={() => openProductForm(prod)}
                              className="p-1.5 text-[#5C544E] hover:text-[#701A28] rounded hover:bg-[#FAF7F2]"
                              title="Edit product"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              className="p-1.5 text-[#9E948A] hover:text-[#DC2626] rounded hover:bg-[#FAF7F2]"
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: BRAND DETAILS & HERO VISUALS ================= */}
              {activeTab === "brand" && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl mx-auto">
                  {/* Brand Identity Card */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-3">
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#701A28]">
                        <Palette size={18} />
                        <span>Brand Identity & Announcement Banner</span>
                      </div>
                      <span className="text-[11px] text-[#786E65]">
                        Updated live across storefront
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Brand Display Name <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={localSettings.brandName}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, brandName: e.target.value })
                          }
                          placeholder="e.g. Dawosti"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none font-medium text-[#262322]"
                        />
                        <p className="text-[10px] text-[#8C8278] mt-1">
                          Reflected in the navbar, hero greeting, WhatsApp messages, and checkout modals.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Atelier Subtext / Location Subtitle
                        </label>
                        <input
                          type="text"
                          value={localSettings.brandSubtext || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, brandSubtext: e.target.value })
                          }
                          placeholder="e.g. Kathmandu • Luxury Atelier"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none"
                        />
                        <p className="text-[10px] text-[#8C8278] mt-1">
                          Displayed right beneath the brand logo in the top navbar and footer.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Brand Tagline / Slogan
                        </label>
                        <input
                          type="text"
                          value={localSettings.tagline}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, tagline: e.target.value })
                          }
                          placeholder="e.g. Bespoke & Contemporary Women's Fashion"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          WhatsApp Order & Stylist Line <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={localSettings.whatsappNumber}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })
                          }
                          placeholder="e.g. 9745315902"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none font-mono"
                        />
                        <p className="text-[10px] text-[#8C8278] mt-1">
                          Used for all WhatsApp checkout orders, floating chat button, and call link.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                        Top Announcement Bar Notice
                      </label>
                      <input
                        type="text"
                        value={localSettings.announcement}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, announcement: e.target.value })
                        }
                        placeholder="e.g. ✨ Express Delivery All Across Nepal | Free Shipping Over Rs. 3,500"
                        className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none"
                      />
                      {/* Live Preview Strip */}
                      <div className="mt-2 p-2 bg-[#701A28] text-white rounded-lg text-xs flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#F59E0B] shrink-0" />
                        <span className="truncate">Preview: {localSettings.announcement || "No announcement set."}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Section Stock Images & Visuals */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#F2ECE4] pb-3">
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#701A28]">
                        <ImageIcon size={18} />
                        <span>Hero Section Stock Images & Showcase</span>
                      </div>
                      <span className="text-[11px] text-[#786E65]">
                        Upload directly or select from curated presets
                      </span>
                    </div>

                    <p className="text-xs text-[#5C544E] leading-relaxed">
                      Customize both hero showcase images without touching any code. You can upload an image from your computer or phone, paste an image link, or tap any luxury fashion preset below.
                    </p>

                    {/* 2-Column Hero Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      {/* Hero Image 1 */}
                      <div className="p-4 rounded-xl border border-[#E8E1D9] bg-[#FAF7F2] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#701A28] uppercase tracking-wide">
                            Hero Image 1 (Left Attire)
                          </span>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#D9D0C5] font-semibold text-[#5C544E]">
                            Showcase Primary
                          </span>
                        </div>

                        {/* Image Preview Box */}
                        <div className="relative aspect-[3/4] max-h-56 w-full rounded-xl overflow-hidden border border-[#D9D0C5] bg-white shadow-inner flex items-center justify-center">
                          {localSettings.heroImage1 ? (
                            <img
                              src={localSettings.heroImage1}
                              alt="Hero Preview 1"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4 text-[#8C8278]">
                              <ImageIcon size={28} className="mx-auto mb-1 opacity-50" />
                              <span className="text-xs">No image selected</span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] font-medium">
                            {localSettings.heroImage1Caption || "Velvet & Hand-Zari"}
                          </div>
                        </div>

                        {/* Device Upload Button */}
                        <div>
                          <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full py-2 px-3 bg-white hover:bg-[#FAF7F2] border border-[#701A28] text-[#701A28] rounded-lg text-xs font-bold transition-colors shadow-xs">
                            <Upload size={14} />
                            <span>Upload Image from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e, (dataUrl) =>
                                  setLocalSettings({ ...localSettings, heroImage1: dataUrl })
                                )
                              }
                            />
                          </label>
                        </div>

                        {/* Direct URL Input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A443F] mb-1">
                            Or Image URL:
                          </label>
                          <input
                            type="url"
                            value={localSettings.heroImage1}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroImage1: e.target.value })
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none font-mono bg-white"
                          />
                        </div>

                        {/* Caption Field */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A443F] mb-1">
                            Overlay Caption Text:
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroImage1Caption || ""}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                heroImage1Caption: e.target.value,
                              })
                            }
                            placeholder="e.g. Velvet & Hand-Zari"
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none bg-white"
                          />
                        </div>

                        {/* Stock Presets for Image 1 */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#786E65] mb-1.5">
                            Quick Stock Presets:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {FASHION_STOCK_PRESETS.slice(0, 4).map((preset) => (
                              <button
                                type="button"
                                key={preset.title}
                                onClick={() =>
                                  setLocalSettings({
                                    ...localSettings,
                                    heroImage1: preset.url,
                                    heroImage1Caption: preset.caption,
                                  })
                                }
                                className="text-[10px] px-2 py-1 rounded bg-white hover:bg-[#701A28] hover:text-white border border-[#D9D0C5] text-[#4A443F] transition-colors"
                              >
                                {preset.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hero Image 2 */}
                      <div className="p-4 rounded-xl border border-[#E8E1D9] bg-[#FAF7F2] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#701A28] uppercase tracking-wide">
                            Hero Image 2 (Right Attire)
                          </span>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#D9D0C5] font-semibold text-[#5C544E]">
                            Showcase Secondary
                          </span>
                        </div>

                        {/* Image Preview Box */}
                        <div className="relative aspect-[3/4] max-h-56 w-full rounded-xl overflow-hidden border border-[#D9D0C5] bg-white shadow-inner flex items-center justify-center">
                          {localSettings.heroImage2 ? (
                            <img
                              src={localSettings.heroImage2}
                              alt="Hero Preview 2"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4 text-[#8C8278]">
                              <ImageIcon size={28} className="mx-auto mb-1 opacity-50" />
                              <span className="text-xs">No image selected</span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] font-medium">
                            {localSettings.heroImage2Caption || "Mulberry Silk Co-ord"}
                          </div>
                        </div>

                        {/* Device Upload Button */}
                        <div>
                          <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full py-2 px-3 bg-white hover:bg-[#FAF7F2] border border-[#701A28] text-[#701A28] rounded-lg text-xs font-bold transition-colors shadow-xs">
                            <Upload size={14} />
                            <span>Upload Image from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e, (dataUrl) =>
                                  setLocalSettings({ ...localSettings, heroImage2: dataUrl })
                                )
                              }
                            />
                          </label>
                        </div>

                        {/* Direct URL Input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A443F] mb-1">
                            Or Image URL:
                          </label>
                          <input
                            type="url"
                            value={localSettings.heroImage2}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroImage2: e.target.value })
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none font-mono bg-white"
                          />
                        </div>

                        {/* Caption Field */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A443F] mb-1">
                            Overlay Caption Text:
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroImage2Caption || ""}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                heroImage2Caption: e.target.value,
                              })
                            }
                            placeholder="e.g. Mulberry Silk Co-ord"
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none bg-white"
                          />
                        </div>

                        {/* Stock Presets for Image 2 */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#786E65] mb-1.5">
                            Quick Stock Presets:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {FASHION_STOCK_PRESETS.slice(4, 8).map((preset) => (
                              <button
                                type="button"
                                key={preset.title}
                                onClick={() =>
                                  setLocalSettings({
                                    ...localSettings,
                                    heroImage2: preset.url,
                                    heroImage2Caption: preset.caption,
                                  })
                                }
                                className="text-[10px] px-2 py-1 rounded bg-white hover:bg-[#701A28] hover:text-white border border-[#D9D0C5] text-[#4A443F] transition-colors"
                              >
                                {preset.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hero Text Content & Badges */}
                    <div className="pt-4 border-t border-[#F2ECE4] space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#701A28] block">
                        Hero Headings, Badges & Stats
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                            Eyebrow Badge Text
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroBadge || ""}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroBadge: e.target.value })
                            }
                            placeholder="e.g. Spring & Festive Couture 2026"
                            className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                            Main Headline Title
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroTitle || ""}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroTitle: e.target.value })
                            }
                            placeholder="e.g. Elegance woven into every thread."
                            className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Hero Subtitle / Description Paragraph
                        </label>
                        <textarea
                          rows={2}
                          value={localSettings.heroSubtitle || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })
                          }
                          placeholder="Designed for the modern woman who cherishes artisanal heritage..."
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D9] space-y-2">
                          <span className="text-[11px] font-bold text-[#701A28] uppercase">
                            Feature Stat 1 (Left Card)
                          </span>
                          <input
                            type="text"
                            value={localSettings.heroStat1Title || ""}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroStat1Title: e.target.value })
                            }
                            placeholder="Stat Title (e.g. 100% Artisanal)"
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] bg-white outline-none font-semibold"
                          />
                          <input
                            type="text"
                            value={localSettings.heroStat1Subtitle || ""}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroStat1Subtitle: e.target.value })
                            }
                            placeholder="Stat Subtitle (e.g. Master Tailored)"
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] bg-white outline-none"
                          />
                        </div>

                        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D9] space-y-2">
                          <span className="text-[11px] font-bold text-[#701A28] uppercase">
                            Feature Stat 2 (Right Card)
                          </span>
                          <input
                            type="text"
                            value={localSettings.heroStat2Title || ""}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroStat2Title: e.target.value })
                            }
                            placeholder="Stat Title (e.g. Direct QR Gateway)"
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] bg-white outline-none font-semibold"
                          />
                          <input
                            type="text"
                            value={localSettings.heroStat2Subtitle || ""}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, heroStat2Subtitle: e.target.value })
                            }
                            placeholder="Stat Subtitle (e.g. No Hidden Surcharges)"
                            className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] bg-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Story & Atelier Contact Info */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#701A28] border-b border-[#F2ECE4] pb-2">
                      <Globe size={18} />
                      <span>Atelier Story, Address & Contact Info</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                        Brand Story / About Us (Displayed in Footer)
                      </label>
                      <textarea
                        rows={3}
                        value={localSettings.brandStory || ""}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, brandStory: e.target.value })
                        }
                        placeholder="Bespoke and contemporary women's fashion in Nepal..."
                        className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Store Address / Atelier Locations
                        </label>
                        <input
                          type="text"
                          value={localSettings.storeAddress || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, storeAddress: e.target.value })
                          }
                          placeholder="e.g. Baluwatar & Jhamsikhel, Kathmandu"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Support Email Address
                        </label>
                        <input
                          type="email"
                          value={localSettings.supportEmail || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, supportEmail: e.target.value })
                          }
                          placeholder="e.g. care@dawosti.com"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Official Instagram Handle
                        </label>
                        <input
                          type="text"
                          value={localSettings.instagramHandle || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, instagramHandle: e.target.value })
                          }
                          placeholder="e.g. @dawostiofficial"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Footer Copyright Notice
                        </label>
                        <input
                          type="text"
                          value={localSettings.copyrightText || ""}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, copyrightText: e.target.value })
                          }
                          placeholder="e.g. All rights reserved. Made for Nepal."
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button for Brand & Visuals */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      id="btn-save-brand-visuals"
                      className="px-7 py-3.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center gap-2"
                    >
                      <Check size={16} />
                      <span>Save & Apply Brand & Visual Changes Live</span>
                    </button>
                    {settingsSavedToast && (
                      <span className="text-xs text-[#15803D] font-bold flex items-center gap-1 animate-fadeIn">
                        <CheckCircle2 size={16} /> All brand & stock image changes saved live!
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* ================= TAB 4: PAYMENT GATEWAYS & LOGISTICS ================= */}
              {activeTab === "gateways" && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl mx-auto">
                  {/* Payment Gateway Credentials */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1B7A3C] border-b border-[#F2ECE4] pb-2">
                      <DollarSign size={18} />
                      <span>eSewa, Khalti & Fonepay Merchant Configuration</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1B7A3C] mb-1">
                          eSewa ID / Registered Mobile
                        </label>
                        <input
                          type="text"
                          value={localSettings.esewaId}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, esewaId: e.target.value })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1B7A3C] mb-1">
                          eSewa Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={localSettings.esewaName}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, esewaName: e.target.value })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5C2D91] mb-1">
                          Khalti ID / Registered Mobile
                        </label>
                        <input
                          type="text"
                          value={localSettings.khaltiId}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, khaltiId: e.target.value })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5C2D91] mb-1">
                          Khalti Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={localSettings.khaltiName}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, khaltiName: e.target.value })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#A31D1D] mb-1">
                          Fonepay Merchant Code / PAN
                        </label>
                        <input
                          type="text"
                          value={localSettings.fonepayMerchantCode}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              fonepayMerchantCode: e.target.value,
                            })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#A31D1D] mb-1">
                          Fonepay Display Merchant Name
                        </label>
                        <input
                          type="text"
                          value={localSettings.fonepayMerchantName}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              fonepayMerchantName: e.target.value,
                            })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Security PIN */}
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D9] shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#701A28] border-b border-[#F2ECE4] pb-2">
                      <Truck size={18} />
                      <span>Logistics Fees & Security PIN</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Free Shipping Threshold (Rs.)
                        </label>
                        <input
                          type="number"
                          value={localSettings.freeShippingThreshold}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              freeShippingThreshold: Number(e.target.value),
                            })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Standard Delivery Fee (Rs.)
                        </label>
                        <input
                          type="number"
                          value={localSettings.standardDeliveryFee}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              standardDeliveryFee: Number(e.target.value),
                            })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                          Admin Security PIN
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={localSettings.adminPin}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, adminPin: e.target.value })
                          }
                          className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                        Google Sheets Webhook URL (Optional for Live Auto-Sync)
                      </label>
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={localSettings.googleSheetsWebhookUrl}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            googleSheetsWebhookUrl: e.target.value,
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Save Button for Gateways */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      id="btn-save-gateways-settings"
                      className="px-7 py-3.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center gap-2"
                    >
                      <Check size={16} />
                      <span>Save & Apply Gateway & Delivery Settings</span>
                    </button>
                    {settingsSavedToast && (
                      <span className="text-xs text-[#15803D] font-bold flex items-center gap-1 animate-fadeIn">
                        <CheckCircle2 size={16} /> Gateway settings updated live!
                      </span>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT PRODUCT & AI GENERATOR ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#E8E1D9] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D9]">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#701A28]" />
                <h3 className="font-serif text-xl font-bold text-[#262322]">
                  {editingProduct ? `Edit ${settings.brandName} Attire` : "Add New Clothing Item"}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#8C8278] hover:text-[#262322]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Product Name & AI Generator Trigger */}
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                  Product Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmiri Crimson Zari Velvet Anarkali"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none font-medium"
                  />
                  <button
                    type="button"
                    id="btn-ai-generate-desc"
                    onClick={handleGenerateAiDescription}
                    disabled={isGeneratingAi}
                    className="px-3.5 py-2.5 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm transition-all disabled:opacity-60"
                    title="Generate luxury description using Gemini AI"
                  >
                    <Sparkles size={14} className={isGeneratingAi ? "animate-spin" : ""} />
                    <span>{isGeneratingAi ? "Generating..." : "✨ Auto-Describe with AI"}</span>
                  </button>
                </div>
                {aiError && <p className="text-[11px] text-[#DC2626] mt-1">{aiError}</p>}
              </div>

              {/* Category, Fabric, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                    Category
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none"
                  >
                    <option value="Kurtas & Anarkalis">Kurtas & Anarkalis</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="Dresses & Gowns">Dresses & Gowns</option>
                    <option value="Sarees & Lehengas">Sarees & Lehengas</option>
                    <option value="Pashminas & Shawls">Pashminas & Shawls</option>
                    <option value="Casual Chic">Casual Chic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mulberry Silk"
                    value={pFabric}
                    onChange={(e) => setPFabric(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                    Price (NPR) <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none font-bold text-[#701A28]"
                  />
                </div>
              </div>

              {/* AI Generated Description Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#4A443F]">
                    Product Description (AI Automated)
                  </label>
                  <span className="text-[10px] text-[#8C8278]">
                    Editable luxury story
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Click '✨ Auto-Describe with AI' or type custom description..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] outline-none"
                />
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-xs font-semibold text-[#4A443F] mb-1.5">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSizeSelection(sz)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        pSizes.includes(sz)
                          ? "bg-[#701A28] text-white border-[#701A28]"
                          : "bg-[#FAF7F2] text-[#5C544E] border-[#D9D0C5]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Image: Device Upload, URL & Presets */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D9] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#701A28] uppercase tracking-wide">
                    Product Stock Photo
                  </label>
                  <span className="text-[10px] text-[#8C8278]">
                    Upload or choose preset
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {/* Thumbnail Preview */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-lg border border-[#D9D0C5] bg-white overflow-hidden shadow-inner flex items-center justify-center">
                    {pImageUrl ? (
                      <img
                        src={pImageUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1 text-[#8C8278]">
                        <ImageIcon size={20} className="mx-auto mb-1 opacity-40" />
                        <span className="text-[9px]">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* Device Upload Button */}
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-white hover:bg-[#FAF7F2] border border-[#701A28] text-[#701A28] rounded-lg text-xs font-bold transition-colors shadow-xs">
                      <Upload size={13} />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e, (dataUrl) => setPImageUrl(dataUrl))
                        }
                      />
                    </label>

                    {/* Or URL Input */}
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={pImageUrl}
                      onChange={(e) => setPImageUrl(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#D9D0C5] outline-none font-mono bg-white"
                    />
                  </div>
                </div>

                {/* Fashion Stock Presets */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#786E65] block mb-1">
                    Quick Stock Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {FASHION_STOCK_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.title}
                        onClick={() => {
                          setPImageUrl(preset.url);
                          if (!pName) setPName(preset.title);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-[#701A28] hover:text-white border border-[#D9D0C5] text-[#4A443F] transition-colors"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* In Stock toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stock-toggle"
                  checked={pInStock}
                  onChange={(e) => setPInStock(e.target.checked)}
                  className="rounded border-[#D9D0C5] text-[#701A28] focus:ring-[#701A28]"
                />
                <label htmlFor="stock-toggle" className="text-xs font-semibold text-[#4A443F]">
                  In Stock & Ready for Order Dispatch
                </label>
              </div>

              {/* Save & Cancel */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E1D9]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B6158] hover:bg-[#FAF7F2] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-product-modal"
                  className="px-5 py-2 bg-[#701A28] hover:bg-[#58121E] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save to Dawosti Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULL RECEIPT PREVIEW ================= */}
      {viewingProofOrder && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-[#E8E1D9] text-center space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E1D9]">
              <div>
                <span className="text-xs font-bold text-[#701A28]">
                  {viewingProofOrder.id} - Payment Proof
                </span>
                <p className="text-[11px] text-[#8C8278]">
                  {viewingProofOrder.customerName} ({viewingProofOrder.customerPhone})
                </p>
              </div>
              <button
                onClick={() => setViewingProofOrder(null)}
                className="text-[#8C8278] hover:text-[#262322]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-lg border border-[#E8E1D9]">
              <img
                src={viewingProofOrder.paymentProofUrl}
                alt="Payment proof screenshot"
                className="w-full h-auto object-contain mx-auto"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-mono">Txn ID: {viewingProofOrder.transactionId || "N/A"}</span>
              <button
                onClick={() => {
                  handleVerifyPayment(viewingProofOrder, true);
                  setViewingProofOrder(null);
                }}
                className="px-4 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white font-bold rounded-lg"
              >
                Approve & Mark Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
