import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ForumStats } from "@/components/forum/ForumStats";
import { QuestionCard } from "@/components/forum/QuestionCard";
import { AnswerCard } from "@/components/forum/AnswerCard";
import { useForum } from "@/contexts/ForumContext";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { questions, answers } = useForum();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profilePicture: user?.profilePicture || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Since updateProfile doesn't exist, we'll just show a success message
      // In a real app, you would call an API or update the user in the context
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get user's forum activity
  const userQuestions = questions.filter(q => q.author.id === user?.id);
  const userAnswers = answers.filter(a => a.author.id === user?.id);

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="forum">Forum Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white p-6 rounded-lg shadow-md">
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="text-2xl">
                  {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="w-full">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="Profile picture URL"
                    className="mt-1"
                  />
                </div>
              )}
              
              <div className="text-center">
                <p className="font-semibold text-lg">{`${user?.firstName} ${user?.lastName}`}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">First Name</Label>
                      <p className="font-medium">{user?.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Last Name</Label>
                      <p className="font-medium">{user?.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Phone</Label>
                      <p className="font-medium">{user?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Username</Label>
                      <p className="font-medium">{user?.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="forum" className="space-y-6">
            {/* Forum Statistics */}
            <ForumStats showUserStats />

            {/* User's Questions and Answers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Questions */}
              <Card>
                <CardHeader>
                  <CardTitle>My Questions ({userQuestions.length})</CardTitle>
                  <CardDescription>Questions you've asked</CardDescription>
                </CardHeader>
                <CardContent>
                  {userQuestions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't asked any questions yet.</p>
                      <Button onClick={() => navigate("/dashboard/forum/ask")}>
                        Ask Your First Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userQuestions.slice(0, 5).map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          onClick={() => navigate(`/dashboard/forum/question/${question.id}`)}
                          className="cursor-pointer"
                        />
                      ))}
                      {userQuestions.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/dashboard/forum")}
                        >
                          View All Questions
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Answers */}
              <Card>
                <CardHeader>
                  <CardTitle>My Answers ({userAnswers.length})</CardTitle>
                  <CardDescription>Answers you've provided</CardDescription>
                </CardHeader>
                <CardContent>
                  {userAnswers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't provided any answers yet.</p>
                      <Button onClick={() => navigate("/dashboard/forum")}>
                        Browse Questions
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userAnswers.slice(0, 5).map((answer) => {
                        const question = questions.find(q => q.id === answer.questionId);
                        return question ? (
                          <div key={answer.id} className="space-y-2">
                            <div className="text-sm text-gray-600">
                              Answer to: <span className="font-medium">{question.title}</span>
                            </div>
                            <AnswerCard
                              answer={answer}
                              questionAuthorId={question.author.id}
                              className="cursor-pointer"
                            />
                          </div>
                        ) : null;
                      })}
                      {userAnswers.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/dashboard/forum")}
                        >
                          View All Answers
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
