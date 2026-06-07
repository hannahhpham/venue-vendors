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
import Analytics from '../components/Analytics'
import AnalyticBox from '../components/AnalyticBox'

//https://medium.com/@wathsaradesilva2000/create-pdfs-in-react-using-jspdf-and-html2canvas-aa59667438fc
//https://medium.com/@saidularefin8/generating-pdfs-from-html-in-a-react-application-with-html2canvas-and-jspdf-d46c5785eff2

const dashboard = () => {
  const {currUser, loading} = useAuth();
  const router = useRouter();
  const {showNotif} = useNotif();
  const {allApplications, mostActiveHirers, mostPopularVenues, pdfRef, downloadReport} = useApplications();
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
      
      //focus useRef on the report section
      
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
            <div className=" w-[75%] min-w-0">
              {/* carousel showing all venues */}
              <div className="ml-5 mr-5">
                <h2 className="mt-10">All Venues</h2>
                <Carousel ranked={false} carouselItems={allVenues}/>

                {/* carousel showing the featured venues */}
                <br/><br/>
                <h2>Featured Venues</h2>
                
                  <Carousel ranked={false} carouselItems={allVenues.filter(venue => venue.isFeatured === true)} />
                 <br />
                <br/>
              </div>

            </div>
            
            {/* sidebar showing report - this is printed to the pdf */}
            <div className='w-[25%] bg-sky-50 min-h-80' >
              <Sidebar type="dashboard" >

                <div ref={pdfRef}>
                  <h3 className="text-2xl underline text-center">Report</h3><br/>
                
                  <p className="text-l font-bold">Top 3 most popular venues:</p>
                  <ol className="list-decimal list-inside">
                    {
                      mostPopularVenues.map((venue) => 
                      <AnalyticBox venue={venue.venue} day={venue.day} timeslot={venue.timeslot}/>)
                      
                    }
                  </ol>

                  <br/>

                  <div className="justify-between flex items-center">
                    <p className="font-bold text-l inline">Top 3 active applicants:</p>
                  </div>
                  
                  <ol className="list-decimal list-inside">
                    {
                      mostActiveHirers.map((applicant) => 
                      <li key={applicant.hirer.id}>
                        {applicant.hirer.firstName} {applicant.hirer.lastName}  
                        <ul className='text-xs block pl-10 list-disc'>
                          <li key={applicant.percentage}> {applicant.percentage}% of applications accepted </li>
                        </ul>
                      </li>
                      
                      ) 
                    }
                  </ol> <br/>
                  <Analytics type="mostAccepted" currApps={allApplications} />

                
                </div>

                <div className="text-center">
                    <Button text="Download Report" onClick={downloadReport}/>
                </div>
                
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
