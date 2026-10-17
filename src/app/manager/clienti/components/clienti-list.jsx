"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { attivaClienteAction } from "../actions/attiva-cliente-action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatDate(value) {
  if (!value) return "—"

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

export function ClientiList({ clienti }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleToggle(cliente) {
    setLoadingId(cliente.id)
    setErrorMessage("")

    try {
      const result = await attivaClienteAction(
        cliente.id,
        !cliente.attivo
      )

      if (!result.ok) {
        setErrorMessage(result.error)
        return
      }

      router.refresh()
    } catch {
      setErrorMessage("Si è verificato un errore. Riprova.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-5">
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {clienti.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Non ci sono ancora clienti registrati.
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {clienti.map((cliente) => (
          <Card key={cliente.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>
                  {cliente.nome} {cliente.cognome}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {cliente.ragione_sociale || "Ragione sociale non presente"}
                </p>
              </div>

              <span
                className={
                  cliente.attivo
                    ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"
                    : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800"
                }
              >
                {cliente.attivo ? "Attivo" : "Non attivo"}
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="break-all">{cliente.email}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Telefono</dt>
                  <dd>{cliente.telefono || "—"}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Partita IVA</dt>
                  <dd>{cliente.partita_iva || "—"}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Stato</dt>
                  <dd>{cliente.stato}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Registrato il</dt>
                  <dd>{formatDate(cliente.creato_il)}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Approvato il</dt>
                  <dd>{formatDate(cliente.data_approvazione)}</dd>
                </div>
              </dl>

              <Button
                type="button"
                variant={cliente.attivo ? "outline" : "default"}
                disabled={loadingId !== null}
                onClick={() => handleToggle(cliente)}
              >
                {loadingId === cliente.id
                  ? "Salvataggio..."
                  : cliente.attivo
                    ? "Disattiva cliente"
                    : "Approva e attiva"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}