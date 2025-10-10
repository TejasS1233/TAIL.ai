import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Users,
  UserCheck,
  Clock,
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  TrendingUp,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const DashboardHome = () => {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    busy: 0,
    inactive: 0,
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    efficiency: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const statusColors = {
    active:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800",
    busy: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800",
    inactive:
      "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-950/50 dark:text-slate-200 dark:border-slate-800",
    offline:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800",
  };

  const chartConfig = {
    workers: {
      label: "Workers",
      color: "#3b82f6",
    },
    reports: {
      label: "Reports",
      color: "#ef4444",
    },
  };

  const fetchWorkers = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          role: "worker",
          department: user.municipalOfficerProfile.department,
          page: 1,
          limit: 100,
        },
      });

      if (response.data.success) {
        const workersData = response.data.data.users || [];
        setWorkers(workersData);
        setFilteredWorkers(workersData);
        return workersData;
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
      if (error.response?.status === 404) {
        toast.error("No workers found in your department");
        setWorkers([]);
        setFilteredWorkers([]);
      } else {
        toast.error("Failed to fetch workers data");
      }
      return [];
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get("/reports/department", {
        params: { page: 1, limit: 1000 },
      });
      if (response.data.success) {
        const reportsData = response.data.data.reports || [];
        setReports(reportsData);
        return reportsData;
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  };

  const calculateStats = (workersData, reportsData) => {
    const workerStats = {
      total: workersData.length,
      active: workersData.filter((w) => w.status === "active").length,
      busy: workersData.filter((w) => w.status === "busy").length,
      inactive: workersData.filter((w) => w.status === "inactive" || w.status === "offline").length,
    };

    const reportStats = {
      totalReports: reportsData.length,
      pendingReports: reportsData.filter((r) => r.status !== "resolved").length,
      resolvedReports: reportsData.filter((r) => r.status === "resolved").length,
    };

    const efficiency =
      reportStats.totalReports > 0
        ? (reportStats.resolvedReports / reportStats.totalReports) * 100
        : 0;

    setStats({
      ...workerStats,
      ...reportStats,
      efficiency,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [workersData, reportsData] = await Promise.all([fetchWorkers(), fetchReports()]);
      calculateStats(workersData, reportsData);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = workers;

    if (statusFilter !== "all") {
      filtered = filtered.filter((worker) => worker.status === statusFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.fullname?.toLowerCase().includes(search) ||
          worker.municipalWorkerProfile?.role?.toLowerCase().includes(search) ||
          worker.email?.toLowerCase().includes(search)
      );
    }

    setFilteredWorkers(filtered);
  };

  const handleStatusChange = async (workerId, newStatus) => {
    try {
      await axiosInstance.patch(`/users/${workerId}/status`, { status: newStatus });

      const updatedWorkers = workers.map((worker) =>
        worker._id === workerId ? { ...worker, status: newStatus } : worker
      );

      setWorkers(updatedWorkers);
      applyFilters();
      calculateStats(updatedWorkers, reports);
      toast.success("Worker status updated successfully");
    } catch (error) {
      console.error("Error updating worker status:", error);
      toast.error("Failed to update worker status");
    }
  };

  useEffect(() => {
    if (user?.municipalOfficerProfile?.department) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, workers]);

  if (!user?.municipalOfficerProfile) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You need to be a municipal officer to access the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const statusDistribution = [
    { name: "active", value: stats.active, fill: "#10b981" },
    { name: "busy", value: stats.busy, fill: "#f59e0b" },
    { name: "inactive", value: stats.inactive, fill: "#6b7280" },
  ];

  const performanceData = [
    { name: "Workers", active: stats.active, total: stats.total },
    { name: "Reports", resolved: stats.resolvedReports, pending: stats.pendingReports },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        className={`mb-8 text-center transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h1 className="text-3xl font-bold">{user.municipalOfficerProfile.department} Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your workforce and track department performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          className={`bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 transition-all duration-700 delay-75 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total Workers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
            <Progress
              value={stats.total > 0 ? (stats.active / stats.total) * 100 : 0}
              className="mt-2 bg-blue-200 dark:bg-blue-800"
            />
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% currently
              active
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 transition-all duration-700 delay-150 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Active Workers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {stats.active}
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Ready for assignments</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800 transition-all duration-700 delay-225 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Total Reports
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.totalReports}
            </div>
            <Progress value={stats.efficiency} className="mt-2 bg-orange-200 dark:bg-orange-800" />
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
              {stats.efficiency.toFixed(1)}% resolution rate
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800 transition-all duration-700 delay-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-800 dark:text-violet-200">
              Pending Reports
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              {stats.pendingReports}
            </div>
            <p className="text-xs text-violet-700 dark:text-violet-300">Awaiting resolution</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          className={`transition-all duration-700 delay-375 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader>
            <CardTitle>Worker Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Current workforce availability</p>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  stroke="#fff"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm">Active ({stats.active})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Busy ({stats.busy})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="text-sm">Inactive ({stats.inactive})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-700 delay-450 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Workers vs Reports handling</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-60">
              <BarChart accessibilityLayer data={performanceData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="active" fill="#10b981" radius={4} />
                <Bar dataKey="resolved" fill="#3b82f6" radius={4} />
                <Bar dataKey="total" fill="#e5e7eb" radius={4} />
                <Bar dataKey="pending" fill="#f59e0b" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card
        className={`mb-6 transition-all duration-700 delay-525 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-64 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`transition-all duration-700 delay-600 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <CardHeader>
          <CardTitle>Workers Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {filteredWorkers.length} of {workers.length} workers
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No workers found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkers.map((worker) => (
                  <TableRow key={worker._id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {worker.fullname?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{worker.fullname}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {worker._id.slice(-6)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {worker.municipalWorkerProfile?.role || "Worker"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {worker.municipalWorkerProfile?.specialization || "General"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {worker.email}
                      </div>
                      {worker.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {worker.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[worker.status] || statusColors.inactive}>
                        {worker.status?.charAt(0)?.toUpperCase() + worker.status?.slice(1) ||
                          "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {worker.lastActive
                        ? new Date(worker.lastActive).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(worker._id, "active")}
                          >
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(worker._id, "busy")}>
                            Set Busy
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(worker._id, "inactive")}
                          >
                            Set Inactive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
