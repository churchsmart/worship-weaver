import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default",
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group",
      variant === "default" && "bg-card shadow-card border border-border/50",
      variant === "primary" && "bg-gradient-primary text-primary-foreground shadow-glow",
      variant === "secondary" && "bg-gradient-secondary text-secondary-foreground shadow-md",
      className
    )}>
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform",
        variant === "default" ? "bg-primary" : "bg-white"
      )} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            variant === "default" ? "bg-accent" : "bg-white/20"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              variant === "default" ? "text-primary" : "text-current"
            )} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "bg-success/20 text-success" 
                : "bg-destructive/20 text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>

        <p className={cn(
          "text-sm font-medium mb-1",
          variant === "default" ? "text-muted-foreground" : "text-current/80"
        )}>
          {title}
        </p>
        
        <p className="text-3xl font-bold font-display tracking-tight">
          {value}
        </p>

        {subtitle && (
          <p className={cn(
            "text-sm mt-2",
            variant === "default" ? "text-muted-foreground" : "text-current/70"
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}