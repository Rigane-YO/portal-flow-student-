
import { ReactNode } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footerAction?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardCard({ 
  title, 
  description, 
  children, 
  footerAction 
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {children}
        </div>
        {footerAction && (
          <Button variant="link" className="px-0 mt-2" size="sm" onClick={footerAction.onClick}>
            {footerAction.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
