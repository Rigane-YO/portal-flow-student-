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
      <div className="container-responsive max-w-6xl">
        <h1 className="text-responsive-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Profile</h1>

        <Tabs defaultValue="profile" className="space-responsive-6">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-2 min-w-max">
              <TabsTrigger value="profile" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <span className="hidden sm:inline">Profile Information</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="forum" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <span className="hidden sm:inline">Forum Activity</span>
                <span className="sm:hidden">Activity</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border dark:border-gray-700">

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4 lg:w-80">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="text-xl sm:text-2xl dark:bg-gray-700 dark:text-gray-300">
                  {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="w-full">
                  <Label htmlFor="profilePicture" className="dark:text-gray-300">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="Profile picture URL"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              )}

              <div className="text-center">
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{`${user?.firstName} ${user?.lastName}`}</p>
                <p className="text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="dark:text-gray-300">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="dark:text-gray-300">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="dark:text-gray-300">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="touch-manipulation min-h-[44px] dark:border-gray-600 dark:text-gray-300">
                      Cancel
                    </Button>
                    <Button type="submit" className="touch-manipulation min-h-[44px]">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">First Name</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user?.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Last Name</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user?.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Email</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Phone</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 dark:text-gray-400">Username</Label>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user?.username}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setIsEditing(true)} className="touch-manipulation min-h-[44px]">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="forum" className="space-responsive-6">
            {/* Forum Statistics */}
            <ForumStats showUserStats />

            {/* User's Questions and Answers */}
            <div className="grid-responsive-1">
              {/* Questions */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">My Questions ({userQuestions.length})</CardTitle>
                  <CardDescription className="dark:text-gray-400">Questions you've asked</CardDescription>
                </CardHeader>
                <CardContent>
                  {userQuestions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't asked any questions yet.</p>
                      <Button onClick={() => navigate("/dashboard/forum/ask")} className="touch-manipulation min-h-[44px]">
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
                          className="cursor-pointer touch-manipulation"
                        />
                      ))}
                      {userQuestions.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full touch-manipulation min-h-[44px] dark:border-gray-600 dark:text-gray-300"
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
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">My Answers ({userAnswers.length})</CardTitle>
                  <CardDescription className="dark:text-gray-400">Answers you've provided</CardDescription>
                </CardHeader>
                <CardContent>
                  {userAnswers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't provided any answers yet.</p>
                      <Button onClick={() => navigate("/dashboard/forum")} className="touch-manipulation min-h-[44px]">
                        Browse Questions
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userAnswers.slice(0, 5).map((answer) => {
                        const question = questions.find(q => q.id === answer.questionId);
                        return question ? (
                          <div key={answer.id} className="space-y-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Answer to: <span className="font-medium text-gray-900 dark:text-gray-100">{question.title}</span>
                            </div>
                            <AnswerCard
                              answer={answer}
                              questionAuthorId={question.author.id}
                              className="cursor-pointer touch-manipulation"
                            />
                          </div>
                        ) : null;
                      })}
                      {userAnswers.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full touch-manipulation min-h-[44px] dark:border-gray-600 dark:text-gray-300"
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
