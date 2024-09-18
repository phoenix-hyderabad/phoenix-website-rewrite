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
        "text-lg transition-none data-[state=active]:border data-[state=active]:text-accent-foreground"
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  );
};

export default StyledTabTrigger;
