import { type MatchType } from "src/components/brackets/types";

const dataDoublePlayoffs: { upper: MatchType[]; lower: MatchType[] } = {
  upper: [
    {
      id: "0",
      name: "",
      nextMatchId: "4",
      nextLooserMatchId: null,
      startTime: null,
      state: "NO_SHOW",
      participants: [
        {
          id: "Hori",
          resultText: "",
          isWinner: true,
          status: "",
          name: "Hori",
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
    {
      id: "4",
      name: "Match 4",
      nextMatchId: "9",
      nextLooserMatchId: "8",
      startTime: "16:20",
      state: "",
      participants: [
        {
          id: "Hori",
          resultText: "",
          isWinner: false,
          status: "", // change to PLAYED
          name: "Hori",
        },
        //change to winner of match 1
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "5",
      name: "Match 5",
      nextMatchId: "9",
      nextLooserMatchId: "7",
      startTime: "TBD",
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to winner of match 2 and 3
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "9",
      name: "Match 9",
      nextMatchId: "12",
      nextLooserMatchId: "11",
      startTime: "TBD",
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to winner of match 4 and 5
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "12",
      name: "Match 12",
      nextMatchId: null,
      nextLooserMatchId: null,
      startTime: "TBD",
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to winner of match 9 and 11
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
  ],
  lower: [
    {
      id: "-4",
      name: "",
      nextMatchId: "7",
      nextLooserMatchId: null,
      startTime: null,
      state: "NO_SHOW",
      participants: [
        // change to loser of match 1
        {
          id: "TBD",
          resultText: "",
          isWinner: true,
          status: "",
          name: "TBD",
        },
      ],
    },
    {
      id: "6",
      name: "Match 6",
      nextMatchId: "8",
      nextLooserMatchId: null,
      startTime: null,
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to losers of match 2 and 3
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "8",
      name: "Match 8",
      nextMatchId: "10",
      nextLooserMatchId: null,
      startTime: null,
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to losers of match 6 and 4
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "7",
      name: "Match 7",
      nextMatchId: "10",
      nextLooserMatchId: null,
      startTime: null,
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to losers of match 1 and 5
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "10",
      name: "Match 10",
      nextMatchId: "11",
      nextLooserMatchId: null,
      startTime: null,
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to losers of match 8 and 7
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
    {
      id: "11",
      name: "Match 11",
      nextMatchId: "12",
      nextLooserMatchId: null,
      startTime: null,
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to losers of match 9 and 10
        //   {
        //     id: "byte",
        //     resultText: "",
        //     isWinner: false,
        //     status: "",
        //     name: "Byte",
        //   },
      ],
    },
  ],
};
export default dataDoublePlayoffs;
