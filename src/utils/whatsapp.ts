import { PlacedOrder } from '../types/storefront';
import { WHATSAPP_PHONE } from '../data/catalog';

/**
 * Formats a clean, professional shipping dispatch slip for WhatsApp message.
 * Sachin can directly read, copy, or print this for the parcel box.
 */
export function formatWhatsAppOrderSlip(order: PlacedOrder): string {
  const itemsText = order.items
    .map(
      (item, i) =>
        `${i + 1}. *${item.name}* (Qty: ${item.quantity})\n   • Finish: ${item.metal}\n   • Size: ${item.size}\n   • Valuation: ₹${(item.unitPriceInr * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n\n');

  const landmarkPart = order.address.landmark ? `\nLandmark: ${order.address.landmark}` : '';
  const giftPart = order.giftWrap
    ? `\n🎁 *Gift Box Requested:* ${order.giftNote ? `"${order.giftNote}"` : 'Yes'}`
    : '';

  return (
    `📦 *SHREYA & CO. — DISPATCH & COURIER ORDER SLIP*\n` +
    `========================================\n` +
    `*ORDER ID:* #${order.orderId}\n` +
    `*DATE:* ${order.placedAt}\n` +
    `*ESTIMATED DELIVERY:* ${order.estimatedDelivery}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *CUSTOMER DETAILS:*\n` +
    `*Name:* ${order.address.fullName}\n` +
    `*Mobile:* ${order.address.phone}\n` +
    `*Email:* ${order.address.email}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📍 *SHIPPING ADDRESS (PASTE ON BOX):*\n` +
    `*${order.address.fullName}*\n` +
    `${order.address.street}${landmarkPart}\n` +
    `${order.address.city}, ${order.address.state}\n` +
    `*PINCODE:* ${order.address.pincode}\n` +
    `*Address Type:* ${order.address.addressType}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🛍️ *ITEMS TO PACK:* (${order.items.reduce((s, it) => s + it.quantity, 0)} pieces)\n` +
    `${itemsText}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *BILLING & PAYMENT:*\n` +
    `*Payment Mode:* ${order.paymentMethod === 'cod' ? 'CASH ON DELIVERY (COD)' : order.paymentSummary}\n` +
    `*Subtotal:* ₹${order.subtotalInr.toLocaleString('en-IN')}\n` +
    (order.discountInr > 0 ? `*Privilege Discount:* -₹${order.discountInr.toLocaleString('en-IN')}\n` : '') +
    `*Transit:* FREE (Insured Pan-India Air)\n` +
    `*TOTAL PAYABLE AMOUNT:* ₹${order.totalInr.toLocaleString('en-IN')}${giftPart}\n` +
    `========================================\n` +
    `✨ *Fragile Luxury Jewelry — Handle With Care*`
  );
}

/**
 * Returns the deep-link URL to send this order to WhatsApp.
 */
export function getWhatsAppOrderUrl(order: PlacedOrder, phone: string = WHATSAPP_PHONE): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const text = formatWhatsAppOrderSlip(order);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Direct 4x6 / A6 printable courier box shipping label.
 * Opens a dedicated print dialog formatted specifically to stick directly on the dispatch box.
 */
export function printShippingLabel(order: PlacedOrder) {
  const win = window.open('', '_blank', 'width=520,height=720');
  if (!win) {
    window.print();
    return;
  }
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 0;">${item.name} (${item.metal})</td><td style="text-align:right;">x${item.quantity}</td><td style="text-align:right;">₹${(item.unitPriceInr * item.quantity).toLocaleString('en-IN')}</td></tr>`
    )
    .join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shipping Label #${order.orderId}</title>
        <style>
          @page { size: 100mm 150mm; margin: 6mm; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; margin: 0; padding: 12px; color: #000; font-size: 12px; background: #fff; }
          .label-box { border: 2.5px solid #000; padding: 14px; max-width: 420px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
          .title { font-size: 16px; font-weight: 900; letter-spacing: 1.5px; }
          .section { margin-bottom: 12px; }
          .bold { font-weight: bold; }
          .to-box { border: 2px solid #000; padding: 10px; background: #fafafa; margin-bottom: 12px; }
          .pin { font-size: 22px; font-weight: 900; letter-spacing: 2px; border-top: 1px solid #000; padding-top: 4px; margin-top: 6px; }
          .items-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 6px; }
          .footer { text-align: center; border-top: 2px solid #000; padding-top: 8px; font-weight: 800; font-size: 11px; letter-spacing: 1px; }
          @media print {
            body { padding: 0; }
            .label-box { border: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="label-box">
          <div class="header">
            <div>
              <div class="title">SHREYA &amp; CO.</div>
              <div style="font-size: 10px; text-transform: uppercase; color: #444;">Atelier Dispatch · Mumbai / Prayagraj</div>
            </div>
            <div style="text-align:right;">
              <div class="bold" style="font-size: 13px;">#${order.orderId}</div>
              <div style="font-size: 10px;">${order.placedAt}</div>
            </div>
          </div>

          <div class="to-box">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #555; margin-bottom: 4px;">SHIP TO / DELIVER TO:</div>
            <div style="font-size: 17px; font-weight: 900;">${order.address.fullName}</div>
            <div style="font-size: 14px; font-weight: 800; margin: 4px 0;">📞 ${order.address.phone}</div>
            <div style="font-size: 12px; line-height: 1.4;">
              ${order.address.street}
              ${order.address.landmark ? `<br/>Landmark: <b>${order.address.landmark}</b>` : ''}
              <br/>${order.address.city}, ${order.address.state}
            </div>
            <div class="pin">PIN: ${order.address.pincode}</div>
          </div>

          <div class="section" style="border: 1.5px dashed #000; padding: 8px;">
            <div style="display:flex; justify-content:space-between; font-weight:900; font-size: 13px;">
              <span>PAYMENT: ${order.paymentMethod === 'cod' ? 'CASH ON DELIVERY (COD)' : 'PREPAID ONLINE'}</span>
              <span>₹${order.totalInr.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="section">
            <div class="bold" style="font-size: 10px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 3px;">PACKAGE CONTENTS (${order.items.reduce((s, it) => s + it.quantity, 0)} ITEMS):</div>
            <table class="items-table">
              ${itemsHtml}
            </table>
          </div>

          <div class="footer">
            ⚠ FRAGILE — LUXURY JEWELRY · HANDLE WITH CARE
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `);
  win.document.close();
}
