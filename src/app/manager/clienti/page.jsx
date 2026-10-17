import { redirect } from "next/navigation"
import { ClientiList } from "./components/clienti-list"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function ClientiPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: operatore } = await supabase
    .from("utente")
    .select("ruolo, attivo, stato")
    .eq("id", user.id)
    .single()

  if (
    !operatore ||
    !["admin", "superadmin"].includes(operatore.ruolo) ||
    !operatore.attivo ||
    operatore.stato !== "approvato"
  ) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Accesso non autorizzato</h1>
      </main>
    )
  }

  const admin = createAdminClient()

  const { data: clienti, error } = await admin
    .from("utente")
    .select(
      "id, nome, cognome, email, telefono, ragione_sociale, partita_iva, attivo, stato, data_approvazione, creato_il"
    )
    .eq("ruolo", "cliente")
    .order("creato_il", { ascending: false })

  if (error) {
    throw new Error(`Impossibile caricare i clienti: ${error.message}`)
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Clienti B2B</h1>
        <p className="text-sm text-muted-foreground">
          Visualizza le iscrizioni e abilita l’accesso dei clienti.
        </p>
      </div>

      <ClientiList clienti={clienti ?? []} />
    </main>
  )
}