"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { type HTMLAttributeAnchorTarget, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import RouterLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/components/utils";
import Image from "next/image";

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const Link = useCallback(
    ({
      className,
      href,
      ...props
    }: LinkProps & {
      className?: string;
      children: React.ReactNode;
      target?: HTMLAttributeAnchorTarget;
    }) => {
      const isActive = pathname.endsWith(
        typeof href === "string" ? href : (href.pathname ?? "amogus"),
      );
      return (
        <RouterLink
          href={href}
          className={cn(
            className,
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded p-2 text-lg font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            isActive ? "bg-accent" : "",
          )}
          {...props}
          onClick={() => {
            setIsOpen(false);
          }}
        ></RouterLink>
      );
    },
    [pathname],
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="bg-accent transition-colors lg:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetTitle>
          <RouterLink
            href="/"
            className="flex items-center gap-2 text-xl"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/phoenix-logo.svg"
              loading="lazy"
              decoding="async"
              height={40}
              width={40}
              className="h-10 object-contain"
              alt="logo"
            />
            PHoEnix
          </RouterLink>
        </SheetTitle>

        <nav className="flex flex-col gap-2">
          <Link href="resources">Resources</Link>
          <Link href="projects">Projects</Link>
          <Link href="https://drive.google.com/file/d/1P5ADJ4ycYUwZPm9PwafI2eDr0bUo0Aia/view?usp=sharing">
            Thriveforce
          </Link>
          <Link href="inductions">Inductions</Link>
          <Link href="aboutus">About us</Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidenav;
