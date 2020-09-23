import React, { useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { AppBar, Main } from './components';
import { Animal, Breed, Image } from './types';

const useStyles = makeStyles((theme: Theme) => ({
  app: {
    height: '100%',
    margin: 0,
    padding: 0,
    border: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    height: '100%',
  },
}));

const App = () => {
  const classes = useStyles();
  const [image, setImage] = useState<Image>();
  const [processing, setProcessing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Animal>();
  const [breedPrediction, setBreedPrediction] = useState<Breed>();

  const reset = () => {
    setProcessing(false);
    setPrediction(undefined);
    setBreedPrediction(undefined);
    setImage(undefined);
  }

  return (
    <div className={classes.app}>
      <div className={classes.content}>
        <AppBar
          reset={reset}
          processing={processing}
        />
        <Main
          processing={processing}
          image={image}
          prediction={prediction}
          breedPrediction={breedPrediction}
          setProcessing={setProcessing}
          setImage={setImage}
          setPrediction={setPrediction}
          setBreedPrediction={setBreedPrediction}
          reset={reset}
        />
      </div>
    </div>
  );
}

export default App;
