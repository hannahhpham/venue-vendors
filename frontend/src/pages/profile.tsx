import React from 'react'
import UserDetails from '../components/UserDetails'
import Header from "../components/Header";
import Button from "../components/Button";
import Main from '../components/Main';
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNotif } from '../context/NotifContext';

const profile = () => {
  const {currUser} = useAuth();

  return (
    <Main type="wholePage">
        <Header active="profile"/>

        <div className="p-10 bg-sky-100">
          <h1 className="text-3xl">User Details</h1>
          <p>Date of join: {currUser?.createdAt}</p>
        </div>

        <div className="p-10 pl-30 pr-30">
            <UserDetails edit={true}/>

        </div>

        
    </Main>
  )
}

export default profile
