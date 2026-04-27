import React from 'react'
import {useState} from 'react'
import VenueCard from './VenueCard'
import {useAuth} from '../context/AuthContext'
import { Venue } from "../types/venues";
import {useRouter} from 'next/router'

interface carouselType {
  type : 'all' | 'shortlistedVenues' 
  ranked: boolean,
  carouselItems : Venue [],
}

const Carousel = ({type, ranked, carouselItems} : carouselType) => {
  //get only initial starting index - calculate others as offset
  const router = useRouter();
  const [itemIndex, setItemIndex] = useState<number>(0);
  const {currUser} = useAuth(); //need to know which user we are getting data for
  
  //----------- CALCULATE WHAT DATA IS SHOWN IN CAROUSEL ------------------------
  let visibleItems: Venue[]  = [];

  if (currUser) {
    //get array of all items
    if (type==="all") { //set up which 5 items are shown
      for (let i = 0 ; i < 5 ; i++) {
        visibleItems.push(carouselItems[(itemIndex + i + carouselItems.length) % carouselItems.length]);
      }
    } 
    //get array of just shortlisted stuff
    else if (type === "shortlistedVenues" ) {
      visibleItems = carouselItems;
    } 
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
        
        {type==='all' ?
          (<img src={'/backArrow.png'} data-testid="backButton" onClick={moveBack} className="hover:drop-shadow ml-5"/>) 
          :
          (carouselItems.length > 5 ?
            (<img src={'/backArrow.png'} onClick={moveBack} className="hover:drop-shadow ml-5"/>)
            :
            (<div/>) //how do i write nothing...
          )
        }

        {/* div containing the items */}
        <div className="flex w-full min-w-0 overflow-hidden mr-2">
          {visibleItems.length > 0 ? visibleItems.map((item, index) => (
            <div key={index} className="flex-1 min-w-0 overflow-hidden">
              <VenueCard linkToPage={true} onClick={() => router.push(`../venues/${item.id}`)}>
                <p {...(index === 0 ? {"data-testid" : "venueName"} : {})} className=" font-bold">{ranked ? (index+1) + ". " + item.name : (item.name)}</p>
                <p className="italic text-sm">{item.address}</p>
                {/* if applications, show other stuff too */}
              </VenueCard>
                        
            </div> 
          )) : 
          (<p className="italic text-sm pl-2">{type==="all" ? 
          (<span>There are no venues. Please check again later.</span>)
          : //if its not of type 'all' then its shortlisted venues. NEED TO UPDATE THIS IS THERE ARE MORE TYPES
          (<span>You have no shortlisted venues. Start applying now!</span>)} </p>)}
         
        </div>

        {/* if we're showing all items, or if the # of items > 5, show the arrows */}
        {type==='all' ?
          (<img data-testid="forwardButton" src={'/forwardArrow.png'} onClick={moveForward} className="hover:drop-shadow shadow-black mr-5"/>) 
          :
          (carouselItems.length > 5 ?
            (<img src={'/forwardArrow.png'} onClick={moveForward} className="hover:drop-shadow shadow-black mr-5"/>)
            :
            (<div/>)
          )
        }

    </div>
  )
}

export default Carousel
