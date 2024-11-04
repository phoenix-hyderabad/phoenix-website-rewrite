import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const TeamLinkCard = forwardRef(
  (
    {
      open,
      canEdit,
      toggleFn,
      editFn,
      children,
      className,
      ...props
    }: {
      open: boolean;
      canEdit: boolean;
      toggleFn: () => void;
      editFn: (newLink: string) => Promise<boolean>;
    } & LinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const [linkInputVal, setLinkInputVal] = useState(
      typeof props.to === "string" ? props.to : (props.to.pathname ?? "")
    );
    const [dialogOpen, setDialogOpen] = useState(false);
    const inner = (
      <>
        <span className="overflow-clip text-lg">{children}</span>
        <span
          className={cn("text-sm", open ? "text-success" : "text-destructive")}
        >
          Inductions {open ? "Open" : "Closed"}
        </span>
        {canEdit ? (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              onClick={(e) => {
                toggleFn();
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Toggle
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Button
                variant="secondary"
                onClick={(e) => {
                  setDialogOpen(true);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Edit link
              </Button>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit link</DialogTitle>
                  <DialogDescription>
                    Input new link for the induction to redirect to
                  </DialogDescription>
                </DialogHeader>
                <Input
                  id="link"
                  value={linkInputVal}
                  onChange={(e) => setLinkInputVal(e.target.value)}
                  className="w-full"
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      void editFn(linkInputVal).then((success) => {
                        if (success) {
                          setDialogOpen(false);
                          toast.success("Edited link successfully");
                        }
                      });
                    }}
                    disabled={
                      linkInputVal ===
                      (typeof props.to === "string"
                        ? props.to
                        : props.to.pathname)
                    }
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
      </>
    );

    return open ? (
      <Link
        ref={ref}
        className={cn(
          "before:border-glow relative flex w-full flex-col gap-4 rounded-2xl bg-card px-2 py-4 before:absolute before:-bottom-[1px] before:-left-[1px] before:-right-[1px] before:-top-[1px] before:-z-10 before:rounded-2xl before:content-[''] max-lg:justify-between max-sm:flex-col",
          className
        )}
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
TeamLinkCard.displayName = "TeamLinkCard";

export const TeamLinkCardSkeleton = () => {
  return (
    <div className="relative flex w-full flex-col items-center gap-4 rounded-2xl bg-card px-2 py-4 brightness-75">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
};
