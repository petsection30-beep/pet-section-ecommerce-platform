import brand from "@/config/brand.config"

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  CONFIRMED:  { title: "Order Confirmed ✓",       body: "Your payment has been verified and your order is being prepared."        },
  SHIPPED:    { title: "Order Shipped 🚚",          body: "Your order is on its way! Expect delivery within 2–5 business days."     },
  DELIVERED:  { title: "Order Delivered 🎉",        body: "Your order has been delivered. We hope your pet loves it!"               },
  REJECTED:   { title: "Payment Not Verified ✗",   body: "We could not verify your payment. Please contact us for assistance."     },
  CANCELLED:  { title: "Order Cancelled",          body: "Your order has been cancelled. Contact us if this was a mistake."        },
}

export function orderStatusUpdateEmail(
  orderId: string,
  customerName: string,
  status: string
): { subject: string; html: string } {
  const msg = STATUS_MESSAGES[status] ?? { title: `Order Update`, body: `Your order status is now: ${status}` }

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:system-ui,sans-serif;background:#f8fafc;margin:0;padding:20px">
      <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <div style="background:${brand.primaryColor};padding:28px 24px;text-align:center">
          <h1 style="margin:0;font-size:20px;color:#fff;font-weight:700">${brand.storeName}</h1>
        </div>
        <div style="padding:32px 24px">
          <h2 style="margin:0 0 12px;font-size:18px;color:#111827">${msg.title}</h2>
          <p style="margin:0 0 20px;font-size:15px;color:#374151">Hi ${customerName},</p>
          <p style="margin:0 0 20px;font-size:15px;color:#374151">${msg.body}</p>
          <div style="background:#f9fafb;border-radius:8px;padding:14px 16px">
            <p style="margin:0;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Order ID</p>
            <p style="margin:4px 0 0;font-family:monospace;font-size:15px;font-weight:700;color:#111827">${orderId}</p>
          </div>
        </div>
        <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#9ca3af">${brand.storeName} · ${brand.contactEmail}</p>
        </div>
      </div>
    </body>
    </html>`

  return { subject: `${msg.title} — ${orderId}`, html }
}
