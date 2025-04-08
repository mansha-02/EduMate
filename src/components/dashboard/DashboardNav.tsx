"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, User, FileText, Home, Clock, LogOut, LayoutGrid, UploadCloud } from "lucide-react"
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string;
  icon:  React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  badge?: string;
  onClick?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onCollapse?: (collapsed: boolean) => void;
}

export function DashboardNav({ className, onCollapse, ...props }: DashboardNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse?.(!isCollapsed);
  }

  const navSections: NavSection[] = [
    {
      title: "",
      items: [
        { label: 'Home', icon: Home, href: '/home' },
        { label: 'Profile', icon: User, href: '/profile' },
      ]
    },
    {
      title: "Your Study Assistants", 
      items: [
        { label: 'Edu-Planner', icon: Book, href: '/study-plan' },
        { label: 'Your Resources', icon: LayoutGrid, href: '/resources' },
        { label: 'PDF Assistant', icon: UploadCloud, href: '/pdf' },
        { label: 'Timer', icon: Clock, href: '/timer' },
        { label: 'Your Notes', icon: FileText, href: '/notes' },
      ]
    },
    {
      title: "Account",
      items: [
        { label: 'Log out', icon: LogOut, href: '#', onClick: () => signOut({ callbackUrl: '/' }) }
      ]
    }
  ]

  return (
    <nav 
      className={cn(
        "relative h-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white overflow-y-auto transition-all duration-300",
        isCollapsed ? "md:w-20" : "md:w-64",
        className
      )} 
      {...props}
    >
      <div className="px-3 py-2">
        <div className="hidden md:block">
          <div className={cn("mb-6", isCollapsed ? "px-2" : "px-4")}> 
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={session?.user?.image || "/images/default-avatar.png"} alt={session?.user?.name || '@user'} />
                <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              {!isCollapsed && session?.user?.name && (
                <p className="mt-2 text-sm font-medium text-center">{session.user.name}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 bg-white text-cyan-700 hover:bg-cyan-600 hover:text-white"
              onClick={toggleCollapse}
            >
              {isCollapsed ? ">" : "Full screen mode"}
            </Button>
          </div>
          {navSections.map((section, idx) => (
            <div key={section.title} className="py-2">
              {!isCollapsed && <h3 className="px-4 text-xs font-medium text-white/80 mb-2">{section.title}</h3>}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={item.onClick}
                    className={cn(
                      "flex items-center gap-3 rounded-md text-sm font-medium px-4 py-2 transition-all duration-200 hover:bg-cyan-600 hover:shadow-lg",
                      pathname === item.href ? "bg-cyan-700 shadow-md" : "bg-transparent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}