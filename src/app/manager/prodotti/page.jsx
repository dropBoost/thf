import { ManagerSectionHeader } from "@/components/manager-section-header";
import { MtitleSection } from "@/components/manager-title-section";
export default async function ProdottiPage() {

  return (
    <>
    <ManagerSectionHeader/>
    <main className="flex flex-1 gap-5 flex-col p-4 lg:p-6 overflow-auto">
      <div className="flex flex-col gap-2">
        <MtitleSection title={"CoMpOnEnTi"}/>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <MtitleSection title={"Prodotti"}/>
      </div>
    </main>
    </>
  );
}