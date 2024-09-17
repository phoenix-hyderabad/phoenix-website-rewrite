import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

const TeamLinkCard = forwardRef(
  (
    { open, children, className, ...props }: { open: boolean } & LinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const inner = (
      <>
        <span className="text-lg">{children}</span>
        <span
          className={cn("text-sm", open ? "text-success" : "text-destructive")}
        >
          Inductions {open ? "Open" : "Closed"}
        </span>
      </>
    );

    return (
      <div className="flex w-full flex-col items-center">
        {open ? (
          <Link
            ref={ref}
            className={
              "before:border-glow relative flex w-full flex-1 flex-col gap-4 rounded-2xl bg-card px-2 py-4 before:absolute before:-bottom-[1px] before:-left-[1px] before:-right-[1px] before:-top-[1px] before:-z-10 before:rounded-2xl before:content-[''] max-lg:justify-between max-sm:flex-col"
            }
            {...props}
          >
            {inner}
          </Link>
        ) : (
          <div className="relative flex w-full flex-1 flex-col gap-4 rounded-2xl bg-card px-2 py-4 brightness-75">
            {inner}
          </div>
        )}
      </div>
    );
  }
);

export default TeamLinkCard;
