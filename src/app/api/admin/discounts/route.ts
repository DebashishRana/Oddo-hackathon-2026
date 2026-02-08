import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess } from '@/lib/admin-auth';
import { 
  getAllDiscountCodes, 
  createDiscountCode, 
  getDiscountStats,
  type CreateDiscountCodeData 
} from '@/lib/database';
import { createStripeCoupon } from '@/lib/stripe';

export const runtime = 'nodejs';

// GET /api/admin/discounts - Get all discount codes
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdminAccess();

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    // Get discount codes
    const discountCodes = await getAllDiscountCodes();

    // Get stats if requested
    let stats = null;
    if (includeStats) {
      stats = await getDiscountStats();
    }

    return NextResponse.json({
      success: true,
      data: {
        discountCodes,
        stats
      }
    });

  } catch (error) {
    console.error('Admin discounts GET error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/discounts - Create new discount code
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const adminUser = await requireAdminAccess();

    const body = await request.json();
    const { 
      code, 
      discount_type, 
      discount_value, 
      max_uses, 
      expires_at 
    } = body;

    // Validate required fields
    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { error: 'Missing required fields: code, discount_type, discount_value' },
        { status: 400 }
      );
    }

    // Validate discount type
    if (!['percentage', 'fixed'].includes(discount_type)) {
      return NextResponse.json(
        { error: 'Invalid discount_type. Must be "percentage" or "fixed"' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discount_type === 'percentage' && (discount_value < 1 || discount_value > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (discount_type === 'fixed' && discount_value <= 0) {
      return NextResponse.json(
        { error: 'Fixed discount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate max_uses if provided
    if (max_uses !== undefined && max_uses !== null && max_uses <= 0) {
      return NextResponse.json(
        { error: 'max_uses must be greater than 0 or null for unlimited' },
        { status: 400 }
      );
    }

    // Validate expires_at if provided
    let expiresAt = null;
    if (expires_at) {
      expiresAt = new Date(expires_at);
      if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
        return NextResponse.json(
          { error: 'expires_at must be a valid future date' },
          { status: 400 }
        );
      }
    }

    try {
      // Create Stripe coupon first
      console.log('Creating Stripe coupon:', { code, discount_type, discount_value });
      const stripeCoupon = await createStripeCoupon(
        code,
        discount_type,
        discount_value
      );
      console.log('Stripe coupon created successfully:', stripeCoupon.id);

      // Look up the database user ID for the admin
      let databaseUserId = null;
      try {
        const { getUserByGoogleId } = await import('@/lib/database');
        const dbUser = await getUserByGoogleId(adminUser.id);
        if (dbUser) {
          databaseUserId = dbUser.id;
        }
      } catch {
        console.log('Could not find database user ID, proceeding without created_by');
      }

      // Prepare discount data
      const discountData: CreateDiscountCodeData = {
        code: code.toUpperCase(), // Store codes in uppercase
        stripe_coupon_id: stripeCoupon.id,
        discount_type,
        discount_value,
        max_uses: max_uses || null,
        expires_at: expiresAt,
        created_by: databaseUserId // Use database user ID or null
      };

      // Create discount code in database
      const discountCode = await createDiscountCode(discountData);

      return NextResponse.json({
        success: true,
        data: discountCode
      }, { status: 201 });

    } catch (stripeError: unknown) {
      const error = stripeError as { type?: string; code?: string; message?: string; param?: string };
      console.error('Stripe coupon creation error:', error);
      console.error('Stripe error details:', {
        type: error.type,
        code: error.code,
        message: error.message,
        param: error.param
      });

      // Handle specific Stripe errors
      if (error.code === 'resource_already_exists') {
        return NextResponse.json(
          { error: 'A discount code with this name already exists in Stripe' },
          { status: 409 }
        );
      }

      // Handle parameter errors
      if (error.type === 'invalid_request_error') {
        return NextResponse.json(
          { error: `Stripe validation error: ${error.message}` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `Failed to create Stripe coupon: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    const dbError = error as { code?: string };
    console.error('Admin discounts POST error:', error);
    
    // Handle database constraint errors
    if (dbError.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Discount code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
