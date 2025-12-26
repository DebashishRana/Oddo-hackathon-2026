"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, Loader2, Percent, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface DiscountDetails {
  discount_id: number
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  code: string
}

interface DiscountInputProps {
  onDiscountApplied: (discount: DiscountDetails | null) => void
  disabled?: boolean
}

export function DiscountInput({ onDiscountApplied, disabled = false }: DiscountInputProps) {
  const [discountCode, setDiscountCode] = React.useState('')
  const [appliedDiscount, setAppliedDiscount] = React.useState<DiscountDetails | null>(null)
  const [isValidating, setIsValidating] = React.useState(false)
  const [error, setError] = React.useState('')

  const validateDiscount = async () => {
    if (!discountCode.trim()) {
      setError('Please enter a discount code')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode.trim()
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const discount = data.data
        setAppliedDiscount(discount)
        onDiscountApplied(discount)
        toast.success('Discount code applied successfully!')
      } else {
        setError(data.error || 'Invalid discount code')
        setAppliedDiscount(null)
        onDiscountApplied(null)
      }
    } catch (error) {
      console.error('Discount validation error:', error)
      setError('Failed to validate discount code')
      setAppliedDiscount(null)
      onDiscountApplied(null)
    } finally {
      setIsValidating(false)
    }
  }

  const removeDiscount = () => {
    setDiscountCode('')
    setAppliedDiscount(null)
    setError('')
    onDiscountApplied(null)
    toast.success('Discount code removed')
  }

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${(value / 100).toFixed(2)}`
  }

  // Commented out - reserved for future use
  // const calculateDiscountAmount = (originalPrice: number, discount: DiscountDetails) => {
  //   if (discount.discount_type === 'percentage') {
  //     return (originalPrice * discount.discount_value) / 100
  //   } else {
  //     return Math.min(discount.discount_value / 100, originalPrice) // Don't exceed original price
  //   }
  // }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      validateDiscount()
    }
  }

  return (
    <div className="space-y-4">
      {!appliedDiscount ? (
        <div className="space-y-2">
          <Label htmlFor="discount-code">Discount Code (Optional)</Label>
          <div className="flex space-x-2">
            <Input
              id="discount-code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter discount code"
              disabled={disabled || isValidating}
              className={error ? 'border-red-500' : ''}
            />
            <Button
              onClick={validateDiscount}
              disabled={disabled || isValidating || !discountCode.trim()}
              variant="outline"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <X className="h-3 w-3" />
              <span>{error}</span>
            </p>
          )}
        </div>
      ) : (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Discount Applied
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {appliedDiscount.code}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                    {appliedDiscount.discount_type === 'percentage' ? (
                      <Percent className="h-3 w-3" />
                    ) : (
                      <DollarSign className="h-3 w-3" />
                    )}
                    <span>
                      {formatDiscountValue(appliedDiscount.discount_type, appliedDiscount.discount_value)} off
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={removeDiscount}
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Price display component that shows original and discounted prices
interface PriceDisplayProps {
  originalPrice: number
  discount?: DiscountDetails | null
  className?: string
}

export function PriceDisplay({ originalPrice, discount, className = "" }: PriceDisplayProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  if (!discount) {
    return (
      <div className={`text-2xl font-bold ${className}`}>
        {formatPrice(originalPrice)}
      </div>
    )
  }

  const discountAmount = discount.discount_type === 'percentage' 
    ? (originalPrice * discount.discount_value) / 100
    : Math.min(discount.discount_value / 100, originalPrice)
  
  const finalPrice = originalPrice - discountAmount

  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <span className="text-lg text-muted-foreground line-through">
          {formatPrice(originalPrice)}
        </span>
        <span className="text-2xl font-bold text-green-600">
          {formatPrice(finalPrice)}
        </span>
      </div>
      <div className="text-sm text-green-600">
        You save {formatPrice(discountAmount)}
      </div>
    </div>
  )
}
