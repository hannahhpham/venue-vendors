import Header from "../components/Header";
import Form from "../components/Form";
import Main from '../components/Main';
import {useRouter } from 'next/router';
import {useAuth} from "../context/AuthContext";
import {userApi} from '../services/api'


export default function Login() {
  const router = useRouter(); //hooks need to be called at top of the function
  const {login} = useAuth();

  //call function from auth context file
  const handleLogin = (email: string, password: string) => {
    login(email, password);

  };

  return (
    <Main type='wholePage'>
      <title>Login</title>

      <Header active={"login"}/>

      <Form title="Login" 
            altMsg={"Don't have an account? Sign up for free!"} 
            altLoc="/signup"
            signup={false}
            onSubmit={handleLogin}
            />
    </Main>
  );
}