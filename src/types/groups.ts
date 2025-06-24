import { User } from "./user";

export type GroupRole = "leader" | "moderator" | "member";
export type GroupVisibility = "public" | "private" | "invite-only";
export type GroupCategory = "study" | "project" | "research" | "social" | "academic" | "other";
export type TaskStatus = "todo" | "in-progress" | "review" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type FileType = "document" | "image" | "video" | "audio" | "archive" | "other";
export type GroupEventType = "meeting" | "deadline" | "presentation" | "study-session" | "other";

export interface Group {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  visibility: GroupVisibility;
  coverImage?: string;
  tags: string[];
  memberCount: number;
  maxMembers?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
  settings: GroupSettings;
  stats: GroupStats;
}

export interface GroupSettings {
  allowMemberInvites: boolean;
  requireApproval: boolean;
  allowFileSharing: boolean;
  allowTaskCreation: boolean;
  allowCalendarEvents: boolean;
  discussionModeration: boolean;
  autoArchiveInactiveTasks: boolean;
  notificationSettings: GroupNotificationSettings;
}

export interface GroupNotificationSettings {
  newMembers: boolean;
  newTasks: boolean;
  taskUpdates: boolean;
  newFiles: boolean;
  newDiscussions: boolean;
  upcomingEvents: boolean;
}

export interface GroupStats {
  totalTasks: number;
  completedTasks: number;
  totalFiles: number;
  totalDiscussions: number;
  totalEvents: number;
  lastActivity: Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  user: User;
  role: GroupRole;
  joinedAt: Date;
  lastActive: Date;
  permissions: GroupPermissions;
  isActive: boolean;
  invitedBy?: string;
}

export interface GroupPermissions {
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canManageTasks: boolean;
  canManageFiles: boolean;
  canManageEvents: boolean;
  canModerateDiscussions: boolean;
  canEditGroupSettings: boolean;
}

export interface GroupTask {
  id: string;
  groupId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string[];
  createdBy: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  progress: number; // 0-100
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface GroupFile {
  id: string;
  groupId: string;
  name: string;
  originalName: string;
  description?: string;
  type: FileType;
  size: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  version: number;
  parentFolder?: string;
}

export interface GroupFolder {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  parentFolder?: string;
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface GroupDiscussion {
  id: string;
  groupId: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
  replies: GroupDiscussionReply[];
  views: number;
  likes: number;
}

export interface GroupDiscussionReply {
  id: string;
  discussionId: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  parentReplyId?: string;
  likes: number;
  isEdited: boolean;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  type: GroupEventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  attendees: GroupEventAttendee[];
  isRecurring: boolean;
  recurrenceRule?: string;
  reminders: EventReminder[];
}

export interface GroupEventAttendee {
  userId: string;
  status: "going" | "maybe" | "not-going" | "pending";
  respondedAt?: Date;
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  reminderTime: Date;
  type: "email" | "notification" | "sms";
  sent: boolean;
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  invitedBy: string;
  invitedUser: string;
  invitedEmail?: string;
  message?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

export interface GroupJoinRequest {
  id: string;
  groupId: string;
  userId: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface GroupActivity {
  id: string;
  groupId: string;
  userId: string;
  type: "member_joined" | "member_left" | "task_created" | "task_completed" | "file_uploaded" | "discussion_created" | "event_created";
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface GroupSearchFilters {
  query?: string;
  category?: GroupCategory[];
  visibility?: GroupVisibility[];
  tags?: string[];
  memberCount?: {
    min?: number;
    max?: number;
  };
  hasOpenSlots?: boolean;
  sortBy?: "newest" | "oldest" | "members" | "activity" | "name";
}

export interface GroupsState {
  groups: Group[];
  userGroups: Group[];
  groupMembers: Record<string, GroupMember[]>;
  groupTasks: Record<string, GroupTask[]>;
  groupFiles: Record<string, GroupFile[]>;
  groupDiscussions: Record<string, GroupDiscussion[]>;
  groupEvents: Record<string, GroupEvent[]>;
  groupInvitations: GroupInvitation[];
  joinRequests: GroupJoinRequest[];
  activities: GroupActivity[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateGroupData {
  name: string;
  description: string;
  category: GroupCategory;
  visibility: GroupVisibility;
  tags: string[];
  maxMembers?: number;
  settings: Partial<GroupSettings>;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  category?: GroupCategory;
  visibility?: GroupVisibility;
  tags?: string[];
  maxMembers?: number;
  coverImage?: string;
  settings?: Partial<GroupSettings>;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignedTo: string[];
  dueDate?: Date;
  tags: string[];
  estimatedHours?: number;
}

export interface CreateFileData {
  name: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  parentFolder?: string;
}

export interface CreateDiscussionData {
  title: string;
  content: string;
  tags: string[];
  isPinned?: boolean;
}

export interface CreateEventData {
  title: string;
  description: string;
  type: GroupEventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}
