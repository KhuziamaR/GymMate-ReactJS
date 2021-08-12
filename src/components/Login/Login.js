import React, { useState, useEffect } from "react";
import { auth, provider } from "../../firebase";
import "./Login.css";
import logo from "../../assets/logo.png";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import database from "../../firebase";
import { Link, useHistory } from "react-router-dom";

function Login() {
  const [{}, dispatch] = useStateValue();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const signInGoogle = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        console.log(result.user);
        const fullName = result.user.displayName.split(" ");
        database
          .collection("people")
          .doc(result.user.uid)
          .set({
            firstName: fullName[0],
            lastName: fullName[1],
            age: "notSet",
            location: {
              lat: lat,
              long: long,
            },
            uid: result.user.uid,
          });
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      }
    });
  }, []);
  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="Gym Mate Logo" />
        <div className="login__text">
          <h1>Sign in to Gym Mate</h1>
        </div>
        <Link to="/signin">
          <div className="login__withGoogle">
            <img src={logo} alt="GymMate Logo" />
            <span>Sign In with Gym Mate</span>
          </div>
        </Link>
        <div className="login__withGoogle" onClick={signInGoogle}>
          <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt="Google Logo"
          />
          <span>Sign In with Google</span>
        </div>
        <Link to="/signup">
          <div className="login__withGoogle">
            <div>Dont have an Account? Sign Up Here.</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Login;

// ////////
// import React from "react";
// import Avatar from "@material-ui/core/Avatar";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
// import { auth, provider } from "./firebase";
// import { useStateValue } from "./StateProvider";
// import { actionTypes } from "./reducer";

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {"Copyright © "}
//       <Link color="inherit" href="https://material-ui.com/">
//         Gym Mate
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));

// function Login() {
//   const [{}, dispatch] = useStateValue();

//   const classes = useStyles();

//   const signInWithGoogle = () => {
//     auth
//       .signInWithPopup(provider)
//       .then((result) => {
//         dispatch({
//           type: actionTypes.SET_USER,
//           user: result.user,
//         });
//       })
//       .catch((error) => alert(error.message));
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <CssBaseline />
//       <div className={classes.paper}>
//         <Avatar className={classes.avatar}>
//           <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//           Sign in
//         </Typography>
//         <form className={classes.form} noValidate>
//           <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//           />
//           <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//           />
//           <FormControlLabel
//             control={<Checkbox value="remember" color="primary" />}
//             label="Remember me"
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             className={classes.submit}
//           >
//             Sign In
//           </Button>
//           <Button
//             fullWidth
//             variant="contained"
//             color="secondary"
//             onClick={signInWithGoogle}
//             className={classes.submit}
//           >
//             Sign In With Google
//           </Button>

//           <Grid container>
//             <Grid item xs>
//               <Link href="#" variant="body2">
//                 Forgot password?
//               </Link>
//             </Grid>
//             <Grid item>
//               <Link href="#" variant="body2">
//                 {"Don't have an account? Sign Up"}
//               </Link>
//             </Grid>
//           </Grid>
//         </form>
//       </div>
//       <Box mt={8}>
//         <Copyright />
//       </Box>
//     </Container>
//   );
// }
// export default Login;
