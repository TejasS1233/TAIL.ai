import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NAV_LINKS } from "@/config/nav";
import { cn } from "@/lib/utils";

export const NavMenu = (props) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6">
      {NAV_LINKS.map((link) => (
        <NavigationMenuItem key={link.href}>
          <NavLink
            to={link.href}
            className={({ isActive }) =>
              cn(
                "transition-colors hover:text-foreground/80",
                isActive ? "text-foreground" : "text-foreground/60"
              )
            }
          >
            {link.label}
          </NavLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
