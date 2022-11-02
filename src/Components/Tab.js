import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CreateIcon from '@material-ui/icons/Create';
import DnsIcon from '@material-ui/icons/Dns';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { Box } from '@material-ui/core';
import {BrowserRouter , Route, Switch, Link} from "react-router-dom";
import Log from './LogComplains';
import View from './ViewComplain';
import State from './ViewStatus';
import Profile from './Profile';
import Complain from './detailsViewComplain';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 1500,
    justify: "center"
  },
  aligncenter:{
    display: "flex",
    justifyContent:"center",
    marginBottom:"25px"
}
});

export default function IconTabs() {
  
  const routes = ["/logComplains","/viewComplain","/viewStatus","/profile","/detailsViewComplain"];
  const classes = useStyles();
  const [value, setValue] = React.useState("/logComplains");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  return (

    <BrowserRouter>
      <Route path="/">
        <Box className={classes.aligncenter} >
          <Paper square className={classes.root} justify = "center" elevation={1} >
        
            <Tabs value={value} onChange={handleChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
              <Tab icon={<CreateIcon />} style={{color: "#03580a" }} label="Log Complain" value={routes[0]} component={Link} to={routes[0]}/>
              <Tab icon={<DnsIcon />} style={{color: "#03580a" }} label="View Complains" value={routes[1]} component={Link} to={routes[1]} />
              <Tab icon={<EqualizerIcon />} style={{color: "#03580a" }} label="View Status" value={routes[2]} component={Link} to={routes[2]} />
              <Tab icon={<PersonPinIcon />} style={{color: "#03580a" }} label="My Profile" value={routes[3]} component={Link} to={routes[3]}/>
            </Tabs>

          </Paper>
        </Box>
    </Route>

    <Switch>
      <Route path="/logComplains" component={Log} />
      <Route path="/viewComplain" component={View} />
      <Route path="/viewStatus" component={State} />
      <Route path="/profile" component={Profile} />
      <Route path="/detailsViewComplain" component={Complain} />
    </Switch>
    
    </BrowserRouter>
    
  );
}