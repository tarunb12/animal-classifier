import React, { useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { AppBar, Main } from './components';
import { Animal, Breed, Image } from './types';

import {
  CssBaseline,
  PaletteType,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core';
import { blue, pink, red } from '@material-ui/core/colors';

const theme = (paletteType: PaletteType) => createMuiTheme({
  palette: {
    type: paletteType,
    primary: blue,
    secondary: pink,
    error: {
      main: red.A400,
    },
  },
});

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
  const initialTheme = Boolean(localStorage.getItem('dark')) ? 'dark' : 'light';
  const [paletteType, setPaletteType] = useState<PaletteType>(initialTheme);
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
    <ThemeProvider theme={theme(paletteType)}>
      <CssBaseline />
      <div className={classes.app}>
        <div className={classes.content}>
          <AppBar
            reset={reset}
            processing={processing}
            setPaletteType={setPaletteType}
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
    </ThemeProvider>
  );
}

export default App;
