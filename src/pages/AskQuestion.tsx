import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { QuestionCard } from "@/components/forum/QuestionCard";
import { TagList } from "@/components/forum/TagList";
import { useForum } from "@/contexts/ForumContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AskQuestion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createQuestion, getPopularTags } = useForum();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");

  const popularTags = getPopularTags().slice(0, 12);

  const handleAddTag = (tagName: string) => {
    const trimmedTag = tagName.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handlePopularTagClick = (tagName: string) => {
    handleAddTag(tagName);
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your question");
      return false;
    }
    if (title.length < 10) {
      toast.error("Title must be at least 10 characters long");
      return false;
    }
    if (!content.trim()) {
      toast.error("Please provide details about your question");
      return false;
    }
    if (content.length < 20) {
      toast.error("Question content must be at least 20 characters long");
      return false;
    }
    if (selectedTags.length === 0) {
      toast.error("Please add at least one tag to categorize your question");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await createQuestion({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags
      });

      if (success) {
        toast.success("Question posted successfully!");
        navigate("/dashboard/forum");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create preview question object
  const previewQuestion = {
    id: "preview",
    title: title || "Your question title will appear here",
    content: content || "Your question content will appear here",
    author: user!,
    tags: selectedTags.map(tagName => ({
      id: tagName,
      name: tagName,
      description: "",
      color: "#6b7280",
      usageCount: 0,
      createdAt: new Date(),
      createdBy: user!.id
    })),
    status: "open" as const,
    views: 0,
    votes: 0,
    upvotes: 0,
    downvotes: 0,
    answerCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivity: new Date(),
    isFlagged: false,
    flagCount: 0,
    isEdited: false,
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard/forum")}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
            <h1 className="text-3xl font-bold">Ask a Question</h1>
            <p className="text-gray-600 mt-1">
              Get help from the community by asking a clear, detailed question
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's your programming question? Be specific."
                        className="mt-1"
                        maxLength={200}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {title.length}/200 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Provide all the details about your question. Include what you've tried, what you expected to happen, and what actually happened."
                        className="mt-1 min-h-48"
                        maxLength={5000}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {content.length}/5000 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags *</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tags">Add tags (up to 5)</Label>
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyPress}
                        placeholder="Type a tag and press Enter"
                        className="mt-1"
                        disabled={selectedTags.length >= 5}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Press Enter or comma to add a tag
                      </p>
                    </div>

                    {selectedTags.length > 0 && (
                      <div>
                        <Label>Selected Tags ({selectedTags.length}/5)</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-sm">
                              {tag}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-4 w-4 p-0"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Popular Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {popularTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-50 text-sm"
                            onClick={() => handlePopularTagClick(tag.name)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    By posting, you agree to our community guidelines
                  </p>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/dashboard/forum")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? "Posting..." : "Post Question"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <QuestionCard 
                    question={previewQuestion}
                    showFullContent
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <h4 className="font-medium">Good titles are:</h4>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• Specific and descriptive</li>
                    <li>• Include relevant keywords</li>
                    <li>• Avoid "Help me" or "Urgent"</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Good content includes:</h4>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• What you're trying to achieve</li>
                    <li>• What you've already tried</li>
                    <li>• Code examples (if applicable)</li>
                    <li>• Error messages</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Choose tags that:</h4>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>• Describe your technology</li>
                    <li>• Are specific to your problem</li>
                    <li>• Help others find your question</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AskQuestion;
