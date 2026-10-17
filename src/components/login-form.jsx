"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "cn"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") || "").trim().toLowerCase()
    const password = String(formData.get("password") || "")

    const supabase = createClient()

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (loginError || !data.user) {
        throw new Error("Email o password non corretti, oppure email non confermata.")
      }

      const { data: utente, error: profiloError } = await supabase
        .from("utente")
        .select("ruolo, attivo, stato")
        .eq("id", data.user.id)
        .single()

      if (profiloError || !utente) {
        await supabase.auth.signOut()
        throw new Error("Profilo utente non trovato. Contatta l'assistenza.")
      }

      if (!utente.attivo || utente.stato !== "approvato") {
        await supabase.auth.signOut()
        throw new Error(
          "Il tuo account non è ancora abilitato. Attendi l'approvazione del nostro team."
        )
      }

      const destinazione =
        utente.ruolo === "cliente" ? "/area-clienti" : "/manager"

      router.replace(destinazione)
      router.refresh()
    } catch (error) {
      setErrorMessage(error.message || "Impossibile effettuare l'accesso.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEndIcon className="size-6" />
            </div>

            <h1 className="text-xl font-bold">Accedi a THF</h1>

            <FieldDescription>
              Non hai un account?{" "}
              <Link href="/signup" className="underline">
                Richiedi l’accesso
              </Link>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nome@azienda.it"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>

          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}