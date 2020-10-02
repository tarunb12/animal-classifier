import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Fade,
  Paper,
  SvgIcon,
  Theme,
  makeStyles,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import classNames from 'classnames';

import { ImageUpload } from '../../types';

const useStyles = (imageUrl?: string) => makeStyles((theme: Theme) => ({
  imageCanvas: {
    flex: '0 1 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 0,
    padding: theme.spacing(2),
    borderColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 2,
    transition: 'border .24s ease-in-out',
    marginRight: theme.spacing(1),
    marginBottom: 0,
    maxHeight: '100%',
    maxWidth: `calc(50% - ${theme.spacing(1)}px)`,      
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
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
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
  uploadIcon: {
    fontSize: '2.1875rem'
  },
  uploadPath: {
    opacity: 0.75,
    fill: theme.palette.type === 'light'
      ? theme.palette.primary.light
      : 'rgb(66,66,66)',
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
      })}>
        <input {...getInputProps({
          accept: 'image/*',
          multiple: false,
          onChange: e => props.handleImageUpload(e.target.files),
        })} />
        <div className={classes.imagePreview}>
            {!processing && <SvgIcon className={classes.uploadIcon} focusable={false} viewBox='0 0 24 24'>
              <path className={classes.uploadPath} d='M19.21 12.04l-1.53-.11-.3-1.5C16.88 7.86 14.62 6 12 6 9.94 6 8.08 7.14 7.12 8.96l-.5.95-1.07.11C3.53 10.24 2 11.95 2 14c0 2.21 1.79 4 4 4h13c1.65 0 3-1.35 3-3 0-1.55-1.22-2.86-2.79-2.96zm-5.76.96v3h-2.91v-3H8l4-4 4 4h-2.55z' />
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z" />
            </SvgIcon>}
        </div>
      </Paper>
    </Fade>
  );
}

interface ImagePreviewProps {
  processing: boolean,
  image?: ImageUpload,
  handleImageUpload: (file: FileList | File[] | null) => void,
}

export default ImagePreview;
