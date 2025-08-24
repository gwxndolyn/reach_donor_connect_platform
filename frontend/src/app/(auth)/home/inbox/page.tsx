"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Search, Send, MoreVertical, Heart } from "lucide-react";

// Mock data for children beneficiaries
const children = [
  {
    id: 1,
    name: "Emma Rodriguez",
    age: 8,
    location: "Guatemala",
    lastMessage: "Thank you so much for the school supplies! 📚",
    timestamp: "2 min ago",
    unread: 2,
    avatar: "👧",
    online: true,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 12,
    location: "Kenya",
    lastMessage: "The books you sent are amazing!",
    timestamp: "1 hour ago",
    unread: 0,
    avatar: "👦",
    online: false,
  },
  {
    id: 3,
    name: "Priya Sharma",
    age: 10,
    location: "India",
    lastMessage: "My family says thank you ❤️",
    timestamp: "3 hours ago",
    unread: 1,
    avatar: "👧",
    online: true,
  },
  {
    id: 4,
    name: "Carlos Santos",
    age: 9,
    location: "Brazil",
    lastMessage: "I got the new shoes! They fit perfectly!",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "👦",
    online: false,
  },
  {
    id: 5,
    name: "Aisha Hassan",
    age: 7,
    location: "Somalia",
    lastMessage: "Thank you for helping my school!",
    timestamp: "2 days ago",
    unread: 0,
    avatar: "👧",
    online: false,
  },
];

// Mock messages for the selected child
const mockMessages = {
  1: [
    {
      id: 1,
      sender: "child",
      message: "Hello! Thank you for sponsoring me! 😊",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "donor",
      message: "Hi Emma! I'm so happy to help. How is school going?",
      timestamp: "10:45 AM",
    },
    {
      id: 3,
      sender: "child",
      message: "School is great! I love reading the books you sent.",
      timestamp: "11:00 AM",
    },
    {
      id: 4,
      sender: "child",
      message: "Thank you so much for the school supplies! 📚",
      timestamp: "Just now",
    },
  ],
  2: [
    {
      id: 1,
      sender: "child",
      message: "Hi! My name is Marcus. Thank you for helping me!",
      timestamp: "Yesterday",
    },
    {
      id: 2,
      sender: "donor",
      message:
        "Hello Marcus! I'm excited to support your education. What's your favorite subject?",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      sender: "child",
      message: "I love science! The books you sent are amazing!",
      timestamp: "1 hour ago",
    },
  ],
  3: [
    {
      id: 1,
      sender: "child",
      message: "Hello! I'm Priya. Thank you for being my sponsor! 🙏",
      timestamp: "3 days ago",
    },
    {
      id: 2,
      sender: "donor",
      message: "Hi Priya! I'm so happy to meet you. Tell me about yourself!",
      timestamp: "3 days ago",
    },
    {
      id: 3,
      sender: "child",
      message: "I love to draw and paint! Thank you for the art supplies.",
      timestamp: "2 days ago",
    },
    {
      id: 4,
      sender: "child",
      message: "My family says thank you ❤️",
      timestamp: "3 hours ago",
    },
  ],
  4: [
    {
      id: 1,
      sender: "child",
      message: "Hi! I'm Carlos from Brazil! 🇧🇷",
      timestamp: "3 days ago",
    },
    {
      id: 2,
      sender: "donor",
      message: "Hello Carlos! It's wonderful to meet you. How are you doing?",
      timestamp: "3 days ago",
    },
    {
      id: 3,
      sender: "child",
      message: "I'm doing great! Thank you for the new shoes you sent.",
      timestamp: "2 days ago",
    },
    {
      id: 4,
      sender: "donor",
      message: "I'm so glad they arrived safely! Do they fit well?",
      timestamp: "2 days ago",
    },
    {
      id: 5,
      sender: "child",
      message: "I got the new shoes! They fit perfectly!",
      timestamp: "Yesterday",
    },
  ],
  5: [
    {
      id: 1,
      sender: "child",
      message: "Hello! My name is Aisha. Thank you for helping me! 🌟",
      timestamp: "4 days ago",
    },
    {
      id: 2,
      sender: "donor",
      message: "Hi Aisha! I'm so happy to support you and your education.",
      timestamp: "4 days ago",
    },
    {
      id: 3,
      sender: "child",
      message: "The supplies you sent helped build a new classroom!",
      timestamp: "3 days ago",
    },
    {
      id: 4,
      sender: "donor",
      message: "That's amazing! Education is so important. Keep studying hard!",
      timestamp: "3 days ago",
    },
    {
      id: 5,
      sender: "child",
      message: "Thank you for helping my school!",
      timestamp: "2 days ago",
    },
  ],
};

export default function InboxPage() {
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages =
    mockMessages[selectedChild.id as keyof typeof mockMessages] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] pt-20 bg-white">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar - Children List */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
          <div className="h-full border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold mb-3">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search children..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 border-0"
                />
              </div>
            </div>

            {/* Children List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredChildren.map((child) => (
                  <Card
                    key={child.id}
                    className={`p-3 mb-2 cursor-pointer hover:bg-gray-50 transition-colors border-0 ${
                      selectedChild.id === child.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedChild(child)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                            {child.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {child.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">
                            {child.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {child.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {child.lastMessage}
                          </p>
                          {child.unread > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                              {child.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Age {child.age} • {child.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Side - Chat Area */}
        <ResizablePanel defaultSize={70}>
          <div className="h-full flex flex-col pt-20">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {selectedChild.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChild.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedChild.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedChild.online
                        ? "Active now"
                        : `Age ${selectedChild.age} • ${selectedChild.location}`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "donor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === "donor"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "donor"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Message ${selectedChild.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-12 rounded-full border-gray-300 focus:border-blue-500"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full p-0"
                  >
                    <Heart className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="rounded-full h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
