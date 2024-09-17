import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LinkProps, Link as RouterLink, useLocation } from "react-router-dom";
import phoenixLogo from "@/assets/phoenix-logo.svg";
import { cn } from "@/lib/utils";

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const Link = useCallback(
    ({ className, ...props }: LinkProps) => {
      const { pathname } = useLocation();
      const isActive = pathname.endsWith(props.to.toString());
      return (
        <RouterLink
          className={cn(
            className,
            "rounded p-2 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            isActive ? "bg-accent" : ""
          )}
          {...props}
          onClick={() => {
            setIsOpen(false);
          }}
        ></RouterLink>
      );
    },
    [setIsOpen]
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="bg-accent transition-colors sm:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <RouterLink
          to="/"
          className="flex items-center gap-2 text-xl"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={phoenixLogo}
            loading="lazy"
            decoding="async"
            className="h-10 object-contain"
            alt="logo"
          />
          PHoEnix
        </RouterLink>
        <nav className="flex flex-col gap-2">
          <Link to="resources">Resources</Link>
          <Link to="projects">Projects</Link>
          <Link to="https://drive.google.com/file/d/1P5ADJ4ycYUwZPm9PwafI2eDr0bUo0Aia/view?usp=sharing">
            Thriveforce
          </Link>
          <Link to="inductions">Inductions</Link>
          <Link to="about-us">About us</Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidenav;
