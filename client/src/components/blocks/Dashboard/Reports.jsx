import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import {
  Loader2,
  Search,
  FileText,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  ChevronRight,
  Eye,
  UserCheck,
  Activity,
  Bot,
  Languages,
  X,
  Brain,
  Building2,
  Users,
  Trash2,
  Droplets,
  Zap,
  Shield,
  Wrench,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [assigningReport, setAssigningReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiAssessing, setAiAssessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
    resolutionRate: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { value: "all", label: "All Categories", icon: <Building2 className="h-4 w-4" /> },
    { value: "garbage", label: "Garbage", icon: <Trash2 className="h-4 w-4" /> },
    { value: "pothole", label: "Pothole", icon: <MapPin className="h-4 w-4" /> },
    { value: "streetlight", label: "Street Light", icon: <Zap className="h-4 w-4" /> },
    { value: "water", label: "Water", icon: <Droplets className="h-4 w-4" /> },
    { value: "public works", label: "Public Works", icon: <Wrench className="h-4 w-4" /> },
    { value: "safety", label: "Safety", icon: <Shield className="h-4 w-4" /> },
    { value: "other", label: "Other", icon: <FileText className="h-4 w-4" /> },
  ];

  const statusColors = {
    submitted:
      "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:border-sky-800",
    acknowledged:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800",
    assigned:
      "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800",
    in_progress:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800",
    resolved:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800",
    rejected:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800",
  };

  const statusIcons = {
    submitted: Clock,
    acknowledged: AlertCircle,
    assigned: UserCheck,
    in_progress: Activity,
    resolved: CheckCircle,
    rejected: AlertCircle,
  };

  const chartConfig = {
    reports: {
      label: "Reports",
      color: "#3b82f6",
    },
    resolved: {
      label: "Resolved",
      color: "#10b981",
    },
    pending: {
      label: "Pending",
      color: "#f59e0b",
    },
  };

  const aiAssessmentSteps = [
    "Initializing AI model...",
    "Scanning report content...",
    "Analyzing issue severity...",
    "Cross-referencing historical data...",
    "Evaluating resource requirements...",
    "Generating priority score...",
    "Checking department capacity...",
    "Finalizing assessment...",
  ];

  const calculateStats = (reportsData) => {
    const total = reportsData.length;
    const resolved = reportsData.filter((r) => r.status === "resolved").length;
    const inProgress = reportsData.filter((r) => r.status === "in_progress").length;
    const pending = total - resolved - inProgress;
    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

    setStats({
      total,
      resolved,
      pending,
      inProgress,
      resolutionRate,
    });
  };

  const formatLocation = (location) => {
    if (!location) return null;
    if (typeof location === "string") return location;
    if (typeof location === "object" && location.coordinates) {
      return `${location.coordinates[1]}, ${location.coordinates[0]}`;
    }
    if (location.address) return location.address;
    return "Location provided";
  };

  const fetchReportDetails = async (reportId) => {
    try {
      const response = await axiosInstance.get(`/reports/${reportId}`);
      if (response.data.success) {
        setSelectedReport(response.data.data);
        setModalOpen(true);
        setShowTranslation(false);
        setNearbyWorkers([]);
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast.error("Failed to fetch report details");
    }
  };

  const translateToHindi = () => {
    setShowTranslation(true);
    const mockTranslation =
      "यह एक नमूना अनुवाद है। वास्तविक ऐप में, यह रिपोर्ट की सामग्री का हिंदी में अनुवाद होगा।";
    setTranslatedText(mockTranslation);
    toast.success("Translated to Hindi");
  };

  const startAiAssessment = () => {
    setAiAssessing(true);
    setAiProgress(0);
    setCurrentStep(aiAssessmentSteps[0]);
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < aiAssessmentSteps.length) {
        setCurrentStep(aiAssessmentSteps[stepIndex]);
        setAiProgress((stepIndex / aiAssessmentSteps.length) * 100);
      } else {
        clearInterval(interval);
        setAiProgress(100);
        setTimeout(() => {
          setAiAssessing(false);
          toast.success("AI Assessment Completed", {
            description: "Report has been analyzed and prioritized",
          });
        }, 1000);
      }
    }, 2500);
  };

  const handleAssignReport = async (reportId, workerId, assignmentNotes = "") => {
    setAssigningReport(workerId);
    try {
      const requestBody = {
        staffId: workerId,
        notes:
          assignmentNotes || `Assigned via Officer Dashboard on ${new Date().toLocaleDateString()}`,
      };
      const response = await axiosInstance.patch(`/reports/${reportId}/assign`, requestBody);
      if (response.data.success) {
        const updatedReport = response.data.data;
        toast.success(`Report assigned successfully!`);
        setReports((prevReports) =>
          prevReports.map((report) => (report._id === updatedReport._id ? updatedReport : report))
        );
        calculateStats(
          reports.map((report) => (report._id === updatedReport._id ? updatedReport : report))
        );
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error assigning report:", error);
      toast.error(error.response?.data?.message || "Failed to assign report.");
    } finally {
      setAssigningReport(null);
    }
  };

  const fetchNearbyWorkers = async (reportId) => {
    if (!reportId) {
      toast.error("Cannot find workers without a report ID.");
      return;
    }
    setWorkersLoading(true);
    try {
      const response = await axiosInstance.get(`/users/nearby/${reportId}`);
      if (response.data.success) {
        const workers = response.data.data.workers;
        setNearbyWorkers(workers);
        toast.success(`Found ${workers.length} workers nearby.`);
      }
    } catch (error) {
      console.error("Error fetching nearby workers:", error);
      toast.error(error.response?.data?.message || "Failed to find nearby workers.");
    } finally {
      setWorkersLoading(false);
    }
  };

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/reports/department`, {
        params: {
          page,
          limit: 10,
          category: selectedCategory === "all" ? "" : selectedCategory,
          search: searchTerm,
        },
      });
      if (response.data.success) {
        const reportsData = response.data.data.reports;
        setReports(reportsData);
        setPagination(response.data.data.pagination);
        calculateStats(reportsData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.municipalOfficerProfile?.department) {
      fetchReports(currentPage);
    }
  }, [currentPage, user, searchTerm, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!user?.municipalOfficerProfile) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You need to be a municipal officer to access this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusDistribution = [
    { name: "resolved", value: stats.resolved, fill: "#10b981" },
    { name: "pending", value: stats.pending, fill: "#f59e0b" },
    { name: "in_progress", value: stats.inProgress, fill: "#f97316" },
  ];

  const categoryData = categories
    .filter((cat) => cat.value !== "all")
    .map((cat) => ({
      name: cat.label,
      reports: reports.filter((r) => r.category === cat.value).length,
    }))
    .filter((item) => item.reports > 0)
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 6);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        className={`mb-8 text-center transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h1 className="text-3xl font-bold">{user.municipalOfficerProfile.department} Reports</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Monitor and manage department reports with intelligent insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          className={`bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 transition-all duration-700 delay-75 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-800 dark:text-sky-200">
              Total Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-900 dark:text-sky-100">{stats.total}</div>
            <p className="text-xs text-sky-700 dark:text-sky-300">All submissions</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 transition-all duration-700 delay-150 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {stats.resolved}
            </div>
            <Progress
              value={stats.resolutionRate}
              className="mt-2 bg-emerald-200 dark:bg-emerald-800"
            />
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2">
              {stats.resolutionRate.toFixed(1)}% resolution rate
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800 transition-all duration-700 delay-225 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              In Progress
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.inProgress}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 transition-all duration-700 delay-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {stats.pending}
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      <Card
        className={`mb-6 transition-all duration-700 delay-375 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-64 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        {category.icon}
                        {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {pagination.totalReports > 0 && (
        <div
          className={`px-4 py-3 bg-muted/30 rounded-lg border mb-6 transition-all duration-700 delay-450 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{reports.length}</span> of{" "}
              <span className="font-medium">{pagination.totalReports}</span> reports
              {searchTerm && ` • Filtered by "${searchTerm}"`}
              {selectedCategory !== "all" && ` • ${selectedCategory} category`}
            </p>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stats.resolutionRate.toFixed(1)}%</span>
              <span className="text-sm text-muted-foreground">resolved</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  <p className="text-muted-foreground">Loading reports...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Reports Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== "all"
                    ? "No reports match your current filters"
                    : "No reports found for your department"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => {
            const StatusIcon = statusIcons[report.status] || Clock;
            const locationText = formatLocation(report.location);
            return (
              <Card
                key={report._id}
                className={`hover:shadow-md transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ animationDelay: `${525 + index * 75}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold mb-2 truncate">
                        {report.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{report.citizenId?.fullname || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        {locationText && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate max-w-32">{locationText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusColors[report.status] || statusColors.submitted}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {report.status
                          ? report.status.charAt(0).toUpperCase() +
                            report.status.slice(1).replace("_", " ")
                          : "Submitted"}
                      </Badge>
                      <Badge variant="outline">
                        {categories.find((cat) => cat.value === report.category)?.icon}
                        <span className="ml-1 capitalize">{report.category}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{report.description}</p>
                  {report.assignee && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Assigned to:</span>
                        <span className="ml-2 text-muted-foreground">
                          {report.assignee.fullname}
                        </span>
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => fetchReportDetails(report._id)}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = Math.max(
                  1,
                  Math.min(pagination.totalPages - 4, currentPage - 2) + i
                );
                if (pageNumber > pagination.totalPages) return null;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Analysis & Management
            </DialogTitle>
            <DialogDescription>
              Comprehensive report details with AI-powered insights and worker assignment tools.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedReport.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{selectedReport.citizenId?.fullname || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{formatLocation(selectedReport.location) || "No location"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Description</h4>
                    <Button variant="outline" size="sm" onClick={translateToHindi}>
                      <Languages className="h-4 w-4 mr-1" />
                      Hindi
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="leading-relaxed">{selectedReport.description}</p>
                  </div>
                  {showTranslation && translatedText && (
                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <h5 className="font-medium mb-2">हिंदी अनुवाद:</h5>
                      <p className="text-muted-foreground leading-relaxed">{translatedText}</p>
                    </div>
                  )}
                </div>
              </div>

              {aiAssessing && (
                <div className="p-6 bg-gradient-to-r from-sky-50 to-violet-50 dark:from-sky-950/20 dark:to-violet-950/20 rounded-lg border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-semibold">AI Analysis in Progress</h4>
                      <p className="text-sm text-muted-foreground">{currentStep}</p>
                    </div>
                  </div>
                  <Progress value={aiProgress} className="h-3 mb-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processing...</span>
                    <span>{Math.round(aiProgress)}%</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Worker Assignment
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fetchNearbyWorkers(selectedReport._id)}
                    disabled={workersLoading}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {workersLoading ? "Searching..." : "Find Nearby Workers"}
                  </Button>
                  <Button onClick={startAiAssessment} disabled={aiAssessing}>
                    <Brain className="h-4 w-4 mr-2" />
                    {aiAssessing ? "Analyzing..." : "AI Analyze"}
                  </Button>
                </div>

                {workersLoading && (
                  <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading available workers...</span>
                  </div>
                )}

                {!workersLoading && nearbyWorkers.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h5 className="font-semibold flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Available Workers ({nearbyWorkers.length})
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {nearbyWorkers.map((worker) => (
                        <Card key={worker._id} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {worker.fullname?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{worker.fullname}</p>
                                <p className="text-xs text-muted-foreground">
                                  {worker.workerProfile?.role || "Field Worker"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{worker.distance.toFixed(2)} km</p>
                              <p className="text-xs text-muted-foreground">away</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full text-xs"
                            onClick={() => {
                              const notes = prompt("Add optional assignment notes:");
                              handleAssignReport(selectedReport._id, worker._id, notes);
                            }}
                            disabled={assigningReport === worker._id}
                          >
                            {assigningReport === worker._id ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <UserCheck className="h-3 w-3 mr-2" />
                            )}
                            {assigningReport === worker._id ? "Assigning..." : "Assign Report"}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={aiAssessing}
                  className="flex-1 sm:flex-none"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
