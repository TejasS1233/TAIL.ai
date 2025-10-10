import mongoose from "mongoose";
import { Report } from "../src/models/report.model.js";
import "dotenv/config";

export const DB_NAME = "SIH-2025";

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Tejas:Tejas@cluster0.wnuycfg.mongodb.net/${DB_NAME}`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const userIds = {
  priya: "68c8092930679411b69a3868",
  rajesh: "68c8092930679411b69a386a",
  sneha: "68c8092930679411b69a386c",
  arjun: "68c8092930679411b69a386e",
  meera: "68c8092930679411b69a3870",
};

const officerId = "68c80e0a110085d1996b8b9d";

const workerNames = {
  infrastructure: [
    "Vikram Singh",
    "Ramesh Kumar",
    "Sunil Patil",
    "Deepak Sharma",
    "Ajay Jadhav",
    "Mahesh Desai",
    "Ravi Gupta",
    "Santosh Yadav",
    "Anil Bhosle",
    "Ganesh Sawant",
  ],
  other: [
    "Rajesh Verma",
    "Amit Gupta",
    "Suresh Chand",
    "Pawan Kumar",
    "Rameshwar Dayal",
    "Kanhaiya Lal",
    "Ved Prakash",
    "Hari Kishan",
    "Chaman Lal",
    "Narendra Kumar",
  ],
};

const otherDepartmentReports = [
  {
    title: "Overflowing garbage bins creating health hazards",
    category: "garbage",
    priority: "high",
    status: "resolved",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Street light flickering throughout night disturbing residents",
    category: "streetlight",
    priority: "medium",
    status: "assigned",
    department: "Electrical/Power Department",
  },
  {
    title: "Water supply disruption in residential area for 3 days",
    category: "water",
    priority: "critical",
    status: "in_progress",
    department: "Water Supply Department",
  },
  {
    title: "Stray dogs attacking pedestrians near school area",
    category: "safety",
    priority: "high",
    status: "acknowledged",
    department: "Public Safety Department",
  },
  {
    title: "Traffic signal malfunctioning causing accidents",
    category: "safety",
    priority: "critical",
    status: "assigned",
    department: "Traffic & Transportation Department",
  },
  {
    title: "Industrial waste dumped in residential area",
    category: "garbage",
    priority: "critical",
    status: "submitted",
    department: "Environmental Department",
  },
  {
    title: "Sewage overflow flooding entire street",
    category: "garbage",
    priority: "critical",
    status: "resolved",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Power outage affecting entire neighborhood",
    category: "streetlight",
    priority: "high",
    status: "in_progress",
    department: "Electrical/Power Department",
  },
  {
    title: "Contaminated water supply causing illness",
    category: "water",
    priority: "critical",
    status: "assigned",
    department: "Water Supply Department",
  },
  {
    title: "Illegal parking blocking emergency vehicle access",
    category: "safety",
    priority: "high",
    status: "resolved",
    department: "Public Safety Department",
  },
  {
    title: "Bus stop completely damaged and unsafe",
    category: "safety",
    priority: "medium",
    status: "acknowledged",
    department: "Traffic & Transportation Department",
  },
  {
    title: "Air pollution from construction site exceeding limits",
    category: "safety",
    priority: "high",
    status: "submitted",
    department: "Environmental Department",
  },
  {
    title: "Garbage collection irregular for past two weeks",
    category: "garbage",
    priority: "medium",
    status: "assigned",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Street lights not working in crime prone area",
    category: "streetlight",
    priority: "critical",
    status: "resolved",
    department: "Electrical/Power Department",
  },
  {
    title: "Water pipe leakage causing wastage and flooding",
    category: "water",
    priority: "high",
    status: "in_progress",
    department: "Water Supply Department",
  },
  {
    title: "Open manhole without safety barriers endangering lives",
    category: "safety",
    priority: "critical",
    status: "assigned",
    department: "Public Safety Department",
  },
  {
    title: "Heavy vehicles using residential roads damaging infrastructure",
    category: "safety",
    priority: "medium",
    status: "acknowledged",
    department: "Traffic & Transportation Department",
  },
  {
    title: "Tree cutting without permission affecting environment",
    category: "safety",
    priority: "high",
    status: "submitted",
    department: "Environmental Department",
  },
  {
    title: "Blocked drainage causing mosquito breeding",
    category: "garbage",
    priority: "high",
    status: "resolved",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Electrical pole leaning dangerously over road",
    category: "streetlight",
    priority: "critical",
    status: "assigned",
    department: "Electrical/Power Department",
  },
  {
    title: "No water supply to slum area for weeks",
    category: "water",
    priority: "critical",
    status: "in_progress",
    department: "Water Supply Department",
  },
  {
    title: "Unsafe construction site without protective barriers",
    category: "safety",
    priority: "high",
    status: "acknowledged",
    department: "Public Safety Department",
  },
  {
    title: "Traffic congestion due to poor signal timing",
    category: "safety",
    priority: "medium",
    status: "submitted",
    department: "Traffic & Transportation Department",
  },
  {
    title: "Noise pollution from late night construction work",
    category: "safety",
    priority: "medium",
    status: "resolved",
    department: "Environmental Department",
  },
  {
    title: "Waste segregation not being followed by residents",
    category: "garbage",
    priority: "low",
    status: "assigned",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Transformer overloading causing frequent power cuts",
    category: "streetlight",
    priority: "high",
    status: "in_progress",
    department: "Electrical/Power Department",
  },
  {
    title: "Low water pressure affecting high rise buildings",
    category: "water",
    priority: "medium",
    status: "acknowledged",
    department: "Water Supply Department",
  },
  {
    title: "Missing speed breakers near hospital entrance",
    category: "safety",
    priority: "high",
    status: "submitted",
    department: "Public Safety Department",
  },
  {
    title: "Illegal vendors blocking pedestrian walkways",
    category: "safety",
    priority: "medium",
    status: "resolved",
    department: "Traffic & Transportation Department",
  },
  {
    title: "Chemical waste disposal in public drain",
    category: "garbage",
    priority: "critical",
    status: "assigned",
    department: "Environmental Department",
  },
  {
    title: "Public toilet in unhygienic condition spreading diseases",
    category: "garbage",
    priority: "high",
    status: "in_progress",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Street light causing light pollution affecting residents",
    category: "streetlight",
    priority: "low",
    status: "acknowledged",
    department: "Electrical/Power Department",
  },
  {
    title: "Water tanker not reaching remote areas regularly",
    category: "water",
    priority: "high",
    status: "submitted",
    department: "Water Supply Department",
  },
  {
    title: "Broken glass on playground endangering children",
    category: "safety",
    priority: "critical",
    status: "resolved",
    department: "Public Safety Department",
  },
  {
    title: "School zone lacks proper traffic signage",
    category: "safety",
    priority: "medium",
    status: "assigned",
    department: "Traffic & Transportation Department",
  },
  {
    title: "Dust pollution from construction affecting respiratory health",
    category: "safety",
    priority: "high",
    status: "in_progress",
    department: "Environmental Department",
  },
  {
    title: "Overflowing septic tank contaminating groundwater",
    category: "garbage",
    priority: "critical",
    status: "acknowledged",
    department: "Solid Waste & Sewerage Management Department",
  },
  {
    title: "Power cable hanging low posing electrocution risk",
    category: "streetlight",
    priority: "critical",
    status: "submitted",
    department: "Electrical/Power Department",
  },
  {
    title: "Burst water main disrupting traffic and flooding road",
    category: "water",
    priority: "critical",
    status: "resolved",
    department: "Water Supply Department",
  },
];

const locations = [
  [72.8777, 19.076],
  [72.85, 19.1136],
  [72.82, 19.0544],
  [77.209, 28.6139],
  [77.1025, 28.7041],
  [77.2273, 28.6692],
  [73.8567, 18.5204],
  [73.8478, 18.5292],
  [73.837, 18.5679],
  [75.7873, 26.9124],
  [75.8577, 26.9559],
  [75.7781, 26.8467],
  [77.5946, 12.9716],
  [77.6413, 12.9141],
  [77.5787, 13.0827],
  [72.836036, 19.064318],
  [72.837, 19.064],
  [72.835, 19.065],
  [72.836, 19.063],
  [72.837036, 19.064318],
  [72.835036, 19.064318],
  [72.836536, 19.064818],
  [72.835536, 19.063818],
  [72.836336, 19.064118],
];

const displaceCoordinates = (coords, index) => {
  const displacement = 0.0005 + (index % 8) * 0.0003;
  const angle = (index * 45) % 360;
  const radians = (angle * Math.PI) / 180;

  const latDisplacement = displacement * Math.cos(radians);
  const lonDisplacement = displacement * Math.sin(radians);

  return [coords[0] + lonDisplacement, coords[1] + latDisplacement];
};

const generateRandomDateInRange = (startDate, endDate, index) => {
  const totalReports = 39;
  const daysBetween = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const intervalDays = daysBetween / totalReports;

  const baseOffset = index * intervalDays;
  const randomOffset = (index % 7) * 0.3;

  return new Date(startDate.getTime() + (baseOffset + randomOffset) * 24 * 60 * 60 * 1000);
};

const generateReport = (citizenId, reportData, locationIndex, reportIndex) => {
  const startDate = new Date("2025-08-16T00:00:00.000Z");
  const endDate = new Date("2025-08-30T23:59:59.000Z");

  const submitDate = generateRandomDateInRange(startDate, endDate, reportIndex);
  const displacedCoords = displaceCoordinates(
    locations[locationIndex % locations.length],
    reportIndex
  );

  const history = [
    {
      _id: new mongoose.Types.ObjectId(),
      status: "submitted",
      updatedBy: citizenId,
      timestamp: submitDate,
      notes: "Report submitted",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      status: "acknowledged",
      updatedBy: officerId,
      timestamp: new Date(submitDate.getTime() + 30 * 60 * 1000),
      notes: `Assigned by AI to ${reportData.department} with ${(88 + (locationIndex % 10)).toFixed(1)}% confidence`,
    },
  ];

  if (
    reportData.status === "assigned" ||
    reportData.status === "in_progress" ||
    reportData.status === "resolved"
  ) {
    const workerName =
      reportData.department === "Infrastructure & Roads Department"
        ? workerNames.infrastructure[reportIndex % workerNames.infrastructure.length]
        : workerNames.other[reportIndex % workerNames.other.length];

    history.push({
      _id: new mongoose.Types.ObjectId(),
      status: "assigned",
      updatedBy: officerId,
      timestamp: new Date(submitDate.getTime() + 2 * 60 * 60 * 1000),
      notes: `Assigned to ${workerName} - ${reportData.title}`,
    });
  }

  if (reportData.status === "in_progress" || reportData.status === "resolved") {
    history.push({
      _id: new mongoose.Types.ObjectId(),
      status: "in_progress",
      updatedBy: officerId,
      timestamp: new Date(submitDate.getTime() + 6 * 60 * 60 * 1000),
      notes: "Work started on site",
    });
  }

  if (reportData.status === "resolved") {
    history.push({
      _id: new mongoose.Types.ObjectId(),
      status: "resolved",
      updatedBy: officerId,
      timestamp: new Date(submitDate.getTime() + 24 * 60 * 60 * 1000),
      notes: "Issue resolved successfully",
    });
  }

  const voteCount =
    reportData.priority === "critical"
      ? 15 + (locationIndex % 10)
      : reportData.priority === "high"
        ? 8 + (locationIndex % 8)
        : reportData.priority === "medium"
          ? 3 + (locationIndex % 5)
          : locationIndex % 3;

  return {
    _id: new mongoose.Types.ObjectId(),
    citizenId: citizenId,
    title: reportData.title,
    description: `Detailed description of ${reportData.title.toLowerCase()}. This issue requires immediate attention from the concerned department for proper assessment and resolution.`,
    images: [`https://picsum.photos/400/300?random=${locationIndex + 700}`],
    location: {
      type: "Point",
      coordinates: displacedCoords,
    },
    category: reportData.category,
    department: reportData.department,
    status: reportData.status,
    priority: reportData.priority,
    vote: voteCount,
    history: history,
    createdAt: submitDate,
    updatedAt: new Date(submitDate.getTime() + 24 * 60 * 60 * 1000),
  };
};

