import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Eye,
  Code,
  BookOpen,
  Clock,
  Users,
  Lightbulb,
} from "lucide-react";

const stories = [
  {
    id: "customer-support",
    title: "AI Customer Support Revolution",
    description: "How a multi-agent system transformed customer service",
    duration: "8 min",
    difficulty: "Beginner",
    agents: ["Retrieval", "Reasoning", "Tool-Using"],
    scenario: "E-commerce company reduces response time by 90%",
    chapters: [
      {
        title: "The Challenge",
        content:
          "MegaStore receives 10,000+ customer inquiries daily. Response times average 24 hours.",
        visual: "problem-visualization",
      },
      {
        title: "Agent Architecture",
        content:
          "Deploy a retrieval agent for knowledge base, reasoning agent for complex queries, and tool agent for actions.",
        visual: "agent-flow",
      },
      {
        title: "Live Execution",
        content: "Watch as a customer query flows through the agent pipeline in real-time.",
        visual: "execution-demo",
      },
      {
        title: "Results",
        content:
          "Response time drops to 2.4 minutes with 94% accuracy. Customer satisfaction up 40%.",
        visual: "metrics-dashboard",
      },
    ],
  },
  {
    id: "research-assistant",
    title: "The Research Assistant That Never Sleeps",
    description: "Autonomous agent conducts literature review and synthesis",
    duration: "12 min",
    difficulty: "Advanced",
    agents: ["Autonomous", "Retrieval", "Creative"],
    scenario: "PhD student completes literature review in 2 hours vs 2 weeks",
    chapters: [
      {
        title: "Research Challenge",
        content: "PhD student needs comprehensive literature review on 'AI Safety in Healthcare'",
        visual: "research-scope",
      },
      {
        title: "Agent Planning",
        content: "Autonomous agent breaks down research into subtasks and creates execution plan",
        visual: "planning-tree",
      },
      {
        title: "Knowledge Gathering",
        content:
          "Retrieval agents search multiple databases, filter relevant papers, extract key insights",
        visual: "knowledge-web",
      },
      {
        title: "Synthesis & Output",
        content:
          "Creative agent synthesizes findings into structured literature review with citations",
        visual: "synthesis-process",
      },
    ],
  },
  {
    id: "creative-campaign",
    title: "Creative Campaign Generator",
    description: "Multi-agent team creates marketing campaign from brief to execution",
    duration: "10 min",
    difficulty: "Intermediate",
    agents: ["Creative", "Multi-Agent", "Safety"],
    scenario: "Marketing team generates complete campaign in 30 minutes",
    chapters: [
      {
        title: "Campaign Brief",
        content: "Launch campaign for eco-friendly sneakers targeting Gen Z consumers",
        visual: "brief-analysis",
      },
      {
        title: "Agent Collaboration",
        content: "Creative agents brainstorm, strategist agent plans, safety agent reviews content",
        visual: "collaboration-flow",
      },
      {
        title: "Content Generation",
        content: "Parallel generation of copy, visuals, social media posts, and video scripts",
        visual: "content-creation",
      },
      {
        title: "Campaign Delivery",
        content: "Complete campaign package with brand guidelines and execution timeline",
        visual: "final-deliverable",
      },
    ],
  },
];

export default function StoryMode() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStorySelect = (story) => {
    setSelectedStory(story);
    setCurrentChapter(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextChapter = () => {
    if (selectedStory && currentChapter < selectedStory.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  if (selectedStory) {
    const chapter = selectedStory.chapters[currentChapter];

    return (
      <div className="min-h-screen bg-background">
        {/* Story Player */}
        <div className="relative">
          {/* Video/Animation Area */}
          <div className="h-96 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
            <motion.div
              key={currentChapter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-4">{chapter.title}</h2>
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-16 h-16 bg-white/30 rounded-full animate-pulse" />
              </div>
              <p className="text-lg max-w-2xl mx-auto">{chapter.content}</p>
            </motion.div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevChapter}
                disabled={currentChapter === 0}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextChapter}
                disabled={currentChapter === selectedStory.chapters.length - 1}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-white/30 mx-2" />

              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 left-4 text-white hover:bg-white/20"
          >
            ← Back to Stories
          </Button>
        </div>

        {/* Story Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">{selectedStory.title}</h1>
                  <Badge variant="outline">
                    Chapter {currentChapter + 1} of {selectedStory.chapters.length}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-6">{selectedStory.description}</p>

                {/* Chapter Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>
                      {Math.round(((currentChapter + 1) / selectedStory.chapters.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentChapter + 1) / selectedStory.chapters.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Interactive Elements */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    View Code
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Inspect Flow
                  </Button>
                </div>
              </Card>

              {/* Technical Deep Dive */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-600"># Agent Configuration</div>
                  <div className="text-blue-600">retrieval_agent = RetrievalAgent(</div>
                  <div className="ml-4 text-gray-600">vector_db="pinecone",</div>
                  <div className="ml-4 text-gray-600">embedding_model="text-embedding-ada-002"</div>
                  <div className="text-blue-600">)</div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Story Info */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Story Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{selectedStory.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <Badge variant="outline">{selectedStory.difficulty}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-2">Agents Used:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedStory.agents.map((agent) => (
                        <Badge key={agent} variant="secondary" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Chapter Navigation */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Chapters</h3>
                <div className="space-y-2">
                  {selectedStory.chapters.map((chap, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentChapter(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentChapter
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium text-sm">{chap.title}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Story <span className="text-primary">Mode</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience cinematic narratives of AI agents solving real-world problems. Interactive
            walkthroughs with technical deep-dives and live demonstrations.
          </p>
        </motion.div>

        {/* Story Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-6 h-full cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handleStorySelect(story)}
              >
                {/* Story Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{story.title}</h3>
                  <Badge variant="outline">{story.difficulty}</Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{story.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {story.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {story.agents.length} agents
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="w-4 h-4" />
                    {story.scenario}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {story.agents.map((agent) => (
                    <Badge key={agent} variant="secondary" className="text-xs">
                      {agent}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full group-hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Story
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
