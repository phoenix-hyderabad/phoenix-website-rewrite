import React from 'react';
import { ThemeProvider } from 'styled-components';
import { calculateSVGDimensions } from 'Core/calculate-svg-dimensions';
import { MatchContextProvider } from 'Core/match-context';
import MatchWrapper from 'Core/match-wrapper';
import RoundHeader from 'Components/round-header';
import { getPreviousMatches } from 'Core/match-functions';
import { SwissLeaderboardProps } from '../types';
import { defaultStyle, getCalculatedStyles } from '../settings';
import { calculatePositionOfMatch } from './calculate-match-position';
import defaultTheme from '../themes/themes';

function SwissBracket({
  matches,
  matchComponent,
  currentRound,
  onMatchClick,
  onPartyClick,
  svgWrapper: SvgWrapper = ({ children }) => <div>{children}</div>,
  theme = defaultTheme,
  options: { style: inputStyle } = {
    style: defaultStyle,
  },
}: SwissLeaderboardProps) {
  const style = {
    ...defaultStyle,
    ...inputStyle,
    roundHeader: {
      ...defaultStyle.roundHeader,
      ...(inputStyle?.roundHeader ?? {}),
    },
    lineInfo: {
      ...defaultStyle.lineInfo,
      ...(inputStyle?.lineInfo ?? {}),
    },
  };

  const { roundHeader, columnWidth, canvasPadding, rowHeight, width } =
    getCalculatedStyles(style);

  const generate2DBracketArray = () => {
    const brackets = [];
    matches.forEach(match => {
      if (!brackets[match.swissRoundNumber]) {
        brackets[match.swissRoundNumber] = [];
      }
      brackets[match.swissRoundNumber].push(match);
    });

    return brackets.filter(column => !!column);
  };
  const columns = generate2DBracketArray();

  const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(
    Math.max(...columns.map(column => column.length)),
    columns.length,
    rowHeight,
    columnWidth,
    canvasPadding,
    roundHeader,
    currentRound
  );

  return (
    <ThemeProvider theme={theme}>
      <SvgWrapper
        bracketWidth={gameWidth}
        bracketHeight={gameHeight}
        startAt={startPosition}
      >
        <svg
          height={gameHeight}
          width={gameWidth}
          viewBox={`0 0 ${gameWidth} ${gameHeight}`}
        >
          <MatchContextProvider>
            <g>
              {columns.map((matchesColumn, columnIndex) =>
                matchesColumn.map((match, rowIndex) => {
                  const { x, y } = calculatePositionOfMatch(
                    rowIndex,
                    columnIndex,
                    {
                      canvasPadding,
                      columnWidth,
                      rowHeight,
                    }
                  );
                  const previousBottomPosition = (rowIndex + 1) * 2 - 1;

                  const { previousBottomMatch } = getPreviousMatches(
                    columnIndex,
                    columns,
                    previousBottomPosition
                  );
                  return (
                    <g key={x + y}>
                      {roundHeader.isShown && (
                        <RoundHeader
                          x={x}
                          roundHeader={roundHeader}
                          canvasPadding={canvasPadding}
                          width={width}
                          numOfRounds={columns.length}
                          tournamentRoundText={match.tournamentRoundText}
                          columnIndex={columnIndex}
                        />
                      )}
                      <g>
                        <MatchWrapper
                          x={x}
                          y={
                            y +
                            (roundHeader.isShown
                              ? roundHeader.height + roundHeader.marginBottom
                              : 0)
                          }
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          match={match}
                          previousBottomMatch={previousBottomMatch}
                          topText={match.startTime}
                          bottomText={match.name}
                          teams={match.participants}
                          onMatchClick={onMatchClick}
                          onPartyClick={onPartyClick}
                          style={style}
                          matchComponent={matchComponent}
                        />
                      </g>
                    </g>
                  );
                })
              )}
            </g>
          </MatchContextProvider>
        </svg>
      </SvgWrapper>
    </ThemeProvider>
  );
}

export default SwissBracket;
