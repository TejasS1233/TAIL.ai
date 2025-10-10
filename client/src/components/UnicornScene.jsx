import { useEffect, useRef } from "react";

export default function UnicornScene({ projectId, width = "100%", height = "600px" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load UnicornStudio script dynamically if not already loaded
    if (!window.UnicornStudio) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        if (window.UnicornStudio && containerRef.current) {
          window.UnicornStudio.init();
        }
      };
      document.body.appendChild(script);
    } else {
      // Already loaded
      window.UnicornStudio.init();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="unicorn-embed"
      data-us-project={projectId}
      style={{ width, height }}
    ></div>
  );
}
