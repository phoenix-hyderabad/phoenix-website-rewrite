import { type MatchType } from "src/components/brackets/types";

const dataDoublePlayoffs: { upper: MatchType[]; lower: MatchType[] } = {
  upper: [
    {
      id: "0",
      name: "walk over",
      nextMatchId: "4",
      nextLooserMatchId: null,
      startTime: null,
      state: "WALK_OVER",
      participants: [
        {
          id: "hore",
          resultText: "",
          isWinner: true,
          status: "WALK_OVER",
          name: "Hore",
        },
      ],
    },
    {
      id: "1",
      name: "Match 1",
      nextMatchId: "4",
      nextLooserMatchId: "7",
      startTime: "Sat Nov 09 2024 12:00:00 GMT+0530",
      state: "",
      participants: [
        {
          id: "raven",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Raven",
        },
        {
          id: "jalgaar4",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Jalgaar 4WD",
        },
      ],
    },
    {
      id: "2",
      name: "Match 2",
      nextMatchId: "5",
      nextLooserMatchId: "6",
      startTime: "Sat Nov 09 2024 12:20:00 GMT+0530",
      state: "",
      participants: [
        {
          id: "evangelion",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Evangelion",
        },
        {
          id: "jalgaard",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Jalgaar Flip",
        },
      ],
    },
    {
      id: "3",
      name: "Match 3",
      nextMatchId: "5",
      nextLooserMatchId: "6",
      startTime: "Sat Nov 09 2024 12:40:00 GMT+0530",
      state: "",
      participants: [
        {
          id: "goth",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Goth Barbie",
        },
        {
          id: "jalgaar2",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Jalgaar 2WD",
        },
      ],
    },
  ],
  lower: [],
};
export default dataDoublePlayoffs;
