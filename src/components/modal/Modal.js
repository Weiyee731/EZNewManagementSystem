import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { isStringNullOrEmpty } from '../../tools/Helpers';

export default function AlertDialog(props) {
  return (
    <Dialog
      fullWidth={typeof props.fullWidth === "undefined" ? true : props.fullWidth}
      maxWidth={isStringNullOrEmpty(props.maxWidth) ? "lg" : props.maxWidth}
      open={props.open}
      onClose={() => props.handleToggleDialog()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {props.title}
        <IconButton sx={{ marginLeft: 'auto' }} onClick={() => props.handleToggleDialog()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {props.message ?
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
          :
          <>
            {props.children}
          </>
        }
      </DialogContent>
      {props.showAction &&
        <DialogActions>
          {props.singleButton ?
            <Button
              onClick={() => props.handleConfirmFunc()}
              variant='contained'
              fullWidth
            >
              {props.buttonTitle}
            </Button>
            :
            <>
              <Button onClick={() => props.handleToggleDialog()}>No</Button>
              <Button onClick={() => props.handleConfirmFunc()} variant='contained'>
                {props.buttonTitle}
              </Button>
            </>
          }
        </DialogActions>
      }
    </Dialog>
  );
}

export function ModalPopOut(props) {
  return (
    <Dialog
      fullScreen={props.fullScreen ? props.fullScreen : false}    //fullscreen modal
      hideBackdrop={props.hideBackdrop ? props.hideBackdrop : false}   //hide back
      // BackDropProps={props.BackDropProps ? props.BackDropProps : false}
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

