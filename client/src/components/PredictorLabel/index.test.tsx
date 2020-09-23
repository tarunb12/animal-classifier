import React from 'react';
import { render } from '@testing-library/react';
import PredictorLabel from './index';

test('renders component', () => {
  render(<PredictorLabel isBreed={false} />);
});
