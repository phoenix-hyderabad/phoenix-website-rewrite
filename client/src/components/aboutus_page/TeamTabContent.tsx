import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import team from "@/lib/team_data";
import { useEffect, useMemo, useState } from "react";
import TeamCarouselItem from "@/components/aboutus_page/TeamCarouselItem";

const TeamTabContent = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const currentTeam = useMemo(() => team[current], [current]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  return (
    <>
      <h2 className="py-4 text-center text-3xl">Team</h2>
      <Carousel setApi={setApi} className="flex flex-col" opts={{ loop: true }}>
        <div className="flex items-center gap-4 self-center text-muted-foreground">
          <CarouselPrevious className="static translate-y-0" />
          {currentTeam.year} {currentTeam.current ? "(current)" : ""}
          <CarouselNext className="static translate-y-0" />
        </div>
        <CarouselContent className="-ml-4">
          {team.map((el, index) => (
            <TeamCarouselItem {...el} key={index} />
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default TeamTabContent;
