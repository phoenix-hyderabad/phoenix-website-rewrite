"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import ProjectCard, {
  ProjectCardSkeleton,
} from "~/components/projects_page/ProjectCard";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getProjects, type Project } from "~/server/actions/projects";
import Image from "next/image";

const fetchProjects = async () => {
  const data = await getProjects();
  return data;
};

function Projects() {
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [pastProjects, setPastProjects] = useState<Project[]>([]);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    if (!projects) return;
    setCurrentProjects(projects.filter((e) => e.current));
    setPastProjects(projects.filter((e) => !e.current));
  }, [projects]);

  const selectedProject = useMemo(() => {
    if (!projects) return undefined;
    return projects.find((e) => e.name === selectedProjectName);
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
    [],
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Projects</h3>
        <p className="text-muted-foreground text-sm">
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
              <Image
                src={selectedProject?.cover ?? ""}
                alt={selectedProject?.name ?? "cover"}
                height={300}
                width={500}
                decoding="async"
                loading="eager"
                className="max-h-[40vh] object-contain"
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
