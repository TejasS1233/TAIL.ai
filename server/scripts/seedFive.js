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

const unassignedReports = [
  {
    title: "Large pothole blocking main highway traffic",
    category: "pothole",
    priority: "critical",
    citizenId: userIds.priya,
    coordinates: [72.836036, 19.064318],
  },
  {
    title: "Broken footpath tiles causing pedestrian injuries",
    category: "public works",
    priority: "high",
    citizenId: userIds.rajesh,
    coordinates: [72.835, 19.065],
  },
  {
    title: "Road surface completely deteriorated after monsoon",
    category: "pothole",
    priority: "critical",
    citizenId: userIds.sneha,
    coordinates: [72.837, 19.064],
  },
  {
    title: "Missing road divider creating accident risk",
    category: "public works",
    priority: "high",
    citizenId: userIds.arjun,
    coordinates: [72.836, 19.063],
  },
  {
    title: "Deep cracks in road surface expanding rapidly",
    category: "pothole",
    priority: "medium",
    citizenId: userIds.meera,
    coordinates: [72.837036, 19.064318],
  },
];

const nukeAndSeedUnassignedReports = async () => {
  try {
    await connectDB();

    // NUKE: Delete all existing reports
    const deleteResult = await Report.deleteMany({});
    console.log(`🗑️  NUKED: ${deleteResult.deletedCount} existing reports deleted`);

    // CREATE: Generate 5 unassigned reports
    const reportsToCreate = unassignedReports.map((reportData, index) => {
      const submitDate = new Date();
      submitDate.setDate(submitDate.getDate() - index); // Spread over last 5 days

      return {
        _id: new mongoose.Types.ObjectId(),
        citizenId: reportData.citizenId,
        title: reportData.title,
        description: `Detailed description of ${reportData.title.toLowerCase()}. This infrastructure issue requires immediate attention from the Roads & Infrastructure Department.`,
        images: [`https://picsum.photos/400/300?random=${index + 100}`],
        location: {
          type: "Point",
          coordinates: reportData.coordinates,
        },
        category: reportData.category,
        department: "Infrastructure & Roads Department",
        status: "submitted", // UNASSIGNED STATUS
        priority: reportData.priority,
        vote: Math.floor(Math.random() * 10) + 1,
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: "submitted",
            updatedBy: reportData.citizenId,
            timestamp: submitDate,
            notes: "Report submitted",
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: "acknowledged",
            updatedBy: officerId,
            timestamp: new Date(submitDate.getTime() + 30 * 60 * 1000),
            notes: `Assigned by AI to Infrastructure & Roads Department with ${(90 + Math.floor(Math.random() * 8)).toFixed(1)}% confidence`,
          },
        ],
        createdAt: submitDate,
        updatedAt: submitDate,
      };
    });

    // Insert the new reports
    const result = await Report.insertMany(reportsToCreate);
    console.log(
      `✅ CREATED: ${result.length} unassigned Infrastructure & Roads Department reports`
    );

    // Display summary
    console.log("\n📊 SUMMARY:");
    result.forEach((report, index) => {
      const citizenName = Object.keys(userIds).find(
        (key) => userIds[key] === report.citizenId.toString()
      );
      console.log(`${index + 1}. ${report.title}`);
      console.log(`   - Status: ${report.status} (UNASSIGNED)`);
      console.log(`   - Priority: ${report.priority}`);
      console.log(`   - Reported by: ${citizenName}`);
      console.log(`   - Location: [${report.location.coordinates}]`);
      console.log(`   - Department: ${report.department}\n`);
    });

    console.log("🎯 Ready for assignment testing!");
  } catch (error) {
    console.error("❌ Error during nuke and seed:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
nukeAndSeedUnassignedReports();
