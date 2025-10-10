import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { socket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ThumbsUp,
  ThumbsDown,
  Pin,
  PinOff,
  Plus,
  CheckCircle2,
  Hourglass,
  MessagesSquareIcon,
  MessageSquare,
  User,
  Upload,
  X,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOPICS = [
  { name: "General Discussion" },
  { name: "Announcements" },
  { name: "Help & Support" },
  { name: "Bug Reports" },
  { name: "Feature Requests" },
  { name: "Platform Feedback" },
];

export default function ThreadsPage() {
  const { user, isUserLoading } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [expandedThreads, setExpandedThreads] = useState(new Set());
  const [threadReplies, setThreadReplies] = useState({});
  const [replyForms, setReplyForms] = useState({});
  const [loadingReplies, setLoadingReplies] = useState(new Set());
  const [form, setForm] = useState({
    title: "",
    text: "",
    topic: "",
    image: null,
    imagePreview: "",
    tags: "",
  });

  const fetchThreads = async () => {
    if (isUserLoading) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get("/threads/with-replies-count");

      console.log("Fetch response:", res.data);

      let threadsData = res.data?.data?.threads || res.data?.data || [];

      if (typeof res.data?.message === "string" && res.data.message.includes("ObjectId")) {
        console.log("Threads are incorrectly in message field - fix your backend!");
        threadsData = [];
      }

      setThreads(Array.isArray(threadsData) ? threadsData : []);
    } catch (err) {
      console.error("Error fetching threads:", err);
      toast.error(err.response?.data?.message || "Failed to fetch threads");
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (threadId, page = 1) => {
    try {
      setLoadingReplies((prev) => new Set([...prev, threadId]));

      const res = await axiosInstance.get(
        `/threads/${threadId}/replies?page=${page}&limit=10&sortBy=createdAt&sortOrder=asc`
      );
      const repliesData = res.data?.data?.replies || [];
      const pagination = res.data?.data?.pagination || {};

      setThreadReplies((prev) => ({
        ...prev,
        [threadId]: {
          replies: page === 1 ? repliesData : [...(prev[threadId]?.replies || []), ...repliesData],
          pagination,
          currentPage: page,
        },
      }));
    } catch (err) {
      console.error("Error fetching replies:", err);
      toast.error("Failed to fetch replies");
    } finally {
      setLoadingReplies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(threadId);
        return newSet;
      });
    }
  };

  const toggleReplies = async (threadId) => {
    const isExpanded = expandedThreads.has(threadId);

    if (isExpanded) {
      setExpandedThreads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(threadId);
        return newSet;
      });
    } else {
      setExpandedThreads((prev) => new Set([...prev, threadId]));

      // Fetch replies if not already loaded
      if (!threadReplies[threadId]) {
        await fetchReplies(threadId);
      }
    }
  };

  const loadMoreReplies = async (threadId) => {
    const currentData = threadReplies[threadId];
    if (currentData && currentData.pagination.hasNextPage) {
      await fetchReplies(threadId, currentData.currentPage + 1);
    }
  };

  const handleImageSelect = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const handleReplyImageSelect = (file, threadId) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setReplyForms((prev) => ({
      ...prev,
      [threadId]: {
        ...prev[threadId],
        image: file,
        imagePreview: previewUrl,
      },
    }));
  };

  const handleImageRemove = () => {
    if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
  };

  const handleReplyImageRemove = (threadId) => {
    const currentForm = replyForms[threadId];
    if (currentForm?.imagePreview && currentForm.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(currentForm.imagePreview);
    }

    setReplyForms((prev) => ({
      ...prev,
      [threadId]: {
        ...prev[threadId],
        image: null,
        imagePreview: "",
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.text.trim() || !form.topic.trim()) {
      toast.error("Title, text, and topic are required");
      return;
    }

    if (!user) {
      toast.error("Please log in to create threads");
      return;
    }

    try {
      setSubmitting(true);

      const processedTags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("text", form.text.trim());
      formData.append("topic", form.topic.trim());
      if (form.image) {
        formData.append("image", form.image);
      }
      processedTags.forEach((tag) => formData.append("tags[]", tag));

      const tempThread = {
        _id: `temp-${Date.now()}`,
        title: form.title,
        text: form.text,
        topic: form.topic,
        imageUrl: form.imagePreview || undefined,
        tags: processedTags,
        userName: user.fullname || user.email,
        userId: user._id,
        userRole: user.role,
        likes: [],
        dislikes: [],
        pinned: false,
        status: "active",
        repliesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isTemporary: true,
      };

      setThreads((prev) => [tempThread, ...prev]);

      const res = await axiosInstance.post("/threads/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const createdThread = res.data?.data || res.data?.thread;
      if (createdThread) {
        setThreads((prev) =>
          prev.map((t) => (t._id === tempThread._id ? { ...createdThread, repliesCount: 0 } : t))
        );
      }

      toast.success("Thread created successfully");

      if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }

      setForm({
        title: "",
        text: "",
        topic: "",
        image: null,
        imagePreview: "",
        tags: "",
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating thread:", err);
      setThreads((prev) => prev.filter((t) => !t._id.startsWith("temp-")));
      toast.error(err.response?.data?.message || "Failed to create thread");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e, threadId) => {
    e.preventDefault();

    const replyForm = replyForms[threadId];
    if (!replyForm?.text?.trim()) {
      toast.error("Reply text is required");
      return;
    }

    if (!user) {
      toast.error("Please log in to reply");
      return;
    }

    try {
      const processedTags = replyForm.tags
        ? replyForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      const formData = new FormData();
      formData.append("text", replyForm.text.trim());
      if (replyForm.image) {
        formData.append("image", replyForm.image);
      }
      processedTags.forEach((tag) => formData.append("tags[]", tag));

      const res = await axiosInstance.post(`/threads/${threadId}/replies`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newReply = res.data?.data;
      if (newReply) {
        // Add reply to the replies list
        setThreadReplies((prev) => ({
          ...prev,
          [threadId]: {
            ...prev[threadId],
            replies: [...(prev[threadId]?.replies || []), newReply],
          },
        }));

        // Update replies count in threads
        setThreads((prev) =>
          prev.map((thread) =>
            thread._id === threadId
              ? { ...thread, repliesCount: (thread.repliesCount || 0) + 1 }
              : thread
          )
        );

        // Expand thread if not already expanded
        if (!expandedThreads.has(threadId)) {
          setExpandedThreads((prev) => new Set([...prev, threadId]));
        }
      }

      // Clean up reply form
      if (replyForm.imagePreview && replyForm.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(replyForm.imagePreview);
      }

      setReplyForms((prev) => {
        const newForms = { ...prev };
        delete newForms[threadId];
        return newForms;
      });

      toast.success("Reply posted successfully");
    } catch (err) {
      console.error("Error creating reply:", err);
      toast.error(err.response?.data?.message || "Failed to post reply");
    }
  };

  const toggleReplyForm = (threadId) => {
    setReplyForms((prev) => {
      if (prev[threadId]) {
        // Clean up image preview when closing
        if (prev[threadId].imagePreview && prev[threadId].imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(prev[threadId].imagePreview);
        }
        const newForms = { ...prev };
        delete newForms[threadId];
        return newForms;
      } else {
        return {
          ...prev,
          [threadId]: {
            text: "",
            tags: "",
            image: null,
            imagePreview: "",
          },
        };
      }
    });
  };

  const handleVote = async (threadId, voteType) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    // Optimistic update for both threads and replies
    const updateItem = (item) => {
      if (item._id === threadId) {
        const userId = user._id;
        let newLikes = [...(item.likes || [])];
        let newDislikes = [...(item.dislikes || [])];

        if (voteType === "like") {
          if (newLikes.includes(userId)) {
            newLikes = newLikes.filter((id) => id !== userId);
          } else {
            newLikes.push(userId);
            newDislikes = newDislikes.filter((id) => id !== userId);
          }
        } else {
          if (newDislikes.includes(userId)) {
            newDislikes = newDislikes.filter((id) => id !== userId);
          } else {
            newDislikes.push(userId);
            newLikes = newLikes.filter((id) => id !== userId);
          }
        }

        return { ...item, likes: newLikes, dislikes: newDislikes };
      }
      return item;
    };

    // Update threads
    setThreads((prev) => prev.map(updateItem));

    // Update replies
    setThreadReplies((prev) => {
      const newReplies = { ...prev };
      Object.keys(newReplies).forEach((parentId) => {
        newReplies[parentId] = {
          ...newReplies[parentId],
          replies: newReplies[parentId].replies.map(updateItem),
        };
      });
      return newReplies;
    });

    try {
      const endpoint = voteType === "like" ? "like" : "dislike";
      await axiosInstance.post(`/threads/${threadId}/${endpoint}`);
    } catch (err) {
      console.error(`Error ${voteType}ing thread:`, err);
      toast.error(`Failed to ${voteType} thread`);
      fetchThreads();
    }
  };

  const handlePin = async (threadId) => {
    if (!user || !["officer", "admin"].includes(user.role)) {
      toast.error("Only officers and admins can pin threads");
      return;
    }

    try {
      const res = await axiosInstance.post(`/threads/${threadId}/pin`);
      const updatedThread = res.data?.data;

      if (updatedThread) {
        setThreads((prev) =>
          prev.map((thread) =>
            thread._id === threadId
              ? { ...updatedThread, repliesCount: thread.repliesCount }
              : thread
          )
        );
        toast.success("Thread pinned successfully");
      }
    } catch (err) {
      console.error("Error pinning thread:", err);
      toast.error(err.response?.data?.message || "Failed to pin thread");
    }
  };

  const handleUnpin = async (threadId) => {
    if (!user || !["officer", "admin"].includes(user.role)) {
      toast.error("Only officers and admins can unpin threads");
      return;
    }

    try {
      const res = await axiosInstance.post(`/threads/${threadId}/unpin`);
      const updatedThread = res.data?.data;

      if (updatedThread) {
        setThreads((prev) =>
          prev.map((thread) =>
            thread._id === threadId
              ? { ...updatedThread, repliesCount: thread.repliesCount }
              : thread
          )
        );
        toast.success("Thread unpinned successfully");
      }
    } catch (err) {
      console.error("Error unpinning thread:", err);
      toast.error(err.response?.data?.message || "Failed to unpin thread");
    }
  };

  useEffect(() => {
    fetchThreads();

    // Socket listeners
    const handleNewThread = (newThread) => {
      console.log("New thread from socket:", newThread);

      setThreads((prev) => {
        const exists = prev.some((thread) => thread._id === newThread._id);
        if (exists) return prev;
        return [{ ...newThread, repliesCount: 0 }, ...prev];
      });

      if (user && newThread.userId !== user._id) {
        toast.success("New thread posted!");
      }
    };

    const handleNewReply = ({ reply, parentThreadId }) => {
      console.log("New reply from socket:", reply);

      // Add reply to replies list
      setThreadReplies((prev) => ({
        ...prev,
        [parentThreadId]: {
          ...prev[parentThreadId],
          replies: [...(prev[parentThreadId]?.replies || []), reply],
        },
      }));

      // Update replies count
      setThreads((prev) =>
        prev.map((thread) =>
          thread._id === parentThreadId
            ? { ...thread, repliesCount: (thread.repliesCount || 0) + 1 }
            : thread
        )
      );

      if (user && reply.userId !== user._id) {
        toast.success("New reply posted!");
      }
    };

    socket.on("new-thread", handleNewThread);
    socket.on("new-reply", handleNewReply);

    return () => {
      socket.off("new-thread", handleNewThread);
      socket.off("new-reply", handleNewReply);
    };
  }, [user, isUserLoading]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
      Object.values(replyForms).forEach((form) => {
        if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(form.imagePreview);
        }
      });
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBadgeVariant = (topicName) => {
    const topicColors = {
      "General Discussion": "secondary",
      Announcements: "default",
      "Help & Support": "outline",
      "Bug Reports": "destructive",
      "Feature Requests": "secondary",
      "Platform Feedback": "outline",
    };
    return topicColors[topicName] || "secondary";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "in progress":
        return <Hourglass size={16} className="text-blue-500" />;
      case "completed":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "pending review":
        return <MessagesSquareIcon size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const filteredThreads =
    selectedTopic === "All" ? threads : threads.filter((thread) => thread.topic === selectedTopic);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 font-sans antialiased">
      <Toaster position="top-center" richColors />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community Discussions</h1>
            <p className="text-muted-foreground mt-1">
              Browse and join discussions on various topics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus size={16} className="mr-2" />
                Start a New Thread
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="shadow-lg p-6 h-fit sticky top-28">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold">Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <Button
                  onClick={() => setSelectedTopic("All")}
                  variant={selectedTopic === "All" ? "default" : "secondary"}
                  className="w-full justify-start"
                >
                  All Topics
                </Button>
                {TOPICS.map((topic, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedTopic(topic.name)}
                    variant={selectedTopic === topic.name ? "default" : "secondary"}
                    className="w-full justify-start"
                  >
                    {topic.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {selectedTopic === "All" ? "All Threads" : selectedTopic}
            </h2>

            {/* Create Thread Form */}
            <AnimatePresence>
              {showCreateForm && user && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Create a New Thread</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Thread Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter your thread title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="text">Description</Label>
                          <Textarea
                            id="text"
                            placeholder="What's on your mind?"
                            value={form.text}
                            onChange={(e) => setForm({ ...form, text: e.target.value })}
                            required
                            disabled={submitting}
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="topic">Topic</Label>
                          <Select
                            value={form.topic}
                            onValueChange={(value) => setForm({ ...form, topic: value })}
                            required
                            disabled={submitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                              {TOPICS.map((topic, index) => (
                                <SelectItem key={index} value={topic.name}>
                                  {topic.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-2">
                          <Label>Image (optional)</Label>
                          {!form.imagePreview ? (
                            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                              <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop an image or click to browse
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) handleImageSelect(file);
                                }}
                                disabled={submitting}
                                className="hidden"
                                id="image-upload"
                              />
                              <Button asChild variant="outline" size="sm" disabled={submitting}>
                                <label htmlFor="image-upload" className="cursor-pointer">
                                  Choose Image
                                </label>
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">
                                Max size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
                              </p>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={form.imagePreview}
                                alt="Preview"
                                className="max-w-full h-32 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleImageRemove}
                                className="absolute top-2 right-2"
                                disabled={submitting}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (optional)</Label>
                          <Input
                            id="tags"
                            placeholder="Enter tags separated by commas"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                            disabled={submitting}
                          />
                        </div>

                        <Separator />

                        <div className="flex gap-2">
                          <Button type="submit" disabled={submitting}>
                            {submitting ? "Posting..." : "Post Thread"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowCreateForm(false);
                              if (form.imagePreview && form.imagePreview.startsWith("blob:")) {
                                URL.revokeObjectURL(form.imagePreview);
                              }
                              setForm({
                                title: "",
                                text: "",
                                topic: "",
                                image: null,
                                imagePreview: "",
                                tags: "",
                              });
                            }}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Threads List */}
            {loading || isUserLoading ? (
              <div className="p-6 text-center text-muted-foreground">Loading threads...</div>
            ) : (
              <AnimatePresence>
                {filteredThreads.length > 0 ? (
                  filteredThreads.map((thread) => (
                    <motion.div
                      key={thread._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className={`shadow-lg ${thread.pinned ? "ring-2 ring-primary" : ""} ${
                          thread.isTemporary ? "border-dashed border-primary/50" : ""
                        }`}
                      >
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                          <div className="flex items-center gap-2">
                            {thread.pinned && <Pin className="h-4 w-4 text-primary" />}
                            {getStatusIcon(thread.status)}
                            <h3 className="text-lg font-semibold leading-none">{thread.title}</h3>
                          </div>
                          <Badge variant={getBadgeVariant(thread.topic)}>{thread.topic}</Badge>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">{thread.text}</p>

                          {thread.imageUrl && (
                            <img
                              src={thread.imageUrl}
                              alt="Thread attachment"
                              className="max-w-full h-auto rounded-lg border"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}

                          {thread.tags && thread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {thread.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {thread.userName?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                Posted by{" "}
                                <span className="font-medium text-foreground">
                                  {thread.userName}
                                </span>
                                {thread.userRole && (
                                  <Badge variant="secondary" className="ml-2 text-xs capitalize">
                                    {thread.userRole}
                                  </Badge>
                                )}
                              </span>
                              {thread.createdAt && (
                                <span className="ml-2">• {formatDate(thread.createdAt)}</span>
                              )}
                              {thread.isTemporary && (
                                <Badge variant="outline" className="ml-2 text-primary">
                                  Posting...
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Action Bar */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {user && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleVote(thread._id, "like")}
                                    className="flex items-center gap-1 hover:text-primary"
                                  >
                                    <ThumbsUp size={16} />
                                    <span>{thread.likes?.length || 0}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleVote(thread._id, "dislike")}
                                    className="flex items-center gap-1 hover:text-destructive"
                                  >
                                    <ThumbsDown size={16} />
                                    <span>{thread.dislikes?.length || 0}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleReplyForm(thread._id)}
                                    className="flex items-center gap-1"
                                  >
                                    <Reply size={14} />
                                    Reply
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleReplies(thread._id)}
                                className="flex items-center gap-1"
                              >
                                <MessageSquare size={14} />
                                {thread.repliesCount || 0} Replies
                                {expandedThreads.has(thread._id) ? (
                                  <ChevronUp size={14} />
                                ) : (
                                  <ChevronDown size={14} />
                                )}
                              </Button>
                            </div>

                            {user && ["officer", "admin"].includes(user.role) && (
                              <div className="flex items-center space-x-2">
                                {thread.pinned ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUnpin(thread._id)}
                                    className="flex items-center gap-1 text-primary"
                                  >
                                    <PinOff size={14} />
                                    Unpin
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePin(thread._id)}
                                    className="flex items-center gap-1"
                                  >
                                    <Pin size={14} />
                                    Pin
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Reply Form */}
                          <AnimatePresence>
                            {user && replyForms[thread._id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Card className="bg-muted/50">
                                  <CardContent className="p-4">
                                    <form
                                      onSubmit={(e) => handleReplySubmit(e, thread._id)}
                                      className="space-y-4"
                                    >
                                      <div className="space-y-2">
                                        <Label htmlFor={`reply-text-${thread._id}`}>
                                          Your Reply
                                        </Label>
                                        <Textarea
                                          id={`reply-text-${thread._id}`}
                                          placeholder="Write your reply..."
                                          value={replyForms[thread._id]?.text || ""}
                                          onChange={(e) =>
                                            setReplyForms((prev) => ({
                                              ...prev,
                                              [thread._id]: {
                                                ...prev[thread._id],
                                                text: e.target.value,
                                              },
                                            }))
                                          }
                                          required
                                          rows={3}
                                        />
                                      </div>

                                      {/* Reply Image Upload */}
                                      <div className="space-y-2">
                                        <Label>Image (optional)</Label>
                                        {!replyForms[thread._id]?.imagePreview ? (
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) handleReplyImageSelect(file, thread._id);
                                              }}
                                              className="hidden"
                                              id={`reply-image-upload-${thread._id}`}
                                            />
                                            <Button asChild variant="outline" size="sm">
                                              <label
                                                htmlFor={`reply-image-upload-${thread._id}`}
                                                className="cursor-pointer"
                                              >
                                                <Upload size={12} className="mr-2" />
                                                Add Image
                                              </label>
                                            </Button>
                                          </div>
                                        ) : (
                                          <div className="relative">
                                            <img
                                              src={replyForms[thread._id].imagePreview}
                                              alt="Reply Preview"
                                              className="max-w-full h-20 object-cover rounded border"
                                            />
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="sm"
                                              onClick={() => handleReplyImageRemove(thread._id)}
                                              className="absolute top-1 right-1 h-6 w-6 p-0"
                                            >
                                              <X size={10} />
                                            </Button>
                                          </div>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor={`reply-tags-${thread._id}`}>
                                          Tags (optional)
                                        </Label>
                                        <Input
                                          id={`reply-tags-${thread._id}`}
                                          placeholder="Enter tags separated by commas"
                                          value={replyForms[thread._id]?.tags || ""}
                                          onChange={(e) =>
                                            setReplyForms((prev) => ({
                                              ...prev,
                                              [thread._id]: {
                                                ...prev[thread._id],
                                                tags: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <Button type="submit" size="sm">
                                          Post Reply
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => toggleReplyForm(thread._id)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </form>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Replies Section */}
                          <AnimatePresence>
                            {expandedThreads.has(thread._id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                {loadingReplies.has(thread._id) ? (
                                  <div className="p-4 text-center text-muted-foreground">
                                    Loading replies...
                                  </div>
                                ) : threadReplies[thread._id]?.replies?.length > 0 ? (
                                  <>
                                    <div className="border-l-2 border-muted-foreground/20 pl-4 space-y-4">
                                      {threadReplies[thread._id].replies.map((reply) => (
                                        <Card
                                          key={reply._id}
                                          className="bg-muted/30 border-l-4 border-l-primary/20"
                                        >
                                          <CardContent className="p-4 space-y-3">
                                            <p className="text-sm">{reply.text}</p>

                                            {reply.imageUrl && (
                                              <img
                                                src={reply.imageUrl}
                                                alt="Reply attachment"
                                                className="max-w-full h-auto rounded border"
                                                onError={(e) => {
                                                  e.target.style.display = "none";
                                                }}
                                              />
                                            )}

                                            {reply.tags && reply.tags.length > 0 && (
                                              <div className="flex flex-wrap gap-1">
                                                {reply.tags.map((tag, index) => (
                                                  <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs"
                                                  >
                                                    #{tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                              <div className="flex items-center gap-2">
                                                <Avatar className="h-5 w-5">
                                                  <AvatarFallback className="text-xs">
                                                    {reply.userName?.charAt(0)?.toUpperCase() ||
                                                      "U"}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <span>
                                                  <span className="font-medium text-foreground">
                                                    {reply.userName}
                                                  </span>
                                                  {reply.userRole && (
                                                    <Badge
                                                      variant="secondary"
                                                      className="ml-1 text-xs capitalize"
                                                    >
                                                      {reply.userRole}
                                                    </Badge>
                                                  )}
                                                </span>
                                                {reply.createdAt && (
                                                  <span>• {formatDate(reply.createdAt)}</span>
                                                )}
                                              </div>

                                              {user && (
                                                <div className="flex items-center space-x-3">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleVote(reply._id, "like")}
                                                    className="flex items-center gap-1 hover:text-primary h-6 px-2"
                                                  >
                                                    <ThumbsUp size={12} />
                                                    <span>{reply.likes?.length || 0}</span>
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleVote(reply._id, "dislike")}
                                                    className="flex items-center gap-1 hover:text-destructive h-6 px-2"
                                                  >
                                                    <ThumbsDown size={12} />
                                                    <span>{reply.dislikes?.length || 0}</span>
                                                  </Button>
                                                </div>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>

                                    {/* Load More Replies Button */}
                                    {threadReplies[thread._id]?.pagination?.hasNextPage && (
                                      <div className="text-center">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => loadMoreReplies(thread._id)}
                                          disabled={loadingReplies.has(thread._id)}
                                        >
                                          {loadingReplies.has(thread._id)
                                            ? "Loading..."
                                            : "Load More Replies"}
                                        </Button>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <Card className="bg-muted/30">
                                    <CardContent className="p-4 text-center text-muted-foreground text-sm">
                                      No replies yet. Be the first to reply!
                                    </CardContent>
                                  </Card>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No threads found for this topic. Be the first to post!
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
