import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";

const contactDetails = [
  {
    icon: MailIcon,
    title: "Email",
    description: "Get help with agents, workflows, and technical questions.",
    link: "mailto:support@agenticailab.com",
    text: "support@agenticailab.com",
  },
  {
    icon: MessageCircle,
    title: "Community",
    description: "Join our Discord community for real-time help.",
    link: "/community",
    text: "Join Discord",
  },
  {
    icon: MapPinIcon,
    title: "Documentation",
    description: "Comprehensive guides and API references.",
    link: "/docs",
    text: "Browse Docs",
  },
  {
    icon: PhoneIcon,
    title: "Enterprise",
    description: "Custom solutions for enterprise teams.",
    link: "mailto:enterprise@agenticailab.com",
    text: "Contact Sales",
  },
];

const ContactPage = () => (
  <div className="bg-background">
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <b className="text-muted-foreground">Contact Us</b>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        Get Help with Agentic AI Lab
      </h2>
      <p className="mt-3 text-base sm:text-lg text-muted-foreground">
        Need help building AI agents or workflows? Our team of AI engineers is here to help you
        succeed.
      </p>

      <div className="mt-12 grid lg:grid-cols-2 gap-16 md:gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {contactDetails.map((item, idx) => (
            <div key={idx}>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <item.icon />
              </div>
              <h3 className="mt-6 font-semibold text-xl text-foreground">{item.title}</h3>
              <p className="my-2.5 text-muted-foreground">{item.description}</p>
              <a
                className="font-medium text-primary hover:text-primary/80"
                href={item.link}
                target={item.title === "Office" ? "_blank" : undefined}
                rel={item.title === "Office" ? "noopener noreferrer" : undefined}
              >
                {item.text}
              </a>
            </div>
          ))}
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6 md:p-10">
            <form>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input placeholder="First name" id="firstName" className="mt-1.5" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input placeholder="Last name" id="lastName" className="mt-1.5" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" placeholder="Email" id="email" className="mt-1.5" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Message" className="mt-1.5" rows={6} />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Checkbox id="acceptTerms" />
                  <Label htmlFor="acceptTerms">
                    You agree to our{" "}
                    <a href="#" className="underline text-primary hover:text-primary/80">
                      terms and conditions
                    </a>
                    .
                  </Label>
                </div>
              </div>
              <Button size="lg" className="mt-6 w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default ContactPage;
