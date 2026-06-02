import React from 'react'
import {useAuth} from '../context/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Carousel from '../components/Carousel'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import {useNotif} from '../context/NotifContext'
import {useVenues} from '../context/VenueContext'
import {VenueService} from '../services/api'

const dashboard = () => {
  const {currUser, loading} = useAuth();
  const router = useRouter();
  const {showNotif} = useNotif();
  const {allVenues} = useVenues();

  //check if there's a user
  useEffect(() => {
    if (!loading && !currUser) {
      router.replace('/login');
    }
  }, [loading, currUser]);

  //get all venues
  useEffect(() => {
    try {
      
    } catch {
      console.log("error getting venues");
    }
  }, []);


  return (
    <div>
      <Header active="dashboard"/>
      {
        currUser ?
        <div className="">
          <div className="p-10 bg-sky-100">
            <h1 className="text-3xl">Welcome to the admin dashboard</h1>
            <p>Manage venues here!</p>
          </div>

          {/* div holding main and sidebar */}
          <div className="">
            
            {/* main div */}
            <div className="">
              <Carousel ranked={false} carouselItems={allVenues}/>
            </div>
            

            {/* <Sidebar type="dashboard">
              <p>sidebar</p>
            </Sidebar> */}
          
          </div>
          
        </div>
        
        :
        <p>You must be signed in to view this page</p>
      }

      
    </div>
  )
}

export default dashboard
