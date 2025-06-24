
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  FileText, Download, Search, Filter, Book, 
  Video, FileImage, FilePlus, BookOpen 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "image" | "link" | "book";
  size?: string;
  dateAdded: Date;
  author: string;
  url: string;
  course?: string;
  tags: string[];
}

const Resources = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Mock resources data
  const resources: Resource[] = [
    {
      id: "1",
      title: "Introduction to Computer Science - Lecture Notes",
      description: "Comprehensive lecture notes covering the first unit of CS101",
      type: "document",
      size: "3.2 MB",
      dateAdded: new Date("2025-04-10"),
      author: "Professor Smith",
      url: "#",
      course: "CS101",
      tags: ["lecture", "notes", "computer science", "introduction"],
    },
    {
      id: "2",
      title: "Data Structures and Algorithms Tutorial",
      description: "Video tutorial explaining basic data structures and algorithms",
      type: "video",
      size: "128 MB",
      dateAdded: new Date("2025-04-08"),
      author: "Professor Johnson",
      url: "#",
      course: "CS201",
      tags: ["tutorial", "video", "data structures", "algorithms"],
    },
    {
      id: "3",
      title: "Mathematics for Computer Science",
      description: "Textbook covering discrete mathematics and probability",
      type: "book",
      dateAdded: new Date("2025-04-05"),
      author: "Jane Smith",
      url: "#",
      course: "MATH242",
      tags: ["textbook", "mathematics", "probability"],
    },
    {
      id: "4",
      title: "Web Development Project Guidelines",
      description: "Guidelines and requirements for the final project",
      type: "document",
      size: "1.5 MB",
      dateAdded: new Date("2025-04-02"),
      author: "Professor Wilson",
      url: "#",
      course: "CS350",
      tags: ["project", "guidelines", "web development"],
    },
    {
      id: "5",
      title: "Network Topology Diagrams",
      description: "Visual representations of different network topologies",
      type: "image",
      size: "4.7 MB",
      dateAdded: new Date("2025-03-28"),
      author: "Professor Lee",
      url: "#",
      course: "NET301",
      tags: ["network", "topology", "diagrams"],
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = 
      searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      activeFilter === null || 
      resource.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getResourceIcon = (type: string) => {
    switch(type) {
      case "document":
        return <FileText className="text-blue-500 dark:text-blue-400" />;
      case "video":
        return <Video className="text-red-500 dark:text-red-400" />;
      case "image":
        return <FileImage className="text-green-500 dark:text-green-400" />;
      case "link":
        return <Book className="text-purple-500 dark:text-purple-400" />;
      case "book":
        return <BookOpen className="text-amber-500 dark:text-amber-400" />;
      default:
        return <FileText className="text-gray-500 dark:text-gray-400" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="container-responsive">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-responsive-2xl font-bold text-gray-900 dark:text-gray-100">Learning Resources</h1>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:min-w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Input
                  placeholder="Search resources..."
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  style={{ fontSize: '16px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="touch-manipulation min-h-[44px] w-full sm:w-auto">
                <FilePlus className="mr-2" size={18} />
                <span className="hidden sm:inline">Add Resource</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-5 min-w-max">
                <TabsTrigger value="all" onClick={() => setActiveFilter(null)} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">All Resources</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
                <TabsTrigger value="documents" onClick={() => setActiveFilter("document")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </TabsTrigger>
                <TabsTrigger value="videos" onClick={() => setActiveFilter("video")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="books" onClick={() => setActiveFilter("book")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  Books
                </TabsTrigger>
                <TabsTrigger value="images" onClick={() => setActiveFilter("image")} className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                  <span className="hidden sm:inline">Images</span>
                  <span className="sm:hidden">Imgs</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <div className="space-y-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <div key={resource.id} className="border dark:border-gray-600 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700 transition-all touch-manipulation">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex-shrink-0 self-start">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">{resource.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-shrink-0">
                          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 self-start">
                            {resource.course}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(resource.dateAdded)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base leading-relaxed">{resource.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Added by {resource.author}
                          {resource.size && ` • ${resource.size}`}
                        </span>
                        <Button variant="outline" size="sm" className="touch-manipulation min-h-[44px] sm:min-h-[36px] w-full sm:w-auto dark:border-gray-600 dark:text-gray-300">
                          <Download size={16} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No resources found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No resources match your current search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Resources;
