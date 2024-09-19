import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ProfessorCard = ({
  name,
  designation,
  img,
}: {
  name: string;
  designation: string;
  img: string;
}) => {
  return (
    <Card className="flex max-w-80 cursor-pointer flex-col border-b-2 border-l-0 border-r-0 border-t-0 hover:brightness-150">
      <CardContent className="flex flex-col items-center gap-4 p-4">
        <Avatar className="h-28 w-28 border-2">
          <AvatarImage src={img} className="object-cover" />
        </Avatar>
        <div className="flex flex-col items-center">
          {name}
          <span className="text-sm text-muted-foreground">{designation}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessorCard;
