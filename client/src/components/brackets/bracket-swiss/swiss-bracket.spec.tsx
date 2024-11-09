import React from 'react';
import { render } from '@testing-library/react';
import Match from 'Components/match';
import SVGViewer from '../svg-viewer';
import { simpleBracket } from '../mock-data/simple-data';
import SwissBracket from './swiss-bracket';

it('Renders a single swiss bracket without crashing', () => {
  render(
    <SwissBracket
      matches={simpleBracket}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={500} height={500} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
});
