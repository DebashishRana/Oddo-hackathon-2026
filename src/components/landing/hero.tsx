"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Workflow,
  Github
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16" style={{backgroundImage: 'url(/hero-background.webp)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8 pt-12 sm:pt-24"
        >
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
          >
            Next Generation Documentation
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
              starts here
            </span>
            <br />
            
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl text-white max-w-3xl mx-auto leading-relaxed px-4"
          >
            Manage, verify, and redirect documents all at once with Dectra Supercharged with verefied databases and QR. 
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="text-base font-medium px-6 py-3 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/auth/signup" className="flex items-center space-x-2">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base font-medium px-6 py-3 h-12 rounded-lg border-2 hover:bg-muted/50 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="#features">Explore more</Link>
            </Button>
          </motion.div>

          {/* Live status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8"
          >
            {[
              {
                title: "EDV Verifying...",
                description: "Automated validation under 60 seconds",
                icon: <FileCheck2 className="w-5 h-5 text-primary" />
              },
              {
                title: "Govt backed integrity",
                description: "Double verification with trusted databases",
                icon: <ShieldCheck className="w-5 h-5 text-primary" />
              },
              {
                title: "Redirect and pipeline",
                description: "Stream results to your lakes and APIs securely",
                icon: <Workflow className="w-5 h-5 text-primary" />
              }
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start space-x-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-left"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* GitHub Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center pt-4"
          >
            <Button
              size="lg"
              variant="ghost"
              className="text-base font-medium px-6 py-3 h-12 rounded-lg hover:bg-muted/30 transition-all duration-300 hover:scale-105 border border-border/50"
              asChild
            >
              <Link
                href="https://github.com/zainulabedeen123/Best-Saas-Kit--V2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
