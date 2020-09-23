import React from 'react';
import { render } from '@testing-library/react';
import Predictor from './index';

test('renders component', () => {
  render(<Predictor processing={true} handleImageUpload={() => {}} />);
});
