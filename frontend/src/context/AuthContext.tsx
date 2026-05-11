import React, { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router';
import { users, User } from "../types/users";
import { Application } from "../types/apply";
import { useApplications } from './ApplyContext';
import { venues, Venue } from '../types/venues'
import { useVenues } from './VenueContext'
import { useNotif } from './NotifContext'
import { userAPI, shortlistedVenueAPI, venueAPI, applicationAPI } from '../services/api'

//lectorial 2 example 6 was referenced when creating this AuthContext 

interface AuthContextType {
    currUser: User | null,
    allUsers: User[],
    login: (email: string, password: string) => void;
    logout: () => void,
    updateUser: (updatedUser: User) => void, //update user information, including their shortlisted venues
    getRepRating: (user: User) => number,
    fetchHirerApplications: () => void,
    fetchVendorVenues: () => void,
    getShortlistedVenues: () => void, 
    shortlistedVenues: number [],
    //pastVenues: Venue[],
    venueApplications: Application[], //stores the application id

    // specifically for the vendors - stores the Vendor's venues
    vendorVenues: Venue[],

}

//create context!!! to be used in consumer
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//custom provider component for consumers
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { allApplications } = useApplications();
    const { allVenues } = useVenues();
    const { showNotif } = useNotif();

    // REMOVE THESE FROM LOCAL STORAGE WHEN RECFACTORING DONE
    const [currUser, setCurrUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    // the following code is based on [id].tsx, profile, frontend, Lecture 9 Example 1
    const [vendorVenues, setVendorVenues] = useState<Venue[]>([]);

    //add the shortlisted venue usestate here since its linked to the user. use this to 
    //update components that render the hshortlisted venues
    const [shortlistedVenues, setShortlistedVenues] = useState<number[]>([]);

    // these are specific to the hirer
    const [venueApplications, setVenueApplications] = useState<Application[]>([]);

    // api calls here
    const getAllUsers = async () => {
        try {
            const data = await userAPI.getAllUsers();

            setAllUsers(data); //need to remove this after refactoring
            return data;
        } catch (error) {
            console.log("Error getting all users: ", error);
        }
    };

    const getShortlistedVenues = async () => {
        //console.log("currUser in shortlistedVenues is " + currUser);

        type shortlistedVenueType = { hirerID: number, venueID: number, rank: number };

        if (currUser) {
            let shortlistedVenues = await shortlistedVenueAPI.getShortlistedVenues(currUser.id);

            //create number id array that is sorted according to the ranks
            shortlistedVenues.sort((a: shortlistedVenueType, b: shortlistedVenueType) => a.rank - b.rank);

            //get the number ids and store it
            shortlistedVenues = shortlistedVenues.map((data: shortlistedVenueType) => data.venueID);
            
            setShortlistedVenues(shortlistedVenues);
            // console.log("shortlistedVenues:", shortlistedVenues);
            return shortlistedVenues;
        }
    }

    const fetchHirerApplications = async () => {
        if (currUser && currUser.type === "hirer") {
            try {
                const data = await applicationAPI.getHirerApps(currUser.id);
                setVenueApplications(data);
            } catch (error) {
                console.error("Error fetching vendor's venues (Venue Context): ", error);
            }
        }
    };

    const fetchVendorVenues = async () => {
        if (currUser && currUser.type === "vendor") {
            try {
                const data = await venueAPI.getByVendor(currUser.id);
                setVendorVenues(data);
            } catch (error) {
                console.error("Error fetching vendor's venues (Venue Context): ", error);
            }
        }
    };

    // useEffects

    //check if theres user in the database. check if theres shortlisted venues and applications
    //NOTE: lec2example6 takes user information from LS and stores in useState above.
    //      if theres nothing in LS then it takes default user array from file.
    useEffect(() => {
        getAllUsers();

        //check if user stored
        const storedUser = localStorage.getItem("currUser");

        if (storedUser) {
            setCurrUser(JSON.parse(storedUser)); 
            fetchHirerApplications();
            getShortlistedVenues();
            setVenueApplications(venueApplications.filter((app: Application) => (currUser?.applications?.includes(app.id))));
        }

    }, []);

    //get user related data everytime the user OR user-related things change
    useEffect(() => {

        // check that user application matches the
        let applicationsArray: Application[] = [];


        //check if the new application added affects this user. 
        if (currUser && currUser.applications) {
            applicationsArray = allApplications.filter(apps => apps.hirerID === currUser.id);

            setVenueApplications(applicationsArray);
        }
    }, [allApplications, currUser]);

    // 
    useEffect(() => {
        fetchVendorVenues();
        // probably don't need this one anymore
        // HANNAH: do u mean we should remove this useEffect?
        fetchHirerApplications();
        getShortlistedVenues();
    }, [currUser]);

    // login functionality.
    const login = async (email: string, password: string) => {

        try {
            const data = await userAPI.getUserByEmail(email);

            if (data) {
                //store current to local storage. use this for other pages
                localStorage.setItem("currUser", JSON.stringify(data));

                //set the use state
                const user: User = data;
                setCurrUser(user);

                //use this over link cuz this is properly pushing the user instead of loading smth new
                router.push('/');
                showNotif("You have successfully signed in.", 'success');
            }
        } catch (error) {
            console.log("Error getting all users: ", error);
            showNotif("Incorrect email/password combination entered. Please try again.", 'fail');
        }

    }

    //logout functionality - remove user from LS, push to homepage
    const logout = () => {
        //remove user from local storage
        localStorage.removeItem("currUser");
        setCurrUser(null);
        showNotif("You have successfully logged out.", 'success');
        router.push('/');
    }

    //for updating user details (name, phone). also for updating the user's shortlisted venues
    // and uploading / updating the user's driver's license and public liability insurance cert
    const updateUser = async (updatedUser: User) => {

        //update this user in the database
        await userAPI.updateUser(updatedUser.id, updatedUser);

        //update all the users in use state
        // await getAllUsers();

        //update the currUser in use state
        const user = await userAPI.getUserById(updatedUser.id);
        //console.log("user phone:" + user?.phone);
        setCurrUser(user);

    }

    // calculate the reputation rating of a hirer
    // source: https://www.geeksforgeeks.org/typescript/typescript-array-reduce-method/
    const getRepRating = (user: User): number => {
        const myApps = allApplications.filter((app: Application) => (app.hirerID === user.id && app.isAccepted === true && app.vendorRating !== undefined));
        let rating: number = myApps.reduce((total, currVal) => {
            if (currVal.vendorRating !== undefined) {
                return total + currVal.vendorRating
            } else {
                return total
            }
        }, 0) / (myApps.length);

        rating = Number.isNaN(rating) ? 0 : rating;

        // update the user's information as well
        

        return rating;
    }

    //return provider
    return (
        // NOTE; lec2example6 also returns all users array + login function
        //this authContext provides context to all its kids (aka everything)
        <AuthContext.Provider value={{
            currUser, allUsers, login, logout, updateUser, getRepRating, fetchHirerApplications,
            fetchVendorVenues, getShortlistedVenues, shortlistedVenues, venueApplications, vendorVenues
        }}>
            {children}
        </AuthContext.Provider>
    );

}

//consumer component (custom hook!)
export function useAuth() {
    //use the context made above
    const context = useContext(AuthContext);


    //CHECK FOR IF ITS UNDEFINED. IF YES, ROUTE TO LOGIN AND THROW ERROR
    if (context === undefined) {
        //replace this with notification component
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}


