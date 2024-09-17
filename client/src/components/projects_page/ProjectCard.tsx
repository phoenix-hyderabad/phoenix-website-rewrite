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
          className="flex max-w-80 cursor-pointer flex-col hover:brightness-150"
          onClick={onClick}
          ref={ref}
        >
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <img
                src={coverImage}
                decoding="async"
                loading="lazy"
                className="absolute left-0 top-0 h-full w-full object-fill blur-2xl"
                alt={name + "bg"}
              />
              <img
                src={coverImage}
                decoding="async"
                loading="lazy"
                className="absolute h-full w-full object-contain"
                alt={name}
              />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
    );
  }
);

export default ProjectCard;
