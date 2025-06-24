import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SearchBar } from "@/components/forum/SearchBar";
import { FilterControls } from "@/components/forum/FilterControls";
import { QuestionCard } from "@/components/forum/QuestionCard";
import { TagList } from "@/components/forum/TagList";
import { useForum } from "@/contexts/ForumContext";
import { useAuth } from "@/contexts/AuthContext";
import { SearchFilters } from "@/types/forum";

const Forum = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    questions, 
    searchQuestions, 
    getPopularTags, 
    stats, 
    isLoading 
  } = useForum();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "newest"
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Apply search and filters
  const filteredQuestions = searchQuestions({
    ...filters,
    query: searchQuery
  });

  const popularTags = getPopularTags().slice(0, 8);

  const handleQuestionClick = (questionId: string) => {
    navigate(`/dashboard/forum/question/${questionId}`);
  };

  const handleAskQuestion = () => {
    navigate("/dashboard/forum/ask");
  };

  const handleTagClick = (tagName: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tagName) 
        ? prev.tags.filter(t => t !== tagName)
        : [...(prev.tags || []), tagName]
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Forum & Q&A</h1>
            <p className="text-gray-600 mt-1">
              Ask questions, share knowledge, and help your peers
            </p>
          </div>
          <Button onClick={handleAskQuestion} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>

        {/* Stats Cards */}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Questions Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">{stats.questionsToday}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search questions..."
              />
              
              <FilterControls
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            <Separator />

            {/* Questions List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No questions found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || Object.keys(filters).length > 1
                      ? "Try adjusting your search or filters"
                      : "Be the first to ask a question!"
                    }
                  </p>
                  <Button onClick={handleAskQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ask the First Question
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {filteredQuestions.length} Question{filteredQuestions.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        onClick={() => handleQuestionClick(question.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
                <CardDescription>
                  Click on tags to filter questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TagList
                  tags={popularTags}
                  clickable
                  onTagClick={(tag) => handleTagClick(tag.name)}
                  className="gap-2"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleAskQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setFilters({ ...filters, hasAnswers: false })}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Unanswered Questions
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setFilters({ ...filters, sortBy: "votes" })}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Top Voted
                </Button>
              </CardContent>
            </Card>

            {/* Forum Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Forum Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• Be respectful and constructive</p>
                <p>• Search before asking</p>
                <p>• Provide clear, detailed questions</p>
                <p>• Use relevant tags</p>
                <p>• Mark helpful answers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forum;
