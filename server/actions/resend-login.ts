"use server"

import { signIn } from "@/server/auth"

export default async function resendLogin(formData: FormData) {


  // Sign in
  await signIn("resend", formData)
  
 
}