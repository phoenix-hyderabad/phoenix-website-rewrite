import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Button } from "../ui/button";

const TeamLinkCard = forwardRef(
  (
    {
      open,
      canEdit,
      toggleFn,
      children,
      className,
      ...props
    }: { open: boolean; canEdit: boolean; toggleFn: () => void } & LinkProps,
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
        {canEdit ? (
          <Button
            className="self-center"
            variant="secondary"
            onClick={(e) => {
              toggleFn();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            Toggle
          </Button>
        ) : null}
      </>
    );

    return open ? (
      <Link
        ref={ref}
        className={
          "before:border-glow relative flex w-full flex-col gap-4 rounded-2xl bg-card px-2 py-4 before:absolute before:-bottom-[1px] before:-left-[1px] before:-right-[1px] before:-top-[1px] before:-z-10 before:rounded-2xl before:content-[''] max-lg:justify-between max-sm:flex-col"
        }
        referrerPolicy="no-referrer"
        target="_blank"
        {...props}
      >
        {inner}
      </Link>
    ) : (
      <div className="relative flex w-full flex-col gap-4 rounded-2xl bg-card px-2 py-4 brightness-75">
        {inner}
      </div>
    );
  }
);

export default TeamLinkCard;
