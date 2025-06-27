"use client";

import { cn } from "~/components/utils";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useDeleteMutation } from "~/hooks/team";
import { useAuth } from "~/hooks/auth";

const TeamMembersItem = ({
  team,
  description,
  members,
}: {
  team: string;
  description?: string;
  members: {
    uid: string;
    year: number;
    student: string;
    link?: string;
    designation?: string;
  }[];
}) => {
  const { canEdit } = useAuth("members:edit");
  const deleteMutation = useDeleteMutation();

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
          const hasLink = el.link?.length ? true : false;
          return (
            <a
              key={index}
              className={cn(
                "bg-card relative w-max min-w-44 max-w-80 rounded-xl border p-4",
                hasLink ? "cursor-pointer" : "",
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
                  <span className="text-muted-foreground text-sm">
                    {el.designation}
                  </span>
                ) : null}
              </div>
              {canEdit ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2"
                  onClick={() =>
                    deleteMutation.mutate({ uid: el.uid, year: el.year })
                  }
                >
                  <TrashIcon className="h-4 w-4 opacity-40" />
                </Button>
              ) : null}
            </a>
          );
        })}
      </span>
    </div>
  );
};

export default TeamMembersItem;
