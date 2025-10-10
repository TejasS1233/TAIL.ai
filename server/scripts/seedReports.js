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

const workerNames = [
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
];

const infrastructureReports = [
  {
    title: "Deep pothole on Highway causing severe vehicle damage",
    category: "pothole",
    priority: "critical",
    status: "assigned",
  },
  {
    title: "Broken footpath tiles creating major tripping hazards for pedestrians",
    category: "public works",
    priority: "medium",
    status: "in_progress",
  },
  {
    title: "Road surface cracks widening rapidly after monsoon season",
    category: "pothole",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Missing road divider causing frequent traffic accidents",
    category: "public works",
    priority: "critical",
    status: "submitted",
  },
  {
    title: "Uneven road surface severely damaging two-wheeler vehicles",
    category: "pothole",
    priority: "high",
    status: "acknowledged",
  },
  {
    title: "Broken manholes creating dangerous road hazards",
    category: "public works",
    priority: "critical",
    status: "assigned",
  },
  {
    title: "Incomplete footpath construction project stalled for months",
    category: "public works",
    priority: "medium",
    status: "in_progress",
  },
  {
    title: "Road lane markings completely faded and invisible",
    category: "public works",
    priority: "low",
    status: "submitted",
  },
  {
    title: "Damaged speed breakers causing vehicle suspension problems",
    category: "public works",
    priority: "medium",
    status: "resolved",
  },
  {
    title: "Large crater-like pothole disrupting traffic flow",
    category: "pothole",
    priority: "critical",
    status: "assigned",
  },
  {
    title: "Collapsed road shoulder endangering vehicle safety",
    category: "pothole",
    priority: "high",
    status: "in_progress",
  },
  {
    title: "Cracked concrete pavement with exposed rebar",
    category: "public works",
    priority: "critical",
    status: "acknowledged",
  },
  {
    title: "Waterlogged road section due to poor drainage design",
    category: "public works",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Broken concrete divider blocking emergency vehicle access",
    category: "public works",
    priority: "critical",
    status: "submitted",
  },
  {
    title: "Multiple small potholes forming chain damage pattern",
    category: "pothole",
    priority: "medium",
    status: "resolved",
  },
  {
    title: "Sunken road surface creating vehicle bottoming issues",
    category: "pothole",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Deteriorating asphalt surface with loose aggregate",
    category: "public works",
    priority: "medium",
    status: "acknowledged",
  },
  {
    title: "Raised manhole cover damaging vehicle undercarriage",
    category: "public works",
    priority: "high",
    status: "in_progress",
  },
  {
    title: "Edge pothole causing vehicles to veer into traffic",
    category: "pothole",
    priority: "critical",
    status: "assigned",
  },
  {
    title: "Incomplete road widening project creating traffic bottleneck",
    category: "public works",
    priority: "medium",
    status: "submitted",
  },
  {
    title: "Broken road surface exposing underlying utility pipes",
    category: "pothole",
    priority: "critical",
    status: "resolved",
  },
  {
    title: "Damaged pedestrian crossing with missing tactile indicators",
    category: "public works",
    priority: "low",
    status: "acknowledged",
  },
  {
    title: "Pothole cluster formation after utility excavation work",
    category: "pothole",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Crumbling road embankment threatening structural integrity",
    category: "public works",
    priority: "critical",
    status: "in_progress",
  },
  {
    title: "Unrepaired road cut from previous construction project",
    category: "public works",
    priority: "medium",
    status: "submitted",
  },
  {
    title: "Deep longitudinal crack running across entire road width",
    category: "pothole",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Missing road shoulder creating unsafe overtaking conditions",
    category: "public works",
    priority: "medium",
    status: "acknowledged",
  },
  {
    title: "Pothole formation at road-bridge junction causing alignment issues",
    category: "pothole",
    priority: "critical",
    status: "resolved",
  },
  {
    title: "Damaged road surface around storm water drain inlet",
    category: "public works",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Broken concrete median with sharp edges endangering motorists",
    category: "public works",
    priority: "critical",
    status: "submitted",
  },
  {
    title: "Subsided road section creating dangerous depression",
    category: "pothole",
    priority: "high",
    status: "in_progress",
  },
  {
    title: "Incomplete road resurfacing leaving uneven transition zones",
    category: "public works",
    priority: "medium",
    status: "acknowledged",
  },
  {
    title: "Multiple interconnected potholes forming road crater system",
    category: "pothole",
    priority: "critical",
    status: "assigned",
  },
  {
    title: "Damaged road surface from heavy vehicle overloading",
    category: "public works",
    priority: "high",
    status: "resolved",
  },
  {
    title: "Broken expansion joint in concrete road causing vehicle damage",
    category: "public works",
    priority: "medium",
    status: "submitted",
  },
  {
    title: "Edge deterioration causing road width reduction",
    category: "pothole",
    priority: "medium",
    status: "assigned",
  },
  {
    title: "Damaged pedestrian refuge island blocking traffic flow",
    category: "public works",
    priority: "low",
    status: "acknowledged",
  },
  {
    title: "Pothole formation around utility access covers",
    category: "pothole",
    priority: "high",
    status: "in_progress",
  },
  {
    title: "Cracked and broken road surface from tree root intrusion",
    category: "public works",
    priority: "medium",
    status: "assigned",
  },
  {
    title: "Incomplete road reconstruction leaving temporary surface patches",
    category: "public works",
    priority: "high",
    status: "submitted",
  },
  {
    title: "Large pothole formation at road intersection causing traffic delays",
    category: "pothole",
    priority: "critical",
    status: "resolved",
  },
  {
    title: "Damaged road surface from inadequate foundation preparation",
    category: "public works",
    priority: "high",
    status: "acknowledged",
  },
  {
    title: "Broken road kerb creating debris and safety hazards",
    category: "public works",
    priority: "medium",
    status: "assigned",
  },
  {
    title: "Pothole cluster near bus stop causing passenger safety issues",
    category: "pothole",
    priority: "high",
    status: "in_progress",
  },
  {
    title: "Damaged road surface around street light installation",
    category: "public works",
    priority: "low",
    status: "submitted",
  },
  {
    title: "Multiple small potholes expanding into major road damage",
    category: "pothole",
    priority: "medium",
    status: "assigned",
  },
  {
    title: "Broken road surface with exposed utility infrastructure",
    category: "public works",
    priority: "critical",
    status: "acknowledged",
  },
  {
    title: "Incomplete road marking project creating confusion for drivers",
    category: "public works",
    priority: "low",
    status: "resolved",
  },
  {
    title: "Deep pothole formation from poor quality road construction",
    category: "pothole",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Damaged road surface around traffic signal installation",
    category: "public works",
    priority: "medium",
    status: "submitted",
  },
  {
    title: "Broken concrete road slab creating vehicle alignment problems",
    category: "public works",
    priority: "high",
    status: "in_progress",
  },
  {
    title: "Pothole formation at road grade change causing vehicle scraping",
    category: "pothole",
    priority: "medium",
    status: "acknowledged",
  },
  {
    title: "Incomplete sidewalk construction leaving pedestrian hazards",
    category: "public works",
    priority: "low",
    status: "assigned",
  },
  {
    title: "Damaged road surface from repeated utility excavations",
    category: "public works",
    priority: "high",
    status: "resolved",
  },
  {
    title: "Large longitudinal pothole affecting entire traffic lane",
    category: "pothole",
    priority: "critical",
    status: "submitted",
  },
  {
    title: "Broken road surface around newly installed infrastructure",
    category: "public works",
    priority: "medium",
    status: "acknowledged",
  },
  {
    title: "Severe road deterioration near construction zone",
    category: "pothole",
    priority: "high",
    status: "assigned",
  },
  {
    title: "Damaged road markings causing lane confusion during peak hours",
    category: "public works",
    priority: "medium",
    status: "in_progress",
  },
  {
    title: "Deep pothole formation at major traffic intersection",
    category: "pothole",
    priority: "critical",
    status: "submitted",
  },
  {
    title: "Broken footpath creating accessibility issues for disabled persons",
    category: "public works",
    priority: "high",
    status: "acknowledged",
  },
  {
    title: "Road surface cracking due to substandard construction materials",
    category: "pothole",
    priority: "medium",
    status: "assigned",
  },
  {
    title: "Incomplete drainage system causing road surface damage",
    category: "public works",
    priority: "high",
    status: "resolved",
  },
  {
    title: "Multiple potholes creating hazardous driving conditions",
    category: "pothole",
    priority: "critical",
    status: "in_progress",
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
  const totalReports = 61;
  const daysBetween = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const intervalDays = daysBetween / totalReports;

  const baseOffset = index * intervalDays;
  const randomOffset = (index % 7) * 0.3;

  return new Date(startDate.getTime() + (baseOffset + randomOffset) * 24 * 60 * 60 * 1000);
};

const generateReport = (citizenId, reportData, locationIndex, reportIndex, workerIndex) => {
  const startDate = new Date("2025-08-01T00:00:00.000Z");
  const endDate = new Date("2025-08-15T23:59:59.000Z");

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
      notes: `Assigned by AI to Infrastructure & Roads Department with ${(88 + (locationIndex % 10)).toFixed(1)}% confidence`,
    },
  ];

  if (
    reportData.status === "assigned" ||
    reportData.status === "in_progress" ||
    reportData.status === "resolved"
  ) {
    const workerName = workerNames[workerIndex % workerNames.length];

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
      notes: "Infrastructure repair work started on site",
    });
  }

  if (reportData.status === "resolved") {
    history.push({
      _id: new mongoose.Types.ObjectId(),
      status: "resolved",
      updatedBy: officerId,
      timestamp: new Date(submitDate.getTime() + 24 * 60 * 60 * 1000),
      notes: "Road infrastructure issue resolved successfully",
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
    description: `Detailed description of ${reportData.title.toLowerCase()}. This infrastructure issue requires immediate attention from the Roads & Infrastructure Department for proper assessment and repair work.`,
    images: [`https://picsum.photos/400/300?random=${locationIndex + 500}`],
    location: {
      type: "Point",
      coordinates: displacedCoords,
    },
    category: reportData.category,
    department: "Infrastructure & Roads Department",
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
let workerIndex = 0;

const userReportCounts = {
  priya: 12,
  rajesh: 18,
  sneha: 7,
  arjun: 15,
  meera: 9,
};

Object.entries(userReportCounts).forEach(([user, count]) => {
  const userId = userIds[user];

  for (let i = 0; i < count; i++) {
    const reportData = infrastructureReports[reportIndex % infrastructureReports.length];

    allReports.push(generateReport(userId, reportData, reportIndex, reportIndex, workerIndex));

    reportIndex++;
    workerIndex++;
  }
});

const seedDatabase = async () => {
  try {
    await Report.deleteMany({});
    console.log("All existing reports deleted");

    const result = await Report.insertMany(allReports);
    console.log(`${result.length} Infrastructure & Roads Department reports seeded successfully`);

    const reportCounts = {};
    result.forEach((report) => {
      const citizenId = report.citizenId.toString();
      reportCounts[citizenId] = (reportCounts[citizenId] || 0) + 1;
    });

    console.log("\nReports by user:");
    Object.entries(reportCounts).forEach(([citizenId, count]) => {
      const userName = Object.keys(userIds).find((key) => userIds[key] === citizenId);
      console.log(`${userName}: ${count} reports`);
    });

    console.log(`\nAll reports updated by officer: ${officerId}`);
    console.log("Reports spread over 2 weeks with custom createdAt/updatedAt");
    console.log("Multiple reports near coordinates: 19.064318, 72.836036");
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
