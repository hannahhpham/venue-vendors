import React from 'react'

//need useState in the file where popup is opening
//const [openPopup, setOpenPopup] = useState<boolean>(false);

interface popupProps {
    children: React.ReactNode,
    onClose: () => void;
}


const Popup = ({children, onClose} : popupProps) => {


  return (
    // div covering entire screen
    <div className="bg-black/20 fixed inset-0 flex items-center justify-center">
      {/* the actual div with content */}
      <div className="w-[50%] bg-white border border-[#e0e0e0] rounded-md  overflow-y-scroll">

        <div className='relative'>
            <img src={'/close.png'} onClick={onClose} className="absolute top-0 right-0 ml-auto m-5 hover:drop-shadow"/>
        </div>
        <div className="pt-10 pb-10 flex flex-col items-center justify-center">
            {children}
        </div>
      </div>
    </div>
  )
}

export default Popup
