"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Cpu, Palette, PenTool, Wifi } from "lucide-react";

function AboutTabContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-accent-foreground mb-8 text-center text-5xl font-bold">
        PHoEnix
      </h2>
      <p className="text-muted-foreground mb-8 text-center text-lg">
        The PHoEnix Association consists of 4 teams: Technical, Design, IT
        (Information Technology) and Editorial.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TeamCard
          title="Technical"
          icon={<Cpu className="h-6 w-6" />}
          description="Involved in the implementation and upkeep of projects, details of which are given to all Association members at the beginning of each academic year."
        />
        <TeamCard
          title="IT"
          icon={<Wifi className="h-6 w-6" />}
          description="Maintains and updates the website, engages in state-of-the-art programming and software for competitions and technical team projects."
        />
        <TeamCard
          title="Design"
          icon={<Palette className="h-6 w-6" />}
          description="Responsible for the design and creativity behind every poster for events, workshops, and competitions. Also designs merchandise for various association events."
        />
        <TeamCard
          title="Editorial"
          icon={<PenTool className="h-6 w-6" />}
          description="Publishes the annual magazine 'Livewire' and newsletters for the EEE Department. Handles documentation and records of Association events."
        />
      </div>
    </div>
  );
}

interface TeamCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}
function TeamCard({ title, icon, description }: TeamCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default AboutTabContent;
