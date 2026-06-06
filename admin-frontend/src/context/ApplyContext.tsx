import React, { useState, useEffect, useContext, createContext } from 'react';
import { Application, User } from "../types/types";
import { AppService, UserService } from '../services/api';
import { StringDecoder } from 'string_decoder';

//the logic to calculate the report stuff lies here

interface ApplyContextType {
    allApplications: Application[],
    mostActiveHirers: activeApplicant[]
}

export type popularVenue = {
    venueID: number,
    day: string,
    startTime: string,
    endTime: string
}

export type activeApplicant = {
    hirer: User,
    percentage: number,
}

// create the context to be used
const ApplyContext = createContext<ApplyContextType | undefined>(undefined);

export function ApplyProvider({ children }: { children: React.ReactNode }) {

    // var stores all the applications
    const [allApplications, setAllApps] = useState<Application[]>([]);
    const [mostActiveHirers, setMostActiveHirers] = useState<activeApplicant[]>([]);


    useEffect(() => {
        fetchAllApps();
    }, []);

    const fetchAllApps = async () => {
        try {
            const data = await AppService.getAllApps();
            setAllApps(data);
            const allHirers = await UserService.getHirers();
            
            let arr = [];
           
            //CALCULATIONS FOR MOST ACTIVE HIRER ----------------------------------------------------------------------
            const groupByHirer = Object.groupBy(data, (app) => app.hirerID);//group by hirerid

            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
            //calculate how many in each are accepted
            let percentage: number = 0;
            let hirer: User = allHirers[0];

            for (const [hirerID, apps] of Object.entries(groupByHirer)) {

                if (apps && apps.length > 0) { //count how many are accepted
                    let accepted = 0;
                    for (let i = 0 ; i < apps.length ; i++) {
                        if (apps[i].isAccepted === true) {
                            accepted++;
                        }
                    }
                    
                    percentage = Math.round((accepted/ apps.length) * 100) ; //get percentage of accepted applications and sort
                    hirer = allHirers.find((user: User) => Number(user.id) === Number(hirerID));

                    arr.push({hirer, percentage}); //get the hirer and their ratio
                }
 
            }
            arr = arr.sort((a, b) => b.percentage - a.percentage);   
            arr = arr.slice(0,3); //get the top 3 (or less if there aren't 3 in the first place)
            setMostActiveHirers(arr);

            //CALCULATIONS FOR ACTIVE VENUE ----------------------------------------------------------------------


        } catch (error) {
            console.error("Error fetching all applications (Context File): ", error);
        }
    };

    //return provider
    return (
        <ApplyContext.Provider value={{ allApplications, mostActiveHirers }}>
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