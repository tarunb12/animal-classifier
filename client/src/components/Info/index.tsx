import React, { Fragment, MouseEvent, useState } from 'react';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Popover,
  Theme,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons'

import { Animal } from '../../types';
import {
  ANIMALS,
  ANIMAL_TO_EMOJI,
  INFO,
  REPO
} from '../../constants';

const useStyles = makeStyles((theme: Theme) => ({
  infoList: {
    width: 320,
    paddingTop: 8,
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  animalSubheader: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  animal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'inherit',
    textDecoration: 'none',
  },
  animalEmoji: {
    textAlign: 'right',
  },
  animalText: {
    textTransform: 'capitalize',
    flexGrow: 1,
    color: 'inherit',
  },
}));

const Info = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const open = Boolean(anchorEl);
  const id = open ? 'info-popover' : undefined;

  return (
    <Fragment>
      <Tooltip title='Info' aria-label='info-tip'>
        <IconButton aria-describedby={id} aria-label='info' onClick={handleClick}>
          <InfoIcon style={{ color: '#fff', fontSize: 30 }} />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onDragEnter={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical:'top',
          horizontal: 'right',
        }}
      >
        <List className={classes.infoList} subheader={<li />}>
          <ListItem key='info' className={classes.message}>
            <Typography variant='body1' gutterBottom>
              About
            </Typography>
            <Typography variant='body2' gutterBottom>
              <span>
                {INFO}
                <a href={REPO} target='_blank' rel='noopener noreferrer'>here</a>.
              </span>
            </Typography>
          </ListItem>
          <Divider />
          <ListSubheader className={classes.animalSubheader}>
            Supported Animals
          </ListSubheader>
          {ANIMALS.map((animal: Animal) => (
            <ListItem
              key={animal}
              component='a'
              target='_blank'
              href={`https://en.wikipedia.org/wiki/${animal.charAt(0).toUpperCase()}${animal.slice(1)}`}
              rel='noopener noreferrer'
            >
              <ListItemText primary={
                <div className={classes.animal}>
                  <span className={classes.animalText}>{animal}</span>
                  <span className={classes.animalEmoji}>{ANIMAL_TO_EMOJI[animal]}</span>
                </div>
              } />
            </ListItem>
          ))}
        </List>
      </Popover>
    </Fragment>
  );
}

export default Info;