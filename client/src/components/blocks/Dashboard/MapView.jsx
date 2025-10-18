import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/utils/useAuth";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
  FileText,
  Building2,
  Trash2,
  Droplets,
  Zap,
  Shield,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Map, MapStyle, config, Popup } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const MapView = () => {
  const { user } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const MAPTILER_API_KEY = "MMlTveHORtau8tdzlbhD";

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

  const statusColors = React.useMemo(()=>({
    submitted: "#3b82f6",
    acknowledged: "#eab308",
    assigned: "#8b5cf6",
    in_progress: "#f97316",
    resolved: "#10b981",
    rejected: "#ef4444",
  }),[]);

  const getCategoryColor = (category) => {
    const colors = {
      garbage: "#ef4444",
      pothole: "#f97316",
      streetlight: "#eab308",
      water: "#06b6d4",
      "public works": "#8b5cf6",
      safety: "#ef4444",
      other: "#6b7280",
    };
    return colors[category] || "#6b7280";
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

  const getCoordinates = (location) => {
    if (!location) return null;
    if (typeof location === "object" && location.coordinates) {
      return [location.coordinates[0], location.coordinates[1]];
    }
    return null;
  };


  const applyFilters = useCallback((reportsData) => {
    let filtered = reportsData;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((report) => report.category === selectedCategory);
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title?.toLowerCase().includes(search) ||
          report.description?.toLowerCase().includes(search) ||
          report.citizenId?.fullname?.toLowerCase().includes(search)
      );
    }
    const reportsWithCoords = filtered.filter((report) => {
      const coords = getCoordinates(report.location);
      return coords !== null;
    });
    console.log("Filtered reports with coordinates:", reportsWithCoords.length);
    setFilteredReports(reportsWithCoords);
  },[searchTerm, selectedCategory]);

  const createReportsGeoJSON = useCallback((reportsData) => {
    return {
      type: "FeatureCollection",
      features: reportsData
        .map((report) => {
          const coords = getCoordinates(report.location);
          if (!coords) return null;
          const [lng, lat] = coords;

          return {
            type: "Feature",
            properties: {
              reportId: report._id,
              title: report.title,
              description: report.description,
              category: report.category,
              status: report.status,
              citizenName: report.citizenId?.fullname || "Anonymous",
              createdAt: report.createdAt,
            },
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          };
        })
        .filter(Boolean),
    };
  },[]);

  const initializeMap = () => {
    if (map.current || !mapContainer.current) return;

    console.log("Initializing map...");

    config.apiKey = MAPTILER_API_KEY;

    map.current = new Map({
      container: mapContainer.current,
      style: MapStyle.STREETS,
      center: [72.836036, 19.064318],
      zoom: 15,
    });

    map.current.on("load", () => {
      console.log("Map loaded successfully");
      setMapReady(true);
    });

    map.current.on("error", (e) => {
      console.error("Map error:", e.error);
    });
  };

  const updateMapWithReports = useCallback(() => {
    if (!map.current || !mapReady || !filteredReports.length) return;

    console.log("Updating map with", filteredReports.length, "reports");

    if (map.current.getSource("reports")) {
      if (map.current.getLayer("clusters")) map.current.removeLayer("clusters");
      if (map.current.getLayer("cluster-count")) map.current.removeLayer("cluster-count");
      if (map.current.getLayer("unclustered-point")) map.current.removeLayer("unclustered-point");
      map.current.removeSource("reports");
    }

    map.current.addSource("reports", {
      type: "geojson",
      data: createReportsGeoJSON(filteredReports),
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.current.addLayer({
      id: "clusters",
      type: "circle",
      source: "reports",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#51bbd6", 10, "#f1f075", 25, "#f28cb1"],
        "circle-radius": ["step", ["get", "point_count"], 15, 10, 25, 25, 35],
      },
    });

    map.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "reports",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.current.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "reports",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": [
          "case",
          ["==", ["get", "status"], "submitted"],
          statusColors.submitted,
          ["==", ["get", "status"], "acknowledged"],
          statusColors.acknowledged,
          ["==", ["get", "status"], "assigned"],
          statusColors.assigned,
          ["==", ["get", "status"], "in_progress"],
          statusColors.in_progress,
          ["==", ["get", "status"], "resolved"],
          statusColors.resolved,
          ["==", ["get", "status"], "rejected"],
          statusColors.rejected,
          statusColors.submitted,
        ],
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.current.on("click", "clusters", async (e) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await map.current.getSource("reports").getClusterExpansionZoom(clusterId);
      map.current.easeTo({
        center: features[0].geometry.coordinates,
        zoom,
      });
    });

    map.current.on("click", "unclustered-point", (e) => {
      const coordinates = [...e.features[0].geometry.coordinates];
      const properties = e.features[0].properties;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new Popup()
        .setLngLat(coordinates)
        .setHTML(
          `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${properties.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${properties.description.substring(0, 100)}...</p>
            <div style="margin-bottom: 8px;">
              <span style="background: ${statusColors[properties.status]}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${properties.status}</span>
              <span style="background: ${getCategoryColor(properties.category)}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">${properties.category}</span>
            </div>
            <div style="font-size: 11px; color: #888;">
              <div>By: ${properties.citizenName}</div>
              <div>Date: ${new Date(properties.createdAt).toLocaleDateString()}</div>
            </div>
            <button 
              onclick="window.openReportModal('${properties.reportId}')"
              style="margin-top: 8px; background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;"
            >
              View Details
            </button>
          </div>
        `
        )
        .addTo(map.current);
    });

    map.current.on("mouseenter", "clusters", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", "clusters", () => {
      map.current.getCanvas().style.cursor = "";
    });

    map.current.on("mouseenter", "unclustered-point", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", "unclustered-point", () => {
      map.current.getCanvas().style.cursor = "";
    });
  },[mapReady, filteredReports,createReportsGeoJSON, statusColors]);

  const fetchReportDetails = async (reportId) => {
    try {
      const response = await axiosInstance.get(`/reports/${reportId}`);
      if (response.data.success) {
        setSelectedReport(response.data.data);
        setModalOpen(true);
      }
    } catch {
      toast.error("Failed to fetch report details");
    }
  };

  useEffect(() => {
    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapReady(false);
      }
    };
  }, []);

  useEffect(() => {
    if (user?.municipalOfficerProfile?.department) return;
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/reports/department");
        if (response.data.success) {
          const reportsData = response.data.data.reports;
          console.log("Fetched reports:", reportsData.length);
          setReports(reportsData);
          applyFilters(reportsData);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error(error.response?.data?.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user,applyFilters]);

  useEffect(() => {
    applyFilters(reports);
  }, [selectedCategory, searchTerm, reports,applyFilters]);

  useEffect(() => {
    if (mapReady) {
      updateMapWithReports();
    }
  }, [mapReady, filteredReports,updateMapWithReports]);

  useEffect(() => {
    window.openReportModal = fetchReportDetails;
    return () => {
      delete window.openReportModal;
    };
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (!user?.municipalOfficerProfile) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border">
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Access Denied</h3>
              <p className="text-muted-foreground text-lg">
                You need to be a municipal officer to access this dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold">
            {user.municipalOfficerProfile.department} Reports - Clustered Map View
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {loading
              ? "Loading reports..."
              : filteredReports.length === 0
                ? "No reports found"
                : "Click clusters to zoom in, click individual markers for details"}
          </p>
        </div>

        <Card>
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

        {filteredReports.length > 0 && (
          <div className="px-4 py-2 bg-muted/30 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredReports.length}</span> reports with
              location data
              {searchTerm && ` • Filtered by "${searchTerm}"`}
              {selectedCategory !== "all" && ` • ${selectedCategory} category`}
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="overflow-hidden flex-1">
            <CardContent className="p-0">
              <div
                ref={mapContainer}
                className="w-full h-[600px] relative"
                style={{ minHeight: "600px" }}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Loading reports...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {mapReady && (
            <Card className="lg:w-80">
              <CardHeader>
                <CardTitle className="text-lg">Map Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Cluster Colors</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#51bbd6]" />
                        <span className="text-sm">1-9 reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#f1f075]" />
                        <span className="text-sm">10-24 reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#f28cb1]" />
                        <span className="text-sm">25+ reports</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Status Colors</h4>
                    <div className="space-y-2">
                      {Object.entries(statusColors).map(([status, color]) => (
                        <div key={status} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm capitalize">{status.replace("_", " ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Details
              </DialogTitle>
              <DialogDescription>Complete report information from map view.</DialogDescription>
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
                    <h4 className="font-medium">Description</h4>
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <p className="leading-relaxed">{selectedReport.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      className="text-white"
                      style={{ backgroundColor: statusColors[selectedReport.status] }}
                    >
                      {selectedReport.status?.charAt(0).toUpperCase() +
                        selectedReport.status?.slice(1).replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      style={{ borderColor: getCategoryColor(selectedReport.category) }}
                    >
                      <span className="capitalize">{selectedReport.category}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MapView;
