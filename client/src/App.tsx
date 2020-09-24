import React, { useEffect, useState } from 'react';
import { Theme, makeStyles, useMediaQuery } from '@material-ui/core';

import {
  CssBaseline,
  PaletteType,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core';
import { blue, pink, red } from '@material-ui/core/colors';

import { AppBar, Main } from './components';
import { Animal, Breed, Image } from './types';
import { getCookie, setCookie } from './utils';

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
  const prefersDark = useMediaQuery('@media (prefers-color-scheme: dark)');
  const initialTheme = getCookie('paletteType') === 'dark'
    ? 'dark'
    : prefersDark
      ? 'dark'
      : 'light';
  const [paletteType, setPaletteType] = useState<PaletteType>(initialTheme);
  const [image, setImage] = useState<Image>();
  const [processing, setProcessing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Animal>();
  const [breedPrediction, setBreedPrediction] = useState<Breed>();

  useEffect(() => {
    setCookie('paletteType', paletteType);
  }, [paletteType]);

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
