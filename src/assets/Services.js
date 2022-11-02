import firebase from '../utils/firebase';
import {onValue,ref } from "firebase/database";

function fetchComplains (userId) {

    const ComplainRef = ref(firebase, "/Complains");
    const connectedRef = ref(firebase, ".info/connected");

    const ComplainList = [];
    var complainData;
    var role = fetchUserRole(userId);
    
    onValue(connectedRef, (snap) => {
        
       if (navigator.onLine) {
            
        console.log("connected");

            onValue(ComplainRef, (snapshot) => {
                complainData = snapshot.val();
            });

        } 
        else 
        {
            console.log("not connected");
            if(localStorage.getItem("ComplainList") !== undefined){
                const localStorageComplains = JSON.parse(localStorage.getItem("ComplainList"));
                complainData = localStorageComplains;
            }
        }

     });
        
        
        if(role === "Employee")
        {
            for(let id in complainData)
            {
                if(complainData[id].LoggedBy === userId)
                {
                    ComplainList.push({id,...complainData[id]});
                }
            }
        }
        else if(role === "Admin")
        {
            for(let id in complainData)
            {
                ComplainList.push({id,...complainData[id]});
            }
        }
        else if(role === "Field Engineer")
        {
            for(let id in complainData)
            {
                if(complainData[id].AgentID === userId)
                {
                    ComplainList.push({id,...complainData[id]});
                }
            }
        }
            
        return ComplainList;
};

function countComplains (userId) {

    const ComplainList = fetchComplains(userId);
    var newCount = 0 ; 
    var closedCount = 0;
    var InProcessCount = 0;

    for(let id in ComplainList){
        
        if(ComplainList[id].Status === "New")
        {
            newCount++;
        }
        else if(ComplainList[id].Status === "In Process")
        {
            InProcessCount++;
        }
        else if(ComplainList[id].Status === "Closed")
        {
            closedCount++;
        }
    }

    var Counts = {
        New: newCount,
        InProcess : InProcessCount,
        Closed: closedCount
    }

    return Counts;
};

function fetchSignedInUserDetails(userId){
    
    var givenUserDetails = {};
    const UserRef = ref(firebase, "/userInfo/");

    onValue(UserRef, (snapshot) => {

            const Users = (snapshot.val());
            for(let user in Users)
            {
                if(Users[user].userID === userId)
                {
                    givenUserDetails = Users[user];
                    break;
                }
            }
            
    });
        return givenUserDetails;
};

function fetchUserRole(userId){

    var User = fetchSignedInUserDetails(userId);
    var UserRole = User.role;
    return UserRole;
};

function fetchAllFieldEngineers(){
    var FieldEngineers = [];
    const UserRef = ref(firebase, "/userInfo");

    onValue(UserRef, (snapshot) => {
        if(snapshot.exists()){
            const Users = (snapshot.val());
            for(let user in Users)
            {
                if(Users[user].role === "Field Engineer")
                {
                    FieldEngineers.push(Users[user]);
                }
            }
            }
            else{
                FieldEngineers = [];
            }
    });
        return FieldEngineers;
}

export{fetchComplains,fetchSignedInUserDetails, fetchUserRole ,fetchAllFieldEngineers, countComplains};