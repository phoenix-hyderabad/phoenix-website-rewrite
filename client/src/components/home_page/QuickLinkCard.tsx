import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

const QuickLinkCard = forwardRef(
  (
    { children, className, ...props }: LinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "before:border-glow relative flex w-full flex-1 cursor-pointer flex-col gap-4 rounded-2xl bg-card px-2 py-4 before:absolute before:-bottom-[1px] before:-left-[1px] before:-right-[1px] before:-top-[1px] before:-z-10 before:rounded-2xl before:content-[''] max-lg:justify-between max-sm:flex-col",
          className
        )}
        {...props}
      >
        <span className="text-lg">{children}</span>
      </Link>
    );
  }
);

QuickLinkCard.displayName = "QuickLinkCard";

export default QuickLinkCard;
