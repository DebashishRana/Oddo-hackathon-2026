import { Resend } from 'resend';

// Initialize Resend with API key
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  FROM_EMAIL: process.env.FROM_EMAIL || 'onboarding@bestsaaskit.com',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@bestsaaskit.com',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Best SAAS Kit V2',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

// Email types
export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

// Send email function with error handling
export async function sendEmail(data: EmailData) {
  try {
    const result = await resend.emails.send({
      from: data.from || EMAIL_CONFIG.FROM_EMAIL,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Welcome email template
export function createWelcomeEmail(userName: string, userEmail: string) {
  const subject = `Welcome to ${EMAIL_CONFIG.SITE_NAME}!`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${EMAIL_CONFIG.SITE_NAME}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to ${EMAIL_CONFIG.SITE_NAME}!</h1>
        <p>Your AI-powered SAAS journey starts here</p>
      </div>
      <div class="content">
        <h2>Hi ${userName}!</h2>
        <p>Thank you for joining ${EMAIL_CONFIG.SITE_NAME}. We're excited to have you on board!</p>
        
        <p>Here's what you can do next:</p>
        <ul>
          <li>🤖 Try our AI chat interface</li>
          <li>📊 Explore your dashboard</li>
          <li>⚡ Upgrade to Pro for unlimited features</li>
          <li>📖 Check out our documentation</li>
        </ul>
        
        <a href="${EMAIL_CONFIG.SITE_URL}/dashboard" class="button">Go to Dashboard</a>
        
        <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>.</p>
        
        <p>Best regards,<br>The ${EMAIL_CONFIG.SITE_NAME} Team</p>
      </div>
      <div class="footer">
        <p>© 2024 ${EMAIL_CONFIG.SITE_NAME}. All rights reserved.</p>
        <p><a href="${EMAIL_CONFIG.SITE_URL}">Visit our website</a> | <a href="${EMAIL_CONFIG.SITE_URL}/docs">Documentation</a></p>
      </div>
    </body>
    </html>
  `;

  return { to: userEmail, subject, html };
}

// Subscription confirmation email template
export function createSubscriptionConfirmationEmail(userName: string, userEmail: string, planName: string = 'Pro') {
  const subject = `Welcome to ${EMAIL_CONFIG.SITE_NAME} ${planName}!`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="success-icon">🎉</div>
        <h1>Subscription Confirmed!</h1>
        <p>Welcome to ${EMAIL_CONFIG.SITE_NAME} ${planName}</p>
      </div>
      <div class="content">
        <h2>Hi ${userName}!</h2>
        <p>Congratulations! Your ${planName} subscription has been successfully activated.</p>
        
        <p>You now have access to:</p>
        <ul>
          <li>🚀 Unlimited AI chat interactions</li>
          <li>📊 Advanced analytics and insights</li>
          <li>⚡ Priority support</li>
          <li>🔧 Advanced customization options</li>
        </ul>
        
        <a href="${EMAIL_CONFIG.SITE_URL}/dashboard" class="button">Access Your Dashboard</a>
        
        <p>Your subscription will automatically renew. You can manage your subscription anytime from your billing dashboard.</p>
        
        <p>Thank you for choosing ${EMAIL_CONFIG.SITE_NAME}!</p>
        
        <p>Best regards,<br>The ${EMAIL_CONFIG.SITE_NAME} Team</p>
      </div>
      <div class="footer">
        <p>© 2024 ${EMAIL_CONFIG.SITE_NAME}. All rights reserved.</p>
        <p><a href="${EMAIL_CONFIG.SITE_URL}/dashboard/billing">Manage Subscription</a> | <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">Support</a></p>
      </div>
    </body>
    </html>
  `;

  return { to: userEmail, subject, html };
}

// Password reset email template (for future use)
export function createPasswordResetEmail(userName: string, userEmail: string, resetToken: string) {
  const resetUrl = `${EMAIL_CONFIG.SITE_URL}/auth/reset-password?token=${resetToken}`;
  const subject = `Reset your ${EMAIL_CONFIG.SITE_NAME} password`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Password Reset Request</h1>
        <p>Reset your ${EMAIL_CONFIG.SITE_NAME} password</p>
      </div>
      <div class="content">
        <h2>Hi ${userName}!</h2>
        <p>We received a request to reset your password for your ${EMAIL_CONFIG.SITE_NAME} account.</p>
        
        <a href="${resetUrl}" class="button">Reset Password</a>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong>
          <p>This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.</p>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        
        <p>If you need help, contact our support team at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>.</p>
        
        <p>Best regards,<br>The ${EMAIL_CONFIG.SITE_NAME} Team</p>
      </div>
      <div class="footer">
        <p>© 2024 ${EMAIL_CONFIG.SITE_NAME}. All rights reserved.</p>
        <p><a href="${EMAIL_CONFIG.SITE_URL}">Visit our website</a> | <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">Support</a></p>
      </div>
    </body>
    </html>
  `;

  return { to: userEmail, subject, html };
}

// Email verification OTP template
export function createVerificationEmail(userEmail: string, code: string) {
  const subject = `${code} is your ${EMAIL_CONFIG.SITE_NAME} verification code`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; background: #f7f7f7; }
        .container { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #0a0a0b; color: white; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .content { padding: 32px; text-align: center; }
        .code-box { display: inline-block; background: #f0f0f0; border: 2px dashed #d4854e; border-radius: 12px; padding: 20px 40px; margin: 24px 0; }
        .code { font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0a0a0b; font-family: 'Courier New', monospace; }
        .note { color: #666; font-size: 14px; margin-top: 16px; }
        .footer { text-align: center; padding: 20px 32px; color: #999; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${EMAIL_CONFIG.SITE_NAME}</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 8px;">Verify your email address</p>
          <p style="color: #666; font-size: 14px;">Enter this code to complete your sign-up:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p class="note">This code expires in <strong>10 minutes</strong>.</p>
          <p class="note">If you didn't create an account with ${EMAIL_CONFIG.SITE_NAME}, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${EMAIL_CONFIG.SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { to: userEmail, subject, html };
}

// Contact form email template
export function createContactFormEmail(name: string, email: string, message: string) {
  const subject = `New contact form submission from ${name}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #374151; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea; }
        .label { font-weight: bold; color: #374151; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Form Submission</h1>
        <p>From ${EMAIL_CONFIG.SITE_NAME} website</p>
      </div>
      <div class="content">
        <div class="field">
          <div class="label">Name:</div>
          <div>${name}</div>
        </div>
        
        <div class="field">
          <div class="label">Email:</div>
          <div><a href="mailto:${email}">${email}</a></div>
        </div>
        
        <div class="field">
          <div class="label">Message:</div>
          <div>${message}</div>
        </div>
        
        <p><strong>Reply to this inquiry by responding to ${email}</strong></p>
      </div>
    </body>
    </html>
  `;

  return { to: EMAIL_CONFIG.SUPPORT_EMAIL, subject, html };
}
