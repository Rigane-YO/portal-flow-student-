import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Search, Filter, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { GroupCard } from "@/components/groups/GroupCard";
import { useGroups } from "@/contexts/GroupsContext";
import { useAuth } from "@/contexts/AuthContext";
import { GroupSearchFilters, GroupCategory, GroupVisibility } from "@/types/groups";

const WorkGroups = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    groups, 
    userGroups, 
    groupMembers,
    searchGroups, 
    joinGroup,
    isLoading 
  } = useGroups();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<GroupSearchFilters>({
    sortBy: "newest"
  });
  const [activeTab, setActiveTab] = useState("my-groups");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Apply search and filters
  const filteredGroups = searchGroups({
    ...filters,
    query: searchQuery
  });

  // Filter for public groups (discovery)
  const publicGroups = filteredGroups.filter(g => g.visibility === "public");

  const handleGroupClick = (groupId: string) => {
    navigate(`/dashboard/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate("/dashboard/groups/create");
  };

  const handleJoinGroup = async (groupId: string) => {
    await joinGroup(groupId);
  };

  const categories: { value: GroupCategory; label: string }[] = [
    { value: "study", label: "Study Groups" },
    { value: "project", label: "Project Teams" },
    { value: "research", label: "Research Groups" },
    { value: "social", label: "Social Groups" },
    { value: "academic", label: "Academic Groups" },
    { value: "other", label: "Other" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "members", label: "Most Members" },
    { value: "activity", label: "Most Active" },
    { value: "name", label: "Name" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Work Groups</h1>
            <p className="text-gray-600 mt-1">
              Collaborate with peers on projects, studies, and research
            </p>
          </div>
          <Button onClick={handleCreateGroup} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                My Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{userGroups.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{groups.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">
                  {Object.values(groupMembers).flat().filter(m => m.isActive).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Public Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">{publicGroups.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.category?.[0] || "all"}
              onValueChange={(value) => 
                setFilters(prev => ({
                  ...prev,
                  category: value === "all" ? undefined : [value as GroupCategory]
                }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy || "newest"}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, sortBy: value as any }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Groups Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="my-groups">
              My Groups ({userGroups.length})
            </TabsTrigger>
            <TabsTrigger value="discover">
              Discover ({publicGroups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-4">
            {userGroups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No groups yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first group or join existing ones to start collaborating.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={handleCreateGroup}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("discover")}>
                      Discover Groups
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGroups.map((group) => {
                  const members = groupMembers[group.id] || [];
                  const userMembership = members.find(m => m.user.id === user?.id);
                  
                  return (
                    <GroupCard
                      key={group.id}
                      group={group}
                      members={members}
                      userMembership={userMembership}
                      onClick={() => handleGroupClick(group.id)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading groups...</p>
              </div>
            ) : publicGroups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No groups found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || Object.keys(filters).length > 1
                      ? "Try adjusting your search or filters"
                      : "No public groups available to join"
                    }
                  </p>
                  <Button onClick={handleCreateGroup}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create the First Group
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicGroups.map((group) => {
                  const members = groupMembers[group.id] || [];
                  const userMembership = members.find(m => m.user.id === user?.id);
                  
                  return (
                    <GroupCard
                      key={group.id}
                      group={group}
                      members={members}
                      userMembership={userMembership}
                      onClick={() => handleGroupClick(group.id)}
                      onJoin={() => handleJoinGroup(group.id)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WorkGroups;
