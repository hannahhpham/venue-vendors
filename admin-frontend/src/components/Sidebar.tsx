import React from 'react'

interface SidebarType{
    type: 'hirerVenue' | 'dashboard' | 'vendorVenue' | 'search',
    children: React.ReactNode

}
const Sidebar = ({children, type} : SidebarType) => {

  return (
    <div>
        <div className={type === "dashboard"||"hirerVenue" ? 
                                 "bg-sky-50 h-full min-w-0 p-3" :
                                 "bg-sky-50 pl-5 pt-5"}>
          {children}
        </div>
        
    </div>
  )
}

export default Sidebar
