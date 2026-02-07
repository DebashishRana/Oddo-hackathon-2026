# 🎟️ Discount Code System Documentation

## Overview

The Best SAAS Kit V2 includes a comprehensive discount code system that allows administrators to create and manage promotional codes. This system integrates seamlessly with Stripe for payment processing and provides real-time validation for users.

## Features

### ✨ **Core Features**
- **Admin Management**: Create, edit, and delete discount codes
- **Real-time Validation**: Instant discount code validation for users
- **Stripe Integration**: Automatic Stripe coupon creation and management
- **Usage Tracking**: Monitor discount code usage and analytics
- **Flexible Discounts**: Support for percentage and fixed-amount discounts
- **Expiration Control**: Set expiration dates and usage limits
- **Security**: Admin-only access with proper validation

### 🎯 **Discount Types**
1. **Percentage Discounts**: Reduce price by percentage (e.g., 20% off)
2. **Fixed Amount Discounts**: Reduce price by fixed dollar amount (e.g., $10 off)

## Admin Guide

### 🔐 **Access Requirements**
- Admin email must be configured in `ADMIN_EMAILS` environment variable
- Access admin panel at `/admin/discounts`

### 📝 **Creating Discount Codes**

1. **Navigate to Admin Panel**
   ```
   https://dectra-two.vercel.app/admin/discounts
   ```

2. **Click "Create New Discount"**

3. **Fill in Discount Details**:
   - **Code**: Unique identifier (e.g., `SAVE20`, `WELCOME10`)
   - **Type**: Choose `Percentage` or `Fixed Amount`
   - **Value**: 
     - For percentage: 1-100 (represents percentage)
     - For fixed: Dollar amount (e.g., 10 for $10 off)
   - **Max Uses**: Maximum number of uses (optional)
   - **Expiration Date**: When the code expires (optional)

4. **Save Discount Code**
   - Creates database entry
   - Generates corresponding Stripe coupon
   - Makes code available for users

### 📊 **Managing Existing Codes**

#### View All Codes
- See list of all discount codes
- View usage statistics
- Check active/inactive status
- Monitor expiration dates

#### Edit Codes
- Modify discount details
- Update expiration dates
- Change usage limits
- Toggle active status

#### Delete Codes
- Remove discount codes
- Automatically deletes from Stripe
- Prevents further usage

### 📈 **Analytics Dashboard**
- **Total Codes**: Number of codes created
- **Active Codes**: Currently usable codes
- **Expired Codes**: Codes past expiration
- **Total Usage**: Number of times codes were used

## User Guide

### 🛒 **Applying Discount Codes**

1. **Navigate to Billing Page**
   ```
   https://dectra-two.vercel.app/dashboard/billing
   ```

2. **Locate Discount Input**
   - Find the "Discount Code" input field
   - Located above the upgrade button

3. **Enter Discount Code**
   - Type the discount code (case-insensitive)
   - Click "Apply" button

4. **Validation Process**
   - Real-time validation occurs
   - Success: Price updates with discount
   - Error: Clear error message displayed

5. **Complete Purchase**
   - Click "Upgrade to Pro with Discount"
   - Redirected to Stripe checkout
   - Discount automatically applied

### ✅ **Validation Rules**
- Code must exist in database
- Code must be active
- Code must not be expired
- Code must not exceed usage limit

## Technical Implementation

### 🗄️ **Database Schema**

```sql
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

### 🔧 **Database Functions**

#### Validate Discount Code
```sql
SELECT * FROM validate_discount_code('SAVE20');
```
Returns validation result with discount details.

#### Increment Usage
```sql
SELECT increment_discount_usage('SAVE20');
```
Increments usage count when code is used.

#### Get Statistics
```sql
SELECT * FROM get_discount_stats();
```
Returns comprehensive usage statistics.

### 🌐 **API Endpoints**

#### Admin Endpoints
- `POST /api/admin/discounts` - Create discount code
- `GET /api/admin/discounts` - List all discount codes
- `PUT /api/admin/discounts/[id]` - Update discount code
- `DELETE /api/admin/discounts/[id]` - Delete discount code

#### User Endpoints
- `POST /api/discounts/validate` - Validate discount code

#### Checkout Integration
- `POST /api/stripe/checkout` - Create checkout session with discount

### 💳 **Stripe Integration**

#### Coupon Creation
```typescript
const stripeCoupon = await createStripeCoupon(
  discountCode,
  discountType,
  discountValue
);
```

#### Checkout Session
```typescript
const checkoutSession = await createCheckoutSessionWithDiscount(
  customerId,
  userId,
  email,
  successUrl,
  cancelUrl,
  stripeCouponId
);
```

## Security Considerations

### 🔒 **Access Control**
- Admin-only discount creation
- Email-based admin authentication
- Protected API routes

### ✅ **Validation**
- Server-side validation for all operations
- Unique code enforcement
- Expiration and usage limit checks

### 🛡️ **Error Handling**
- Graceful error handling for invalid codes
- Detailed logging for debugging
- User-friendly error messages

## Best Practices

### 📝 **Code Naming**
- Use descriptive, memorable codes
- Include discount value in name (e.g., `SAVE20`)
- Use uppercase for consistency
- Avoid special characters

### 📊 **Usage Management**
- Set reasonable usage limits
- Monitor usage statistics regularly
- Use expiration dates for time-limited promotions
- Archive old codes instead of deleting

### 🧪 **Testing**
- Test codes before sharing with users
- Verify Stripe integration works
- Check price calculations are accurate
- Test expiration and usage limits

## Troubleshooting

### Common Issues

#### "Discount code not found"
- Verify code exists in admin panel
- Check for typos in code entry
- Ensure code is active

#### "Discount code has expired"
- Check expiration date in admin panel
- Update expiration if needed
- Create new code if necessary

#### "Usage limit exceeded"
- Check current usage vs. max uses
- Increase limit or create new code
- Monitor popular codes

#### Stripe Integration Issues
- Verify Stripe API keys are correct
- Check webhook configuration
- Review Stripe dashboard for errors

## Support

For technical support or questions about the discount system:
1. Check this documentation first
2. Review error logs in admin panel
3. Test with sample discount codes
4. Contact system administrator

---

**Note**: This discount system is designed for the Best SAAS Kit V2 and integrates with the existing authentication, database, and payment systems.
