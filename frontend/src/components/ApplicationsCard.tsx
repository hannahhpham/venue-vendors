import React, { useEffect } from 'react'
import Popup from "./Popup";
import Card from "./Card";
import Button from './Button';
import ApplicationCarousel from './ApplicationCarousel';
import * as utils from "../utils/utils";
import { Application } from "../types/apply";
import { User } from "../types/users";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApplications } from "../context/ApplyContext";
import { userAPI } from '../services/api';

interface appCardProps {
    app: Application;
    history: boolean;
}

const ApplicationsCard = ({ app, history }: appCardProps) => {

    const { allUsers, getRepRating } = useAuth();
    const { allApplications, addNotes, setRepRating, setBooking, shortlist } = useApplications();

    // const hirer: User | undefined = allUsers.find((u: User) => u.id === app.hirerID);
    const [hirer, setHirer] = useState<User>(); 

    // not sure we really need this
    useEffect(() => {
        getHirer();
    }, [app]);

    const getHirer = async () => {
        const data = await userAPI.getUserById(app.hirerID);
        setHirer(data);
    }

    // to deal with adding notes to an application
    const [popupNotes, setPopupNotes] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>(app.notes);

    const handleAddNotes = (id: number) => {
        addNotes(id, notes.trim());
        setPopupNotes(false);
        setNotes("");
        setNotes(app.notes);
    };

    // get the status of the application
    const getStatus = () : string => {
        if (app.isAccepted === true) {
            return "Accepted";
        } else if (app.isAccepted === false) {
            return "Rejected";
        } else {
            return "In Progress";
        }
    }

    //get the hirers credibility.
    //  function is written here as the hirer's credibility changes per application
    const getHirerCredibility = (): number => {
        let credibility = hirer?.credibility || 0;

        if (app.abn && app.file) {//check if the hirer has submitted with a business
            credibility += 1;

        }
        
        return credibility;
    }

    // to deal with the rating popup
    const [ratingPopup, setRatePopup] = useState<boolean>(false);

    // to show the supporting documents for credibility rating
    const [credPopup, setCredPopup] = useState<boolean>(false);


    return (
        <div>
            {
                // card to be displayed in history
                history ? (
                    <div key={app.id}>
                        <Card heading={app.eventName} style="bg-blue-950 text-white">
                            <div className="grid grid-cols-3 text-left">
                                <div>
                                    <h3 className="text-sm font-normal">Applicant: {hirer?.firstName}</h3>
                                    <h4 className="text-xs">Reputation Rating: {hirer && getRepRating(hirer)} stars</h4>
                                    <h4 className="text-xs">Credibility Rating: {getHirerCredibility()} stars</h4>
                                </div>
                                <div className="">
                                    <h2 className="text-sm font-normal">Date: {new Date(app.date).toDateString()}</h2>
                                    <h2 className="text-sm font-normal">Duration: {utils.elapsedTime(app.startTime, app.endTime)} hours</h2>
                                    <h2 className="text-sm font-normal">Number of Guests: {app.guests}</h2>
                                </div>
                                <p className="text-sm font-light h-15 overflow-x-hidden overflow-y-auto">Description:<br></br>{app.description}</p>
                            </div>
                            <button className="px-5 py-2 bg-blue-50 hover:bg-gray-300 text-black rounded-lg"
                             onClick={() => setRatePopup(true)}>Set Rating</button>
                            {ratingPopup &&
                                <Popup onClose={() => setRatePopup(false)}>
                                    <div className="text-black h-45">
                                        <h3 className='underline mb-2'>{app.eventName}</h3>
                                        <h4>How would you rate your experience with {hirer?.firstName}?</h4>
                                        <p className="mb-3"><i>0 = extremely unsatisfied, 3 = no opinion, 5 = extremely satisfied</i></p>
                                        <select className="block p-2 outline outline-black bg-neutral-50 rounded inline mr-3"
                                         required defaultValue={app.vendorRating} onChange={(e) => setRepRating(app.id, Number(e.target.value))}>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                        <p className="inline">stars</p>
                                    </div>
                                </Popup>
                            }
                        </Card>
                    </div>

                ) : (
                    // card to be displayed in the applications section

                    <div key={app.id}>
                        <Card heading={app.eventName} style="bg-sky-50">
                            <div className="grid grid-cols-[1.5fr_1.5fr_2fr_50px] gap-2 grid-rows-2 text-left">
                                <div>
                                    <h3 className="text-sm font-normal">Applicant: {hirer?.firstName}</h3>
                                    <h4 className="text-xs">Hiring Reputation: {hirer && getRepRating(hirer)} stars</h4>
                                    <h4 className="text-xs">Hiring Credibility: {getHirerCredibility()} stars</h4>
                                </div>
                                <div className="">
                                    <h2 className="text-sm font-normal">Timings: {app.startTime.slice(0, 5)} to {app.endTime.slice(0, 5)}</h2>
                                    <h2 className="text-sm font-normal">Duration: {utils.elapsedTime(app.startTime, app.endTime)} hours</h2>
                                    <h2 className="text-sm font-normal">Number of Guests: {app.guests}</h2>
                                </div>
                                <div className="overflow-x-hidden overflow-y-auto">
                                    <h2 className="text-sm font-normal">My Notes:<br />
                                    <i>{app.notes !== "" && app.notes !== null ? app.notes : "Nothing found"}</i></h2>
                                </div>
                                <div className="row-span-2">
                                    <button title="Shortlist Application" className="p-2 hover:bg-blue-100 hover:shadow-lg rounded-full" 
                                        onClick={() => (app.rank === -1 ? shortlist(app.id, 1) : shortlist(app.id, -1))}>
                                        {app.rank !== -1 ? (<img src="../shortlisted.png" />) : (<img src="../shortlist.png" />)}
                                    </button><br/>
                                    <button title="Reject Application"
                                     className={"p-2 hover:bg-red-100 hover:shadow-lg rounded-full " + (app.isAccepted === false ? "bg-red-200" : "")} 
                                        onClick={() => setBooking(app.id, false)}>
                                        <img src="../deleteBin.png" />
                                    </button><br/>
                                    <button title="Approve Application"
                                     className={"p-2 hover:bg-green-100 hover:shadow-lg rounded-full " + (app.isAccepted === true ? "bg-green-200" : "")} 
                                        onClick={() => setBooking(app.id, true)}>
                                        <img src="../tick.png" />
                                    </button>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-normal">Description:<br />{app.description}</p>
                                </div>
                                <div className="">
                                    <button className="px-5 py-2 mt-5 bg-gray-200 rounded-md font-medium"
                                     onClick={() => setPopupNotes(true)}><img src="../edit_square.png" className="inline mr-2" />
                                     Add Notes</button>
                                    {
                                        popupNotes &&
                                        <Popup onClose={() => setPopupNotes(false)}>
                                            <div className="h-100 w-19/20">
                                                <h3>Event Name: {app.eventName}</h3>
                                                <h3 className='font-normal'><i>Status: {getStatus()}</i></h3>
                                                <h4>Description:<br></br>{app.description}</h4>
                                                <Card heading={"" + hirer?.firstName} style="text-left">
                                                    <h4>Hiring Reputation: {hirer && getRepRating(hirer)} stars</h4>
                                                    <h4>Hiring Credibility: {hirer?.credibility} stars</h4>
                                                    {<ApplicationCarousel type='pastVenues' carouselItems= {
                                                        allApplications.filter((app:Application) => 
                                                            app.hirerID === hirer?.id && app.isAccepted === true && app.date < utils.getCurrDate() )
                                                    }/>}
                                                    <h4>Total Events: {hirer?.pastVenues?.length}</h4>
                                                    <h4>Number of Venues Hired: {new Set(hirer?.pastVenues).size}</h4>
                                                    <Button text="View Supporting Documents" onClick={() => setCredPopup(true)} />
                                                        {
                                                            credPopup &&
                                                            <Popup onClose={() => setCredPopup(false)}>
                                                                <div>
                                                                    {
                                                                        app.abn &&
                                                                        <h3>Company ABN: {app.abn}</h3>
                                                                    }
                                                                    {
                                                                        app.file &&
                                                                        <div>
                                                                            <h3>Business Name Registration Certficate:</h3>
                                                                            <embed src={app.file}/>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        hirer?.drivLic &&
                                                                        <div>
                                                                            <h3>Driver's License:</h3>
                                                                            <img src={hirer.drivLic}/>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        hirer?.insur &&
                                                                        <div>
                                                                            <h3>Public Liability Insurance Certificate:</h3>
                                                                            <embed src={hirer.insur}/>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        !app.abn && !app.file && !hirer?.drivLic && !hirer?.insur &&
                                                                        <h3><i>No supporting documents provided.</i></h3>
                                                                    }
                                                                </div>
                                                            </Popup>
                                                        }
                                                </Card>
                                                <h4>Number of Guests: {app.guests}</h4>
                                                <h4>Start Time: {app.startTime.slice(0, 5)}</h4>
                                                <h4>End Time: {app.endTime.slice(0, 5)}</h4>
                                                <h4>Duration: {utils.elapsedTime(app.startTime, app.endTime)} hours</h4>
                                                <label className="font-semibold">
                                                    My Notes
                                                    <input className="no-underline font-light outline outline-black bg-neutral-50 rounded w-10/10 h-30 overscroll-y-scroll"
                                                     type="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
                                                </label>
                                                <button type="submit" className="px-5 py-2 rounded my-2 bg-green-500 text-white"
                                                 onClick={() => handleAddNotes(app.id)}>Save</button>
                                            </div>
                                        </Popup>
                                    }

                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }
            
        </div>
    )
}

export default ApplicationsCard;