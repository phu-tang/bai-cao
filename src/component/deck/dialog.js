import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  isOpenDialogSelector,
  winnerMessageSelector,
  closeDialogAC,
  initGameFA,
} from './state';

const Layout = ({ isOpen, handleClose, messageContent, newGame }) => (
  <Dialog
    open={isOpen}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{'Congratulation'}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {messageContent}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          handleClose();
          newGame();
        }}
        color="primary"
      >
        New game
      </Button>
    </DialogActions>
  </Dialog>
);

export default compose(
  connect(
    state => ({
      isOpen: isOpenDialogSelector(state),
      messageContent: winnerMessageSelector(state),
    }),
    {
      handleClose: closeDialogAC,
      newGame: initGameFA.actionCreator,
    },
  ),
)(Layout);
