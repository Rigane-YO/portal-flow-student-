
import { useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CalendarCheck,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  UserRound,
  Users,
  X,
  Book,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const { theme, actualTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if screen is desktop size
  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const sidebarItems = [
    {
      icon: Home,
      text: "Dashboard",
      href: "/dashboard",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: FileText,
      text: "News & Announcements",
      href: "/dashboard/news",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: Book,
      text: "Sections & Courses",
      href: "/dashboard/sections",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: CalendarCheck,
      text: "Calendar & Events",
      href: "/dashboard/calendar",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: FileText,
      text: "Resources",
      href: "/dashboard/resources",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: MessageSquare,
      text: "Forum Q&A",
      href: "/dashboard/forum",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: Users,
      text: "Work Groups",
      href: "/dashboard/groups",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: MessageSquare,
      text: "Chat",
      href: "/dashboard/chat",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: Shield,
      text: "Moderation",
      href: "/dashboard/forum/moderation",
      forRoles: ["teacher", "admin"],
    },
    {
      icon: UserRound,
      text: "Profile",
      href: "/dashboard/profile",
      forRoles: ["student", "teacher", "admin"],
    },
    {
      icon: Settings,
      text: "Settings",
      href: "/dashboard/settings",
      forRoles: ["student", "teacher", "admin"],
    },
  ];

  const filteredSidebarItems = sidebarItems.filter((item) =>
    item.forRoles.includes(user?.role || "student")
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      {isDesktop && (
        <aside className="bg-white dark:bg-gray-900 shadow-lg flex flex-col w-64 transition-all duration-300 ease-in-out relative z-10">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Campus Connect</h1>
            </div>
          </div>

          <div className="flex flex-col justify-between flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              <ul className="space-y-1">
                {filteredSidebarItems.map((item) => (
                  <li key={item.text}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        location.pathname === item.href
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.text}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    {user
                      ? getInitials(`${user.firstName} ${user.lastName}`)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile sidebar overlay */}
      {!isDesktop && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      {!isDesktop && (
        <aside
          className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900 shadow-xl flex flex-col z-50 w-64 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Campus Connect</h1>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>

        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
          <nav className="px-2 py-4">
            <ul className="space-y-1">
              {filteredSidebarItems.map((item) => (
                <li key={item.text}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.href
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.text}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user
                    ? getInitials(`${user.firstName} ${user.lastName}`)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {!isDesktop && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </Button>
              )}
              {!isDesktop && (
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Campus Connect</h1>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    {getThemeIcon()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              {!isDesktop && (
                <div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {user
                        ? getInitials(`${user.firstName} ${user.lastName}`)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
