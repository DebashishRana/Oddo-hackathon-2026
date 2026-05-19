import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] min-h-screen">
        {/* Left Side - Background Image */}
        <div 
          className="hidden lg:block bg-cover bg-center"
          style={{
            backgroundImage: 'url(/contact.webp)',
            backgroundPosition: 'center'
          }}
        />

        {/* Right Side - Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-12">
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Let&apos;s Get In Touch.
              </h1>
              <p className="text-gray-600">
                Or reach out to{' '}
                <a href="mailto:hello@dectra.com" className="text-blue-600 hover:underline">
                  hello@dectra.com
                </a>
              </p>
            </div>

            {/* Form */}
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
