import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { type LinkProps, useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

export const NavLink = ({ to, ...props }: LinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname.endsWith(
    typeof to === "string" ? to : to.pathname || "amogus"
  );

  return (
    <NavigationMenuLink asChild active={isActive}>
      <RouterLink
        to={to}
        {...props}
        className={cn(
          "inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive ? "bg-accent" : "",
          props.className
        )}
      />
    </NavigationMenuLink>
  );
};
