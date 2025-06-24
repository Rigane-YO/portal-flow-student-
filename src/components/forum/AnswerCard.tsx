import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Flag, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Answer } from "@/types/forum";
import { VoteButtons } from "./VoteButtons";
import { ModerationDialog } from "./ModerationDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useForum } from "@/contexts/ForumContext";

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId: string;
  canSelectBestAnswer?: boolean;
  onSelectBestAnswer?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function AnswerCard({ 
  answer, 
  questionAuthorId,
  canSelectBestAnswer = false,
  onSelectBestAnswer,
  onEdit,
  onDelete,
  className 
}: AnswerCardProps) {
  const { user } = useAuth();
  const { selectBestAnswer } = useForum();
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const isAuthor = user?.id === answer.author.id;
  const isQuestionAuthor = user?.id === questionAuthorId;
  const canEdit = isAuthor || user?.role === "admin" || user?.role === "teacher";
  const canDelete = isAuthor || user?.role === "admin";

  const handleSelectBestAnswer = async () => {
    if (canSelectBestAnswer && onSelectBestAnswer) {
      await selectBestAnswer(answer.questionId, answer.id);
      onSelectBestAnswer();
    }
  };

  return (
    <Card 
      className={cn(
        "relative",
        answer.isBestAnswer && "border-green-200 bg-green-50/30",
        answer.isFlagged && "border-red-200",
        className
      )}
    >
      {answer.isBestAnswer && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Best Answer
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={answer.author.profilePicture} />
              <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                {getInitials(answer.author.firstName, answer.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {answer.author.firstName} {answer.author.lastName}
                </span>
                <Badge variant="outline" className="text-xs">
                  {answer.author.role}
                </Badge>
                {answer.isFlagged && (
                  <Flag className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-sm text-gray-500">
                answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                {answer.isEdited && (
                  <span className="ml-2 text-xs">(edited)</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {canSelectBestAnswer && !answer.isBestAnswer && isQuestionAuthor && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectBestAnswer}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Select as Best
              </Button>
            )}
            
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <ModerationDialog
              targetId={answer.id}
              targetType="answer"
              targetTitle={`Answer by ${answer.author.firstName} ${answer.author.lastName}`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </ModerationDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex space-x-4">
          <VoteButtons
            targetId={answer.id}
            targetType="answer"
            votes={answer.votes}
            upvotes={answer.upvotes}
            downvotes={answer.downvotes}
          />
          
          <div className="flex-1">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap">
                {answer.content}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
