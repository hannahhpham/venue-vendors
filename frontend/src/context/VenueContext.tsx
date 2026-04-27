import React, { useState, useEffect, useContext, createContext } from 'react';
import { venues, Venue } from "../types/venues";
import {useNotif} from '../context/NotifContext';

// NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface VenueContextType {
    allVenues: Venue[],
    addVenue: (newVenue: Venue) => void,
    removeVenue: (id: number) => void,
    editVenue: (id : number, updatedVenue : Venue) => void,
}


// create the context to be used
const VenContext = createContext<VenueContextType | undefined>(undefined);


export function VenueProvider({ children }: { children: React.ReactNode }) {

    // var stores all the venues in localStorage (later)
    const [allVenues, setAllVenues] = useState<Venue[]>([]);
    const {showNotif} = useNotif();

    // stores all the most up to date list of venues (either in localStorage or the file)
    // NOTE: the following hook is adapted from Week 2 Example 6 (Lectures)
    useEffect(() => {

        // stores all the venues that are saved in localStorage
        const savedVenues = localStorage.getItem("venues");

        // if there is nothing saved in localStorage, save the "default values" (those stored in the file)
        if (!savedVenues || JSON.parse(savedVenues).length === 0) {
            setAllVenues(venues);
            localStorage.setItem("venues", JSON.stringify(venues));

        } else {
            // or else store what is in localStorage
            setAllVenues(JSON.parse((savedVenues)));
        }

    }
        , []);


    // update localStorage with the updated set of venues whenever a new one is added
    useEffect(() => {
        if (allVenues.length > 0) {
            localStorage.setItem("venues", JSON.stringify(allVenues));
        }
       
    }, [allVenues])


    // add a new venue TO LOCALSTORAGE ONLY
    const addVenue = (newVenue: Venue) => {
        if (newVenue !== null) {
            setAllVenues([...allVenues, newVenue]);
        }
        showNotif("New venue successfully added.", 'success');
    }

    // remove the venue of id
    const removeVenue = (id: number) => {
        setAllVenues(allVenues.filter((venue: Venue) => venue.id !== id));
        showNotif("Venue successfully deleted.", 'success');
    }

    // edit a venue
    const editVenue = (id : number, updatedVenue : Venue) => {
        setAllVenues(allVenues.map((venue : Venue) =>
                venue.id === id ? updatedVenue : venue
        ))
        showNotif('Venue successfully edited.', 'success');
    }


    //return provider
    return (
        <VenContext.Provider value={{ allVenues, addVenue, removeVenue, editVenue }}>
            {children}
        </VenContext.Provider>
    );

}


//consumer component (custom hook!)
export function useVenues() {
    //use the context made above
    const context = useContext(VenContext);

    //CHECK FOR IF ITS UNDEFINED
    if (context === undefined) {
        //replace this with notification component
        throw new Error("useVenues must be used within a VenueProvider");
    }

    return context;
}