import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Plus, Calendar, User, Flag, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupTask, TaskStatus, TaskPriority } from "@/types/groups";
import { cn } from "@/lib/utils";

interface TaskBoardProps {
  tasks: GroupTask[];
  onCreateTask?: () => void;
  onTaskClick?: (task: GroupTask) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  canManageTasks?: boolean;
  className?: string;
}

export function TaskBoard({ 
  tasks, 
  onCreateTask, 
  onTaskClick,
  onStatusChange,
  canManageTasks = false,
  className 
}: TaskBoardProps) {
  const [activeTab, setActiveTab] = useState<"board" | "list">("board");

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "review":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === "todo"),
    "in-progress": tasks.filter(t => t.status === "in-progress"),
    review: tasks.filter(t => t.status === "review"),
    completed: tasks.filter(t => t.status === "completed"),
  };

  const TaskCard = ({ task }: { task: GroupTask }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow mb-3 touch-manipulation dark:bg-gray-800 dark:border-gray-700"
      onClick={() => onTaskClick?.(task)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2 dark:text-gray-100">
            {task.title}
          </CardTitle>
          <Badge className={getPriorityColor(task.priority)} variant="outline">
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {task.description}
            </p>
          )}
          
          {task.progress > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-700">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1" />
            </div>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {task.assignedTo.length > 0 && (
                <div className="flex -space-x-1">
                  {task.assignedTo.slice(0, 2).map((userId) => (
                    <Avatar key={userId} className="h-5 w-5 border border-white">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                        {userId[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assignedTo.length > 2 && (
                    <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{task.assignedTo.length - 2}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {task.dueDate && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(task.dueDate, { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatusColumn = ({ status, title, tasks }: { 
    status: TaskStatus; 
    title: string; 
    tasks: GroupTask[] 
  }) => (
    <div className="flex-1 min-w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          {getStatusIcon(status)}
          <span>{title}</span>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </h3>
      </div>
      <div className="space-y-2 min-h-32">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No {title.toLowerCase()} tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Task Board</h2>
          <p className="text-gray-600 text-sm">
            {tasks.length} total tasks • {tasksByStatus.completed.length} completed
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "board" | "list")}>
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {canManageTasks && onCreateTask && (
            <Button onClick={onCreateTask} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "board" | "list")}>
        <TabsContent value="board">
          <div className="flex gap-4 overflow-x-auto pb-4">
            <StatusColumn 
              status="todo" 
              title="To Do" 
              tasks={tasksByStatus.todo} 
            />
            <StatusColumn 
              status="in-progress" 
              title="In Progress" 
              tasks={tasksByStatus["in-progress"]} 
            />
            <StatusColumn 
              status="review" 
              title="Review" 
              tasks={tasksByStatus.review} 
            />
            <StatusColumn 
              status="completed" 
              title="Completed" 
              tasks={tasksByStatus.completed} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first task to get started with project management.
                </p>
                {canManageTasks && onCreateTask && (
                  <Button onClick={onCreateTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Task
                  </Button>
                )}
              </div>
            ) : (
              tasks.map((task) => (
                <Card 
                  key={task.id}
                  className="cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => onTaskClick?.(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getPriorityColor(task.priority)} variant="outline">
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.dueDate && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDistanceToNow(task.dueDate, { addSuffix: true })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
