"use client"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"
import Image from "next/image"


export function AppSidebar({ user, ...props }) {

  const data = {

    user: {
      name: `${user?.nome} ${user?.cognome}`,
      email: `${user?.email}`,
      avatar: "#",
    },
    navMain: [
      {
        title: "Manager",
        url: "/manager",
        ruolo: ["admin", "superadmin", "cliente"],
        icon: (
          <LayoutDashboardIcon
          />
        ),
      },
      {
        title: "Ordini",
        url: "/manager/ordini",
        icon: (
          <ListIcon
          />
        ),
      },
      {
        title: "Clienti",
        url: "/manager/clienti",
        icon: (
          <ListIcon
          />
        ),
      },
      {
        title: "Prodotti",
        url: "/manager/prodotti",
        icon: (
          <ListIcon
          />
        ),
      },
      {
        title: "Analytics",
        url: "#",
        icon: (
          <ChartBarIcon
          />
        ),
      },
      {
        title: "Projects",
        url: "#",
        icon: (
          <FolderIcon
          />
        ),
      },
      {
        title: "Team",
        url: "#",
        icon: (
          <UsersIcon
          />
        ),
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: (
          <CameraIcon
          />
        ),
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: (
          <FileTextIcon
          />
        ),
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: (
          <FileTextIcon
          />
        ),
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: (
          <Settings2Icon
          />
        ),
      },
      {
        title: "Get Help",
        url: "#",
        icon: (
          <CircleHelpIcon
          />
        ),
      },
      {
        title: "Search",
        url: "#",
        icon: (
          <SearchIcon
          />
        ),
      },
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: (
          <DatabaseIcon
          />
        ),
      },
      {
        name: "Reports",
        url: "#",
        icon: (
          <FileChartColumnIcon
          />
        ),
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: (
          <FileIcon
          />
        ),
      },
    ],

  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className={`flex flex-row items-center gap-2`}>
            <img src={`/assets/img/logo-thf.png`} alt="logo-thf-business-area" className="max-w-30 h-auto"/>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
