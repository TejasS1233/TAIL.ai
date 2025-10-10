import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// COMPONENTS
import Navbar from "@/components/blocks/Navbar/Navbar";
import Footer from "@/components/Footer";
import ChatBotButton from "@/components/ChatBotButton";
import { Toaster } from "sonner";

// PAGES
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ContactPage from "@/pages/ContactUs";
import UserProfile from "@/pages/UserProfile";
import Dashboard from "@/pages/Dashboard";

// AGENTIC AI LAB PAGES
import AgentCatalog from "@/pages/AgentCatalog";
import WorkflowComposer from "@/pages/WorkflowComposer";
import Playground from "@/pages/Playground";
import StoryMode from "@/pages/StoryMode";

import NotificationPage from "./pages/NotificationPage";
import AboutPage from "./pages/AboutPage";
import ThreadsPage from "./pages/ThreadBoard";

const hiddenLayoutRoutes = ["/login", "/signup", "/dashboard"];

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = hiddenLayoutRoutes.includes(location.pathname);

  const noPaddingRoutes = ["/", "/composer", "/playground"];
  const addPadding = !hideLayout && !noPaddingRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" richColors />
      {!hideLayout && <Navbar />}
      <main className={`flex-1 ${addPadding ? "pt-24" : ""}`}>{children}</main>
      {!hideLayout && <Footer />}
      {!hideLayout && <ChatBotButton />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* AGENTIC AI LAB ROUTES */}
          <Route path="/catalog" element={<AgentCatalog />} />
          <Route path="/composer" element={<WorkflowComposer />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/stories" element={<StoryMode />} />

          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/community" element={<ThreadsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
