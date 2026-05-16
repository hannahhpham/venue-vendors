import React from 'react'

interface VenueProps {
    
    linkToPage: boolean,
    children: React.ReactNode,
    onClick?: () => void;
}

const VenueCard = ({children, onClick, linkToPage} : VenueProps) => {
 
  //use template string
  const divClass = `carouselText h-[92%] truncate border border-[#e0e0e0] rounded-md m-2 p-5 
                    ${linkToPage ? "hover:bg-sky-100 hover:drop-shadow " : ""}`;

  return (
     <div className={divClass} onClick={onClick}>
        {children}
    </div>
  )
}

export default VenueCard
