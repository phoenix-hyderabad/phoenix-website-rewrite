import { cn } from "@/lib/utils";
import { TabsTriggerProps } from "@radix-ui/react-tabs";
import { TabsTrigger } from "@/components/ui/tabs";

const StyledTabTrigger = ({
  className,
  children,
  ...props
}: TabsTriggerProps) => {
  return (
    <TabsTrigger
      className={cn(
        className,
        "bg-transparent transition-none data-[state=active]:border data-[state=active]:bg-transparent data-[state=active]:text-accent-foreground sm:text-lg"
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  );
};

export default StyledTabTrigger;
