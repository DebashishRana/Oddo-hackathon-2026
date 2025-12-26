import { ContactForm } from "@/components/contact/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions about Best SAAS Kit V2? We&apos;re here to help! Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Multiple ways to reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Email Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">support@bestsaaskit.com</p>
                    <p className="text-xs text-gray-500">For technical support and general inquiries</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Response Time</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Within 24 hours</p>
                    <p className="text-xs text-gray-500">We typically respond much faster</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Global Remote Team</p>
                    <p className="text-xs text-gray-500">Supporting developers worldwide</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">How do I get started?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Check out our comprehensive documentation at /docs for step-by-step setup instructions.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm">Do you offer custom development?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Yes! Contact us to discuss your specific requirements and we&apos;ll provide a custom quote.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm">Is there a refund policy?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    We offer a 30-day money-back guarantee if you&apos;re not satisfied with the kit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Other Ways to Get Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Comprehensive guides and API references
                  </p>
                  <a 
                    href="/docs" 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Documentation →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Discord Community</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Join our community for discussions and support
                  </p>
                  <a 
                    href="https://discord.gg/bestsaaskit" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                  >
                    Join Discord →
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">GitHub Issues</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Report bugs and request features
                  </p>
                  <a 
                    href="https://github.com/zainulabedeen123/Best-Saas-Kit--V2/issues" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                  >
                    View Issues →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
