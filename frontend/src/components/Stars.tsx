import React from 'react'
import {User} from '../types/users'
import { useAuth } from '../context/AuthContext';

interface starType {
  type: 'hirerRating' | 'hirerCredibility',
}

const Stars = ({ type }: starType) => {

  const { currUser, getRepRating, updateUser } = useAuth();

  //calculate the rating and return the string
  const ratingCalculation = (): string => {
    let string = "";
  
    if (type === "hirerRating" && currUser) {
      //calculate average across historical hire
      const rate = Math.round(getRepRating(currUser));
      for (let i = 0; i < rate; ++i) {
        string += "★ ";
      }
     
      //should we just replace this with a string straight up saying they have no rating
      if (!rate) {
        string = "☆ ☆ ☆ ☆ ☆ ";
      }
      else if (rate < 5) {
        for (let i = 0; i < 5 - rate; ++i) { 
          string += "☆ ";
        }
      }
      
              
    }
    //credibility is always max 4 stars.
    //abn and business certificate make credibility FOR THAT APPLICATION to 5 stars, cuz client
    //can decide whether they apply on behalf of business OR by themselves.
    else if (type === "hirerCredibility" && currUser) {
      //add number of documents. 3 docs total, so scale is 1, 3, 5.
      const credibility = currUser.credibility ?? 0;

      for (let i = 0 ; i < credibility ; i++) {
        string += "★ ";
      }

      for (let i = 0 ; i < 5 - credibility ; i++) {
        string += "☆ ";
      }

    }

    return string.trim();
  }

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-md p-3">
      <p data-testid={"starString"} className="text-center text-2xl">{ratingCalculation()}</p>
    </div>
  )
}

export default Stars
