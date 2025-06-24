
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  FileText, Calendar, Bell, MessageSquare, Search, 
  Filter, ChevronDown, Bookmark, ThumbsUp, Share, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: "school" | "department" | "class";
  target?: string;
  important: boolean;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
}

const News = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Campus-wide Internet Maintenance",
      content: "Please be informed that there will be scheduled internet maintenance across campus on Saturday, May 20th from 10:00 PM to 2:00 AM. During this period, internet connectivity may be intermittent or unavailable. We apologize for any inconvenience this may cause and appreciate your understanding as we work to improve our network infrastructure.",
      date: new Date("2025-05-15T14:30:00"),
      author: {
        name: "IT Department",
        role: "Administration",
        avatar: "",
      },
      category: "school",
      important: true,
      likes: 12,
      comments: 5,
    },
    {
      id: "2",
      title: "Computer Science Department Meeting",
      content: "All faculty members of the Computer Science Department are required to attend the end-of-semester meeting on Friday, May 22nd at 3:00 PM in Room 302. We will discuss curriculum changes for the upcoming academic year, student feedback, and departmental goals.",
      date: new Date("2025-05-14T10:15:00"),
      author: {
        name: "Dr. Robert Chen",
        role: "Department Chair",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      category: "department",
      target: "Computer Science",
      important: false,
      likes: 8,
      comments: 2,
    },
    {
      id: "3",
      title: "Final Project Submission Deadline Extended",
      content: "Due to multiple requests, the deadline for the final project submission for CS 101 has been extended to May 25th at 11:59 PM. This is a strict deadline, and no further extensions will be granted. Please use this additional time to ensure your projects meet all the requirements outlined in the project guidelines.",
      date: new Date("2025-05-13T16:45:00"),
      author: {
        name: "Dr. Sarah Miller",
        role: "Professor",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      category: "class",
      target: "CS 101",
      important: true,
      likes: 34,
      comments: 12,
      liked: true,
    },
    {
      id: "4",
      title: "Summer Research Opportunities Available",
      content: "The Science Department is offering summer research opportunities for undergraduate students. These paid positions will run from June 15th to August 15th and will focus on projects in artificial intelligence, data science, and computational biology. To apply, please submit your resume and a statement of interest to the department office by May 30th.",
      date: new Date("2025-05-12T09:20:00"),
      author: {
        name: "Academic Affairs",
        role: "Administration",
        avatar: "",
      },
      category: "school",
      important: false,
      likes: 56,
      comments: 23,
    },
    {
      id: "5",
      title: "Library Hours Extended During Finals Week",
      content: "The university library will extend its hours during finals week (May 24th to May 30th). The library will be open from 7:00 AM to 2:00 AM daily. Additional study spaces will be available in the East Wing, and the quiet study areas will be strictly enforced. Librarians will be available for extended hours to assist with research needs.",
      date: new Date("2025-05-10T13:10:00"),
      author: {
        name: "University Library",
        role: "Service",
        avatar: "",
      },
      category: "school",
      important: false,
      likes: 87,
      comments: 14,
      saved: true,
    },
  ]);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      searchQuery === "" || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === null || 
      announcement.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  const toggleLike = (id: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => {
        if (announcement.id === id) {
          const isLiked = announcement.liked;
          return {
            ...announcement,
            liked: !isLiked,
            likes: isLiked ? announcement.likes - 1 : announcement.likes + 1
          };
        }
        return announcement;
      })
    );
  };

  const toggleSave = (id: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => {
        if (announcement.id === id) {
          return {
            ...announcement,
            saved: !announcement.saved
          };
        }
        return announcement;
      })
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <div className="container-responsive space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-responsive-2xl font-bold text-gray-900 dark:text-gray-100">News & Announcements</h1>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:min-w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Input
                  placeholder="Search announcements..."
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  style={{ fontSize: '16px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isAdmin && (
                <Button className="touch-manipulation min-h-[44px]">
                  <FileText className="mr-2" size={18} />
                  <span className="hidden sm:inline">New Announcement</span>
                  <span className="sm:hidden">New</span>
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-5 min-w-max">
                <TabsTrigger value="all" onClick={() => setFilter(null)} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">All Announcements</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
                <TabsTrigger value="school" onClick={() => setFilter("school")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">School-wide</span>
                  <span className="sm:hidden">School</span>
                </TabsTrigger>
                <TabsTrigger value="department" onClick={() => setFilter("department")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">Department</span>
                  <span className="sm:hidden">Dept</span>
                </TabsTrigger>
                <TabsTrigger value="class" onClick={() => setFilter("class")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">Class-specific</span>
                  <span className="sm:hidden">Class</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  Saved
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-6 mt-4">
              {filteredAnnouncements.map(announcement => (
                <AnnouncementCard 
                  key={announcement.id} 
                  announcement={announcement} 
                  toggleLike={toggleLike}
                  toggleSave={toggleSave}
                />
              ))}
            </TabsContent>

            <TabsContent value="school" className="space-y-6 mt-4">
              {filteredAnnouncements
                .filter(a => a.category === "school")
                .map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    toggleLike={toggleLike}
                    toggleSave={toggleSave}
                  />
              ))}
            </TabsContent>

            <TabsContent value="department" className="space-y-6 mt-4">
              {filteredAnnouncements
                .filter(a => a.category === "department")
                .map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    toggleLike={toggleLike}
                    toggleSave={toggleSave}
                  />
              ))}
            </TabsContent>

            <TabsContent value="class" className="space-y-6 mt-4">
              {filteredAnnouncements
                .filter(a => a.category === "class")
                .map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    toggleLike={toggleLike}
                    toggleSave={toggleSave}
                  />
              ))}
            </TabsContent>

            <TabsContent value="saved" className="space-y-6 mt-4">
              {announcements
                .filter(a => a.saved)
                .map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                    toggleLike={toggleLike}
                    toggleSave={toggleSave}
                  />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface AnnouncementCardProps {
  announcement: Announcement;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
}

const AnnouncementCard = ({ announcement, toggleLike, toggleSave }: AnnouncementCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isShort = announcement.content.length < 200;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case "school":
        return <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">School-wide</Badge>;
      case "department":
        return <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800">Department</Badge>;
      case "class":
        return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800">Class</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`dark:bg-gray-800 dark:border-gray-700 ${announcement.important ? "border-l-4 border-l-red-500 dark:border-l-red-400" : ""}`}>
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage src={announcement.author.avatar} />
              <AvatarFallback className="dark:bg-gray-700 dark:text-gray-300">{getInitials(announcement.author.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{announcement.author.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{announcement.author.role}</span>
                {announcement.important && (
                  <Badge variant="destructive" className="self-start sm:self-center">Important</Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Clock size={14} className="mr-1 flex-shrink-0" />
                <time>{formatDate(announcement.date)}</time>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-manipulation dark:hover:bg-gray-700 flex-shrink-0">
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem
                onClick={() => toggleSave(announcement.id)}
                className="dark:hover:bg-gray-700 dark:text-gray-200"
              >
                {announcement.saved ? "Unsave" : "Save"} announcement
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:hover:bg-gray-700 dark:text-gray-200">Mark as read</DropdownMenuItem>
              <DropdownMenuItem className="dark:hover:bg-gray-700 dark:text-gray-200">Copy link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle className="mt-4 text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-2">{announcement.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {getCategoryBadge(announcement.category)}
          {announcement.target && (
            <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{announcement.target}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <div className="text-gray-700 dark:text-gray-300">
          {isShort || expanded ? (
            <p className="text-sm sm:text-base leading-relaxed">{announcement.content}</p>
          ) : (
            <>
              <p className="text-sm sm:text-base leading-relaxed">{announcement.content.substring(0, 200)}...</p>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-1 touch-manipulation"
                onClick={() => setExpanded(true)}
              >
                Read more
              </Button>
            </>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-2 border-t dark:border-gray-700 gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 touch-manipulation min-h-[44px] sm:min-h-[36px] ${
                announcement.liked ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              }`}
              onClick={() => toggleLike(announcement.id)}
            >
              <ThumbsUp size={16} />
              <span className="text-sm">{announcement.likes}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-1 touch-manipulation min-h-[44px] sm:min-h-[36px] text-gray-600 dark:text-gray-400">
              <MessageSquare size={16} />
              <span className="text-sm">{announcement.comments}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-end sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              className={`touch-manipulation min-h-[44px] sm:min-h-[36px] ${
                announcement.saved ? "text-yellow-600 dark:text-yellow-400" : "text-gray-600 dark:text-gray-400"
              }`}
              onClick={() => toggleSave(announcement.id)}
            >
              <Bookmark size={16} />
            </Button>

            <Button variant="ghost" size="sm" className="touch-manipulation min-h-[44px] sm:min-h-[36px] text-gray-600 dark:text-gray-400">
              <Share size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for date formatting
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export default News;
