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
    updateVenueOwner: (id: number, ownerID: number) => Promise<void>,
    fetchVenues: () => Promise<void>,
    featureVenue: (id: number, isFeatured: boolean) => Promise<void>,
}

// create the context to be used
const VenContext = createContext<VenueContextType | undefined>(undefined);

export function VenueProvider({ children }: { children: React.ReactNode }) {
    const [allVenues, setAllVenues] = useState<Venue[]>([]);
    const { showNotif } = useNotif();

    const router = useRouter();

    // fetches all venues on load
    
    useEffect(() => {
        const wrapper = async () => {
            await fetchVenues();
        }
        wrapper();
        
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
        
            //returns undefined....thats not right
            //console.log("new venue is", result);

        fetchVenues();
    }

    // remove the venue of id
    const removeVenue = async (id: number) => {
        try {
            const result = await VenueService.deleteVenue(id);
            // make sure that the venues array is updated
            //await fetchVenues();

            const newVenues = allVenues.filter(venue => venue.id !== id);
            setAllVenues(newVenues);
            showNotif("Venue successfully deleted.", 'success');
        } catch (error) {
            console.error("Error removing venue (Context): ", error);
        }
        //setAllVenues(allVenues.filter((venue: Venue) => venue.id !== id));
    }

    // edit a venue's details - used in VenueDetails component
    const editVenue = async (id: number, name: string, phone: string, email: string, address: string, suburb: string, state: string, 
        postcode: number, capacity: number, rate: number, description: string, suitability: string) =>  {
        try {
            const result = await VenueService.updateVenue(id, name, phone, email, address, suburb, state, postcode, 
                capacity, rate, description, suitability);
            
            // make sure that the venues array is updated
            await fetchVenues();
            showNotif('Venue details edited successfully.', 'success');
        } catch (error) {
            console.error("Error updating venue (Context): ", error);
            throw error;
        }
    }

    const featureVenue = async (id: number, isFeatured: boolean) => {
        try {
            const result = await VenueService.featureVenue(id, isFeatured);
            await fetchVenues();

            if (isFeatured) {
                showNotif('Venue featured successfully.', 'success');
            }
            else {
                showNotif('Venue unfeatured successfully.', 'success');
            }
            
        } catch {
            if (isFeatured) {
                showNotif('Venue was not able to be featured.', 'fail');
            }
            else {
                 showNotif('Venue was not able to be unfeatured.', 'fail');
            }
            
        }
    }

    //change venue owner
    const updateVenueOwner = async(id: number, ownerID: number) => {
        try {
            const result = await VenueService.updateVenueOwner(id, ownerID);
            fetchVenues();
            showNotif("Venue owner successfully updated.", "success");
        } catch {
            showNotif("Failed to update the owner of this venue.", "fail");
        }
        
    }

    //return provider
    return (
        <VenContext.Provider value={{ allVenues, addVenue, removeVenue, editVenue, updateVenueOwner, fetchVenues, featureVenue }}>
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