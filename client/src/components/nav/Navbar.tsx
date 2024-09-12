import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LinkProps, useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import phoenixLogo from "@/assets/phoenix-logo.svg";
import { cn } from "@/lib/utils";

const Link = ({ to, ...props }: LinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname.endsWith(to.toString());

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

const Navbar = () => {
  return (
    <div className="sticky inset-x-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/75 px-4 backdrop-blur-lg transition-all">
      <RouterLink to="/" className="flex items-center gap-2 text-xl">
        <img
          src={phoenixLogo}
          loading="lazy"
          decoding="async"
          className="h-10 object-contain"
          alt="logo"
        />
        PHoEnix
      </RouterLink>

      <NavigationMenu className="max-sm:hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="resources">Resources</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="projects">Projects</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="https://drive.google.com/file/d/1P5ADJ4ycYUwZPm9PwafI2eDr0bUo0Aia/view?usp=sharing">
              Thriveforce
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-2">
              About us
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col p-2">
                <li>
                  <Link to="professors">Professors</Link>
                </li>
                <li>
                  <Link to="pors" className="w-full">
                    PORs
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
