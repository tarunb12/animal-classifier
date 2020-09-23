import React, { useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Theme, makeStyles } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) => ({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    width: '100%',
    flexGrow: 1,
    textAlign: 'center',
  },
  accept: {
    borderColor: theme.palette.success.main,
    backgroundColor: green[50],
  },
  active: {
    borderColor: theme.palette.primary.main,
  },
  reject: {
    borderColor: theme.palette.error.main,
    backgroundColor: red[50],
  },
  text: {
    fontSize: '2em',
    textAlign: 'center',
  }
}));

const DropZone = (props: DropZoneProps) => {
  const classes = useStyles();
  const onDropAccepted = useCallback(props.handleImageUpload, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: 'image/*', onDropAccepted });
  const actionClass = useMemo(() =>
    isDragAccept ? classes.accept :
    isDragReject ? classes.reject :
    isDragActive ? classes.active : '', [
    isDragAccept , classes.accept ,
    isDragReject , classes.reject ,
    isDragActive , classes.active ,
  ]);

  return (
    <div {...getRootProps({
      className: classNames(classes.base, actionClass),
    })}>
      <input {...getInputProps({
        accept: 'image/*',
        multiple: false,
        onChange: e => props.handleImageUpload(e.target.files),
      })} />
      <CloudUploadIcon style={{ fontSize: 80 }} />
      <span className={classes.text}>
        Upload an image of an animal
      </span>
    </div>
  );
}

interface DropZoneProps {
  handleImageUpload: (file: FileList | File[] | null) => void,
}

export default DropZone;
