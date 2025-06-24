import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  ForumState, 
  Question, 
  Answer, 
  Tag, 
  Vote, 
  ForumUser, 
  QuestionFormData, 
  AnswerFormData,
  VoteType,
  ContentType,
  ForumStats,
  SearchFilters
} from "../types/forum";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ForumContextType extends ForumState {
  // Question operations
  createQuestion: (data: QuestionFormData) => Promise<boolean>;
  updateQuestion: (id: string, data: Partial<QuestionFormData>) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;
  getQuestion: (id: string) => Question | undefined;
  searchQuestions: (filters: SearchFilters) => Question[];
  
  // Answer operations
  createAnswer: (questionId: string, data: AnswerFormData) => Promise<boolean>;
  updateAnswer: (id: string, data: Partial<AnswerFormData>) => Promise<boolean>;
  deleteAnswer: (id: string) => Promise<boolean>;
  selectBestAnswer: (questionId: string, answerId: string) => Promise<boolean>;
  
  // Voting operations
  castVote: (targetId: string, targetType: ContentType, voteType: VoteType) => Promise<boolean>;
  removeVote: (targetId: string, targetType: ContentType) => Promise<boolean>;
  getUserVote: (targetId: string, targetType: ContentType) => Vote | undefined;
  
  // Tag operations
  createTag: (name: string, description: string, color: string) => Promise<boolean>;
  getPopularTags: () => Tag[];
  
  // User operations
  getForumUser: (userId: string) => ForumUser | undefined;
  updateUserReputation: (userId: string, points: number) => void;
}

const initialState: ForumState = {
  questions: [],
  answers: [],
  tags: [],
  votes: [],
  currentUser: null,
  stats: {
    totalQuestions: 0,
    totalAnswers: 0,
    totalUsers: 0,
    totalVotes: 0,
    questionsToday: 0,
    answersToday: 0,
    activeUsers: 0,
    topTags: [],
    recentActivity: []
  },
  notifications: [],
  moderationReports: [],
  isLoading: false,
  error: null,
};

const ForumContext = createContext<ForumContextType | undefined>(undefined);

