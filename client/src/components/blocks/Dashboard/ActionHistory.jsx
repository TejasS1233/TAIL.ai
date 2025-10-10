import { useState, useEffect } from "react";
import {
  Clock,
  FileText,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axios";

export default function ActionHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await axiosInstance.get("/reports/user-history");

        if (response.data.success) {
          setHistoryData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch history data");
        }
      } catch (err) {
        console.error("Error fetching user history:", err);
        setError(err.response?.data?.message || err.message || "Failed to load action history");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "assigned":
        return <User className="h-4 w-4 text-yellow-600" />;
      case "acknowledged":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "resolved":
        return "success";
      case "rejected":
        return "destructive";
      case "in_progress":
        return "default";
      case "assigned":
        return "secondary";
      case "acknowledged":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading action history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-semibold">Error Loading History</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-xl font-semibold">No Action History</h2>
            <p className="text-muted-foreground mt-2">You haven't updated any reports yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Action History</h1>
        <Badge variant="secondary" className="text-sm">
          {historyData.length} total actions
        </Badge>
      </div>

      <div className="border rounded-lg">
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="min-w-[200px]">Report</TableHead>
                <TableHead className="min-w-[180px]">Citizen</TableHead>
                <TableHead className="w-[160px]">Timestamp</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item?.status)}
                      <Badge variant={getStatusVariant(item?.status)} className="text-xs">
                        {item?.status?.replace("_", " ")?.toUpperCase() || "UNKNOWN"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm" title={item?.report?.title}>
                        {item?.report?.title || "No Title"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {item?.report?.reportId?.slice(-8) || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {item?.report?.citizenId?.fullname || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item?.report?.citizenId?.email || "No Email"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">
                        {item?.timestamp ? formatDate(item.timestamp) : "Unknown Date"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm max-w-xs truncate" title={item?.notes}>
                      {item?.notes || "No notes provided"}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Showing all your report update actions
      </div>
    </div>
  );
}
