import React ,{useState, useEffect , Fragment, useContext} from 'react';
import {userData} from "../assets/userContext";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import '../App.css';
import { useHistory } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import {Box, Grid, FormControl, InputLabel, MenuItem, Select, Button} from '@material-ui/core';
import {ref,update,onValue} from "firebase/database";
import firebase from '../utils/firebase';
import {useForm} from 'react-hook-form';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles({
    txt: {
      padding: '10px',
    },
    root: {
        maxWidth: 1500,
        justify: "center",
      },
      aligncenter: {
        
        justifyContent: "center",
        margin:'10px',
      },
      btn:{
        padding:'10px',
        margin:'20px',
      },
      gallery: {
        height:'100px',
        width:'100px',
        border:'solid 1px'
      }
});

export default function ViewComp(props) {
    
    const classes = useStyles();
    let history = useHistory();
    const { handleSubmit } = useForm();
    const ComplainRef = ref(firebase, "/Complains/" + props.location.aboutProps.complainObject.x.id);
    var [currentComplain, setCurrentComplain] = useState({});
    const [updatedStatus, setUpdatedStatus] = useState(props.location.aboutProps.complainObject.x.Status);
    const [comment, setComment] = useState("");
    const [model, setModel] = useState(false);
    const [tempimgSrc, setTempImgSrc] = useState('');
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const getImg = (imgSrc) =>{
        setTempImgSrc(imgSrc);
        setModel(true);
    }
    
    useEffect(() => {   
        onValue(ComplainRef, (snapshot) => { 
            const clickedComplain = snapshot.val();
            setCurrentComplain(clickedComplain);
        });
    }, [])
    const currentUser = useContext(userData);

    const onSubmit = () => {
        
        const commentsArray = [];

        if(comment !== ""){

            if (currentComplain.Comments !== undefined ){
                currentComplain.Comments.map((oldcomments) => {
                    commentsArray.push(oldcomments);
                })
            }
            commentsArray.push(
                { 
                    Body: comment,
                    date: new Date(),
                    commentedBy: currentUser.email
                });
            update(ComplainRef, { 
                Comments : commentsArray
            });
            commentsArray.length = 0;
            setComment("");   
            
        }
        
        if(updatedStatus !== currentComplain.Status){
            
            update(ComplainRef, { 
                Status: updatedStatus,
            });
            setIsSubmitted(true);
        }
          
    }
    
    const picturesArray = currentComplain.ComplainPictures;
    const availableComments = currentComplain.Comments;

    return (
        
        <Box className={classes.aligncenter} >
        <Paper className={classes.root} justisfy="center" elevation={0}>

            <Grid container justifyContent="center">

                <Grid item style={{ display: "flex"}} xs={12} sm={12} md={12} la={12} xl={12}>
                    <ArrowBackIcon color="#f3faf4" size="large" onClick={() => history.goBack()} style={{ color: "#f3faf4", background: "#a18011"}}/>
                </Grid>

                <Grid item xs={12} sm={12} md={12} la={12} xl={12} style={{marginTop:"5px", padding:"5px"}} >
                        <Typography variant="subtitle1" > <b> Complain Id : </b> </Typography>
                        <Typography variant="subtitle2" style={{background:'#F5F5F5'}} > {currentComplain.complain_id}</Typography>
                        <Typography variant="subtitle1" > <b> Subject: </b> </Typography>
                        <Typography variant="subtitle2" style={{background:'#F5F5F5'}} > {currentComplain.Subject}</Typography>
                        <Typography variant="subtitle1" > <b> Status : </b></Typography>
                        <Typography variant="subtitle2" style={{background:'#F5F5F5'}} > {currentComplain.Status} </Typography>
                        <Typography variant="subtitle1" > <b> Date Logged: </b></Typography>
                        <Typography variant="subtitle2" style={{background:'#F5F5F5'}} > {currentComplain.AssignDate} </Typography>
                        <Typography variant="subtitle1" > <b> Details </b> </Typography> 
                        <Typography variant="subtitle2" style={{background:'#F5F5F5'}} > {currentComplain.Details} </Typography>
                </Grid>
                
                {picturesArray ?

                <Grid item xs={12} sm={12} md={12} la={12} xl={12} style={{padding:"5px"}} >
                    <Typography variant="subtitle1" > <b> Supporting Documents </b> </Typography>
                    
                    <div>
                        <div className={model? "model open" : " model"}>
                            <img src={tempimgSrc} alt= "ComplainPictures"/>
                            <CloseIcon onClick={()=> setModel(false)} />
                        </div>

                        <div >
                            {picturesArray.map((item) => (
                                <img className={classes.gallery} alt= "Complain description via photos" src={item.data_url} style={{ }} onClick={() => getImg(item.data_url)}/>   
                            ))}
                        </div>
                    </div>
                </Grid> 
                
                : ""                
                }
                

                {availableComments ?

                    <Grid item xs={12} sm={12} md={12} la={12} xl={12} style={{padding:"5px"}} >
                        <Typography variant="subtitle1" > <b> Comments </b> </Typography>
                        
                            <div >
                                {availableComments.map((comment) => (
                                    <Paper style={{ color: "#f3faf4", background: "#a18011", padding:'5px', margin: '10px'}}>
                                    <Typography variant="subtitle2" > {comment.date} </Typography>
                                    <Typography variant="subtitle2" > By: {comment.commentedBy} </Typography> 
                                    <Typography variant="subtitle2" > {comment.Body} </Typography>
                                    </Paper>
                                ))}
                            </div>
                     
                    </Grid> 

                    : ""                
                }

                {/*This fragment only exists for In process cmplaians */}
                {currentComplain.Status === "In Process" ? 

                <Fragment>
                
                    <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6} >

                        <TextField
                            label="Add Comments"
                            multiline
                            fullWidth
                            rows={1}
                            variant="outlined"
                            size="small"
                            value={comment}
                            onChange={event => {
                                setComment(event.target.value)
                            }}
                        />

                    </Grid> 

                    {/*sucess message */}
                    {isSubmitted ?
                    <Grid item className={classes.txt} spacing={3} xs={12} sm={12} md={12} la={12} xl={12} >
                    <Alert 
                        id="message"
                        severity="success"
                        onClose={() => {
                            setIsSubmitted(false)
                        }}
                        >
                        <AlertTitle>Success</AlertTitle>
                        Updated
                    </Alert>
                    </Grid>
                    : ""}
                    
                    <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6} >

                        <FormControl variant="filled" size="small" fullWidth >
                            <InputLabel >Status</InputLabel>
                            <Select
                            value={updatedStatus}
                            onChange={event => {
                                setUpdatedStatus(event.target.value) 
                            }}
                            >
                                <MenuItem value="Closed"> Closed </MenuItem>
                                <MenuItem value="In Process">In Process</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Box textAlign='center'>
                            <Button variant="contained" color="primary" type="submit" className={classes.btn} size="large"> Submit </Button>
                        </Box>

                    </form>

            </Fragment>
            : ""}

            </Grid>     
            
        </Paper>
        </Box>
        
    );
}
