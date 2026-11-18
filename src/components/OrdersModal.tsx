import { MessageSquare, Package, Printer, RotateCcw, Truck, X } from 'lucide-react';
import { CurrencyCode, OrderStatusStep, PlacedOrder } from '../types/storefront';
import { formatPrice, handleImgError } from '../utils/pricing';
import { getWhatsAppOrderUrl, printShippingLabel } from '../utils/whatsapp';
import { HallmarkGlyph } from './HallmarkGlyph';

interface OrdersModalProps {
  open: boolean;
  orders: PlacedOrder[];
  currency: CurrencyCode;
  onClose: () => void;
  onAdvanceStatus: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onReorder: (order: PlacedOrder) => void;
}

const TRACKING_STEPS = [
  'Order Confirmed',
  'BIS HUID Assay & QA',
  'Insured Vault Dispatch',
  'Delivered (OTP Verified)'
];

/** Persistent Client Orders modal with live 4-stage tracking, reorder, and cancellation. */
export function OrdersModal({
  open,
  orders,
  currency,
  onClose,
  onAdvanceStatus,
  onCancelOrder,
  onReorder
}: OrdersModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B1C1E]/72 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF1F0] max-w-4xl w-full border border-[#2B1C1E]/20 p-6 md:p-10 relative my-auto ao-panel-enter max-h-[88vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-[#2B1C1E]/12 pb-5 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#9A6058] mb-1">
              <HallmarkGlyph className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-[0.28em]">Client Allocation Archive</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-light">
              My Orders &amp; Tracking ({orders.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close orders"
            className="text-[#2B1C1E]/75 hover:text-[#2B1C1E] p-1"
          >
            <X className="w-6 h-6 stroke-[1.4]" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-6 pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3 border border-[#2B1C1E]/10 bg-[#FDF8F7]">
              <Package className="w-8 h-8 text-[#9A6058] mx-auto stroke-[1.2]" />
              <p className="font-serif text-xl text-[#2B1C1E]">No orders placed yet</p>
              <p className="text-xs text-[#2B1C1E]/65 max-w-sm mx-auto">
                Add any fine jewellery piece to your bag or click Buy Now to experience our full Pan-India vault checkout and live order tracking.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <article
                key={order.orderId}
                className="border border-[#2B1C1E]/15 bg-[#FDF8F7] p-5 md:p-6 space-y-5"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B1C1E]/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono-spec text-xs font-medium text-[#2B1C1E]">
                        {order.orderId}
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 border ${
                          order.cancelled
                            ? 'border-[#2B1C1E]/25 bg-[#F0DFDD] text-[#2B1C1E]/65'
                            : 'border-[#BC8379] bg-[#F3E4E2] text-[#9A6058] font-medium'
                        }`}
                      >
                        {order.cancelled ? 'Cancelled' : TRACKING_STEPS[order.statusStep]}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2B1C1E]/60">
                      Placed on {order.placedAt} · {order.paymentSummary}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="ao-num text-base font-medium block">
                      {formatPrice(order.totalInr, currency)}
                    </span>
                    {!order.cancelled && (
                      <span className="text-[10px] text-[#9A6058]">
                        ETA: {order.estimatedDelivery}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Timeline */}
                {!order.cancelled && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {TRACKING_STEPS.map((label, idx) => {
                      const reached = idx <= order.statusStep;
                      return (
                        <div
                          key={label}
                          className={`p-2.5 border text-[10px] transition-colors ${
                            reached
                              ? 'border-[#2B1C1E]/40 bg-[#F3E4E2] text-[#2B1C1E]'
                              : 'border-[#2B1C1E]/10 bg-[#FAF1F0]/60 text-[#2B1C1E]/45'
                          }`}
                        >
                          <span className="font-mono-spec text-[9px] block mb-0.5">0{idx + 1}</span>
                          <span className="uppercase tracking-[0.14em] font-medium">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Items & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  <div className="md:col-span-7 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.key} className="flex items-center space-x-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={handleImgError}
                          className="w-14 h-16 object-cover border border-[#2B1C1E]/12 bg-[#ECD8D6] flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <span className="font-mono-spec text-[9px] text-[#9A6058] block">
                            {item.sku}
                          </span>
                          <h4 className="font-serif text-sm truncate">{item.name}</h4>
                          <p className="text-[11px] text-[#2B1C1E]/65">
                            {item.metal} · {item.size} · Qty {item.quantity}
                          </p>
                        </div>
                        <span className="ao-num text-xs font-medium flex-shrink-0">
                          {formatPrice(item.unitPriceInr * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#2B1C1E]/10 pt-3 md:pt-0 md:pl-5 text-xs space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#9A6058] block">
                      Vault Destination
                    </span>
                    <p className="font-medium">{order.address.fullName}</p>
                    <p className="text-[#2B1C1E]/70 font-light">
                      {order.address.street}, {order.address.city}, {order.address.state} —{' '}
                      <span className="ao-num">{order.address.pincode}</span>
                    </p>
                    <p className="ao-num text-[#2B1C1E]/70">{order.address.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#2B1C1E]/10 justify-end">
                  <a
                    href={getWhatsAppOrderUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-[#25D366] text-white px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#1EBE5D] transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp Slip</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => printShippingLabel(order)}
                    className="inline-flex items-center space-x-1.5 bg-[#2B1C1E] text-[#FAF1F0] px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-[#9A6058] transition-colors"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Box Label</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center space-x-1.5 border border-[#2B1C1E]/25 px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] hover:border-[#2B1C1E]"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Invoice</span>
                  </button>
                  {!order.cancelled && order.statusStep < (3 as OrderStatusStep) && (
                    <button
                      type="button"
                      onClick={() => onAdvanceStatus(order.orderId)}
                      className="inline-flex items-center space-x-1.5 border border-[#BC8379] bg-[#F3E4E2] px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#ECD8D6]"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Simulate Next Dispatch Stage</span>
                    </button>
                  )}
                  {!order.cancelled && order.statusStep < 2 && (
                    <button
                      type="button"
                      onClick={() => onCancelOrder(order.orderId)}
                      className="border border-[#2B1C1E]/25 px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] text-[#2B1C1E]/75 hover:border-[#2B1C1E]"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="inline-flex items-center space-x-1.5 bg-[#2B1C1E] text-[#FAF1F0] px-4 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#9A6058] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reorder Pieces</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

