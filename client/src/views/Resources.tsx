import ResourceCard from "@/components/resources_page/ResourceCard";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const resources = [
  {
    title: "First yr. Resources",
    description: "Contains all first year resources",
    subjects: [
      {
        name: "EEE F111",
        link: "https://drive.google.com/drive/folders/1IeiHCjwkkkG154Ij7SlQod-EZKtMbdpX?usp=drive_link",
      },
      {
        name: "Phy lab F110",
        link: "https://drive.google.com/drive/folders/1IwfvqlJaswSwK5vLRcE-BoYJRbl1rI1i?usp=drive_link",
      },
      {
        name: "Chem lab F110",
        link: "https://drive.google.com/drive/folders/1IstUwo9UpTNEwv4c25mWzcV3a2cov0FY?usp=drive_link",
      },
      {
        name: "Workshop",
        link: "https://drive.google.com/drive/folders/1IkbQKdiRLOlGKSJtF6UcpsYhkPwCzU6A?usp=drive_link",
      },
      {
        name: "MEOW",
        link: "https://drive.google.com/drive/folders/1IYz5ZRDtzQ28GyO8xxplDLX26xeG_4L2?usp=drive_link",
      },
      {
        name: "Gen Chem",
        link: "https://drive.google.com/drive/folders/1Ic-nxEhe4gDTuqg9BnM9cfUOPBQKtVWP?usp=drive_link",
      },
      {
        name: "M1 Math F111",
        link: "https://drive.google.com/drive/folders/1Im7WYfHDwH0MwCQu4Y-D_yPDzb5_uzaS?usp=drive_link",
      },
      {
        name: "Technical Report Writing",
        link: "https://drive.google.com/drive/folders/1Q2e8lJLrE_RsYcWrocku3BMU6IPbdvzM?usp=drive_link",
      },
      {
        name: "Engineering graphics",
        link: "https://drive.google.com/drive/folders/1J1jkyUPXWCNZg_SVirYqSyAMTVq_cJr-?usp=drive_link",
      },
      {
        name: "Bio lab",
        link: "https://drive.google.com/drive/folders/1ItEvRuXce7Jle5OfTQZen5N8OunKHPd-?usp=drive_link",
      },
      {
        name: "M2 Math F112",
        link: "https://drive.google.com/drive/folders/19psCcQ8l1yz2jVN6Z5BgMTOuB58UOiLb?usp=drive_link",
      },
      {
        name: "PnS Math F113",
        link: "https://drive.google.com/drive/folders/11EiCbmA0QjLVIUDMA2Pz6MXbbiZVeI0w?usp=drive_link",
      },
      {
        name: "Thermo",
        link: "https://drive.google.com/drive/folders/1IxLoUjpBIZPfCyX07_nAspGPqHdmf-rO?usp=drive_link",
      },
      {
        name: "CP F111",
        link: "https://drive.google.com/drive/folders/1SM-Y3yBDE-cCSuhr0TMtCoL_UqZnikWM?usp=drive_link",
      },
      {
        name: "Gen Bio F111",
        link: "https://drive.google.com/drive/folders/1IIE5s_HvrTzI3OUSUcMb9q8_LgYTKwok?usp=drive_link",
      },
    ],
  },
  {
    title: "2-1 Resources",
    description: "Contains Em, Emt, Ed, DD, M3, EVS",
    subjects: [
      {
        name: "Electrical Machines",
        link: "https://drive.google.com/drive/folders/1pY-mZwoHWJKx5utYQ2U_xWAyeMLVbCSB?usp=drive_link",
      },
      {
        name: "Electromagnetic Theory",
        link: "https://drive.google.com/drive/folders/1-6Fv3JK3mf-99YwpDmAYxGEzmlTfsoAv?usp=sharing",
      },
      {
        name: "Electronic Devices",
        link: "https://drive.google.com/drive/folders/1HIUfzPIhV1yzf1RhK3FvpKWjJhGAYMg8?usp=drive_link",
      },
      {
        name: "Digital Design",
        link: "https://drive.google.com/drive/folders/1sdu3OYFmh5hYi_u5tkDSn6uuRMUlbRQf?usp=drive_link",
      },
      {
        name: "Mathematics 3",
        link: "https://drive.google.com/drive/folders/1LoyKvIRpJDTizNRk9wdYaSA62AGtKZ95?usp=drive_link",
      },
      {
        name: "EVS",
        link: "https://drive.google.com/drive/folders/1PVpEII9ehYapKHV3KZ0Y-jPTZ1Q1wHcT?usp=drive_link",
      },
    ],
  },
  {
    title: "2-2 Resources",
    description: "Contains con sys, mec, mpi, poe and s&s",
    subjects: [
      {
        name: "Control System",
        link: "https://drive.google.com/drive/folders/1M4MXL7p-9DaTHzxjgBbMwtxn1F1zltOF?usp=drive_link",
      },
      {
        name: "Microelectronic Circuits",
        link: "https://drive.google.com/drive/folders/1_SnJxztUZNApwu-lHXDv5Slhv5D5GNQ0?usp=drive_link",
      },
      {
        name: "Microprosessors & interfacing",
        link: "https://drive.google.com/drive/folders/1yHM2S-3ApnhiXfXKS0ImTDQIRAKhhG1N?usp=drive_link",
      },
      {
        name: "POE",
        link: "https://drive.google.com/drive/folders/1ct354Asp1qx7HKVO7KHhfrhyivRkiYQf?usp=drive_link",
      },
      {
        name: "Signals & Systems",
        link: "https://drive.google.com/drive/folders/1hp1LN7W8ch4dC46dSAeddRZftXttjhjb?usp=drive_link",
      },
    ],
  },
  {
    title: "3-1 Resources",
    description: "Contains ADVD, Comm Sys, opti, DSP, EMFME",
    subjects: [
      {
        name: "ADVD",
        link: "https://drive.google.com/drive/folders/1DfxN_g0NQHjWO5Hhz0blzOPsnN8vH7oH?usp=drive_link",
      },
      {
        name: "Communications System",
        link: "https://drive.google.com/drive/folders/1NeJbECBRfo8ynbdGWCOnyfzmkrpmENmt?usp=drive_link",
      },
      {
        name: "Optimisation",
        link: "https://drive.google.com/drive/folders/11Am80sEGcg15B_sa55cFEqnNe4KgOYhi?usp=drive_link",
      },
      {
        name: "DSP",
        link: "https://drive.google.com/drive/folders/1DKtqTwcS-TGvL028AYxH9zhWVAgQYzk0?usp=sharing",
      },
      {
        name: "EMFME",
        link: "https://drive.google.com/drive/folders/1T-U4uf8TTNt_9zoBZwXu-cERgw7fSXs1?usp=drive_link",
      },
    ],
  },
  {
    title: "3-2 Resources",
    description: "Contains AE, PE, PS",
    subjects: [
      {
        name: "Power System",
        link: "https://drive.google.com/drive/folders/1QRSPTHxEkWa704rIwCRl1e9Tzy4Q0SHl?usp=drive_link",
      },
      {
        name: "Power Electronics",
        link: "https://drive.google.com/drive/folders/1D01wsckWPI5s5CTihYscyRgzBNiAIO9y?usp=drive_link",
      },
      {
        name: "Analog ELctronics",
        link: "https://drive.google.com/drive/folders/1tTkqu_SQNm1D9f77SyOFVRmQ2npz9Bvf?usp=drive_link",
      },
    ],
  },
  {
    title: "Electives",
    description: "Contains other important electives",
    subjects: [
      {
        name: "Artificial intelligence",
        link: "https://drive.google.com/drive/folders/1PQ9wkdq5dBQ20gIQt4-1Wz51y52lAp5R?usp=drive_link",
      },
      {
        name: "Blockchain",
        link: "https://drive.google.com/drive/folders/19cRYmniJSevHCIFhgZv9-5rXOTBdTg_Z?usp=drive_link",
      },
      {
        name: "Comics & Visual Culture",
        link: "https://drive.google.com/drive/folders/1NQGwzFMrB0uZErOl6TrU_dGXOn7P9BN2?usp=drive_link",
      },
      {
        name: "Computer Architecture",
        link: "https://drive.google.com/drive/folders/1gk_CVXeQhXTDLGltSh75LDW_QUitmZi9?usp=drive_link",
      },
      {
        name: "Control Systems Lab",
        link: "https://drive.google.com/drive/folders/1ckn6zGt9XTGgcTBGg5f-P9H1qavMwzNr?usp=drive_link",
      },
      {
        name: "DBMS",
        link: "https://drive.google.com/drive/folders/1mESs064k2q_-F9rza_knU__3wpIxrtCt?usp=drive_link",
      },
      {
        name: "Discrete mathematics",
        link: "https://drive.google.com/drive/folders/1RZVbw2UnWVeDcBVR60L_rCnV9VqpgnJJ?usp=drive_link",
      },
      {
        name: "EEC Lab",
        link: "https://drive.google.com/drive/folders/1-UWVJ0M3TqvgYKqFeZ84BB8kBnnJs-6f?usp=drive_link",
      },
      {
        name: "FDSA",
        link: "https://drive.google.com/drive/folders/1-tBLWCnHNY41yTeZVp0SxsKeY4bVO80D?usp=drive_link",
      },
      {
        name: "Linguistics",
        link: "https://drive.google.com/drive/folders/1HbipmUtjLIjvX60013c4vcrrq7s6BbcW?usp=drive_link",
      },
      {
        name: "ML",
        link: "https://drive.google.com/drive/folders/1p4096xv5IA6SKUmvhS_wlxIjZnR_ABOU?usp=drive_link",
      },
      {
        name: "OOPS",
        link: "https://drive.google.com/drive/folders/1dsKQZGPZ2qlMi7UgMQiY2wWJb7dK99wA?usp=drive_link",
      },
      {
        name: "OS",
        link: "https://drive.google.com/drive/folders/1jnCzCs62L8gG0F3dqd4AIXYWSWto605E?usp=drive_link",
      },
    ],
  },
];

