import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";
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

const seedUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    password: "password123",
    phone: "+91 9876543210",
    address: "Flat 304, Sunbeam Apartments, Sector 15, Near City Mall, MG Road, Mumbai",
    avatar: "https://i.pravatar.cc/300?u=priya.sharma@gmail.com",
    role: "citizen",
    citizenProfile: {
      _id: new mongoose.Types.ObjectId(),
      reportsSubmitted: 12,
      communityScore: 85,
      favorites: [],
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Rajesh Kumar Patel",
    email: "rajesh.patel@yahoo.com",
    password: "password123",
    phone: "+91 9876543211",
    address: "B-42, Green Valley Colony, Behind Central Hospital, Station Road, Delhi",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=rajesh.patel",
    role: "citizen",
    citizenProfile: {
      _id: new mongoose.Types.ObjectId(),
      reportsSubmitted: 18,
      communityScore: 92,
      favorites: [],
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Sneha Desai",
    email: "sneha.desai@hotmail.com",
    password: "password123",
    phone: "+91 9876543212",
    address: "Plot 15, Shanti Nagar, Near Government School, Linking Road, Pune",
    avatar: "https://avatar.iran.liara.run/public/girl?username=sneha",
    role: "citizen",
    citizenProfile: {
      _id: new mongoose.Types.ObjectId(),
      reportsSubmitted: 7,
      communityScore: 78,
      favorites: [],
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Arjun Singh Chauhan",
    email: "arjun.chauhan@gmail.com",
    password: "password123",
    phone: "+91 9876543213",
    address: "House No. 78, Vijay Nagar, Opposite Fire Station, Old City Area, Jaipur",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
    role: "citizen",
    citizenProfile: {
      _id: new mongoose.Types.ObjectId(),
      reportsSubmitted: 15,
      communityScore: 96,
      favorites: [],
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Meera Joshi",
    email: "meera.joshi@outlook.com",
    password: "password123",
    phone: "+91 9876543214",
    address: "Apartment 201, Skyline Heights, Near Metro Station, Business District, Bangalore",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=meera.joshi",
    role: "citizen",
    citizenProfile: {
      _id: new mongoose.Types.ObjectId(),
      reportsSubmitted: 9,
      communityScore: 88,
      favorites: [],
    },
  },
];

const seedDatabase = async () => {
  try {
    await User.deleteMany({ role: "citizen" });
    console.log("Existing citizen users cleared");

    const result = await User.insertMany(seedUsers);
    console.log(`${result.length} citizen users seeded successfully`);

    result.forEach((user) => {
      console.log(
        `User: ${user.fullname} - ID: ${user._id} - Reports: ${user.citizenProfile.reportsSubmitted}`
      );
    });
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
