import React, {useState, useEffect, useContext, createContext } from 'react';
import { Unavailable, blocked } from "../types/unavail";
import {useNotif} from '../context/NotifContext'


// NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface UnavailContextType {
    allBlocked : Unavailable[],
    blockVenue : (venueID : number, date : string, start : string, end : string) => void,
    unblockVenue : (id : number) => void
}


// create the context to be used
const UnavailContext = createContext<UnavailContextType | undefined>(undefined);


export function UnavailProvider({children} : {children : React.ReactNode}) {

    // var stores all the venues in localStorage (later)
    const [allBlocked, setAllBlocked] = useState<Unavailable[]>([]);

    const {showNotif} = useNotif();

    // stores all the most up to date list of venues (either in localStorage or the file)
    // NOTE: the following hook is adapted from Week 2 Example 6 (Lectures)
    useEffect(() => {

        // stores all the venues that are saved in localStorage
        const savedBlocked = localStorage.getItem("unavailable");
        
        // if there is nothing saved in localStorage, save the "default values" (those stored in the file)
        if (!savedBlocked || JSON.parse(savedBlocked).length === 0) {
            setAllBlocked(blocked);
            localStorage.setItem("unavailable", JSON.stringify(blocked));
        } else {
            // or else store what is in localStorage
            setAllBlocked(JSON.parse((savedBlocked)));
        }

    }
    , []);


    // update localStorage with the updated set of venues whenever a new one is added
    useEffect(() => {
        if (allBlocked.length > 0) {
            localStorage.setItem("unavailable", JSON.stringify(allBlocked));
        }
        
    }, [allBlocked])


    // add a new application TO LOCALSTORAGE ONLY
        // used by hirers to lodge an application for a venue, on a perticular date
    const blockVenue = (venueID : number, date : string, start : string, end : string) => {
        setAllBlocked([...allBlocked, {id : Date.now(), startTime: start, endTime : end, date : date, venueID : venueID }]);
        showNotif(`Venue availability successfully blocked on ${new Date(date).toDateString}.`, 'success');
    }

    // remove the venue of id
        // would be used by hirers to rescind an application
    const unblockVenue = (id : number) => {
        setAllBlocked(allBlocked.filter((block : Unavailable) => block.id !== id));
        showNotif("Venue availability successfully unblocked.", 'success');
    }
    

    //return provider
    return (
        <UnavailContext.Provider value={{ allBlocked, blockVenue, unblockVenue }}>
            {children}
        </UnavailContext.Provider>
    );
  
}


//consumer component (custom hook!)
export function useUnavail() {
    //use the context made above
    const context = useContext(UnavailContext);

    //CHECK FOR IF ITS UNDEFINED
    if (context===undefined) {
        //replace this with notification component
        throw new Error("useUnavail must be used within a UnavailProvider");
    }

    return context;
}