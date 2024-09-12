import { forwardRef } from "react";
import { DialogTrigger } from "@/components/ui/dialog";

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
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div className="flex h-full flex-col items-center">
        <DialogTrigger asChild>
          <div
            ref={ref}
            className="before:border-glow relative flex h-full w-full max-w-80 flex-1 cursor-pointer flex-col gap-4 rounded-2xl bg-card px-2 py-4 before:absolute before:-bottom-[1px] before:-left-[1px] before:-right-[1px] before:-top-[1px] before:-z-10 before:rounded-2xl before:content-[''] max-lg:justify-between max-sm:flex-col"
            onClick={onClick}
          >
            <span className="text-lg">{heading}</span>
            {subheading ?? (
              <span className="text-sm text-muted-foreground">
                {subheading}
              </span>
            )}
          </div>
        </DialogTrigger>
      </div>
    );
  }
);

export default ResourceCard;
