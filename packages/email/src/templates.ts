import type { EmailTemplateResult, OrderItemSummary } from "./types";

export function renderVerificationEmail(name: string, verifyUrl: string): EmailTemplateResult {
  const subject = "Verify your Unseen Gadget account";
  const text = `Hello ${name},\n\nPlease verify your email address by visiting this link:\n${verifyUrl}\n\nThank you,\nUnseen Gadget Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #000; margin-bottom: 16px;">Welcome to Unseen Gadget, ${name}!</h2>
      <p style="color: #555; font-size: 15px; line-height: 1.5;">Please confirm your email address by clicking the button below:</p>
      <div style="margin: 28px 0;">
        <a href="${verifyUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #888; font-size: 13px;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;
  return { subject, text, html };
}

export function renderPasswordResetEmail(name: string, resetUrl: string): EmailTemplateResult {
  const subject = "Reset your Unseen Gadget password";
  const text = `Hello ${name},\n\nYou requested a password reset. Click the link below to set a new password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nUnseen Gadget Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #000; margin-bottom: 16px;">Password Reset Request</h2>
      <p style="color: #555; font-size: 15px; line-height: 1.5;">Hello ${name},</p>
      <p style="color: #555; font-size: 15px; line-height: 1.5;">We received a request to reset your password. Click the button below to proceed:</p>
      <div style="margin: 28px 0;">
        <a href="${resetUrl}" style="background-color: #e11d48; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #888; font-size: 13px;">This link will expire in 1 hour.</p>
    </div>
  `;
  return { subject, text, html };
}

export function renderOrderConfirmationEmail(
  orderId: string,
  customerName: string,
  total: number,
  items: OrderItemSummary[]
): EmailTemplateResult {
  const subject = `Order Confirmed: #${orderId.slice(-6)}`;
  const itemsText = items.map((i) => `- ${i.name} x${i.quantity} (৳${i.price})`).join("\n");
  const text = `Hello ${customerName},\n\nThank you for your order! Your order #${orderId} has been confirmed.\n\nItems:\n${itemsText}\n\nTotal: ৳${total}\n\nUnseen Gadget Team`;
  
  const itemsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${i.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">৳${i.price * i.quantity}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #000; margin-bottom: 8px;">Order Confirmed!</h2>
      <p style="color: #555; font-size: 14px;">Order ID: <strong>#${orderId}</strong></p>
      <p style="color: #555; font-size: 15px;">Hello ${customerName}, thank you for shopping with Unseen Gadget.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <thead>
          <tr style="border-bottom: 2px solid #ddd; text-align: left;">
            <th style="padding: 8px 0;">Item</th>
            <th style="padding: 8px 0; text-align: center;">Qty</th>
            <th style="padding: 8px 0; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; font-size: 16px; font-weight: bold; margin-top: 16px;">
        Total: <span style="color: #000;">৳${total}</span>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function renderLoginOtpEmail(name: string, otpCode: string): EmailTemplateResult {
  const subject = `${otpCode} is your Unseen Gadget verification code`;
  const text = `Hello ${name || "Customer"},\n\nYour Unseen Gadget login verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nUnseen Gadget Team`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #182C61; margin: 0; font-size: 22px; font-weight: bold;">Unseen Gadget</h2>
        <p style="color: #666; font-size: 13px; margin-top: 4px;">Login Security Verification</p>
      </div>
      <p style="font-size: 14px; color: #333; line-height: 1.5;">Hi <strong>${name || "Customer"}</strong>,</p>
      <p style="font-size: 14px; color: #555; line-height: 1.5;">Here is your 6-digit verification code to complete your login:</p>
      <div style="background: #f0f4ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #182C61; display: inline-block;">${otpCode}</span>
      </div>
      <p style="font-size: 12px; color: #777; line-height: 1.5; margin-bottom: 0;">This code is valid for <strong>10 minutes</strong>. For your security, never share this code with anyone.</p>
    </div>
  `;
  return { subject, text, html };
}
