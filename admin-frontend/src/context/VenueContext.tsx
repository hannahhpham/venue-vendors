import React, { useState, useEffect, useContext, createContext } from 'react';
import { Venue } from "../types/types";
import { useNotif } from '../context/NotifContext';
import { VenueService } from "../services/api";
import { useRouter } from 'next/router';

// NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface VenueContextType {
    allVenues: Venue[],
    addVenue: (name: string, phone: string, email: string, address: string, state: string, suburb: string, postcode: number,
        capacity: number, rate: number, description: string, ownerID: number, suitability: string) => Promise<void>,
    removeVenue: (id: number) => Promise<void>,
    editVenue: (id: number, name: string, phone: string, email: string, address: string, suburb: string, state: string, 
        postcode: number, capacity: number, rate: number, description: string, suitability: string) => Promise<void>,
    fetchVenues: () => void,
}

// create the context to be used
const VenContext = createContext<VenueContextType | undefined>(undefined);

export function VenueProvider({ children }: { children: React.ReactNode }) {
    const [allVenues, setAllVenues] = useState<Venue[]>([]);
    const { showNotif } = useNotif();

    const router = useRouter();

    // fetches all venues on load
    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const data = await VenueService.getAllVenues();
            setAllVenues(data);
        } catch (error) {
            console.error("Error fetching all venues (Context File): ", error);
        }
    };

    // add a new venue
    const addVenue = async (name: string, phone: string, email: string, address: string, suburb: string, 
        state: string, postcode: number, capacity: number, rate: number, description: string, ownerID: number, suitability: string) => {
            
        const result = await VenueService.createVenue(name, phone, email, address, suburb, state, 
            postcode, capacity, rate, description, ownerID, suitability);
        console.log("new venue is", result);
        fetchVenues();
    }

    // remove the venue of id
    const removeVenue = async (id: number) => {
        try {
            const result = await VenueService.deleteVenue(id);
            // make sure that the venues array is updated
            fetchVenues();
            showNotif("Venue successfully deleted.", 'success');
            router.push('/dashboard');
        } catch (error) {
            console.error("Error removing venue (Context): ", error);
        }
        setAllVenues(allVenues.filter((venue: Venue) => venue.id !== id));
    }

    // edit a venue's details - used in VenueDetails component
    const editVenue = async (id: number, name: string, phone: string, email: string, address: string, suburb: string, state: string, 
        postcode: number, capacity: number, rate: number, description: string, suitability: string) =>  {
        try {
            const result = await VenueService.updateVenue(id, name, phone, email, address, suburb, state, postcode, 
                capacity, rate, description, suitability);
            
            // make sure that the venues array is updated
            fetchVenues();
            showNotif('Venue details edited successfully.', 'success');
        } catch (error) {
            console.error("Error updating venue (Context): ", error);
            throw error;
        }
    }

    //return provider
    return (
        <VenContext.Provider value={{ allVenues, addVenue, removeVenue, editVenue, fetchVenues }}>
            {/* addVenue, removeVenue, editVenue, */}
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