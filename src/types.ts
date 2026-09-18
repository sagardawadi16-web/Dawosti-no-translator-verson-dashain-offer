export type ProductCategory =
  | "All"
  | "Kurtas & Anarkalis"
  | "Co-ord Sets"
  | "Dresses & Gowns"
  | "Sarees & Lehengas"
  | "Pashminas & Shawls"
  | "Casual Chic";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  priceNpr: number;
  originalPriceNpr?: number;
  sizes: string[];
  images: string[];
  description: string;
  highlights: string[];
  fabric: string;
  washCare: string;
  inStock: boolean;
  tags: string[];
  isNew?: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique item entry id (product.id + size)
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethod = "esewa" | "khalti" | "fonepay" | "whatsapp";

export type PaymentStatus = "pending_verification" | "verified" | "rejected";

export type LogisticsStatus =
  | "pending"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryCity: string;
  deliveryAddress: string;
  orderNotes?: string;
  items: CartItem[];
  itemsSummary: string;
  subtotalNpr: number;
  deliveryFeeNpr: number;
  totalNpr: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paymentProofUrl?: string;
  paymentStatus: PaymentStatus;
  logisticsStatus: LogisticsStatus;
  verifiedAt?: string;
  adminNotes?: string;
}

export interface StoreSettings {
  brandName: string;
  brandSubtext: string;
  tagline: string;
  announcement: string;
  brandStory: string;
  storeAddress: string;
  supportEmail: string;
  instagramHandle: string;
  whatsappNumber: string;
  copyrightText: string;

  // Hero Section Visuals & Stock Images
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage1: string;
  heroImage1Caption: string;
  heroImage2: string;
  heroImage2Caption: string;
  heroStat1Title: string;
  heroStat1Subtitle: string;
  heroStat2Title: string;
  heroStat2Subtitle: string;

  // Payment Gateways
  esewaId: string;
  esewaName: string;
  khaltiId: string;
  khaltiName: string;
  fonepayMerchantCode: string;
  fonepayMerchantName: string;

  // Logistics & Admin PIN
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  googleSheetsWebhookUrl: string;
  adminPin: string;

  // Dashain & Tihar Festive Mode & Offer
  festiveMode: boolean;
  festiveTitle: string;
  festiveSubtitle: string;
  festiveBannerText: string;
  festiveDiscountPercent: number;
  festivePromoCode: string;
  festiveShowGarland: boolean;
  festiveShowDiyas: boolean;
  festiveThemeStyle?: "dashain_tihar_gold" | "crimson_sindoor" | "jamara_royal";
}
