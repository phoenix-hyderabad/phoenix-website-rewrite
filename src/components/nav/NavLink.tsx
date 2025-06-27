"use client";

import { NavigationMenuLink } from "~/components/ui/navigation-menu";
import { cn } from "~/components/utils";
import { usePathname } from "next/navigation";
import RouterLink, { type LinkProps } from "next/link";
import type { HTMLAttributeAnchorTarget } from "react";

export const NavLink = ({
  href,
  className,
  ...props
}: LinkProps & {
  className?: string;
  children: React.ReactNode;
  target?: HTMLAttributeAnchorTarget;
}) => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(
    typeof href === "string" ? href : (href.pathname ?? "amogus"),
  );

  return (
    <NavigationMenuLink asChild active={isActive}>
      <RouterLink
        href={href}
        {...props}
        className={cn(
          "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md px-2 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive ? "bg-accent" : "",
          className,
        )}
      />
    </NavigationMenuLink>
  );
};
