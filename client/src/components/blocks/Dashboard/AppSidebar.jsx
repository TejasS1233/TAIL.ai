import React from "react";
import { House, FileText, Map, MessageCircle, BarChart2, History } from "lucide-react";

import { NavMain } from "@/components/blocks/Dashboard/NavMain";
import { NavUser } from "@/components/blocks/Dashboard/NavUser";
import { TeamSwitcher } from "@/components/blocks/Dashboard/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar({ activeSection, onSectionChange, ...props }) {
  const data = {
    navMain: [
      {
        title: "Home",
        key: "dashboard",
        icon: House,
        isActive: activeSection === "dashboard",
      },
      {
        title: "Reports",
        key: "reports",
        icon: FileText,
        isActive: activeSection === "reports",
      },
      {
        title: "Map View",
        key: "map",
        icon: Map,
        isActive: activeSection === "map",
      },
      {
        title: "Chat",
        key: "chat",
        icon: MessageCircle,
        isActive: activeSection === "chat",
      },
      {
        title: "Analytics",
        key: "analytics",
        icon: BarChart2,
        isActive: activeSection === "analytics",
      },
      {
        title: "Action History",
        key: "history",
        icon: History,
        isActive: activeSection === "history",
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain
            items={data.navMain}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
