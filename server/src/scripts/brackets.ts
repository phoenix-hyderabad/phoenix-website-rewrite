import { v4 as uuidv4 } from "uuid";

export interface Participant {
    id: string;
    resultText: string | null;
    isWinner: boolean;
    status: "PLAYED" | "NO_SHOW" | "WALK_OVER" | "NO_PARTY" | null;
    name: string;
}

export interface Match {
    id: string;
    name: string;
    nextMatchId: string | null;
    nextLooserMatchId: string | null;
    startTime: string;
    state: "NO_SHOW" | "WALK_OVER" | "NO_PARTY" | "DONE" | "SCORE_DONE";
    participants: Participant[];
}

export interface TournamentBracket {
    upper: Match[];
    lower: Match[];
}

/**
 * Generates the initial tournament bracket schema based on the starting teams.
 * @param {Array<{ id: string, name: string }>} startingTeams - The list of starting teams.
 * @param {number} [rounds=4] - The number of rounds in the tournament (default is 4).
 * @returns {TournamentBracket} - The generated tournament bracket schema.
 */
function generateInitialSchema(
    startingTeams: { id: string; name: string }[]
): TournamentBracket {
    const upperBracket: Match[] = [];
    const lowerBracket: Match[] = [];
    const numTeams = startingTeams.length;
    const rounds = numTeams / 2 - 1;

    // Helper function to generate matches for a single round
    const generateRoundMatches = (roundIndex: number): Match[] => {
        const matches: Match[] = [];
        const numMatches = Math.pow(2, rounds - roundIndex - 1);
        for (let i = 0; i < numMatches; i += 1) {
            const match: Match = {
                id: `Round ${roundIndex + 1} - Match ${i + 1}`,
                name: `Round ${roundIndex + 1} - Match ${i + 1}`,
                nextMatchId:
                    roundIndex === rounds - 1
                        ? null
                        : upperBracket[
                              Math.pow(2, rounds - roundIndex - 2) -
                                  1 +
                                  Math.floor((numMatches - 1 - i) / 2)
                          ].id,
                nextLooserMatchId:
                    roundIndex === rounds - 1
                        ? null
                        : upperBracket[
                              Math.pow(2, rounds - roundIndex - 2) -
                                  1 +
                                  Math.floor((numMatches - 1 - i) / 2)
                          ].id,
                startTime: new Date().toISOString().slice(0, 10),
                state: "NO_SHOW",
                participants:
                    roundIndex === 0
                        ? [
                              {
                                  id: startingTeams[i].id,
                                  resultText: null,
                                  isWinner: false,
                                  status: null,
                                  name: startingTeams[i].name,
                              },
                              {
                                  id: startingTeams[i + 1].id,
                                  resultText: null,
                                  isWinner: false,
                                  status: null,
                                  name: startingTeams[i + 1].name,
                              },
                          ]
                        : [],
            };
            matches.push(match);
        }
        return matches.reverse();
    };

    // Generate the matches for each round
    for (let round = rounds - 1; round >= 0; round--) {
        upperBracket.push(...generateRoundMatches(round));
        lowerBracket.push(...generateRoundMatches(round));
    }

    return { upper: upperBracket.reverse(), lower: [lowerBracket[0]] };
}

/**
 * Updates the tournament bracket schema after a match is played.
 * @param {TournamentBracket} schema - The current tournament bracket schema.
 * @param {string} matchId - The ID of the match that was played.
 * @param {string} winnerParticipantId - The ID of the winning participant.
 * @param {string} loserParticipantId - The ID of the losing participant.
 * @param {string} state - The new state of the match ('DONE' or 'SCORE_DONE').
 * @returns {TournamentBracket} - The updated tournament bracket schema.
 */
function updateSchema(
    schema: TournamentBracket,
    matchId: string,
    winnerParticipantId: string,
    loserParticipantId: string,
    state: "DONE" | "SCORE_DONE"
): TournamentBracket {
    const updateMatch = (matches: Match[]): Match[] => {
        return matches.map((match) => {
            if (match.id === matchId) {
                const participants = match.participants.map((participant) => {
                    if (participant.id === winnerParticipantId) {
                        return {
                            ...participant,
                            resultText: "WON",
                            isWinner: true,
                            status: "PLAYED" as Participant["status"],
                        };
                    } else if (participant.id === loserParticipantId) {
                        return {
                            ...participant,
                            resultText: "LOST",
                            isWinner: false,
                            status: "PLAYED" as Participant["status"],
                        };
                    } else {
                        return participant;
                    }
                });

                return {
                    ...match,
                    state,
                    participants,
                };
            } else {
                return match;
            }
        });
    };

    return {
        upper: updateMatch(schema.upper),
        lower: updateMatch(schema.lower),
    };
}

const startingTeams: { id: string; name: string }[] = [
    { id: "1", name: "Team A" },
    { id: "2", name: "Team B" },
    { id: "3", name: "Team C" },
    { id: "4", name: "Team D" },
    { id: "5", name: "Team E" },
    { id: "6", name: "Team F" },
    { id: "7", name: "Team G" },
    { id: "8", name: "Team H" },
    { id: "9", name: "Team H" },
    { id: "10", name: "Team H" },
];

const initialSchema = generateInitialSchema(startingTeams);
console.log(initialSchema);

export { generateInitialSchema, updateSchema };
