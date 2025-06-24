import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Eye, CheckCircle, Flag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/forum";
import { TagList } from "./TagList";
import { VoteButtons } from "./VoteButtons";
import { ModerationDialog } from "./ModerationDialog";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  onClick?: () => void;
  showFullContent?: boolean;
  className?: string;
}

export function QuestionCard({ 
  question, 
  onClick, 
  showFullContent = false, 
  className 
}: QuestionCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getStatusColor = (status: Question["status"]) => {
    switch (status) {
      case "answered":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        question.isFlagged && "border-red-200",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
                {question.title}
              </h3>
              {question.bestAnswerId && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {question.isFlagged && (
                <Flag className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getStatusColor(question.status)}>
                {question.status}
              </Badge>
              <TagList tags={question.tags} size="sm" />
            </div>
          </div>
          
          <VoteButtons
            targetId={question.id}
            targetType="question"
            votes={question.votes}
            upvotes={question.upvotes}
            downvotes={question.downvotes}
            className="ml-4"
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {showFullContent ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
            </div>
          ) : (
            <p className="text-gray-700 line-clamp-3">
              {truncateContent(question.content)}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{question.answerCount} answers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{question.views} views</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.profilePicture} />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                    {getInitials(question.author.firstName, question.author.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {question.author.firstName} {question.author.lastName}
                  </span>
                  <div className="text-xs text-gray-500">
                    asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                  </div>
                </div>
              </div>

              <ModerationDialog
                targetId={question.id}
                targetType="question"
                targetTitle={question.title}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Flag className="h-3 w-3" />
                </Button>
              </ModerationDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
