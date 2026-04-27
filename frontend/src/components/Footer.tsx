import React from 'react'
import Link from 'next/link'
import {useAuth} from '../context/AuthContext'

const Footer = () => {
  const {currUser} = useAuth();

  return (
    <div className="bg-blue-950 text-white">
        <div className=" flex flex-col-2 justify-between p-5 pt-10 min-h-[100px]">
            <Link href='/'>
              <h4 className="inline-block font-medium">Venue Vendors</h4>
            </Link>
            
            

              {currUser ? ( //user is logged in. show relevant links
                <div>
                <Link className="mr-5 ml-5" href='/'>
                  <p className="inline-block hover:underline">Home</p>
                </Link>

                <Link className="mr-5 ml-5" href='/dashboard'>
                  <p className="inline-block hover:underline">Dashboard</p>
                </Link>
              </div>
              ) 
              :
              ( //user isn't logged in. present the signup and login links
              <div>
                <Link className="mr-5 ml-5" href='/signup'>
                  <p className="inline-block hover:underline">Signup</p>
                </Link>

                <Link className="mr-5 ml-5" href='/login'>
                  <p className="inline-block hover:underline">Login</p>
                </Link>
              </div>
              )}
        </div>
    </div>
  )
}

export default Footer;
