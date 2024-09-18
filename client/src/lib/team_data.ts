export interface CurrentYearTeamProps {
  current: true;
  year: string;
  pors: {
    student: string;
    designation: string;
    contact: string;
  }[];
  members: {
    tech: string[];
    editorial: string[];
    design: string[];
    it: string[];
  };
}

export interface PastYearTeamProps {
  current: false;
  year: string;
  pors: {
    student: string;
    designation: string;
  }[];
  members: {
    tech: string[];
    editorial: string[];
    design: string[];
    it: string[];
  };
}

export type TeamProps = CurrentYearTeamProps | PastYearTeamProps;

const team: TeamProps[] = [
  {
    year: "2024-25",
    current: true,
    pors: [
      {
        student: "Aditya",
        designation: "President",
        contact: "9289506096",
      },

      {
        student: "Deepti",
        designation: "Secretary",
        contact: "9915882930",
      },

      {
        student: "Harsh",
        designation: "Treasurer",
        contact: "9032519462",
      },

      {
        student: "Sanchay",
        designation: "Technical Head",
        contact: "7990573763",
      },

      {
        student: "Harish",
        designation: "Editorial Head",
        contact: "7358399892",
      },

      {
        student: "Bipul",
        designation: "Joint Secretary",
        contact: "9844172196",
      },

      {
        student: "Mrinal",
        designation: "Joint Treasurer",
        contact: "9591961051",
      },
      {
        student: "Nysa",
        designation: "Design head",
        contact: "9810537112",
      },
    ],
    members: {
      tech: ["p1", "p2", "p3"],
      editorial: ["p1", "p2", "p3"],
      design: ["p1", "p2", "p3"],
      it: ["p1", "p2", "p3"],
    },
  },
  {
    year: "2020-21",
    pors: [
      {
        student: "Idk",
        designation: "President",
      },

      {
        student: "Idk",
        designation: "Secretary",
      },

      {
        student: "no idea",
        designation: "Treasurer",
      },

      {
        student: "???",
        designation: "Technical Head",
      },

      {
        student: "ok",
        designation: "Editorial Head",
      },

      {
        student: "idk",
        designation: "Joint Secretary",
      },

      {
        student: "hmm",
        designation: "Joint Treasurer",
      },
      {
        student: "?????",
        designation: "Design head",
      },
    ],
    members: {
      tech: ["p1", "p2", "p3"],
      editorial: ["p1", "p2", "p3"],
      design: ["p1", "p2", "p3"],
      it: ["p1", "p2", "p3"],
    },
  },
];

export default team;
