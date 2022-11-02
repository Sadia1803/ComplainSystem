import React from "react";
import '../App.css';
import { Typography, Grid, makeStyles,  Button,TextField} from '@material-ui/core';
import PIAlogo from "../PIAlogo.jpeg"
const UseStyles = makeStyles({
    aligncenter: {
      display: "flex",
      justifyContent: "center",
      padding: '5px',
    },
    txt: {
      padding:"6px",
      marginTop:'6px'
    },
    paper:{
        padding : "20px",
        height : "70vh"
    },
    logo: {
    
        flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
    }  
});

export default function loginForm (props){

    const {email, setEmail, password, setPassword, handleLogin, error} = props;    
    const classes = UseStyles();

    return (
        
        <Grid container spacing={3}>

            <div className="container">
                <div className="app-wrapper">
                    
                    {/*Logo*/}
                    <Grid item className={classes.aligncenter}  xs={12} sm={12} md={12} la={12} xl={12} style={{margin:"20px"}} >
                        <img src ={PIAlogo} alt=""/>
                    </Grid>
                    
                    <form className="form-wrapper" style={{marginTop:"50px"}}>

                        {/*Email TextBox*/}  
                        <Grid item className={classes.txt} xs={12} sm={12} md={12} la={12} xl={12} >  
                        <TextField
                            fullWidth
                            name="Email"
                            placeholder="Email"
                            variant="outlined"
                            size="small"
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </Grid>

                        {/*Password TextBox*/}  
                        <Grid item className={classes.txt} xs={12} sm={12} md={12} la={12} xl={12} >  
                        <TextField
                            fullWidth
                            name="password"
                            placeholder="Password"
                            variant="outlined"
                            size="small"
                            type="password"
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </Grid>

                        {/* Button*/}
                        <Grid item className={classes.aligncenter} xs={12} sm={12} md={12} la={12} xl={12} >
                            <Button 
                            variant="contained"
                            type="submit"
                            style={{ background: "#03580a",color: "#f3faf4" , width:"100%" }}
                            onClick={handleLogin}
                            > Login 
                            </Button>
                        </Grid>  

                        {/* Button
                        <Grid item className={classes.aligncenter} xs={12} sm={12} md={12} la={12} xl={12} >
                            <Button 
                            variant="contained"
                            style={{background: "#a18011",color: "#f3faf4" , width:"100%" }} > Create Account 
                            </Button>
                        </Grid>  */}
                        
                        { error ? 
                        <Grid item className={classes.aligncenter} xs={12} sm={12} md={12} la={12} xl={12} >
                            <Typography variant="subtitle1" id="errorMsg" style={{margin:'5px',color:'red'}}>{error}</Typography>
                        </Grid>  
                        : ""}
                    </form>
                    </div> 
            </div> 
        </Grid>
    );
};