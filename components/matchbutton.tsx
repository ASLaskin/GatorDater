'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function MatchUsersButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleMatch = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/match-users', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to match users')
      }

      const data = await response.json()
      alert(`Successfully created ${data.matchCount} matches!`)
    } catch (error) {
      console.error('Error matching users:', error)
      alert('Failed to match users. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleMatch} 
      disabled={isLoading}
      className="w-full max-w-xs"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Matching Users...
        </>
      ) : (
        'Match All Users'
      )}
    </Button>
  )
}