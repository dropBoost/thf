"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function attivaClienteAction(clienteId, attivo) {
  if (
    typeof clienteId !== "string" ||
    typeof attivo !== "boolean"
  ) {
    return { ok: false, error: "Richiesta non valida." }
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { ok: false, error: "Devi effettuare l'accesso." }
  }

  // Questa lettura usa la RLS: l'utente può leggere solo il proprio profilo.
  const { data: operatore, error: operatoreError } = await supabase
    .from("utente")
    .select("ruolo, attivo, stato")
    .eq("id", user.id)
    .single()

  if (
    operatoreError ||
    !operatore ||
    !["admin", "superadmin"].includes(operatore.ruolo) ||
    !operatore.attivo ||
    operatore.stato !== "approvato"
  ) {
    return { ok: false, error: "Non sei autorizzato a gestire i clienti." }
  }

  const admin = createAdminClient()

  const { data: cliente, error: clienteError } = await admin
    .from("utente")
    .select("id, ruolo, data_approvazione")
    .eq("id", clienteId)
    .eq("ruolo", "cliente")
    .single()

  if (clienteError || !cliente) {
    return { ok: false, error: "Cliente non trovato." }
  }

  if (attivo) {
    const { data: authData, error: userError } =
      await admin.auth.admin.getUserById(clienteId)

    if (
      userError ||
      !authData.user?.email_confirmed_at
    ) {
      return {
        ok: false,
        error: "Il cliente deve confermare l'email prima dell'approvazione.",
      }
    }
  }

  const modifiche = attivo
    ? {
        attivo: true,
        stato: "approvato",
        data_approvazione:
          cliente.data_approvazione ?? new Date().toISOString(),
      }
    : {
        attivo: false,
      }

  const { data: aggiornato, error: updateError } = await admin
    .from("utente")
    .update(modifiche)
    .eq("id", clienteId)
    .eq("ruolo", "cliente")
    .select("id")
    .single()

  if (updateError || !aggiornato) {
    return {
      ok: false,
      error: updateError?.message || "Impossibile aggiornare il cliente.",
    }
  }

  revalidatePath("/manager/clienti")

  return { ok: true }
}