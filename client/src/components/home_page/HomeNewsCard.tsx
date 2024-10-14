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
    <CarouselItem key={index} className="basis-1/2 select-none">
      <Card className="flex h-full max-h-full cursor-pointer flex-col rounded-lg -carbgd hover:brightness-150">
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-1 items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{item.date}</span>
          </div>
        </CardFooter>
      </Card>
    </CarouselItem>
  );
}

export default HomeNewsCard;
