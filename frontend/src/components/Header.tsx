import React from 'react'
import Link from 'next/link'
import {useAuth} from '../context/AuthContext'
import Button from '../components/Button'


interface headerProps {
  active: "none" | "login" | "dashboard" | "search" | "profile";
}


const Header = ({active}: headerProps) => {
  //check if user is logged in
  const {currUser, logout} = useAuth();

  return (
    <div className="text-white">
        <div className="flex bg-blue-950 p-2 items-center">
          
          <div className="">
            <Link href="/" className='flex items-center'>
              <img src={'/favicon.png'} className="w-10 h10"/>
              <h1 className="font-bold p-3 text-xl">Venue Vendors</h1>
            </Link>
          </div>

          <ul className='flex'>
            <div className='flex items-center mr-auto ml-3'>
              <Link href="/search" className="hover:underline">
                <li className={ "rounded-3xl px-5 p-2  " + (active == "search" && "text-black bg-white font-medium")}>Search</li>
              </Link>
            </div>
          </ul>
          
 
          <nav className="ml-auto">
            <ul className="flex">
            {/* conditional rendering ❤️ */}    

            {currUser ? 
              (
              <div className="flex items-center  ">
                <Link href='/profile'>
                  <li className={"hover:underline rounded-3xl p-2 px-5 mr-2 " + 
                      (active == "profile" && "text-black bg-white font-medium")}>
                    Profile
                  </li>

                </Link>
                <Link href="/dashboard">
                  <li className={"hover:underline rounded-3xl p-2 px-5 mr-2 " + 
                      (active == "dashboard" && "text-black bg-white font-medium")}>
                    <img src="person.png" className={"inline mr-2 " + (active !== "dashboard" && "invert")}></img>
                    Dashboard
                  </li>
                </Link>
                <Button text="Logout" onClick={logout}/>
              </div>
              )
              :
              //  user is NOT logged in
              (
              <div>
                <Link href="/login" className="hover:underline">
                  <li className={ "rounded-3xl px-5 p-2 inline " + (active == "login" && "text-black bg-white font-medium")}>Login</li>
                </Link>
              </div>
              )
              
            }
            </ul>
          </nav>
            

        </div>
      
    </div>
  )
}

export default Header
