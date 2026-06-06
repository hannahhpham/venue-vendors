import React from 'react'
import {useAuth} from '../context/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Carousel from '../components/Carousel'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import {useNotif} from '../context/NotifContext'
import {useVenues} from '../context/VenueContext'
import {useApplications} from '../context/ApplyContext'
import {VenueService} from '../services/api'
import Button from '../components/Button'
import {Venue} from '../types/types'

const dashboard = () => {
  const {currUser, loading} = useAuth();
  const router = useRouter();
  const {showNotif} = useNotif();
  const {allApplications, mostActiveHirers, mostPopularVenues} = useApplications();
  const {allVenues, fetchVenues} = useVenues();

  //check if there's a user
  useEffect(() => {
    if (!loading && !currUser) {
      router.replace('/');
    }
  }, [loading, currUser]);

  //console.log(mostPopularVenues);

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
                <h3 className="text-2xl underline text-center">Report</h3><br/>

                <p className="text-l font-bold">Top 3 most popular venues:</p>
                <ol className="list-decimal list-inside">
                  {
                    mostPopularVenues.map((venue) => 
                    <li key={venue.venue}>
                      <span className="">{venue.venue}</span>

                      {/* day and time */}
                      <ul className="text-xs pl-10 list-disc">
                        <li key="day">
                          Day: {venue.day}
                        </li>

                        <li key="time">
                          Time: {venue.timeslot}
                        </li>
                      </ul>
                      
                    </li>
                    )
                  }
                </ol>

                <br/>

                <div className="justify-between flex items-center">
                  <p className="font-bold text-l inline">Top 3 active applicants:</p>
                  <img className="mr-5 inline hover:drop-shadow w-[15px]" src={"/tooltip.png"} 
                    title="Percentage ratings are the ratio of accepted applications over all submitted applications.
                    "/>
                </div>
                
                <ol className="list-decimal list-inside">
                  {
                    mostActiveHirers.map((applicant) => 
                    <li key={applicant.hirer.id}>
                      {applicant.hirer.firstName} {applicant.hirer.lastName}  
                       <span className='text-xs'> ({applicant.percentage}%) </span>
                    </li>
                    ) 
                  }
                </ol> <br/>

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
