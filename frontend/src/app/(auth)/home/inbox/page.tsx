"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Search, Send, MoreVertical, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function InboxPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [donorId, setDonorId] = useState<string | null>(null);

  // Initialize authentication and get donor ID
  useEffect(() => {
    const initAuth = async () => {
      console.log(
        "API URL environment variable:",
        process.env.NEXT_PUBLIC_API_URL
      );

      const supabase = createClient();
      const { data: AuthData, error: AuthError } =
        await supabase.auth.getUser();

      if (AuthError || !AuthData?.user) {
        console.error("Authentication error:", AuthError);
        window.location.href = "/login";
        return;
      }

      console.log("Authenticated user:", AuthData.user);

      // Get the actual donor ID from the database using the Supabase user ID
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donor/get_donor_id_by_supabase_id/${AuthData.user.id}`
        );

        if (response.ok) {
          const donorData = await response.json();
          console.log("Donor data from DB:", donorData[0].id);
          setDonorId(donorData[0].id);
        } else {
          // Fallback: try using the Supabase user ID directly
          console.log("Fallback: using Supabase user ID as donor ID");
          setDonorId(AuthData.user.id);
        }
      } catch (error) {
        console.error("Error fetching donor ID:", error);
        // Fallback: try using the Supabase user ID directly
        console.log("Fallback: using Supabase user ID as donor ID");
        setDonorId(AuthData.user.id);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!donorId) return;
      console.log("Fetching children for donor:", donorId);

      try {
        // Use the backend API instead of direct Supabase calls
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/donor/get_all_children/${donorId}`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl);

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", response.status, errorText);
          throw new Error(
            `Failed to fetch children: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Fetched children data:", data);

        if (data && data.length > 0) {
          setChildren(data);
          setSelectedChild(data[0]);
        } else {
          setChildren([]);
          setSelectedChild(null);
        }
      } catch (err) {
        console.error("Error in fetchChildren:", err);
        setChildren([]);
        setSelectedChild(null);
      }
    };

    fetchChildren();
  }, [donorId]);

  const filteredChildren = children.filter((child) =>
    child.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const callBackendAPI = async (donorId: string, studentId: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/donor/get_all_notifications/${donorId}/${studentId}`;
      console.log("Fetching notifications from:", apiUrl);

      const response = await fetch(apiUrl);

      console.log("Notifications response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Notifications API Error:", response.status, errorText);
        throw new Error(
          `Failed to fetch notifications: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      if (data && data.length > 0) {
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } else {
        console.log("No notifications found");
        setNotifications([]);
      }
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      return [];
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="h-screen bg-white pt-12 overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar - Children List */}
        <ResizablePanel defaultSize={40} minSize={35} maxSize={60}>
          <div className="h-full border-r border-gray-200 flex flex-col overflow-hidden">
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

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-2">
                {filteredChildren.length > 0 ? (
                  filteredChildren.map((child) => (
                    <Card
                      key={child.id}
                      className={`p-3 mb-2 cursor-pointer hover:bg-gray-50 transition-colors border-0 ${
                        selectedChild?.id === child.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={async () => {
                        setSelectedChild(child);
                        if (donorId) {
                          const fetched = await callBackendAPI(
                            donorId.toString(),
                            child.id.toString()
                          );
                          setNotifications(fetched);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                              {child.name
                                ? child.name.charAt(0).toUpperCase()
                                : "👤"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 truncate flex-1 mr-2">
                              {child.name ?? "Unknown"}
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {child.timestamp ?? ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                              {child.lastMessage ?? ""}
                            </p>
                            {child.unread > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full whitespace-nowrap">
                                {child.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Age {child.age ?? "?"} • {child.location ?? "?"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 mt-10">
                    No children linked to your account.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          {selectedChild ? (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {selectedChild?.name
                            ? selectedChild.name.charAt(0).toUpperCase()
                            : "👤"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {selectedChild?.name ?? "Unnamed"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedChild?.online
                          ? "Active now"
                          : `Age ${selectedChild?.age ?? "?"} • ${
                              selectedChild?.location ?? "?"
                            }`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 overflow-y-auto max-h-full">
                <div className="space-y-4 pb-4">
                  {notifications.map((n, i) => (
                    <div key={i} className="space-y-4">
                      {/* Journal Image - from student */}
                      <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md">
                          <div className="bg-gray-100 p-3 rounded-2xl">
                            <p className="text-sm text-gray-900 mb-2">
                              📝 New journal entry
                            </p>
                            {n.journal_image ? (
                              <img
                                src={n.journal_image}
                                alt="Journal entry"
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/placeholder-image.png";
                                }}
                              />
                            ) : (
                              <p className="text-sm text-gray-500">
                                No image available
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Journal Image
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Learning Report - also from student */}
                      <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md">
                          <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl">
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">
                                📊 Learning Progress Report
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                Overall Score:{" "}
                                {n.learning_report?.overall_score || "N/A"}/5
                              </p>
                            </div>

                            {n.learning_report?.progress_update && (
                              <div className="mb-3">
                                <p className="text-xs font-medium mb-1">
                                  Progress Update:
                                </p>
                                <p className="text-sm bg-gray-200 p-2 rounded">
                                  {n.learning_report.progress_update}
                                </p>
                              </div>
                            )}

                            {n.learning_report?.updated_report && (
                              <div className="mb-3">
                                <p className="text-xs font-medium mb-1">
                                  Teacher's Report:
                                </p>
                                <p className="text-sm bg-gray-200 p-2 rounded">
                                  {n.learning_report.updated_report}
                                </p>
                              </div>
                            )}

                            {n.learning_report?.scores && (
                              <details className="mb-3">
                                <summary className="text-xs font-medium cursor-pointer hover:text-gray-700">
                                  View Detailed Scores
                                </summary>
                                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                                  {Object.entries(n.learning_report.scores).map(
                                    ([skill, score]) => (
                                      <div
                                        key={skill}
                                        className="flex justify-between bg-gray-200 p-1 rounded"
                                      >
                                        <span className="truncate">
                                          {skill}:
                                        </span>
                                        <span className="font-medium">
                                          {String(score)}/5
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </details>
                            )}

                            <p className="text-xs text-gray-500 mt-1">
                              Learning Report
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder={`Message ${
                        selectedChild.name ?? "child"
                      }...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
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
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a child to view messages</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
