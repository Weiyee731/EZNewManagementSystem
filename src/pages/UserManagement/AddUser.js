import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { withRouter } from "react-router";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

function mapStateToProps(state) {
  return {
    foods: state.counterReducer["foods"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallTesting: () => dispatch(GitAction.CallTesting()),
  };
}

const INITIAL_STATE = {

}

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  render() {
    return (
      <div>
        <Card>
          <CardContent>
            <div className="d-flex align-items-center">
              <IconButton
                color="primary"
                aria-label="back"
                component="span"
                onClick={() => this.props.history.goBack()}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" component="div">
                Add New User
              </Typography>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  required
                  id="outlined-required"
                  label="Full Name"
                  defaultValue="Hello World"
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  required
                  id="outlined-required"
                  label="Contact No."
                  defaultValue="Hello World"
                />
              </div>
            </div>
            <TextField
              className="w-100 my-3"
              required
              id="outlined-required"
              label="Required"
              defaultValue="Hello World"
            />
            <TextField
              className="w-100 my-3"
              required
              id="outlined-required"
              label="Required"
              defaultValue="Hello World"
            />
            <TextField
              className="w-100 my-3"
              required
              id="outlined-required"
              label="Required"
              defaultValue="Hello World"
            />
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddUser));