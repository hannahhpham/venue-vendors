import React from 'react'
import {useAuth} from '../context/AuthContext'
import Header from '../components/Header'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import {useNotif} from '../context/NotifContext'

const dashboard = () => {
  const {currUser, loading} = useAuth();
  const router = useRouter();
  const {showNotif} = useNotif();

  useEffect(() => {

    if (!loading && !currUser) {
      router.replace('/login');
    }

  }, [loading, currUser]);

  return (
    <div>
      <Header active="dashboard"/>
      {
        currUser ?
        <p>Welcome</p>
        :
        <p>You must be signed in to view this page</p>
      }

      
    </div>
  )
}

export default dashboard
