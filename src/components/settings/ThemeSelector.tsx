import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Theme } from "@/types/settings";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { userSettings, updateTheme } = useSettings();
  
  const currentTheme = userSettings?.preferences.theme || "system";

  const themes = [
    {
      value: "light" as Theme,
      label: "Light",
      description: "Clean and bright interface",
      icon: <Sun className="h-4 w-4" />,
      preview: "bg-white border-gray-200"
    },
    {
      value: "dark" as Theme,
      label: "Dark",
      description: "Easy on the eyes in low light",
      icon: <Moon className="h-4 w-4" />,
      preview: "bg-gray-900 border-gray-700"
    },
    {
      value: "system" as Theme,
      label: "System",
      description: "Matches your device settings",
      icon: <Monitor className="h-4 w-4" />,
      preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400"
    }
  ];

  const handleThemeChange = async (theme: Theme) => {
    await updateTheme(theme);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sun className="h-5 w-5" />
          <span>Theme</span>
        </CardTitle>
        <CardDescription>
          Choose how the interface looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={currentTheme} 
          onValueChange={handleThemeChange}
          className="space-y-3"
        >
          {themes.map((theme) => (
            <div key={theme.value} className="flex items-center space-x-3">
              <RadioGroupItem value={theme.value} id={theme.value} />
              <Label 
                htmlFor={theme.value} 
                className="flex items-center space-x-3 cursor-pointer flex-1"
              >
                <div className={cn(
                  "w-8 h-8 rounded border-2 flex items-center justify-center",
                  theme.preview
                )}>
                  {theme.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{theme.label}</div>
                  <div className="text-sm text-gray-600">{theme.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Preview</h4>
          <div className={cn(
            "p-3 rounded border transition-colors",
            currentTheme === "light" && "bg-white border-gray-200 text-gray-900",
            currentTheme === "dark" && "bg-gray-900 border-gray-700 text-white",
            currentTheme === "system" && "bg-white border-gray-200 text-gray-900"
          )}>
            <div className="text-sm font-medium mb-1">Sample Content</div>
            <div className="text-xs opacity-75">
              This is how your interface will look with the selected theme.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
