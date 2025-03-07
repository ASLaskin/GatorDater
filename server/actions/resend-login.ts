"use server"

import { signIn } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function resendLogin(formData: FormData) {
  const email = formData.get("email") as string
  
  // Validate that the email ends with @ufl.edu
  if (!email || !email.endsWith("@ufl.edu")) {
    // We don't return an object, instead throw an error
    throw new Error("Only @ufl.edu email addresses are allowed")
  }
  
  // Sign in
  await signIn("resend", formData)
  
 
}