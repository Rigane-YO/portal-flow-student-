import { formatDistanceToNow } from "date-fns";
import { Users, Calendar, FileText, MessageSquare, CheckSquare, Lock, Globe, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Group, GroupMember } from "@/types/groups";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: Group;
  members?: GroupMember[];
  userMembership?: GroupMember;
  onClick?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
  showActions?: boolean;
  className?: string;
}

export function GroupCard({ 
  group, 
  members = [],
  userMembership,
  onClick, 
  onJoin,
  onLeave,
  showActions = true,
  className 
}: GroupCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "study":
        return "bg-blue-100 text-blue-800";
      case "project":
        return "bg-green-100 text-green-800";
      case "research":
        return "bg-purple-100 text-purple-800";
      case "social":
        return "bg-pink-100 text-pink-800";
      case "academic":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-4 w-4" />;
      case "invite-only":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const taskCompletionRate = group.stats.totalTasks > 0 
    ? (group.stats.completedTasks / group.stats.totalTasks) * 100 
    : 0;

  const isUserMember = !!userMembership;
  const canJoin = !isUserMember && 
    (group.visibility === "public" || group.visibility === "invite-only") &&
    (!group.maxMembers || group.memberCount < group.maxMembers);

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
                {group.name}
              </h3>
              {getVisibilityIcon(group.visibility)}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getCategoryColor(group.category)}>
                {group.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {group.visibility}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {group.description}
            </p>

            {group.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {group.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {group.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{group.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Group Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center space-x-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span>{group.memberCount}</span>
              {group.maxMembers && (
                <span className="text-xs">/{group.maxMembers}</span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <CheckSquare className="h-4 w-4" />
              <span>{group.stats.totalTasks} tasks</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <FileText className="h-4 w-4" />
              <span>{group.stats.totalFiles} files</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span>{group.stats.totalDiscussions}</span>
            </div>
          </div>

          {/* Task Progress */}
          {group.stats.totalTasks > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Task Progress</span>
                <span className="text-gray-500">
                  {group.stats.completedTasks}/{group.stats.totalTasks}
                </span>
              </div>
              <Progress value={taskCompletionRate} className="h-2" />
            </div>
          )}

          {/* Members Preview */}
          {members.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Members</span>
                <span className="text-xs text-gray-500">
                  {group.memberCount} total
                </span>
              </div>
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((member) => (
                  <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                    <AvatarImage src={member.user.profilePicture} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {member.user.firstName[0]}{member.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {group.memberCount > 5 && (
                  <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{group.memberCount - 5}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-gray-500">
              <div>Created {formatDistanceToNow(group.createdAt, { addSuffix: true })}</div>
              <div>Last active {formatDistanceToNow(group.stats.lastActivity, { addSuffix: true })}</div>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                {isUserMember ? (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {userMembership.role}
                    </Badge>
                    {onLeave && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeave();
                        }}
                        className="text-xs"
                      >
                        Leave
                      </Button>
                    )}
                  </div>
                ) : canJoin && onJoin ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoin();
                    }}
                    className="text-xs"
                  >
                    Join Group
                  </Button>
                ) : group.visibility === "private" ? (
                  <Badge variant="secondary" className="text-xs">
                    Private
                  </Badge>
                ) : group.maxMembers && group.memberCount >= group.maxMembers ? (
                  <Badge variant="secondary" className="text-xs">
                    Full
                  </Badge>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
