
<div align="center">
  <img src="https://github.com/user-attachments/assets/31ba39d0-2752-4db8-8701-8561b33ff7dc" />
   
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://www.deepseek.com/"><img alt="Homepage"
    src="https://github.com/deepseek-ai/DeepSeek-V2/blob/main/figures/badge.svg?raw=true"/></a>
  <a href="https://chat.deepseek.com/"><img alt="API"
    src="https://img.shields.io/badge/🤖%20Chat-DeepSeek%20V3-536af5?color=536af5&logoColor=white"/></a>
  <a href="https://huggingface.co/deepseek-ai"><img alt="Hugging Face"
    src="https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-DeepSeek%20AI-ffc107?color=ffc107&logoColor=white"/></a>
  <br>
  <a href="https://discord.gg/Tc7c45Zzu5"><img alt="Discord"
    src="https://img.shields.io/badge/Discord-DeepSeek%20AI-7289da?logo=discord&logoColor=white&color=7289da"/></a>
  <a href="https://twitter.com/deepseek_ai"><img alt="Twitter Follow"
    src="https://img.shields.io/badge/Twitter-deepseek_ai-white?logo=x&logoColor=white"/></a>
  <br>
  <a href="https://github.com/deepseek-ai/DeepSeek-V3/blob/main/LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code_License-MIT-f5de53?&color=f5de53"/></a>
  <a href="https://github.com/deepseek-ai/DeepSeek-V3/blob/main/LICENSE-MODEL"><img alt="Model License"
    src="https://img.shields.io/badge/Model_License-Model_Agreement-f5de53?&color=f5de53"/></a>
  <br>
  <a href="https://1drv.ms/p/c/efd2dbbfc9e2248f/IQBsWKMXM_pPTLdMKi1ilpHrATarO8GMZ8A1mTBzYax9wYE?e=HQfx1c"><b>Case paper</b></a>
</div>

## Table of Contents

