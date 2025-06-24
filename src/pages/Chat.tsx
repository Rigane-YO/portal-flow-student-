
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
      <div className="h-[calc(100vh-120px)] bg-white rounded-lg shadow">
        <div className="flex h-full">
          {/* Contacts sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
              <div className="mt-2 relative">
                <Input placeholder="Search contacts..." className="pr-8" />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-3 rounded-md cursor-pointer ${
                      activeContact?.id === contact.id
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className={contact.isGroup ? "bg-blue-100 text-blue-600" : ""}>
                        {contact.isGroup ? (
                          <User size={18} />
                        ) : (
                          getInitials(contact.name)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                    <div className="ml-2 w-2 h-2 rounded-full flex-shrink-0 self-start mt-2">
                      {contact.online && <div className="bg-green-500 w-2 h-2 rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <Button className="w-full">
                <Plus size={18} className="mr-2" />
                New Message
              </Button>
            </div>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {activeContact ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeContact.avatar} />
                    <AvatarFallback className={activeContact.isGroup ? "bg-blue-100 text-blue-600" : ""}>
                      {activeContact.isGroup ? (
                        <User size={18} />
                      ) : (
                        getInitials(activeContact.name)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{activeContact.name}</p>
                    <p className="text-xs text-gray-500">
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
                          <div className="flex items-end gap-2 max-w-[80%]">
                            {!isOwn && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.sender.avatar} />
                                <AvatarFallback>
                                  {getInitials(msg.sender.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg p-3 ${
                                isOwn
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {msg.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {isOwn && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.sender.avatar} />
                                <AvatarFallback>
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
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Welcome to Messages
                </h3>
                <p className="text-gray-500 max-w-md">
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
