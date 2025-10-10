import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items, activeSection, onSectionChange }) {
  const handleClick = (event, key) => {
    event.preventDefault();
    onSectionChange(key);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.key}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={(event) => handleClick(event, item.key)}
              isActive={item.isActive}
              className={item.isActive ? "bg-accent text-accent-foreground" : ""}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
