import React from 'react'
import {useState} from 'react'
import VenueCard from './VenueCard'
import {useAuth} from '../context/AuthContext'
import { Venue } from "../types/types";
import {useRouter} from 'next/router'
import {VenueService, UserService} from '../services/api'
import {useVenues} from '../context/VenueContext'

interface carouselType {
  ranked: boolean,
  carouselItems : Venue [],
}

const Carousel = ({ranked, carouselItems} : carouselType) => {
  //get only initial starting index - calculate others as offset
  const router = useRouter();
  const [itemIndex, setItemIndex] = useState<number>(0);
  const {currUser, allUsers} = useAuth(); //need to know which user we are getting data for


  const items = carouselItems;

  //----------- CALCULATE WHAT DATA IS SHOWN IN CAROUSEL ------------------------
  let visibleItems: Venue[]  = [];

  if (currUser) {
    //get array of all items
  
    if (items.length > 4) {
    for (let i = 0 ; i < 4 ; i++) {
        visibleItems.push(carouselItems[(itemIndex + i + carouselItems.length) % carouselItems.length]);
    }
    }
    else {
    visibleItems = items;
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
        
        {carouselItems.length > 4 ?
          (<img src={'/backArrow.png'} data-testid="backButton" onClick={moveBack} className="hover:drop-shadow ml-5"/>) 
          :
          (null)
        }

        {/* div containing the items */}
        <div className="flex w-full min-w-0 overflow-hidden mr-2">
          {items.length > 0 ? visibleItems.map((item, index) => (
            <div key={index} className="flex-1 min-w-0 overflow-hidden">
              <VenueCard linkToPage={true} onClick={() => router.push(`/venues/${item.id}`)}>
                <p className="text-xl font-bold text-blue-900"> {item.name}</p>
                <p className="italic text-m"><span className="font-bold">Address: {item.address}</span></p>

                <br/>
                <p className="italic text-sm"><span className="font-bold">Owner: </span>
                 {allUsers.find((user) => Number(user.id) === Number(item.ownerID))?.firstName} <span></span>
                 {allUsers.find((user) => Number(user.id) === Number(item.ownerID))?.lastName}
                 </p>
                <p className="italic text-sm"><span className="font-bold">Phone:</span> {item.phone}</p>
                <p className="italic text-sm"><span className="font-bold">Email:</span> {item.email}</p>
                <br/>
                <p className="italic text-sm"><span className="font-bold">Capacity:</span> {item.capacity}</p>
                <p className="italic text-sm"><span className="font-bold">Rate:</span> ${item.rate} per hour</p>
              </VenueCard>
                        
            </div> 
          )) : 
          (<p className="italic text-sm pl-2">There are no venues. Please check again later.</p>)}
         
        </div>

        {/* if we're showing all items, or if the # of items > 5, show the arrows */}
        {carouselItems.length > 3 ?
          (<img data-testid="forwardButton" src={'/forwardArrow.png'} onClick={moveForward} className="hover:drop-shadow shadow-black mr-5"/>) 
          :
          null
        }

    </div>
  )
}

export default Carousel
