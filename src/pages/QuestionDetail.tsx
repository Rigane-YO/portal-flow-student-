import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Flag, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { QuestionCard } from "@/components/forum/QuestionCard";
import { AnswerCard } from "@/components/forum/AnswerCard";
import { TagList } from "@/components/forum/TagList";
import { VoteButtons } from "@/components/forum/VoteButtons";
import { useForum } from "@/contexts/ForumContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const QuestionDetail = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getQuestion, 
    answers, 
    createAnswer, 
    selectBestAnswer,
    isLoading 
  } = useForum();

  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = questionId ? getQuestion(questionId) : undefined;
  const questionAnswers = answers.filter(a => a.questionId === questionId);

  useEffect(() => {
    if (!question && !isLoading) {
      toast.error("Question not found");
      navigate("/dashboard/forum");
    }
  }, [question, isLoading, navigate]);

  if (!question) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading question...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await createAnswer(question.id, { content: answerContent });
      if (success) {
        setAnswerContent("");
        toast.success("Answer posted successfully!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectBestAnswer = async (answerId: string) => {
    const success = await selectBestAnswer(question.id, answerId);
    if (success) {
      toast.success("Best answer selected!");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const isQuestionAuthor = user?.id === question.author.id;
  const canEdit = isQuestionAuthor || user?.role === "admin" || user?.role === "teacher";

  // Sort answers: best answer first, then by votes
  const sortedAnswers = [...questionAnswers].sort((a, b) => {
    if (a.isBestAnswer && !b.isBestAnswer) return -1;
    if (!a.isBestAnswer && b.isBestAnswer) return 1;
    return b.votes - a.votes;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/forum")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{question.title}</h1>
                  {question.isFlagged && (
                    <Flag className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                  <span>•</span>
                  <span>Viewed {question.views} times</span>
                  {question.isEdited && (
                    <>
                      <span>•</span>
                      <span>Edited</span>
                    </>
                  )}
                </div>

                <TagList tags={question.tags} className="mb-4" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                {canEdit && (
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex space-x-4">
              <VoteButtons
                targetId={question.id}
                targetType="question"
                votes={question.votes}
                upvotes={question.upvotes}
                downvotes={question.downvotes}
              />
              
              <div className="flex-1">
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={question.author.profilePicture} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(question.author.firstName, question.author.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {question.author.firstName} {question.author.lastName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {question.author.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {questionAnswers.length} Answer{questionAnswers.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {sortedAnswers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No answers yet. Be the first to help!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedAnswers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  questionAuthorId={question.author.id}
                  canSelectBestAnswer={isQuestionAuthor && !question.bestAnswerId}
                  onSelectBestAnswer={() => handleSelectBestAnswer(answer.id)}
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Answer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here... Be specific and provide examples when possible."
              className="min-h-32"
            />
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Please be respectful and constructive in your answer.
              </p>
              <Button 
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answerContent.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Posting..." : "Post Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default QuestionDetail;
