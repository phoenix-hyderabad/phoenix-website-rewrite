export interface CurrentYearTeamProps {
  current: true;
  year: string;
  pors: {
    student: string;
    designation: string;
    contact: string;
    socials?: { site: string; username: string }[];
  }[];
  members: {
    tech: { student: string; link?: string }[];
    editorial: { student: string; link?: string }[];
    design: { student: string; link?: string }[];
    it: { student: string; link?: string }[];
  };
}

export interface PastYearTeamProps {
  current?: false;
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
        socials: [
          {
            site: "github",
            username: "",
          },
          {
            site: "instagram",
            username: "",
          },
          {
            site: "linkedin",
            username: "",
          },
        ],
      },

      {
        student: "Deepti",
        designation: "Secretary",
        contact: "9915882930",
        socials: [
          {
            site: "github",
            username: "",
          },
          {
            site: "facebook",
            username: "",
          },
        ],
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
      tech: [
        {
          student: "p1",
          link: "https://github.com",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
        {
          student: "member",
          link: "",
        },
      ],
      editorial: [
        {
          student: "p1",
          link: "https://github.com",
        },
        {
          student: "pp",
          link: "",
        },
      ],
      design: [
        {
          student: "p1",
          link: "https://github.com",
        },
        {
          student: "p2 test",
          link: "",
        },
      ],
      it: [
        {
          student: "Shiv",
          link: "https://github.com",
        },
        {
          student: "Harshit",
          link: "",
        },
      ],
    },
  },
  {
    year: "2023-24",
    pors: [
      {
        student: "Ujjwal",
        designation: "President",
      },

      {
        student: "Hariharan",
        designation: "Secretary",
      },

      {
        student: "Shubhanga",
        designation: "Treasurer",
      },

      {
        student: "??",
        designation: "Technical Head",
      },
      {
        student: "Sanchay",
        designation: "Joint Secretary",
      },
      {
        student: "Vedant",
        designation: "Joint Treasurer",
      },
      {
        student: "Rickpoul",
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
