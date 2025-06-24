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
      case "spam": return "bg-orange-100 text-orange-800";
      case "inappropriate": return "bg-red-100 text-red-800";
      case "harassment": return "bg-purple-100 text-purple-800";
      case "misinformation": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span>Moderation Queue</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Review and manage reported content and flagged posts
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Flag className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold">{mockReports.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Flagged Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">{flaggedQuestions.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Flagged Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold">{flaggedAnswers.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Actions Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">12</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="reports">
              <Flag className="h-4 w-4 mr-2" />
              Reports ({mockReports.length})
            </TabsTrigger>
            <TabsTrigger value="flagged">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Flagged Content ({flaggedQuestions.length + flaggedAnswers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {mockReports.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending reports
                  </h3>
                  <p className="text-gray-500">
                    All reports have been reviewed and resolved.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{report.targetTitle}</CardTitle>
                          <CardDescription className="mt-1">
                            Reported {formatDistanceToNow(report.createdAt, { addSuffix: true })} by {report.reporterName}
                          </CardDescription>
                        </div>
                        <Badge className={getReasonColor(report.reason)}>
                          {report.reason}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Report description:</p>
                          <p className="text-sm bg-gray-50 p-3 rounded">{report.description}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/dashboard/forum/${report.targetType}/${report.targetId}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Content
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDismissReport(report.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReport(report.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve & Flag
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

          <TabsContent value="flagged" className="space-y-4">
            {flaggedQuestions.length === 0 && flaggedAnswers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No flagged content
                  </h3>
                  <p className="text-gray-500">
                    All content is currently in good standing.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Flagged Questions */}
                {flaggedQuestions.map((question) => (
                  <Card key={question.id} className="border-orange-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{question.title}</span>
                            <Badge variant="destructive">Question</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            By {question.author.firstName} {question.author.lastName} • 
                            {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          {question.flagCount} flag{question.flagCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/forum/question/${question.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnflagContent(question.id, "Question")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unflag
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(question.id, "Question")}
                            className="text-red-600 border-red-200 hover:bg-red-50"
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
                  <Card key={answer.id} className="border-yellow-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>Answer to question</span>
                            <Badge variant="secondary">Answer</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            By {answer.author.firstName} {answer.author.lastName} • 
                            {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {answer.flagCount} flag{answer.flagCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/forum/question/${answer.questionId}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnflagContent(answer.id, "Answer")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unflag
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(answer.id, "Answer")}
                            className="text-red-600 border-red-200 hover:bg-red-50"
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
