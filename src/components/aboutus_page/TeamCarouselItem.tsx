"use client";

import CurrentPorCard from "~/components/aboutus_page/CurrentPorCard";
import { CarouselItem } from "~/components/ui/carousel";
import TeamMembersItem from "./TeamMembersItem";
import type { TeamType } from "~/server/actions/team";
import { type Team, teams } from "~/server/db/schema";

const teamNames: Record<Team, string> = {
  it: "IT Team",
  tech: "Tech Team",
  editorial: "Editorial Team",
  design: "Design Team",
};

const teamDescriptions: Record<Team, string> = {
  it: "Website made with <3 by",
  tech: "Meet our tech team",
  editorial: "Meet our editorial team",
  design: "Meet our design team",
};

const TeamCarouselItem = (props: TeamType) => {
  return (
    <CarouselItem className="flex flex-col gap-4 pt-4">
      {props.current ? (
        <>
          <span className="text-2xl">PORs</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
            {props.pors.map((e, index) => (
              <CurrentPorCard
                uid={e.uid}
                year={props.year}
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
          {teams.enumValues.map((team) => (
            <TeamMembersItem
              key={team}
              team={teamNames[team]}
              description={teamDescriptions[team]}
              members={props.members[team].map((e) => ({
                ...e,
                year: props.year,
              }))}
            />
          ))}
        </>
      ) : (
        <>
          <TeamMembersItem
            team="PORS"
            members={props.pors.map((e) => ({ ...e, year: props.year }))}
          />
          {teams.enumValues.map((team) => (
            <TeamMembersItem
              key={team}
              team={teamNames[team]}
              description={teamDescriptions[team]}
              members={props.members[team].map((e) => ({
                ...e,
                year: props.year,
              }))}
            />
          ))}
        </>
      )}
    </CarouselItem>
  );
};

export default TeamCarouselItem;
