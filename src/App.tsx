
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ForumProvider } from "@/contexts/ForumContext";
import { GroupsProvider } from "@/contexts/GroupsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import News from "./pages/News";
import Resources from "./pages/Resources";
import Sections from "./pages/Sections";
import Forum from "./pages/Forum";
import QuestionDetail from "./pages/QuestionDetail";
import AskQuestion from "./pages/AskQuestion";
import ModerationQueue from "./pages/ModerationQueue";
import WorkGroups from "./pages/WorkGroups";
import Settings from "./pages/Settings";
import ResponsiveTest from "./pages/ResponsiveTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <ForumProvider>
            <GroupsProvider>
              <SettingsProvider>
                <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/dashboard/calendar" 
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/chat" 
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/news" 
              element={
                <PrivateRoute>
                  <News />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/resources" 
              element={
                <PrivateRoute>
                  <Resources />
                </PrivateRoute>
              } 
            />
            
            <Route
              path="/dashboard/sections"
              element={
                <PrivateRoute>
                  <Sections />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/forum"
              element={
                <PrivateRoute>
                  <Forum />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/forum/question/:questionId"
              element={
                <PrivateRoute>
                  <QuestionDetail />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/forum/ask"
              element={
                <PrivateRoute>
                  <AskQuestion />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/forum/moderation"
              element={
                <PrivateRoute>
                  <ModerationQueue />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/groups"
              element={
                <PrivateRoute>
                  <WorkGroups />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/test-responsive"
              element={
                <PrivateRoute>
                  <ResponsiveTest />
                </PrivateRoute>
              }
            />

            {/* Catch-all for other dashboard routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
                </BrowserRouter>
              </SettingsProvider>
            </GroupsProvider>
          </ForumProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
