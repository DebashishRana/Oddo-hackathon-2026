import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAccess } from '@/lib/admin-auth';
import { 
  getDiscountCodeById, 
  updateDiscountCode, 
  deleteDiscountCode,
  type UpdateDiscountCodeData 
} from '@/lib/database';
import { deleteStripeCoupon } from '@/lib/stripe';

export const runtime = 'nodejs';

// GET /api/admin/discounts/[id] - Get specific discount code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    await requireAdminAccess();

    const { id } = await params;
    const discountId = parseInt(id);
    if (isNaN(discountId)) {
      return NextResponse.json(
        { error: 'Invalid discount ID' },
        { status: 400 }
      );
    }

    const discountCode = await getDiscountCodeById(discountId);

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: discountCode
    });

  } catch (error) {
    console.error('Admin discount GET error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/discounts/[id] - Update discount code
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    await requireAdminAccess();

    const { id } = await params;
    const discountId = parseInt(id);
    if (isNaN(discountId)) {
      return NextResponse.json(
        { error: 'Invalid discount ID' },
        { status: 400 }
      );
    }

    // Check if discount exists
    const existingDiscount = await getDiscountCodeById(discountId);
    if (!existingDiscount) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      code, 
      discount_type, 
      discount_value, 
      max_uses, 
      expires_at,
      is_active 
    } = body;

    // Prepare update data
    const updateData: UpdateDiscountCodeData = {};

    if (code !== undefined) {
      updateData.code = code.toUpperCase();
    }

    if (discount_type !== undefined) {
      if (!['percentage', 'fixed'].includes(discount_type)) {
        return NextResponse.json(
          { error: 'Invalid discount_type. Must be "percentage" or "fixed"' },
          { status: 400 }
        );
      }
      updateData.discount_type = discount_type;
    }

    if (discount_value !== undefined) {
      const type = discount_type || existingDiscount.discount_type;
      if (type === 'percentage' && (discount_value < 1 || discount_value > 100)) {
        return NextResponse.json(
          { error: 'Percentage discount must be between 1 and 100' },
          { status: 400 }
        );
      }
      if (type === 'fixed' && discount_value <= 0) {
        return NextResponse.json(
          { error: 'Fixed discount must be greater than 0' },
          { status: 400 }
        );
      }
      updateData.discount_value = discount_value;
    }

    if (max_uses !== undefined) {
      if (max_uses !== null && max_uses <= 0) {
        return NextResponse.json(
          { error: 'max_uses must be greater than 0 or null for unlimited' },
          { status: 400 }
        );
      }
      updateData.max_uses = max_uses;
    }

    if (expires_at !== undefined) {
      if (expires_at === null) {
        updateData.expires_at = null;
      } else {
        const expiresAtDate = new Date(expires_at);
        if (isNaN(expiresAtDate.getTime()) || expiresAtDate <= new Date()) {
          return NextResponse.json(
            { error: 'expires_at must be a valid future date or null' },
            { status: 400 }
          );
        }
        updateData.expires_at = expiresAtDate;
      }
    }

    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    // Update discount code
    const updatedDiscount = await updateDiscountCode(discountId, updateData);

    if (!updatedDiscount) {
      return NextResponse.json(
        { error: 'Failed to update discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedDiscount
    });

  } catch (error: unknown) {
    const dbError = error as { code?: string };
    console.error('Admin discount PUT error:', error);
    
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

// DELETE /api/admin/discounts/[id] - Delete discount code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    await requireAdminAccess();

    const { id } = await params;
    const discountId = parseInt(id);
    if (isNaN(discountId)) {
      return NextResponse.json(
        { error: 'Invalid discount ID' },
        { status: 400 }
      );
    }

    // Get discount code to check if it exists and get Stripe coupon ID
    const discountCode = await getDiscountCodeById(discountId);
    if (!discountCode) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 }
      );
    }

    try {
      // Delete from Stripe first if coupon exists
      if (discountCode.stripe_coupon_id) {
        await deleteStripeCoupon(discountCode.stripe_coupon_id);
      }
    } catch (stripeError) {
      console.error('Error deleting Stripe coupon:', stripeError);
      // Continue with database deletion even if Stripe deletion fails
    }

    // Delete from database
    const deleted = await deleteDiscountCode(discountId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Discount code deleted successfully'
    });

  } catch (error) {
    console.error('Admin discount DELETE error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
