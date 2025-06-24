import { UserRole } from "./user";

export type Theme = "light" | "dark" | "system";
export type Language = "en" | "fr" | "es" | "de" | "zh" | "ja";
export type NotificationType = "email" | "push" | "in-app" | "sms";
export type PrivacyLevel = "public" | "friends" | "private";
export type SecurityLevel = "basic" | "enhanced" | "maximum";

export interface UserSettings {
  id: string;
  userId: string;
  preferences: UserPreferences;
  privacy: PrivacySettings;
  notifications: NotificationPreferences;
  security: SecuritySettings;
  forum: ForumSettings;
  groups: GroupSettings;
  accessibility: AccessibilitySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: Theme;
  language: Language;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  currency: string;
  itemsPerPage: number;
  autoSave: boolean;
  compactMode: boolean;
  showAnimations: boolean;
  soundEnabled: boolean;
  defaultLandingPage: string;
}

export interface PrivacySettings {
  profileVisibility: PrivacyLevel;
  emailVisibility: PrivacyLevel;
  phoneVisibility: PrivacyLevel;
  activityVisibility: PrivacyLevel;
  forumActivityVisible: boolean;
  groupActivityVisible: boolean;
  allowDirectMessages: boolean;
  allowGroupInvitations: boolean;
  allowForumMentions: boolean;
  showOnlineStatus: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
}

export interface NotificationPreferences {
  email: EmailNotificationSettings;
  push: PushNotificationSettings;
  inApp: InAppNotificationSettings;
  sms: SmsNotificationSettings;
  digest: DigestSettings;
  doNotDisturb: DoNotDisturbSettings;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  forumReplies: boolean;
  forumMentions: boolean;
  forumDigest: boolean;
  groupInvitations: boolean;
  groupMessages: boolean;
  groupTasks: boolean;
  groupEvents: boolean;
  systemUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  instantNotifications: boolean;
}

export interface PushNotificationSettings {
  enabled: boolean;
  forumReplies: boolean;
  forumMentions: boolean;
  groupMessages: boolean;
  groupTasks: boolean;
  groupEvents: boolean;
  directMessages: boolean;
  systemAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showPreview: boolean;
}

export interface InAppNotificationSettings {
  enabled: boolean;
  forumActivity: boolean;
  groupActivity: boolean;
  taskUpdates: boolean;
  eventReminders: boolean;
  systemMessages: boolean;
  autoMarkAsRead: boolean;
  showBadges: boolean;
  playSound: boolean;
}

export interface SmsNotificationSettings {
  enabled: boolean;
  securityAlerts: boolean;
  urgentMessages: boolean;
  eventReminders: boolean;
  phoneNumber?: string;
  verified: boolean;
}

export interface DigestSettings {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  time: string; // HH:MM format
  includeForumActivity: boolean;
  includeGroupActivity: boolean;
  includeTaskSummary: boolean;
  includeUpcomingEvents: boolean;
}

export interface DoNotDisturbSettings {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  weekendsOnly: boolean;
  allowUrgent: boolean;
  allowFromGroups: string[];
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: "app" | "sms" | "email";
  backupCodes: string[];
  sessionTimeout: number; // minutes
  requirePasswordForSensitiveActions: boolean;
  allowMultipleSessions: boolean;
  logSecurityEvents: boolean;
  trustedDevices: TrustedDevice[];
  loginNotifications: boolean;
  passwordLastChanged: Date;
  securityLevel: SecurityLevel;
}

export interface TrustedDevice {
  id: string;
  name: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  addedAt: Date;
  lastUsed: Date;
  isActive: boolean;
}

export interface ForumSettings {
  showReputation: boolean;
  allowMentions: boolean;
  autoSubscribeToReplies: boolean;
  moderationNotifications: boolean;
  showVotingHistory: boolean;
  allowPrivateMessages: boolean;
  defaultSortOrder: "newest" | "oldest" | "votes" | "activity";
  questionsPerPage: number;
  showUserProfiles: boolean;
  highlightBestAnswers: boolean;
}

export interface GroupSettings {
  defaultVisibility: "public" | "private";
  autoJoinRecommended: boolean;
  allowInvitations: boolean;
  showMemberActivity: boolean;
  defaultNotifications: boolean;
  autoAcceptTasks: boolean;
  showCalendarEvents: boolean;
  allowFileSharing: boolean;
  maxGroupsToJoin: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  alternativeText: boolean;
  colorBlindFriendly: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
}

export interface SystemSettings {
  id: string;
  general: SystemGeneralSettings;
  security: SystemSecuritySettings;
  email: SystemEmailSettings;
  storage: SystemStorageSettings;
  features: SystemFeatureSettings;
  maintenance: SystemMaintenanceSettings;
  analytics: SystemAnalyticsSettings;
  updatedBy: string;
  updatedAt: Date;
}

export interface SystemGeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  supportEmail: string;
  defaultLanguage: Language;
  defaultTimezone: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  defaultUserRole: UserRole;
  maxUsersPerGroup: number;
  maxFileUploadSize: number; // MB
  allowedFileTypes: string[];
}

export interface SystemSecuritySettings {
  enforceStrongPasswords: boolean;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  allowPasswordReset: boolean;
  requireEmailVerificationForReset: boolean;
  logSecurityEvents: boolean;
  enableRateLimiting: boolean;
}

export interface SystemEmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  enableEmailNotifications: boolean;
  emailTemplates: Record<string, string>;
}

export interface SystemStorageSettings {
  maxStoragePerUser: number; // GB
  maxStoragePerGroup: number; // GB
  allowedFileTypes: string[];
  maxFileSize: number; // MB
  enableFileVersioning: boolean;
  autoDeleteOldVersions: boolean;
  storageProvider: "local" | "aws" | "gcp" | "azure";
  storageConfig: Record<string, any>;
}

export interface SystemFeatureSettings {
  enableForum: boolean;
  enableGroups: boolean;
  enableChat: boolean;
  enableCalendar: boolean;
  enableFileSharing: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableMaintenance: boolean;
  maintenanceMessage: string;
  betaFeatures: string[];
}

export interface SystemMaintenanceSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowedUsers: string[];
  scheduledMaintenance: ScheduledMaintenance[];
  backupEnabled: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  backupRetentionDays: number;
}

export interface ScheduledMaintenance {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  affectedServices: string[];
  notifyUsers: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface SystemAnalyticsSettings {
  enableAnalytics: boolean;
  trackUserActivity: boolean;
  trackPerformance: boolean;
  retentionDays: number;
  anonymizeData: boolean;
  shareWithThirdParties: boolean;
  analyticsProvider: string;
  customEvents: string[];
}

export interface SettingsState {
  userSettings: UserSettings | null;
  systemSettings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export interface UpdateUserSettingsData {
  preferences?: Partial<UserPreferences>;
  privacy?: Partial<PrivacySettings>;
  notifications?: Partial<NotificationPreferences>;
  security?: Partial<SecuritySettings>;
  forum?: Partial<ForumSettings>;
  groups?: Partial<GroupSettings>;
  accessibility?: Partial<AccessibilitySettings>;
}

export interface UpdateSystemSettingsData {
  general?: Partial<SystemGeneralSettings>;
  security?: Partial<SystemSecuritySettings>;
  email?: Partial<SystemEmailSettings>;
  storage?: Partial<SystemStorageSettings>;
  features?: Partial<SystemFeatureSettings>;
  maintenance?: Partial<SystemMaintenanceSettings>;
  analytics?: Partial<SystemAnalyticsSettings>;
}
