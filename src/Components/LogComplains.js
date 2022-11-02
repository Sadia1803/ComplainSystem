import React , {useContext} from 'react';
import {userData} from "../assets/userContext";
import '../App.css';
import { ref ,push} from "firebase/database";
import firebase from '../utils/firebase';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Grid, FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {useForm, Controller } from 'react-hook-form';
import { Alert } from '@material-ui/lab';
import {category} from '../assets/ComplainCategory';
import ImageUploading from 'react-images-uploading';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {serverTimestamp } from "firebase/database";

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      maxWidth: 1500,
      justify: "center",
    },
    aligncenter: {
      display: "flex",
      justifyContent: "center",
      padding: '10px',
    },
    txt: {
      padding:"6px",
      marginTop:'6px'
    },
    gallery: {
      height:'100px',
      width:'100px',
    },
    btn:{
      margin:'10px',
      padding: '5px',
      background:"#a18011"
    },
    divpic:{
      padding: '10px',
    }
});

export default function LogComplain() {
  
  const classes = useStyles();
  const { register, handleSubmit, reset, formState: { errors} , control } = useForm();
  const [images, setImages] = React.useState([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const currentUser = useContext(userData);
  //When the form will be Submitted this will be executed
  const onSubmit = (data) => {

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + "-" + today.getFullYear();
    var compPictures = [];
    
    //form an array of the images
    if(images !== null ){
      images.map((pic) => 
      {
        compPictures.push(pic);
      }
      );
    }

    //push complains to complains JSON on firebase
    push(ref(firebase, "Complains"),
    {
      complain_id : serverTimestamp(),
      Subject : data.subject,
      Category : data.Category,
      Details: data.Details,
      Status: "New",
      LoggedDate: date,
      ComplainPictures : compPictures,
      LoggedBy: currentUser.uid
    }
    );
    //resetting form
    reset();
    setImages([]);
    setIsSubmitted(true);
  };

  return (
    <Box className={classes.aligncenter} justisfy="center" >
      <Paper className={classes.root} justisfy="center" elevation={0}>

        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container >

            {/*Heading*/}
            <Grid item className={classes.txt} style={{ display: "flex" }} spacing={3} xs={12} sm={12} md={12} la={12} xl={12} >
              <Typography variant="subtitle1" style={{ marginLeft: '5px', color: "#03580a"}} > <b>Log New Complain</b> </Typography>
            </Grid>

            {/*sucess message */}
            {isSubmitted ?
            <Grid item className={classes.txt} xs={12} sm={12} md={12} la={12} xl={12} >
              <Alert 
                id="message"
                severity="success"
                onClose={() => {
                  setIsSubmitted(false)
                }}
                >
                Success!Complain Added
              </Alert>
            </Grid>
            : ""}

            {/*Subject TextBox*/}  
            <Grid item className={classes.txt} xs={12} sm={12} md={6} la={12} xl={12} >  
              <TextField
                fullWidth
                name="Subject"
                placeholder="Subject"
                variant="outlined"
                size="small"
                error={!!(errors.subject)}
                helperText={errors.subject ? errors.subject.message : ""}
                {...register("subject", { required: "The Field is Required" })}
              />
            </Grid>
          
            {/*Category*/}  
            <Grid item className={classes.txt} spacing={2} xs={12} sm={12} md={6} la={6} xl={6} > 
              <FormControl fullWidth size="small" variant="outlined" error={errors.Category} >         
                <InputLabel> Category </InputLabel>  
                <Controller
                  render={(props) => (
                    <Select {...register("Category", { required: "Please Choose Category" })}  >
                      {category.map((data, key) => {
                        return (
                          <MenuItem value = {data.Name} key={key}> {data.Name} </MenuItem>  
                        );
                      })}
                    </Select>
                  )}
                  defaultValue=''
                  control={control}
                />
                <FormHelperText> {errors.Category?errors.Category.message : ""} </FormHelperText>
              </FormControl>
            </Grid>

            {/*Details TextBox*/} 
            <Grid item className={classes.txt} xs={12} sm={12} md={12} la={6} xl={6} >
              <TextField
                fullWidth
                name="Details"
                placeholder="Details"
                variant="outlined"
                size="small"
                multiline rows={3}
                error={!!(errors.Details)}
                helperText={errors.Details?errors.Details.message:""}
                {...register("Details", { required: "The Field is Required" })}
              />
            </Grid>

          </Grid>  
       
          {/*Image Selection*/}
          <Grid item className={classes.txt} xs={12} sm={12} md={12} la={6} xl={6} >
            
            <ImageUploading
              multiple 
              value={images} 
              onChange={onChange} 
              maxNumber={5} 
              dataURLKey="data_url"
            >
                {({imageList,onImageUpload,onImageRemove,isDragging,dragProps,onImageRemoveAll}) => (                  
                  
                  <div>

                  <Fab 
                    color="primary" 
                    aria-label="add"
                    variant="extended"
                    size="small"
                    onClick={onImageUpload}
                    style={(isDragging ? { color: 'red' } : undefined)}
                    className={classes.btn}
                    {...dragProps}
                    >
                    <AddIcon />
                    Add/Drag Photos
                  </Fab>

                  <Fab 
                    color="primary" 
                    variant="extended"
                    size="small"
                    onClick={onImageRemoveAll}
                    className={classes.btn}
                    >
                    <ClearIcon />
                    Clear All
                  </Fab> 

                  <Box fontStyle="italic" m={1} fontSize={12} style= {{marginLeft:'30px'}}>
                    Maximum Five Pictures
                  </Box>                      
                  
                  <div className={classes.divpic} >
                    {imageList.map((image, index) => (
                    
                      <Button
                        onClick= {onImageRemove}
                        endIcon={<DeleteIcon />}
                        color="primary"
                        size="big"
                      >
                      <img src={image['data_url']} key={index} alt="" className={classes.gallery} />
                      </Button>
                            
                    ))}
                  </div> 


                  {({ imageList, onImageUpload, onImageRemoveAll, errors }) => (
                      errors && <div>
                        {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
                      </div>
                    )}

                  </div>
              
              )}
             
            </ImageUploading>

          </Grid>
            
          {/* Button*/}
          <Grid item className={classes.aligncenter} xs={12} sm={12} md={12} la={12} xl={12} >
            <Button 
              variant="contained"
              type="submit"
              style={{ margin:"10px", background: "#03580a",color: "#f3faf4" , width:"100%" }} > Submit 
            </Button>
            </Grid>  
        
        </form>
      </Paper>
    </Box>

  );
}       