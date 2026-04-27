import React from 'react'
import {useState} from 'react'
import VenueCard from './VenueCard'
import { Venue } from "../types/venues";
import { useVenues } from "../context/VenueContext";
import {Application} from '../types/apply'
import * as utils from '../utils/utils'

interface ApplicationCarouselType {
  type: 'pastVenues' | 'applications'
  carouselItems : Application [],
}

//need to make completely different carousel as the functionality is different.

const ApplicationCarousel = ({type, carouselItems} : ApplicationCarouselType) => {
  //get only initial starting index - calculate others as offset
  const [itemIndex, setItemIndex] = useState<number>(0);
  const {allVenues} = useVenues(); 
  
  //----------- CALCULATE WHAT DATA IS SHOWN IN CAROUSEL ------------------------
  let visibleItems: Application[]  = []; 
  // visibleItems = carouselItems;

  //get array of all items
  if (carouselItems.length > 5) { //set up which 5 items are shown
    for (let i = 0 ; i < 5 ; i++) {
      visibleItems.push(carouselItems[(itemIndex + i + carouselItems.length) % carouselItems.length]);
    }
  } 
  //get array of just shortlisted stuff OR past venues
  else  {
    visibleItems = carouselItems;
  } 
  

  //----------- CAROUSEL SPECIFIC STUFF ------------------------
  //functions to change the display
  const moveForward = () => {
    setItemIndex(prevIndex => (prevIndex+1) % carouselItems.length);
  }

  const moveBack = () => {
    setItemIndex(prevIndex => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  }

  return (
    <div className="flex justify-between items-center w-full min-w-0">
        
        {/* decide whether arrow is rendered depending on # items */}

        {carouselItems.length > 5 ?
            (<img src={'/backArrow.png'} onClick={moveBack} className="hover:drop-shadow ml-5"/>)
            :
            (<div/>) //how do i write nothing...
        }
        

        {/* div containing the items */}
        <div className="flex w-full min-w-0 overflow-hidden mr-2">
          {visibleItems.length > 0 ? visibleItems.map((application, index) => (
            <div key={index} className=" flex-1 min-w-0 w-full overflow-hidden mr-2">
              <VenueCard linkToPage={false} onClick={() => {}}>
                {/* get details of application and venue */}
                <p className="font-bold">{application.eventName}</p>
                <p className="italic text-xs"><span className="font-bold">Date: </span> {application.date}, {application.startTime}</p>
                <p className="italic text-xs"><span className="font-bold">Duration: </span> {utils.elapsedTime(application.startTime, application.endTime)} hours</p>
                <p className="italic text-xs"><span className="font-bold">Guests: </span> {application.guests}</p>
                <p className="italic text-xs"><span className="font-bold">Venue: </span> {allVenues
                                                                                         .filter((venue: Venue) => venue.id === application.venueID)
                                                                                    .map((venue: Venue) => venue.name)}</p>

                
                {utils.compareTime(application.date) && application.accepted === true ? 
                (<span>
                    <p className="italic text-xs"><span className="font-bold">Address: </span> {allVenues
                      .filter((venue: Venue) => venue.id === application.venueID)
                      .map((venue: Venue) => venue.address)}</p>      
                 <p className="italic text-xs"><span className="font-bold">Rating Received: </span> {application.vendorRating}</p>
                
                </span>) :
               
                (<div/>)}                                                  
                

                <div className="flex italic text-xs">
                    <p className="font-bold pr-1">Status: </p> 
                        {typeof application.accepted === 'boolean' ? 
                        //if theres a value here, then it's either been accepted or rejected
                        (application.accepted === true ? <p>Accepted</p> : <p>Rejected</p>
                        ) : 
                        //if theres no value, then it hasn't yet been reviewed
                        (<p>Submitted</p>) }
                </div>
              </VenueCard>
                        
            </div>
          )) : 
          (<p className="italic text-sm pl-2">You have no {type==="applications" ? <span>applications</span> 
                          : <span>past hired venues</span>
          }. Start applying now!</p>)}
         
        </div>

        {/* if we're showing all items, or if the # of items > 5, show the arrows */}
        
          {carouselItems.length > 5 ?
            (<img src={'/forwardArrow.png'} onClick={moveForward} className="hover:drop-shadow shadow-black mr-5"/>)
            :
            (<div/>)
          }
        

    </div>
  )
}

export default ApplicationCarousel
