import React, { useState, useEffect, useContext, createContext } from 'react';
import {useNotif} from '../context/NotifContext'
import { useRouter } from 'next/router';
import { User } from "../types/types";
import {UserService} from '../services/api'

// import { useNotif } from './NotifContext'

interface AuthContextType {
    currUser: boolean,
    allUsers: User[],
    allHirers: User[],
    loading: boolean,
    login: (email: string, password: string) => void;
    logout: () => void,

}

//create context!!! to be used in consumer
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//custom provider component for consumers
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const {showNotif} = useNotif();
    const router = useRouter();
    //const { showNotif } = useNotif();

    const [currUser, setCurrUser] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    //for select dropdown
    const [allUsers, setAllUsers] = useState<User[]>([]); //this is actually all vendors
    const [allHirers, setAllHirers] = useState<User[]>([]);


    //THIS NEEDS TO STAY SO USERS STAY LOGGED IN UPON REFRESH
    //this is taking too long and this part causes slight flicker
    useEffect( () => {
        try {
            getAllUsers();
            getAllHirers();
        } catch {
            console.log("failed to fetch");
        }
        
        const admin = localStorage.getItem("admin");
        setLoading(true);

        if (admin == "true") {   
            setCurrUser(true);
        }
        setLoading(false);
    }, []);

    const getAllUsers = async (): Promise<void> => {
        const users = await UserService.getAllUsers();
        if (users) {
            setAllUsers(users);
        }
    }

    const getAllHirers = async (): Promise<void> => {
        const users = await UserService.getHirers();
        if (users) {
            setAllHirers(users);
        }
    }

    // login functionality.
    const login = async (username: string, password: string) => {
        if (username === "admin" && password==="admin") {
            localStorage.setItem("admin", "true");
            router.push('/');
            showNotif("You have logged in.", "success");
            setCurrUser(true);
        }
        else {
            showNotif("Login failed. Please try again.", "fail");
        }
    }

    //logout functionality - remove user from LS, push to homepage
    const logout = () => {
        //remove user from local storage
        localStorage.removeItem("admin");
        setCurrUser(false);
        showNotif("You have logged out.", "success");
        //showNotif("You have successfully logged out.", 'success');
        router.push('/');
    }

    //return provider
    return (
        // NOTE; lec2example6 also returns all users array + login function
        //this authContext provides context to all its kids (aka everything)
        <AuthContext.Provider value={{
            currUser, allUsers, allHirers, loading, login, logout
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


