
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Plus, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage?: string;
  avatar?: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
}

const Chat = () => {
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock contacts data
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      lastMessage: "Can you share the lecture notes?",
      avatar: "https://i.pravatar.cc/150?img=1",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Michael Chang",
      lastMessage: "Thanks for your help!",
      avatar: "https://i.pravatar.cc/150?img=2",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "CS 101 Study Group",
      lastMessage: "Meeting tomorrow at 3pm",
      avatar: "",
      unread: 5,
      online: true,
      isGroup: true,
    },
    {
      id: "4",
      name: "Prof. Anderson",
      lastMessage: "Office hours canceled today",
      avatar: "https://i.pravatar.cc/150?img=4",
      unread: 0,
      online: false,
    },
  ]);

  // Mock messages for demo
  useEffect(() => {
    if (activeContact) {
      // Generate fake messages for demo
      const mockMessages: Message[] = [
        {
          id: "m1",
          sender: {
            id: activeContact.id,
            name: activeContact.name,
            avatar: activeContact.avatar,
          },
          content: "Hello there! How are you doing?",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "m2",
          sender: {
            id: user?.id || "current-user",
            name: `${user?.firstName} ${user?.lastName}` || "You",
            avatar: user?.profilePicture,
          },
          content: "Hi! I'm good, thanks for asking. How about you?",
          timestamp: new Date(Date.now() - 3500000),
        },
        {
          id: "m3",
          sender: {
            id: activeContact.id,
            name: activeContact.name,
            avatar: activeContact.avatar,
          },
          content: "I'm doing well! Just preparing for the upcoming exam.",
          timestamp: new Date(Date.now() - 3400000),
        },
      ];
      setMessages(mockMessages);

      // Mark messages as read
      setContacts(
        contacts.map((contact) =>
          contact.id === activeContact.id ? { ...contact, unread: 0 } : contact
        )
      );
    }
  }, [activeContact, user]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeContact) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: {
        id: user?.id || "current-user",
        name: `${user?.firstName} ${user?.lastName}` || "You",
        avatar: user?.profilePicture,
      },
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700">
        <div className="flex h-full">
          {/* Contacts sidebar */}
          <div className={`${activeContact ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Messages</h2>
              <div className="mt-2 relative">
                <Input
                  placeholder="Search contacts..."
                  className="pr-8 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-3 rounded-md cursor-pointer touch-manipulation transition-colors ${
                      activeContact?.id === contact.id
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveContact(contact)}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className={contact.isGroup ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "dark:bg-gray-600 dark:text-gray-300"}>
                        {contact.isGroup ? (
                          <User size={18} />
                        ) : (
                          getInitials(contact.name)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 overflow-hidden min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate text-gray-900 dark:text-gray-100">{contact.name}</p>
                        {contact.unread > 0 && (
                          <span className="bg-blue-500 dark:bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                    <div className="ml-2 w-2 h-2 rounded-full flex-shrink-0 self-start mt-2">
                      {contact.online && <div className="bg-green-500 dark:bg-green-400 w-2 h-2 rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button className="w-full touch-manipulation min-h-[44px]">
                <Plus size={18} className="mr-2" />
                New Message
              </Button>
            </div>
          </div>

          {/* Chat area */}
          <div className={`${activeContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            {activeContact ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden mr-2 touch-manipulation"
                    onClick={() => setActiveContact(null)}
                  >
                    ←
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeContact.avatar} />
                    <AvatarFallback className={activeContact.isGroup ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "dark:bg-gray-600 dark:text-gray-300"}>
                      {activeContact.isGroup ? (
                        <User size={18} />
                      ) : (
                        getInitials(activeContact.name)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{activeContact.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activeContact.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isOwn = msg.sender.id === user?.id || msg.sender.id === "current-user";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[80%]">
                            {!isOwn && (
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                                <AvatarImage src={msg.sender.avatar} />
                                <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-gray-300">
                                  {getInitials(msg.sender.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg p-3 ${
                                isOwn
                                  ? "bg-blue-500 dark:bg-blue-600 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? "text-blue-100 dark:text-blue-200" : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {msg.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {isOwn && (
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                                <AvatarImage src={msg.sender.avatar} />
                                <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-gray-300">
                                  {getInitials(msg.sender.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                      style={{ fontSize: '16px' }}
                    />
                    <Button onClick={handleSendMessage} className="touch-manipulation min-h-[44px] min-w-[44px]">
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Welcome to Messages
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Select a conversation from the sidebar to start chatting or create a new message.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
