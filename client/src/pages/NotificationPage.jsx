import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  X,
  AlertCircle,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationPage = () => {
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const notifications = [
    {
      _id: "1",
      type: "reportUpdate",
      message: "Your report about pothole on Main Street has been acknowledged by the authorities",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      relatedReportId: { title: "Pothole on Main Street", status: "acknowledged" },
    },
    {
      _id: "2",
      type: "assignment",
      message:
        "New report assigned to Infrastructure Department - Broken streetlight near Central Park",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      relatedReportId: { title: "Broken streetlight", status: "assigned" },
    },
    {
      _id: "3",
      type: "reminder",
      message: "Don't forget to follow up on your garbage collection report from last week",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      relatedReportId: { title: "Garbage collection issue", status: "in_progress" },
    },
    {
      _id: "4",
      type: "system",
      message: "Welcome to CivicReport, Omar Rakhe! Your account has been verified successfully",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      relatedReportId: null,
    },
    {
      _id: "5",
      type: "reportUpdate",
      message: "Your water leakage report has been resolved. Thank you for reporting!",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      relatedReportId: { title: "Water leakage on Oak Avenue", status: "resolved" },
    },
  ];

  const getNotificationIcon = (type) => {
    if (type === "reportUpdate") return <FileText className="w-5 h-5 text-blue-600" />;
    if (type === "assignment") return <AlertCircle className="w-5 h-5 text-orange-600" />;
    if (type === "reminder") return <Calendar className="w-5 h-5 text-yellow-600" />;
    if (type === "system") return <Settings className="w-5 h-5 text-gray-600" />;
    return <Bell className="w-5 h-5 text-muted-foreground" />;
  };

  const getTypeLabel = (type) => {
    if (type === "reportUpdate") return "Report Update";
    if (type === "assignment") return "Assignment";
    if (type === "reminder") return "Reminder";
    if (type === "system") return "System";
    return "Notification";
  };

  const getTypeBadgeVariant = (type) => {
    if (type === "reportUpdate") return "default";
    if (type === "assignment") return "destructive";
    if (type === "reminder") return "secondary";
    if (type === "system") return "outline";
    return "default";
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const t = new Date(timestamp);
    const diffMin = Math.floor((now - t) / (1000 * 60));
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const readMatch =
        filter === "all" || (filter === "read" && n.read) || (filter === "unread" && !n.read);
      const typeMatch = typeFilter === "all" || n.type === typeFilter;
      return readMatch && typeMatch;
    });
  }, [notifications, filter, typeFilter]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n._id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">Notifications</CardTitle>
                    <p className="text-muted-foreground">Welcome back, Omar Rakhe!</p>
                    {unreadCount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Button>
                    <Check className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Filters Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="read">Read Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="reportUpdate">Report Updates</SelectItem>
                      <SelectItem value="assignment">Assignments</SelectItem>
                      <SelectItem value="reminder">Reminders</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedNotifications.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedNotifications.length} selected
                    </span>
                    <Button variant="outline" size="sm">
                      <Check className="w-4 h-4 mr-2" />
                      Mark Read
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications List Card */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={
                    selectedNotifications.length === filteredNotifications.length &&
                    filteredNotifications.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[60vh]">
                {filteredNotifications.map((n, index) => (
                  <div key={n._id}>
                    <div
                      className={`p-4 hover:bg-muted/50 transition-colors ${
                        !n.read ? "bg-accent/20" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedNotifications.includes(n._id)}
                          onCheckedChange={() => handleSelectNotification(n._id)}
                          className="mt-1"
                        />
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={getTypeBadgeVariant(n.type)}>
                              {getTypeLabel(n.type)}
                            </Badge>
                            {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <p
                            className={`text-sm mb-2 ${
                              !n.read ? "font-medium text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {n.message}
                          </p>
                          {n?.relatedReportId && (
                            <div className="mb-2">
                              <Badge variant="outline" className="text-xs">
                                {n.relatedReportId.title} • {n.relatedReportId.status}
                              </Badge>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(n.createdAt)}
                            </span>
                            <div className="flex items-center space-x-1">
                              {!n.read && (
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < filteredNotifications.length - 1 && <Separator />}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
