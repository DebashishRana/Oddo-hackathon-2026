# 🚀 Best SAAS Kit V2

**The Ultimate AI-Powered SAAS Starter Kit**

A production-ready, feature-complete SAAS starter kit built with Next.js 15, designed to help developers launch AI-powered applications quickly and efficiently.

> **Version**: 2.0.1 - Stable Release

---

## 📺 **Follow The Creator**

[![YouTube Channel](https://img.shields.io/badge/YouTube-The%20Metaverse%20Guy-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/@TheMetaverseGuy)

**🎥 Subscribe to [The Metaverse Guy](https://www.youtube.com/@TheMetaverseGuy)** for tutorials, updates, and insights about this SAAS kit and other cutting-edge development content!

---

![Best SAAS Kit V2](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🔐 **Authentication & User Management**
- **NextAuth.js** integration with Google OAuth
- Protected routes and middleware
- User profiles and session management
- Admin panel with user analytics

### 💳 **Payment & Billing**
- **Stripe** integration for payments
- Pro plan subscription ($99 one-time payment)
- **Discount Code System** with admin management
- Real-time discount validation and price calculation
- Billing dashboard and payment history
- Webhook handling for payment events

### 🤖 **AI Integration**
- **OpenRouter API** for multiple AI models
- Interactive chat interface
- Credit-based usage system
- AI response streaming

### 📊 **Analytics & Dashboard**
- User analytics and insights
- Revenue tracking
- Credit usage monitoring
- Admin analytics panel

### 🎨 **Modern UI/UX**
- **Tailwind CSS v4** for styling
- **ShadCN UI** components
- Dark/Light theme support
- Responsive design
- Smooth animations with Framer Motion

### 🗄️ **Database**
- **Neon PostgreSQL** database
- Custom database functions
- User management and analytics
- Subscription tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + ShadCN UI
- **Authentication**: NextAuth.js
- **Database**: Neon PostgreSQL
- **Payments**: Stripe
- **AI**: OpenRouter API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

You'll also need accounts for:
- [Google Cloud Console](https://console.cloud.google.com/) (for OAuth)
- [Neon](https://neon.tech/) (for database)
- [Stripe](https://stripe.com/) (for payments)
- [OpenRouter](https://openrouter.ai/) (for AI features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/best-saas-kit-v2.git
cd best-saas-kit-v2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local` (see detailed setup below).

### 4. Database Setup

1. Create a Neon database (instructions below)
2. Run the database initialization script:

```bash
npm run db:setup
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Detailed Setup Guide

### 🗄️ Database Setup (Neon)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech/)
   - Sign up for a free account
   - Create a new project

2. **Get Connection String**
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string
   - Add it to your `.env.local` as `DATABASE_URL`

3. **Initialize Database**
   ```bash
   # The database tables will be created automatically when you first run the app
   npm run dev
   ```

### 🔐 Google OAuth Setup

1. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API

2. **Create OAuth Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://dectra-two.vercel.app/api/auth/callback/google` (production)

3. **Add to Environment**
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### 💳 Stripe Setup

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com/)
   - Complete account verification

2. **Get API Keys**
   - Go to Developers → API Keys
   - Copy your publishable and secret keys
   - Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

3. **Setup Webhooks**
   - Go to Developers → Webhooks
   - Add endpoint: `https://dectra-two.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 🤖 OpenRouter Setup

1. **Create OpenRouter Account**
   - Sign up at [openrouter.ai](https://openrouter.ai/)
   - Add credits to your account

2. **Get API Key**
   - Go to Keys section
   - Create a new API key
   - Add to `.env.local`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=qwen/qwen3-235b-a22b-2507
   ```

## 📁 Project Structure

```
best-saas-kit-v2/
├── docs/                      # Documentation
│   └── DISCOUNT_SYSTEM.md     # Discount system guide
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── discounts/     # Discount management
│   │   │   └── settings/      # Admin settings
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API routes
│   │   │   │   └── discounts/ # Discount CRUD operations
│   │   │   ├── discounts/     # User discount validation
│   │   │   └── stripe/        # Stripe integration
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── demo/              # Demo page
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   │   ├── discount-form.tsx      # Discount creation form
│   │   │   └── discount-management.tsx # Discount management UI
│   │   ├── auth/              # Auth components
│   │   ├── billing/           # Billing components
│   │   ├── chat/              # AI chat components
│   │   ├── checkout/          # Checkout components
│   │   │   └── discount-input.tsx     # Discount code input
│   │   ├── dashboard/         # Dashboard components
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # UI components (ShadCN)
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── database.ts        # Database functions
│   │   ├── stripe.ts          # Stripe utilities
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .env.local                # Your environment variables (not in git)
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🎯 Usage Guide

### 🏠 Landing Page
The landing page includes:
- Hero section with call-to-action
- Features showcase
- Pricing section
- Testimonials
- Footer with links

### 👤 User Authentication
- Users can sign in with Google OAuth
- Automatic user creation in database
- Session management with NextAuth
- Protected routes for authenticated users

### 📊 Dashboard Features
- **Overview**: User stats and quick actions
- **Chat**: AI-powered chat interface
- **Analytics**: Usage statistics and insights
- **Billing**: Subscription management and payment history
- **Profile**: User profile management
- **Settings**: Account preferences

### 👑 Admin Panel
Admin users (configured via email) get access to:
- **User Management**: View and manage user accounts
- **Discount Management**: Create and manage promotional codes
- **Revenue Tracking**: Monitor subscription revenue and payments
- **System Analytics**: View system-wide statistics and insights
- **Settings**: Configure system settings and environment status
- **User Activity**: Monitor user activity and engagement

### 💬 AI Chat
- Interactive chat interface
- Multiple AI models via OpenRouter
- Credit-based usage system
- Real-time streaming responses

## 🎟️ Discount Code System

The Best SAAS Kit V2 includes a comprehensive discount code system that allows administrators to create and manage promotional codes for users.

### 🔧 **Admin Features**

#### Creating Discount Codes
1. **Access Admin Panel**: Navigate to `/admin/discounts`
2. **Create New Discount**: Click "Create New Discount" button
3. **Configure Discount**:
   - **Code**: Enter unique discount code (e.g., `SAVE20`, `WELCOME10`)
   - **Type**: Choose between Percentage or Fixed Amount
   - **Value**: Set discount value (1-100 for percentage, dollar amount for fixed)
   - **Max Uses**: Set usage limit (optional, leave empty for unlimited)
   - **Expiration**: Set expiration date (optional)

#### Discount Types
- **Percentage Discount**: Reduces price by percentage (e.g., 20% off)
- **Fixed Amount Discount**: Reduces price by fixed dollar amount (e.g., $10 off)

#### Managing Discount Codes
- **View All Codes**: See all created discount codes with usage statistics
- **Edit Codes**: Modify existing discount codes
- **Delete Codes**: Remove discount codes (also deletes from Stripe)
- **Usage Analytics**: Track how many times each code has been used

### 👤 **User Experience**

#### Applying Discount Codes
1. **Navigate to Billing**: Go to `/dashboard/billing`
2. **Enter Discount Code**: Use the discount input field
3. **Validate Code**: Click "Apply" to validate the discount
4. **See Price Update**: View original and discounted prices
5. **Complete Purchase**: Proceed to Stripe checkout with discount applied

#### Real-time Validation
- **Instant Feedback**: Codes are validated in real-time
- **Error Messages**: Clear error messages for invalid codes
- **Success Confirmation**: Visual confirmation when code is applied
- **Price Calculation**: Automatic price updates with discount applied

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

### 🔧 **Configuration Files**
- **Environment Variables**: `.env.example` - Template for required environment variables
- **Database Schema**: `sql-queries/` - Database setup and migration files
- **Stripe Configuration**: `src/lib/stripe.ts` - Payment processing setup

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Stripe](https://stripe.com/) - Payment processing
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [OpenRouter](https://openrouter.ai/) - AI model access

## 📞 Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others

---

**Built with ❤️ by the Best SAAS Kit team**

[Website](https://bestsaaskit.com) • [Documentation](https://docs.bestsaaskit.com) • [YouTube](https://www.youtube.com/@TheMetaverseGuy) • [Discord](https://discord.gg/bestsaaskit) • [Twitter](https://twitter.com/bestsaaskit)
