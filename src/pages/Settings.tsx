import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe, 
  Users, 
  Download,
  Search,
  Save,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SettingsCard, SettingsSection, SettingsItem } from "@/components/settings/SettingsCard";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { NotificationManager } from "@/components/settings/NotificationManager";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    userSettings, 
    systemSettings,
    updateUserSettings,
    exportUserData,
    resetUserSettings,
    hasUnsavedChanges,
    saveChanges,
    discardChanges,
    isLoading 
  } = useSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === "admin";
  const preferences = userSettings?.preferences;
  const privacy = userSettings?.privacy;
  const security = userSettings?.security;

  const handlePreferenceChange = async (key: string, value: any) => {
    await updateUserSettings({
      preferences: { [key]: value }
    });
  };

  const handlePrivacyChange = async (key: string, value: any) => {
    await updateUserSettings({
      privacy: { [key]: value }
    });
  };

  const handleSecurityChange = async (key: string, value: any) => {
    await updateUserSettings({
      security: { [key]: value }
    });
  };

  const handleExportData = async () => {
    await exportUserData();
  };

  const handleResetSettings = async () => {
    if (confirm("Are you sure you want to reset all settings to defaults? This action cannot be undone.")) {
      await resetUserSettings();
    }
  };

  const settingsTabs = [
    { id: "general", label: "General", icon: <User className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "privacy", label: "Privacy", icon: <Eye className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "groups", label: "Groups", icon: <Users className="h-4 w-4" /> },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: <SettingsIcon className="h-4 w-4" /> }] : []),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and system configuration
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges() && (
              <>
                <Button variant="outline" onClick={discardChanges}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Discard
                </Button>
                <Button onClick={saveChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Settings Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
            {settingsTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <SettingsSection
              title="User Preferences"
              description="Customize your experience and interface settings"
            >
              <SettingsCard
                title="Language & Region"
                description="Set your preferred language and regional settings"
                icon={<Globe className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  <SettingsItem
                    label="Language"
                    description="Choose your preferred language"
                  >
                    <Select
                      value={preferences?.language}
                      onValueChange={(value) => handlePreferenceChange("language", value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>

                  <SettingsItem
                    label="Timezone"
                    description="Your local timezone for dates and times"
                  >
                    <Select
                      value={preferences?.timezone}
                      onValueChange={(value) => handlePreferenceChange("timezone", value)}
                    >
                      <SelectTrigger className="w-60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>

                  <SettingsItem
                    label="Date Format"
                    description="How dates are displayed"
                  >
                    <Select
                      value={preferences?.dateFormat}
                      onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>

                  <SettingsItem
                    label="Time Format"
                    description="12-hour or 24-hour time display"
                  >
                    <Select
                      value={preferences?.timeFormat}
                      onValueChange={(value) => handlePreferenceChange("timeFormat", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Interface"
                description="Customize the interface behavior and display"
              >
                <div className="space-y-4">
                  <SettingsItem
                    label="Auto Save"
                    description="Automatically save your work"
                  >
                    <Switch
                      checked={preferences?.autoSave}
                      onCheckedChange={(checked) => handlePreferenceChange("autoSave", checked)}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Compact Mode"
                    description="Use a more compact interface layout"
                  >
                    <Switch
                      checked={preferences?.compactMode}
                      onCheckedChange={(checked) => handlePreferenceChange("compactMode", checked)}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Animations"
                    description="Enable interface animations and transitions"
                  >
                    <Switch
                      checked={preferences?.showAnimations}
                      onCheckedChange={(checked) => handlePreferenceChange("showAnimations", checked)}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Sound Effects"
                    description="Play sounds for notifications and interactions"
                  >
                    <Switch
                      checked={preferences?.soundEnabled}
                      onCheckedChange={(checked) => handlePreferenceChange("soundEnabled", checked)}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Items Per Page"
                    description="Number of items to show in lists"
                  >
                    <Select
                      value={preferences?.itemsPerPage?.toString()}
                      onValueChange={(value) => handlePreferenceChange("itemsPerPage", parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>
                </div>
              </SettingsCard>
            </SettingsSection>
          </TabsContent>

          <TabsContent value="appearance">
            <ThemeSelector />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationManager />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <SettingsSection
              title="Privacy Settings"
              description="Control who can see your information and activity"
            >
              <SettingsCard
                title="Profile Visibility"
                description="Control who can see your profile information"
                icon={<Eye className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  <SettingsItem
                    label="Profile Visibility"
                    description="Who can see your profile"
                  >
                    <Select
                      value={privacy?.profileVisibility}
                      onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>

                  <SettingsItem
                    label="Show Online Status"
                    description="Let others see when you're online"
                  >
                    <Switch
                      checked={privacy?.showOnlineStatus}
                      onCheckedChange={(checked) => handlePrivacyChange("showOnlineStatus", checked)}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Forum Activity Visible"
                    description="Show your forum posts and answers on your profile"
                  >
                    <Switch
                      checked={privacy?.forumActivityVisible}
                      onCheckedChange={(checked) => handlePrivacyChange("forumActivityVisible", checked)}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Group Activity Visible"
                    description="Show your group memberships and activity"
                  >
                    <Switch
                      checked={privacy?.groupActivityVisible}
                      onCheckedChange={(checked) => handlePrivacyChange("groupActivityVisible", checked)}
                    />
                  </SettingsItem>
                </div>
              </SettingsCard>
            </SettingsSection>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SettingsSection
              title="Security Settings"
              description="Manage your account security and authentication"
            >
              <SettingsCard
                title="Account Security"
                description="Protect your account with additional security measures"
                icon={<Shield className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  <SettingsItem
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                  >
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={security?.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSecurityChange("twoFactorEnabled", checked)}
                      />
                      {security?.twoFactorEnabled && (
                        <Badge variant="secondary">Enabled</Badge>
                      )}
                    </div>
                  </SettingsItem>

                  <SettingsItem
                    label="Session Timeout"
                    description="Automatically log out after inactivity"
                  >
                    <Select
                      value={security?.sessionTimeout?.toString()}
                      onValueChange={(value) => handleSecurityChange("sessionTimeout", parseInt(value))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>

                  <SettingsItem
                    label="Login Notifications"
                    description="Get notified when someone logs into your account"
                  >
                    <Switch
                      checked={security?.loginNotifications}
                      onCheckedChange={(checked) => handleSecurityChange("loginNotifications", checked)}
                    />
                  </SettingsItem>
                </div>
              </SettingsCard>
            </SettingsSection>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <SettingsSection
              title="Group Settings"
              description="Configure your group preferences and defaults"
            >
              <SettingsCard
                title="Group Preferences"
                description="Set default behaviors for group interactions"
                icon={<Users className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  <SettingsItem
                    label="Default Group Visibility"
                    description="Default visibility when creating new groups"
                  >
                    <Select
                      value={userSettings?.groups?.defaultVisibility}
                      onValueChange={(value) => updateUserSettings({
                        groups: { ...userSettings?.groups, defaultVisibility: value as any }
                      })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsItem>

                  <SettingsItem
                    label="Allow Group Invitations"
                    description="Let others invite you to join groups"
                  >
                    <Switch
                      checked={userSettings?.groups?.allowInvitations}
                      onCheckedChange={(checked) => updateUserSettings({
                        groups: { ...userSettings?.groups, allowInvitations: checked }
                      })}
                    />
                  </SettingsItem>

                  <SettingsItem
                    label="Show Calendar Events"
                    description="Display group events in your calendar"
                  >
                    <Switch
                      checked={userSettings?.groups?.showCalendarEvents}
                      onCheckedChange={(checked) => updateUserSettings({
                        groups: { ...userSettings?.groups, showCalendarEvents: checked }
                      })}
                    />
                  </SettingsItem>
                </div>
              </SettingsCard>
            </SettingsSection>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <SettingsSection
                title="System Administration"
                description="Manage system-wide settings and configuration"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Admin Panel</CardTitle>
                    <CardDescription>
                      System administration features are available in a separate admin interface.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={() => navigate("/admin")}>
                      Open Admin Panel
                    </Button>
                  </CardContent>
                </Card>
              </SettingsSection>
            </TabsContent>
          )}
        </Tabs>

        {/* Data Management */}
        <Separator />
        
        <SettingsSection
          title="Data Management"
          description="Export your data or reset your settings"
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Settings
            </Button>
          </div>
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
