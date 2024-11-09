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
          id: "gladiators",
          resultText: "",
          isWinner: false,
          status: "",
          name: "Gladiators",
        },
      ],
    },
    {
      id: "1",
      name: "Match 1",
      nextMatchId: "4",
      nextLooserMatchId: "7",
      startTime: null,
      state: "",
      participants: [
        {
          id: "orcur",
          resultText: "LOST",
          isWinner: false,
          status: "",
          name: "Orcus",
        },
        {
          id: "thriveforce",
          resultText: "WON",
          isWinner: true,
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
      startTime: null,
      state: "",
      participants: [
        {
          id: "sniper",
          resultText: "LOST",
          isWinner: false,
          status: "",
          name: "Sniper",
        },
        {
          id: "wartex",
          resultText: "WON",
          isWinner: true,
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
      startTime: null,
      state: "",
      participants: [
        {
          id: "blackdiamond",
          resultText: "WON",
          isWinner: true,
          status: "",
          name: "Black Diamond",
        },
        {
          id: "fatboy",
          resultText: "",
          isWinner: false,
          status: "LOST",
          name: "Fat Boy",
        },
      ],
    },
    {
      id: "4",
      name: "Match 4",
      nextMatchId: "9",
      nextLooserMatchId: "8",
      startTime: null,
      state: "",
      participants: [
        {
          id: "gladiators",
          resultText: "",
          isWinner: false,
          status: "", // change to PLAYED
          name: "Gladiators",
        },
        //change to winner of match 1
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
      id: "5",
      name: "Match 5",
      nextMatchId: "9",
      nextLooserMatchId: "7",
      startTime: null,
      state: "",
      participants: [
          {
            id: "wartex",
            resultText: "",
            isWinner: false,
            status: "", // change to PLAYED
            name: "Wartex",
          },
        
          {
            id: "blackdiamond",
            resultText: "",
            isWinner: false,
            status: "",
            name: "Black Diamond",
          },
      ],
    },
    {
      id: "9",
      name: "Match 9",
      nextMatchId: "12",
      nextLooserMatchId: "11",
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
      id: "6",
      name: "Match 6",
      nextMatchId: "8",
      nextLooserMatchId: null,
      startTime: null,
      state: "",
      participants: [
          {
            id: "orcus",
            resultText: "",
            isWinner: false,
            status: "", // change to PLAYED
            name: "Orcus",
          },
        //change to losers of match 2 and 3
          {
            id: "sniper",
            resultText: "",
            isWinner: false,
            status: "",
            name: "Sniper",
          },
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
          {
            id: "fatboy",
            resultText: "",
            isWinner: false,
            status: "", // change to PLAYED
            name: "Fat Boy",
          },
        //change to loser of match 5
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
