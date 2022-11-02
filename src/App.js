import Tab from './Components/Tab';
import React, {useState, useEffect} from "react";
import LoginForm from './Components/loginForm';
import { getAuth, signInWithEmailAndPassword , onAuthStateChanged} from "firebase/auth";
import { userData } from './assets/userContext';

function App() {
    
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) =>{
      clearError();
      event.preventDefault();
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
      .catch(err => {
          clearInputs();
          setError(err.message);
          console.log(err.message);
      });
      
  }

  const clearInputs = () =>{
      setEmail('');
      setPassword('');
  }
  
  const clearError = () =>{
      setError('');
  }

  const authListener = () =>{
    const auth = getAuth();
    onAuthStateChanged(auth,(user) =>{
          if(user){
              clearInputs();
              setUser(user);
          }else{
              setUser('');
          }
      });
  }

  useEffect(()=>{
      authListener();
  },[]);

  return (
    <userData.Provider value = {user}>
      <div>
      {  
        !user ? (<LoginForm 
                email={email} 
                setEmail={setEmail} 
                password={password} 
                setPassword={setPassword} 
                handleLogin={handleLogin}
                error={error}
                setError={setError}></LoginForm>):
                (<Tab></Tab>)
      }
      </div>   
      </userData.Provider>   
  );
  
}

export default App;
