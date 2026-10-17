import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getLoggedUser } from "@/lib/user/user";

export const metadata = {
  title: "THF | Businesss Area",
  description: "Area business B2B di THF sviluppo dropboost.it",
};

export default async function LayoutManager({ children }) {
  
  const user = await getLoggedUser()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <SidebarProvider style={{"--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)"}}>
      <AppSidebar variant="inset" user={user}/>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  );
}
