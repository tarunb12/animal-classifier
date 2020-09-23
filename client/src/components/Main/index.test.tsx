import React from 'react';
import { render } from '@testing-library/react';
import Main from './index';

test('renders component', () => {
  render(
    <Main
      processing={false}
      setProcessing={() => {}}
      setImage={() => {}}
      setPrediction={() => {}}
      setBreedPrediction={() => {}}
      reset={() => {}}
    />
  );
});
