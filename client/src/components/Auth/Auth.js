import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName:'', lastName:'', email:'', password:'', confirmPassword:'' };

const Auth = () => {
    const classes = useStyles();
    const [showPassowrd, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassowrd = () => setShowPassword((prevShowPassowrd) => !prevShowPassowrd);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(isSignup) {
            dispatch(signup(formData, navigate))
        } else {
            dispatch(signin(formData, navigate))
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const onSuccess = (res) => {
        const token = res?.credential;
        const result = jwt_decode(res.credential);
        try {
            dispatch({ type: 'AUTH', data: { result, token }});

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                            )}
                            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                            <Input name="password" label="Password" handleChange={handleChange} type={showPassowrd ? "text" : "password"} handleShowPassowrd={handleShowPassowrd} />
                            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Grid container justify="center">
                    <Button style={{
                        maxWidth: "185px",
                        maxHeight: "50px",
                        minWidth: "30px",
                        minHeight: "30px"
                        }} type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    </Grid>
                    <Grid container justify="center">
                    <GoogleOAuthProvider clientId="102560005446-mae4nqueunsvmlbon1dr53911k7gsd9i.apps.googleusercontent.com">
                        <GoogleLogin 
                            onSuccess={onSuccess}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </GoogleOAuthProvider>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Have an account? Sign In' : "New User? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default Auth