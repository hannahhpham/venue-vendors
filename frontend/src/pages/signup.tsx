import Header from "../components/Header";
import Form from "../components/Form";
import Main from '../components/Main';
import {useState} from 'react'

export default function Signup() {
  const handleSignup = (email: string, password: string, type?: string) => {
    //MAKE API CALL HERE TO SIGN THE USER UP
  }

   const [newUser, setNewUser] = useState({
      email: "",
      password: "",
      type: "",
  });


  return (
    <Main type='wholePage'>
        <title>Signup</title>

        <Header active={"none"}/>
        <Form title="Signup" 
              altMsg={"Already have an account? Login Now!"} 
              signup={true}
              altLoc={"/login"}
              onSubmit={handleSignup}/>
        
    
    </Main>
  );
}