import { forwardRef } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectCard = forwardRef(
  (
    {
      name,
      coverImage,
      onClick,
    }: {
      name: string;
      coverImage: string;
      onClick: React.MouseEventHandler<HTMLDivElement>;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <DialogTrigger asChild>
        <Card
          className="flex w-full max-w-80 cursor-pointer flex-col hover:brightness-150"
          onClick={onClick}
          ref={ref}
        >
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={coverImage} decoding="async" loading="lazy" />
          </CardContent>
        </Card>
      </DialogTrigger>
    );
  }
);

export default ProjectCard;
