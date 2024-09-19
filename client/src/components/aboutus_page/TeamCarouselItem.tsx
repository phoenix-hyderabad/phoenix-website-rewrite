import CurrentPorCard from "@/components/aboutus_page/CurrentPorCard";
import { type TeamProps } from "@/lib/team_data";
import { CarouselItem } from "@/components/ui/carousel";
import TeamMembersItem from "./TeamMembersItem";

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
                phone={e.contact}
                key={index}
                socials={e.socials}
              />
            ))}
          </div>
          <span className="p-2 text-2xl">Members</span>
          <TeamMembersItem
            team="IT Team"
            description="Website made with <3 by"
            members={props.members.it}
          />
          <TeamMembersItem
            team="Tech Team"
            description="Meet our tech team"
            members={props.members.tech}
          />
          <TeamMembersItem
            team="Editorial Team"
            description="Meet our editorial team"
            members={props.members.editorial}
          />
          <TeamMembersItem
            team="Design Team"
            description="Meet our design team"
            members={props.members.design}
          />
        </>
      ) : (
        <TeamMembersItem team="PORS" members={props.pors} />
      )}
    </CarouselItem>
  );
};

export default TeamCarouselItem;
