import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Popup from "../../../components/Popup";
import Main from '../../../components/Main';
import { useRouter } from 'next/router';
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { Application } from "../../../types/apply";
import { useApplications } from "../../../context/ApplyContext";
import { Unavailable } from "../../../types/unavail";
import { useUnavail } from "../../../context/UnavailContext";
import { Venue } from '../../../types/venues';
import * as utils from '../../../utils/utils';

export default function SubmitApplication() {
    const router = useRouter();
    const { currUser, shortlistedVenues } = useAuth();
    const { addApp } = useApplications();
    const { allBlocked } = useUnavail();
    const { id } = router.query;

    // NOTE: THERE IS AN ERROR SOMEWHERE IN THIS FILE (react change of hooks - appears in console when application is submitted)


    if (currUser && currUser.type === "hirer") {
        // for the form
        const [eventName, setEventName] = useState<string>("");
        const [startTime, setStartTime] = useState<string>("");
        const [endTime, setEndTime] = useState<string>("");
        const [date, setDate] = useState<string>("");
        const [guests, setGuests] = useState<number>(0);
        const [desc, setDesc] = useState<string>("");
        const [hirerType, setHirerType] = useState<string>("individual");
        const [abn, setABN] = useState<string>("");
        const [file, setFile] = useState<File>();
        const [fileStr, setFileStr] = useState<string>("");
        const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
        const [unavailPopup, setUnavailPopup] = useState<boolean>(false);
        const [notShortlistedPopup, setNotShortlistedPopup] = useState<boolean>(false);


        const handleSubmitApp = (e: React.FormEvent) => {

            e.preventDefault();

            // to test whether the date/time the hirer is booking for is listed as unavailable
            const todayUnavail: Unavailable[] = allBlocked.filter((b: Unavailable) => 
                (b.venueID === Number(id) && b.date === date));

            if (todayUnavail.length > 0) {
                todayUnavail.forEach(block => {
                    const blockSTime = new Date().setHours(Number(block.startTime.substring(0, 2)),
                     Number(block.startTime.substring(3, 5)));
                    const blockETime = new Date().setHours(Number(block.endTime.substring(0, 2)),
                     Number(block.endTime.substring(3, 5)));

                    const mySTime = new Date().setHours(Number(startTime.substring(0, 2)),
                     Number(startTime.substring(3, 5)));
                    const myETime = new Date().setHours(Number(endTime.substring(0, 2)),
                     Number(endTime.substring(3, 5)));

                    if (mySTime >= blockSTime || myETime <= blockETime) {
                        setUnavailPopup(true);
                    }
                });

            }

            else {

                // check the this venueID is not present in the user's shortlisted venues
                if (shortlistedVenues.filter((venue: Venue) => 
                    venue.id === Number(id)).map((venue: Venue) => venue.id)[0] != Number(id)) {
                    setNotShortlistedPopup(true);
                }
                else { //application sucessful

                    const newApp: Application = {
                        id: Date.now(),
                        eventName: eventName,
                        startTime: startTime,
                        endTime: endTime,
                        date: date,
                        guests: Number(guests),
                        description: desc,
                        notes: "",
                        hirerID: currUser.id,
                        venueID: Number(id)
                    }

                    if (hirerType === "company") {
                        newApp.abn = abn;
                        newApp.file = fileStr;
                    }

                    console.log("filestr:\n" + fileStr);

                    // add the application to localStorage
                    addApp(newApp);

                    // reset all states to defaults
                    setEventName("");
                    setStartTime("");
                    setEndTime("");
                    setDate("");
                    setGuests(0);
                    setDesc("");
                    setFileStr("");
                    setABN("");

                    // style this nicely
                    setConfirmPopup(true);
                }
            }
        }

        return (
            <Main type='wholePage'>

                {confirmPopup &&
                    <Popup onClose={() => {
                        router.push(`/venues/${id}`);
                        setConfirmPopup(false);
                    }}>
                        <div className="h-40">
                            <h1 className="text-2xl font-medium">You have submitted your application!</h1>
                            <h2>We will be in touch!</h2>
                        </div>
                    </Popup>
                }

                {unavailPopup &&
                    <Popup onClose={() => {
                        setUnavailPopup(false);
                        router.push(`/venues/${id}`);
                    }}>
                        <div className="h-40">
                            <h3>This venue is unavailable for hire during this time.</h3>
                            <p>Please check the unavailability periods and book for a different time.</p>
                            <p><i>We apologise for any inconvenience caused.</i></p>
                        </div>

                    </Popup>
                }

                {notShortlistedPopup &&
                    <Popup onClose={() => {
                        setNotShortlistedPopup(false);
                        router.push(`/venues/${id}`);
                    }}>
                        <div className="h-40">
                            <h3>You have not yet shortlisted this venue.</h3>
                            <p>Please shortlist this venue before applying to hire.</p>
                        </div>

                    </Popup>
                }



                <title>Application</title>

                <Header active={"search"} />


                <div className="">

                    <div className="pl-5 pt-5">
                        <main className="m-3">
                            <h2 className="text-2xl font-bold">Event Hosting Application</h2>

                            <form className="p-2" onSubmit={handleSubmitApp}>
                                <label className="mb-2">
                                    Event Name
                                    <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                     type="string" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Date
                                    <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                     type="date" min={utils.getCurrDate()} value={date} onChange={(e) => setDate(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Start Time
                                    <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                     type="time" step="1" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    End Time
                                    <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                     type="time" min={startTime} value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Number of Guests
                                    <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                     type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} required></input>
                                </label>
                                <label className="my-2">
                                    Event Description
                                    <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                     type="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} required />
                                </label>

                                {/* for file inputs (if necessary) */}
                                <label className="my-5">
                                    I am applying for ...
                                    <select className="inline p-2 outline-black bg-neutral-50 rounded w-100"
                                     required value={hirerType} onChange={(e) => setHirerType(e.target.value)}>
                                        <option value="individual">Myself</option>
                                        <option value="company">On behalf of a company</option>
                                    </select>
                                </label>

                                <div className={hirerType === "individual" ? "hidden" : "visible"}>
                                    {/* is an 11 digit number */}
                                    <label className="mb-2">
                                        ABN
                                        <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                         type="string" value={abn} onChange={(e) => setABN(e.target.value)}
                                          required={hirerType === "company" ? true : false} />
                                    </label>
                                    <label className="mb-2">
                                        Company Registration Certificate
                                        <input className="block p-2 outline-black bg-neutral-50 rounded w-10/10"
                                         type="file" accept="application/pdf" onChange={(e) => utils.uploadFile(e, file, setFile, fileStr, setFileStr)} />
                                    </label>
                                    {
                                        fileStr &&
                                        <div className="grid grid-cols-2">
                                            <embed src={fileStr} />
                                        </div>
                                    }
                                </div>

                                <Button className="px-10 p-3 mt-5 font-medium" type="submit" text="Submit" />
                            </form>

                        </main>
                    </div>

                </div>


            </Main>

        );

    } else {
        <Popup onClose={() => router.push("/")}>
            <h1 className="text-2xl font-medium">Access Denied</h1>
            <h2>You are not authorised to access this page</h2>
        </Popup>
    }

}
