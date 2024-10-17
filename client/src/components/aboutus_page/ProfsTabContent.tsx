import professors from "@/lib/professor_data";
import ProfessorCard from "@/components/aboutus_page/ProfessorCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { useState } from "react";

const ProfsTabContent = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <>
      <h2 className="py-4 text-center text-3xl">Professors</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
      <Dialog>
        <DialogContent className="flex flex-col overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex w-full justify-center">{professors[selectedIndex].faculty}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex max-h-[70dvh] flex-col">
            <ul className="h-full divide-y-2 divide-accent-foreground/50 p-2">
              {Object.keys(professors[selectedIndex]).slice(2).map((subject, index) => (
                <li key={index} className="flex flex-col sm:flex-col gap-4 py-2">
                  <h2>{subject}: </h2>
                  <div className="text-muted-foreground">{(professors[selectedIndex] as any)[subject]}</div>
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
                designation={e.Designation}
                img={`/professorImages/${e.faculty}.png`}
                onClick={()=>{setSelectedIndex(index)}}
              /> 
        ))}
      </Dialog>
      </div>
    </>
  );
};

export default ProfsTabContent;
