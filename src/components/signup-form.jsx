"use client"

import { useState } from "react"
import { cn } from "cn"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ className, ...props }) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    setErrorMessage("")
    setSuccessMessage("")

    const nome = String(formData.get("nome") || "").trim()
    const cognome = String(formData.get("cognome") || "").trim()
    const email = String(formData.get("email") || "").trim().toLowerCase()
    const telefono = String(formData.get("telefono") || "").trim()
    const ragioneSociale = String(
      formData.get("ragione_sociale") || ""
    ).trim()
    const partitaIva = String(formData.get("partita_iva") || "").trim()
    const password = String(formData.get("password") || "")
    const confermaPassword = String(
      formData.get("confermaPassword") || ""
    )

    if (!nome || !cognome || !email || !ragioneSociale || !partitaIva) {
      setErrorMessage("Compila tutti i campi obbligatori.")
      return
    }

    if (!/^[0-9]{11}$/.test(partitaIva)) {
      setErrorMessage(
        "La partita IVA deve contenere esattamente 11 cifre, senza lettere o spazi."
      )
      return
    }

    if (password.length < 8) {
      setErrorMessage("La password deve contenere almeno 8 caratteri.")
      return
    }

    if (password !== confermaPassword) {
      setErrorMessage("Le password non coincidono.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            nome,
            cognome,
            telefono,
            ragione_sociale: ragioneSociale,
            partita_iva: partitaIva,
          },
        },
      })

      if (error) {
        throw error
      }

      form.reset()

      setSuccessMessage(
        "Registrazione ricevuta. Controlla la tua email per confermare l'indirizzo. Dopo la conferma, la richiesta resterà in attesa della nostra approvazione."
      )
    } catch (error) {
      setErrorMessage(
        error.message || "Impossibile completare la registrazione."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Richiedi l’accesso B2B
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Crea il tuo account. La richiesta sarà esaminata
                  dal nostro team.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="nome">Nome</FieldLabel>
                  <Input
                    id="nome"
                    name="nome"
                    autoComplete="given-name"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cognome">Cognome</FieldLabel>
                  <Input
                    id="cognome"
                    name="cognome"
                    autoComplete="family-name"
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="ragione_sociale">
                  Ragione sociale
                </FieldLabel>
                <Input
                  id="ragione_sociale"
                  name="ragione_sociale"
                  autoComplete="organization"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="partita_iva">
                  Partita IVA
                </FieldLabel>
                <Input
                  id="partita_iva"
                  name="partita_iva"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{11}"
                  minLength={11}
                  maxLength={11}
                  placeholder="12345678901"
                  required
                />
                <FieldDescription>
                  Inserisci solo le 11 cifre, senza prefisso IT.
                </FieldDescription>
              </Field>

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
                <FieldLabel htmlFor="telefono">Telefono</FieldLabel>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confermaPassword">
                    Conferma password
                  </FieldLabel>
                  <Input
                    id="confermaPassword"
                    name="confermaPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>
              </div>

              <FieldDescription>
                La password deve contenere almeno 8 caratteri.
              </FieldDescription>

              {errorMessage && (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p role="status" className="text-sm text-green-700">
                  {successMessage}
                </p>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Registrazione in corso..."
                    : "Invia la richiesta"}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="relative hidden items-center justify-center bg-muted p-10 md:flex">
            <div className="max-w-xs space-y-4">
              <p className="text-3xl font-bold">
                THF Business Area
              </p>
              <p className="text-muted-foreground">
                Accedi agli strumenti dedicati ai clienti e alla
                produzione B2B.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}