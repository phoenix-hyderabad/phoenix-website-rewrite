"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import RouterLink from "next/link";
import { NavLink as Link } from "~/components/nav/NavLink";
import Sidenav from "~/components/nav/Sidenav";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="sticky inset-x-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/75 px-4 backdrop-blur-lg transition-all">
      <RouterLink href="/" className="flex items-center gap-2 text-xl">
        <Image
          src="/phoenix-logo.svg"
          alt="logo"
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          className="h-10 object-contain"
        />
        PHoEnix
      </RouterLink>

      <NavigationMenu className="max-lg:hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="resources">Resources</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="projects">Projects</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="https://drive.google.com/file/d/1P5ADJ4ycYUwZPm9PwafI2eDr0bUo0Aia/view?usp=sharing"
              target="_blank"
            >
              Thriveforce
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="inductions">Inductions</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="livewire">LiveWire</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="aboutus">About us</Link>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <Link href="apply">Apply</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="viewApplications">View Applications</Link>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
      <Sidenav />
    </div>
  );
};

export default Navbar;
