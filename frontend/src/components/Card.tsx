import React from 'react'

interface cardProps {
  heading: String;
  style?: String;
  children: React.ReactNode;
}

{/* Children Typing: https://www.w3schools.com/typescript/typescript_react.php */}
const Card = ({ heading, style, children }: cardProps) => {
  return (
    <div className="">
      <div className={"p-5 m-5 rounded-md shadow-md text-center " + style}>

        <h3 className="text-xl font-medium">{heading}</h3>
        {children}

      </div>
    </div>
  )
}

export default Card;
