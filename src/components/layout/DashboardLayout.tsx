import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "admin" | "member";
  onLogout?: () => void;
}

export function DashboardLayout({ children, userRole = "member", onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} onLogout={onLogout} />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8"
      )}>
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}