import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays, MapPin, TrendingUp, Users, Activity, Clock } from "lucide-react";
import { toast } from "sonner";

const Analytics = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    mostCommonArea: "",
    resolutionRate: 0,
    avgResolutionTime: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartConfig = {
    total: {
      label: "Total Reports",
      color: "#3b82f6",
    },
    resolved: {
      label: "Resolved Reports",
      color: "#10b981",
    },
    pending: {
      label: "Pending Reports",
      color: "#f59e0b",
    },
    reports: {
      label: "Reports",
      color: "#ef4444",
    },
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/reports/department", {
        params: { page: 1, limit: 1000 },
      });
      if (response.data.success) {
        const reportsData = response.data.data.reports;
        setReports(reportsData);
        processAnalytics(reportsData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data) => {
    const dailyMap = {};
    const resolvedMap = {};
    const locationMap = {};
    let resolvedCount = 0;
    let pendingCount = 0;

    data.forEach((report) => {
      const date = new Date(report.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      dailyMap[date] = (dailyMap[date] || 0) + 1;

      if (report.status === "resolved") {
        resolvedMap[date] = (resolvedMap[date] || 0) + 1;
        resolvedCount++;
      } else {
        pendingCount++;
      }

      let location = "Unknown Area";
      if (report.location) {
        if (typeof report.location === "string") {
          location = report.location.split(",")[0];
        } else if (report.location.address) {
          location = report.location.address.split(",")[0];
        } else if (report.location.coordinates) {
          location = `Area ${Math.floor(report.location.coordinates[1])},${Math.floor(report.location.coordinates[0])}`;
        }
      }

      locationMap[location] = (locationMap[location] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyMap).sort((a, b) => new Date(a) - new Date(b));

    const dailyChartData = sortedDates.slice(-14).map((date) => ({
      date,
      total: dailyMap[date] || 0,
      resolved: resolvedMap[date] || 0,
    }));

    const locationChartData = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, reports]) => ({ name, reports }));

    const mostCommonArea = Object.entries(locationMap).reduce((max, current) =>
      current[1] > max[1] ? current : max
    )[0];

    const resolutionRate = data.length > 0 ? (resolvedCount / data.length) * 100 : 0;

    setDailyData(dailyChartData);
    setLocationData(locationChartData);
    setStats({
      total: data.length,
      resolved: resolvedCount,
      pending: pendingCount,
      mostCommonArea,
      resolutionRate,
      avgResolutionTime: Math.floor(Math.random() * 5) + 2,
    });
  };

  useEffect(() => {
    if (user?.municipalOfficerProfile?.department) {
      fetchReports();
    }
  }, [user]);

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
              You need to be a municipal officer to access analytics.
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
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        className={`mb-8 text-center transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h1 className="text-3xl font-bold">{user.municipalOfficerProfile.department} Analytics</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Department performance insights and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          className={`bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 transition-all duration-800 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total Reports
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">All time submissions</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 transition-all duration-800 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              Resolved
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.resolved}
            </div>
            <Progress
              value={stats.resolutionRate}
              className="mt-2 bg-green-200 dark:bg-green-800"
            />
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              {stats.resolutionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 transition-all duration-800 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ animationDelay: "0.3s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {stats.pending}
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">Awaiting resolution</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 transition-all duration-800 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ animationDelay: "0.4s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Most Active Area
            </CardTitle>
            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold truncate text-purple-900 dark:text-purple-100">
              {stats.mostCommonArea}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Highest report volume</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          className={`transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "0.5s" }}
        >
          <CardHeader>
            <CardTitle>Daily Reports Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Total vs Resolved reports over time</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-60">
              <AreaChart accessibilityLayer data={dailyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="total"
                  type="natural"
                  fill="url(#fillTotal)"
                  fillOpacity={0.6}
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
                <Area
                  dataKey="resolved"
                  type="natural"
                  fill="url(#fillResolved)"
                  fillOpacity={0.6}
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "0.6s" }}
        >
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Resolved vs Pending reports</p>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={[
                    { name: "resolved", value: stats.resolved, fill: "#10b981" },
                    { name: "pending", value: stats.pending, fill: "#f59e0b" },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  stroke="#fff"
                >
                  {[
                    { name: "resolved", value: stats.resolved, fill: "#10b981" },
                    { name: "pending", value: stats.pending, fill: "#f59e0b" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Resolved ({stats.resolved})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Pending ({stats.pending})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card
        className={`transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ animationDelay: "0.7s" }}
      >
        <CardHeader>
          <CardTitle>Top Areas by Report Volume</CardTitle>
          <p className="text-sm text-muted-foreground">Areas generating the most reports</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart accessibilityLayer data={locationData} layout="horizontal">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={100}
              />
              <XAxis dataKey="reports" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
              <Bar
                dataKey="reports"
                fill="url(#colorBar)"
                radius={4}
                stroke="#fff"
                strokeWidth={1}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
