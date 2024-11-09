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

const Theme = createTheme();

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
    <div className="flex self-center overflow-x-hidden border-2">
      <ErrorBoundary
        fallback={<p>⚠️ Something went wrong while loading fixture</p>}
      >
        <DoubleEliminationBracket
          matches={playoffData}
          matchComponent={Match as (props: MatchComponentProps) => JSX.Element}
          theme={Theme}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer
              width={finalWidth}
              height={5000}
              SVGBackground={Theme.canvasBackground}
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
