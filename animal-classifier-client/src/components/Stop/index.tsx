import React, { Fragment, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Theme,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { RemoveCircle as RemoveIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  yesButton: {
    color: theme.palette.primary.main,
  },
  noButton: {
    color: theme.palette.error.main,
  },
}));

const Stop = (props: StopProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const { processing, reset } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleResetClose = () => {
    reset();
    handleClose();
  }

  return (
    <Fragment>
      <Tooltip title='Stop' aria-label='stop-tip'>
        <IconButton aria-label='stop' onClick={handleOpen}>
          <RemoveIcon style={{ color: '#fff', fontSize: 30 }} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open && processing}
        onClose={handleClose}
        aria-labelledby="stop-dialog-title"
        aria-describedby="stop-dialog-description"
      >
        <DialogTitle id="stop-dialog-title">
          Stop image prediction?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Stop the prediction for the current image. You will
            need to re-upload the image to recieve a prediction.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className={classes.noButton} autoFocus>
            Disagree
          </Button>
          <Button onClick={handleResetClose} className={classes.yesButton}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

interface StopProps {
  processing: boolean,
  reset: () => void,
}

export default Stop;
