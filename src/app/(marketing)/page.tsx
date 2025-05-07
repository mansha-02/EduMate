'use client'

import { Book, BrainIcon, Clock2Icon, FileText, TimerIcon } from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesGrid } from '@/components/sections/FeatureGrid'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaqSection } from '@/components/sections/FaqSection'

export default function Page() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/home')
    }
  }, [session, router])

  const features = [
    {
      icon: <Book className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" />, 
      title: "Personalized Study Plans", 
      description: "Get tailored study plans based on your goals and learning style."
    },
    {
      icon: <BrainIcon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" />, 
      title: "AI-Curated Resources",
      description: "Access high-quality study materials, including video tutorials, online courses, documentation, practice exercises, and academic papers curated by EduMate."
    },
    {
      icon: <TimerIcon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" />, 
      title: "Time Management",
      description: "Stay productive with efficient time management and focus boosters."
    },
    {
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" />, 
      title: "Interactive PDF Chat",
      description: "Upload PDFs and ask EduMate to summarize, explain, and highlight key information."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 -mt-2 sm:py-16 bg-gradient-to-br from-cyan-700 to-cyan-400 text-white">
      <HeroSection
        title="Welcome to"
        highlightedText="<EduMate/>"
        description="Personalized learning at its best, with AI assistance."
        ctaText={session ? "Go to Dashboard" : "Get Started"}
        ctaLink={session ? "/home" : "/register"}
        ctaClass="bg-white text-cyan-700 hover:bg-cyan-300 hover:text-white transition-all duration-300 shadow-lg px-6 py-2 rounded-lg"
      />
      
      <FeaturesGrid features={features} />

      <FaqSection />
    </div>
  )
}
