import React from "react";
import { Download, BadgeCheck } from "lucide-react";
import { useTheme } from "@/utils/useTheme";

export default function App() {
  const { theme } = useTheme();

  const images = {
    light: {
      playstore: "/GetOnGooglePlay.png",
      home: "/FlutterHome.jpg",
      dashboard: "/WorkerDashboard.jpg",
    },
    dark: {
      playstore: "/GetOnGooglePlay.png",
      home: "/FlutterHomeDark.jpg",
      dashboard: "/WorkerDashboardDark.jpg",
    },
  };

  const currentImages = theme === "dark" ? images.dark : images.light;

  return (
    <div className="bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-16 lg:py-20">
          <div className="order-2 flex flex-col space-y-6 md:order-1">
            <div>
              <h1 className="mb-3 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                Your community, <span className="text-primary">improved</span> with every report
              </h1>
              <p className="text-muted-foreground text-base md:pr-10 md:text-lg">
                Report civic issues like potholes and broken streetlights with ease. Our app
                connects citizens directly with local government for faster resolution, making your
                city a better place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://drive.google.com/uc?export=download&id=12rDaHwUf93h_OmDFDF_02PznwyHPjhsj"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 rounded-md px-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download App
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 rounded-md px-6 border bg-background hover:bg-accent hover:text-accent-foreground"
              >
                See How It Works
              </a>
            </div>
            <div className="flex flex-col space-y-4 pt-4">
              <h3 className="text-sm font-medium">Why communities love our system:</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="text-primary h-4 w-4" />
                  <span className="text-sm">
                    Effortless reporting with photos and location tagging
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="text-primary h-4 w-4" />
                  <span className="text-sm">Real-time status updates on your submitted issues</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="text-primary h-4 w-4" />
                  <span className="text-sm">
                    Direct communication channel with municipal departments
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#" className="flex-shrink-0">
                <img
                  src={currentImages.playstore}
                  alt="Get it on Google Play"
                  width={180}
                  height={53}
                  className="h-auto"
                />
              </a>
            </div>
          </div>
          <div className="relative order-1 flex justify-center md:order-2 md:h-[600px]">
            <div className="absolute inset-0 -z-10">
              <div className="from-primary/20 absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r to-purple-500/20 opacity-70 blur-[100px] md:h-[500px] md:w-[500px]"></div>
            </div>
            <div className="relative mt-4 max-w-[280px] md:mt-0 md:max-w-full">
              <div className="relative z-30 overflow-hidden rounded-[2.5rem] border-8 border-zinc-900 shadow-xl dark:border-zinc-800">
                <img
                  alt="App screenshot showing a map with reported civic issues"
                  width="280"
                  height="580"
                  className="h-auto max-w-full rounded-[2rem] bg-zinc-950"
                  src={currentImages.home}
                />
              </div>
              <div className="absolute top-24 -right-20 z-20 hidden rotate-6 transform overflow-hidden rounded-[2.5rem] border-8 border-zinc-900 shadow-xl md:-right-32 md:block dark:border-zinc-800">
                <img
                  alt="App screenshot showing a detailed report submission form"
                  width="240"
                  height="520"
                  className="h-auto max-w-full rounded-[2rem] bg-zinc-950"
                  src={currentImages.dashboard}
                />
              </div>
              <div className="bg-card absolute top-16 -left-8 z-40 hidden rounded-xl p-3 shadow-lg sm:block dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                    <Download className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">New Issue Reported!</div>
                    <div className="text-muted-foreground text-xs">Pothole on Main St.</div>
                  </div>
                </div>
              </div>
              <div className="bg-card absolute -right-12 -bottom-6 z-40 hidden rounded-xl p-3 shadow-lg sm:block dark:bg-zinc-900">
                <div className="flex flex-col">
                  <div className="mb-1 text-xs font-medium">Resolution Progress</div>
                  <div className="text-lg font-bold">75% Resolved</div>
                  <div className="mt-1 h-2 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="bg-primary h-2 w-[75%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
