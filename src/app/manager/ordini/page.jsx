import { ManagerSectionHeader } from "@/components/manager-section-header";
import TabellaOrdini from "./components/tabella-ordini";
import { getOrdini } from "@/lib/ordini/getOrdini";
import { MtitleSection } from "@/components/manager-title-section";

export default async function OrdiniPage() {

  const ordini = await getOrdini();

  return (
    <>
    <ManagerSectionHeader/>
    <main className="flex flex-1 gap-5 flex-col p-4 lg:p-6 overflow-auto">
      <div className="h-50 border">
        ciao
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <MtitleSection title={`Ordini`}/>
        <TabellaOrdini ordini={ordini}/>
      </div>
      <div className="w-full bg-muted jusitfy-end">ordini totali {ordini.length}</div>
    </main>
    </>
  );
}