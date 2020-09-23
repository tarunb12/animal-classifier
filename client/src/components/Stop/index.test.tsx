import React from 'react';
import { render } from '@testing-library/react';
import Stop from './index';

test('renders component', () => {
  render(<Stop processing={true} reset={() => {}} />);
});