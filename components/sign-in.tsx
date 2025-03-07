"use client"

import { useRef, useState } from "react"
import resendLogin from "@/server/actions/resend-login"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
      className="bg-blue-600 p-2 rounded-md text-white w-full" 
      type="submit"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign in with Resend"}
    </button>
  )
}

export function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  // Use Next.js provided way to handle server action
  async function handleSubmit(formData: FormData) {
    setError(null)
    
    const email = formData.get("email") as string
    
    // Client-side validation
    if (!email || !email.endsWith("@ufl.edu")) {
      setError("Only @ufl.edu email addresses are allowed")
      return
    }
    
    try {
      await resendLogin(formData)
      // Form submitted successfully
      if (formRef.current) {
        formRef.current.reset()
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  return (
    <form 
      ref={formRef}
      className="flex flex-col items-center gap-2 w-full" 
      action={handleSubmit}
    >
      <input
        className="border border-slate-200 rounded-md p-2 w-full"
        type="email"
        name="email"
        placeholder="Email (@ufl.edu only)"
        required
        pattern=".+@ufl\.edu$"
        title="Please enter a valid @ufl.edu email address"
      />
      {error && (
        <p className="text-red-500 text-sm w-full">{error}</p>
      )}
      <SubmitButton />
    </form>
  )
}