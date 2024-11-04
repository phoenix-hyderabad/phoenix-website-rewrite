import { NavLink as Link } from "@/components/nav/NavLink";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex h-16 w-full items-center justify-between border-t px-4 text-muted-foreground">
      {/* <RouterLink to="/" className="flex items-center gap-2 text-xl">
        <img
          src={phoenixLogo}
          loading="lazy"
          decoding="async"
          className="h-10 object-contain"
          alt="logo"
        />
        PHoEnix
      </RouterLink> */}
      <p>
        © {new Date().getFullYear()} PHoEnix.{" "}
        <span className="max-sm:hidden">All rights reserved.</span>
      </p>

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
        </NavigationMenuList>
      </NavigationMenu>
    </footer>
  );
};

export default Footer;
