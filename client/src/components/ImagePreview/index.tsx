import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Fade,
  Paper,
  Theme,
  makeStyles,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import classNames from 'classnames';

import { Image } from '../../types';

const useStyles = (imageUrl?: string) => makeStyles((theme: Theme) => ({
  imageCanvas: {
    flex: '0 1 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 0,
    padding: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginBottom: 0,
    maxHeight: '100%',
    maxWidth: '50%',      
    [theme.breakpoints.down('md')]: {
      marginRight: 0,
      marginBottom: theme.spacing(1),
      maxHeight: '50%',
      maxWidth: '100%',
    },
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    background: imageUrl ? `url('${imageUrl}')` : 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  accept: {
    borderColor: theme.palette.success.main,
    backgroundColor: theme.palette.type === 'light'
      ? green[50]
      : green[100],
  },
  active: {
    borderColor: theme.palette.primary.main,
  },
  reject: {
    borderColor: theme.palette.error.main,
    backgroundColor: theme.palette.type === 'light'
      ? red[50]
      : red[100],
  },
}));

const ImagePreview = (props: ImagePreviewProps) => {
  const classes = useStyles(props.image?.imageUrl)();
  const [checked, setChecked] = useState(false);
  const { processing } = props;
  const onDropAccepted = useCallback(props.handleImageUpload, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    noClick: processing,
    onDropAccepted: processing
      ? () => {}
      : onDropAccepted,
  });
  const actionClass = useMemo(() =>
    processing && isDragActive ? classes.reject :
    isDragAccept ? classes.accept :
    isDragReject ? classes.reject :
    isDragActive ? classes.active : '', [
    isDragAccept , classes.accept ,
    isDragReject , classes.reject ,
    isDragActive , classes.active ,
    processing
  ]);

  useEffect(() => {
    setChecked(prev => !prev);
  }, []);

  return (
    <Fade in={checked} timeout={1000}>
      <Paper elevation={3} {...getRootProps({
        className: classNames(classes.imageCanvas, actionClass),
        // onClick: e => e.stopPropagation(),
      })}>
        <input {...getInputProps({
          accept: 'image/*',
          multiple: false,
          onChange: e => props.handleImageUpload(e.target.files),
        })} />
        <div className={classes.imagePreview} />
      </Paper>
    </Fade>
  );
}

interface ImagePreviewProps {
  processing: boolean,
  image?: Image,
  handleImageUpload: (file: FileList | File[] | null) => void,
}

export default ImagePreview;
