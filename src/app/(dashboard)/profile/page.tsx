'use client'

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2, BookOpen, Brain, Clock } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  })

  const stats = [
    {
      title: "Study Hours",
      value: "12.5",
      icon: <Clock className="h-4 w-4 text-[#7fb236]" />,
    },
    {
      title: "Completed Plans",
      value: "5",
      icon: <BookOpen className="h-4 w-4 text-[#7fb236]" />,
    },
    {
      title: "Saved Resources",
      value: "24",
      icon: <Brain className="h-4 w-4 text-[#7fb236]" />,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card className="bg-white border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="text-2xl font-bold flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={session?.user?.image || "/images/default-avatar.png"}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl">{session?.user?.name}</h1>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white border-2 border-black">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className="w-8 h-8 bg-[#c1ff72] rounded-sm flex items-center justify-center border-2 border-b-4 border-r-4 border-black">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                  name="name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                  name="email"
                  disabled
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 