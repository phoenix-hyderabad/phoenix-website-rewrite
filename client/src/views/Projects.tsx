import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectCard, {
  ProjectCardSkeleton,
} from "@/components/projects_page/ProjectCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface Project {
  name: string;
  cover: string;
  problemStatement: string;
  current: boolean;
}

const fetchProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get<Project[]>("/projects/get");
  return response.data;
};

function Projects() {
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [pastProjects, setPastProjects] = useState<Project[]>([]);

  const { data: projects, isLoading } = useQuery<Project[]>(
    ["projects"],
    fetchProjects,
    {
      staleTime: Infinity,
      retry: 1,
    }
  );

  useEffect(() => {
    if (!projects) return;
    setCurrentProjects(projects.filter((e) => e.current));
    setPastProjects(projects.filter((e) => !e.current));
  }, [projects]);

  const selectedProject = useMemo(() => {
    if (!projects) return undefined;
    return projects.filter((e) => e.name === selectedProjectName)[0];
  }, [projects, selectedProjectName]);

  const projectToCard = useCallback(
    (el: Project, index: number) => (
      <ProjectCard
        key={index}
        name={el.name}
        coverImage={el.cover}
        onClick={() => setSelectedProjectName(el.name)}
      />
    ),
    []
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
                {selectedProject?.problemStatement}
              </p>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </DialogContent>
        <h4 className="text-left text-xl">Current projects</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
          {isLoading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : (
            currentProjects.map(projectToCard)
          )}
        </div>
        <h4 className="text-left text-xl">Past projects</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
          {isLoading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : (
            pastProjects.map(projectToCard)
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default Projects;