export const ForumProvider = ({ children }: { children: ReactNode }) => {
  const [forumState, setForumState] = useState<ForumState>(initialState);
  const { user } = useAuth();

  // Initialize mock data
  useEffect(() => {
    if (user) {
      initializeMockData();
    }
  }, [user]);

  const initializeMockData = () => {
    // Mock tags
    const mockTags: Tag[] = [
      {
        id: "1",
        name: "JavaScript",
        description: "Questions about JavaScript programming language",
        color: "#f7df1e",
        usageCount: 45,
        createdAt: new Date("2024-01-01"),
        createdBy: "admin"
      },
      {
        id: "2", 
        name: "React",
        description: "Questions about React framework",
        color: "#61dafb",
        usageCount: 38,
        createdAt: new Date("2024-01-01"),
        createdBy: "admin"
      },
      {
        id: "3",
        name: "Python",
        description: "Questions about Python programming language",
        color: "#3776ab",
        usageCount: 52,
        createdAt: new Date("2024-01-01"),
        createdBy: "admin"
      },
      {
        id: "4",
        name: "Data Structures",
        description: "Questions about data structures and algorithms",
        color: "#ff6b6b",
        usageCount: 29,
        createdAt: new Date("2024-01-01"),
        createdBy: "admin"
      },
      {
        id: "5",
        name: "Database",
        description: "Questions about databases and SQL",
        color: "#4ecdc4",
        usageCount: 23,
        createdAt: new Date("2024-01-01"),
        createdBy: "admin"
      }
    ];

    // Mock questions
    const mockQuestions: Question[] = [
      {
        id: "q1",
        title: "How to implement a binary search tree in Python?",
        content: "I'm trying to understand how to implement a binary search tree from scratch in Python. Can someone provide a clear example with insertion, deletion, and search operations?",
        author: {
          id: "1",
          username: "student",
          email: "student@example.com",
          role: "student",
          firstName: "John",
          lastName: "Doe",
          createdAt: new Date(),
          is2FAEnabled: false,
        },
        tags: [mockTags[2], mockTags[3]], // Python, Data Structures
        status: "open",
        views: 127,
        votes: 8,
        upvotes: 10,
        downvotes: 2,
        answerCount: 3,
        createdAt: new Date("2024-06-20T10:30:00"),
        updatedAt: new Date("2024-06-20T10:30:00"),
        lastActivity: new Date("2024-06-22T14:20:00"),
        isFlagged: false,
        flagCount: 0,
        isEdited: false,
      },
      {
        id: "q2",
        title: "React useState vs useReducer - when to use which?",
        content: "I'm confused about when to use useState versus useReducer in React. Can someone explain the differences and provide examples of when each is more appropriate?",
        author: {
          id: "2",
          username: "alice_dev",
          email: "alice@example.com",
          role: "student",
          firstName: "Alice",
          lastName: "Smith",
          createdAt: new Date(),
          is2FAEnabled: false,
        },
        tags: [mockTags[1]], // React
        status: "answered",
        views: 89,
        votes: 12,
        upvotes: 14,
        downvotes: 2,
        answerCount: 2,
        bestAnswerId: "a2",
        createdAt: new Date("2024-06-21T09:15:00"),
        updatedAt: new Date("2024-06-21T09:15:00"),
        lastActivity: new Date("2024-06-21T16:45:00"),
        isFlagged: false,
        flagCount: 0,
        isEdited: false,
      }
    ];

    // Mock answers
    const mockAnswers: Answer[] = [
      {
        id: "a1",
        questionId: "q1",
        content: "Here's a basic implementation of a binary search tree in Python:\n\n```python\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass BST:\n    def __init__(self):\n        self.root = None\n    \n    def insert(self, val):\n        self.root = self._insert_recursive(self.root, val)\n    \n    def _insert_recursive(self, node, val):\n        if not node:\n            return TreeNode(val)\n        if val < node.val:\n            node.left = self._insert_recursive(node.left, val)\n        else:\n            node.right = self._insert_recursive(node.right, val)\n        return node\n```\n\nThis provides the basic structure. Would you like me to add the search and delete operations as well?",
        author: {
          id: "3",
          username: "teacher",
          email: "teacher@example.com",
          role: "teacher",
          firstName: "Dr. Sarah",
          lastName: "Johnson",
          createdAt: new Date(),
          is2FAEnabled: false,
        },
        votes: 5,
        upvotes: 6,
        downvotes: 1,
        isBestAnswer: false,
        createdAt: new Date("2024-06-21T11:20:00"),
        updatedAt: new Date("2024-06-21T11:20:00"),
        isFlagged: false,
        flagCount: 0,
        isEdited: false,
      },
      {
        id: "a2",
        questionId: "q2",
        content: "Great question! Here's when to use each:\n\n**useState** is perfect for:\n- Simple state values (strings, numbers, booleans)\n- Independent state updates\n- When state logic is straightforward\n\n**useReducer** is better for:\n- Complex state objects\n- State transitions that depend on previous state\n- When you have multiple related state updates\n\nExample with useReducer:\n```javascript\nconst [state, dispatch] = useReducer(reducer, initialState);\n```\n\nUse useReducer when your component state becomes complex enough that useState becomes unwieldy.",
        author: {
          id: "4",
          username: "react_expert",
          email: "expert@example.com",
          role: "teacher",
          firstName: "Mike",
          lastName: "Chen",
          createdAt: new Date(),
          is2FAEnabled: false,
        },
        votes: 15,
        upvotes: 16,
        downvotes: 1,
        isBestAnswer: true,
        createdAt: new Date("2024-06-21T16:45:00"),
        updatedAt: new Date("2024-06-21T16:45:00"),
        isFlagged: false,
        flagCount: 0,
        isEdited: false,
      }
    ];

    setForumState(prev => ({
      ...prev,
      tags: mockTags,
      questions: mockQuestions,
      answers: mockAnswers,
      stats: {
        totalQuestions: mockQuestions.length,
        totalAnswers: mockAnswers.length,
        totalUsers: 4,
        totalVotes: 35,
        questionsToday: 1,
        answersToday: 2,
        activeUsers: 3,
        topTags: mockTags.slice(0, 3),
        recentActivity: []
      }
    }));
  };

  const createQuestion = async (data: QuestionFormData): Promise<boolean> => {
    if (!user) return false;

    setForumState(prev => ({ ...prev, isLoading: true }));

    try {
      const newQuestion: Question = {
        id: `q${Date.now()}`,
        title: data.title,
        content: data.content,
        author: user,
        tags: data.tags.map(tagName =>
          forumState.tags.find(t => t.name === tagName) || {
            id: `tag${Date.now()}`,
            name: tagName,
            description: "",
            color: "#6b7280",
            usageCount: 1,
            createdAt: new Date(),
            createdBy: user.id
          }
        ),
        status: "open",
        views: 0,
        votes: 0,
        upvotes: 0,
        downvotes: 0,
        answerCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivity: new Date(),
        isFlagged: false,
        flagCount: 0,
        isEdited: false,
      };

      setForumState(prev => ({
        ...prev,
        questions: [newQuestion, ...prev.questions],
        isLoading: false,
        stats: {
          ...prev.stats,
          totalQuestions: prev.stats.totalQuestions + 1,
          questionsToday: prev.stats.questionsToday + 1
        }
      }));

      toast.success("Question posted successfully!");
      return true;
    } catch (error) {
      setForumState(prev => ({ ...prev, isLoading: false, error: "Failed to create question" }));
      toast.error("Failed to post question");
      return false;
    }
  };

  const createAnswer = async (questionId: string, data: AnswerFormData): Promise<boolean> => {
    if (!user) return false;

    setForumState(prev => ({ ...prev, isLoading: true }));

    try {
      const newAnswer: Answer = {
        id: `a${Date.now()}`,
        questionId,
        content: data.content,
        author: user,
        votes: 0,
        upvotes: 0,
        downvotes: 0,
        isBestAnswer: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFlagged: false,
        flagCount: 0,
        isEdited: false,
      };

      setForumState(prev => ({
        ...prev,
        answers: [...prev.answers, newAnswer],
        questions: prev.questions.map(q =>
          q.id === questionId
            ? { ...q, answerCount: q.answerCount + 1, lastActivity: new Date() }
            : q
        ),
        isLoading: false,
        stats: {
          ...prev.stats,
          totalAnswers: prev.stats.totalAnswers + 1,
          answersToday: prev.stats.answersToday + 1
        }
      }));

      toast.success("Answer posted successfully!");
      return true;
    } catch (error) {
      setForumState(prev => ({ ...prev, isLoading: false, error: "Failed to create answer" }));
      toast.error("Failed to post answer");
      return false;
    }
  };

  const castVote = async (targetId: string, targetType: ContentType, voteType: VoteType): Promise<boolean> => {
    if (!user) return false;

    const existingVote = forumState.votes.find(v =>
      v.targetId === targetId && v.targetType === targetType && v.userId === user.id
    );

    if (existingVote && existingVote.voteType === voteType) {
      return removeVote(targetId, targetType);
    }

    const newVote: Vote = {
      id: `v${Date.now()}`,
      userId: user.id,
      targetId,
      targetType,
      voteType,
      createdAt: new Date()
    };

    setForumState(prev => {
      const updatedVotes = existingVote
        ? prev.votes.map(v => v.id === existingVote.id ? newVote : v)
        : [...prev.votes, newVote];

      const voteChange = voteType === "upvote" ? 1 : -1;
      const previousVoteChange = existingVote
        ? (existingVote.voteType === "upvote" ? -1 : 1)
        : 0;
      const totalChange = voteChange + previousVoteChange;

      if (targetType === "question") {
        return {
          ...prev,
          votes: updatedVotes,
          questions: prev.questions.map(q =>
            q.id === targetId
              ? {
                  ...q,
                  votes: q.votes + totalChange,
                  upvotes: voteType === "upvote" ? q.upvotes + 1 + previousVoteChange : q.upvotes + previousVoteChange,
                  downvotes: voteType === "downvote" ? q.downvotes + 1 + (previousVoteChange * -1) : q.downvotes + (previousVoteChange * -1)
                }
              : q
          )
        };
      } else {
        return {
          ...prev,
          votes: updatedVotes,
          answers: prev.answers.map(a =>
            a.id === targetId
              ? {
                  ...a,
                  votes: a.votes + totalChange,
                  upvotes: voteType === "upvote" ? a.upvotes + 1 + previousVoteChange : a.upvotes + previousVoteChange,
                  downvotes: voteType === "downvote" ? a.downvotes + 1 + (previousVoteChange * -1) : a.downvotes + (previousVoteChange * -1)
                }
              : a
          )
        };
      }
    });

    toast.success(`${voteType === "upvote" ? "Upvoted" : "Downvoted"} successfully!`);
    return true;
  };

  const removeVote = async (targetId: string, targetType: ContentType): Promise<boolean> => {
    if (!user) return false;

    const existingVote = forumState.votes.find(v =>
      v.targetId === targetId && v.targetType === targetType && v.userId === user.id
    );

    if (!existingVote) return false;

    setForumState(prev => {
      const updatedVotes = prev.votes.filter(v => v.id !== existingVote.id);
      const voteChange = existingVote.voteType === "upvote" ? -1 : 1;

      if (targetType === "question") {
        return {
          ...prev,
          votes: updatedVotes,
          questions: prev.questions.map(q =>
            q.id === targetId
              ? {
                  ...q,
                  votes: q.votes + voteChange,
                  upvotes: existingVote.voteType === "upvote" ? q.upvotes - 1 : q.upvotes,
                  downvotes: existingVote.voteType === "downvote" ? q.downvotes - 1 : q.downvotes
                }
              : q
          )
        };
      } else {
        return {
          ...prev,
          votes: updatedVotes,
          answers: prev.answers.map(a =>
            a.id === targetId
              ? {
                  ...a,
                  votes: a.votes + voteChange,
                  upvotes: existingVote.voteType === "upvote" ? a.upvotes - 1 : a.upvotes,
                  downvotes: existingVote.voteType === "downvote" ? a.downvotes - 1 : a.downvotes
                }
              : a
          )
        };
      }
    });

    return true;
  };

  const selectBestAnswer = async (questionId: string, answerId: string): Promise<boolean> => {
    if (!user) return false;

    const question = forumState.questions.find(q => q.id === questionId);
    if (!question || question.author.id !== user.id) {
      toast.error("Only the question author can select the best answer");
      return false;
    }

    setForumState(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, bestAnswerId: answerId, status: "answered" as const }
          : q
      ),
      answers: prev.answers.map(a => ({
        ...a,
        isBestAnswer: a.id === answerId && a.questionId === questionId
      }))
    }));

    toast.success("Best answer selected!");
    return true;
  };

  const getQuestion = (id: string): Question | undefined => {
    return forumState.questions.find(q => q.id === id);
  };

  const searchQuestions = (filters: SearchFilters): Question[] => {
    let filtered = [...forumState.questions];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.content.toLowerCase().includes(query)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(q =>
        filters.tags!.some(tag => q.tags.some(t => t.name === tag))
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(q => filters.status!.includes(q.status));
    }

    if (filters.hasAnswers !== undefined) {
      filtered = filtered.filter(q =>
        filters.hasAnswers ? q.answerCount > 0 : q.answerCount === 0
      );
    }

    if (filters.hasBestAnswer !== undefined) {
      filtered = filtered.filter(q =>
        filters.hasBestAnswer ? !!q.bestAnswerId : !q.bestAnswerId
      );
    }

    // Sort results
    const sortBy = filters.sortBy || "newest";
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "votes":
          return b.votes - a.votes;
        case "activity":
          return b.lastActivity.getTime() - a.lastActivity.getTime();
        case "views":
          return b.views - a.views;
        default: // newest
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  };

  const getUserVote = (targetId: string, targetType: ContentType): Vote | undefined => {
    if (!user) return undefined;
    return forumState.votes.find(v =>
      v.targetId === targetId && v.targetType === targetType && v.userId === user.id
    );
  };

  const getPopularTags = (): Tag[] => {
    return [...forumState.tags].sort((a, b) => b.usageCount - a.usageCount);
  };

  const updateQuestion = async (id: string, data: Partial<QuestionFormData>): Promise<boolean> => {
    // Implementation for updating questions
    return true;
  };

  const deleteQuestion = async (id: string): Promise<boolean> => {
    // Implementation for deleting questions
    return true;
  };

  const updateAnswer = async (id: string, data: Partial<AnswerFormData>): Promise<boolean> => {
    // Implementation for updating answers
    return true;
  };

  const deleteAnswer = async (id: string): Promise<boolean> => {
    // Implementation for deleting answers
    return true;
  };

  const createTag = async (name: string, description: string, color: string): Promise<boolean> => {
    // Implementation for creating tags
    return true;
  };

  const getForumUser = (userId: string): ForumUser | undefined => {
    // Implementation for getting forum user data
    return undefined;
  };

  const updateUserReputation = (userId: string, points: number): void => {
    // Implementation for updating user reputation
  };

  return (
    <ForumContext.Provider
      value={{
        ...forumState,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        getQuestion,
        searchQuestions,
        createAnswer,
        updateAnswer,
        deleteAnswer,
        selectBestAnswer,
        castVote,
        removeVote,
        getUserVote,
        createTag,
        getPopularTags,
        getForumUser,
        updateUserReputation,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error("useForum must be used within a ForumProvider");
  }
  return context;
};
