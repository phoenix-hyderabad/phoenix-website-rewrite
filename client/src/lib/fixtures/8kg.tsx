import { type MatchType } from "src/components/brackets/types";

const dataDoublePlayoffs: { upper: MatchType[]; lower: MatchType[] } = {
  upper: [
    {
      id: "-234",
      name: "",
      nextMatchId: "2",
      nextLooserMatchId: null,
      startTime: null,
      state: "NO_SHOW",
      participants: [
        {
          id: "wartex",
          resultText: "",
          isWinner: true,
          status: "",
          name: "Wartex",
        },
      ],
    },
    {
      id: "-2344",
      name: "",
      nextMatchId: "2",
      nextLooserMatchId: null,
      startTime: null,
      state: "NO_SHOW",
      participants: [
        {
          id: "byte",
          resultText: "",
          isWinner: true,
          status: "",
          name: "Byte",
        },
      ],
    },
    {
      id: "1",
      name: "Match 1",
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
      id: "0",
      name: "",
      nextMatchId: "3",
      nextLooserMatchId: null,
      startTime: "Sat Nov 09 2024 13:20:00 GMT+0530",
      state: "NO_SHOW",
      participants: [
        {
          id: "orcus",
          resultText: "",
          isWinner: true,
          status: "",
          name: "Orcus",
        },
      ],
    },
    {
      id: "3",
      name: "Match 3",
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
      id: "2",
      name: "Match 2",
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
      id: "-22344",
      name: "",
      nextMatchId: "4",
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
      id: "-1919",
      name: "-",
      nextMatchId: "-1344",
      nextLooserMatchId: null,
      startTime: null,
      state: "WALK_OVER",
      participants: [
        // leave blank
      ],
    },
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
      id: "-1344",
      name: "walk over",
      nextMatchId: "6",
      nextLooserMatchId: null,
      startTime: null,
      state: "WALK_OVER",
      participants: [
        // change to loser of match 3
        {
          id: "TBD",
          resultText: "",
          isWinner: true,
          status: "WALK_OVER",
          name: "TBD",
        },
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
