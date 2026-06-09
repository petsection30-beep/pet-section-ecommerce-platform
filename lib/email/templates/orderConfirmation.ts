import brand from "@/config/brand.config"

type OrderItem = { productName: string; qty: number; unitPrice: number }

type Params = {
  orderId:       string
  customerName:  string
  items:         OrderItem[]
  subtotal:      number
  deliveryFee:   number
  total:         number
  paymentMethod: string
  txnId?:        string
}

export function orderConfirmationEmail(p: Params): { subject: string; html: string } {
  const rows = p.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${brand.currencySymbol} ${(i.unitPrice * i.qty).toLocaleString()}</td>
        </tr>`
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:system-ui,sans-serif;background:#f8fafc;margin:0;padding:20px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <div style="background:${brand.primaryColor};padding:32px 24px;text-align:center">
          <h1 style="margin:0;font-size:22px;color:#fff;font-weight:700">${brand.storeName}</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px">Order Confirmed!</p>
        </div>
        <div style="padding:32px 24px">
          <p style="margin:0 0 16px;font-size:15px;color:#374151">Hi ${p.customerName},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151">
            Thank you for your order. ${p.paymentMethod !== "COD" ? "We've received your payment details and will verify them shortly." : "Your order has been placed and will be confirmed once payment is collected."}
          </p>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Order ID</p>
            <p style="margin:4px 0 0;font-family:monospace;font-size:16px;font-weight:700;color:#111827">${p.orderId}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr style="background:#f3f4f6">
                <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase">Item</th>
                <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase">Qty</th>
                <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase">Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div style="border-top:2px solid #f0f0f0;padding-top:16px">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#6b7280;font-size:14px">Subtotal</span>
              <span style="font-size:14px;color:#111827">${brand.currencySymbol} ${p.subtotal.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#6b7280;font-size:14px">Delivery</span>
              <span style="font-size:14px;color:#111827">${brand.currencySymbol} ${p.deliveryFee}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid #f0f0f0">
              <span style="font-weight:700;font-size:16px;color:#111827">Total</span>
              <span style="font-weight:700;font-size:16px;color:${brand.primaryColor}">${brand.currencySymbol} ${p.total.toLocaleString()}</span>
            </div>
          </div>
          ${p.txnId ? `<div style="background:#fef3c7;border-radius:8px;padding:12px 16px;margin-top:20px"><p style="margin:0;font-size:13px;color:#92400e">Payment reference: <strong>${p.txnId}</strong></p></div>` : ""}
        </div>
        <div style="background:#f9fafb;padding:20px 24px;text-align:center;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#9ca3af">${brand.storeName} · ${brand.contactEmail} · ${brand.contactPhone}</p>
        </div>
      </div>
    </body>
    </html>`

  return { subject: `Order Confirmed — ${p.orderId}`, html }
}
