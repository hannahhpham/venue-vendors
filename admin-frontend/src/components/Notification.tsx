import React from 'react'
//import notif context

interface NotificationType {
  //onClose: () => void,
  message: string
  type: 'success' | 'fail' | 'other',
  //visible: boolean
}

//TBD: add tailwind sliding animation. may need to change iseState isVisible
const Notification = ({message, type}: NotificationType) => {

  //set the background colour of the notification depending on what type it is
  const completeClassName =`shadow-[0_0_40px_2px]/30 shadow-black fixed top-0 right-0 m-5 justify-center
                        border border-[#e0e0e0] rounded-md max-h-[50%] text-wrap max-w-[30%]
                        ${type==="other" ? "bg-white" : 
                          type==="success" ? "bg-[#E5FFDB]" : "bg-[#FFE1DB]"}
                          
                        transition-transform duration-500 ease-in-out transform
                          `;
  return (
    <div> 
        <div className={completeClassName} >
          
          {/* the actual div with content */}
            <div className="flex flex-col items-center p-5 ">
                {message}
            </div>
 
        </div>
      
    </div>
  )
}

export default Notification
