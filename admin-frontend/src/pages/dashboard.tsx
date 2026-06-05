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
import Button from '../components/Button'
import {Venue} from '../types/types'

const dashboard = () => {
  const {currUser, loading} = useAuth();
  const router = useRouter();
  const {showNotif} = useNotif();
  const {allVenues, fetchVenues} = useVenues();

  //check if there's a user
  useEffect(() => {
    if (!loading && !currUser) {
      router.replace('/');
    }
  }, [loading, currUser]);

  //get all venues
  useEffect(() => {
      const wrapper = async () => {
          await fetchVenues();
      }
      wrapper();
      
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
          <div className="flex">
            
            {/* main div */}
            <div className="w-[80%] min-w-0">
              {/* carousel showing all venues */}
              <div className="ml-5">
                <h2 className="mt-5">All Venues</h2>
                <Carousel ranked={false} carouselItems={allVenues}/>

                {/* carousel showing the featured venues */}
                <br/>
                <h2>Featured Venues</h2>
                <div className="ml-5 mr-5">
                  <Carousel ranked={false} carouselItems={allVenues.filter(venue => venue.isFeatured === true)} />
                </div> <br />
                <br/>
              </div>

            </div>
            
            <div className='w-[20%] bg-sky-50 min-h-80'>
              <Sidebar type="dashboard">
                <h3>Report</h3>

                <p>Top 3 most popular venues:</p>
                <ol>
                  <li>x</li>
                  <li>x</li>
                  <li>x</li>
                </ol>

                <br/>

                <p>Top 3 most active applicants:</p>
                <ol>
                  <li>x</li>
                  <li>x</li>
                  <li>x</li>
                </ol>

                <Button text="Download Report"/>
              </Sidebar>
            </div>
            
          </div>
          
        </div>
        
        :
        <p>You must be signed in to view this page</p>
      }

      
    </div>
  )
}

export default dashboard
