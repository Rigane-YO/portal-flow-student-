import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  SettingsState,
  UserSettings,
  SystemSettings,
  UpdateUserSettingsData,
  UpdateSystemSettingsData,
  Theme,
  Language,
  NotificationPreferences,
  PrivacySettings,
  SecuritySettings,
  UserPreferences
} from "../types/settings";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface SettingsContextType extends SettingsState {
  // User settings operations
  updateUserSettings: (data: UpdateUserSettingsData) => Promise<boolean>;
  resetUserSettings: () => Promise<boolean>;
  exportUserData: () => Promise<boolean>;
  deleteUserAccount: () => Promise<boolean>;
  
  // System settings operations (admin only)
  updateSystemSettings: (data: UpdateSystemSettingsData) => Promise<boolean>;
  resetSystemSettings: () => Promise<boolean>;
  
  // Specific setting operations
  updateTheme: (theme: Theme) => Promise<boolean>;
  updateLanguage: (language: Language) => Promise<boolean>;
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => Promise<boolean>;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<boolean>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<boolean>;
  
  // Utility functions
  getDefaultUserSettings: () => UserSettings;
  validateSettings: (settings: Partial<UserSettings>) => boolean;
  hasUnsavedChanges: () => boolean;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
}

const initialState: SettingsState = {
  userSettings: null,
  systemSettings: null,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settingsState, setSettingsState] = useState<SettingsState>(initialState);
  const { user } = useAuth();

  // Initialize settings when user changes
  useEffect(() => {
    if (user) {
      initializeUserSettings();
      if (user.role === "admin") {
        initializeSystemSettings();
      }
    }
  }, [user]);

  const initializeUserSettings = () => {
    if (!user) return;

    const defaultSettings: UserSettings = {
      id: `settings_${user.id}`,
      userId: user.id,
      preferences: {
        theme: "system",
        language: "en",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: "MM/dd/yyyy",
        timeFormat: "12h",
        currency: "USD",
        itemsPerPage: 20,
        autoSave: true,
        compactMode: false,
        showAnimations: true,
        soundEnabled: true,
        defaultLandingPage: "/dashboard",
      },
      privacy: {
        profileVisibility: "public",
        emailVisibility: "private",
        phoneVisibility: "private",
        activityVisibility: "friends",
        forumActivityVisible: true,
        groupActivityVisible: true,
        allowDirectMessages: true,
        allowGroupInvitations: true,
        allowForumMentions: true,
        showOnlineStatus: true,
        allowDataCollection: false,
        allowAnalytics: false,
        allowMarketing: false,
      },
      notifications: {
        email: {
          enabled: true,
          forumReplies: true,
          forumMentions: true,
          forumDigest: false,
          groupInvitations: true,
          groupMessages: true,
          groupTasks: true,
          groupEvents: true,
          systemUpdates: true,
          securityAlerts: true,
          marketingEmails: false,
          weeklyDigest: true,
          instantNotifications: false,
        },
        push: {
          enabled: true,
          forumReplies: true,
          forumMentions: true,
          groupMessages: true,
          groupTasks: true,
          groupEvents: true,
          directMessages: true,
          systemAlerts: true,
          soundEnabled: true,
          vibrationEnabled: true,
          showPreview: true,
        },
        inApp: {
          enabled: true,
          forumActivity: true,
          groupActivity: true,
          taskUpdates: true,
          eventReminders: true,
          systemMessages: true,
          autoMarkAsRead: false,
          showBadges: true,
          playSound: true,
        },
        sms: {
          enabled: false,
          securityAlerts: false,
          urgentMessages: false,
          eventReminders: false,
          verified: false,
        },
        digest: {
          enabled: true,
          frequency: "weekly",
          time: "09:00",
          includeForumActivity: true,
          includeGroupActivity: true,
          includeTaskSummary: true,
          includeUpcomingEvents: true,
        },
        doNotDisturb: {
          enabled: false,
          startTime: "22:00",
          endTime: "08:00",
          weekendsOnly: false,
          allowUrgent: true,
          allowFromGroups: [],
        },
      },
      security: {
        twoFactorEnabled: false,
        twoFactorMethod: "app",
        backupCodes: [],
        sessionTimeout: 60,
        requirePasswordForSensitiveActions: true,
        allowMultipleSessions: true,
        logSecurityEvents: true,
        trustedDevices: [],
        loginNotifications: true,
        passwordLastChanged: new Date(),
        securityLevel: "basic",
      },
      forum: {
        showReputation: true,
        allowMentions: true,
        autoSubscribeToReplies: true,
        moderationNotifications: user.role === "admin" || user.role === "teacher",
        showVotingHistory: false,
        allowPrivateMessages: true,
        defaultSortOrder: "newest",
        questionsPerPage: 20,
        showUserProfiles: true,
        highlightBestAnswers: true,
      },
      groups: {
        defaultVisibility: "public",
        autoJoinRecommended: false,
        allowInvitations: true,
        showMemberActivity: true,
        defaultNotifications: true,
        autoAcceptTasks: false,
        showCalendarEvents: true,
        allowFileSharing: true,
        maxGroupsToJoin: 10,
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReaderOptimized: false,
        keyboardNavigation: false,
        focusIndicators: false,
        alternativeText: false,
        colorBlindFriendly: false,
        fontSize: "medium",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSettingsState(prev => ({
      ...prev,
      userSettings: defaultSettings,
      isLoading: false,
    }));
  };

  const initializeSystemSettings = () => {
    // Mock system settings for admin users
    const defaultSystemSettings: SystemSettings = {
      id: "system_settings",
      general: {
        siteName: "Student Portal",
        siteDescription: "Comprehensive learning management system",
        siteUrl: "https://studentportal.edu",
        supportEmail: "support@studentportal.edu",
        defaultLanguage: "en",
        defaultTimezone: "UTC",
        allowRegistration: true,
        requireEmailVerification: true,
        defaultUserRole: "student",
        maxUsersPerGroup: 50,
        maxFileUploadSize: 100,
        allowedFileTypes: ["pdf", "doc", "docx", "txt", "jpg", "png", "gif"],
      },
      security: {
        enforceStrongPasswords: true,
        passwordMinLength: 8,
        requireTwoFactor: false,
        sessionTimeoutMinutes: 60,
        maxLoginAttempts: 5,
        lockoutDurationMinutes: 15,
        allowPasswordReset: true,
        requireEmailVerificationForReset: true,
        logSecurityEvents: true,
        enableRateLimiting: true,
      },
      email: {
        smtpHost: "smtp.example.com",
        smtpPort: 587,
        smtpUsername: "noreply@studentportal.edu",
        smtpPassword: "encrypted_password",
        smtpSecure: true,
        fromEmail: "noreply@studentportal.edu",
        fromName: "Student Portal",
        replyToEmail: "support@studentportal.edu",
        enableEmailNotifications: true,
        emailTemplates: {},
      },
      storage: {
        maxStoragePerUser: 5,
        maxStoragePerGroup: 50,
        allowedFileTypes: ["pdf", "doc", "docx", "txt", "jpg", "png", "gif"],
        maxFileSize: 100,
        enableFileVersioning: true,
        autoDeleteOldVersions: true,
        storageProvider: "local",
        storageConfig: {},
      },
      features: {
        enableForum: true,
        enableGroups: true,
        enableChat: true,
        enableCalendar: true,
        enableFileSharing: true,
        enableNotifications: true,
        enableAnalytics: false,
        enableMaintenance: false,
        maintenanceMessage: "System maintenance in progress",
        betaFeatures: [],
      },
      maintenance: {
        maintenanceMode: false,
        maintenanceMessage: "We'll be back soon!",
        allowedUsers: [],
        scheduledMaintenance: [],
        backupEnabled: true,
        backupFrequency: "daily",
        backupRetentionDays: 30,
      },
      analytics: {
        enableAnalytics: false,
        trackUserActivity: false,
        trackPerformance: false,
        retentionDays: 90,
        anonymizeData: true,
        shareWithThirdParties: false,
        analyticsProvider: "none",
        customEvents: [],
      },
      updatedBy: user?.id || "",
      updatedAt: new Date(),
    };

    setSettingsState(prev => ({
      ...prev,
      systemSettings: defaultSystemSettings,
    }));
  };

  const updateUserSettings = async (data: UpdateUserSettingsData): Promise<boolean> => {
    if (!settingsState.userSettings) return false;

    setSettingsState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedSettings: UserSettings = {
        ...prev.userSettings!,
        ...data.preferences && { preferences: { ...prev.userSettings!.preferences, ...data.preferences } },
        ...data.privacy && { privacy: { ...prev.userSettings!.privacy, ...data.privacy } },
        ...data.notifications && { notifications: { ...prev.userSettings!.notifications, ...data.notifications } },
        ...data.security && { security: { ...prev.userSettings!.security, ...data.security } },
        ...data.forum && { forum: { ...prev.userSettings!.forum, ...data.forum } },
        ...data.groups && { groups: { ...prev.userSettings!.groups, ...data.groups } },
        ...data.accessibility && { accessibility: { ...prev.userSettings!.accessibility, ...data.accessibility } },
        updatedAt: new Date(),
      };

      setSettingsState(prev => ({
        ...prev,
        userSettings: updatedSettings,
        isLoading: false,
        hasUnsavedChanges: false,
      }));

      toast.success("Settings updated successfully!");
      return true;
    } catch (error) {
      setSettingsState(prev => ({ ...prev, isLoading: false, error: "Failed to update settings" }));
      toast.error("Failed to update settings");
      return false;
    }
  };

  const updateTheme = async (theme: Theme): Promise<boolean> => {
    return updateUserSettings({
      preferences: { theme }
    });
  };

  const updateLanguage = async (language: Language): Promise<boolean> => {
    return updateUserSettings({
      preferences: { language }
    });
  };

  const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<boolean> => {
    return updateUserSettings({
      notifications: preferences
    });
  };

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>): Promise<boolean> => {
    return updateUserSettings({
      privacy: settings
    });
  };

  const updateSecuritySettings = async (settings: Partial<SecuritySettings>): Promise<boolean> => {
    return updateUserSettings({
      security: settings
    });
  };

  const updateSystemSettings = async (data: UpdateSystemSettingsData): Promise<boolean> => {
    if (!user || user.role !== "admin" || !settingsState.systemSettings) return false;

    setSettingsState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedSettings: SystemSettings = {
        ...prev.systemSettings!,
        ...data.general && { general: { ...prev.systemSettings!.general, ...data.general } },
        ...data.security && { security: { ...prev.systemSettings!.security, ...data.security } },
        ...data.email && { email: { ...prev.systemSettings!.email, ...data.email } },
        ...data.storage && { storage: { ...prev.systemSettings!.storage, ...data.storage } },
        ...data.features && { features: { ...prev.systemSettings!.features, ...data.features } },
        ...data.maintenance && { maintenance: { ...prev.systemSettings!.maintenance, ...data.maintenance } },
        ...data.analytics && { analytics: { ...prev.systemSettings!.analytics, ...data.analytics } },
        updatedBy: user.id,
        updatedAt: new Date(),
      };

      setSettingsState(prev => ({
        ...prev,
        systemSettings: updatedSettings,
        isLoading: false,
        hasUnsavedChanges: false,
      }));

      toast.success("System settings updated successfully!");
      return true;
    } catch (error) {
      setSettingsState(prev => ({ ...prev, isLoading: false, error: "Failed to update system settings" }));
      toast.error("Failed to update system settings");
      return false;
    }
  };

  const resetUserSettings = async (): Promise<boolean> => {
    if (!user) return false;

    initializeUserSettings();
    toast.success("Settings reset to defaults");
    return true;
  };

  const resetSystemSettings = async (): Promise<boolean> => {
    if (!user || user.role !== "admin") return false;

    initializeSystemSettings();
    toast.success("System settings reset to defaults");
    return true;
  };

  const exportUserData = async (): Promise<boolean> => {
    if (!settingsState.userSettings) return false;

    try {
      const dataToExport = {
        userSettings: settingsState.userSettings,
        exportedAt: new Date().toISOString(),
        version: "1.0"
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${user?.username}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("User data exported successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to export user data");
      return false;
    }
  };

  const deleteUserAccount = async (): Promise<boolean> => {
    // This would typically show a confirmation dialog and handle account deletion
    toast.info("Account deletion would be handled here");
    return true;
  };

  const getDefaultUserSettings = (): UserSettings => {
    // Return default settings structure
    return settingsState.userSettings || {} as UserSettings;
  };

  const validateSettings = (settings: Partial<UserSettings>): boolean => {
    // Add validation logic here
    return true;
  };

  const hasUnsavedChanges = (): boolean => {
    return settingsState.hasUnsavedChanges;
  };

  const saveChanges = async (): Promise<boolean> => {
    // Save any pending changes
    setSettingsState(prev => ({ ...prev, hasUnsavedChanges: false }));
    toast.success("Changes saved!");
    return true;
  };

  const discardChanges = (): void => {
    // Discard any pending changes
    setSettingsState(prev => ({ ...prev, hasUnsavedChanges: false }));
    toast.info("Changes discarded");
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settingsState,
        updateUserSettings,
        resetUserSettings,
        exportUserData,
        deleteUserAccount,
        updateSystemSettings,
        resetSystemSettings,
        updateTheme,
        updateLanguage,
        updateNotificationPreferences,
        updatePrivacySettings,
        updateSecuritySettings,
        getDefaultUserSettings,
        validateSettings,
        hasUnsavedChanges,
        saveChanges,
        discardChanges,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
