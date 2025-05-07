import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface HeroSectionProps {
  logo?: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaClass:string;
}

export function HeroSection({ 
  logo = "🎓",
  title,
  highlightedText,
  description,
  ctaText,
  ctaLink,
  ctaClass
}: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-gray-800">
        {title} <span className="text-cyan-950">{highlightedText}</span>
      </h1>
      <p className="mt-3 text-lg text-gray-600 mb-8">
        {description}
      </p>
      <Link href={ctaLink}>
        <Button className="bg-white text-cyan-700 hover:bg-cyan-700 hover:text-white transition-all duration-300 shadow-md">
          {ctaText}
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </Link>
    </motion.div>
  )
}