import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  if (!tokenHash || type !== "email") {
    return NextResponse.redirect(
      new URL("/signup?errore=conferma", request.url)
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  })

  if (error) {
    return NextResponse.redirect(
      new URL("/signup?errore=conferma", request.url)
    )
  }

  return NextResponse.redirect(
    new URL("/accesso-in-attesa", request.url)
  )
}