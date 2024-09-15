import { NavLink as Link } from "@/components/nav/NavLink";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link as RouterLink } from "react-router-dom";
import phoenixLogo from "@/assets/phoenix-logo.svg";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex h-16 w-full items-center justify-between border-t px-4">
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

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="https://www.instagram.com/phoenixbphc?igsh=MWk3MWZuYXB6Nzh4dw==">
              <InstagramLogoIcon className="h-5 w-5" />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="https://www.linkedin.com/company/phoenix-association-bphc/">
              <LinkedInLogoIcon className="h-5 w-5" />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="https://www.facebook.com/groups/121969974532289/user/100063699953850/">
              <Facebook className="h-5 w-5" />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="max-sm:hidden">
            <p className="mb-0">
              © {new Date().getFullYear()} PHoEnix. All rights reserved.
            </p>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </footer>
  );
};

export default Footer;
