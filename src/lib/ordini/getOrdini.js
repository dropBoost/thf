import { createClient } from "../supabase/server";

export async function getOrdini() {

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("ordine")
    .select(`
      *,
      cliente:utente(*),
      metodo_pagamento:ordine_metodo_pagamento(*),
      stato:ordine_stato(*),
      sconto:codice_sconto(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossibile recuperare gli ordini: ${error.message}`);
  }

  return data ?? [];
}