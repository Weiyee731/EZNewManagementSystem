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
    userProfile: state.counterReducer["userProfile"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallUserProfileByID: () => dispatch(GitAction.CallUserProfileByID(dispatch)),
  };
}

const INITIAL_STATE = {

}

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      USERID:this.props.match.params.userid
    }
    this.props.CallUserProfileByID(this.state)
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  render() {
    console.log(this.props)
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
                Edit Profile
              </Typography>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  required
                  id="outlined-required"
                  label="Full Name"
                  defaultValue={this.props.userProfile[0].Fullname}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <TextField
                  className="w-100 my-3"
                  required
                  id="outlined-required"
                  label="User Code"
                  defaultValue={this.props.userProfile[0].Fullname}
                />
              </div>
            </div>
            <TextField
              className="w-100 my-3"
              required
              id="outlined-required"
              label="Email Address"
              defaultValue={this.props.userProfile[0].Fullname}
            />
            <TextField
              className="w-100 my-3"
              required
              id="outlined-required"
              label="Contact No."
              defaultValue="Hello World"
            />
            <TextField
              className="w-100 my-3"
              required
              id="outlined-required"
              label="Address"
              defaultValue="Hello World"
            />
            {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography> */}
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserDetail));