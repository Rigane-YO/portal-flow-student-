import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function SettingsCard({ 
  title, 
  description, 
  icon, 
  children, 
  className,
  actions 
}: SettingsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <div className="text-blue-600">{icon}</div>}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ 
  title, 
  description, 
  children, 
  className 
}: SettingsSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsItem({ 
  label, 
  description, 
  children, 
  className 
}: SettingsItemProps) {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <div className="flex-1 pr-4">
        <label className="text-sm font-medium text-gray-900">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}
