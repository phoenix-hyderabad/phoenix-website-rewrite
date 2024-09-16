import { MouseEventHandler, useEffect, useRef } from "react";
import HomeNewsCard from "@/components/home_page/HomeNewsCard";
import dummyImg from "@/assets/img1.png";
import phoenixLogo from "@/assets/phoenix-logo.svg";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QuickLinkCard from "@/components/home_page/QuickLinkCard";

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
    link: "",
    cover: dummyImg,
  },
  {
    title: "Community Outreach",
    description:
      "Organizing workshops, volunteering initiatives, and social impact programs to support local communities.",
    link: "",
    cover: dummyImg,
  },
  {
    title: "Digital Literacy Initiative",
    description:
      "Bridging the digital divide by providing technology training and access to underserved communities.",
    link: "",
    cover: dummyImg,
  },
  {
    title: "Entrepreneurship Acceleration",
    description:
      "Supporting aspiring entrepreneurs with mentorship, resources, and funding to help them launch successful ventures.",
    link: "",
    cover: dummyImg,
  },
];

const THRESHOLD = 50;

const handleImageHover: MouseEventHandler<HTMLDivElement> = (e) => {
  const { currentTarget, clientX, clientY } = e;
  const { left, top, height, width } = currentTarget.getBoundingClientRect();

  const horizontal = clientX - left - width / 2;
  const vertical = clientY - top - height / 2;
  const rotateX = ((horizontal / width) * THRESHOLD).toFixed(2);
  const rotateY = ((vertical / height) * THRESHOLD).toFixed(2);
  currentTarget.style.transform = `perspective(${width}px) rotateX(${rotateY}deg) rotateY(${-rotateX}deg) scale3d(1, 1, 1)`;
};

const resetImageTransform: MouseEventHandler<HTMLDivElement> = (e) => {
  e.currentTarget.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
};

function Home() {
  const linksContainer = useRef<HTMLDivElement>(null);
  const linkRefs = links.map((_) => useRef<HTMLAnchorElement>(null));

  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      linkRefs.forEach((targetRef) => {
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
    <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center gap-8 px-8 text-center">
      <section id="about" className="relative w-full py-12 shadow-xl">
        {/*<img src={img1} alt="About" className="h-full w-full object-cover absolute mix-blend-overlay" />*/}
        <div className="flex items-center gap-4 overflow-hidden text-left">
          <div className="flex flex-1 flex-col gap-4 py-24 max-md:items-center max-md:text-center md:pl-4">
            <h1 className="font-sans text-3xl uppercase tracking-widest">
              Perpetual Hankerers of Electronics
            </h1>
            <h2 className="text-4xl font-bold">PHoEnix</h2>
            <p className="font-sans text-lg">
              Phoenix Technical Association is a dynamic and student-driven
              organization that stands as a testament to the vibrant spirit of
              innovation and collaboration within our academic community.
            </p>
          </div>
          <div
            className="flex h-full flex-1 select-none items-center justify-center py-24 will-change-transform max-md:hidden"
            onMouseMove={handleImageHover}
            onMouseLeave={resetImageTransform}
          >
            <img
              src={phoenixLogo}
              alt="About"
              className="object-fit h-full max-w-64 opacity-50"
            />
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-12">
        <div className="container flex flex-col items-center gap-8 md:flex-row">
          <div className="flex flex-col justify-center gap-4 md:flex-1">
            <h2 className="text-3xl font-bold">News and Events</h2>
            <p className="text-muted-foreground">
              Stay up-to-date with the latest news, upcoming events, and
              important announcements from the Phoenix Association.
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            orientation="vertical"
            className="md:flex-1"
          >
            <CarouselContent className="h-[25rem]">
              {news.map((item, index) => (
                <HomeNewsCard key={index} item={item} index={index} />
              ))}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Quick Links */}
      <section id="links" className="flex w-full justify-center py-12">
        <div className="container flex flex-col items-center gap-8 md:h-96 md:flex-row">
          <div className="flex flex-col justify-center gap-4 md:flex-1">
            <h2 className="text-3xl font-bold">Quick Links</h2>
            <p className="text-muted-foreground">
              Access important information and resources with ease.
            </p>
          </div>
          <div
            className="grid h-min grid-cols-2 gap-8 md:flex-1"
            ref={linksContainer}
          >
            {links.map((link, index) => (
              <QuickLinkCard key={index} ref={linkRefs[index]} to={link.link}>
                {link.title}
              </QuickLinkCard>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="flex w-full flex-col justify-center gap-8 py-12 lg:flex-row"
      >
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <p className="text-muted-foreground">
            Discover the impactful initiatives led by the Phoenix Association.
          </p>
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="grid gap-8 sm:grid-cols-2">
            {projects.map((project, index) => {
              return (
                <Card
                  key={index}
                  className="flex cursor-pointer flex-col hover:brightness-150"
                >
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src={project.cover} decoding="async" loading="lazy" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
