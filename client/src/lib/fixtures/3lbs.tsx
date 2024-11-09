import { type MatchType } from "src/components/brackets/types";

const dataDoublePlayoffs: { upper: MatchType[]; lower: MatchType[] } = {
  upper: [
    {
      id: "1",
      name: "1",
      nextMatchId: "3",
      nextLooserMatchId: "4",
      startTime: "Sat Nov 09 2024 13:20:00 GMT+0530",
      state: "",
      participants: [
        {
          id: "kira",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Kira",
        },
        {
          id: "scarlet",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Scarlet",
        },
      ],
    },
    {
      id: "2",
      name: "2",
      nextMatchId: "5",
      nextLooserMatchId: "4",
      startTime: "Sat Nov 09 2024 13:00:00 GMT+0530",
      state: "", // change to SCORE_DONE
      participants: [
        {
          id: "wartex",
          resultText: "", // can be anything
          isWinner: false,
          status: "", // change to PLAYED
          name: "Wartex",
        },
        {
          id: "byte",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Byte",
        },
      ],
    },
    {
      id: "3",
      name: "3",
      nextMatchId: "5",
      nextLooserMatchId: "6",
      startTime: "Sat Nov 09 2024 17:40:00 GMT+0530",
      state: "", // change to SCORE_DONE
      participants: [
        {
          id: "orcus",
          resultText: "", // can be anything
          isWinner: false,
          status: "", // change to PLAYED
          name: "Orcus",
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
      name: "5",
      nextMatchId: "8",
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
      id: "8", // finals
      name: "8",
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
        //change to winner of match 5 and 7
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
      id: "4",
      name: "4",
      nextMatchId: "6",
      nextLooserMatchId: null,
      startTime: "Sat Nov 09 2024 18:00:00 GMT+0530",
      state: "",
      participants: [
        //   {
        //     id: "orcus",
        //     resultText: "",
        //     isWinner: false,
        //     status: "", // change to PLAYED
        //     name: "Orcus",
        //   },
        //change to losers of match 1 and 2
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
      id: "6",
      name: "6",
      nextMatchId: "7",
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
        //change to winner of match 4 and loser of 3
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
      name: "7",
      nextMatchId: "8",
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
        //change to winner of match 6 and loser of 5
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
