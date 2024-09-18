import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import team, { type TeamProps } from "@/lib/team_data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";

const CurrentPorCard = ({
  name,
  designation,
  img,
}: {
  name: string;
  designation: string;
  img: string;
}) => {
  return (
    <Card className="flex max-w-80 cursor-pointer flex-col">
      <CardContent className="flex flex-col items-center gap-4 p-4">
        <Avatar className="h-36 w-36 border-2">
          <AvatarImage src={img} className="object-cover" />
        </Avatar>
        <div className="flex flex-col items-center">
          {name}
          <span className="text-sm text-muted-foreground">{designation}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const TeamCarouselItem = (props: TeamProps) => {
  return (
    <CarouselItem className="flex flex-col gap-4 pt-4">
      {props.current ? (
        <>
          <span className="text-2xl">PORs</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
            {props.pors.map((e, index) => (
              <CurrentPorCard
                img={`/porImages/${e.student}.jpeg`}
                designation={e.designation}
                name={e.student}
                key={index}
              />
            ))}
          </div>
          <span className="text-2xl">Members</span>
        </>
      ) : (
        // do we show image for past PORs?
        <>past</>
      )}
    </CarouselItem>
  );
};

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
          {team.map((el, index) =>
            el.current ? (
              <TeamCarouselItem
                current
                year={el.year}
                members={el.members}
                pors={el.pors}
                key={index}
              />
            ) : (
              <TeamCarouselItem
                current={false}
                year={el.year}
                members={el.members}
                pors={el.pors}
                key={index}
              />
            )
          )}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default TeamTabContent;
