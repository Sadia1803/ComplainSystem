import React, {useEffect,useContext,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import {userData} from "../assets/userContext";
import {countComplains} from '../assets/Services';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 1500,
    justify: "center"
  },
  aligncenter:{
    display: "flex",
    justifyContent:"center",
    padding: '30px',
  },
  title: {
    fontSize: 14,
  },
});

export default function ViewStatusCards() {
  const classes = useStyles();
  const currentUser = useContext(userData);
  const [ComplainCount, setComplainCount] = useState({
    New: 0,
    InProcess : 0,
    Closed: 0
  });

  useEffect(() => {

    setComplainCount(countComplains(currentUser.uid));

    }
  , [])


  return (
    <Box className={classes.aligncenter}>
    <Paper square className={classes.root} justify = "center">

    <Grid container spacing={3}>

      <Grid item xs={12} sm={6} md={4} la={4} xl={3}>
        <Card variant="outlined">
          <CardContent style={{backgroundColor: '#F5E313'}}>
            <Typography variant="h1" component="h1"> {ComplainCount.New} </Typography>
            <Typography variant="h5" component="p"> New Complains </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} la={4} xl={3}>
        <Card variant="outlined" color="primary">
          <CardContent style={{backgroundColor: '#E54256'}}>
            <Typography variant="h1" component="h1"> {ComplainCount.InProcess} </Typography>
            <Typography variant="h5" component="p"> In Process Complains </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} la={4} xl={3}>
        <Card variant="outlined">
          <CardContent style={{backgroundColor: '#24D67D'}}>
            <Typography variant="h1" component="h1"> {ComplainCount.Closed} </Typography>
            <Typography variant="h5" component="p"> Closed Complains </Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
 
    </Paper>
    </Box>
  );
}
