import { CarouselItem } from "@/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
interface HomeNewsCardProps {
  item: {
    title: string;
    description: string;
    date: string;
  };
  index: number;
}
function HomeNewsCard({ item, index }: HomeNewsCardProps) {
  return (
    <CarouselItem key={index} className="h-40 hover:brightness-150">
      <Card className="rounded-lg bg-background p-4">
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardFooter className="gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{item.date}</span>
          </div>
          <Link
            to="#"
            className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
          >
            Learn More
          </Link>
        </CardFooter>
      </Card>
    </CarouselItem>
  );
}

export default HomeNewsCard;
