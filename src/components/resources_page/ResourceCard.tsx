"use client";

import { forwardRef } from "react";
import { DialogTrigger } from "~/components/ui/dialog";

const ResourceCard = forwardRef(
  (
    {
      heading,
      subheading,
      onClick,
    }: {
      heading: string;
      subheading: string;
      onClick: React.MouseEventHandler<HTMLDivElement>;
    },
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <DialogTrigger asChild>
        <div
          ref={ref}
          className="before:border-glow bg-card relative flex h-full flex-1 cursor-pointer flex-col gap-4 rounded-2xl px-2 py-4 before:absolute before:-bottom-[1px] before:-left-[1px] before:-right-[1px] before:-top-[1px] before:-z-10 before:rounded-2xl"
          onClick={onClick}
        >
          <span className="text-lg">{heading}</span>
          {subheading ? (
            <span className="text-muted-foreground text-sm">{subheading}</span>
          ) : null}
        </div>
      </DialogTrigger>
    );
  },
);

ResourceCard.displayName = "ResourceCard";

export default ResourceCard;
