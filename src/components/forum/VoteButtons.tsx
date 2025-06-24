import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForum } from "@/contexts/ForumContext";
import { ContentType, VoteType } from "@/types/forum";

interface VoteButtonsProps {
  targetId: string;
  targetType: ContentType;
  votes: number;
  upvotes: number;
  downvotes: number;
  className?: string;
}

export function VoteButtons({ 
  targetId, 
  targetType, 
  votes, 
  upvotes, 
  downvotes, 
  className 
}: VoteButtonsProps) {
  const { castVote, getUserVote } = useForum();
  const [isVoting, setIsVoting] = useState(false);
  
  const userVote = getUserVote(targetId, targetType);
  const hasUpvoted = userVote?.voteType === "upvote";
  const hasDownvoted = userVote?.voteType === "downvote";

  const handleVote = async (voteType: VoteType) => {
    setIsVoting(true);
    try {
      await castVote(targetId, targetType, voteType);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={cn(
      "flex items-center space-x-1 sm:flex-col sm:items-center sm:space-x-0 sm:space-y-1",
      className
    )}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation",
          hasUpvoted && "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
        )}
        onClick={() => handleVote("upvote")}
        disabled={isVoting}
      >
        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <span className={cn(
        "text-sm font-medium min-w-[2rem] text-center px-1",
        votes > 0 && "text-green-600 dark:text-green-400",
        votes < 0 && "text-red-600 dark:text-red-400",
        votes === 0 && "text-gray-600 dark:text-gray-400"
      )}>
        {votes}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation",
          hasDownvoted && "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
        )}
        onClick={() => handleVote("downvote")}
        disabled={isVoting}
      >
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
}
