'use client'

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loader2, UserCircle, Mail, Edit3, CheckCircle, XCircle } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  })

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
    <div className="container max-w-4xl py-8 flex justify-center">
      <Card className="border border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-300 shadow-xl rounded-lg w-full">
        <CardHeader className="border-b border-cyan-400">
          <CardTitle className="text-3xl font-bold flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-cyan-500">
              <AvatarImage
                src={session?.user?.image || "/images/default-avatar.png"}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback className="text-cyan-700 font-bold text-xl">
                <UserCircle className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl text-cyan-900 font-semibold flex items-center gap-2">
                {session?.user?.name}
              </h1>
              <p className="text-sm text-cyan-700 flex items-center gap-2">
                <Mail className="h-4 w-4" /> {session?.user?.email}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-cyan-800">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 border-cyan-500 focus:ring-cyan-500"
                  name="name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-cyan-800">Email</label>
                <Input
                  value={formData.email}
                  className="mt-1 border-cyan-500 bg-gray-200 cursor-not-allowed"
                  name="email"
                  disabled
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-cyan-500 text-cyan-700 hover:bg-cyan-100"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}