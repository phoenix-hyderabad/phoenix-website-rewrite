import ProfessorCard from "@/components/aboutus_page/ProfessorCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

interface Professor {
  id: number;
  faculty: string;
  designation: string;
  qualification: string;
  joinedBits: string;
  interests: string;
  coursesTaught: string;
  experiences: string | null;
  labWebsite: string | null;
  researchLab: string | null;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const fetchProfessors = async (): Promise<Professor[]> => {
  const response = await axiosInstance.get<Professor[]>("/professors/get");
  return response.data;
};

const ProfsTabContent = () => {
  const {
    data: professors,
    isLoading,
    isError,
  } = useQuery<Professor[]>(["professors"], fetchProfessors, {
    staleTime: Infinity,
    retry: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <>
      <h2 className="py-4 text-center text-3xl">Professors</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((e) => (
              <ProfessorCardSkeleton key={e} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500">Error while fetching professors</div>
        ) : !professors.length ? (
          <div>No professors to show</div>
        ) : (
          <Dialog>
            <DialogContent className="flex flex-col overflow-auto">
              <DialogHeader>
                <DialogTitle className="flex w-full justify-center">
                  {professors[selectedIndex].faculty}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex max-h-[70dvh] flex-col">
                <ul className="h-full divide-y-2 divide-accent-foreground/50 p-2">
                  {Object.entries(professors[selectedIndex])
                    .slice(2)
                    .map(([subject, value], index) => {
                      const content = value as string;
                      if (!content) return null;
                      return (
                        <li
                          key={index}
                          className="flex flex-col gap-4 py-2 sm:flex-col"
                        >
                          <h2>
                            {capitalizeFirstLetter(
                              subject.replace(/([a-z])([A-Z])/g, "$1 $2")
                            )}
                            :
                          </h2>
                          <div className="text-muted-foreground">{content}</div>
                        </li>
                      );
                    })}
                </ul>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </DialogContent>

            {professors.map((e, index) => (
              <ProfessorCard
                key={index}
                name={e.faculty}
                designation={e.designation}
                img={`/professorImages/${e.faculty}.png`}
                onClick={() => {
                  setSelectedIndex(index);
                }}
              />
            ))}
          </Dialog>
        )}
      </div>
    </>
  );
};

export const ProfessorCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-center space-y-3 rounded-lg bg-card p-6">
      <Skeleton className="ml-auto mr-auto h-[70px] w-[70px] rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[240px]" />
        <Skeleton className="h-4 w-[240px]" />
      </div>
    </div>
  );
};

export default ProfsTabContent;
