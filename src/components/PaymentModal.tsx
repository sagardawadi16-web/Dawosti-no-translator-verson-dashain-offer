import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  X,
  CreditCard,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  MapPin,
  MessageCircle,
  FileImage,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { CartItem, Order, PaymentMethod, StoreSettings } from "../types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  onOrderPlaced: (order: Order) => void;
  directBuyItem?: CartItem | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onOrderPlaced,
  directBuyItem,
}) => {
  const checkoutItems = directBuyItem ? [directBuyItem] : items;

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.priceNpr * item.quantity,
    0
  );
  const festiveDiscountAmount =
    settings.festiveMode && settings.festiveDiscountPercent > 0
      ? Math.round((subtotal * settings.festiveDiscountPercent) / 100)
      : 0;
  const discountedSubtotal = subtotal - festiveDiscountAmount;
  const isFreeShipping = discountedSubtotal >= settings.freeShippingThreshold;
  const deliveryFee = isFreeShipping ? 0 : settings.standardDeliveryFee;
  const totalAmount = discountedSubtotal + deliveryFee;


  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Kathmandu");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("esewa");
  const [transactionId, setTransactionId] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>("");
  const [proofFileName, setProofFileName] = useState<string>("");

  // QR Code Data URL State
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Completed Order State for Success View
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const cleanPhone = settings.whatsappNumber.replace(/\D/g, "");

  // Generate real QR code based on selected payment method and amount
  useEffect(() => {
    let payload = "";
    const tempOrderId = `DAW-${Math.floor(10000 + Math.random() * 90000)}`;

    if (paymentMethod === "esewa") {
      payload = `esewa://pay?sc=DAWOSTI&amt=${totalAmount}&pid=${tempOrderId}&receiver=${settings.esewaId}`;
    } else if (paymentMethod === "khalti") {
      payload = `khalti://pay?mobile=${settings.khaltiId}&amount=${totalAmount}&ref=${tempOrderId}`;
    } else if (paymentMethod === "fonepay") {
      payload = `fonepay://merchant?mc=${settings.fonepayMerchantCode}&amt=${totalAmount}&trace=${tempOrderId}&name=${encodeURIComponent(
        settings.fonepayMerchantName
      )}`;
    } else {
      payload = `https://wa.me/977${cleanPhone}`;
    }

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 2,
      color: {
        dark: paymentMethod === "esewa" ? "#1B7A3C" : paymentMethod === "khalti" ? "#5C2D91" : "#A31D1D",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error", err));
  }, [paymentMethod, totalAmount, settings, cleanPhone]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle proof image upload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image file size should be less than 5MB");
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPaymentProofUrl(event.target.result as string);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Order Submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 8) {
      setErrorMessage("Please enter a valid phone number for delivery coordination.");
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage("Please enter your complete delivery address.");
      return;
    }

    if (paymentMethod !== "whatsapp" && !transactionId.trim()) {
      setErrorMessage(
        `Please enter the ${paymentMethod.toUpperCase()} Transaction / Reference ID after completing the payment.`
      );
      return;
    }

    const orderId = `DAW-${Math.floor(10000 + Math.random() * 90000)}`;
    const itemsSummary = checkoutItems
      .map((it) => `${it.quantity}x ${it.product.name} (${it.selectedSize})`)
      .join(", ");

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      deliveryCity,
      deliveryAddress: deliveryAddress.trim(),
      orderNotes: orderNotes.trim() || undefined,
      items: checkoutItems,
      itemsSummary,
      subtotalNpr: subtotal,
      deliveryFeeNpr: deliveryFee,
      totalNpr: totalAmount,
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
      paymentProofUrl: paymentProofUrl || undefined,
      paymentStatus: "pending_verification",
      logisticsStatus: "pending",
      adminNotes: "Order received via Dawosti Online Payment Gateway. Awaiting verification.",
    };

    onOrderPlaced(newOrder);
    setCompletedOrder(newOrder);
  };

  // WhatsApp formatted confirmation text for completed order
  const getWhatsAppConfirmationUrl = (order: Order) => {
    const msg = `Hello Dawosti Atelier! 🌸
I have just placed an order and made payment:

• Order ID: ${order.id}
• Customer Name: ${order.customerName}
• Phone: ${order.customerPhone}
• Delivery: ${order.deliveryAddress}, ${order.deliveryCity}
• Items: ${order.itemsSummary}
• Total Paid: Rs. ${order.totalNpr.toLocaleString()}
• Payment Gateway: ${order.paymentMethod.toUpperCase()}
• Transaction ID: ${order.transactionId || "Direct WhatsApp Verification"}

I am sharing my payment screenshot for verification. Kindly confirm my order dispatch! Thank you.`;

    return `https://wa.me/977${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#E8E1D9] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8E1D9] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-[#701A28] uppercase tracking-wider">
                {settings.brandName} Checkout
              </span>
              <span className="text-[10px] bg-[#EFE8DF] text-[#701A28] px-2 py-0.5 rounded font-bold">
                Nepal Payment Gateway
              </span>
            </div>
            <p className="text-xs text-[#786E65] mt-0.5">
              Secure QR Payment via eSewa, Khalti, Fonepay & WhatsApp Direct Verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#786E65] hover:text-[#701A28] rounded-full hover:bg-[#FAF7F2]"
          >
            <X size={20} />
          </button>
        </div>


        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {completedOrder ? (
            /* ================= ORDER SUCCESS CONFIRMATION ================= */
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-[#DCFCE7] text-[#15803D] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
                  Order Placed Successfully
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#262322] mt-1">
                  Thank You, {completedOrder.customerName}!
                </h3>
                <p className="text-xs text-[#5C544E] max-w-md mx-auto mt-1">
                  Your order has been recorded. Our team will verify your payment details and begin packaging your luxury attire.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D9] text-left max-w-md mx-auto shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE4]">
                  <span className="text-xs text-[#786E65]">Order Reference:</span>
                  <span className="text-sm font-bold text-[#701A28] font-mono">
                    {completedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#786E65]">Total Amount:</span>
                  <span className="font-bold text-[#262322]">
                    Rs. {completedOrder.totalNpr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#786E65]">Payment Method:</span>
                  <span className="font-bold uppercase text-[#701A28]">
                    {completedOrder.paymentMethod}
                  </span>
                </div>
                {completedOrder.transactionId && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#786E65]">Transaction ID:</span>
                    <span className="font-mono font-medium text-[#262322]">
                      {completedOrder.transactionId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs pt-1 border-t border-[#F2ECE4]">
                  <span className="text-[#786E65]">Delivery City:</span>
                  <span className="text-[#262322] font-medium">
                    {completedOrder.deliveryCity}
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp Verification Button */}
              <div className="max-w-md mx-auto space-y-2 pt-2">
                <a
                  id="btn-order-success-whatsapp"
                  href={getWhatsAppConfirmationUrl(completedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageCircle size={18} />
                  <span>Send Proof to WhatsApp (+977 {settings.whatsappNumber})</span>
                </a>
                <p className="text-[11px] text-[#786E65]">
                  Sending your payment screenshot to our WhatsApp speeds up verification and order dispatch!
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-white border border-[#D9D0C5] hover:border-[#701A28] text-xs font-semibold rounded-lg text-[#4A443F]"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          ) : (
            /* ================= CHECKOUT FORM & QR PAYMENT ================= */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Order Summary Pill */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8C8278] font-semibold flex items-center gap-1.5">
                    <span>Order Summary ({checkoutItems.length} {checkoutItems.length === 1 ? "piece" : "pieces"})</span>
                    {festiveDiscountAmount > 0 && (
                      <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded">
                        दसैँ-तिहार -{settings.festiveDiscountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#4A443F] font-medium line-clamp-1 mt-0.5">
                    {checkoutItems.map((i) => `${i.product.name} (${i.selectedSize})`).join(", ")}
                  </div>
                  {festiveDiscountAmount > 0 && (
                    <div className="text-[11px] text-[#15803D] font-medium mt-0.5">
                      Festive Savings: Rs. {festiveDiscountAmount.toLocaleString()} saved with {settings.festivePromoCode || "UTSAV15"}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-[#786E65]">Payable Total</div>
                  <div className="text-base font-bold text-[#701A28]">
                    Rs. {totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>


              {/* Step 1: Delivery Information */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D9] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#701A28] border-b border-[#F2ECE4] pb-2">
                  <MapPin size={15} />
                  <span>1. Delivery Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                      Full Name <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Shrestha"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] focus:ring-1 focus:ring-[#701A28] outline-none bg-[#FAF7F2]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                      Mobile / WhatsApp Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9841234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] focus:ring-1 focus:ring-[#701A28] outline-none bg-[#FAF7F2]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                      Delivery City / Region <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none bg-[#FAF7F2]/50"
                    >
                      <option value="Kathmandu">Kathmandu Valley (Inside Ring Road)</option>
                      <option value="Lalitpur">Lalitpur (Patan / Jhamsikhel / Sanepa)</option>
                      <option value="Bhaktapur">Bhaktapur / Thimi / Suryabinayak</option>
                      <option value="Pokhara">Pokhara Valley</option>
                      <option value="Chitwan">Chitwan (Bharatpur / Narayangarh)</option>
                      <option value="Butwal">Butwal / Bhairahawa</option>
                      <option value="Biratnagar">Biratnagar / Itahari / Dharan</option>
                      <option value="Nepalgunj">Nepalgunj / Surkhet</option>
                      <option value="Other Nepal City">Other Nepal District / Town</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                      Full Address & Landmark <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ward 4, Baluwatar, near Russian Embassy"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] focus:ring-1 focus:ring-[#701A28] outline-none bg-[#FAF7F2]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                    Special Sizing or Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Need sleeve length 22 inches, please pack with gift wrap"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] outline-none bg-[#FAF7F2]/50"
                  />
                </div>
              </div>

              {/* Step 2: Payment Gateway Selection */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D9] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#701A28] border-b border-[#F2ECE4] pb-2">
                  <CreditCard size={15} />
                  <span>2. Select Payment Gateway & Scan QR</span>
                </div>

                {/* Gateway Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* eSewa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("esewa")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      paymentMethod === "esewa"
                        ? "border-[#1B7A3C] bg-[#1B7A3C]/10 text-[#1B7A3C] font-bold shadow-sm ring-1 ring-[#1B7A3C]"
                        : "border-[#D9D0C5] bg-white text-[#5C544E] hover:border-[#1B7A3C]"
                    }`}
                  >
                    <span className="text-sm font-black tracking-tight">eSewa</span>
                    <span className="text-[10px] mt-0.5 opacity-80">QR / ID Pay</span>
                  </button>

                  {/* Khalti */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("khalti")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      paymentMethod === "khalti"
                        ? "border-[#5C2D91] bg-[#5C2D91]/10 text-[#5C2D91] font-bold shadow-sm ring-1 ring-[#5C2D91]"
                        : "border-[#D9D0C5] bg-white text-[#5C544E] hover:border-[#5C2D91]"
                    }`}
                  >
                    <span className="text-sm font-black tracking-tight">Khalti</span>
                    <span className="text-[10px] mt-0.5 opacity-80">Digital Wallet</span>
                  </button>

                  {/* Fonepay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("fonepay")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      paymentMethod === "fonepay"
                        ? "border-[#A31D1D] bg-[#A31D1D]/10 text-[#A31D1D] font-bold shadow-sm ring-1 ring-[#A31D1D]"
                        : "border-[#D9D0C5] bg-white text-[#5C544E] hover:border-[#A31D1D]"
                    }`}
                  >
                    <span className="text-sm font-black tracking-tight">Fonepay</span>
                    <span className="text-[10px] mt-0.5 opacity-80">Mobile Banking QR</span>
                  </button>

                  {/* WhatsApp Direct */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      paymentMethod === "whatsapp"
                        ? "border-[#25D366] bg-[#25D366]/10 text-[#128C7E] font-bold shadow-sm ring-1 ring-[#25D366]"
                        : "border-[#D9D0C5] bg-white text-[#5C544E] hover:border-[#25D366]"
                    }`}
                  >
                    <span className="text-sm font-black tracking-tight flex items-center gap-1">
                      <MessageCircle size={14} /> WhatsApp
                    </span>
                    <span className="text-[10px] mt-0.5 opacity-80">Manual Assist</span>
                  </button>
                </div>

                {/* QR Code Presentation Box */}
                {paymentMethod !== "whatsapp" ? (
                  <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-[#EFE8DF] flex flex-col sm:flex-row items-center gap-5">
                    {/* QR Canvas */}
                    <div className="bg-white p-3 rounded-xl border border-[#D9D0C5] shadow-sm shrink-0 flex flex-col items-center">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt={`${paymentMethod} QR code`}
                          className="w-44 h-44 object-contain"
                        />
                      ) : (
                        <div className="w-44 h-44 flex items-center justify-center text-xs text-[#8C8278]">
                          Generating QR...
                        </div>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#701A28] mt-1.5">
                        Scan to Pay Rs. {totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* QR Payment Instructions & Copy Fields */}
                    <div className="flex-1 space-y-2.5 text-xs text-[#4A443F]">
                      <div className="font-bold text-sm text-[#262322] flex items-center gap-1.5">
                        <span className="capitalize">{paymentMethod}</span> Payment Details
                      </div>

                      {paymentMethod === "esewa" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#E8E1D9]">
                            <span>eSewa ID: <strong>{settings.esewaId}</strong></span>
                            <button
                              type="button"
                              onClick={() => handleCopy(settings.esewaId, "esewa")}
                              className="text-[11px] text-[#1B7A3C] font-semibold flex items-center gap-1 hover:underline"
                            >
                              {copiedField === "esewa" ? <Check size={13} /> : <Copy size={13} />}
                              {copiedField === "esewa" ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="text-[11px] text-[#786E65]">
                            Receiver: <strong>{settings.esewaName}</strong>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "khalti" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#E8E1D9]">
                            <span>Khalti ID: <strong>{settings.khaltiId}</strong></span>
                            <button
                              type="button"
                              onClick={() => handleCopy(settings.khaltiId, "khalti")}
                              className="text-[11px] text-[#5C2D91] font-semibold flex items-center gap-1 hover:underline"
                            >
                              {copiedField === "khalti" ? <Check size={13} /> : <Copy size={13} />}
                              {copiedField === "khalti" ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="text-[11px] text-[#786E65]">
                            Receiver: <strong>{settings.khaltiName}</strong>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "fonepay" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#E8E1D9]">
                            <span>Merchant Code: <strong>{settings.fonepayMerchantCode}</strong></span>
                            <button
                              type="button"
                              onClick={() => handleCopy(settings.fonepayMerchantCode, "fonepay")}
                              className="text-[11px] text-[#A31D1D] font-semibold flex items-center gap-1 hover:underline"
                            >
                              {copiedField === "fonepay" ? <Check size={13} /> : <Copy size={13} />}
                              {copiedField === "fonepay" ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="text-[11px] text-[#786E65]">
                            Merchant: <strong>{settings.fonepayMerchantName}</strong>
                          </div>
                        </div>
                      )}

                      <div className="p-2 bg-white rounded-lg border border-[#E8E1D9] text-[11px] text-[#6B6158]">
                        <p className="font-semibold text-[#262322] mb-0.5">Quick Steps:</p>
                        <ol className="list-decimal list-inside space-y-0.5">
                          <li>Open your {paymentMethod.toUpperCase()} or Mobile Banking app</li>
                          <li>Scan the QR code above or send to the ID</li>
                          <li>Copy the Transaction/Reference ID and paste below</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#25D366]/10 p-4 rounded-xl border border-[#25D366]/30 text-xs text-[#128C7E] space-y-2">
                    <div className="font-bold text-sm text-[#075E54] flex items-center gap-1.5">
                      <MessageCircle size={18} />
                      Direct WhatsApp Assistance (+977 {settings.whatsappNumber})
                    </div>
                    <p>
                      Prefer paying via manual bank transfer or want personal sizing advice? Submit this order and our atelier will reach out to you immediately on WhatsApp to finalize payment and courier dispatch.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 3: Transaction ID & Receipt Proof */}
              {paymentMethod !== "whatsapp" && (
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D9] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#701A28] border-b border-[#F2ECE4] pb-2">
                    <ShieldCheck size={15} />
                    <span>3. Payment Verification Details</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                      Transaction / Reference ID <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 98421094 or 7721839"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D9D0C5] focus:border-[#701A28] font-mono tracking-wider outline-none bg-[#FAF7F2]/50"
                    />
                    <p className="text-[10px] text-[#8C8278] mt-1">
                      Found in your {paymentMethod.toUpperCase()} payment confirmation screen.
                    </p>
                  </div>

                  {/* Screenshot upload */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A443F] mb-1">
                      Attach Payment Screenshot (Recommended for instant approval)
                    </label>
                    <div className="border-2 border-dashed border-[#D9D0C5] hover:border-[#701A28] rounded-xl p-4 text-center bg-[#FAF7F2]/40 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        id="proof-file-input"
                        onChange={handleProofUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="proof-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                      >
                        <Upload size={20} className="text-[#701A28]" />
                        <span className="text-xs font-semibold text-[#701A28]">
                          {proofFileName ? `Selected: ${proofFileName}` : "Click to select or drop screenshot proof"}
                        </span>
                        <span className="text-[10px] text-[#8C8278]">
                          PNG, JPG up to 5MB
                        </span>
                      </label>

                      {paymentProofUrl && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <img
                            src={paymentProofUrl}
                            alt="Uploaded proof"
                            className="h-16 w-16 object-cover rounded-lg border border-[#D9D0C5]"
                          />
                          <span className="text-xs text-[#15803D] font-medium flex items-center gap-1">
                            <Check size={14} /> Receipt attached
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner if any */}
              {errorMessage && (
                <div className="p-3 bg-[#FEE2E2] text-[#B91C1C] rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-submit-order"
                  className="w-full py-3.5 px-4 bg-[#701A28] hover:bg-[#58121E] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <CheckCircle2 size={18} />
                  <span>
                    Confirm & Submit Order (Rs. {totalAmount.toLocaleString()})
                  </span>
                </button>
                <p className="text-[11px] text-center text-[#8C8278] mt-2">
                  Dawosti guarantees 100% genuine craftsmanship and prompt logistics support across Nepal.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
