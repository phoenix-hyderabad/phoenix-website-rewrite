"use client";

import { type MouseEventHandler, useEffect, useRef } from "react";
import HomeNewsCard from "~/components/home_page/HomeNewsCard";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
} from "~/components/ui/carousel";

import QuickLinkCard from "~/components/home_page/QuickLinkCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { getNews } from "~/server/actions/news";
import Image from "next/image";

const links = [
  {
    title: "Join Us",
    link: "/inductions",
  },
  {
    title: "What we do",
    link: "/aboutus",
  },
  {
    title: "Projects",
    link: "/projects",
  },
  {
    title: "Resources",
    link: "/resources",
  },
];

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

const fetchNews = async () => {
  const data = await getNews();
  return data;
};

function Home() {
  const {
    data: news,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
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
        <div className="flex gap-4 overflow-hidden text-left">
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
            className="flex flex-1 select-none items-center justify-center py-24 will-change-transform max-md:hidden"
            onMouseMove={handleImageHover}
            onMouseLeave={resetImageTransform}
          >
            <Image
              src="/phoenix-logo.svg"
              alt="About"
              fill
              className="object-fit mx-auto max-w-64 opacity-50"
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
          ) : !news?.length ? (
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
                  <HomeNewsCard key={index} {...item} />
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
              <QuickLinkCard key={index} href={link.link}>
                {link.title}
              </QuickLinkCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
