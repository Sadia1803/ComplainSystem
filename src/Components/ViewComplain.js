import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {userData} from "../assets/userContext";
import React, {useState, useEffect, Fragment, useContext} from 'react';
import {Box, Grid, FormControl, InputLabel, MenuItem, Select, Card, CardContent, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {Link} from "react-router-dom";
import {useForm, Controller } from 'react-hook-form';
import PersonIcon from '@material-ui/icons/Person';
import firebase from '../utils/firebase';
import {ref,update} from "firebase/database";
//import CircularProgress from '/CircularProgress';
import Load from '../assets/Loading_icon.gif'
import ConfirmDialog from './confirmation';
import {fetchComplains, fetchAllFieldEngineers, fetchUserRole} from '../assets/Services';

const useStyles = makeStyles({
  root:
  {
      flexGrow: 1,
      maxWidth: 1500,
      justify: "center",
  },
  aligncenter:
  {
      display: "flex",
      padding: '10px',
      justifyContent: "center",
  },
  card:
  {
      marginTop:'10px'
  },
  cardroot: {
    minWidth: 200,
    paddingBottom: 0, 
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 12,
  },
});

export default function ComplainsViewer() {
  
  const classes = useStyles();
  const [agents, setAgents] = useState([]);
  const [ComplainList, setComplainList] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [searchStatus, setsearchStatus] = useState("");
  const { register, control } = useForm();
  const [loading, setLoading] = useState(true);
  const [assignedTo, setAssignedTo] = useState({});
  const [confirmOpen ,setConfirmOpen] = useState(false);
  const currentUser = useContext(userData);
  const currentUserRole = fetchUserRole(currentUser.uid);

  //fetching Data
   useEffect(() => {

    const Complains = fetchComplains(currentUser.uid);
    setComplainList(Complains);
    
    const AgentList = fetchAllFieldEngineers();
    setAgents(AgentList);

    if(Complains.length === 0){
        setLoading(true);
    }else{
        
        var localStorageComplains = [];
        for(let comp in Complains){
            localStorageComplains.push(Complains[comp]);
        }
        
        localStorage.setItem("ComplainList",JSON.stringify(localStorageComplains));
        setLoading(false);
    }

    }
  , []);

  
  const AssignComplainto = (complainID) => {
    
    const RefrenceComplain = ref(firebase, "/Complains/" + complainID);
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + "-" + today.getFullYear();
    update(RefrenceComplain, { 
        AgentID : assignedTo.userID,
        Status : "In Process",
        AssignDate : date
    });
    const ComplainList = fetchComplains(currentUser.uid);
    setComplainList(ComplainList);
  };

  function getAgentName (agentID){
    var agentName;
    
    for(let agent in agents)
    {
        if(agents[agent].userID === agentID)
        {
            agentName = agents[agent].fullName;
            break;
        }
    }
    return agentName;
  }

  return (
    
    <Box className={classes.aligncenter} >
    <Paper className={classes.root} justisfy="center" elevation={0}>

        <Grid container spacing={1} className={classes.txt}>

            <Grid item className={classes.txt} style={{ display: "flex" }} xs={12} sm={12} md={12} la={12} xl={12} >
              <Typography variant="subtitle1" style={{ marginLeft: '5px', color: "#03580a"}} > <b>Complains</b> </Typography>
            </Grid>

            {/* Search */}  
            <Grid item className={classes.txt} xs={12} sm={12} md={6} la={6} xl={6} > 
                <TextField
                fullWidth
                id="Search"
                placeholder="Enter complain id or Subject"
                variant="outlined"
                size="small"
                onChange={event => {
                    setsearchTerm(event.target.value) 
                }}
                />
            </Grid>

            {/* Search By Category */}
            <Grid item className={classes.aligncenter} xs={12} sm={12} md={6} la={6} xl={6} >    

                <FormControl 
                    variant="outlined"
                    size="small"
                    fullWidth
                    >
                    <InputLabel >Search by status</InputLabel>
                    <Select
                        onChange={event => {
                            setsearchStatus(event.target.value); 
                        }}
                    >
                        <MenuItem value={'All'}>All</MenuItem>
                        <MenuItem value={'New'}>New</MenuItem>
                        <MenuItem value={'In Process'}>In Process</MenuItem>
                        <MenuItem value={'Closed'}>Closed</MenuItem>
                    </Select>
                </FormControl>

            </Grid>

            {loading ? 
                
                <Box style={{width:'100px' , height:'100px'}} align="center" className={classes.aligncenter}>
                    <img src={Load} />  
                </Box>

            : ""}

            {/* Used Filter to filter out complains for searching */}
            {ComplainList ? 
            
            ComplainList.filter(
                (val)=>
                {
                    if(searchTerm === ''){
                        return val
                    }else if (val.Subject.includes(searchTerm)){
                        return val
                    }else if (val.complain_id.toString().includes(searchTerm)){
                        return val
                    }else{
                        return ""
                    }
                }
                )
                .filter((valStatus)=>{
                  if(searchStatus === '' || searchStatus === 'All'){
                      return valStatus
                  }else if (valStatus.Status === searchStatus){
                      return valStatus
                  }else{
                      return ""
                  }
              })
                .map((x) => 
                    <Grid item xs={12} sm={6} md={4} la={4} xl={3}>
                
                        {/* Card */}
                        <Card className={classes.cardroot} variant="outlined" >
                            
                            <CardContent>
                            
                                <Link to = {{ pathname: './detailsViewComplain', aboutProps: { complainObject: {x} } }} style={{ textDecoration: 'none', color: '#0a0a0a' }} >

                                    <Grid item xs={12} sm container>

                                        <Grid item xs container direction="column" spacing={2}>
                                            
                                            <Grid item xs>
                                                <Typography gutterBottom variant="h6" >
                                                <b> {x.complain_id} </b>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                {x.Subject} 
                                                </Typography>
                                            </Grid>

                                            <Grid item>

                                            </Grid>

                                        </Grid>

                                        <Grid item>

                                            <Button 
                                                style={{ borderWidth:1,
                                                alignItems:'center',
                                                width:100,
                                                backgroundColor:'#a18011',
                                                color: "#f3faf4",
                                                borderRadius:50}}
                                                > 
                                                {x.Status} 
                                            </Button>
                                    
                                            <Typography variant="body2" color="textSecondary" align="center">
                                                {x.AssignDate}
                                            </Typography>
                                        
                                        </Grid>
                                    
                                    </Grid>
                                    
                                    <Typography variant="body2" style= {{ backgroundColor:'#F5F5F5', }}>
                                    <span> 
                                        {x.Details}
                                    </span>
                                    </Typography>
                                
                                </Link>    

                                {x.Status === "New" && currentUserRole === "Admin" ?
                                <Fragment>
                                    <FormControl 
                                    fullWidth 
                                    variant="outlined"
                                    size="small" 
                                    value={assignedTo} 
                                    style={{marginTop:"20px"}}
                                    >         
                                        <InputLabel> Assign to </InputLabel>  
                                        <Controller
                                        render={(props) => (
                                            <Select 
                                            {...register("assign")}
                                            onChange={event => {
                                                setAssignedTo(event.target.value);
                                                setConfirmOpen(true);
                                            }}
                                            >
                                            
                                            {agents.map((agent, key) => {
                                                return (
                                                    <MenuItem value={agent} key={key}>
                                                    {agent.fullName} 
                                                    </MenuItem>  
                                                );
                                            })}
                                            </Select>
                                        )}
                                        defaultValue=''
                                        control={control}
                                        />
                                        
                                        </FormControl>

                                        <ConfirmDialog
                                        title="Complain Assignment"
                                        open={confirmOpen}
                                        setOpen={setConfirmOpen}
                                        onConfirm={() => AssignComplainto(x.id)}
                                        >
                                        Are you sure you want to assign this Complain to {assignedTo.fullName}?
                                        </ConfirmDialog>
                                    </Fragment>
                                    : ""}

                                    {x.Status !== "New" ?

                                        <div style={{marginTop:"20px", display:"flex"}}>
                                            
                                            <PersonIcon style={{color: "#03580a"}}/>
                                            
                                            <Typography 
                                            variant="subtitle1" 
                                            style={{ marginLeft: '5px', color: "#03580a"}} > 
                                                <b>{getAgentName(x.AgentID)}</b> 
                                            </Typography>
                                        
                                        </div>

                                    : ""}
                                </CardContent>
                            </Card>
                    </Grid>
                ) 
                
                :
                
                <Typography 
                variant="subtitle1" 
                style={{ marginLeft: '5px', color: "#03580a"}} > 
                    <b>No Complains</b> 
                </Typography>
                
                }         
        </Grid>
    </Paper>
    </Box>
    
  );
}
