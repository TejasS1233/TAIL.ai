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

const generateNearbyCoordinates = (baseLat, baseLng, index, isNear = true) => {
  if (isNear) {
    const displacement = 0.002 + (index % 5) * 0.001;
    const angle = (index * 36) % 360;
    const radians = (angle * Math.PI) / 180;

    const latDisplacement = displacement * Math.cos(radians);
    const lngDisplacement = displacement * Math.sin(radians);

    return [baseLng + lngDisplacement, baseLat + latDisplacement];
  } else {
    const scatteredLocations = [
      [72.8777, 19.076],
      [72.85, 19.1136],
      [72.82, 19.0544],
      [72.905, 19.1197],
      [72.9781, 19.2183],
      [72.8697, 19.235],
      [72.84, 19.1872],
      [72.87, 19.2094],
      [72.85, 19.1342],
      [72.875, 19.165],
    ];
    return scatteredLocations[index % scatteredLocations.length];
  }
};

const seedWorkers = [
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Vikram Singh",
    email: "vikram.singh@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543220",
    address: "Municipal Quarters Block A, Thane West, Mumbai",
    avatar: "https://i.pravatar.cc/300?u=vikram.singh",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 45,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 0, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Ramesh Kumar",
    email: "ramesh.kumar@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543221",
    address: "Staff Colony, Wagle Estate, Thane",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ramesh",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 32,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 1, true),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Sunil Patil",
    email: "sunil.patil@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543222",
    address: "Municipal Housing, Hiranandani Estate, Thane",
    avatar: "https://avatar.iran.liara.run/public/boy?username=sunil",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 28,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 2, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Deepak Sharma",
    email: "deepak.sharma@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543223",
    address: "Government Quarters, Ghodbunder Road, Thane",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male&u=deepak",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 51,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 3, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Ajay Jadhav",
    email: "ajay.jadhav@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543224",
    address: "Municipal Colony, Pokhran Road, Thane",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=ajay",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 38,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 4, true),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Mahesh Desai",
    email: "mahesh.desai@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543225",
    address: "Staff Quarters, Vartak Nagar, Thane",
    avatar: "https://robohash.org/mahesh?set=set1",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 42,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 5, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Ravi Gupta",
    email: "ravi.gupta@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543226",
    address: "Municipal Housing, Kopri Colony, Thane",
    avatar: "https://ui-avatars.com/api/?name=Ravi+Gupta&background=0D8ABC&color=fff",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 35,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 6, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Santosh Yadav",
    email: "santosh.yadav@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543227",
    address: "Government Colony, Kasarvadavali, Thane",
    avatar: "https://avatar.iran.liara.run/public/boy?username=santosh",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 29,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 7, true),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Anil Bhosle",
    email: "anil.bhosle@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543228",
    address: "Municipal Quarters, Teen Haath Naka, Thane",
    avatar: "https://i.pravatar.cc/300?u=anil.bhosle",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 47,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 8, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Ganesh Sawant",
    email: "ganesh.sawant@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543229",
    address: "Staff Colony, Majiwada, Thane",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ganesh",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 39,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 9, true),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Kiran Naik",
    email: "kiran.naik@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543230",
    address: "Municipal Quarters, Andheri East, Mumbai",
    avatar: "https://robohash.org/kiran?set=set2",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 55,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 0, false),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Prakash Jain",
    email: "prakash.jain@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543231",
    address: "Staff Colony, Bandra West, Mumbai",
    avatar: "https://ui-avatars.com/api/?name=Prakash+Jain&background=FF5733&color=fff",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 41,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 1, false),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Nitin Kulkarni",
    email: "nitin.kulkarni@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543232",
    address: "Government Housing, Powai, Mumbai",
    avatar: "https://avatar.iran.liara.run/public/boy?username=nitin",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 33,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 2, false),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Ashok Rane",
    email: "ashok.rane@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543233",
    address: "Municipal Colony, Kalyan East",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ashok",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 49,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 3, false),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Sachin Tambe",
    email: "sachin.tambe@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543234",
    address: "Staff Quarters, Borivali West, Mumbai",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male&u=sachin",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 37,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 4, false),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Rajesh Pawar",
    email: "rajesh.pawar@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543235",
    address: "Municipal Housing, Malad West, Mumbai",
    avatar: "https://i.pravatar.cc/300?u=rajesh.pawar",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 44,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 5, false),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Mohan Shinde",
    email: "mohan.shinde@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543236",
    address: "Government Quarters, Kandivali East, Mumbai",
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=mohan",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 52,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 6, false),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Sanjay Mhatre",
    email: "sanjay.mhatre@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543237",
    address: "Municipal Colony, Jogeshwari West, Mumbai",
    avatar: "https://robohash.org/sanjay?set=set3",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 31,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 7, false),
      },
      busy: true,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Vinod More",
    email: "vinod.more@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543238",
    address: "Staff Colony, Goregaon East, Mumbai",
    avatar: "https://ui-avatars.com/api/?name=Vinod+More&background=28A745&color=fff",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 46,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 8, false),
      },
      busy: false,
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    fullname: "Dilip Kadam",
    email: "dilip.kadam@municipal.gov.in",
    password: "worker123",
    phone: "+91 9876543239",
    address: "Municipal Quarters, Dombivli East",
    avatar: "https://avatar.iran.liara.run/public/boy?username=dilip",
    role: "worker",
    municipalWorkerProfile: {
      _id: new mongoose.Types.ObjectId(),
      department: "Infrastructure & Roads Department",
      tasksHandled: 40,
      location: {
        type: "Point",
        coordinates: generateNearbyCoordinates(19.064318, 72.836036, 9, false),
      },
      busy: false,
    },
  },
];

const seedDatabase = async () => {
  try {
    await User.deleteMany({ role: "worker" });
    console.log("Existing worker users cleared");

    const result = await User.insertMany(seedWorkers);
    console.log(`${result.length} municipal workers seeded successfully`);

    const nearWorkers = result.slice(0, 10);
    const scatteredWorkers = result.slice(10);

    console.log("\nWorkers near coordinates 19.064318, 72.836036:");
    nearWorkers.forEach((user) => {
      console.log(
        `${user.fullname} - Coordinates: [${user.municipalWorkerProfile.location.coordinates}] - Busy: ${user.municipalWorkerProfile.busy}`
      );
    });

    console.log("\nScattered workers across Mumbai:");
    scatteredWorkers.forEach((user) => {
      console.log(
        `${user.fullname} - Coordinates: [${user.municipalWorkerProfile.location.coordinates}] - Busy: ${user.municipalWorkerProfile.busy}`
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
