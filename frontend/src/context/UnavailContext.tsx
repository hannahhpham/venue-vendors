import React, { useState, useEffect, useContext, createContext } from 'react';
import { Unavailable, blocked } from "../types/unavail";
import { useNotif } from '../context/NotifContext';
import { blockedAPI } from '../services/api';
import Popup from '../components/Popup';
import Button from '../components/Button';


// A1 NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface UnavailContextType {
    allBlocked: Unavailable[],
    getBlockedVenue: (venueID: number) => void,
    blockVenue: (venueID: number, date: string, start: string, end: string) => void,
    unblockVenue: (venueID: number) => void,
    editBlockDisplay: (blocked: Unavailable) => void
}


// create the context to be used
const UnavailContext = createContext<UnavailContextType | undefined>(undefined);


export function UnavailProvider({ children }: { children: React.ReactNode }) {

    // var stores all the blocked periods in localStorage (later)
    const [allBlocked, setAllBlocked] = useState<Unavailable[]>([]);

    const { showNotif } = useNotif();

    // A1 NOTE: the following hook is adapted from Week 2 Example 6 (Lectures)
    useEffect(() => {

        fetchAllBlocked();

        // stores all the venues that are saved in localStorage
        // const savedBlocked = localStorage.getItem("unavailable");

        // // if there is nothing saved in localStorage, save the "default values" (those stored in the file)
        // if (!savedBlocked || JSON.parse(savedBlocked).length === 0) {
        //     setAllBlocked(blocked);
        //     localStorage.setItem("unavailable", JSON.stringify(blocked));
        // } else {
        //     // or else store what is in localStorage
        //     setAllBlocked(JSON.parse((savedBlocked)));
        // }

    }
        , []);


    const fetchAllBlocked = async () => {
        try {
            const data = await blockedAPI.getAll();
            setAllBlocked(data);
        } catch (error) {
            console.error("Error fetching all blocked periods (Context): ", error);
        }
    }


    // update localStorage with the updated set of venues whenever a new one is added
    // useEffect(() => {
    //     if (allBlocked.length > 0) {
    //         localStorage.setItem("unavailable", JSON.stringify(allBlocked));
    //     }

    // }, [allBlocked])


    // block a venue on a particular date, between given times
    const blockVenue = async (venueID: number, date: string, start: string, end: string) => {
        try {
            const newBlock: Partial<Unavailable> = {
                venueID: venueID,
                date: date,
                startTime: start,
                endTime: end
            }
            const result = await blockedAPI.block(newBlock);
            showNotif(`Venue availability successfully blocked on ${new Date(date).toDateString()}.`, 'success');
            fetchAllBlocked();
        } catch (error) {
            console.error("Error creating new blocked period (Context): ", error);
        }
        //setAllBlocked([...allBlocked, {id : Date.now(), startTime: start, endTime : end, date : date, venueID : venueID }]);
    }

    // unblock the venue by deleting the blocked period
    const unblockVenue = async (venueID: number) => {
        try {
            const result = await blockedAPI.unblock(venueID);
            fetchAllBlocked();
            showNotif("Venue availability successfully unblocked.", 'success');
        } catch (error) {
            console.error("Error deleting blocked period (Context): ", error);
        }
        //setAllBlocked(allBlocked.filter((block : Unavailable) => block.id !== id));
    }


    // get the unavailable array for the venue at hand
    // only returns future blocked periods
    const getBlockedVenue = async (venueID: number) => {//: Unavailable[] => {
        try {
            const result = await blockedAPI.getVenueBlocked(venueID);
            //return result;
        } catch (error) {
            console.error("Error fetching blocked times for the venue (Context): ", error);
        }
    }


    const editBlockDisplay = (block : Unavailable) => {
        const [show, setShow] = useState<boolean>(true);

        const [blockDate, setBlockDate] = useState<string>(block.date);
        const [blockStart, setBlockStart] = useState<string>(block.startTime);
        const [blockEnd, setBlockEnd] = useState<string>(block.endTime);

        const submit = () => {
            block.date = blockDate;
            block.startTime = blockStart;
            block.endTime = blockEnd;

            editBlock(block);
        }

        return (
            <Popup onClose={() => setShow(!show)}>
                <label>Date
                    <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
                </label>
                <label>Start
                    <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
                </label>
                <label>End
                    <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
                </label>
                <Button className="px-5 py-2 my-2 rounded-xl" onClick={submit}
                    text="Update Block" />
            </Popup>
        )
    }


    const editBlock = async (updateBlock : Unavailable) => {
        try {
            const result = await blockedAPI.updateBlock(updateBlock.id, updateBlock);
            fetchAllBlocked();
            showNotif("Blocked period successfully updated.", 'success');
        } catch (error) {
            console.error("Error fetching blocked times for the venue (Context): ", error);
        }
    }


    //return provider
    return (
        <UnavailContext.Provider value={{ allBlocked, blockVenue, unblockVenue, getBlockedVenue, editBlockDisplay }}>
            {children}
        </UnavailContext.Provider>
    );

}


//consumer component (custom hook!)
export function useUnavail() {
    //use the context made above
    const context = useContext(UnavailContext);

    //CHECK FOR IF ITS UNDEFINED
    if (context === undefined) {
        //replace this with notification component
        throw new Error("useUnavail must be used within a UnavailProvider");
    }

    return context;
}