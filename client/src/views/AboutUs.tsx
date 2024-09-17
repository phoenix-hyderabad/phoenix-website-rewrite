import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TabsTriggerProps } from "@radix-ui/react-tabs";
import professors from "@/lib/professor_data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const StyledTabTrigger = ({
  className,
  children,
  ...props
}: TabsTriggerProps) => {
  return (
    <TabsTrigger
      className={cn(
        className,
        "text-lg transition-none data-[state=active]:border data-[state=active]:text-accent-foreground"
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  );
};

const ProfessorCard = ({
  name,
  designation,
  coverImage,
}: {
  name: string;
  designation: string;
  coverImage: string;
}) => {
  return (
    <Card className="flex max-w-80 cursor-pointer flex-col hover:brightness-150">
      <CardContent className="flex flex-col items-center gap-4 p-4">
        <Avatar className="h-28 w-28 border-2">
          <AvatarImage src={coverImage} />
        </Avatar>
        <span>{name}</span>
        <span className="text-sm text-muted-foreground">{designation}</span>
      </CardContent>
    </Card>
  );
};

function getImgUrl(name: string) {
  return new URL(`${name}`, import.meta.url).href;
}

const AboutUs = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <Tabs defaultValue="about">
        <TabsList className="gap-2 bg-background">
          <StyledTabTrigger value="about">About Us</StyledTabTrigger>
          <StyledTabTrigger value="profs">Professors</StyledTabTrigger>
          <StyledTabTrigger value="team">Team</StyledTabTrigger>
        </TabsList>
        <TabsContent value="about" className="flex flex-col">
          <h2 className="font-phoenix pb-4 pt-8 text-center text-6xl text-accent-foreground">
            The PHoEnix assoc
          </h2>
          <h4 className="text-xl text-muted-foreground">Brief History</h4>
          <h4 className="text-xl text-muted-foreground">Objective</h4>
        </TabsContent>
        <TabsContent value="profs" className="flex flex-col">
          <h2 className="pb-4 text-center text-3xl">Professors</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
            {professors.map((e, index) => (
              <ProfessorCard
                key={index}
                name={e.faculty}
                designation={e.Designation}
                coverImage={`/professorImages/${e.faculty}.png`}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="team" className="pt-4">
          Team
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutUs;
