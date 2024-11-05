import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link as RouterLink } from "react-router-dom";
import { NavLink as Link } from "@/components/nav/NavLink";
import Sidenav from "@/components/nav/Sidenav";

const Navbar = () => {
  return (
    <div className="sticky inset-x-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/75 px-4 backdrop-blur-lg transition-all">
      <RouterLink to="/" className="flex items-center gap-2 text-xl">
        <img
          src="phoenix-logo.svg"
          loading="lazy"
          decoding="async"
          className="h-10 object-contain"
          alt="logo"
        />
        PHoEnix
      </RouterLink>

      <NavigationMenu className="max-lg:hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="robowars" className="bg-red-700">
              Robo Wars
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="resources">Resources</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="projects">Projects</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="https://drive.google.com/file/d/1P5ADJ4ycYUwZPm9PwafI2eDr0bUo0Aia/view?usp=sharing"
              target="_blank"
            >
              Thriveforce
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="inductions">Inductions</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="livewire">LiveWire</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="about-us">About us</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Sidenav />
    </div>
  );
};

export default Navbar;
