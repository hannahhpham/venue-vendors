import React, { useState, useEffect, useContext, createContext } from 'react';
import { Venue } from "../types/venues";
import { useNotif } from '../context/NotifContext';
import { venueAPI } from "../services/api";

// NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface VenueContextType {
    allVenues: Venue[],
    addVenue: (newVenue: Partial<Venue>) => void,
    removeVenue: (id: number) => void,
    editVenue: (id: number, updatedVenue: Venue) => void,
}


// create the context to be used
const VenContext = createContext<VenueContextType | undefined>(undefined);


export function VenueProvider({ children }: { children: React.ReactNode }) {

    const [allVenues, setAllVenues] = useState<Venue[]>([]);
    const { showNotif } = useNotif();

    // stores all the venues in the database
    // this useEffect and the fetchvenues functions are based on
    // Lecture 9 Example 1 - frontend (index.tsx under pets)
    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const data = await venueAPI.getAllVenues();
            setAllVenues(data);
        } catch (error) {
            console.error("Error fetching all venues (Context File): ", error);
        }
    };


    // update localStorage with the updated set of venues whenever a new one is added
    // useEffect(() => {
    //     if (allVenues.length > 0) {
    //         localStorage.setItem("venues", JSON.stringify(allVenues));
    //     }

    // }, [allVenues])


    // add a new venue TO LOCALSTORAGE ONLY
    const addVenue = async (newVenue: Partial<Venue>) => {
        if (newVenue !== null) {
            // setAllVenues([...allVenues, newVenue]);
            try {
                const result = await venueAPI.createVenue(newVenue);
                // make sure that the venues array is updated
                fetchVenues();
                showNotif("New venue successfully added.", 'success');
            } catch (error) {
                console.error("Error adding new venue (Context): ", error);
            }
        }
    }

    // remove the venue of id
    const removeVenue = async (id: number) => {
        try {
            const result = await venueAPI.deleteVenue(id);
            // make sure that the venues array is updated
            fetchVenues();
            showNotif("Venue successfully deleted.", 'success');
        } catch (error) {
            console.error("Error removing venue (Context): ", error);
        }
        //setAllVenues(allVenues.filter((venue: Venue) => venue.id !== id));
    }

    // edit a venue
    const editVenue = (id: number, updatedVenue: Venue) => {
        setAllVenues(allVenues.map((venue: Venue) =>
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