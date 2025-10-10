import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import { NAV_LINKS } from "@/config/nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, LayoutDashboard, User, Bell, Trophy } from "lucide-react";
import { NavigationSheet } from "./navigation-sheet";

export default function Navbar() {
  const { pathname } = useLocation();
  const [activePath, setActivePath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHomePage = pathname === "/";

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case "citizen":
        return "/dashboard-citizen";
      case "worker":
        return "/dashboard-worker";
      case "officer":
        return "/dashboard";
      case "admin":
        return "/dashboard-admin";
      default:
        return "/";
    }
  };

  const getTextColor = () => {
    if (isHomePage && !scrolled) {
      return "text-white dark:text-foreground";
    }
    return "text-foreground";
  };

  const getMutedTextColor = () => {
    if (isHomePage && !scrolled) {
      return "text-white/70 dark:text-muted-foreground hover:text-white dark:hover:text-foreground";
    }
    return "text-muted-foreground hover:text-foreground";
  };

  return (
    <div className="flex justify-center w-full">
      <nav className="fixed left-1/2 -translate-x-1/2 z-[50] top-3 w-auto max-w-7xl rounded-full backdrop-blur-md bg-background/10 border border-border/20 shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex items-center justify-between px-8 py-2">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Logo
                className={`w-6 h-6 ${isHomePage && !scrolled ? "text-white dark:text-primary" : "text-primary"}`}
              />
            </Link>
          </div>

          <ul className="hidden md:flex gap-10 mx-12">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    activePath === item.href ? getTextColor() : getMutedTextColor()
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative rounded-full h-8 w-8 p-0 hover:bg-accent ${
                    isHomePage && !scrolled
                      ? "text-white dark:text-foreground hover:text-foreground"
                      : ""
                  }`}
                  onClick={() => navigate("/notification")}
                >
                  <Bell className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8.5 w-8.5 cursor-pointer ring-2 ring-border hover:ring-ring transition-colors">
                      <AvatarImage src={user.avatar} alt={user.fullname} />
                      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                        {user.fullname?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="z-[9999] w-48 rounded-xl shadow-md bg-popover/95 backdrop-blur-sm border border-border"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate(getDashboardPath())}
                      className="gap-2 focus:bg-accent focus:text-accent-foreground"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(`/user-profile/${user._id}`)}
                      className="gap-2 focus:bg-accent focus:text-accent-foreground"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="gap-2 focus:bg-accent focus:text-accent-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 text-destructive focus:text-destructive-foreground focus:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className={`hidden sm:inline-flex border-border bg-background/50 hover:bg-accent hover:text-accent-foreground ${
                    isHomePage && !scrolled
                      ? "text-white border-white/30 bg-white/10 hover:bg-white/20 hover:text-white"
                      : ""
                  }`}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </>
            )}
            <ModeToggle className="hidden md:inline-flex" />
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
