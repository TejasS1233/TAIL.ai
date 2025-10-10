import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Mail, Brain, Code, PlayCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { title: "Agent Catalog", href: "/catalog" },
    { title: "Workflow Composer", href: "/composer" },
    { title: "Live Playground", href: "/playground" },
    { title: "Story Mode", href: "/stories" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Community", href: "/community" },
  ],
  resources: [
    { title: "Documentation", href: "/docs" },
    { title: "API Reference", href: "/api" },
    { title: "Tutorials", href: "/tutorials" },
    { title: "Examples", href: "/examples" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      // Newsletter subscription logic would go here
      console.log("Newsletter subscription:", email);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Agentic AI Lab</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                The most comprehensive platform for building, testing, and deploying AI agents
                visually. Create sophisticated workflows without coding.
              </p>

              {/* Newsletter Signup */}
              <div>
                <h6 className="font-semibold mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Stay Updated
                </h6>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest updates on new features, agents, and tutorials.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "..." : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h6 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Product
              </h6>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.title}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h6 className="font-semibold mb-4">Company</h6>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.title}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h6 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resources
              </h6>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h6 className="font-semibold mb-4">Legal</h6>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Agentic AI Lab. All rights reserved.
          </span>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href="https://twitter.com/agenticailab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/agenticailab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/company/agenticailab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
