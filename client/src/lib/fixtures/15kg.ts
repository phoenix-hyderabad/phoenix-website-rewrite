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
          id: "gladiators",
          resultText: "",
          isWinner: true,
          status: "WALK_OVER",
          name: "Gladiators",
        },
      ],
    },
    {
      id: "1",
      name: "Match 1",
      nextMatchId: "4",
      nextLooserMatchId: "7",
      startTime: "11:00",
      state: "",
      participants: [
        {
          id: "orcur",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Orcur",
        },
        {
          id: "thriveforce",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Thriveforce",
        },
      ],
    },
    {
      id: "2",
      name: "Match 2",
      nextMatchId: "5",
      nextLooserMatchId: "6",
      startTime: "11:20",
      state: "",
      participants: [
        {
          id: "sniper",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Sniper",
        },
        {
          id: "wartex",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Wartex",
        },
      ],
    },
    {
      id: "3",
      name: "Match 3",
      nextMatchId: "5",
      nextLooserMatchId: "6",
      startTime: "11:40",
      state: "",
      participants: [
        {
          id: "arhtavinyak",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Arhtavinyak",
        },
        {
          id: "fatboy",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Fat Boy",
        },
      ],
    },
    {
      id: "4",
      name: "Match 4",
      nextMatchId: "9",
      nextLooserMatchId: "8",
      startTime: "15:00",
      state: "",
      participants: [
        {
          id: "hore",
          resultText: "",
          isWinner: false,
          status: "", // change to PLAYED
          name: "Hore",
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
      startTime: "15:20",
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
      name: "walk over",
      nextMatchId: "7",
      nextLooserMatchId: null,
      startTime: null,
      state: "WALK_OVER",
      participants: [
        // change to loser of match 1
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
