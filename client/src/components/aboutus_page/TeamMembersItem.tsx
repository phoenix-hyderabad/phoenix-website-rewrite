import { cn } from "@/lib/utils";

const TeamMembersItem = ({
  team,
  description,
  members,
}: {
  team: string;
  description?: string;
  members:
    | { student: string; link?: string; designation?: string }[]
    | string[];
}) => {
  members = members.map((el) =>
    typeof el === "string" ? { student: el } : el
  );
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <span className="flex shrink-0 flex-col gap-2">
        <span className="text-lg">{team}</span>
        {description ? (
          <span className="text-muted-foreground">{description}</span>
        ) : null}
      </span>
      <span className="flex flex-grow flex-wrap justify-center gap-4">
        {members.map((el, index) => {
          const hasLink = el.link && el.link.length ? true : false;
          return (
            <a
              key={index}
              className={cn(
                "w-max min-w-44 max-w-80 rounded-xl border bg-card p-4",
                hasLink ? "cursor-pointer" : ""
              )}
              href={hasLink ? el.link : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col gap-1">
                <span className="max-h-6 overflow-hidden overflow-ellipsis">
                  {el.student}
                </span>
                {el.designation ? (
                  <span className="text-sm text-muted-foreground">
                    {el.designation}
                  </span>
                ) : null}
              </div>
            </a>
          );
        })}
      </span>
    </div>
  );
};

export default TeamMembersItem;
