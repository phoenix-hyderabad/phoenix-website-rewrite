import { CarouselItem } from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { News } from "@/views/Home";

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
              <span className="flex flex-row items-center justify-center gap-2 text-muted-foreground">
                <CardTitle>Venue:</CardTitle>
                {venue}
              </span>
              <span className="flex flex-row items-center justify-center gap-2 text-muted-foreground">
                <CardTitle>Timings:</CardTitle>
                {timings}
              </span>
            </div>
            <span className="flex flex-row items-center justify-center gap-2 text-muted-foreground">
              <CardTitle>Contact:</CardTitle>
              {contactName} {contactNumber}
            </span>
            {url ? (
              <span className="flex flex-row items-center justify-center gap-2 text-muted-foreground">
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
