import { Link } from "../nav/Navbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link as RouterLink } from "react-router-dom";
import phoenixLogo from "@/assets/phoenix-logo.svg";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";
function Footer() {
  return (
    <footer className="bottom-0 z-50 flex h-16 w-full items-center justify-between border-t bg-background/75 px-4 backdrop-blur-lg transition-all">
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
          <NavigationMenuItem>
            <p className="mb-0">
              © {new Date().getFullYear()} PHoEnix. All rights reserved.
            </p>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </footer>
  );
}

export default Footer;
