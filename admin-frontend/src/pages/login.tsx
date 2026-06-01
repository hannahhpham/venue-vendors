import React from 'react'
import Header from '../components/Header'
import Form from '../components/Form'
import {useAuth} from '../context/AuthContext'

const login = () => {
  const {login, currUser} = useAuth();

  const handleLogin = (username: string, password: string) => {
    login(username, password);
  }

  return (
    <div>
        <Header active="login"/>
        <Form title="Login" onSubmit={handleLogin}/>
      
    </div>
  )
}

export default login
