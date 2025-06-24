
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardItemProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  onClick?: () => void;
  className?: string;
}

export function DashboardItem({
  icon: Icon,
  iconColor = "text-primary",
  title,
  subtitle,
  badge,
  onClick,
  className,
}: DashboardItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center space-x-3",
        onClick && "cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("bg-opacity-10 p-2 rounded", `bg-${iconColor.replace('text-', '')}`)}>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {badge && (
        <Badge variant={badge.variant}>{badge.label}</Badge>
      )}
    </div>
  );
}
