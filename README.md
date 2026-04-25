# 🏠 Dectra: Local Deployment Guide

Welcome to Dectra! This guide will help you set up and run Dectra locally on your machine.

---

## 🚀 Quick Local Start

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git**

### 2. Clone the Repository

```bash
git clone https://github.com/DebashishRana/Dectra.git
cd Dectra
```

### 3. Install Dependencies

```bash
npm install
# or
- **Chat**: AI-powered chat interface
# or
pnpm install
```

### 4. Environment Variables

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env.local
```
Edit `.env.local` and provide your database, Stripe, and OpenRouter credentials as needed.

### 5. Database Setup

You can use any local or remote PostgreSQL database. To initialize the schema and sample data, run:

```bash
npm run db:setup
```

Or manually execute the SQL files in `sql-queries/` using your preferred SQL client.

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

For more details, see the `docs/` folder or open an issue on GitHub.
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

[Website](https://dectra-two.vercel.app/) • [LinkedIn](https://linkedin.com/company/dectra-sf) • [X](https://x.com/dectra) • [GitHub](https://github.com/DebashishRana/Dectra)
