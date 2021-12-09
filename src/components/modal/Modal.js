import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { isStringNullOrEmpty } from '../../tools/Helpers';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#alert-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function AlertDialog(props) {
  return (
    <Dialog
      fullWidth={typeof props.fullWidth === "undefined" ? true : props.fullWidth}
      maxWidth={isStringNullOrEmpty(props.maxWidth) ? "lg" : props.maxWidth}
      open={props.open}
      onClose={() => props.handleToggleDialog()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperComponent={props.draggable ? PaperComponent : null}
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
      PaperComponent={props.fullScreen ? null : PaperComponent}
    >
      {
        props.fullScreen &&
        <AppBar sx={{ position: 'relative', bgcolor: (!isStringNullOrEmpty(props.fullScreenHeaderbgColor) ? props.fullScreenHeaderbgColor : "#252525") }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {props.title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => { props.handleToggleDialog() }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      }

      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        {/* <DialogContentText id="alert-dialog-description"> */}
        {typeof props.children !== "undefined" ? props.children : props.message}
        {/* </DialogContentText> */}
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
