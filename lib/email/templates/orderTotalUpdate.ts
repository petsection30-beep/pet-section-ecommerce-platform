import brand from "@/config/brand.config"

type Params = {
  orderId:      string
  customerName: string
  subtotal:     number
  deliveryFee:  number
  total:        number
}

// Sent to the customer when an admin manually adjusts the delivery fee on
// their order, so the new total never comes as a surprise at delivery.
export function orderTotalUpdateEmail(p: Params): { subject: string; html: string } {
  const c    = brand.currencySymbol
  const fee  = p.deliveryFee === 0 ? "FREE" : `${c} ${p.deliveryFee.toLocaleString()}`

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:system-ui,sans-serif;background:#f8fafc;margin:0;padding:20px">
      <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <div style="background:${brand.primaryColor};padding:28px 24px;text-align:center">
          <h1 style="margin:0;font-size:20px;color:#fff;font-weight:700">${brand.storeName}</h1>
        </div>
        <div style="padding:32px 24px">
          <h2 style="margin:0 0 12px;font-size:18px;color:#111827">Order Total Updated</h2>
          <p style="margin:0 0 16px;font-size:15px;color:#374151">Hi ${p.customerName},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#374151">
            We've updated the delivery charge on your order. Here's your revised total.
          </p>
          <div style="background:#f9fafb;border-radius:8px;padding:14px 16px;margin-bottom:20px">
            <p style="margin:0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Order ID</p>
            <p style="margin:4px 0 0;font-family:monospace;font-size:15px;font-weight:700;color:#111827">${p.orderId}</p>
          </div>
          <div style="border-top:2px solid #f0f0f0;padding-top:16px">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#6b7280;font-size:14px">Subtotal</span>
              <span style="font-size:14px;color:#111827">${c} ${p.subtotal.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#6b7280;font-size:14px">Delivery</span>
              <span style="font-size:14px;color:#111827">${fee}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid #f0f0f0">
              <span style="font-weight:700;font-size:16px;color:#111827">New Total</span>
              <span style="font-weight:700;font-size:16px;color:${brand.primaryColor}">${c} ${p.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#9ca3af">${brand.storeName} · ${brand.contactEmail} · ${brand.contactPhone}</p>
        </div>
      </div>
    </body>
    </html>`

  return { subject: `Order Total Updated — ${p.orderId}`, html }
}
