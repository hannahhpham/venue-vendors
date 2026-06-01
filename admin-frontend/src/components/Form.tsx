import React from 'react';
import {useState} from "react";
import Link from 'next/link';
import Button from './Button';

interface formProps {
  title : string;

  //login or signup pages will give specific function represented here
  onSubmit : (username: string, password: string) => void;
}

const Form = ({title, onSubmit}: formProps) => {

  //get hooks ready
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  //call the login function given by parent
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //prevent reloading of page immediately
    
    onSubmit( username, password); //this will call handleLogin
    
  };

  return (
    <div className="flex">

        <div className=" w-[50%] p-10 pl-20  m-auto my-10">
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

        <div className=" w-[50%]">
            <div className="grid justify-center p-10 w-md rounded-xl shadow m-auto my-10">
                <h1 className="text-3xl font-bold m-auto text-center">{title}</h1>
                <form className="block mt-5" onSubmit={handleFormSubmit}>

                
                    <div className='flex items-start'>
                        <div>   
                            

                            <div className="grid-template-rows-2 ">
                            <label className="block font-medium">Username</label>
                            <input className= {`block p-2 outline outline-black bg-neutral-50 rounded`}
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} //e.target.value is the input entered. e is the event object created when smth happens
                            />
                            </div>


                            <div className="grid-template-rows-2 mb-2">
                            <label className="block font-medium">Password</label>
                            <input className={`block p-2 outline outline-black bg-neutral-50 rounded`}
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>

                    <div className="grid-template-columns-2 m-auto text-center my-5">
                        <button className="bg-black hover:bg-[#474747] text-white font-bold rounded p-2 m-1 " type="submit">Submit</button>
                    </div>
                    
                </form>

            </div>
        </div>
    </div>
    )
}

export default Form;
