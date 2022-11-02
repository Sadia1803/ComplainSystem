import React , {useContext, useEffect, useState} from 'react';
import {userData} from "../assets/userContext";
import '../App.css';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Grid} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useForm} from 'react-hook-form';
import { getAuth, signOut , updatePassword } from "firebase/auth";
import {useHistory} from "react-router-dom";
import {fetchSignedInUserDetails} from "../assets/Services";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 1500,
    justify: "center"
  },
  aligncenter:{
    display: "flex",
    justifyContent:"center",
    padding: '10px',
},
txt:{
  padding:"6px",
  marginTop:'6px'
},
});


export default function LogComplain(){
    
    const classes = useStyles();
    const { handleSubmit,} = useForm();
    
    const currentUser = useContext(userData);
    const [pwd, setPwd] = useState("");
    const [UserDetails, setUserDetails] = useState({});
    const history = useHistory();
    
    //Logout Handler
    const handleLogout = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        history.push("/LoginForm");// Sign-out successful.
      }).catch((error) => {
        console.log(error.message);
      });
    }

    //Fetching User info
    useEffect(() => {
      const tempUserDetails = fetchSignedInUserDetails(currentUser.uid);
      setUserDetails(tempUserDetails);
    
    }, [])

    const passwordReset = () => {
      if(pwd !== ""){
      updatePassword(currentUser, pwd).then(() => {
        alert("Sucess")
      }).catch((error) => {
        alert("Unable to Update: Error : " + error.message);
      });
    }else{
      console.log("can not set empty password")
    }
    }

    const onSubmit = () => {
      passwordReset();
      setPwd("");
    }

  return (

    <Box className={classes.aligncenter}>
    <Paper className={classes.root} justisfy="center" elevation={0}>

      <Grid container spacing={1} >
        
        {/* Header */}
        <Grid item style={{ display: "flex"}} xs={12} sm={12} md={12} la={12} xl={12}>
          <PersonIcon style={{color: "#03580a"}}/> 
          <Typography variant="subtitle1" style={{ marginLeft: '5px', color: "#03580a"}} > <b>{UserDetails.fullName}'s Profile</b> </Typography>
        </Grid>

        {/* Last Updated 
        <Grid style={{ display: "flex"}} xs={12} sm={12} md={12} la={12} xl={12}>
          <Typography className={classes.txt} variant="subtitle2" style={{color: "#03580a"}}> 
          <b> Last Updated at : </b> </Typography>
        </Grid>
        */}
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <Grid container spacing={1} >

          {/* Full Name */}
          <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6}>

                <TextField
                fullWidth
                label = {UserDetails.fullName}
                placeholder = "Full Name"
                variant="outlined"  
                size="small" 
                inputProps={
                  { readOnly: true, }
                }
              />
          </Grid>

          {/* Email */}
          <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6}>

            <TextField
            fullWidth
            label = {UserDetails.email}
            placeholder = "Email"
            variant="outlined" 
            size="small" 
            inputProps={
              { readOnly: true, }
            }
            />

        </Grid>

          {/* Contact */}
          <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6}>
              
              <TextField
              fullWidth
              label = {UserDetails.contact}
              placeholder="Contact"
              variant="outlined" 
              size="small"
              inputProps={
                { readOnly: true, }
              }
              />

          </Grid>

          {/* Address */}
          <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6}>

            <TextField
            placeholder="Address"
            label = {UserDetails.address}
            multiline rows={2} 
            variant="outlined" 
            size="small" 
            fullWidth 
            inputProps={
              { readOnly: true, }
            }
            />

        </Grid>

          {/* State */}
          <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6}>

          <TextField
            fullWidth 
            label = {UserDetails.state}
            placeholder = "State"
            variant="outlined" 
            size="small" 
            inputProps={
              { readOnly: true, }
            }
            />

          </Grid>

          {/* Country */}
          <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6}>

            <TextField
            fullWidth 
            label = {UserDetails.country}
            variant="outlined" 
            size="small" 
            inputProps={
              { readOnly: true, }
            }
            />
      
        </Grid>

        <Grid item style={{ display: "flex"}} xs={12} sm={12} md={12} la={12} xl={12}>
          <Typography className={classes.txt} variant="subtitle2" style={{color: "#03580a"}}> <b> Change Password </b> </Typography>
        </Grid>

          {/* Password */}
        <Grid item className={classes.txt} xs={8} sm={4} md={8} la={8} xl={8}>

            <TextField
            fullWidth
            placeholder="Change Password" 
            variant="outlined" 
            size="small"
            value={pwd}
            onChange={event => {
              setPwd(event.target.value) 
            }}
            />
        </Grid>
        
        <Grid item className={classes.txt} xs={4} sm={4} md={4} la={4} xl={4}>

            <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{background:"#a18011"}}
            
            >
              Change
            </Button>

          </Grid>

          {/* Submit Button + Logout Button*/} 
          <Grid item className={classes.aligncenter} style={{justifyContent:"center"}} spacing={3} xs={12} sm={12} md={12} la={12} xl={12}>
            <Button 
            onClick={handleLogout}
            variant="contained"
            style={{ margin:"10px", background: "#03580a",color: "#f3faf4" , width:"100%" }} >
            Logout 
            </Button>
          </Grid>

        </Grid>
      </form>
      
    </Paper>
    </Box>
    );
}