import brand from "@/config/brand.config"

export function passwordResetEmail(
  name: string,
  resetUrl: string
): { subject: string; html: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:system-ui,sans-serif;background:#f8fafc;margin:0;padding:20px">
      <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <div style="background:${brand.secondaryColor};padding:28px 24px;text-align:center">
          <h1 style="margin:0;font-size:20px;color:#fff;font-weight:700">${brand.storeName}</h1>
        </div>
        <div style="padding:32px 24px">
          <h2 style="margin:0 0 16px;font-size:18px;color:#111827">Reset your password 🔑</h2>
          <p style="margin:0 0 20px;font-size:15px;color:#374151">Hi ${name},</p>
          <p style="margin:0 0 28px;font-size:15px;color:#374151">
            We received a request to reset your password. Click the button below to choose a new one.
            This link expires in <strong>30 minutes</strong>.
          </p>
          <div style="text-align:center;margin-bottom:28px">
            <a href="${resetUrl}" style="display:inline-block;background:${brand.primaryColor};color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px">
              Reset Password
            </a>
          </div>
          <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#9ca3af">${brand.storeName} · ${brand.contactEmail}</p>
        </div>
      </div>
    </body>
    </html>`

  return { subject: `Reset your ${brand.storeName} password`, html }
}