function Resources() {
  const cardsContainer = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const moveEvent = (ev: MouseEvent) => {
      if (!cardsContainer.current) return;
      for (const elem of cardsContainer.current.children) {
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
  }, [cardsContainer]);

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-8 text-center">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Phoenix drive resources</h3>
        <p className="text-sm text-muted-foreground">
          A hub of all the resources that you need to get started with your
          placements, mid-sems, comprehensives, quizzes, etc.
          <br />
          This is a gift from our seniors and the legacy will be continued by
          us.
        </p>
      </div>
      <Dialog>
        <DialogContent className="flex max-h-[90vh] flex-col">
          <DialogHeader>
            <DialogTitle>{resources[selectedIndex].title}</DialogTitle>
            <DialogDescription className="hidden">
              {resources[selectedIndex].description}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex max-h-full flex-col" type="always">
            <ul className="h-full divide-y-2 divide-accent-foreground/50">
              {resources[selectedIndex].subjects.map((subject, index) => (
                <li key={index} className="flex flex-col">
                  <a
                    href={subject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-[.4rem] hover:bg-accent/50 focus:bg-accent/50 active:bg-accent"
                  >
                    {subject.name}
                  </a>
                </li>
              ))}
            </ul>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </DialogContent>

        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4"
          ref={cardsContainer}
        >
          {resources.map((el, index) => (
            <ResourceCard
              key={index}
              heading={el.title}
              subheading={el.description}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
}

export default Resources;