1. [Introduction](#1-introduction)
2. [Model Summary](#2-Modelsummary)
3. [Evaluation Results](#3-MainWebsite&API Platform)
4. [Chat Website & API Platform](# MainWebsite)
5. [How to Run Locally](#6-how-to-run-locally)
6. [License](#7-license)
7. [Contact](#9-contact)


## 1. Introduction

Dectra is a AI-first API that enables instant verification, extraction, and validation of identity documents such as Aadhaar and PAN.

Built for real-world reliability, Dectra transforms unstructured documents into structured, verifiable data in a single API call.

Unlike traditional OCR pipelines, Dectra combines document understanding, validation logic, and confidence scoring to deliver production-ready outputs — not just raw text.
<p align="center">
  <img width="80%" src="C:\Users\simon\Documents\Dectra\Logos.jpg">
</p>

# 2. Model Summary

**Architecture: Document Intelligence + Validation Engine**

<img width="1920" height="1080" alt="Blue Green Professional Flowchart Template Brainstorm" src="https://github.com/user-attachments/assets/a302c955-e86d-4125-ab14-0579d4be3b42" />



Dectra combines multiple AI components into a unified pipeline designed for real-world document verification:

📄 Document Understanding — extracts structured fields from unstructured inputs (PDFs, images)
🧾 Entity Recognition — identifies key attributes such as name, DOB, ID numbers
✅ Validation Layer — applies rule-based and learned checks to verify authenticity
📊 Confidence Scoring — assigns reliability scores to each extracted field

Unlike traditional OCR systems, Dectra is built to understand and verify, not just read.

---

**⚡ Inference Optimization: Fast & Scalable**

Dectra is optimized for production use:

Low-latency responses suitable for real-time workflows
Efficient processing of large documents and low-quality images
Designed for horizontal scaling across API workloads

This ensures consistent performance even under high request volumes.

---

**🧪 Training Approach: Real-World Robustness**

The system is trained and refined using:

Diverse document formats (scanned, photographed, compressed)
Noisy and imperfect inputs (blur, glare, partial data)
Iterative feedback loops to improve extraction accuracy

This makes Dectra reliable in non-ideal, real-world conditions—not just clean datasets.

🔍 Post-Processing: Intelligence Layer

After extraction, Dectra applies:

Cross-field validation (e.g., format checks, logical consistency)
Error correction and normalization
Output standardization for downstream systems

---




## 4. Main Website & API Platform

<img width="1869" height="903" alt="image" src="https://github.com/user-attachments/assets/3741b640-3cb4-4eeb-b498-cb78c319955a" />

You can access Dectra on our official website: [dectra-two.vercel.app](https://dectra-two.vercel.app/)

We also provide : [platform.dectra.com](https://platform.dectra.com/)

yarn install
## 5. How to Run Locally

Dectra can be deployed and run locally using the following steps:

### 1. Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js), yarn, or pnpm
- Git

### 2. Clone the Repository

```bash
git clone https://github.com/DebashishRana/Dectra.git
cd Dectra
git clone https://github.com/DebashishRana/Dectra.git
cd Dectra
```

### 3. Install Dependencies
### 3. Install Dependencies

```bash
npm install
# or
- **Chat**: AI-powered chat interface
# or
pnpm install
```

### 4. Environment Variables
### 4. Environment Variables

Copy the example environment file and fill in your secrets:
Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env.local
```
Edit `.env.local` and provide your database, Stripe, and OpenRouter credentials as needed.

### 5. Database Setup
Edit `.env.local` and provide your database, Stripe, and OpenRouter credentials as needed.

You can use any local or remote PostgreSQL database. To initialize the schema and sample data, run:
### 5. Database Setup

You can use any local or remote PostgreSQL database. To initialize the schema and sample data, run:

```bash
npm run db:setup
```

Or manually execute the SQL files in `sql-queries/` using your preferred SQL client.

### 6. Start the Development Server
Or manually execute the SQL files in `sql-queries` using your preferred SQL client.

### 6. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Additional Local Commands

- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

---

## 📚 Documentation & Support

- [Website](https://dectra-two.vercel.app/)
- [LinkedIn](https://linkedin.com/company/dectra-sf)
- [X](https://x.com/dectra)
- [GitHub](https://github.com/DebashishRana/Dectra)

Fotes with discount applied

### 🛠️ **Technical Implementation**

#### Database Schema
```sql
-- Discount codes table with full functionality
CREATE TABLE discount_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    stripe_coupon_id VARCHAR(255),
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INTEGER NOT NULL,
    max_uses INTEGER DEFAULT NULL,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### API Endpoints
- **`POST /api/admin/discounts`**: Create new discount code
- **`GET /api/admin/discounts`**: List all discount codes
- **`PUT /api/admin/discounts/[id]`**: Update discount code
- **`DELETE /api/admin/discounts/[id]`**: Delete discount code
- **`POST /api/discounts/validate`**: Validate discount code for users

#### Stripe Integration
- **Automatic Coupon Creation**: Creates corresponding Stripe coupons
- **Checkout Integration**: Applies discounts during Stripe checkout
- **Webhook Handling**: Tracks usage when payments are completed
- **Coupon Management**: Syncs discount deletions with Stripe

### 📊 **Analytics & Tracking**

#### Usage Statistics
- **Total Codes**: Number of discount codes created
- **Active Codes**: Currently active discount codes
- **Expired Codes**: Codes that have expired
- **Usage Count**: Total number of times codes have been used
- **Revenue Impact**: Track discount impact on revenue

#### Database Functions
```sql
-- Validate discount code
SELECT * FROM validate_discount_code('SAVE20');

-- Get discount statistics
SELECT * FROM get_discount_stats();

-- Increment usage count
SELECT increment_discount_usage('SAVE20');
```

### 🔒 **Security Features**

#### Validation Rules
- **Unique Codes**: Prevents duplicate discount codes
- **Expiration Checks**: Automatic expiration validation
- **Usage Limits**: Enforces maximum usage limits
- **Active Status**: Only active codes can be used
- **Admin Only**: Only admin users can create/manage codes

#### Error Handling
- **Invalid Codes**: Clear error messages for non-existent codes
- **Expired Codes**: Specific messaging for expired codes
- **Usage Exceeded**: Notifications when usage limit is reached
- **Database Errors**: Graceful handling of database issues

### 🎯 **Best Practices**

#### Code Naming
- Use clear, memorable codes (e.g., `WELCOME10`, `SAVE20`)
- Include discount value in code name for clarity
- Use uppercase for consistency

#### Usage Limits
- Set reasonable usage limits to prevent abuse
- Monitor usage statistics regularly
- Consider time-limited promotions for urgency

#### Testing
- Test discount codes before sharing with users
- Verify Stripe integration works correctly
- Check price calculations are accurate

## 🎨 Customization

### 🎨 Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.js` for Tailwind customization
- Edit components in `src/components/ui/` for UI changes

### 🔧 Configuration
- Update `src/lib/stripe.ts` for pricing changes
- Modify `src/lib/database.ts` for database schema changes
- Edit `src/middleware.ts` for route protection

### 🤖 AI Models
- Change AI models in `.env.local` (`OPENROUTER_MODEL`)
- Modify chat interface in `src/components/chat/`
- Update credit costs in `src/lib/database.ts`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:setup     # Initialize database (if you add this script)
npm run db:migrate   # Run database migrations (if you add this script)
npm run db:seed      # Seed database with sample data (if you add this script)
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com/)
   - Import your GitHub repository

2. **Environment Variables**
   - Add all environment variables from `.env.local`
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your domain

3. **Deploy**
   - Vercel will automatically deploy your application
   - Set up custom domain if needed

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Use the Next.js template
- **AWS Amplify**: Connect your repository and configure build settings

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `AUTH_SECRET` | NextAuth v5 secret key (or use `NEXTAUTH_SECRET`) | ✅ | `your-secret-key` |
| `NEXTAUTH_URL` | Your site URL (required for production) | ✅ | `https://dectra-two.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ | `GOCSPX-...` |
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ | `postgresql://user:pass@host/db` |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ | `whsec_...` |
| `OPENROUTER_API_KEY` | OpenRouter API key | ✅ | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | AI model to use | ✅ | `qwen/qwen3-235b-a22b-2507` |

### Critical Deployment Notes

1. **AUTH_SECRET**: Must be a secure random string (min 32 chars). Generate with:
   ```bash
   openssl rand -base64 32
   ```

2. **Google OAuth Redirect URIs**: In Google Cloud Console, add your production URL:
   - `https://dectra-two.vercel.app/api/auth/callback/google`

3. **NEXTAUTH_URL**: Must match your production domain exactly (include `https://`)

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
Error: connect ECONNREFUSED
```
- Check your `DATABASE_URL` in `.env.local`
- Ensure your Neon database is running
- Verify the connection string format

**2. Google OAuth Error**
```bash
OAuthCallback error
```
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check authorized redirect URIs in Google Cloud Console
- Ensure `NEXTAUTH_URL` matches your domain

**3. Stripe Webhook Error**
```bash
Webhook signature verification failed
```
- Verify `STRIPE_WEBHOOK_SECRET` in `.env.local`
- Check webhook endpoint URL in Stripe dashboard
- Ensure webhook is receiving POST requests

**4. AI Chat Not Working**
```bash
OpenRouter API error
```
- Check `OPENROUTER_API_KEY` is valid
- Verify you have credits in your OpenRouter account
- Ensure `OPENROUTER_MODEL` is available

### Getting Help

- 📖 Check the [documentation](https://github.com/your-username/best-saas-kit-v2/wiki)
- 🐛 Report bugs in [GitHub Issues](https://github.com/your-username/best-saas-kit-v2/issues)
- 💬 Join our [Discord community](https://discord.gg/your-discord)
- 📧 Email support: support@bestsaaskit.com

## 📚 Documentation

### 📖 **Detailed Guides**
- **[Discount System Guide](docs/DISCOUNT_SYSTEM.md)** - Complete guide to the discount code system
- **[API Documentation](docs/API.md)** - API endpoints and usage (coming soon)
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment guide (coming soon)

### 🎯 **Quick Links**
- **Admin Panel**: `/admin` - User management and analytics
- **Discount Management**: `/admin/discounts` - Create and manage discount codes
- **Admin Settings**: `/admin/settings` - System configuration and status
- **User Billing**: `/dashboard/billing` - Subscription and discount code application



# 📜 License & Usage

This repository is private and proprietary.

All code, models, and associated assets under Dectra are protected under copyright law and are not open-source.

Access is granted on an invite-only basis for evaluation and development purposes.
Unauthorized use, distribution, modification, or reproduction of any part of this repository is strictly prohibited.

Commercial usage of Dectra is subject to separate agreements and licensing terms.

For access requests or partnership inquiries, please contact the maintainers.


## 9. Contact
If you have any questions, please raise an issue or contact us at [hi@dectra.in](hi@dectra.in).
