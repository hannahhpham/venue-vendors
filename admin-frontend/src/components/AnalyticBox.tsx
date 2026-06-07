import React from 'react'

interface props {
    venue: string,
    day: string,
    timeslot: string

}
const AnalyticBox = ({venue, day, timeslot} : props) => {
  return (
    <div className="pb-2">
        <p className="font-bold text-blue-900">{venue}</p>
        <div className="flex items-center">
            <img src="../calendar.png" className="inline w-[5%] mr-2" />
            <p className="text-xs ">
                <span className="font-bold">Most Popular Day: </span>
                    {day}
            </p>
        </div>

        <div className="flex items-center">
            <img src="../clock.png" className="inline w-[5%] mr-2" />
            <p className="text-xs ">
                <span className="font-bold">Most Popular Timeslot: </span>
                    {timeslot}
            </p>
        </div>
        

        
      
    </div>
  )
}

export default AnalyticBox
