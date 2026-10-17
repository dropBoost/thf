import { createClient } from "@/lib/supabase/server"

export async function getLoggedUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data: profilo, error: profiloError } = await supabase
    .from("utente")
    .select(`
      id,
      nome,
      cognome,
      email,
      telefono,
      ragione_sociale,
      partita_iva,
      ruolo,
      attivo,
      stato,
      data_approvazione,
      creato_il
    `)
    .eq("id", user.id)
    .single()

  if (profiloError) throw profiloError

  return profilo
}