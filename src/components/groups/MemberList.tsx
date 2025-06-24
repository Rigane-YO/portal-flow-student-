import { formatDistanceToNow } from "date-fns";
import { Crown, Shield, User, MoreVertical, UserMinus, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupMember, GroupRole } from "@/types/groups";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface MemberListProps {
  members: GroupMember[];
  currentUserMember?: GroupMember;
  onRoleChange?: (memberId: string, newRole: GroupRole) => void;
  onRemoveMember?: (memberId: string) => void;
  onInviteMembers?: () => void;
  canManageMembers?: boolean;
  className?: string;
}

export function MemberList({ 
  members, 
  currentUserMember,
  onRoleChange,
  onRemoveMember,
  onInviteMembers,
  canManageMembers = false,
  className 
}: MemberListProps) {
  const { user } = useAuth();

  const getRoleIcon = (role: GroupRole) => {
    switch (role) {
      case "leader":
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: GroupRole) => {
    switch (role) {
      case "leader":
        return "bg-yellow-100 text-yellow-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canManageMember = (member: GroupMember): boolean => {
    if (!canManageMembers || !currentUserMember) return false;
    if (member.user.id === user?.id) return false; // Can't manage yourself
    
    // Leaders can manage everyone except other leaders
    if (currentUserMember.role === "leader") {
      return member.role !== "leader";
    }
    
    // Moderators can only manage regular members
    if (currentUserMember.role === "moderator") {
      return member.role === "member";
    }
    
    return false;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  // Sort members: leaders first, then moderators, then members
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { leader: 0, moderator: 1, member: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Members ({members.length})</span>
              </CardTitle>
              <CardDescription>
                Group members and their roles
              </CardDescription>
            </div>
            
            {canManageMembers && onInviteMembers && (
              <Button variant="outline" size="sm" onClick={onInviteMembers}>
                <UserCheck className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {sortedMembers.map((member) => (
              <div 
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.profilePicture} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(member.user.firstName, member.user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {member.user.firstName} {member.user.lastName}
                      </h4>
                      {member.user.id === user?.id && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>@{member.user.username}</span>
                      <span>•</span>
                      <span>Joined {formatDistanceToNow(member.joinedAt, { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      <span>Last active {formatDistanceToNow(member.lastActive, { addSuffix: true })}</span>
                      {!member.isActive && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(member.role)} variant="outline">
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className="capitalize">{member.role}</span>
                    </div>
                  </Badge>
                  
                  {canManageMember(member) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.role === "member" && (
                          <DropdownMenuItem
                            onClick={() => onRoleChange?.(member.id, "moderator")}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Moderator
                          </DropdownMenuItem>
                        )}
                        
                        {member.role === "moderator" && currentUserMember?.role === "leader" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onRoleChange?.(member.id, "member")}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange?.(member.id, "leader")}
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Make Leader
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          onClick={() => onRemoveMember?.(member.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
            
            {members.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No members yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Invite people to join this group and start collaborating.
                </p>
                {canManageMembers && onInviteMembers && (
                  <Button onClick={onInviteMembers}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Invite First Member
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
