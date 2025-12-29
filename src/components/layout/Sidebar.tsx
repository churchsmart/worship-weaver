import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Calendar, 
  CalendarOff, 
  BarChart3, 
  Settings,
  Music2,
  LogOut,
  ChevronLeft,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  userRole?: "admin" | "member";
  onLogout?: () => void;
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard", roles: ["admin", "member"] },
  { icon: Users, label: "Membros", path: "/membros", roles: ["admin"] },
  { icon: Calendar, label: "Escala", path: "/escala", roles: ["admin", "member"] },
  { icon: CalendarOff, label: "Disponibilidade", path: "/disponibilidade", roles: ["admin", "member"] },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios", roles: ["admin"] },
  { icon: Settings, label: "Configurações", path: "/configuracoes", roles: ["admin"] },
];

export function Sidebar({ userRole = "member", onLogout }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-primary z-40 transition-all duration-300 flex flex-col",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-md">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sidebar-foreground font-display font-bold text-lg leading-tight">
                Louvor
              </h1>
              <p className="text-sidebar-foreground/70 text-xs">
                Sistema de Gestão
              </p>
            </div>
          )}
        </div>

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-card rounded-full shadow-md items-center justify-center border hover:bg-accent transition-colors"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 text-foreground transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setIsCollapsed(true)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive && "text-primary"
                )} />
                {!isCollapsed && (
                  <span className="font-medium animate-fade-in">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={onLogout}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}