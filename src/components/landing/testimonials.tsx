"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "motion/react"

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Compliance",
      company: "NorthRiver Bank",
      content:
        "Dectra cut our verification time from days to minutes. Audit logs and QR retrieval make passing reviews painless.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Platform Lead",
      company: "FinEdge",
      content:
        "Bulk uploads plus automatic redirects feed our data lake in real time. We reclaimed a huge chunk of ops time.",
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "DocuServe",
      content:
        "QR-based access is a game changer for field teams. They scan, verify, and move on—no back-and-forth.",
    }
  ]

  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Customers
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Trusted by teams who verify at scale.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Compliance, fintech, and ops teams rely on Dectra for instant EDV, QR access, and audit-ready redirects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full rounded-2xl border-border/60 bg-card/25 backdrop-blur transition-colors duration-300 hover:bg-card/35">
                <CardContent className="p-6">
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/5 border border-border/60 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-foreground">
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
      </div>
    </section>
  )
}

export default Testimonials
