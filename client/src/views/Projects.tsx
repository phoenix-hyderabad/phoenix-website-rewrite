import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectCard from "@/components/projects_page/ProjectCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const projects = [
  {
    name: "Bi-Directional Gym Visitor Tracker",
    cover: "https://phoenix-bphc.vercel.app/linefol/3.jpeg",
    problem_statement:
      "An IoT Bidirectional Counter for a gym is a system designed to monitor and count the number of people entering and exiting the gym facility. The system uses ESP32 microcontrollers and is simulated on Wokwi. It relies on sensors to detect movement in both directions, ensuring accurate occupancy tracking. The challenge involves both hardware and software aspects, requiring sensor integration, efficient counting logic, and real-time data processing. ",
    active: true,
  },
  {
    name: "Micromouse",
    cover: "https://phoenix-bphc.vercel.app/linefol/1.jpeg",
    problem_statement:
      "The Micromouse project involves designing and building a small autonomous robot (micromouse) capable of navigating a maze from a starting point to the center. The challenge is to develop both the hardware and software required for the robot to efficiently navigate through the maze, detecting walls, making decisions at intersections, and ultimately finding the optimal path to the finish.",
    active: true,
  },
  {
    name: "Robo Sumo Bot",
    cover: "https://phoenix-bphc.vercel.app/linefol/4.jpeg",
    problem_statement:
      "Developing bots for thrilling competitions like Robo Sumo and Robo Soccer, where robots either autonomously or manually engage in intense battles or soccer matches. The goal is to push opponents out or score goals by maneuvering a ball into the opponent's goal.",
    active: true,
  },
  {
    name: "Line Follower Bot",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Micromouse_Green_Giant_V1.3.jpg/220px-Micromouse_Green_Giant_V1.3.jpg",
    problem_statement:
      "Line follower robots are autonomous machines designed to follow a pre-defined path, typically marked by a line on the ground. Using sensors, such as infrared or optical sensors, these robots detect the contrast between the line and the surface to navigate the path. Our prototype bot won first place in its first competition.",
    active: false,
  },
  {
    name: "Thriveforce - Robowars Bot",
    cover: "https://phoenix-bphc.vercel.app/linefol/thriveforceimg.jpg",
    problem_statement:
      "Thriveforce is our combat robotics team which has won multiple prizes in colleges like IIT Bombday, BITS Pilani, etc. Robowars is an event of destruction and madness where robots battle it out to claim victory over their opponents.",
    active: false,
  },
];

const currentProjects = projects.filter((e) => e.active);
const pastProjects = projects.filter((e) => !e.active);

function Projects() {
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");

  const selectedProject = useMemo(
    () => projects.filter((e) => e.name === selectedProjectName)[0],
    [selectedProjectName]
  );

  const projectToCard = (el: (typeof projects)[0], index: number) => (
    <ProjectCard
      key={index}
      name={el.name}
      coverImage={el.cover}
      onClick={() => setSelectedProjectName(el.name)}
    />
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Projects</h3>
        <p className="text-sm text-muted-foreground">
          Our association takes on a diverse array of projects that blend
          creativity and technical skills. We work on initiatives spanning
          electronics, software development, and engineering innovation. By
          integrating the latest hardware and software advancements, we strive
          to deliver impactful, high-quality solutions.
        </p>
      </div>
      <Dialog>
        <DialogContent className="flex max-h-screen max-w-5xl flex-col">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex max-h-full flex-col pt-2" type="always">
            <div className="flex flex-col items-center justify-center gap-4">
              <img
                src={selectedProject?.cover}
                decoding="async"
                loading="eager"
                className="max-h-[40vh]"
              />
              <p className="text-muted-foreground">
                {selectedProject?.problem_statement}
              </p>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </DialogContent>
        <h4 className="text-left text-xl">Current projects</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
          {currentProjects.map(projectToCard)}
        </div>
        <h4 className="text-left text-xl">Past projects</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
          {pastProjects.map(projectToCard)}
        </div>
      </Dialog>
    </div>
  );
}

export default Projects;
