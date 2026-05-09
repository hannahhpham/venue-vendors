import React, { useState, useEffect, useContext, createContext } from 'react';
import { Application } from "../types/apply";
import { applicationAPI } from '@/services/api';


// NOTE: Most of this is based off Week 4 Example 3 (Lectures)


interface ApplyContextType {
    allApplications: Application[],
    addApp: (newApp: Application) => void,
    removeApp: (id: number) => void,
    addNotes: (id: number, newNotes: string) => void,
    setBooking: (id: number, set: boolean | undefined) => void,
    setRepRating: (id: number, rate: number) => void,
    shortlist: (id: number, rank: number) => void,
    delist: (id: number) => void,
}


// create the context to be used
const ApplyContext = createContext<ApplyContextType | undefined>(undefined);


export function ApplyProvider({ children }: { children: React.ReactNode }) {

    // var stores all the venues in localStorage (later)
    const [allApplications, setAllApps] = useState<Application[]>([]);

    // stores all the most up to date list of venues (either in localStorage or the file)
    // NOTE: the following hook is adapted from Week 2 Example 6 (Lectures)
    useEffect(() => {
        fetchAllApps();
    }, []);


    // update localStorage with the updated set of venues whenever a new one is added
    useEffect(() => {
        if (allApplications.length > 0) {
            localStorage.setItem("applications", JSON.stringify(allApplications));
        }

    }, [allApplications])


    const fetchAllApps = async () => {
        try {
            const data = await applicationAPI.getAllApps();
            setAllApps(data);
        } catch (error) {
            console.error("Error fetching all applications (Context File): ", error);
        }
    };


    // add a new application TO LOCALSTORAGE ONLY
    // used by hirers to lodge an application for a venue, on a perticular date
    const addApp = (newApp: Application) => {
        if (newApp !== null) {
            setAllApps([...allApplications, newApp]);
        }
    }

    // remove the application of id
    // would be used by hirers to rescind an application
    const removeApp = async (id: number) => {
        try {
            const result = await applicationAPI.deleteApp(id);
            fetchAllApps();
        } catch (error) {
            console.error("Error removing application (Context): ", error);
        }
    };


    // let the vendor add notes to the application - THIS SHOULD NOT BE ACCESSED BY THE HIRER
    const addNotes = (id: number, newNotes: string) => {
        allApplications.map((app: Application) => (
            // changes the array
            app.id === id ? (app.notes = newNotes) : app.notes
        ))
        // update in local storage
        localStorage.setItem("applications", JSON.stringify(allApplications));
    }


    // used by hirers to confirm bookings
    // check this: during confirmation, hirers should be able to confirm they'll be there
    const setBooking = (id: number, set: boolean | undefined) => {
        allApplications.map((app: Application) => (
            app.id === id ? (app.accepted = set) : app.accepted
        ))
        localStorage.setItem("applications", JSON.stringify(allApplications));
    }


    // for vendors to give the rating that affects a hirer's reputation
    const setRepRating = (id: number, rate: number) => {
        allApplications.map((app: Application) => (
            app.id === id ? (app.vendorRating = rate) : app.vendorRating
        ))
        localStorage.setItem("applications", JSON.stringify(allApplications));
    }

    // shortlist a venue - MUST have a rank
    const shortlist = (id: number, rank: number) => {
        allApplications.map((app: Application) => (
            // changes the array
            app.id === id ? (app.rank = rank) : app.rank
        ))
        // update in local storage
        localStorage.setItem("applications", JSON.stringify(allApplications));
    }

    // remove an application from the shortlsit
    const delist = (id: number) => {
        allApplications.map((app: Application) => (
            // changes the array
            app.id === id ? (app.rank = undefined) : app.rank
        ))
        // update in local storage
        localStorage.setItem("applications", JSON.stringify(allApplications));
    }


    //return provider
    return (
        <ApplyContext.Provider value={{ allApplications, addApp, removeApp, addNotes, setBooking, setRepRating, shortlist, delist }}>
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