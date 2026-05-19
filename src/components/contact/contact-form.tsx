"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle } from "lucide-react"

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  companysize: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    companysize: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      const response = await fetch('/api/emails/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          company: formData.firstName,
          phone: formData.phone,
          companysize: formData.companysize,
          message: formData.message
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          companysize: ''
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to send message')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {submitStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            We&apos;ve received your message and will get back to you soon.
          </p>
          <Button 
            onClick={() => setSubmitStatus('idle')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm text-gray-700 font-medium">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name..."
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm text-gray-700 font-medium">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name..."
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm text-gray-700 font-medium">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address..."
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-sm text-gray-700 font-medium">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+44 (000) 000-0000"
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
            />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <Label htmlFor="message" className="text-sm text-gray-700 font-medium">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your main text here..."
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              rows={5}
              className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none rounded-xl p-3"
            />
            <p className="text-xs text-gray-400 text-right">300/300</p>
          </div>

          {/* Company Size (Hidden but sent) */}
          <input
            type="hidden"
            name="companysize"
            value={formData.companysize || "not-specified"}
          />

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-red-600 text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-all duration-200 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
            {!isSubmitting && ' →'}
          </Button>
        </form>
      )}
    </>
  )
}
