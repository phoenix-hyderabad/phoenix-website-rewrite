import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PhoneIcon } from "lucide-react";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-brands-svg-icons";

const socialIcons: { [index: string]: IconDefinition } = {
  instagram: faInstagram,
  twitter: faTwitter,
  github: faGithub,
  linkedin: faLinkedin,
  facebook: faFacebook,
};

const socialUrls: { [index: string]: string } = {
  instagram: "https://instagram.com/",
  twitter: "https://twitter.com/",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  facebook: "https://facebook.com/",
};

const CurrentPorCard = ({
  name,
  designation,
  img,
  phone,
  socials,
}: {
  name: string;
  designation: string;
  img: string;
  phone: string;
  socials?: {
    site: string;
    username: string;
  }[];
}) => {
  return (
    <Card className="relative flex max-w-80 flex-col border-b-2 border-l-0 border-r-0 border-t-0">
      <CardContent className="z-10 flex flex-col items-center gap-4 p-4">
        <Avatar className="h-36 w-36 border-2">
          <AvatarImage src={img} className="object-cover" />
        </Avatar>
        <div className="flex flex-col items-center self-stretch">
          {name}
          <span className="text-sm text-muted-foreground">{designation}</span>
        </div>
        <div className="flex items-center justify-between self-stretch text-muted-foreground">
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-4 w-4" />
            {phone}
          </div>
          <div className="flex items-center gap-1">
            {socials?.map((e, index) =>
              Object.keys(socialIcons).includes(e.site) ? (
                <a
                  key={index}
                  href={socialUrls[e.site] + e.username}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 w-6 items-center justify-center hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50"
                >
                  <FontAwesomeIcon
                    icon={socialIcons[e.site]}
                    className="h-4 w-4"
                  />
                </a>
              ) : null
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPorCard;
