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
    <div className={cn("flex flex-col items-center space-y-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-green-50",
          hasUpvoted && "bg-green-50 text-green-600"
        )}
        onClick={() => handleVote("upvote")}
        disabled={isVoting}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      
      <span className={cn(
        "text-sm font-medium min-w-[2rem] text-center",
        votes > 0 && "text-green-600",
        votes < 0 && "text-red-600"
      )}>
        {votes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-red-50",
          hasDownvoted && "bg-red-50 text-red-600"
        )}
        onClick={() => handleVote("downvote")}
        disabled={isVoting}
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
}
