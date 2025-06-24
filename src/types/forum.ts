import { User } from "./user";

export type QuestionStatus = "open" | "closed" | "answered" | "flagged";
export type VoteType = "upvote" | "downvote";
export type ContentType = "question" | "answer";
export type ModerationAction = "flag" | "delete" | "approve" | "reject";

export interface Tag {
  id: string;
  name: string;
  description: string;
  color: string;
  usageCount: number;
  createdAt: Date;
  createdBy: string;
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string; // question or answer ID
  targetType: ContentType;
  voteType: VoteType;
  createdAt: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: Tag[];
  status: QuestionStatus;
  views: number;
  votes: number; // net votes (upvotes - downvotes)
  upvotes: number;
  downvotes: number;
  answerCount: number;
  bestAnswerId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  isFlagged: boolean;
  flagCount: number;
  isEdited: boolean;
  editHistory?: EditHistory[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: User;
  votes: number; // net votes (upvotes - downvotes)
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
  isFlagged: boolean;
  flagCount: number;
  isEdited: boolean;
  editHistory?: EditHistory[];
}

export interface EditHistory {
  id: string;
  editedBy: string;
  editedAt: Date;
  reason?: string;
  previousContent: string;
}

export interface ForumUser extends User {
  reputation: number;
  badges: Badge[];
  questionsAsked: number;
  answersProvided: number;
  bestAnswers: number;
  totalVotesReceived: number;
  joinedForumAt: Date;
  lastActiveAt: Date;
  isModerator: boolean;
  moderationLevel: number; // 0 = none, 1 = basic, 2 = full
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: "bronze" | "silver" | "gold" | "special";
  criteria: string;
  earnedAt: Date;
}

export interface ForumStats {
  totalQuestions: number;
  totalAnswers: number;
  totalUsers: number;
  totalVotes: number;
  questionsToday: number;
  answersToday: number;
  activeUsers: number;
  topTags: Tag[];
  recentActivity: ForumActivity[];
}

export interface ForumActivity {
  id: string;
  type: "question_posted" | "answer_posted" | "vote_cast" | "best_answer_selected";
  userId: string;
  userName: string;
  targetId: string;
  targetTitle: string;
  timestamp: Date;
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  status?: QuestionStatus[];
  sortBy?: "newest" | "oldest" | "votes" | "activity" | "views";
  dateRange?: {
    from: Date;
    to: Date;
  };
  hasAnswers?: boolean;
  hasBestAnswer?: boolean;
  author?: string;
}

export interface ModerationReport {
  id: string;
  reportedBy: string;
  targetId: string;
  targetType: ContentType;
  reason: string;
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: ModerationAction;
}

export interface ForumNotification {
  id: string;
  userId: string;
  type: "answer_posted" | "question_answered" | "vote_received" | "best_answer_selected" | "mention";
  title: string;
  message: string;
  targetId: string;
  targetType: ContentType;
  isRead: boolean;
  createdAt: Date;
}

export interface QuestionFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface AnswerFormData {
  content: string;
}

export interface ForumState {
  questions: Question[];
  answers: Answer[];
  tags: Tag[];
  votes: Vote[];
  currentUser: ForumUser | null;
  stats: ForumStats;
  notifications: ForumNotification[];
  moderationReports: ModerationReport[];
  isLoading: boolean;
  error: string | null;
}
