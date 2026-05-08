import React, {useState, useEffect, useContext, createContext} from 'react';
import {useRouter } from 'next/router';
import {users, User} from "../types/users";
import {Application} from "../types/apply";
import { useApplications } from './ApplyContext';
import {venues, Venue} from '../types/venues'
import {useVenues} from './VenueContext'
import {useNotif} from './NotifContext'
import {userAPI, shortlistedVenueAPI, venueAPI} from '../services/api'

//lectorial 2 example 6 was referenced when creating this AuthContext 

interface AuthContextType {
    currUser : User | null,
    allUsers : User[],
    login : (email: string, password: string) => void;
    logout : () => void,
    updateUser : (updatedUser: User) => void, //update user information, including their shortlisted venues
    getRepRating : (user : User) => number,
    shortlistedVenues: Venue[],
    //pastVenues: Venue[],
    venueApplications: Application[], //stores the application id

}

//create context!!! to be used in consumer
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//custom provider component for consumers
export function AuthProvider({children} : {children : React.ReactNode}) {
    const router = useRouter();
    const {allApplications} = useApplications();
    const {allVenues} = useVenues();
    const {showNotif} = useNotif();

    // REMOVE THESE FROM LOCAL STORAGE WHEN RECFACTORING DONE
    const[currUser, setCurrUser] = useState<User | null>(null);
    const[allUsers, setAllUsers] = useState<User[]>([]);

    //add the shortlisted venue usestate here since its linked to the user. use this to 
    //update components that render the hshortlisted venues
    const [shortlistedVenues, setShortlistedVenues] = useState<Venue[]>([]);
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
        console.log("currUser is " + currUser);

        if (currUser) {
            const shortlistedVenuesData = await shortlistedVenueAPI.getShortlistedVenues(currUser.id);
            const venues = await venueAPI.getAllVenues();

            //organise the data and get the shortlistedVenues of type Venue
            const shortlistedVenues: Venue[] = shortlistedVenuesData.map((shortlistedVenue: {hirerID: number, venueID: number, rank: number}) => 
                                                                     venues.find((venue: Venue) => venue.id === shortlistedVenue.venueID));

            setShortlistedVenues(shortlistedVenues);
            console.log("venue:", shortlistedVenuesData[0]);
            return shortlistedVenues;
        }
    }

    // useEffects

    //check if theres user in the database. check if theres shortlisted venues and applications
    //NOTE: lec2example6 takes user information from LS and stores in useState above.
    //      if theres nothing in LS then it takes default user array from file.
    useEffect( () => {
        getAllUsers();

        //check if user stored
        const storedUser = localStorage.getItem("currUser");

        if (storedUser) {
            setCurrUser(JSON.parse(storedUser)); //cant get shortlisted venus yet cuz no user
            setVenueApplications(allApplications.filter((app : Application)=>   (currUser?.applications?.includes(app.id))));
        }

    }
    , []);

    //store updated users to localstorage when user information changes
    useEffect(() => {
        if (allUsers.length > 0) {
            localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }
    }, [allUsers])

    //get the user's shortlisted venues from local storage and store in state
    //need this for carousel to display shortlisted venues IN CORRECT ORDER EVERYTIME THINGS CHANGE
    useEffect(() => {
        const shortlistedVenueArray: Venue[] = [];
        if (currUser && currUser.shortlistedVenues) {
            //foreach loop over all items in shortlistedVenues. TRY REPLACE THIS W SMTH MORE EFFICIENT?? map function?
            for (const id of currUser.shortlistedVenues) {
                const found = allVenues.find(venue => venue.id === id);
                if (found) {
                    shortlistedVenueArray.push(found); //push the VENUE to shortlistedVenueArray
                }
            }
        }

        setShortlistedVenues(shortlistedVenueArray)
    }, [currUser?.shortlistedVenues]);

    

    //get user related data everytime the user OR user-related things change
    useEffect(() => {
        getShortlistedVenues();

        // check that user application matches the
        let applicationsArray: Application[] = [];
        let currUserApplications: number[] = [];

        
        //check if the new application added affects this user. 
        if (currUser && currUser.applications) {
            applicationsArray = allApplications.filter(
                                apps => apps.hirerID === currUser.id);

            setVenueApplications(applicationsArray);
        }
        //console.log(venueApplications);
    }, [allApplications, currUser]);

    // login functionality.
    const login = async (email: string, password: string) => {
        // const userFound = allUsers.find(
        // (u) => u.email === email && u.password === password
        // );
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

        // const allUsers: User[] = await getAllUsers();

        // //create new allUsers array
        // const updatedAllUsers = allUsers.map(user => //map function I LOVE YOUU
        //         user.id === currUser?.id ? updatedUser : user
        // )
        
        // //update state and localstorage
        // setCurrUser(updatedUser);
        // setAllUsers(updatedAllUsers)
        // localStorage.setItem("currUser", JSON.stringify(updatedUser));
        // localStorage.setItem("allUsers", JSON.stringify(updatedAllUsers));

        //update this user in the database
        await userAPI.updateUser(updatedUser.id, updatedUser);

        //update all the users in use state
        await getAllUsers();

        //update the currUser in use state
        const user = await userAPI.getUserById(updatedUser.id);
        //console.log("user phone:" + user?.phone);
        setCurrUser(user);
        
    }

    // calculate the reputation rating of a hirer
    // source: https://www.geeksforgeeks.org/typescript/typescript-array-reduce-method/
    const getRepRating = (user : User) : number => {
        const myApps = allApplications.filter((app : Application) => (app.hirerID === user.id && app.accepted === true && app.vendorRating !== undefined));
        let rating : number = myApps.reduce((total, currVal) => {
            if (currVal.vendorRating !== undefined) {
                return total + currVal.vendorRating  
            } else {
                return total
            }
        }, 0) / (myApps.length);

        rating = Number.isNaN(rating) ? 0 : rating;
        
        return rating;
    }

    //return provider
    return (
        // NOTE; lec2example6 also returns all users array + login function
        //this authContext provides context to all its kids (aka everything)
        <AuthContext.Provider value={{currUser, allUsers, login, logout, updateUser, getRepRating, 
                                      shortlistedVenues, venueApplications}}>
            {children}
        </AuthContext.Provider>
    );
  
}

//consumer component (custom hook!)
export function useAuth() {
    //use the context made above
    const context = useContext(AuthContext);


    //CHECK FOR IF ITS UNDEFINED. IF YES, ROUTE TO LOGIN AND THROW ERROR
    if (context===undefined) {
        //replace this with notification component
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}


