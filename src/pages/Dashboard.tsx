
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CalendarCheck,
  FileText,
  MessageSquare,
  Users,
  ArrowRight,
  BookOpen,
  UserPlus,
  Settings,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ForumStats } from "@/components/forum/ForumStats";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Student Dashboard Content
  const StudentDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Events
            </CardTitle>
            <CardDescription>Your scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <CalendarCheck className="h-5 w-5 text-edu-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Final Project Presentation</p>
                  <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                  <CalendarCheck className="h-5 w-5 text-edu-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Mathematics Exam</p>
                  <p className="text-xs text-gray-500">Friday, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                  <CalendarCheck className="h-5 w-5 text-edu-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Student Council Meeting</p>
                  <p className="text-xs text-gray-500">Next Monday, 4:00 PM</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View all events
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Recent Announcements
            </CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <Bell className="h-5 w-5 text-edu-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Schedule Change: Computer Science</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-danger bg-opacity-10 p-2 rounded">
                  <Bell className="h-5 w-5 text-edu-danger" />
                </div>
                <div>
                  <p className="font-medium text-sm">Important: Registration Deadline</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                  <Bell className="h-5 w-5 text-edu-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">New Learning Resource Available</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View all announcements
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Forum Activity
            </CardTitle>
            <CardDescription>Recent discussions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                  <MessageSquare className="h-5 w-5 text-edu-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Reply to your question about Java</p>
                  <p className="text-xs text-gray-500">30 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                  <MessageSquare className="h-5 w-5 text-edu-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">New post in Math Help Group</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                  <MessageSquare className="h-5 w-5 text-edu-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Your reply was upvoted</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View forum
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Forum Statistics */}
      <div className="mt-6">
        <ForumStats showUserStats />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Currently enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-edu-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Introduction to Computer Science</p>
                    <p className="text-xs text-gray-500">Prof. Sarah Johnson</p>
                  </div>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-secondary bg-opacity-10 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-edu-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Advanced Mathematics</p>
                    <p className="text-xs text-gray-500">Prof. Robert Chen</p>
                  </div>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                    <BookOpen className="h-5 w-5 text-edu-accent" />
                  </div>
                  <div>
                    <p className="font-medium">English Literature</p>
                    <p className="text-xs text-gray-500">Prof. Emily Roberts</p>
                  </div>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2">
                View all courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Groups</CardTitle>
            <CardDescription>Your study groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                    <Users className="h-5 w-5 text-edu-success" />
                  </div>
                  <div>
                    <p className="font-medium">CS Project Team</p>
                    <p className="text-xs text-gray-500">5 members</p>
                  </div>
                </div>
                <Badge variant="outline">2 New Messages</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                    <Users className="h-5 w-5 text-edu-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Math Study Group</p>
                    <p className="text-xs text-gray-500">8 members</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-secondary bg-opacity-10 p-2 rounded">
                    <Users className="h-5 w-5 text-edu-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Literature Discussion</p>
                    <p className="text-xs text-gray-500">3 members</p>
                  </div>
                </div>
                <Badge variant="outline">Inactive</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Manage work groups <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Teacher Dashboard Content
  const TeacherDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              My Courses
            </CardTitle>
            <CardDescription>Courses you teach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <BookOpen className="h-5 w-5 text-edu-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Introduction to Computer Science</p>
                  <p className="text-xs text-gray-500">35 students</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <BookOpen className="h-5 w-5 text-edu-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Advanced Programming</p>
                  <p className="text-xs text-gray-500">22 students</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <BookOpen className="h-5 w-5 text-edu-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Data Structures</p>
                  <p className="text-xs text-gray-500">28 students</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              Manage courses
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Classes
            </CardTitle>
            <CardDescription>Your teaching schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <CalendarCheck className="h-5 w-5 text-edu-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Introduction to Computer Science</p>
                  <p className="text-xs text-gray-500">Today, 10:00 AM - Room 301</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                  <CalendarCheck className="h-5 w-5 text-edu-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Advanced Programming</p>
                  <p className="text-xs text-gray-500">Tomorrow, 2:00 PM - Lab 102</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                  <CalendarCheck className="h-5 w-5 text-edu-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Data Structures</p>
                  <p className="text-xs text-gray-500">Friday, 1:00 PM - Room 205</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View full schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Forum Moderation
            </CardTitle>
            <CardDescription>Recent activity requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-danger bg-opacity-10 p-2 rounded">
                  <MessageSquare className="h-5 w-5 text-edu-danger" />
                </div>
                <div>
                  <p className="font-medium text-sm">Reported comment in CS Forum</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                  <MessageSquare className="h-5 w-5 text-edu-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Unanswered question (3+ days)</p>
                  <p className="text-xs text-gray-500">Data Structures forum</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                  <MessageSquare className="h-5 w-5 text-edu-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">New discussion needs approval</p>
                  <p className="text-xs text-gray-500">Programming forum</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View moderation queue
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
            <CardDescription>Recent assignments to grade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                    <FileText className="h-5 w-5 text-edu-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Programming Assignment #3</p>
                    <p className="text-xs text-gray-500">CS101 - 12 submissions</p>
                  </div>
                </div>
                <Badge>Due Yesterday</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                    <FileText className="h-5 w-5 text-edu-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Final Project Proposal</p>
                    <p className="text-xs text-gray-500">Advanced Programming - 8 submissions</p>
                  </div>
                </div>
                <Badge>Due Today</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                    <FileText className="h-5 w-5 text-edu-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Algorithm Analysis</p>
                    <p className="text-xs text-gray-500">Data Structures - 15 submissions</p>
                  </div>
                </div>
                <Badge variant="outline">Due Next Week</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2">
                View all submissions <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Manage course announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                    <Bell className="h-5 w-5 text-edu-success" />
                  </div>
                  <div>
                    <p className="font-medium">Exam Date Change</p>
                    <p className="text-xs text-gray-500">Posted 2 days ago</p>
                  </div>
                </div>
                <Badge variant="secondary">CS101</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-secondary bg-opacity-10 p-2 rounded">
                    <Bell className="h-5 w-5 text-edu-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Project Deadline Extended</p>
                    <p className="text-xs text-gray-500">Posted 5 days ago</p>
                  </div>
                </div>
                <Badge variant="secondary">Advanced</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                    <Bell className="h-5 w-5 text-edu-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Guest Lecture Announcement</p>
                    <p className="text-xs text-gray-500">Posted 1 week ago</p>
                  </div>
                </div>
                <Badge variant="secondary">DS</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Create announcement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Admin Dashboard Content
  const AdminDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              User Statistics
            </CardTitle>
            <CardDescription>Platform users overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <Users className="h-5 w-5 text-edu-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Students</p>
                  <p className="text-xs text-gray-500">Total registered</p>
                </div>
                <p className="font-bold">1,245</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-secondary bg-opacity-10 p-2 rounded">
                  <Users className="h-5 w-5 text-edu-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Teachers</p>
                  <p className="text-xs text-gray-500">Total registered</p>
                </div>
                <p className="font-bold">87</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                  <Users className="h-5 w-5 text-edu-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Admins</p>
                  <p className="text-xs text-gray-500">Total registered</p>
                </div>
                <p className="font-bold">12</p>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View detailed statistics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              System Alerts
            </CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-danger bg-opacity-10 p-2 rounded">
                  <Bell className="h-5 w-5 text-edu-danger" />
                </div>
                <div>
                  <p className="font-medium text-sm">Storage space low (85% used)</p>
                  <p className="text-xs text-gray-500">Media server</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                  <Bell className="h-5 w-5 text-edu-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">7 user reports unresolved</p>
                  <p className="text-xs text-gray-500">User management</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                  <Bell className="h-5 w-5 text-edu-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">System backup completed</p>
                  <p className="text-xs text-gray-500">Today, 03:00 AM</p>
                </div>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View all alerts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Platform Activity
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                  <FileText className="h-5 w-5 text-edu-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">New Forum Posts</p>
                </div>
                <p className="font-bold">145</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                  <FileText className="h-5 w-5 text-edu-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Assignment Submissions</p>
                </div>
                <p className="font-bold">87</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-edu-secondary bg-opacity-10 p-2 rounded">
                  <FileText className="h-5 w-5 text-edu-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">New User Registrations</p>
                </div>
                <p className="font-bold">23</p>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2" size="sm">
              View activity logs
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Requests</CardTitle>
            <CardDescription>Pending approvals and support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-warning bg-opacity-10 p-2 rounded">
                    <UserPlus className="h-5 w-5 text-edu-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Teacher Account Verification</p>
                    <p className="text-xs text-gray-500">From: John Smith</p>
                  </div>
                </div>
                <Badge>High Priority</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                    <FileText className="h-5 w-5 text-edu-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Course Creation Request</p>
                    <p className="text-xs text-gray-500">From: Emily Johnson</p>
                  </div>
                </div>
                <Badge variant="outline">Medium Priority</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-success bg-opacity-10 p-2 rounded">
                    <MessageSquare className="h-5 w-5 text-edu-success" />
                  </div>
                  <div>
                    <p className="font-medium">Support Ticket: Login Issues</p>
                    <p className="text-xs text-gray-500">From: Multiple Users</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Process all requests <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Platform settings and maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-primary bg-opacity-10 p-2 rounded">
                    <Settings className="h-5 w-5 text-edu-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Registration Settings</p>
                    <p className="text-xs text-gray-500">Manage user registration options</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-secondary bg-opacity-10 p-2 rounded">
                    <Settings className="h-5 w-5 text-edu-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-xs text-gray-500">Configure notification templates</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-edu-accent bg-opacity-10 p-2 rounded">
                    <Settings className="h-5 w-5 text-edu-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Platform Maintenance</p>
                    <p className="text-xs text-gray-500">Schedule system maintenance</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
              <Button variant="outline" className="w-full mt-2">
                System settings <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your {user?.role} portal
        </p>
      </div>

      {/* Show different dashboard based on user role */}
      {user?.role === "student" && <StudentDashboard />}
      {user?.role === "teacher" && <TeacherDashboard />}
      {user?.role === "admin" && <AdminDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
