import { MessageSquare, Award, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForum } from "@/contexts/ForumContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ForumStatsProps {
  showUserStats?: boolean;
  className?: string;
}

export function ForumStats({ showUserStats = false, className }: ForumStatsProps) {
  const { stats, questions, answers } = useForum();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate user-specific stats
  const userQuestions = questions.filter(q => q.author.id === user?.id);
  const userAnswers = answers.filter(a => a.author.id === user?.id);
  const userBestAnswers = userAnswers.filter(a => a.isBestAnswer);
  const userTotalVotes = userQuestions.reduce((sum, q) => sum + q.votes, 0) + 
                        userAnswers.reduce((sum, a) => sum + a.votes, 0);

  if (showUserStats) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Your Forum Activity</span>
            </CardTitle>
            <CardDescription>Your contributions to the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userQuestions.length}</div>
                <div className="text-sm text-gray-500">Questions Asked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userAnswers.length}</div>
                <div className="text-sm text-gray-500">Answers Given</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userBestAnswers.length}</div>
                <div className="text-sm text-gray-500">Best Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userTotalVotes}</div>
                <div className="text-sm text-gray-500">Total Votes</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Reputation Score</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {userTotalVotes * 10 + userBestAnswers.length * 50} points
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/dashboard/forum")}
              >
                View Forum
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/dashboard/forum/ask")}
              >
                Ask a Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats.totalQuestions}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +{stats.questionsToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{stats.totalAnswers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +{stats.answersToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{stats.activeUsers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{stats.totalVotes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Community engagement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
