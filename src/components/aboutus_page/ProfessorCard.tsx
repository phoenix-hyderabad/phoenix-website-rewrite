"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useAuth } from "~/hooks/auth";
import { useDeleteMutation } from "~/hooks/professors";

const ProfessorCard = ({
  id,
  name,
  designation,
  img,
  onClick,
}: {
  id: number;
  name: string;
  designation: string;
  img: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { canEdit } = useAuth("professors:edit");
  const deleteMutation = useDeleteMutation();

  return (
    <Card
      onClick={onClick}
      className="flex max-w-80 cursor-pointer flex-col border-b-2 border-l-0 border-r-0 border-t-0 hover:shadow-xl hover:brightness-150"
    >
      <DialogTrigger asChild>
        <CardContent className="relative flex flex-col items-center gap-4 p-4">
          <Avatar className="h-28 w-28 border-2">
            <AvatarImage src={img} className="object-cover" />
          </Avatar>
          <div className="flex flex-col items-center">
            {name}
            <span className="text-muted-foreground text-sm">{designation}</span>
          </div>
          {canEdit ? (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2"
              onClick={(e) => {
                deleteMutation.mutate({ id });
                e.stopPropagation();
              }}
            >
              <TrashIcon className="h-4 w-4 opacity-40" />
            </Button>
          ) : null}
        </CardContent>
      </DialogTrigger>
    </Card>
  );
};

export default ProfessorCard;