const allReports = [];
let reportIndex = 0;

const userReportCounts = [
  { user: "priya", count: 8 },
  { user: "rajesh", count: 10 },
  { user: "sneha", count: 7 },
  { user: "arjun", count: 8 },
  { user: "meera", count: 6 },
];

userReportCounts.forEach(({ user, count }) => {
  const userId = userIds[user];

  for (let i = 0; i < count; i++) {
    const reportData = otherDepartmentReports[reportIndex % otherDepartmentReports.length];

    allReports.push(generateReport(userId, reportData, reportIndex, reportIndex));
    reportIndex++;
  }
});

const seedDatabase = async () => {
  try {
    const result = await Report.insertMany(allReports);
    console.log(`${result.length} additional non-infrastructure reports seeded successfully`);

    const reportCounts = {};
    const departmentCounts = {};

    result.forEach((report) => {
      const citizenId = report.citizenId.toString();
      reportCounts[citizenId] = (reportCounts[citizenId] || 0) + 1;
      departmentCounts[report.department] = (departmentCounts[report.department] || 0) + 1;
    });

    console.log("\nAdditional reports by user:");
    Object.entries(reportCounts).forEach(([citizenId, count]) => {
      const userName = Object.keys(userIds).find((key) => userIds[key] === citizenId);
      console.log(`${userName}: ${count} reports`);
    });

    console.log("\nReports by department:");
    Object.entries(departmentCounts).forEach(([dept, count]) => {
      console.log(`${dept}: ${count} reports`);
    });

    console.log(`\nAll reports updated by officer: ${officerId}`);
    console.log("Reports spread over 2 weeks (Aug 16-30, 2025)");
    console.log("Multiple reports near coordinates: 19.064318, 72.836036");
    console.log("Mix of resolved and ongoing status");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
