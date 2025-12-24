"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Compliance",
      company: "NorthRiver Bank",
      content: "VeriQuick cut our document verification time from days to minutes. Audit logs, QR retrieval, and gov-backed checks make passing reviews painless.",
      rating: 5,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Marcus Rodriguez",
      role: "Platform Lead",
      company: "FinEdge",
      content: "Bulk uploads plus automatic redirects feed our data lake in real time. We reclaimed 30% of ops time and eliminated manual checks.",
      rating: 5,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "DocuServe",
      content: "QR-based access is a game changer for field teams. They scan, verify, and move on — zero back-and-forth with HQ.",
      rating: 5,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "David Kim",
      role: "Indie Hacker",
      company: "Solo Founder",
      content: "I plugged VeriQuick into my portal with minimal code. Token-based auth and auto-deletion keep me compliant out of the box.",
      rating: 5,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Lisa Thompson",
      role: "CTO",
      company: "RegShield",
      content: "Government database checks layered with our own APIs give us double assurance against fraud. Clients love the transparency.",
      rating: 5,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      company: "FreelanceForce",
      content: "Every client project asks for verification now. VeriQuick lets me ship QR flows, redirects, and audit logs without rewriting code.",
      rating: 5,
      avatar: "/api/placeholder/40/40"
    }
  ]

  return (
    <section id="testimonials" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Trusted by teams who need documents to verify fast
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Banks, fintechs, and ops teams rely on VeriQuick for instant EDV, QR access, and auditable redirects.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">120K+</div>
            <div className="text-muted-foreground">Documents verified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">30%</div>
            <div className="text-muted-foreground">Ops cost reduction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-muted-foreground">Verification uptime</div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Join the verified lane</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Move verification from a backlog to a one-click flow. VeriQuick keeps every redirect, QR, and EDV check compliant and fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start verifying
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-border px-8 py-3 rounded-lg font-medium hover:bg-muted/50 transition-colors"
              >
                See a live run
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
