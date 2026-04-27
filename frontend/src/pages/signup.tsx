import Header from "../components/Header";
import Form from "../components/Form";
import Main from '../components/Main';

export default function Signup() {
  const handleSignup = () => {
    //do this later
    alert("Signup functionality will be implemented in the next part of the assignment.");
  }

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