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

import {
  Animal,
  Breed,
  Prediction,
  Image,
} from '../../types';
import {
  DropZone,
  Predictor,
} from '..';
import { isReachableUrl, isValidImageUrl } from '../../utils';

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

  
  const partialReset = () => {
    setProcessing(false);
    setAnimalPrediction(undefined);
    setBreedPrediction(undefined);
  }

  const handleImageUploadUrl = (imageUrl: string, partial?: boolean) => {
    partial ? partialReset() : reset();
    isReachableUrl(imageUrl, (err: boolean) => {
      if (err) {
        setError('URL must represent a valid image file.');
        setImage(undefined);
      }
      else {
        setTimeout(() => setAnimalPrediction({ value: 'dog', confidence: .98 }), 3000);
        setTimeout(() => { setBreedPrediction({ value: 'shih-tzu', confidence: .87 }); setProcessing(false); }, 6000);
        setImage({ imageUrl });
        setProcessing(true);
        // axios.get A => if breed B then axios.get B else done => done
        // axios.get A => setModel A => tfjs A => if breed B then axios.get B else done => setBreedModel B => tfjs B => done
      }
    });
  }

  const handleImageUpload = (partial?: boolean) => (files: FileList | File[] | null) => {
    if (!files) return;
    const image = files[0];
    if (image) {
      handleImageUploadUrl(URL.createObjectURL(image), partial);
    }
  }

  const handleOnUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (isValidImageUrl(url)) {
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
  image?: Image,
  animalPrediction?: Prediction<Animal>,
  breedPrediction?: Prediction<Breed>,
  setProcessing: Dispatch<SetStateAction<boolean>>,
  setImage: Dispatch<SetStateAction<Image | undefined>>,
  setAnimalPrediction: Dispatch<SetStateAction<Prediction<Animal> | undefined>>,
  setBreedPrediction: Dispatch<SetStateAction<Prediction<Breed> | undefined>>,
  reset: () => void,
}

export default Main;
