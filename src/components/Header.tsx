"use client"

import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Laptop } from 'lucide-react'


export function Header() {
  const { data: session } = useSession()


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cyan-900 backdrop-blur-sm border-b-2 border-border h-14">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link 
              href={session ? "/home" : "/"} 
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center=">
                <span className="text-black text-base sm:text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#09242f" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-laptop-minimal-check-icon lucide-laptop-minimal-check"><path d="M2 20h20"/><path d="m9 10 2 2 4-4"/><rect x="3" y="4" width="18" height="12" rx="2"/></svg></span>
              </div>
              <span className="font-semibold text-sm sm:text-base text-cyan-100">EduMate</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-2 sm:space-x-4">
           
              <>
                
                {!session ? (
                  <div className="flex gap-1 sm:gap-2">
                    
                    <Link href="/register" passHref>
                      <button className="px-2 sm:px-4 py-1.5 bg-cyan-200 border-2 border-b-4 border-r-4 border-black rounded-lg hover:bg-[#c1ff72] hover:border-b-2 hover:border-r-2 transition-all duration-100 text-xs sm:text-sm font-medium shadow-sm hover:shadow active:border-b-2 active:border-r-2">
                        Get Started
                      </button>
                    </Link>
                  </div>
                ) : null}
              </>
          </nav>
        </div>
      </div>
    </header>
  )
}