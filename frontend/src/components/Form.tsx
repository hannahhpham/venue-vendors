import React from 'react';
import {useState} from "react";
import Link from 'next/link';
import Button from './Button';

interface formProps {
  title : string;
  altMsg : string;
  altLoc : string;
  signup : boolean;
  //login or signup pages will give specific function represented here
  onSubmit : (email: string, password: string, type?: string) => void;
}

const Form = ({title, altLoc, signup, altMsg, onSubmit}: formProps) => {

  //get hooks ready
  // TODO: use useReducer instead?
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<string>("");

  //call the signup/login function given by parent
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //prevent reloading of page immediately

    if (signup) {
      onSubmit(email, password, type); //this will call handleSignup
    }
    else {
      onSubmit(email, password); //this will call handleLogin
    }
    
  };

  return (
    <div className="flex">

      <div className=" flex-1 w-1/2 p-10 pl-20 w-md  m-auto my-10">
        <h2 className="text-5xl font-bold ">Connecting Hirers<br></br> and Vendors</h2>
        <br></br>
        <p className="italic">Whether you're planning an event or providing a venue, 
           Venue Vendors makes the process simple and easy.</p>
        <ul className="list-disc pl-5 mt-4 space-y-5">
          <li>Streamline your event planning process</li>
          <li>Manage all your venue hiring in one place</li>
          <li>Track applications and requests</li>
        </ul>   
      </div>

      <div className="flex-1">
      <div className="grid justify-center p-10 w-md rounded-xl shadow m-auto my-10">
        <h1 className="text-3xl font-bold m-auto text-center">{title}</h1>
        <form className="block mt-5" onSubmit={handleFormSubmit}>

        {/* if user is signing up then add a field for the type of user */}
        {signup && 
          (<div className="grid-template-rows-2 mb-2">
                <label className="block font-medium">User type</label>
                <select className="block p-2 outline outline-black bg-neutral-50 rounded w-100" 
                        onChange={(e)=>setType(e.target.value)}
                        required
                >
                  <option value="vendor">Vendor</option>
                  <option value="hirer">Hirer</option>
                </select>
            </div>)
        }

            <div className="grid-template-rows-2 mb-2">
                <label className="block font-medium">Email</label>
                <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100" 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)} //e.target.value is the input entered. e is the event object created when smth happens
                />
            </div>

            <div className="grid-template-rows-2 mb-2">
                <label className="block font-medium">Password</label>
                <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100" 
                       type="password"
                       required 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       />
            </div>
            
            <div className="grid-template-columns-2 m-auto text-center my-5">
                <Button type="submit" text="Submit"/>

            </div>
            
        </form>
        <Link  href={'' + altLoc} className="m-auto text-center hover:underline">{altMsg}</Link>
      </div>
      </div>
      
    </div>
  )
}

export default Form;
