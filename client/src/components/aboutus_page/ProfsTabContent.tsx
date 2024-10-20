import professors from "@/lib/professor_data";
import ProfessorCard from "@/components/aboutus_page/ProfessorCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { TeamLinkCardSkeleton } from "../inductions_page/TeamLinkCard";
import { Skeleton } from "../ui/skeleton";

interface Professor {
  id: number;
  faculty: string;
  designation: string;
  qualification: string;
  joinedBits: string;
  interests: string;
  coursesTaught: string;
  experiences?: string;
  labWebsite?: string;
  researchLab?: string;
}
function capitalizeFirstLetter(str:string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const fetchProfessors = async (): Promise<Professor[]> => {
  const response = await axiosInstance.get("/professors/get");

  const filteredKeys = Object.keys(response.data[0])
    .filter((subject) => (response.data[0] as any)[subject] !== null)
    .slice(2);

  console.log(filteredKeys);
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
          <div>
            {[1, 2, 3, 4].map((e) => (
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
                  {Object.keys(professors[selectedIndex])
                    .slice(2)
                    .filter((subject) => (
                      (professors[selectedIndex] as any)[subject] !== null
                    ))
                    .map((subject, index) => (
                      <li
                        key={index}
                        className="flex flex-col gap-4 py-2 sm:flex-col"
                      >
                        <h2>{capitalizeFirstLetter(subject)}: </h2>
                        <div className="text-muted-foreground">
                          {(professors[selectedIndex] as any)[subject]}
                        </div>
                      </li>
                    ))}
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
    <div className="relative flex w-full flex-col items-center gap-4 rounded-2xl bg-card px-2 py-4 brightness-75">
      <Skeleton className="h-36 w-36" />
      <Skeleton className="h-24 w-24" />
    </div>
  );
};

export default ProfsTabContent;
