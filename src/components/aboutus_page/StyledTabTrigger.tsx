"use client";

import { cn } from "~/components/utils";
import type { TabsTriggerProps } from "@radix-ui/react-tabs";
import { TabsTrigger } from "~/components/ui/tabs";

const StyledTabTrigger = ({
  className,
  children,
  ...props
}: TabsTriggerProps) => {
  return (
    <TabsTrigger
      className={cn(
        className,
        "data-[state=active]:text-accent-foreground bg-transparent transition-none data-[state=active]:border data-[state=active]:bg-transparent sm:text-lg",
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  );
};

export default StyledTabTrigger;
