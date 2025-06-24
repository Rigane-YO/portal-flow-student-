import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Flag, CheckCircle, XCircle, Eye, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useForum } from "@/contexts/ForumContext";
import { toast } from "sonner";

const ModerationQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, answers } = useForum();
  
  const [activeTab, setActiveTab] = useState("reports");

  // Check if user has moderation permissions
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      toast.error("Access denied. You don't have moderation permissions.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return null;
  }

  // Mock reported content - in a real app, this would come from the forum context
  const mockReports = [
    {
      id: "r1",
      targetId: "q1",
      targetType: "question" as const,
      targetTitle: "How to implement a binary search tree in Python?",
      reportedBy: "student_user",
      reason: "spam",
      description: "This question seems to be posted multiple times",
      status: "pending" as const,
      createdAt: new Date("2024-06-23T10:30:00"),
      reporterName: "John Student"
    },
    {
      id: "r2",
      targetId: "a1",
      targetType: "answer" as const,
      targetTitle: "Answer about Python BST implementation",
      reportedBy: "another_user",
      reason: "inappropriate",
      description: "Contains offensive language",
      status: "pending" as const,
      createdAt: new Date("2024-06-23T14:20:00"),
      reporterName: "Alice Smith"
    }
  ];

  const flaggedQuestions = questions.filter(q => q.isFlagged);
  const flaggedAnswers = answers.filter(a => a.isFlagged);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "spam": return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "inappropriate": return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "harassment": return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "misinformation": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const handleApproveReport = (reportId: string) => {
    toast.success("Report approved and content flagged");
  };

  const handleDismissReport = (reportId: string) => {
    toast.success("Report dismissed");
  };

  const handleDeleteContent = (contentId: string, contentType: string) => {
    toast.success(`${contentType} deleted successfully`);
  };

  const handleUnflagContent = (contentId: string, contentType: string) => {
    toast.success(`${contentType} unflagged successfully`);
  };

  return (
    <DashboardLayout>
      <div className="container-responsive">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-responsive-3xl font-bold flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              <span>Moderation Queue</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Review and manage reported content and flagged posts
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-responsive-2 gap-4 mb-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mockReports.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Flagged Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{flaggedQuestions.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Flagged Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{flaggedAnswers.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Actions Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">12</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-responsive-4">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-2 min-w-max">
              <TabsTrigger value="reports" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <Flag className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Reports ({mockReports.length})</span>
                <span className="sm:hidden">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="flagged" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <AlertTriangle className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Flagged Content ({flaggedQuestions.length + flaggedAnswers.length})</span>
                <span className="sm:hidden">Flagged</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reports" className="space-responsive-4">
            {mockReports.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="text-center py-8">
                  <Flag className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No pending reports
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    All reports have been reviewed and resolved.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-responsive-4">
                {mockReports.map((report) => (
                  <Card key={report.id} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-gray-100 line-clamp-2">{report.targetTitle}</CardTitle>
                          <CardDescription className="mt-1 dark:text-gray-400">
                            Reported {formatDistanceToNow(report.createdAt, { addSuffix: true })} by {report.reporterName}
                          </CardDescription>
                        </div>
                        <Badge className={`${getReasonColor(report.reason)} flex-shrink-0`}>
                          {report.reason}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Report description:</p>
                          <p className="text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-200 p-3 rounded">{report.description}</p>
                        </div>

                        <Separator className="dark:bg-gray-600" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/dashboard/forum/${report.targetType}/${report.targetId}`)}
                              className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">View Content</span>
                              <span className="sm:hidden">View</span>
                            </Button>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDismissReport(report.id)}
                              className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReport(report.id)}
                              className="touch-manipulation min-h-[44px] sm:min-h-[36px] text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Approve & Flag</span>
                              <span className="sm:hidden">Approve</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="flagged" className="space-responsive-4">
            {flaggedQuestions.length === 0 && flaggedAnswers.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No flagged content
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    All content is currently in good standing.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-responsive-4">
                {/* Flagged Questions */}
                {flaggedQuestions.map((question) => (
                  <Card key={question.id} className="border-orange-200 dark:border-orange-800 dark:bg-gray-800">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                            <span className="line-clamp-2">{question.title}</span>
                            <Badge variant="destructive" className="self-start">Question</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1 dark:text-gray-400">
                            By {question.author.firstName} {question.author.lastName} •
                            {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 flex-shrink-0">
                          {question.flagCount} flag{question.flagCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/forum/question/${question.id}`)}
                          className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnflagContent(question.id, "Question")}
                            className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unflag
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(question.id, "Question")}
                            className="touch-manipulation min-h-[44px] sm:min-h-[36px] text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Flagged Answers */}
                {flaggedAnswers.map((answer) => (
                  <Card key={answer.id} className="border-yellow-200 dark:border-yellow-800 dark:bg-gray-800">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                            <span className="line-clamp-2">Answer to question</span>
                            <Badge variant="secondary" className="self-start dark:bg-gray-600 dark:text-gray-200">Answer</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1 dark:text-gray-400">
                            By {answer.author.firstName} {answer.author.lastName} •
                            {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 flex-shrink-0">
                          {answer.flagCount} flag{answer.flagCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/forum/question/${answer.questionId}`)}
                          className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnflagContent(answer.id, "Answer")}
                            className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unflag
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(answer.id, "Answer")}
                            className="touch-manipulation min-h-[44px] sm:min-h-[36px] text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ModerationQueue;
