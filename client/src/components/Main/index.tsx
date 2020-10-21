import React, {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useState
} from 'react';
import {
  Button,
  TextField,
  Theme,
  Toolbar,
  makeStyles,
} from '@material-ui/core';
import Compress from 'compress.js';

import {
  Animal,
  Breed,
  ImageUpload,
  Prediction,
} from '../../types';
import {
  DropZone,
  Predictor,
} from '..';
import { isReachableUrl, isValidImageUrl } from '../../utils';
import { AxiosPromise, AxiosResponse } from 'axios';

declare const apigClientFactory: {
  newClient: (config: Config) => {
    animalPost: (params?: any, body?: any, additionalParams?: any) => AxiosPromise<any>,
    animalOptions: (params?: any, body?: any, additionalParams?: any) => AxiosPromise<any>,
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  upload: {
    width: '100%',
    padding: 0,
    marginTop: theme.spacing(1),
  },
  locationField: {
    flexGrow: 1,
    marginRight: '2%',
    overflow: 'hidden',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '24px 24px 0',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px 0',
    }
  },
}));

const Main = (props: MainProps) => {
  const classes = useStyles();
  const [error, setError] = useState<string>('');
  const {
    processing,
    image,
    animalPrediction,
    breedPrediction,
    setProcessing,
    setImage,
    setAnimalPrediction,
    setBreedPrediction,
    reset,
  } = props;

  const apigClient = apigClientFactory.newClient({
    accessKey: process.env.REACT_APP_ACCESS_KEY,
    secretKey: process.env.REACT_APP_SECRET_KEY,
    region: process.env.REACT_APP_REGION,
    defaultAcceptType: 'application/json',
    defaultContentType: 'application/json',
  });

  const partialReset = () => {
    setProcessing(false);
    setAnimalPrediction(undefined);
    setBreedPrediction(undefined);
  }

  const predict = (data: string): void => {
    apigClient
      .animalPost(undefined, { data: { image: data } }, undefined)
      .then((res: AxiosResponse<Record<'prediction', any>>)  => res.data)
      .then((data: Record<'prediction', { name: string, confidence: number }>) => data.prediction)
      .then(({ name, confidence }) => ({ value: name, confidence } as Prediction<Animal>))
      .then(setAnimalPrediction)
      .then(() => setProcessing(false))
      .catch(console.error)
  }

  const handleImageUploadUrl = (imageUrl: string, partial?: boolean) => {
    isReachableUrl(imageUrl, (err: boolean) => {
      if (err) {
        setError('URL must represent a valid image file.');
        setImage(undefined);
      }
      else {
        fetch(imageUrl)
          .then(res => res.blob())
          .then(blob => [new File([blob], 'upload.png', blob)])
          .then(handleImageUpload(partial))
      }
    });
  }

  const handleImageUpload = (partial?: boolean) => (files: FileList | File[] | null) => {
    if (!files) return;
    const image = files[0];
    if (image) {
      partial ? partialReset() : reset();
      const imageUrl = URL.createObjectURL(image);
      // setTimeout(() => { setBreedPrediction({ value: 'shih-tzu', confidence: .87 }); setProcessing(false); }, 6000);
      setImage({ image, imageUrl });
      setProcessing(true);

      const compress = new Compress();
      compress.compress([image], {
        size: .5,
        quality: 1,
        maxWidth: 96,
        maxHeight: 96,
      }).then(data => data[0])
        .then(image => image.data)
        .then(predict);
    }
  }

  const handleOnUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url.trim().length === 0) {
      setError('');
    } else if (isValidImageUrl(url)) {
      setError('');
      handleImageUploadUrl(url, true);
    } else {
      setError('URL must represent a valid image file.')
    }
  }

  return (
    <Fragment>
      <input
        accept='image/*'
        style={{ display: 'none' }}
        id='upload-photo'
        name='upload-photo'
        multiple={false}
        type='file'
        onChange={e => handleImageUpload(false)(e.target.files)}
        disabled={processing}
      />
      <div className={classes.main}>
        {image
          ? <Predictor
              animalPrediction={animalPrediction}
              breedPrediction={breedPrediction}
              image={image}
              handleImageUpload={handleImageUpload(true)}
              processing={processing}
            />
          : <DropZone handleImageUpload={handleImageUpload(false)} />}
        <Toolbar className={classes.upload}>
          <TextField
            error={!!error}
            disabled={processing}
            variant='filled'
            className={classes.locationField}
            label={error || 'URL'}
            onChange={handleOnUrlChange}
          />
          <label htmlFor='upload-photo'>
            <Button variant='contained' component='span' disabled={processing}>
              Upload
            </Button>
          </label>
        </Toolbar>
      </div>
    </Fragment>
  );
}

interface MainProps {
  processing: boolean,
  image?: ImageUpload,
  animalPrediction?: Prediction<Animal>,
  breedPrediction?: Prediction<Breed>,
  setProcessing: Dispatch<SetStateAction<boolean>>,
  setImage: Dispatch<SetStateAction<ImageUpload | undefined>>,
  setAnimalPrediction: Dispatch<SetStateAction<Prediction<Animal> | undefined>>,
  setBreedPrediction: Dispatch<SetStateAction<Prediction<Breed> | undefined>>,
  reset: () => void,
}

interface Config {
  accessKey?: string,
  secretKey?: string,
  sessionToken?: string,
  region?: string,
  url?: string,
  apiKey?: string,
  defaultContentType?: string,
  defaultAcceptType?: string,
}

export default Main;
