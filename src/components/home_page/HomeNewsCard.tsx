"use client";

import { CarouselItem } from "~/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { News } from "~/server/actions/news";

function HomeNewsCard({
  title,
  description,
  venue,
  timings,
  contactName,
  contactNumber,
  url,
}: News) {
  return (
    <CarouselItem key={title} className="basis-1/2 select-none">
      <Card className="-carbgd flex h-full max-h-full cursor-pointer flex-col rounded-lg hover:brightness-150">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex w-full flex-row justify-center gap-4">
              <span className="text-muted-foreground flex flex-row items-center justify-center gap-2">
                <CardTitle>Venue:</CardTitle>
                {venue}
              </span>
              <span className="text-muted-foreground flex flex-row items-center justify-center gap-2">
                <CardTitle>Timings:</CardTitle>
                {timings}
              </span>
            </div>
            <span className="text-muted-foreground flex flex-row items-center justify-center gap-2">
              <CardTitle>Contact:</CardTitle>
              {contactName} {contactNumber}
            </span>
            {url ? (
              <span className="text-muted-foreground flex flex-row items-center justify-center gap-2">
                <a href={url} className="hover:underline">
                  <CardTitle>Click here to register</CardTitle>
                </a>
              </span>
            ) : (
              <></>
            )}
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}

export default HomeNewsCard;
