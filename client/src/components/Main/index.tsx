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
    prediction,
    breedPrediction,
    setProcessing,
    setImage,
    setPrediction,
    setBreedPrediction,
    reset,
  } = props;

  const handleImageUploadUrl = (imageUrl: string) => {
    reset();
    isReachableUrl(imageUrl, (err: boolean) => {
      if (err) {
        setError('URL must represent a valid image file.');
        setImage(undefined);
      }
      else {
        setTimeout(() => setPrediction('dog'), 6000);
        setTimeout(() => { setBreedPrediction('shih-tzu'); setProcessing(false); }, 12000);
        setImage({ imageUrl });
        setProcessing(true);
        // axios.get A => if breed B then axios.get B else done => done
        // axios.get A => setModel A => tfjs A => if breed B then axios.get B else done => setBreedModel B => tfjs B => done
      }
    });
  }

  const handleImageUpload = (files: FileList | File[] | null) => {
    if (!files) return;
    const image = files[0];
    if (image) {
      handleImageUploadUrl(URL.createObjectURL(image));
    }
  }

  const handleOnUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (isValidImageUrl(url)) {
      setError('');
      handleImageUploadUrl(url);
    } else {
      reset();
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
        onChange={e => handleImageUpload(e.target.files)}
        disabled={processing}
      />
      <div className={classes.main}>
        {image
          ? <Predictor
              prediction={prediction}
              breedPrediction={breedPrediction}
              image={image}
              handleImageUpload={handleImageUpload}
              processing={processing}
            />
          : <DropZone handleImageUpload={handleImageUpload} />}
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
  prediction?: Animal,
  breedPrediction?: Breed,
  setProcessing: Dispatch<SetStateAction<boolean>>,
  setImage: Dispatch<SetStateAction<Image | undefined>>,
  setPrediction: Dispatch<SetStateAction<Animal | undefined>>,
  setBreedPrediction: Dispatch<SetStateAction<Breed | undefined>>,
  reset: () => void,
}

export default Main;
