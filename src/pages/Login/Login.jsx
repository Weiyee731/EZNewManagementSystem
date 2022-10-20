import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";
import { setLogonUser } from "../../components/auth/AuthManagement"
import { GetDefaultImage } from "../../tools/MediaHelpers"
import { isStringNullOrEmpty, isArrayNotEmpty } from "../../tools/Helpers"

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";
// import css
import "./Login.css"
import EZLogo from "../../assets/logos/android-chrome-192x192.png"

function mapStateToProps(state) {
    return {
        logonUser: state.counterReducer["logonUser"],
        sidebars: state.counterReducer["sidebars"],
        loading: state.counterReducer["loading"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserLogin: (data) => dispatch(GitAction.CallUserLogin(data)),
        CallClearLogonUserCache: () => dispatch(GitAction.CallClearLogonUserCache()),
    };
}

//try
const INITIAL_STATE = {
    // input 
    username: "",
    password: "",
    showPassword: false,
    isSubmitting: false,
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.handleInputChange = this.handleInputChange.bind(this)
        this.OnSubmitLogin = this.OnSubmitLogin.bind(this)
        this.OnEnterToSubmitLogin = this.OnEnterToSubmitLogin.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.props.loading && isArrayNotEmpty(this.props.logonUser)) {
            this.setState(({ isSubmitting: false }))
            if (this.props.logonUser[0].ReturnVal === "0" || this.props.logonUser[0].ReturnVal === 0) {
                toast.error("Authentication Failed.")
                this.props.CallClearLogonUserCache();
            }
            else {
                // failed
                setLogonUser(this.props.logonUser, this.props.sidebars)
            }
        }
    }

    handleInputChange = (e) => {
        const elementId = e.target.id
        switch (elementId) {
            case "login-username":
                this.setState({ username: e.target.value.trim() })
                break;

            case "login-password":
                this.setState({ password: e.target.value })
                break;

            default:
                break;
        }
    }

    isInputsVerified = () => {
        const { username, password } = this.state
        return (!isStringNullOrEmpty(username) && !isStringNullOrEmpty(password))
    }

    OnSubmitLogin = () => {
        if (this.isInputsVerified()) {
            let object = {
                username: this.state.username,
                password: this.state.password,
            }
            this.setState(({ isSubmitting: true }))
            this.props.CallUserLogin(object)
        }
    }

    OnEnterToSubmitLogin = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13)
            this.OnSubmitLogin()
    }

    render() {
        return (
            <div style={{ display: 'flex', width: '100%', height: '100vh', }}>
                <div className="container login-container m-auto">
                    <div className="logo-container w-100">
                        <div style={{ width: '120px', height: '120px', marginLeft: 'auto', marginRight: 'auto', }}>
                            <img style={{ borderRadius: '50%', }} src={EZLogo} alt="System Logo" width='100%' height='100%' onError={event => { event.target.src = GetDefaultImage(); event.onerror = null }} />
                        </div>
                    </div>
                    <div className="login-inputs-group">
                        <FormControl sx={{ m: 1, marginTop: 5, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="login-username">Username</InputLabel>
                            <Input
                                id="login-username"
                                value={this.state.username}
                                onChange={(e) => this.handleInputChange(e)}
                                onKeyDown={(e) => { this.OnEnterToSubmitLogin(e) }}
                                size="small"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <Input
                                id="login-password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={(e) => this.handleInputChange(e)}
                                onKeyDown={(e) => { this.OnEnterToSubmitLogin(e) }}
                                size="small"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onMouseUp={() => this.setState({ showPassword: false })}
                                            onMouseDown={() => this.setState({ showPassword: true })}
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button
                            sx={{ m: 1 }}
                            className="w-100"
                            variant="contained"
                            onClick={() => this.OnSubmitLogin()}
                            disabled={this.state.isSubmitting === true}
                        >
                            Login
                        </Button>

                        {/* <a href="#" title="Forget Password?" style={{ marginLeft: '0.5em', fontSize: '11pt' }}>Problem on login?</a> */}
                    </div>
                </div>
            </div >

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);