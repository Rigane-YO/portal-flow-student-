import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  GroupsState,
  Group,
  GroupMember,
  GroupTask,
  GroupFile,
  GroupDiscussion,
  GroupEvent,
  CreateGroupData,
  UpdateGroupData,
  CreateTaskData,
  CreateDiscussionData,
  CreateEventData,
  GroupSearchFilters,
  GroupInvitation,
  GroupJoinRequest,
  GroupCategory,
  GroupVisibility,
  TaskStatus,
  TaskPriority
} from "../types/groups";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface GroupsContextType extends GroupsState {
  // Group operations
  createGroup: (data: CreateGroupData) => Promise<boolean>;
  updateGroup: (groupId: string, data: UpdateGroupData) => Promise<boolean>;
  deleteGroup: (groupId: string) => Promise<boolean>;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  searchGroups: (filters: GroupSearchFilters) => Group[];
  getGroup: (groupId: string) => Group | undefined;
  getUserGroups: () => Group[];
  
  // Member operations
  inviteMember: (groupId: string, email: string, message?: string) => Promise<boolean>;
  removeMember: (groupId: string, userId: string) => Promise<boolean>;
  updateMemberRole: (groupId: string, userId: string, role: string) => Promise<boolean>;
  getGroupMembers: (groupId: string) => GroupMember[];
  
  // Task operations
  createTask: (groupId: string, data: CreateTaskData) => Promise<boolean>;
  updateTask: (taskId: string, updates: Partial<GroupTask>) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  assignTask: (taskId: string, userIds: string[]) => Promise<boolean>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<boolean>;
  getGroupTasks: (groupId: string) => GroupTask[];
  
  // Discussion operations
  createDiscussion: (groupId: string, data: CreateDiscussionData) => Promise<boolean>;
  replyToDiscussion: (discussionId: string, content: string) => Promise<boolean>;
  getGroupDiscussions: (groupId: string) => GroupDiscussion[];
  
  // Event operations
  createEvent: (groupId: string, data: CreateEventData) => Promise<boolean>;
  updateEvent: (eventId: string, updates: Partial<GroupEvent>) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  respondToEvent: (eventId: string, status: "going" | "maybe" | "not-going") => Promise<boolean>;
  getGroupEvents: (groupId: string) => GroupEvent[];
  
  // File operations
  uploadFile: (groupId: string, file: File, metadata: any) => Promise<boolean>;
  deleteFile: (fileId: string) => Promise<boolean>;
  getGroupFiles: (groupId: string) => GroupFile[];
}

const initialState: GroupsState = {
  groups: [],
  userGroups: [],
  groupMembers: {},
  groupTasks: {},
  groupFiles: {},
  groupDiscussions: {},
  groupEvents: {},
  groupInvitations: [],
  joinRequests: [],
  activities: [],
  isLoading: false,
  error: null,
};

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const [groupsState, setGroupsState] = useState<GroupsState>(initialState);
  const { user } = useAuth();

  // Initialize mock data
  useEffect(() => {
    if (user) {
      initializeMockData();
    }
  }, [user]);

  const initializeMockData = () => {
    // Mock groups
    const mockGroups: Group[] = [
      {
        id: "g1",
        name: "Computer Science Study Group",
        description: "A collaborative space for CS students to study together, share resources, and work on projects.",
        category: "study",
        visibility: "public",
        coverImage: "",
        tags: ["computer-science", "programming", "algorithms"],
        memberCount: 12,
        maxMembers: 20,
        createdAt: new Date("2024-06-01"),
        updatedAt: new Date("2024-06-20"),
        createdBy: "2",
        isActive: true,
        settings: {
          allowMemberInvites: true,
          requireApproval: false,
          allowFileSharing: true,
          allowTaskCreation: true,
          allowCalendarEvents: true,
          discussionModeration: false,
          autoArchiveInactiveTasks: true,
          notificationSettings: {
            newMembers: true,
            newTasks: true,
            taskUpdates: true,
            newFiles: true,
            newDiscussions: true,
            upcomingEvents: true,
          }
        },
        stats: {
          totalTasks: 8,
          completedTasks: 5,
          totalFiles: 15,
          totalDiscussions: 23,
          totalEvents: 4,
          lastActivity: new Date("2024-06-22"),
        }
      },
      {
        id: "g2",
        name: "Final Project Team",
        description: "Working together on our capstone project - AI-powered learning platform.",
        category: "project",
        visibility: "private",
        coverImage: "",
        tags: ["ai", "machine-learning", "web-development"],
        memberCount: 4,
        maxMembers: 5,
        createdAt: new Date("2024-05-15"),
        updatedAt: new Date("2024-06-21"),
        createdBy: "1",
        isActive: true,
        settings: {
          allowMemberInvites: false,
          requireApproval: true,
          allowFileSharing: true,
          allowTaskCreation: true,
          allowCalendarEvents: true,
          discussionModeration: true,
          autoArchiveInactiveTasks: false,
          notificationSettings: {
            newMembers: true,
            newTasks: true,
            taskUpdates: true,
            newFiles: true,
            newDiscussions: true,
            upcomingEvents: true,
          }
        },
        stats: {
          totalTasks: 15,
          completedTasks: 8,
          totalFiles: 25,
          totalDiscussions: 12,
          totalEvents: 6,
          lastActivity: new Date("2024-06-23"),
        }
      }
    ];

    // Mock group members
    const mockMembers: Record<string, GroupMember[]> = {
      "g1": [
        {
          id: "gm1",
          groupId: "g1",
          user: {
            id: "1",
            username: "student",
            email: "student@example.com",
            role: "student",
            firstName: "John",
            lastName: "Doe",
            createdAt: new Date(),
            is2FAEnabled: false,
          },
          role: "member",
          joinedAt: new Date("2024-06-01"),
          lastActive: new Date("2024-06-22"),
          permissions: {
            canInviteMembers: false,
            canRemoveMembers: false,
            canManageTasks: true,
            canManageFiles: true,
            canManageEvents: false,
            canModerateDiscussions: false,
            canEditGroupSettings: false,
          },
          isActive: true,
        },
        {
          id: "gm2",
          groupId: "g1",
          user: {
            id: "2",
            username: "teacher",
            email: "teacher@example.com",
            role: "teacher",
            firstName: "Dr. Sarah",
            lastName: "Johnson",
            createdAt: new Date(),
            is2FAEnabled: false,
          },
          role: "leader",
          joinedAt: new Date("2024-06-01"),
          lastActive: new Date("2024-06-23"),
          permissions: {
            canInviteMembers: true,
            canRemoveMembers: true,
            canManageTasks: true,
            canManageFiles: true,
            canManageEvents: true,
            canModerateDiscussions: true,
            canEditGroupSettings: true,
          },
          isActive: true,
        }
      ]
    };

    // Mock tasks
    const mockTasks: Record<string, GroupTask[]> = {
      "g1": [
        {
          id: "t1",
          groupId: "g1",
          title: "Study Chapter 5: Dynamic Programming",
          description: "Review and practice problems from the dynamic programming chapter",
          status: "in-progress",
          priority: "medium",
          assignedTo: ["1", "2"],
          createdBy: "2",
          dueDate: new Date("2024-06-25"),
          createdAt: new Date("2024-06-20"),
          updatedAt: new Date("2024-06-22"),
          tags: ["study", "algorithms"],
          attachments: [],
          comments: [],
          progress: 60,
          estimatedHours: 4,
        },
        {
          id: "t2",
          groupId: "g1",
          title: "Prepare for Midterm Exam",
          description: "Create study materials and practice tests for the upcoming midterm",
          status: "completed",
          priority: "high",
          assignedTo: ["1"],
          createdBy: "1",
          dueDate: new Date("2024-06-15"),
          completedAt: new Date("2024-06-14"),
          createdAt: new Date("2024-06-10"),
          updatedAt: new Date("2024-06-14"),
          tags: ["exam", "study"],
          attachments: [],
          comments: [],
          progress: 100,
          estimatedHours: 8,
          actualHours: 6,
        }
      ]
    };

    setGroupsState(prev => ({
      ...prev,
      groups: mockGroups,
      userGroups: mockGroups.filter(g => 
        mockMembers[g.id]?.some(m => m.user.id === user?.id)
      ),
      groupMembers: mockMembers,
      groupTasks: mockTasks,
    }));
  };

  const createGroup = async (data: CreateGroupData): Promise<boolean> => {
    if (!user) return false;
    
    setGroupsState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const newGroup: Group = {
        id: `g${Date.now()}`,
        name: data.name,
        description: data.description,
        category: data.category,
        visibility: data.visibility,
        coverImage: "",
        tags: data.tags,
        memberCount: 1,
        maxMembers: data.maxMembers,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id,
        isActive: true,
        settings: {
          allowMemberInvites: true,
          requireApproval: data.visibility === "private",
          allowFileSharing: true,
          allowTaskCreation: true,
          allowCalendarEvents: true,
          discussionModeration: false,
          autoArchiveInactiveTasks: true,
          notificationSettings: {
            newMembers: true,
            newTasks: true,
            taskUpdates: true,
            newFiles: true,
            newDiscussions: true,
            upcomingEvents: true,
          },
          ...data.settings,
        },
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          totalFiles: 0,
          totalDiscussions: 0,
          totalEvents: 0,
          lastActivity: new Date(),
        }
      };

      // Create initial member (creator as leader)
      const creatorMember: GroupMember = {
        id: `gm${Date.now()}`,
        groupId: newGroup.id,
        user: user,
        role: "leader",
        joinedAt: new Date(),
        lastActive: new Date(),
        permissions: {
          canInviteMembers: true,
          canRemoveMembers: true,
          canManageTasks: true,
          canManageFiles: true,
          canManageEvents: true,
          canModerateDiscussions: true,
          canEditGroupSettings: true,
        },
        isActive: true,
      };

      setGroupsState(prev => ({
        ...prev,
        groups: [newGroup, ...prev.groups],
        userGroups: [newGroup, ...prev.userGroups],
        groupMembers: {
          ...prev.groupMembers,
          [newGroup.id]: [creatorMember]
        },
        isLoading: false,
      }));

      toast.success("Group created successfully!");
      return true;
    } catch (error) {
      setGroupsState(prev => ({ ...prev, isLoading: false, error: "Failed to create group" }));
      toast.error("Failed to create group");
      return false;
    }
  };

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!user) return false;

    const group = groupsState.groups.find(g => g.id === groupId);
    if (!group) return false;

    if (group.visibility === "private" && group.settings.requireApproval) {
      // Create join request
      toast.info("Join request sent. Waiting for approval.");
      return true;
    }

    // Direct join for public groups
    const newMember: GroupMember = {
      id: `gm${Date.now()}`,
      groupId: groupId,
      user: user,
      role: "member",
      joinedAt: new Date(),
      lastActive: new Date(),
      permissions: {
        canInviteMembers: false,
        canRemoveMembers: false,
        canManageTasks: true,
        canManageFiles: true,
        canManageEvents: false,
        canModerateDiscussions: false,
        canEditGroupSettings: false,
      },
      isActive: true,
    };

    setGroupsState(prev => ({
      ...prev,
      groups: prev.groups.map(g =>
        g.id === groupId
          ? { ...g, memberCount: g.memberCount + 1 }
          : g
      ),
      userGroups: [...prev.userGroups, group],
      groupMembers: {
        ...prev.groupMembers,
        [groupId]: [...(prev.groupMembers[groupId] || []), newMember]
      }
    }));

    toast.success("Successfully joined the group!");
    return true;
  };

  const createTask = async (groupId: string, data: CreateTaskData): Promise<boolean> => {
    if (!user) return false;

    const newTask: GroupTask = {
      id: `t${Date.now()}`,
      groupId,
      title: data.title,
      description: data.description,
      status: "todo",
      priority: data.priority,
      assignedTo: data.assignedTo,
      createdBy: user.id,
      dueDate: data.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: data.tags,
      attachments: [],
      comments: [],
      progress: 0,
      estimatedHours: data.estimatedHours,
    };

    setGroupsState(prev => ({
      ...prev,
      groupTasks: {
        ...prev.groupTasks,
        [groupId]: [...(prev.groupTasks[groupId] || []), newTask]
      }
    }));

    toast.success("Task created successfully!");
    return true;
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<boolean> => {
    setGroupsState(prev => ({
      ...prev,
      groupTasks: Object.fromEntries(
        Object.entries(prev.groupTasks).map(([groupId, tasks]) => [
          groupId,
          tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  progress: status === "completed" ? 100 : task.progress,
                  completedAt: status === "completed" ? new Date() : task.completedAt,
                  updatedAt: new Date()
                }
              : task
          )
        ])
      )
    }));

    toast.success("Task status updated!");
    return true;
  };

  const searchGroups = (filters: GroupSearchFilters): Group[] => {
    let filtered = [...groupsState.groups];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(g => filters.category!.includes(g.category));
    }

    if (filters.visibility && filters.visibility.length > 0) {
      filtered = filtered.filter(g => filters.visibility!.includes(g.visibility));
    }

    if (filters.hasOpenSlots) {
      filtered = filtered.filter(g => !g.maxMembers || g.memberCount < g.maxMembers);
    }

    // Sort results
    const sortBy = filters.sortBy || "newest";
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "members":
          return b.memberCount - a.memberCount;
        case "activity":
          return b.stats.lastActivity.getTime() - a.stats.lastActivity.getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default: // newest
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  };

  const getGroup = (groupId: string): Group | undefined => {
    return groupsState.groups.find(g => g.id === groupId);
  };

  const getUserGroups = (): Group[] => {
    return groupsState.userGroups;
  };

  const getGroupMembers = (groupId: string): GroupMember[] => {
    return groupsState.groupMembers[groupId] || [];
  };

  const getGroupTasks = (groupId: string): GroupTask[] => {
    return groupsState.groupTasks[groupId] || [];
  };

  const getGroupDiscussions = (groupId: string): GroupDiscussion[] => {
    return groupsState.groupDiscussions[groupId] || [];
  };

  const getGroupEvents = (groupId: string): GroupEvent[] => {
    return groupsState.groupEvents[groupId] || [];
  };

  const getGroupFiles = (groupId: string): GroupFile[] => {
    return groupsState.groupFiles[groupId] || [];
  };

  // Placeholder implementations for other methods
  const updateGroup = async (groupId: string, data: UpdateGroupData): Promise<boolean> => {
    // Implementation for updating groups
    return true;
  };

  const deleteGroup = async (groupId: string): Promise<boolean> => {
    // Implementation for deleting groups
    return true;
  };

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    // Implementation for leaving groups
    return true;
  };

  const inviteMember = async (groupId: string, email: string, message?: string): Promise<boolean> => {
    // Implementation for inviting members
    return true;
  };

  const removeMember = async (groupId: string, userId: string): Promise<boolean> => {
    // Implementation for removing members
    return true;
  };

  const updateMemberRole = async (groupId: string, userId: string, role: string): Promise<boolean> => {
    // Implementation for updating member roles
    return true;
  };

  const updateTask = async (taskId: string, updates: Partial<GroupTask>): Promise<boolean> => {
    // Implementation for updating tasks
    return true;
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    // Implementation for deleting tasks
    return true;
  };

  const assignTask = async (taskId: string, userIds: string[]): Promise<boolean> => {
    // Implementation for assigning tasks
    return true;
  };

  const createDiscussion = async (groupId: string, data: CreateDiscussionData): Promise<boolean> => {
    // Implementation for creating discussions
    return true;
  };

  const replyToDiscussion = async (discussionId: string, content: string): Promise<boolean> => {
    // Implementation for replying to discussions
    return true;
  };

  const createEvent = async (groupId: string, data: CreateEventData): Promise<boolean> => {
    // Implementation for creating events
    return true;
  };

  const updateEvent = async (eventId: string, updates: Partial<GroupEvent>): Promise<boolean> => {
    // Implementation for updating events
    return true;
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    // Implementation for deleting events
    return true;
  };

  const respondToEvent = async (eventId: string, status: "going" | "maybe" | "not-going"): Promise<boolean> => {
    // Implementation for responding to events
    return true;
  };

  const uploadFile = async (groupId: string, file: File, metadata: any): Promise<boolean> => {
    // Implementation for uploading files
    return true;
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    // Implementation for deleting files
    return true;
  };

  return (
    <GroupsContext.Provider
      value={{
        ...groupsState,
        createGroup,
        updateGroup,
        deleteGroup,
        joinGroup,
        leaveGroup,
        searchGroups,
        getGroup,
        getUserGroups,
        inviteMember,
        removeMember,
        updateMemberRole,
        getGroupMembers,
        createTask,
        updateTask,
        deleteTask,
        assignTask,
        updateTaskStatus,
        getGroupTasks,
        createDiscussion,
        replyToDiscussion,
        getGroupDiscussions,
        createEvent,
        updateEvent,
        deleteEvent,
        respondToEvent,
        getGroupEvents,
        uploadFile,
        deleteFile,
        getGroupFiles,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }
  return context;
};
