"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { PhoneIcon } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiLinkedin,
  SiGithub,
  type IconType,
} from "@icons-pack/react-simple-icons";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useDeleteMutation } from "~/hooks/team";
import { useAuth } from "~/hooks/auth";

const socialIcons: Record<string, IconType> = {
  instagram: SiInstagram,
  twitter: SiX,
  github: SiGithub,
  linkedin: SiLinkedin,
  facebook: SiFacebook,
};

const socialUrls: Record<string, string> = {
  instagram: "https://instagram.com/",
  twitter: "https://twitter.com/",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  facebook: "https://facebook.com/",
};

const CurrentPorCard = ({
  uid,
  year,
  name,
  designation,
  img,
  phone,
  socials,
}: {
  uid: string;
  year: number;
  name: string;
  designation: string;
  img: string;
  phone?: string;
  socials?: {
    site: string;
    username: string;
  }[];
}) => {
  const { canEdit } = useAuth("members:edit");
  const deleteMutation = useDeleteMutation();

  return (
    <Card className="relative flex max-w-80 flex-col border-b-2 border-l-0 border-r-0 border-t-0">
      <CardContent className="relative z-10 flex flex-col items-center gap-4 p-4">
        <Avatar className="h-36 w-36 border-2">
          <AvatarImage src={img} className="object-cover" />
        </Avatar>
        <div className="flex flex-col items-center self-stretch">
          {name}
          <span className="text-muted-foreground text-sm">{designation}</span>
        </div>
        <div className="text-muted-foreground flex items-center justify-between self-stretch">
          <div className="flex items-center gap-1">
            <PhoneIcon className="h-4 w-4" />
            {phone ?? "Not shared"}
          </div>
          <div className="flex items-center gap-1">
            {socials?.map((e, index) => {
              const Icon = socialIcons[e.site] ?? SiInstagram;
              return Object.keys(socialIcons).includes(e.site) ? (
                <a
                  key={index}
                  href={socialUrls[e.site] + e.username}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 flex h-6 w-6 items-center justify-center"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : null;
            })}
          </div>
        </div>
        {canEdit ? (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={() => deleteMutation.mutate({ uid, year })}
          >
            <TrashIcon className="h-4 w-4 opacity-40" />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CurrentPorCard;
