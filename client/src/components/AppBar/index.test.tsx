import React from 'react';
import { render } from '@testing-library/react';
import AppBar from './index';

test('renders component', () => {
  render(<AppBar processing={false} setPaletteType={() => {}} reset={() => {}} />);
});
