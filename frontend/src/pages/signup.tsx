import Header from "../components/Header";
import Form from "../components/Form";
import Main from '../components/Main';
import {useState} from 'react'
import {userAPI} from '../services/api'
import {useNotif} from '../context/NotifContext'

export default function Signup() {
  const {showNotif} = useNotif();

  const handleSignup = async (email: string, password: string, type?: string, 
                        firstName?: string, lastName?: string, phoneNumber?: string,
                        confirmPassword?: string) => {
    //MAKE API CALL HERE TO SIGN THE USER UP

     //check we have no missing parameters
    if (type != null && firstName != null && lastName!= null && phoneNumber!=null && confirmPassword!=null) {
      if (type.trim() && firstName.trim( ) && lastName.trim() && phoneNumber.trim() && email.trim() && password.trim() && confirmPassword.trim()) {
       
        //regex stuff https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
        const capitalChar = /[A-Z]/
        const specialChar = /[!@#$%^&*?<>,.:;"'{}|()_]/
        const number = /[0-9]/

        //validate password length
        if (password.trim().length < 6) {
          showNotif("Password must be at least 6 characters.", "fail");
        }
        //complex password validator
        else if (!capitalChar.test(password.trim()) || !specialChar.test(password.trim())
                 || !number.test(password.trim())) { //special characters
          showNotif("Password must include special characters.", "fail");
        }
        else if (password.trim() != confirmPassword.trim()) {
          showNotif("Passwords must match.", "fail");
        }
        else {
          //check there isn't a user with the same email
            const allUsers = await userAPI.getAllUsers();

            let success: boolean = true;
            for (let i = 0 ; i < allUsers.length ; i++) {
              if (allUsers[i].email == email) {
                success = false;
              }
            }

            if (success) {
              await userAPI.createUser(email, password, type, firstName, lastName, phoneNumber);
              showNotif("User successfully created.", "success");
            } 
            else {
              showNotif("An account with that username already exists.", "fail");
            }
            
        }
   
      }
      else {
        showNotif("Please enter non-space characters into the fields.", "fail");
      }
    }
    else {
      showNotif("Please fill out all fields.", "fail");
    }

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