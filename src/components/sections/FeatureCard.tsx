import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 rounded-lg p-6 pb-8 border-2 border-b-4 border-r-4 border-cyan-600 hover:border-b-2 hover:border-r-2 transition-all duration-100 shadow-md hover:shadow-lg active:border-b-2 active:border-r-2"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-cyan-900">{title}</h3>
        </div>
        <p className="text-cyan-800">{description}</p>
      </div>
    </motion.div>
  )
}
