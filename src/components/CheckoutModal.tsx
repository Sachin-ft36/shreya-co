import React, { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  CreditCard,
  Gift,
  Landmark,
  Lock,
  MapPin,
  MessageSquare,
  PackageCheck,
  Printer,
  ShieldCheck,
  Smartphone,
  Truck,
  X
} from 'lucide-react';
import {
  AddressType,
  CartItem,
  CurrencyCode,
  DeliveryAddress,
  PaymentMethod,
  PlacedOrder
} from '../types/storefront';
import { getEstimatedDeliveryLabel, lookupIndianPincode } from '../utils/delivery';
import { formatPrice, handleImgError } from '../utils/pricing';
import { getWhatsAppOrderUrl, printShippingLabel } from '../utils/whatsapp';
import { HallmarkGlyph } from './HallmarkGlyph';

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  subtotalInr: number;
  discountInr: number;
  totalInr: number;
  appliedDiscountPct: number;
  clientCode: string;
  initialAddress: DeliveryAddress;
  giftWrap: boolean;
  giftNote: string;
  onClose: () => void;
  onSetClientCode: (code: string) => void;
  onApplyPromo: (overrideCode?: string) => void;
  onSetGiftWrap: (val: boolean) => void;
  onSetGiftNote: (note: string) => void;
  onPlaceOrder: (payload: {
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    paymentSummary: string;
    estimatedDelivery: string;
  }) => PlacedOrder;
  onOpenOrders: () => void;
}

const POPULAR_BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'];

/**
 * Full-featured Pan-India luxury e-commerce checkout flow:
 * 01. Delivery Address & PIN Code ETA -> 02. Payment Method -> 03. Review & Place Order -> Confirmation.
 */
