import React, { useState, useEffect, useContext, createContext } from 'react';
import { Application } from "../types/apply";
import { applicationAPI, userAPI } from '../services/api';


// NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface ApplyContextType {
    allApplications: Application[],
    addApp: (newApp: Partial<Application>) => void,
    removeApp: (id: number) => void,
    addNotes: (id: number, newNotes: string) => void,
    setBooking: (id: number, set: boolean | undefined) => void,
    setRepRating: (id: number, rate: number) => void,
    shortlist: (id: number, rank: number) => void,
}


// create the context to be used
const ApplyContext = createContext<ApplyContextType | undefined>(undefined);


export function ApplyProvider({ children }: { children: React.ReactNode }) {

    // var stores all the applications
    const [allApplications, setAllApps] = useState<Application[]>([]);

    // A1 NOTE: the following hook is adapted from Week 2 Example 6 (Lectures)
    useEffect(() => {
        fetchAllApps();
    }, []);


    // API call to get all the applications in the database
    const fetchAllApps = async () => {
        try {
            const data = await applicationAPI.getAllApps();
            setAllApps(data);
        } catch (error) {
            console.error("Error fetching all applications (Context File): ", error);
        }
    };


    // add a new application the database
    // used by hirers to lodge an application for a venue, on a perticular date
    // note: hirer's applications will be updated on submitApplication.tsx page itself
        // because useAuth must be used in an AuthProvider
    const addApp = async (newApp: Partial<Application>) => {
        try {
            const result = await applicationAPI.createApp(newApp);
            // make sure that the applications array is updated
            fetchAllApps();
        } catch (error) {
            console.error("Error adding new application (Context): ", error);
        }
    }

    // remove the application of id
    // would be used by hirers to rescind an application
    const removeApp = async (id: number) => {
        try {
            const result = await applicationAPI.deleteApp(id);
            // update the applications array
            fetchAllApps();
        } catch (error) {
            console.error("Error removing application (Context): ", error);
        }
    };


    // let the vendor add notes to the application - THIS SHOULD NOT BE ACCESSED BY THE HIRER
    const addNotes = async (id: number, newNotes: string) => {
        const updatedObj : Partial<Application> = { notes: newNotes };
        try {
            const result = await applicationAPI.updateApp(id, updatedObj);
            // update the applications array
            fetchAllApps();
        } catch (error) {
            console.error("Error adding notes to application (Context): ", error);
        }
    }


    // used by vendors to confirm/reject bookings
    const setBooking = async (id: number, set: boolean | undefined) => {
        const updatedObj : Partial<Application> = { isAccepted: set };
        try {
            const result = await applicationAPI.updateApp(id, updatedObj);
            // update the applications array
            fetchAllApps();
        } catch (error) {
            console.error("Error altering booking status on application (Context): ", error);
        }
    }


    // for vendors to give the rating that affects a hirer's reputation
    const setRepRating = async (id: number, rate: number) => {
        const updatedObj : Partial<Application> = { vendorRating: rate };
        try {
            const result = await applicationAPI.updateApp(id, updatedObj);
            // update the applications array
            fetchAllApps();
        } catch (error) {
            console.error("Error setting vendor rating on application (Context): ", error);
        }
    }

    // shortlist a venue - MUST have a rank
    // to delist, the rank will be set to 0
    const shortlist = async (id: number, rank: number) => {
        const updatedObj : Partial<Application> = { rank: rank };
        try {
            const result = await applicationAPI.updateApp(id, updatedObj);
            // update the applications array
            fetchAllApps();
        } catch (error) {
            console.error("Error shortlisting application (Context): ", error);
        }
    }


    //return provider
    return (
        <ApplyContext.Provider value={{ allApplications, addApp, removeApp, addNotes, setBooking, setRepRating, shortlist }}>
            {children}
        </ApplyContext.Provider>
    );

}


//consumer component (custom hook!)
export function useApplications() {
    //use the context made above
    const context = useContext(ApplyContext);

    //CHECK FOR IF ITS UNDEFINED
    if (context === undefined) {
        //replace this with notification component
        throw new Error("useApplications must be used within a ApplyProvider");
    }

    return context;
}