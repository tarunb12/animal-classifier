import React from 'react';
import { render } from '@testing-library/react';
import ImagePreview from './index';

test('renders component', () => {
  render(<ImagePreview processing={true} handleImageUpload={() => {}} />);
});
