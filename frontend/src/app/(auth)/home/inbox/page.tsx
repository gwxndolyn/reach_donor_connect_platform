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

type Child = {
  id: string | number;
  name?: string;
  age?: number;
  location?: string;
  unread?: number;
  timestamp?: string;
  lastMessage?: string;
  online?: boolean;
};

type NotificationItem = {
  journal_image?: string | null;
  learning_report?: {
    overall_score?: number | string;
    progress_update?: string;
    updated_report?: string;
    scores?: Record<string, number | string>;
  } | null;
};

export default function InboxPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [hasScrolledToRead, setHasScrolledToRead] = useState(false);

  // Initialize authentication and donorId
  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();
      const { data: AuthData, error: AuthError } =
        await supabase.auth.getUser();

      if (AuthError || !AuthData?.user) {
        console.error("Authentication error:", AuthError);
        window.location.href = "/login";
        return;
      }

      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donor/get_donor_id_by_supabase_id/${AuthData.user.id}`
        );

        if (resp.ok) {
          const donorData = await resp.json();
          // Expecting an array; take first row id
          const id = donorData?.[0]?.id;
          if (id !== undefined && id !== null) {
            setDonorId(String(id));
          } else {
            // Fallback to Supabase user id as string
            setDonorId(String(AuthData.user.id));
          }
        } else {
          // Fallback to Supabase user id as string
          setDonorId(String(AuthData.user.id));
        }
      } catch (e) {
        console.error("Error fetching donor ID:", e);
        setDonorId(String(AuthData.user.id));
      }
    };

    initAuth();
  }, []);

  // Fetch children for donor and attach unread counts
  useEffect(() => {
    const fetchChildren = async () => {
      if (!donorId) return;

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/donor/get_all_children/${donorId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Failed to fetch children:",
            response.status,
            errorText
          );
          setChildren([]);
          setSelectedChild(null);
          return;
        }

        const data: Child[] = await response.json();

        if (data && data.length > 0) {
          // Attach unread counts per child
          const withUnread = await Promise.all(
            data.map(async (child) => {
              try {
                const unreadResp = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/donor/unread_count/${donorId}/${child.id}`
                );

                if (!unreadResp.ok) {
                  return { ...child, unread: child.unread ?? 0 };
                }

                const unreadJson = await unreadResp.json();
                return {
                  ...child,
                  unread: Number(unreadJson.unread_count || 0),
                };
              } catch {
                return { ...child, unread: child.unread ?? 0 };
              }
            })
          );

          setChildren(withUnread);
          setSelectedChild(withUnread[0] ?? null);
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
    (child.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch notifications for a student
  const callBackendAPI = async (donorIdStr: string, studentIdStr: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/donor/get_all_notifications/${donorIdStr}/${studentIdStr}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Notifications API Error:", response.status, errorText);
        setNotifications([]);
        return [];
      }

      const data: NotificationItem[] = await response.json();
      setNotifications(data ?? []);
      return data ?? [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      return [];
    }
  };

  // Mark notifications as read for a student and update badge
  const markNotificationsAsRead = async (
    donorIdStr: string,
    studentIdStr: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donor/mark_notifications_read/${donorIdStr}/${studentIdStr}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) return;

      // Verify once from backend (optional)
      let newUnreadCount = 0;
      try {
        const unreadResp = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donor/unread_count/${donorIdStr}/${studentIdStr}`
        );
        if (unreadResp.ok) {
          const unreadJson = await unreadResp.json();
          newUnreadCount = Number(unreadJson.unread_count || 0);
        }
      } catch {
        // keep 0 if verification fails
      }

      setChildren((prev) =>
        prev.map((c) =>
          String(c.id) === String(studentIdStr)
            ? { ...c, unread: newUnreadCount }
            : c
        )
      );

      setSelectedChild((prev) =>
        prev && String(prev.id) === String(studentIdStr)
          ? { ...prev, unread: newUnreadCount }
          : prev
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Scroll handler: mark as read when user scrolls near bottom (once)
  const handleMessageScroll = async (
    e: React.UIEvent<HTMLDivElement, UIEvent>
  ) => {
    const el = e.currentTarget;
    const scrollPercentage = (el.scrollTop + el.clientHeight) / el.scrollHeight;

    // If user has scrolled past 30% of messages and hasn't triggered this before
    if (
      scrollPercentage > 0.3 &&
      !hasScrolledToRead &&
      selectedChild &&
      donorId
    ) {
      setHasScrolledToRead(true);
      await markNotificationsAsRead(String(donorId), String(selectedChild.id));
    }
  };

  // Reset the scroll-to-read flag when switching conversations
  useEffect(() => {
    setHasScrolledToRead(false);
  }, [selectedChild]);

  // Periodically refresh unread counts (every 30s)
  const refreshUnreadCounts = async () => {
    if (!donorId || children.length === 0) return;
    try {
      const updated = await Promise.all(
        children.map(async (child) => {
          try {
            const unreadResp = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/donor/unread_count/${donorId}/${child.id}`
            );
            if (!unreadResp.ok) return child;
            const json = await unreadResp.json();
            return { ...child, unread: Number(json.unread_count || 0) };
          } catch {
            return child;
          }
        })
      );
      setChildren(updated);
    } catch (e) {
      console.error("refreshUnreadCounts error:", e);
    }
  };

  useEffect(() => {
    if (!donorId) return;
    const id = setInterval(() => {
      // Only refresh if we already have children
      if (children.length > 0) refreshUnreadCounts();
    }, 30000);
    return () => clearInterval(id);
  }, [donorId, children.length]); // keep deps minimal to avoid churn

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] pt-28 bg-white dark:bg-gray-900">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar - Children List */}
        <ResizablePanel defaultSize={40} minSize={35} maxSize={60}>
          <div className="h-full border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search children..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-2">
                {filteredChildren.length > 0 ? (
                  filteredChildren.map((child) => (
                    <Card
                      key={String(child.id)}
                      className={`p-3 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-0 ${
                        selectedChild &&
                        String(selectedChild.id) === String(child.id)
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={async () => {
                        setSelectedChild(child);

                        // Optimistic: clear unread locally on open
                        setChildren((prev) =>
                          prev.map((c) =>
                            String(c.id) === String(child.id)
                              ? { ...c, unread: 0 }
                              : c
                          )
                        );

                        if (donorId) {
                          const fetched = await callBackendAPI(
                            String(donorId),
                            String(child.id)
                          );
                          setNotifications(fetched);

                          // Persist read state (no need to await for UX)
                          markNotificationsAsRead(
                            String(donorId),
                            String(child.id)
                          );
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
                            <p className="font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
                              {child.name ?? "Unknown"}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {child.timestamp ?? ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">
                              {child.lastMessage ?? ""}
                            </p>
                            {Number(child.unread) > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full whitespace-nowrap">
                                {Number(child.unread)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Age {child.age ?? "?"} • {child.location ?? "?"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
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
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
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
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {selectedChild?.name ?? "Unnamed"}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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

              {/* Messages */}
              <ScrollArea
                className="flex-1 h-0"
                onScrollCapture={handleMessageScroll}
              >
                <div className="p-4 space-y-4 pb-4">
                  {notifications.map((n, i) => (
                    <div key={i} className="space-y-4">
                      {/* Journal Image */}
                      <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md">
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                            <p className="text-sm text-gray-900 dark:text-white mb-2 font-bold">
                              📝 New journal entry
                            </p>
                            {n.journal_image ? (
                              <img
                                src={n.journal_image}
                                alt="Journal entry"
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/placeholder-image.png";
                                }}
                              />
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No image available
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Journal Entry Image
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Learning Report */}
                      <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md">
                          <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-4 rounded-2xl">
                            <div className="mb-3">
                              <p className="text-sm text-gray-900 dark:text-white mb-2 font-bold">
                                📊 Learning Progress Report
                              </p>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                Overall Score:{" "}
                                {n.learning_report?.overall_score ?? "N/A"}/5
                              </p>
                            </div>

                            {n.learning_report?.progress_update && (
                              <div className="mb-3">
                                <p className="text-xs font-medium mb-1">
                                  Progress Update:
                                </p>
                                <p className="text-sm bg-gray-200 dark:bg-gray-600 p-2 rounded">
                                  {n.learning_report.progress_update}
                                </p>
                              </div>
                            )}

                            {n.learning_report?.updated_report && (
                              <div className="mb-3">
                                <p className="text-xs font-medium mb-1">
                                  Teacher&apos;s Report:
                                </p>
                                <p className="text-sm bg-gray-200 dark:bg-gray-600 p-2 rounded">
                                  {n.learning_report.updated_report}
                                </p>
                              </div>
                            )}

                            {n.learning_report?.scores && (
                              <details className="mb-3">
                                <summary className="text-xs font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                  View Detailed Scores
                                </summary>
                                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                                  {Object.entries(n.learning_report.scores).map(
                                    ([skill, score]) => (
                                      <div
                                        key={skill}
                                        className="flex justify-between bg-gray-200 dark:bg-gray-600 p-1 rounded"
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

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Learning Report
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Composer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder={`Message ${
                        selectedChild.name ?? "child"
                      }...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                      className="pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full p-0"
                    >
                      <Heart className="h-4 w-4 text-gray-400 dark:text-gray-500" />
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
              <p className="text-gray-500 dark:text-gray-400">Select a child to view messages</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
