import { type members } from "~/server/db/schema";

const memberData: (typeof members.$inferInsert)[] = [
  {
    team: "tech",
    name: "Aditya",
    link: null,
    uid: "f2022idk",
    year: 2024,
    ispor: true,
    designation: "President",
    ispoc: false,
    contact: "9289506096",
  },
  {
    team: null,
    name: "Deepti",
    link: "https://github.com/",
    uid: "f2022idk2",
    year: 2024,
    ispor: true,
    designation: "Secretary",
    ispoc: false,
    contact: "9915882930",
  },
  {
    team: null,
    name: "Sanchay",
    link: "https://instagram.com/",
    uid: "f2022idk3",
    year: 2024,
    ispor: true,
    designation: "Technical Head",
    ispoc: false,
    contact: "7990573763",
  },
];

export default memberData;
