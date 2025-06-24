import { useState } from "react";
import { Bell, Mail, Smartphone, MessageSquare, Volume2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SettingsItem } from "./SettingsCard";
import { NotificationPreferences } from "@/types/settings";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

interface NotificationManagerProps {
  className?: string;
}

export function NotificationManager({ className }: NotificationManagerProps) {
  const { userSettings, updateNotificationPreferences } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  
  const notifications = userSettings?.notifications || {} as NotificationPreferences;

  const handleToggle = async (
    category: keyof NotificationPreferences,
    setting: string,
    value: boolean
  ) => {
    setIsLoading(true);
    try {
      await updateNotificationPreferences({
        [category]: {
          ...notifications[category],
          [setting]: value
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigestChange = async (setting: string, value: any) => {
    setIsLoading(true);
    try {
      await updateNotificationPreferences({
        digest: {
          ...notifications.digest,
          [setting]: value
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = () => {
    toast.success("Test notification sent!");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="push">
              <Smartphone className="h-4 w-4 mr-2" />
              Push
            </TabsTrigger>
            <TabsTrigger value="inapp">
              <MessageSquare className="h-4 w-4 mr-2" />
              In-App
            </TabsTrigger>
            <TabsTrigger value="digest">
              <Volume2 className="h-4 w-4 mr-2" />
              Digest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <Switch
                checked={notifications.email?.enabled}
                onCheckedChange={(checked) => handleToggle("email", "enabled", checked)}
                disabled={isLoading}
              />
            </div>
            
            {notifications.email?.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                <SettingsItem
                  label="Forum Replies"
                  description="When someone replies to your questions or answers"
                >
                  <Switch
                    checked={notifications.email?.forumReplies}
                    onCheckedChange={(checked) => handleToggle("email", "forumReplies", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Forum Mentions"
                  description="When someone mentions you in a post"
                >
                  <Switch
                    checked={notifications.email?.forumMentions}
                    onCheckedChange={(checked) => handleToggle("email", "forumMentions", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Group Invitations"
                  description="When you're invited to join a group"
                >
                  <Switch
                    checked={notifications.email?.groupInvitations}
                    onCheckedChange={(checked) => handleToggle("email", "groupInvitations", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Group Messages"
                  description="New messages in your groups"
                >
                  <Switch
                    checked={notifications.email?.groupMessages}
                    onCheckedChange={(checked) => handleToggle("email", "groupMessages", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Task Assignments"
                  description="When you're assigned to a task"
                >
                  <Switch
                    checked={notifications.email?.groupTasks}
                    onCheckedChange={(checked) => handleToggle("email", "groupTasks", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Security Alerts"
                  description="Important security notifications"
                >
                  <Switch
                    checked={notifications.email?.securityAlerts}
                    onCheckedChange={(checked) => handleToggle("email", "securityAlerts", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>
              </div>
            )}
          </TabsContent>

          <TabsContent value="push" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Push Notifications</h3>
              <Switch
                checked={notifications.push?.enabled}
                onCheckedChange={(checked) => handleToggle("push", "enabled", checked)}
                disabled={isLoading}
              />
            </div>
            
            {notifications.push?.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-green-200">
                <SettingsItem
                  label="Forum Activity"
                  description="Replies and mentions in the forum"
                >
                  <Switch
                    checked={notifications.push?.forumReplies}
                    onCheckedChange={(checked) => handleToggle("push", "forumReplies", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Group Messages"
                  description="New messages in your groups"
                >
                  <Switch
                    checked={notifications.push?.groupMessages}
                    onCheckedChange={(checked) => handleToggle("push", "groupMessages", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Direct Messages"
                  description="Personal messages from other users"
                >
                  <Switch
                    checked={notifications.push?.directMessages}
                    onCheckedChange={(checked) => handleToggle("push", "directMessages", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <Separator />

                <SettingsItem
                  label="Sound"
                  description="Play sound with notifications"
                >
                  <Switch
                    checked={notifications.push?.soundEnabled}
                    onCheckedChange={(checked) => handleToggle("push", "soundEnabled", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Vibration"
                  description="Vibrate device for notifications"
                >
                  <Switch
                    checked={notifications.push?.vibrationEnabled}
                    onCheckedChange={(checked) => handleToggle("push", "vibrationEnabled", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Show Preview"
                  description="Show message content in notifications"
                >
                  <Switch
                    checked={notifications.push?.showPreview}
                    onCheckedChange={(checked) => handleToggle("push", "showPreview", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inapp" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">In-App Notifications</h3>
              <Switch
                checked={notifications.inApp?.enabled}
                onCheckedChange={(checked) => handleToggle("inApp", "enabled", checked)}
                disabled={isLoading}
              />
            </div>
            
            {notifications.inApp?.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                <SettingsItem
                  label="Forum Activity"
                  description="Show notifications for forum interactions"
                >
                  <Switch
                    checked={notifications.inApp?.forumActivity}
                    onCheckedChange={(checked) => handleToggle("inApp", "forumActivity", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Group Activity"
                  description="Show notifications for group updates"
                >
                  <Switch
                    checked={notifications.inApp?.groupActivity}
                    onCheckedChange={(checked) => handleToggle("inApp", "groupActivity", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Auto Mark as Read"
                  description="Automatically mark notifications as read when viewed"
                >
                  <Switch
                    checked={notifications.inApp?.autoMarkAsRead}
                    onCheckedChange={(checked) => handleToggle("inApp", "autoMarkAsRead", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Show Badges"
                  description="Show notification count badges"
                >
                  <Switch
                    checked={notifications.inApp?.showBadges}
                    onCheckedChange={(checked) => handleToggle("inApp", "showBadges", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>
              </div>
            )}
          </TabsContent>

          <TabsContent value="digest" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Digest Notifications</h3>
              <Switch
                checked={notifications.digest?.enabled}
                onCheckedChange={(checked) => handleDigestChange("enabled", checked)}
                disabled={isLoading}
              />
            </div>
            
            {notifications.digest?.enabled && (
              <div className="space-y-4 pl-4 border-l-2 border-orange-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={notifications.digest?.frequency}
                      onValueChange={(value) => handleDigestChange("frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={notifications.digest?.time}
                      onChange={(e) => handleDigestChange("time", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <SettingsItem
                  label="Include Forum Activity"
                  description="Include forum posts and replies in digest"
                >
                  <Switch
                    checked={notifications.digest?.includeForumActivity}
                    onCheckedChange={(checked) => handleDigestChange("includeForumActivity", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>

                <SettingsItem
                  label="Include Group Activity"
                  description="Include group updates and messages"
                >
                  <Switch
                    checked={notifications.digest?.includeGroupActivity}
                    onCheckedChange={(checked) => handleDigestChange("includeGroupActivity", checked)}
                    disabled={isLoading}
                  />
                </SettingsItem>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Test Notifications</h4>
            <p className="text-sm text-gray-600">Send a test notification to verify your settings</p>
          </div>
          <Button variant="outline" onClick={testNotification}>
            Send Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
