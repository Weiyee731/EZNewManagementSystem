import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.handleToggleDialog()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleToggleDialog()}>No</Button>
        <Button onClick={() => props.handleConfirmFunc()} variant='contained'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ModalPopOut(props) {
  console.log(props)
  return (
    <Dialog
      fullScreen={props.fullScreen?props.fullScreen:false}    //fullscreen modal
      hideBackdrop={props.hideBackdrop?props.hideBackdrop:false}   //hide back
      BackDropProps={props.BackDropProps?props.BackDropProps:false}
      // onBackdropClick={this.onClose= 'open'}
      open={props.open}
      onClose={() => props.handleToggleDialog()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleToggleDialog()}>Cancel</Button>
        <Button onClick={() => props.handleConfirmFunc()} variant='contained'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

