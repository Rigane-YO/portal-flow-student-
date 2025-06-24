import { Star, Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ForumUser } from "@/types/forum";
import { cn } from "@/lib/utils";

interface UserReputationProps {
  user: ForumUser;
  showDetails?: boolean;
  className?: string;
}

export function UserReputation({ user, showDetails = false, className }: UserReputationProps) {
  const getReputationLevel = (reputation: number) => {
    if (reputation >= 10000) return { level: "Expert", color: "text-purple-600", bgColor: "bg-purple-100" };
    if (reputation >= 5000) return { level: "Advanced", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (reputation >= 1000) return { level: "Intermediate", color: "text-green-600", bgColor: "bg-green-100" };
    if (reputation >= 100) return { level: "Beginner", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { level: "New", color: "text-gray-600", bgColor: "bg-gray-100" };
  };

  const reputationLevel = getReputationLevel(user.reputation);

  const formatReputation = (rep: number) => {
    if (rep >= 1000) {
      return `${(rep / 1000).toFixed(1)}k`;
    }
    return rep.toString();
  };

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center space-x-1", className)}>
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-medium">{formatReputation(user.reputation)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-sm">Reputation: {user.reputation}</p>
              <p className="text-xs text-gray-500">{reputationLevel.level}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Reputation</h4>
        <Badge className={cn("text-xs", reputationLevel.bgColor, reputationLevel.color)}>
          {reputationLevel.level}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <span className="text-2xl font-bold">{user.reputation.toLocaleString()}</span>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg">{user.questionsAsked}</div>
          <div className="text-gray-500">Questions</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{user.answersProvided}</div>
          <div className="text-gray-500">Answers</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{user.bestAnswers}</div>
          <div className="text-gray-500">Best Answers</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{user.totalVotesReceived}</div>
          <div className="text-gray-500">Votes Received</div>
        </div>
      </div>
      
      {user.badges && user.badges.length > 0 && (
        <div>
          <h5 className="font-medium mb-2">Badges</h5>
          <div className="flex flex-wrap gap-1">
            {user.badges.slice(0, 3).map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: badge.color, color: badge.color }}
                    >
                      <Award className="h-3 w-3 mr-1" />
                      {badge.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-sm">{badge.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {user.badges.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.badges.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
