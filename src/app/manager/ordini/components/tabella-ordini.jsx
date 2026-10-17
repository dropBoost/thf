import Link from "next/link";
import { CircleDashed, CircleEuro, SquareArrowOutUpRight, Ellipsis } from "lucide-react";

export default function TabellaOrdini({ ordini = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ordini.length > 0 ? 
        ordini.map((o) => (
          <div className="flex flex-col border p-2 rounded-xl basis-2/6 w-full" key={o.id}>
            <span className="w-full text-xs text-primary font-bold">ORDINE #THF{o.cod_ordine} </span>
            <span className="uppercase text-xs">{o.cliente?.ragione_sociale || "—"}</span>
            <span className="truncate text-ellipsis"> {o.oggetto || "—"} </span>
            <div className="flex items-center justify-center gap-2 whitespace-nowrap w-40">
              <CircleDashed size={14} className="shrink-0 text-orange-500" aria-hidden="true" />
              <span>{o.stato?.alias || "—"}</span>
            </div>
            <div className="w-44"> {o.metodo_pagamento?.alias || "—"} </div>
            <div className="w-24">
              <div className="flex justify-center">
                {o.pagato === true ? (
                  <span className="inline-flex items-center gap-1.5 text-green-600" aria-label="Pagato">
                    <CircleEuro size={16} aria-hidden="true" />
                    <span className="sr-only">Pagato</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-orange-500" aria-label="Da pagare">
                    <CircleDashed size={16} aria-hidden="true" />
                    <span className="sr-only">Da pagare</span>
                  </span>
                )}
              </div>
            </div>
            <div className="text-right w-16">
              <Link href={`/manager/ordini/${o.id}`} className="inline-flex rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Apri ordine THF${o.cod_ordine}`}>
                <SquareArrowOutUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          ))
        : <span>CIAO</span>
      }
    </div>
  );
}