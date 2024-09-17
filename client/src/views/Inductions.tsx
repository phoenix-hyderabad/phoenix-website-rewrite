import { useEffect, useRef } from "react";
import TeamLinkCard from "@/components/inductions_page/TeamLinkCard";

function Inductions() {
  const teams = [
    {
      name: "Tech\nTeam",
      url: "/projects",
      isOpen: false,
      deadline: "No Deadline",
    },
    {
      name: "Editorial\nTeam",
      url: "https://docs.google.com/document/d/1xNqUsbL3kC0nUq3y9JaYj6gPwAdxg8kc",
      isOpen: true,
      deadline: "No Deadline",
    },
    {
      name: "Design\nTeam",
      url: "/",
      isOpen: false,
      deadline: "No deadline",
    },
    {
      name: "IT\nTeam",
      url: "/",
      isOpen: false,
      deadline: "No deadline",
    },
  ];

  const teamsContainer = useRef<HTMLDivElement>(null);
  const teamsRefs = teams.map(() => useRef<HTMLAnchorElement>(null));

  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      teamsRefs.forEach((targetRef) => {
        const target = targetRef.current;
        if (!target) return;
        const rect = target.getBoundingClientRect(),
          x = ev.clientX - rect.left,
          y = ev.clientY - rect.top;
        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    if (matchMedia("(pointer:fine)").matches) {
      window.addEventListener("mousemove", moveEvent);
    }

    return () => {
      window.removeEventListener("mousemove", moveEvent);
    };
  }, [teamsContainer]);

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Teams</h3>
        <p className="text-sm text-muted-foreground">
          We have the following teams to ensure the smooth functioning of
          various activities within the association.
          <br />
          Click on the respective team to apply.
        </p>
      </div>
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4"
        ref={teamsContainer}
      >
        {teams.map((el, index) => (
          <TeamLinkCard
            key={index}
            open={el.isOpen}
            to={el.url}
            ref={teamsRefs[index]}
          >
            {el.name}
          </TeamLinkCard>
        ))}
      </div>
    </div>
  );
}

export default Inductions;
