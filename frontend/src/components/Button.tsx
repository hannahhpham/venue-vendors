import React from 'react'


interface buttonProps {
    text: string;
    type? : "submit" | "reset";
    className?: string;
    // so we can have icons
    children? : React.ReactNode,
    onLeft? : boolean,
    //function will be given from parent
    onClick? : () => void;
}

const Button = ( {text, type, className, children, onLeft, onClick} : buttonProps) => {

  const handleButtonClick = (e: any) => {
    //call parent function
    onClick?.(); // ? means that the function is only called if it exists
  }

  return (
    <div>
      {/* change the className to accept props SO WE CAN HAVE DIFF COLOURS!! */}
        <button className= { `bg-black hover:bg-[#474747] text-white font-bold rounded p-2 m-1 ` + className } 
                onClick={handleButtonClick}
                type={type}
                >
          {
            onLeft && (
              <div className='inline'>
                {children}
              </div>
            )
          }
          {text}
          {
            !onLeft && (
              <div className='inline'>
                {children}
              </div>
            )
          }
        </button>
    </div>
  )
}

export default Button
