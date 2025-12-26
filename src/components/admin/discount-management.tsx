"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react"
import { DiscountForm, type DiscountFormData } from "./discount-form"
import { toast } from "sonner"
import type { DiscountCode } from "@/lib/database"

interface DiscountStats {
  totalCodes: number
  activeCodes: number
  expiredCodes: number
  usedCodes: number
  totalUsage: number
}

interface DiscountManagementProps {
  initialDiscounts: DiscountCode[]
  initialStats: DiscountStats
}

export function DiscountManagement({ initialDiscounts, initialStats }: DiscountManagementProps) {
  const [discounts, setDiscounts] = React.useState<DiscountCode[]>(initialDiscounts)
  const [stats, setStats] = React.useState<DiscountStats>(initialStats)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingDiscount, setEditingDiscount] = React.useState<DiscountCode | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const refreshData = async () => {
    try {
      const response = await fetch('/api/admin/discounts?stats=true')
      if (response.ok) {
        const data = await response.json()
        setDiscounts(data.data.discountCodes)
        setStats(data.data.stats)
      }
    } catch {
      console.error('Error refreshing discount data')
    }
  }

  const handleCreateDiscount = async (discountData: DiscountFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discountData),
      })

      if (response.ok) {
        toast.success('Discount code created successfully!')
        setIsCreateDialogOpen(false)
        await refreshData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create discount code')
      }
    } catch {
      toast.error('Failed to create discount code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateDiscount = async (id: number, discountData: Partial<DiscountFormData>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/discounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discountData),
      })

      if (response.ok) {
        toast.success('Discount code updated successfully!')
        setEditingDiscount(null)
        await refreshData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update discount code')
      }
    } catch {
      toast.error('Failed to update discount code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDiscount = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/discounts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Discount code deleted successfully!')
        await refreshData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete discount code')
      }
    } catch {
      toast.error('Failed to delete discount code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (discount: DiscountCode) => {
    await handleUpdateDiscount(discount.id, {
      is_active: !discount.is_active
    })
  }

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Discount code copied to clipboard!')
  }

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${(value / 100).toFixed(2)}`
  }

  const formatDate = (dateValue: Date | string) => {
    return new Date(dateValue).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt?: Date | null) => {
    if (!expiresAt) return false
    return expiresAt < new Date()
  }

  const isMaxUsesReached = (discount: DiscountCode) => {
    if (!discount.max_uses) return false
    return discount.current_uses >= discount.max_uses
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.usedCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiredCodes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Discount Codes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discount Codes</CardTitle>
              <CardDescription>
                Manage promotional discount codes for your application
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Discount
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Discount Code</DialogTitle>
                  <DialogDescription>
                    Create a new promotional discount code
                  </DialogDescription>
                </DialogHeader>
                <DiscountForm
                  onSubmit={handleCreateDiscount}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No discount codes found. Create your first discount code to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-mono">
                        <div className="flex items-center space-x-2">
                          <span>{discount.code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyDiscountCode(discount.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {discount.discount_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDiscountValue(discount.discount_type, discount.discount_value)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {discount.current_uses}
                          {discount.max_uses && ` / ${discount.max_uses}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <Badge 
                            variant={discount.is_active ? "default" : "secondary"}
                          >
                            {discount.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {isExpired(discount.expires_at) && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                          {isMaxUsesReached(discount) && (
                            <Badge variant="destructive">Max Uses Reached</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {discount.expires_at 
                          ? formatDate(discount.expires_at)
                          : "Never"
                        }
                      </TableCell>
                      <TableCell>
                        {formatDate(discount.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(discount)}
                            disabled={isLoading}
                          >
                            {discount.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingDiscount(discount)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Discount Code</DialogTitle>
                                <DialogDescription>
                                  Update the discount code settings
                                </DialogDescription>
                              </DialogHeader>
                              {editingDiscount && (
                                <DiscountForm
                                  discount={editingDiscount}
                                  onSubmit={(data) => handleUpdateDiscount(editingDiscount.id, data)}
                                  isLoading={isLoading}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Discount Code</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the discount code &quot;{discount.code}&quot;? 
                                  This action cannot be undone and will also remove the associated Stripe coupon.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDiscount(discount.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
