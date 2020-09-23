import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
});

test('renders file input field', () => {
  const { container } = render(<App />);
  expect(container.querySelector('#upload-photo')).toBeInTheDocument();
});
