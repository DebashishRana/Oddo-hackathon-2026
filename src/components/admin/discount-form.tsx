"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DiscountCode } from "@/lib/database"

export interface DiscountFormData {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  expires_at: string | null;
  is_active: boolean;
}

interface DiscountFormProps {
  discount?: DiscountCode
  onSubmit: (data: DiscountFormData) => void
  isLoading: boolean
}

export function DiscountForm({ discount, onSubmit, isLoading }: DiscountFormProps) {
  const [formData, setFormData] = React.useState({
    code: discount?.code || '',
    discount_type: discount?.discount_type || 'percentage',
    discount_value: discount?.discount_value || 10,
    max_uses: discount?.max_uses || null,
    expires_at: discount?.expires_at ? new Date(discount.expires_at) : null,
    is_active: discount?.is_active ?? true,
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate code
    if (!formData.code.trim()) {
      newErrors.code = 'Discount code is required'
    } else if (formData.code.length < 3) {
      newErrors.code = 'Discount code must be at least 3 characters'
    } else if (!/^[A-Z0-9_-]+$/i.test(formData.code)) {
      newErrors.code = 'Discount code can only contain letters, numbers, hyphens, and underscores'
    }

    // Validate discount value
    if (!formData.discount_value || formData.discount_value <= 0) {
      newErrors.discount_value = 'Discount value must be greater than 0'
    } else if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
      newErrors.discount_value = 'Percentage discount cannot exceed 100%'
    }

    // Validate max uses
    if (formData.max_uses !== null && formData.max_uses <= 0) {
      newErrors.max_uses = 'Max uses must be greater than 0 or left empty for unlimited'
    }

    // Validate expiration date
    if (formData.expires_at && formData.expires_at <= new Date()) {
      newErrors.expires_at = 'Expiration date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      max_uses: formData.max_uses,
      expires_at: formData.expires_at?.toISOString() || null,
      is_active: formData.is_active,
    }

    onSubmit(submitData)
  }

  const handleInputChange = (field: string, value: string | number | boolean | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Discount Code */}
      <div className="space-y-2">
        <Label htmlFor="code">Discount Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          placeholder="e.g., SAVE20, WELCOME10"
          className={errors.code ? 'border-red-500' : ''}
        />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code}</p>
        )}
      </div>

      {/* Discount Type */}
      <div className="space-y-2">
        <Label htmlFor="discount_type">Discount Type</Label>
        <Select
          value={formData.discount_type}
          onValueChange={(value) => handleInputChange('discount_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select discount type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discount Value */}
      <div className="space-y-2">
        <Label htmlFor="discount_value">
          Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
        </Label>
        <Input
          id="discount_value"
          type="number"
          min="1"
          max={formData.discount_type === 'percentage' ? 100 : undefined}
          step={formData.discount_type === 'percentage' ? 1 : 0.01}
          value={formData.discount_value}
          onChange={(e) => handleInputChange('discount_value', parseFloat(e.target.value) || 0)}
          placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
          className={errors.discount_value ? 'border-red-500' : ''}
        />
        {errors.discount_value && (
          <p className="text-sm text-red-500">{errors.discount_value}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {formData.discount_type === 'percentage' 
            ? 'Enter percentage (1-100)' 
            : 'Enter amount in dollars (e.g., 10.00 for $10)'
          }
        </p>
      </div>

      {/* Max Uses */}
      <div className="space-y-2">
        <Label htmlFor="max_uses">Maximum Uses (Optional)</Label>
        <Input
          id="max_uses"
          type="number"
          min="1"
          value={formData.max_uses || ''}
          onChange={(e) => handleInputChange('max_uses', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Leave empty for unlimited uses"
          className={errors.max_uses ? 'border-red-500' : ''}
        />
        {errors.max_uses && (
          <p className="text-sm text-red-500">{errors.max_uses}</p>
        )}
      </div>

      {/* Expiration Date */}
      <div className="space-y-2">
        <Label>Expiration Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.expires_at && "text-muted-foreground",
                errors.expires_at && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.expires_at ? (
                format(formData.expires_at, "PPP")
              ) : (
                <span>Pick a date (optional)</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.expires_at || undefined}
                onSelect={(date) => handleInputChange('expires_at', date ?? null)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
            {formData.expires_at && (
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('expires_at', null)}
                  className="w-full"
                >
                  Clear Date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {errors.expires_at && (
          <p className="text-sm text-red-500">{errors.expires_at}</p>
        )}
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (discount ? 'Update' : 'Create')} Discount
        </Button>
      </div>
    </form>
  )
}
