import {
  createTheme,
  DoubleEliminationBracket,
  Match,
  MatchComponentProps,
  MatchType,
  SVGViewer,
} from "../brackets";
import useWindowSize from "../brackets/Hooks/use-window-size";
import { ErrorBoundary } from "react-error-boundary";

const Theme = createTheme({
  canvasBackground: "#141414",
  textColor: "#fff",
});

const WhiteTheme = createTheme({
  textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
  canvasBackground: "#fefefe",
  matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
  score: {
    background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
    text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
  },
  border: {
    color: '#CED1F2',
    highlightedColor: '#da96c6',
  },
  roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
  connectorColor: '#CED1F2',
  connectorColorHighlight: '#da96c6',
  svgBackground: '#FAFAFA',
});

const FixtureContent = ({
  playoffData,
}: {
  playoffData: {
    upper: MatchType[];
    lower: MatchType[];
  };
}) => {
  const [width] = useWindowSize();
  const finalWidth = Math.max(width - 300, 300);
  return (
    <div className="flex self-center overflow-x-hidden">
      <ErrorBoundary
        fallback={<p>⚠️ Something went wrong while loading fixture</p>}
      >
        <DoubleEliminationBracket
          matches={playoffData}
          matchComponent={Match as (props: MatchComponentProps) => JSX.Element}
          theme={WhiteTheme}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer
              width={finalWidth}
              height={5000}
              SVGBackground={WhiteTheme.canvasBackground}
              {...props}
            >
              {children}
            </SVGViewer>
          )}
        />
      </ErrorBoundary>
    </div>
  );
};

export default FixtureContent;
