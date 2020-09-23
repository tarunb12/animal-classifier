import React from 'react';
import { render } from '@testing-library/react';
import DropZone from './index';

test('renders component', () => {
  render(<DropZone handleImageUpload={()=>{}} />);
});