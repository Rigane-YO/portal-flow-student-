
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Book, Search, Users, Calendar, Clock, ArrowRight 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  room: string;
  credits: number;
  enrolled: number;
  capacity: number;
  description: string;
  progress?: number;
  status?: "active" | "completed" | "upcoming";
}

const Sections = () => {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock courses data
  const activeCourses: Course[] = [
    {
      id: "cs101",
      code: "CS 101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Sarah Miller",
      schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
      room: "Tech Building 305",
      credits: 3,
      enrolled: 28,
      capacity: 30,
      description: "Fundamental concepts of computer science including problem-solving, algorithms, data structures, and basic programming.",
      progress: 68,
      status: "active",
    },
    {
      id: "math242",
      code: "MATH 242",
      name: "Calculus II",
      instructor: "Prof. Robert Chen",
      schedule: "Tue, Thu 1:00 PM - 3:00 PM",
      room: "Science Hall 120",
      credits: 4,
      enrolled: 25,
      capacity: 35,
      description: "Continuation of Calculus I, covering integration techniques, sequences, series, and differential equations.",
      progress: 72,
      status: "active",
    },
    {
      id: "eng210",
      code: "ENG 210",
      name: "Technical Writing",
      instructor: "Dr. James Wilson",
      schedule: "Wed 3:00 PM - 6:00 PM",
      room: "Arts Building 210",
      credits: 3,
      enrolled: 15,
      capacity: 20,
      description: "Development of technical writing skills for various professional contexts including research reports and technical documentation.",
      progress: 45,
      status: "active",
    },
  ];
  
  const completedCourses: Course[] = [
    {
      id: "cs100",
      code: "CS 100",
      name: "Computer Literacy",
      instructor: "Dr. Michael Johnson",
      schedule: "Mon, Wed 9:00 AM - 10:30 AM",
      room: "Tech Building 201",
      credits: 2,
      enrolled: 30,
      capacity: 30,
      description: "Basic computer skills including office productivity software, internet usage, and information literacy.",
      status: "completed",
    },
    {
      id: "math141",
      code: "MATH 141",
      name: "Calculus I",
      instructor: "Prof. Lisa Zhang",
      schedule: "Tue, Thu 10:00 AM - 12:00 PM",
      room: "Science Hall 110",
      credits: 4,
      enrolled: 28,
      capacity: 30,
      description: "Introduction to differential and integral calculus of functions of one variable.",
      status: "completed",
    },
  ];

  const upcomingCourses: Course[] = [
    {
      id: "cs201",
      code: "CS 201",
      name: "Data Structures and Algorithms",
      instructor: "Dr. Fatima Aliyev",
      schedule: "Mon, Wed, Fri 1:00 PM - 2:30 PM",
      room: "Tech Building 402",
      credits: 4,
      enrolled: 18,
      capacity: 25,
      description: "Advanced data structures and algorithm analysis including trees, graphs, sorting, and searching algorithms.",
      status: "upcoming",
    },
  ];

  const allCourses = [...activeCourses, ...completedCourses, ...upcomingCourses];

  const filteredCourses = allCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeacherView = () => (
    <div className="space-responsive-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-responsive-2xl font-bold text-gray-900 dark:text-gray-100">Your Teaching Sections</h1>
        <Button className="touch-manipulation min-h-[44px] w-full sm:w-auto">
          <span className="hidden sm:inline">Create New Section</span>
          <span className="sm:hidden">New Section</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <Input
          placeholder="Search courses..."
          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          style={{ fontSize: '16px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid-responsive-1">
        {(searchQuery ? filteredCourses : activeCourses).map((course) => (
          <Card key={course.id} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Badge className="mb-2 dark:bg-gray-700 dark:text-gray-300">{course.code}</Badge>
                  <CardTitle className="text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-2">{course.name}</CardTitle>
                  <CardDescription className="mt-1 dark:text-gray-400">
                    {course.enrolled} students enrolled (Capacity: {course.capacity})
                  </CardDescription>
                </div>
                <Button variant="outline" className="touch-manipulation min-h-[44px] w-full sm:w-auto dark:border-gray-600 dark:text-gray-300">
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{course.schedule}</span>
                </div>
                <div className="flex items-center">
                  <Book size={16} className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{course.room}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{course.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const renderStudentView = () => (
    <div className="space-responsive-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-responsive-2xl font-bold text-gray-900 dark:text-gray-100">My Courses</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <Input
            placeholder="Search courses..."
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            style={{ fontSize: '16px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {searchQuery ? (
        <div className="space-y-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="text-center py-10">
              <Book className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No courses match your search query.
              </p>
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="active">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-3 min-w-max">
              <TabsTrigger value="active" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <span className="hidden sm:inline">Active Courses</span>
                <span className="sm:hidden">Active</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">Done</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Soon</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="space-y-4 mt-4">
            {activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  const CourseCard = ({ course }: { course: Course }) => {
    const statusColors = {
      active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      completed: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      upcoming: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    };

    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className="dark:bg-gray-700 dark:text-gray-300">{course.code}</Badge>
                {course.status && (
                  <Badge className={statusColors[course.status] || ""} variant="secondary">
                    {course.status === "active" ? "In Progress" :
                     course.status === "completed" ? "Completed" : "Upcoming"}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-gray-900 dark:text-gray-100 text-base sm:text-lg line-clamp-2">{course.name}</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="touch-manipulation min-h-[44px] w-full sm:w-auto dark:border-gray-600 dark:text-gray-300">
              <span className="hidden sm:inline">View Course</span>
              <span className="sm:hidden">View</span>
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <Users size={16} className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{course.instructor}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{course.schedule}</span>
              </div>
              <div className="flex items-center">
                <Book size={16} className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{course.room}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Credits</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{course.credits}</span>
              </div>
              {course.progress !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Progress</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="dark:bg-gray-700" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="container-responsive">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border dark:border-gray-700">
          {isTeacher ? renderTeacherView() : renderStudentView()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sections;