export function CheckoutModal({
  open,
  items,
  currency,
  subtotalInr,
  discountInr,
  totalInr,
  appliedDiscountPct,
  clientCode,
  initialAddress,
  giftWrap,
  giftNote,
  onClose,
  onSetClientCode,
  onApplyPromo,
  onSetGiftWrap,
  onSetGiftNote,
  onPlaceOrder,
  onOpenOrders
}: CheckoutModalProps) {
  const [step, setStep] = useState<'address' | 'payment' | 'review' | 'confirmed'>('address');
  const [address, setAddress] = useState<DeliveryAddress>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM UPI'>('Google Pay');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState(POPULAR_BANKS[0]);
  const [formError, setFormError] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    if (open) {
      setStep('address');
      setAddress(initialAddress);
      setFormError('');
      setIsPlacing(false);
      setConfirmedOrder(null);
    }
  }, [open, initialAddress]);

  if (!open) return null;

  const pinStatus = lookupIndianPincode(address.pincode);
  const estimatedDelivery = pinStatus.valid
    ? pinStatus.etaLabel
    : getEstimatedDeliveryLabel(4);

  const handlePincodeChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 6);
    const matched = lookupIndianPincode(digitsOnly);
    setAddress((prev) => ({
      ...prev,
      pincode: digitsOnly,
      city: matched.valid ? matched.city : prev.city,
      state: matched.valid ? matched.state : prev.state
    }));
    setFormError('');
  };

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = address.phone.replace(/\D/g, '');
    if (!address.fullName.trim()) {
      setFormError('Please enter recipient full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
      setFormError('Please enter a valid email address for your GST invoice.');
      return;
    }
    if (cleanedPhone.length < 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!pinStatus.valid) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!address.street.trim() || !address.city.trim() || !address.state.trim()) {
      setFormError('Please complete your house/street address, city, and state.');
      return;
    }
    setFormError('');
    setStep('payment');
  };

  const buildPaymentSummary = (): { ok: boolean; summary: string; error?: string } => {
    if (paymentMethod === 'upi') {
      const cleanUpi = upiId.trim();
      if (cleanUpi && !cleanUpi.includes('@')) {
        return { ok: false, summary: '', error: 'Enter a valid UPI ID (e.g. name@okaxis) or leave blank for quick app prompt.' };
      }
      return {
        ok: true,
        summary: cleanUpi ? `${upiApp} (${cleanUpi})` : `${upiApp} (Instant UPI Request)`
      };
    }
    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\D/g, '');
      if (digits.length < 12) {
        return { ok: false, summary: '', error: 'Please enter a valid 12–16 digit card number (test/demo).' };
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
        return { ok: false, summary: '', error: 'Enter card expiry in MM/YY format.' };
      }
      if (cardCvv.replace(/\D/g, '').length < 3) {
        return { ok: false, summary: '', error: 'Enter 3 or 4 digit security code.' };
      }
      return {
        ok: true,
        summary: `Card ending •••• ${digits.slice(-4)}`
      };
    }
    if (paymentMethod === 'netbanking') {
      return {
        ok: true,
        summary: `Net Banking · ${selectedBank}`
      };
    }
    return {
      ok: true,
      summary: 'Pay on Insured Delivery (OTP + Photo-ID Handover)'
    };
  };

  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    const check = buildPaymentSummary();
    if (!check.ok) {
      setFormError(check.error || 'Please verify payment details.');
      return;
    }
    setFormError('');
    setStep('review');
  };

  const handleConfirmAndPlaceOrder = () => {
    const check = buildPaymentSummary();
    if (!check.ok) {
      setFormError(check.error || 'Please review payment details.');
      setStep('payment');
      return;
    }
    setIsPlacing(true);
    window.setTimeout(() => {
      const created = onPlaceOrder({
        address,
        paymentMethod,
        paymentSummary: check.summary,
        estimatedDelivery
      });
      setConfirmedOrder(created);
      setIsPlacing(false);
      setStep('confirmed');
      try {
        const waUrl = getWhatsAppOrderUrl(created);
        window.open(waUrl, '_blank');
      } catch {
        // popup blocker fallback
      }
    }, 850);
  };

  const formatCardInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const gstIncludedInr = Math.round((totalInr * 3) / 103);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/72 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => !isPlacing && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF1F0] max-w-5xl w-full border border-[#2B1C1E]/20 shadow-[0_32px_68px_-20px_rgba(43,28,30,0.45)] my-auto ao-panel-enter overflow-hidden"
      >
        {/* Top Brand Checkout Header */}
        <div className="px-6 md:px-10 py-5 border-b border-[#2B1C1E]/12 bg-[#FDF8F7] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/shreya-logo-seal.png"
              alt="Shreya & Co."
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="font-serif text-lg md:text-xl tracking-[0.2em] uppercase block">
                SHREYA &amp; CO. · Checkout
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#9A6058]">
                Insured Pan-India Vault Delivery · BIS 750 HUID &amp; GST Invoice
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isPlacing}
            onClick={onClose}
            aria-label="Close checkout"
            className="text-[#2B1C1E]/75 hover:text-[#2B1C1E] p-1"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 'confirmed' && (
          <div className="px-6 md:px-10 py-3.5 bg-[#F3E4E2]/70 border-b border-[#2B1C1E]/10 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.22em]">
            {[
              { id: 'address' as const, num: '01', label: 'Delivery Address' },
              { id: 'payment' as const, num: '02', label: 'Payment Method' },
              { id: 'review' as const, num: '03', label: 'Review & Place Order' }
            ].map((s, idx) => {
              const order = ['address', 'payment', 'review'];
              const currentIdx = order.indexOf(step);
              const sIdx = order.indexOf(s.id);
              const isDone = sIdx < currentIdx;
              const isCurrent = sIdx === currentIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={sIdx > currentIdx || isPlacing}
                  onClick={() => sIdx < currentIdx && setStep(s.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isCurrent
                      ? 'text-[#2B1C1E] font-semibold'
                      : isDone
                      ? 'text-[#9A6058] hover:text-[#2B1C1E]'
                      : 'text-[#2B1C1E]/40 cursor-default'
                  }`}
                >
                  <span
                    className={`ao-num w-5 h-5 rounded-full flex items-center justify-center text-[9px] border ${
                      isCurrent
                        ? 'bg-[#2B1C1E] text-[#FAF1F0] border-[#2B1C1E]'
                        : isDone
                        ? 'bg-[#BC8379] text-[#FAF1F0] border-[#BC8379]'
                        : 'border-[#2B1C1E]/25'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                  {idx < 2 && <span className="text-[#2B1C1E]/25 pl-2">/</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirmation Screen */}
        {step === 'confirmed' && confirmedOrder ? (
          <div className="p-6 md:p-10 max-h-[82vh] overflow-y-auto space-y-8 ao-panel-enter">
            <div className="bg-[#FDF8F7] border border-[#2B1C1E]/15 p-6 md:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B1C1E]/10 pb-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 text-[#9A6058]">
                    <PackageCheck className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.28em] font-medium">
                      Order Successfully Placed
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2B1C1E]">
                    Thank you, {confirmedOrder.address.fullName.split(' ')[0]}
                  </h2>
                  <p className="text-xs text-[#2B1C1E]/70">
                    Order <strong className="font-mono-spec text-[#2B1C1E]">{confirmedOrder.orderId}</strong> is confirmed. Your BIS HUID dossier &amp; 3% GST tax invoice have been logged for{' '}
                    <strong className="font-medium">{confirmedOrder.address.email}</strong>.
                  </p>
                </div>

                <div className="bg-[#F3E4E2] border border-[#2B1C1E]/12 px-4 py-3 text-left sm:text-right flex-shrink-0">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#9A6058] block">
                    Estimated Insured Delivery
                  </span>
                  <span className="font-serif text-lg text-[#2B1C1E]">
                    {confirmedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* WhatsApp Slip Banner */}
              <div className="border border-[#25D366]/40 bg-[#E8F8EE] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#111]">
                      Courier Dispatch Slip Generated for WhatsApp
                    </p>
                    <p className="text-[11px] text-[#444] font-light">
                      Order details and formatted address slip are ready to be sent to WhatsApp for packing and shipping.
                    </p>
                  </div>
                </div>
                <a
                  href={getWhatsAppOrderUrl(confirmedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-[#25D366] text-white px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-[#1EBE5D] transition-colors flex-shrink-0"
                >
                  <span>Open WhatsApp</span>
                </a>
              </div>

              {/* Live 4-stage Tracking Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                {[
                  { title: 'Order Confirmed', desc: 'Allocation locked', active: true },
                  { title: 'BIS HUID Assay', desc: 'Purity & prong QA', active: false },
                  { title: 'Insured Dispatch', desc: 'Tamper-evident vault', active: false },
                  { title: 'OTP Handover', desc: 'Pan-India courier', active: false }
                ].map((stage, i) => (
                  <div
                    key={stage.title}
                    className={`p-3 border ${
                      stage.active
                        ? 'border-[#2B1C1E] bg-[#F3E4E2]/80'
                        : 'border-[#2B1C1E]/12 bg-[#FAF1F0]/60 opacity-65'
                    }`}
                  >
                    <span className="font-mono-spec text-[9px] text-[#9A6058] block mb-1">
                      STEP 0{i + 1}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] font-medium block">
                      {stage.title}
                    </span>
                    <span className="text-[11px] text-[#2B1C1E]/65 font-light">{stage.desc}</span>
                  </div>
                ))}
              </div>

              {/* Address, Payment & Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-[#2B1C1E]/10 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#9A6058] block">
                    Delivering To ({confirmedOrder.address.addressType})
                  </span>
                  <p className="font-medium text-[#2B1C1E]">{confirmedOrder.address.fullName}</p>
                  <p className="text-[#2B1C1E]/75 font-light leading-relaxed">
                    {confirmedOrder.address.street}
                    {confirmedOrder.address.landmark ? `, ${confirmedOrder.address.landmark}` : ''}
                    <br />
                    {confirmedOrder.address.city}, {confirmedOrder.address.state} —{' '}
                    <span className="ao-num">{confirmedOrder.address.pincode}</span>
                  </p>
                  <p className="ao-num text-[#2B1C1E]/75">{confirmedOrder.address.phone}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#9A6058] block">
                    Payment Method
                  </span>
                  <p className="font-medium text-[#2B1C1E]">{confirmedOrder.paymentSummary}</p>
                  <p className="text-[#2B1C1E]/70 font-light">
                    Total Valuation:{' '}
                    <strong className="ao-num text-[#2B1C1E]">
                      {formatPrice(confirmedOrder.totalInr, currency)}
                    </strong>
                  </p>
                  {confirmedOrder.giftWrap && (
                    <p className="text-[#9A6058] italic font-serif">
                      Includes Signature Rose-Gold Box{confirmedOrder.giftNote ? ` · “${confirmedOrder.giftNote}”` : ''}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#9A6058] block">
                    Ordered Pieces ({confirmedOrder.items.reduce((s, x) => s + x.quantity, 0)})
                  </span>
                  {confirmedOrder.items.map((item) => (
                    <div key={item.key} className="flex items-center space-x-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={handleImgError}
                        className="w-10 h-12 object-cover border border-[#2B1C1E]/12"
                      />
                      <div className="min-w-0">
                        <p className="font-serif text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-[#2B1C1E]/65">
                          {item.metal} · {item.size} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-end">
              <a
                href={getWhatsAppOrderUrl(confirmedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-[#25D366] text-white px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#1EBE5D] transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => printShippingLabel(confirmedOrder)}
                className="inline-flex items-center justify-center space-x-2 border-2 border-[#2B1C1E] bg-[#2B1C1E] text-[#FAF1F0] px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#9A6058] transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Box Shipping Label</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center space-x-2 border border-[#2B1C1E]/30 px-4 py-3.5 text-[10px] uppercase tracking-[0.2em] hover:border-[#2B1C1E] transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Full GST Dossier</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="inline-flex items-center justify-center space-x-2 border border-[#2B1C1E] bg-[#F3E4E2] px-4 py-3.5 text-[10px] uppercase tracking-[0.2em] hover:bg-[#ECD8D6] transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center border border-[#2B1C1E]/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#2B1C1E] hover:text-[#FAF1F0] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          /* Two-Column Active Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
            {/* Left 7 Columns: Steps */}
            <div className="lg:col-span-7 p-6 md:p-9 space-y-6 border-b lg:border-b-0 lg:border-r border-[#2B1C1E]/12">
              {formError && (
                <div
                  role="alert"
                  className="border border-[#9A6058] bg-[#F3E4E2] px-4 py-3 text-xs text-[#2B1C1E] font-medium"
                >
                  {formError}
                </div>
              )}

              {step === 'address' && (
                <form onSubmit={handleAddressNext} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-light">Delivery Details</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A6058]">
                      Pan-India Insured Dispatch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="Recipient Full Name (Aadhaar / ID)"
                        className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        Mobile Number (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="+91 98200 XXXXX"
                        className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        Email (GST Invoice &amp; Tracking) *
                      </label>
                      <input
                        type="email"
                        required
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        placeholder="client@domain.in"
                        className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        6-Digit PIN Code *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="e.g. 400001"
                        className="ao-num w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                  </div>

                  {address.pincode.length > 0 && (
                    <div
                      className={`px-3.5 py-2.5 border text-[11px] flex items-center space-x-2 ${
                        pinStatus.valid
                          ? 'bg-[#F3E4E2] border-[#BC8379]/45 text-[#2B1C1E]'
                          : 'bg-[#FDF8F7] border-[#2B1C1E]/20 text-[#2B1C1E]/70'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#9A6058] flex-shrink-0" />
                      <span>
                        {pinStatus.valid
                          ? `${pinStatus.city}, ${pinStatus.state} · Estimated delivery by ${pinStatus.etaLabel}`
                          : pinStatus.serviceNote}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                      Flat, House No., Building, Street *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Apartment / Bungalow / Street & Locality"
                      className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Mumbai"
                        className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        placeholder="Maharashtra"
                        className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-1.5">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.landmark}
                        onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                        placeholder="Near Kala Ghoda"
                        className="w-full border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    </div>
                  </div>

                  {/* Address Type */}
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#2B1C1E]/65 mb-2">
                      Delivery Preference
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(['Home', 'Office', 'Salon Pickup'] as AddressType[]).map((kind) => (
                        <button
                          key={kind}
                          type="button"
                          onClick={() => setAddress({ ...address, addressType: kind })}
                          className={`px-4 py-2 border text-[10px] uppercase tracking-[0.18em] transition-colors ${
                            address.addressType === kind
                              ? 'bg-[#2B1C1E] text-[#FAF1F0] border-[#2B1C1E]'
                              : 'border-[#2B1C1E]/25 bg-[#FDF8F7] text-[#2B1C1E]/80 hover:border-[#2B1C1E]'
                          }`}
                        >
                          {kind}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gift Packaging */}
                  <div className="border border-[#2B1C1E]/12 bg-[#F3E4E2]/70 p-4 space-y-3">
                    <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => onSetGiftWrap(e.target.checked)}
                        className="accent-[#2B1C1E]"
                      />
                      <Gift className="w-4 h-4 text-[#9A6058]" />
                      <span>Complimentary Rose-Gold Presentation Box &amp; Cotton Correspondence Card</span>
                    </label>
                    {giftWrap && (
                      <input
                        type="text"
                        value={giftNote}
                        onChange={(e) => onSetGiftNote(e.target.value)}
                        placeholder="Add personal message to inscribe inside card..."
                        className="w-full border border-[#2B1C1E]/20 bg-[#FDF8F7] px-3 py-2 text-xs focus:outline-none focus:border-[#2B1C1E]"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2B1C1E] text-[#FAF1F0] py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] transition-colors"
                  >
                    Continue to Payment Method
                  </button>
                </form>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePaymentNext} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-light">Select Payment Method</h3>
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="text-[10px] uppercase tracking-[0.2em] text-[#9A6058] hover:text-[#2B1C1E] underline underline-offset-4"
                    >
                      Edit Address
                    </button>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {/* 1. UPI */}
                    <div
                      className={`border p-4 transition-colors ${
                        paymentMethod === 'upi'
                          ? 'border-[#2B1C1E] bg-[#FDF8F7]'
                          : 'border-[#2B1C1E]/18 bg-[#FAF1F0]'
                      }`}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                            className="accent-[#2B1C1E]"
                          />
                          <Smartphone className="w-4 h-4 text-[#9A6058]" />
                          <div>
                            <span className="text-xs font-medium uppercase tracking-[0.16em] block">
                              UPI (Google Pay · PhonePe · Paytm · BHIM)
                            </span>
                            <span className="text-[11px] text-[#2B1C1E]/60">
                              Zero convenience fee · Instant authorization
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.2em] bg-[#F3E4E2] px-2 py-1 text-[#9A6058]">
                          Recommended
                        </span>
                      </label>

                      {paymentMethod === 'upi' && (
                        <div className="mt-4 pt-3 border-t border-[#2B1C1E]/10 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {(['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'] as const).map((app) => (
                              <button
                                key={app}
                                type="button"
                                onClick={() => setUpiApp(app)}
                                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] border ${
                                  upiApp === app
                                    ? 'border-[#2B1C1E] bg-[#2B1C1E] text-[#FAF1F0]'
                                    : 'border-[#2B1C1E]/20 text-[#2B1C1E]/75'
                                }`}
                              >
                                {app}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Optional UPI ID (e.g. shreya@okhdfcbank) — or pay via app prompt"
                            className="w-full border border-[#2B1C1E]/25 bg-[#FAF1F0] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                          />
                        </div>
                      )}
                    </div>

                    {/* 2. Credit / Debit Card */}
                    <div
                      className={`border p-4 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-[#2B1C1E] bg-[#FDF8F7]'
                          : 'border-[#2B1C1E]/18 bg-[#FAF1F0]'
                      }`}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-[#2B1C1E]"
                        />
                        <CreditCard className="w-4 h-4 text-[#9A6058]" />
                        <div>
                          <span className="text-xs font-medium uppercase tracking-[0.16em] block">
                            Credit / Debit Card
                          </span>
                          <span className="text-[11px] text-[#2B1C1E]/60">
                            Visa · Mastercard · RuPay · American Express
                          </span>
                        </div>
                      </label>

                      {paymentMethod === 'card' && (
                        <div className="mt-4 pt-3 border-t border-[#2B1C1E]/10 space-y-3">
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Name on Card"
                            className="w-full border border-[#2B1C1E]/25 bg-[#FAF1F0] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                            placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                            className="ao-num w-full border border-[#2B1C1E]/25 bg-[#FAF1F0] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiryInput(e.target.value))}
                              placeholder="MM/YY"
                              className="ao-num border border-[#2B1C1E]/25 bg-[#FAF1F0] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                            />
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="CVV"
                              className="ao-num border border-[#2B1C1E]/25 bg-[#FAF1F0] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B1C1E]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Net Banking */}
                    <div
                      className={`border p-4 transition-colors ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#2B1C1E] bg-[#FDF8F7]'
                          : 'border-[#2B1C1E]/18 bg-[#FAF1F0]'
                      }`}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="accent-[#2B1C1E]"
                        />
                        <Landmark className="w-4 h-4 text-[#9A6058]" />
                        <div>
                          <span className="text-xs font-medium uppercase tracking-[0.16em] block">
                            Net Banking (High-Value Jewellery RTGS / IMPS)
                          </span>
                          <span className="text-[11px] text-[#2B1C1E]/60">
                            HDFC · ICICI · SBI · Axis · Kotak
                          </span>
                        </div>
                      </label>

                      {paymentMethod === 'netbanking' && (
                        <div className="mt-4 pt-3 border-t border-[#2B1C1E]/10 flex flex-wrap gap-2">
                          {POPULAR_BANKS.map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] border ${
                                selectedBank === bank
                                  ? 'border-[#2B1C1E] bg-[#2B1C1E] text-[#FAF1F0]'
                                  : 'border-[#2B1C1E]/20 text-[#2B1C1E]/75'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 4. Cash / Card on Delivery */}
                    <div
                      className={`border p-4 transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-[#2B1C1E] bg-[#FDF8F7]'
                          : 'border-[#2B1C1E]/18 bg-[#FAF1F0]'
                      }`}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-[#2B1C1E]"
                        />
                        <Building2 className="w-4 h-4 text-[#9A6058]" />
                        <div>
                          <span className="text-xs font-medium uppercase tracking-[0.16em] block">
                            Pay on Insured Handover (UPI / Card / Cash)
                          </span>
                          <span className="text-[11px] text-[#2B1C1E]/60">
                            Verify parcel seal + OTP at doorstep before payment
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#2B1C1E]/55 flex items-center space-x-2">
                    <Lock className="w-3.5 h-3.5 text-[#9A6058] flex-shrink-0" />
                    <span>
                      Atelier Demo Checkout — simulates real brand placement &amp; order tracking without charging real money.
                    </span>
                  </p>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="border border-[#2B1C1E]/30 px-6 py-4 text-[10px] uppercase tracking-[0.22em]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-grow bg-[#2B1C1E] text-[#FAF1F0] py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] transition-colors"
                    >
                      Review Order Summary
                    </button>
                  </div>
                </form>
              )}

              {step === 'review' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-light">Review &amp; Place Order</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A6058]">
                      Final Step
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-[#2B1C1E]/15 bg-[#FDF8F7] p-4 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.22em] text-[#9A6058]">
                          Delivery Address
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep('address')}
                          className="text-[10px] uppercase tracking-[0.16em] underline"
                        >
                          Change
                        </button>
                      </div>
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-[#2B1C1E]/75 font-light">
                        {address.street}
                        <br />
                        {address.city}, {address.state} — {address.pincode}
                      </p>
                      <p className="ao-num text-[#2B1C1E]/75">{address.phone}</p>
                    </div>

                    <div className="border border-[#2B1C1E]/15 bg-[#FDF8F7] p-4 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.22em] text-[#9A6058]">
                          Payment &amp; Transit
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep('payment')}
                          className="text-[10px] uppercase tracking-[0.16em] underline"
                        >
                          Change
                        </button>
                      </div>
                      <p className="font-medium">{buildPaymentSummary().summary}</p>
                      <p className="text-[#2B1C1E]/75 font-light">
                        Est. Arrival: <strong className="font-medium text-[#2B1C1E]">{estimatedDelivery}</strong>
                      </p>
                      <p className="text-[#2B1C1E]/65 text-[11px]">
                        OTP &amp; Photo-ID mandatory at delivery
                      </p>
                    </div>
                  </div>

                  <div className="border border-[#2B1C1E]/12 bg-[#F3E4E2] p-4 flex items-start space-x-3 text-xs text-[#2B1C1E]/80">
                    <ShieldCheck className="w-4 h-4 text-[#9A6058] flex-shrink-0 mt-0.5" />
                    <span>
                      Each piece undergoes final BIS 750 HUID laser verification and ships in a tamper-evident vault parcel with full transit insurance across India.
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      disabled={isPlacing}
                      onClick={() => setStep('payment')}
                      className="border border-[#2B1C1E]/30 px-6 py-4 text-[10px] uppercase tracking-[0.22em]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isPlacing}
                      onClick={handleConfirmAndPlaceOrder}
                      className="ao-num flex-grow bg-[#2B1C1E] text-[#FAF1F0] py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-[#9A6058] transition-colors disabled:opacity-70"
                    >
                      {isPlacing
                        ? 'Securing Vault Allocation...'
                        : `Place Order — ${formatPrice(totalInr, currency)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Sticky Order Bag Summary */}
            <div className="lg:col-span-5 bg-[#F3E4E2]/65 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B1C1E]/12 pb-3">
                  <span className="text-[10px] uppercase tracking-[0.24em] font-medium text-[#2B1C1E]">
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A6058]">
                    GST Compliant
                  </span>
                </div>

                <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center space-x-3.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={handleImgError}
                        className="w-14 h-16 object-cover border border-[#2B1C1E]/12 bg-[#ECD8D6] flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <p className="font-serif text-sm truncate">{item.name}</p>
                        <p className="text-[10px] text-[#2B1C1E]/65">
                          {item.metal} · {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="ao-num text-xs font-medium flex-shrink-0">
                        {formatPrice(item.unitPriceInr * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code inside Checkout */}
                <div className="pt-2 border-t border-[#2B1C1E]/10 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={clientCode}
                      onChange={(e) => onSetClientCode(e.target.value)}
                      placeholder="Privilege code (ATELIER10 / WELCOME5)"
                      className="flex-grow border border-[#2B1C1E]/25 bg-[#FDF8F7] px-3 py-2 text-[11px] focus:outline-none focus:border-[#2B1C1E]"
                    />
                    <button
                      type="button"
                      onClick={() => onApplyPromo()}
                      className="border border-[#2B1C1E]/30 px-4 text-[10px] uppercase tracking-[0.18em] hover:bg-[#2B1C1E] hover:text-[#FAF1F0] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-[#2B1C1E]/60">
                    <span>Try:</span>
                    {['ATELIER10', 'WELCOME5'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          onSetClientCode(c);
                          onApplyPromo(c);
                        }}
                        className="font-mono-spec underline underline-offset-2 text-[#9A6058] hover:text-[#2B1C1E]"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2B1C1E]/15 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#2B1C1E]/75">
                  <span>Subtotal</span>
                  <span className="ao-num">{formatPrice(subtotalInr, currency)}</span>
                </div>
                <div className="flex justify-between text-[#2B1C1E]/65 text-[11px]">
                  <span>Included 3% Jewellery GST</span>
                  <span className="ao-num">{formatPrice(gstIncludedInr, currency)}</span>
                </div>
                <div className="flex justify-between text-[#2B1C1E]/75">
                  <span>Insured Pan-India Transit</span>
                  <span className="text-[#9A6058] uppercase tracking-[0.16em] text-[10px] font-medium">
                    Complimentary
                  </span>
                </div>
                {appliedDiscountPct > 0 && (
                  <div className="flex justify-between text-[#9A6058]">
                    <span>Privilege Savings ({appliedDiscountPct}%)</span>
                    <span className="ao-num">-{formatPrice(discountInr, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline border-t border-[#2B1C1E]/15 pt-3 text-sm font-medium">
                  <span className="uppercase tracking-[0.18em] text-xs">Total Payable</span>
                  <span className="ao-num text-base">{formatPrice(totalInr, currency)}</span>
                </div>

                <div className="pt-2 flex items-center space-x-2 text-[10px] text-[#2B1C1E]/55">
                  <HallmarkGlyph className="w-3 h-3 text-[#9A6058] flex-shrink-0" />
                  <span>14-Day Insured Exchange · Lifetime Salon Ultrasonic Cleaning</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

