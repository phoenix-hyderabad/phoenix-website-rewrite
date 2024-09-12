import { useEffect, useRef} from "react";
import HomeNewsCard from "@/components/ui/HomeNewsCard";
import ResourceCard from "@/components/resources_page/ResourceCard";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog } from "@radix-ui/react-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const news = [
  {
    title: "Upcoming Workshop: Personal Branding",
    description:
      "Join us for an interactive workshop on building a strong personal brand. Learn from industry experts and network with like-minded individuals.",
    date: "June 15, 2023",
  },
  {
    title: "New Mentorship Program Launched",
    description:
      "We're excited to announce the launch of our new mentorship program, connecting aspiring professionals with experienced industry leaders.",
    date: "May 1, 2023",
  },
  {
    title: "New Mentorship Program Launched",
    description:
      "We're excited to announce the launch of our new mentorship program, connecting aspiring professionals with experienced industry leaders.",
    date: "May 1, 2023",
  },
];

const links = [
  {
    title: "Join Us",
    link: "/join",
  },
  {
    title: "Programs",
    link: "/programs",
  },
  {
    title: "Events",
    link: "/events",
  },
  {
    title: "Resources",
    link: "/resources",
  },
];

const projects = [
  {
    title: "Scholarship Program",
    description:
      "Providing financial assistance to underprivileged students to help them access quality education.",
    link:"",
  },
  {
    title: "Community Outreach",
    description:
      "Organizing workshops, volunteering initiatives, and social impact programs to support local communities.",
    link:"",
  },
  {
    title: "Digital Literacy Initiative",
    description:
      "Bridging the digital divide by providing technology training and access to underserved communities.",
    link:"",
  },
  {
    title:"Entrepreneurship Acceleration",
    description:"Supporting aspiring entrepreneurs with mentorship, resources, and funding to help them launch successful ventures.",
    link:"",
  },
];

function Home() {
  const linksContainer = useRef<HTMLDivElement>(null);
  const linkRefs = links.map((_) => useRef<HTMLDivElement>(null));
  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      linkRefs.forEach((targetRef:any) => {
        const target = targetRef.current;
        if (!target) return;
        const rect = target.getBoundingClientRect(),
          x = ev.clientX - rect.left,
          y = ev.clientY - rect.top;
        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    if (matchMedia("(pointer:fine)").matches) {
      window.addEventListener("mousemove", moveEvent);
    }

    return () => {
      window.removeEventListener("mousemove", moveEvent);
    };
  }, [linksContainer]);

  return (
    <div className="mx-auto flex max-w-full flex-col items-center gap-8 text-center">
      <section id="about" className="relative w-full shadow-xl">
        {/*<img src={img1} alt="About" className="h-full w-full object-cover absolute mix-blend-overlay" />*/}
        <div className="container grid h-full gap-8 px-8 py-[100px] text-left md:grid-cols-2 md:py-24">
          <div className="space-y-4 pl-4">
            <h1 className="font-sans text-3xl uppercase tracking-widest">
              Perpetual Hankerers of Electronics
            </h1>
            <h2 className="text-4xl font-bold">PhOeNiX</h2>
            <p className="font-sans text-lg">
              Phoenix Technical Association is a dynamic and student-driven
              organization that stands as a testament to the vibrant spirit of
              innovation and collaboration within our academic community.
            </p>
          </div>
          {/* { <div className="flex items-center justify-center">
              <img
                src={img1}
                alt="About"
                className="rounded-xl object-fill h-full"
                
              />
            </div> } */}
        </div>
      </section>



      {/* News */}
      <section id="news" className="py-12 md:py-24">
        <div className="container grid h-96 gap-8 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">News and Events</h2>
            <p className="text-muted-foreground">
              Stay up-to-date with the latest news, upcoming events, and
              important announcements from the Phoenix Association.
            </p>
          </div>
          <div className="grid">
            <Carousel
              opts={{
                align: "start",
              }}
              className="max-h-80"
              orientation="vertical"
            >
              <CarouselPrevious />
              <CarouselContent className="max-h-80">
                {news.map((item, index) => (
                  <HomeNewsCard key={index} item={item} index={index} />
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>


      {/* Quick Links */}
      <section id="links" className="pb-12 md:pb-24 w-full flex justify-center">
        <div className="container grid h-96 gap-8 md:grid-cols-2 md:px-6">
        <div className="space-y-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold">Quick Links</h2>
            <p className="text-muted-foreground">
            Access important information and resources with ease.
            </p>
          </div>
          <div className="h-full flex items-center justify-center w-full">
          <Dialog>
          <div className="grid grid-cols-2 gap-8 h-fit" ref={linksContainer}>
            {links.map((link, index) => (
              <ResourceCard key={index} heading={link.title} subheading="" onClick={()=>{console.log(link.link)}} ref={linkRefs[index]} />
            ))}
          </div>
          </Dialog>
          </div>
        </div>
      </section>


            {/* Projects */}
      <section id="links" className="pb-12 md:pb-24 w-full flex justify-center">
        <div className="container grid h-96 gap-8 md:grid-cols-2 md:px-6">
        <div className="space-y-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-muted-foreground">
              Discover the impactful initiatives led by the Phoenix Association.
            </p>
          </div>
          <div className="h-full flex items-center justify-center w-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-8">
            {projects.map((project, index) => {
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                  </CardContent>
                  <CardFooter>
                    <a href={project.link}>Learn More</a>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
