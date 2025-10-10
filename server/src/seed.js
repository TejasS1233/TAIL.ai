import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js"; // Adjust path if needed

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const seedWorkers = async () => {
  try {
    // Optional: remove previous workers to avoid duplicates
    await User.deleteMany({ role: "worker" });
    
    const workerData = [
      { fullname: "Rahul Sharma", email: "rahul.sharma@example.com", department: "Public Works" },
      { fullname: "Anjali Mehta", email: "anjali.mehta@example.com", department: "Sanitation" },
      {
        fullname: "Vikram Patel",
        email: "vikram.patel@example.com",
        department: "Parks & Recreation",
      },
      { fullname: "Priya Kapoor", email: "priya.kapoor@example.com", department: "Transport" },
      { fullname: "Arjun Reddy", email: "arjun.reddy@example.com", department: "Health & Safety" },
      { fullname: "Sneha Desai", email: "sneha.desai@example.com", department: "Education" },
      {
        fullname: "Rohit Malhotra",
        email: "rohit.malhotra@example.com",
        department: "Water Supply",
      },
      { fullname: "Kavita Joshi", email: "kavita.joshi@example.com", department: "Electricity" },
      { fullname: "Sameer Khan", email: "sameer.khan@example.com", department: "Fire Department" },
      {
        fullname: "Neha Gupta",
        email: "neha.gupta@example.com",
        department: "Housing & Urban Dev.",
      },
    ];

    const workers = workerData.map((w) => ({
      fullname: w.fullname,
      email: w.email,
      password: "Password123!", // will be hashed automatically
      role: "worker",
      municipalWorkerProfile: {
        department: w.department,
        tasksHandled: 0,
        busy: false,
        location: {
          type: "Point",
          coordinates: [72.85 + Math.random() * 0.01, 19.31 + Math.random() * 0.01],
        },
      },
    }));

    const createdWorkers = await User.insertMany(workers);
    console.log(`✅ ${createdWorkers.length} workers seeded successfully!`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding workers:", err);
    process.exit(1);
  }
};

seedWorkers();
