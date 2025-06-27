"use client";

import { forwardRef } from "react";
import { DialogTrigger } from "~/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";

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
    ref: React.ForwardedRef<HTMLDivElement>,
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
            <div className="relative h-56 min-h-56 overflow-hidden">
              <Image
                src={coverImage}
                decoding="async"
                loading="lazy"
                fill
                className="absolute left-0 top-0 h-full w-full object-fill blur-2xl"
                alt={name + "bg"}
              />
              <Image
                src={coverImage}
                decoding="async"
                loading="lazy"
                fill
                className="absolute h-full w-full object-contain"
                alt={name}
              />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export const ProjectCardSkeleton = () => (
  <Card className="flex max-w-80 cursor-pointer flex-col hover:brightness-150">
    <CardHeader>
      <CardTitle className="flex flex-col items-center">
        <Skeleton className="h-5 w-40 rounded-l" />
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col">
      <Skeleton className="h-56 rounded-lg" />
    </CardContent>
  </Card>
);

export default ProjectCard;
