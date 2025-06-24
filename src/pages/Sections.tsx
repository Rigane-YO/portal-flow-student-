
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Teaching Sections</h1>
        <Button>Create New Section</Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search courses..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(searchQuery ? filteredCourses : activeCourses).map((course) => (
          <Card key={course.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2">{course.code}</Badge>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {course.enrolled} students enrolled (Capacity: {course.capacity})
                  </CardDescription>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-gray-500" />
                  <span className="text-sm">{course.schedule}</span>
                </div>
                <div className="flex items-center">
                  <Book size={18} className="mr-2 text-gray-500" />
                  <span className="text-sm">{course.room}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700">{course.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const renderStudentView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search courses..." 
            className="pl-10"
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
          <TabsList>
            <TabsTrigger value="active">Active Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

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
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      upcoming: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge>{course.code}</Badge>
                {course.status && (
                  <Badge className={statusColors[course.status] || ""} variant="secondary">
                    {course.status === "active" ? "In Progress" : 
                     course.status === "completed" ? "Completed" : "Upcoming"}
                  </Badge>
                )}
              </div>
              <CardTitle>{course.name}</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              View Course
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="flex items-center">
                <Users size={18} className="mr-2 text-gray-500" />
                <span className="text-sm">{course.instructor}</span>
              </div>
              <div className="flex items-center mt-2">
                <Calendar size={18} className="mr-2 text-gray-500" />
                <span className="text-sm">{course.schedule}</span>
              </div>
              <div className="flex items-center mt-2">
                <Book size={18} className="mr-2 text-gray-500" />
                <span className="text-sm">{course.room}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Credits</span>
                <span className="text-sm">{course.credits}</span>
              </div>
              {course.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
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
      <div className="container mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isTeacher ? renderTeacherView() : renderStudentView()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sections;
