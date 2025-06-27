"use client";

import liveWire24 from "~/assets/livewire/2024.png";
import liveWire21 from "~/assets/livewire/2021.jpg";
import liveWire18 from "~/assets/livewire/2018.png";
import liveWire15 from "~/assets/livewire/2015.png";
import liveWire14 from "~/assets/livewire/2014.png";
import liveWire13 from "~/assets/livewire/2013.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import Image from "next/image";

const livewireEditions = [
  {
    year: "2024",
    coverImage: liveWire24,
    name: "LiveWire '24",
    description:
      "Check out our latest edition of LiveWire! Dive into the best content curated by our team.",
    isCurrent: true,
    readNowLink:
      "https://drive.google.com/file/d/1PTI5qcXDnLiz7yP3eypnOX3FjqZS9qMy/view?usp=sharing",
  },
  {
    year: "2020-2021",
    coverImage: liveWire21,
    name: "LiveWire '21",
    description: "The 2020-21 edition featuring insightful articles.",
    readNowLink:
      "https://drive.google.com/file/d/1GHBKw2BryHHFby0T66KEOx0DUXjV-AEy/view?usp=sharing",
  },
  {
    year: "2018",
    coverImage: liveWire18,
    name: "LiveWire '18",
    description: "Explore the highlights of 2018 in this edition.",
    readNowLink:
      "https://drive.google.com/file/d/1U6OZdOswgQEzvBTIjsNMhnItOrcjgKuI/view?usp=sharing",
  },
  {
    year: "2015",
    coverImage: liveWire15,
    name: "LiveWire '15",
    description: "Our 2015 edition with top stories of the year.",
    readNowLink:
      "https://drive.google.com/file/d/0B7b_-u_ESd9wMUNJRjlLN212aDQ/view?usp=sharing&resourcekey=0-C2GndxijEeEw9gbCBdHEPw",
  },
  {
    year: "2014",
    coverImage: liveWire14,
    name: "LiveWire '14",
    description: "2014 edition with stories of the year.",
    readNowLink:
      "https://drive.google.com/file/d/0B7b_-u_ESd9weVo3Uk1ycDFzRkE/view?usp=sharing&resourcekey=0-m5YGZhALe0mPw0u0hG78rg",
  },
  {
    year: "2013",
    coverImage: liveWire13,
    name: "LiveWire '13",
    description: "2013 edition with amazing stories",
    readNowLink:
      "https://drive.google.com/file/d/0B7b_-u_ESd9wUGZVQUZTTlo4dms/view?usp=sharing&resourcekey=0-CPSpC_res4iI1vTG_3Cafw",
  },
];

function LiveWire() {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-bold">LiveWire</h3>
        <p className="text-md text-muted-foreground">
          LiveWire is a platform for students to showcase their talents and
          skills. It is a platform where students can share their projects,
          blogs, and other creative works with the world.
        </p>
      </div>
      <section
        id="about"
        className="relative grid w-full grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] pb-4"
      >
        <div className="flex items-center gap-4 overflow-hidden text-left max-md:flex-col">
          <div className="flex flex-1 flex-col gap-2 py-24 max-md:items-center max-md:text-center md:pl-4">
            <h2 className="text-4xl font-bold">{livewireEditions[0]!.name}</h2>
            <p className="text-lg">
              Check out our latest edition of LiveWire! Dive into the best
              content curated by our team.
            </p>
            <a
              href={livewireEditions[0]!.readNowLink}
              className="hover:cursor-pointer"
            >
              <button className="bg-border flex items-center justify-center rounded-lg px-2 py-2 font-bold text-gray-400 brightness-125 hover:cursor-pointer hover:brightness-150">
                Read More
              </button>
            </a>
          </div>

          <div className="flex h-full flex-1 select-none items-center justify-center py-24 will-change-transform max-md:py-12">
            <a href={livewireEditions[0]!.readNowLink}>
              <Image
                src={livewireEditions[0]!.coverImage}
                alt="About"
                className="object-fit hover:brigthness-150 h-full max-w-72 shadow-2xl shadow-indigo-500/50 hover:cursor-pointer"
              />
            </a>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-8">
        <h3 className="text-2xl">Check out our past editions!</h3>

        <Carousel
          className=""
          opts={{
            align: "start",
            loop: true,
          }}
          orientation="horizontal"
        >
          <CarouselPrevious />
          <CarouselContent className="max-lg:w-[70dvw] max-md:w-[70dvw]">
            {livewireEditions.slice(1).map((edition, index) => (
              <CarouselItem
                key={index}
                className="mr-2 basis-1/2 max-lg:basis-1/2 max-md:basis-full"
              >
                <div className="m-2 flex h-1/5 flex-col gap-2 p-2">
                  <h4 className="text-3xl font-bold">{edition.name}</h4>
                  <p className="text-lg">{edition.description}</p>
                  <a className="flex justify-center" href={edition.readNowLink}>
                    <button className="bg-border flex items-center justify-center rounded-lg px-2 py-2 font-bold text-gray-400 brightness-125 hover:cursor-pointer hover:brightness-150">
                      Read More
                    </button>
                  </a>
                </div>
                <div className="flex h-full select-none items-center justify-center pb-12 pt-4 will-change-transform">
                  <a href={edition.readNowLink}>
                    <Image
                      src={edition.coverImage}
                      alt="About"
                      className="object-fit hover:brigthness-150 h-full max-w-72 shadow-2xl hover:cursor-pointer"
                    />
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}

export default LiveWire;
