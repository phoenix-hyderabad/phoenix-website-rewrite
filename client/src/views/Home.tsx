import { MouseEventHandler, useEffect, useRef } from "react";
import HomeNewsCard from "@/components/home_page/HomeNewsCard";
import dummyImg from "@/assets/img1.png";

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
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const links = [
  {
    title: "Join Us",
    link: "/inductions",
  },
  {
    title: "What we do",
    link: "/about-us",
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

export interface News {
  title: string;
  description: string;
  url?: string;
  venue: string;
  timings: string;
  contactName: string;
  contactNumber: string;
}

const THRESHOLD = 50;

const handleImageHover: MouseEventHandler<HTMLDivElement> = (e) => {
  const { currentTarget, clientX, clientY } = e;
  const { left, top, height, width } = currentTarget.getBoundingClientRect();

  const horizontal = clientX - left - width / 2;
  const vertical = clientY - top - height / 2;
  const rotateX = ((horizontal / width) * -THRESHOLD).toFixed(2);
  const rotateY = ((vertical / height) * THRESHOLD).toFixed(2);
  currentTarget.style.transform = `perspective(${width}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
};

const resetImageTransform: MouseEventHandler<HTMLDivElement> = (e) => {
  e.currentTarget.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
};

const fetchNews = async (): Promise<News[]> => {
  const response = await axiosInstance.get<News[]>("/news/get");
  return response.data;
};

function Home() {
  const {
    data: news,
    isLoading,
    isError,
  } = useQuery<News[]>(["news"], fetchNews, {
    staleTime: Infinity,
    retry: 1,
  });

  const linksContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      if (!linksContainer.current) return;
      for (const elem of linksContainer.current.children) {
        if (
          !(elem instanceof HTMLAnchorElement || elem instanceof HTMLDivElement)
        )
          return;
        const rect = elem.getBoundingClientRect(),
          x = ev.clientX - rect.left,
          y = ev.clientY - rect.top;
        elem.style.setProperty("--mouse-x", `${x}px`);
        elem.style.setProperty("--mouse-y", `${y}px`);
      }
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
      <section id="about" className="relative w-full py-12">
        {/*<img src={img1} alt="About" className="h-full w-full object-cover absolute mix-blend-overlay" />*/}
        <div className="flex items-center gap-4 overflow-hidden text-left">
          <div className="flex flex-1 flex-col gap-4 py-24 max-md:items-center max-md:text-center md:pl-4">
            <h1 className="font-sans text-3xl uppercase tracking-widest">
              Perpetual Hankerers of Electronics
            </h1>
            <h2 className="text-4xl font-bold">PHoEnix</h2>
            <p className="font-sans text-lg">
              The PHoEnix Technical Association at BITS Pilani Hyderabad fosters
              innovation and collaboration among students from the Electronics
              and Engineering branches. Through projects, competitions, and
              mentorship, we create a dynamic learning environment while
              bridging students and faculty.
            </p>
          </div>
          <div
            className="flex h-full flex-1 select-none items-center justify-center py-24 will-change-transform max-md:hidden"
            onMouseMove={handleImageHover}
            onMouseLeave={resetImageTransform}
          >
            <img
              src="/phoenix-logo.svg"
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
          {isLoading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : isError ? (
            <div>Error while fetching news</div>
          ) : !news.length ? (
            <div>No news to show</div>
          ) : (
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
                  <HomeNewsCard
                    key={index}
                    url={item.url}
                    title={item.title}
                    description={item.description}
                    venue={item.venue}
                    timings={item.timings}
                    contactName={item.contactName}
                    contactNumber={item.contactNumber}
                  />
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          )}
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
              <QuickLinkCard key={index} to={link.link}>
                {link.title}
              </QuickLinkCard>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {/* <section
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
      </section> */}
    </div>
  );
}

export default Home;
