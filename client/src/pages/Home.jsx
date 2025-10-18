import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Code, Zap, PlayCircle, FileText, Eye, Brain, Bot, Sparkles } from "lucide-react";
import Spline from "@splinetool/react-spline";

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);
  const splineRef = useRef();

  const sections = useMemo(() => ["hero", "agentic-lab", "features"], []);

  useEffect(() => {
    sectionsRef.current = sections.map((id) => document.getElementById(id));
  }, [sections]);

  const scrollToSection = (sectionIndex) => {
    if (sectionIndex < 0 || sectionIndex >= sections.length) return;

    const targetSection = sectionsRef.current[sectionIndex];
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;

          if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            if (activeSection !== i) {
              setActiveSection(i);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  function onLoad() {
    console.log("Spline scene loaded");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-foreground scale-125"
                : "bg-muted-foreground hover:bg-foreground/75"
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center w-full">
        <Spline
          ref={splineRef}
          scene="chips.spline"
          onLoad={onLoad}
          className="absolute inset-0 w-full h-full z-0"
          style={{ background: "transparent" }}
        />
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-20 text-center">
          <h1 className="font-sora font-extrabold text-4xl md:text-7xl lg:text-8xl font-bold text-white tracking-wide drop-shadow-2xl mb-6">
            Experience the Difference
          </h1>
          <p className="text-xl md:text-4xl text-white/90 max-w-3xl mx-auto drop-shadow-lg mb-8">
            Build, Test & Deploy AI Agents Visually
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Eye className="w-5 h-5 mr-2" />
                Explore Agents
              </Button>
            </Link>
            <Link to="/composer">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Code className="w-5 h-5 mr-2" />
                Build Workflow
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Agentic AI Lab Section */}
      <section
        id="agentic-lab"
        className="min-h-screen flex items-center justify-center w-full bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="text-center mb-16">
            <Badge className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Agentic AI Lab
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Experience <span className="text-primary">Live AI Agents</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Interactive, cinematic web experience showcasing live, executable LangGraph-style
              workflows. Inspect, run, and compose agents in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link to="/catalog">
              <Card className="group p-6 border-2 hover:border-primary transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Agent Catalog</h3>
                <p className="text-muted-foreground text-sm">
                  Explore 8 core agent types with live demos and technical deep-dives
                </p>
              </Card>
            </Link>

            <Link to="/composer">
              <Card className="group p-6 border-2 hover:border-green-500 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Workflow Composer</h3>
                <p className="text-muted-foreground text-sm">
                  Drag & drop visual editor for building LangGraph-compatible workflows
                </p>
              </Card>
            </Link>

            <Link to="/playground">
              <Card className="group p-6 border-2 hover:border-purple-500 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                  <PlayCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Live Playground</h3>
                <p className="text-muted-foreground text-sm">
                  Execute workflows in real-time with live logs and performance metrics
                </p>
              </Card>
            </Link>

            <Link to="/stories">
              <Card className="group p-6 border-2 hover:border-orange-500 transition-all duration-300 cursor-pointer h-full">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Story Mode</h3>
                <p className="text-muted-foreground text-sm">
                  Cinematic narratives showing agents solving real-world problems
                </p>
              </Card>
            </Link>
          </div>

          <div className="text-center">
            <Link to="/catalog">
              <Button size="lg" className="mr-4">
                <Zap className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
            </Link>
            <Link to="/playground">
              <Button size="lg" variant="outline">
                <PlayCircle className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center justify-center w-full">
        <div className="max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why Choose <span className="text-primary">Agentic AI Lab</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The most comprehensive platform for building, testing, and deploying AI agents with
              visual workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">60+ AI Components</h3>
              <p className="text-muted-foreground">
                Comprehensive library of LLMs, agents, tools, and integrations from OpenAI,
                Anthropic, and more.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Visual Workflow Builder</h3>
              <p className="text-muted-foreground">
                Drag & drop interface for creating complex AI workflows without writing code.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Real-time Execution</h3>
              <p className="text-muted-foreground">
                Live execution with performance metrics, cost tracking, and detailed logging.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Agent Marketplace</h3>
              <p className="text-muted-foreground">
                Pre-built agents for customer support, research, content creation, and more.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Interactive Stories</h3>
              <p className="text-muted-foreground">
                Cinematic narratives showing real-world AI agent implementations and use cases.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">LangGraph Compatible</h3>
              <p className="text-muted-foreground">
                Export workflows as standard LangGraph format for seamless integration.
              </p>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Link to="/composer">
              <Button size="lg" className="mr-4">
                <Code className="w-5 h-5 mr-2" />
                Start Building
              </Button>
            </Link>
            <Link to="/stories">
              <Button size="lg" variant="outline">
                <FileText className="w-5 h-5 mr-2" />
                Watch Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
