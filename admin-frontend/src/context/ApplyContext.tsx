import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { Application, User, Venue } from "../types/types";
import { AppService, UserService, VenueService } from '../services/api';
import { StringDecoder } from 'string_decoder';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

//the logic to calculate the report stuff lies here (including download)

interface ApplyContextType {
    allApplications: Application[],
    mostActiveHirers: activeApplicant[],
    mostPopularVenues: popularVenue[],
    downloadReport: () => Promise<void>,
    pdfRef: React.RefObject<HTMLDivElement|null>,
}

export type popularVenue = {
    venue: string,
    day: string,
    timeslot: string
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
    const [mostPopularVenues, setMostPopularVenues] = useState<popularVenue[]>([]);
    const pdfRef= useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAllApps();
    }, []);

    const fetchAllApps = async () => {
        try {
            const data = await AppService.getAllApps();
            setAllApps(data);
            const allHirers = await UserService.getHirers();
            const allVenues = await VenueService.getAllVenues();
            
            let arr = [];
           
            //CALCULATIONS FOR MOST ACTIVE HIRER ----------------------------------------------------------------------
            let groupByHirer = Object.groupBy(data, (app) => app.hirerID);//group by hirerid

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
            const finalArr = [];

            const groupByVenue = Object.groupBy(data, (app) => app.venueID);
            
            //better way to get top 3 venues - sort by num applications, get top 3
            let top3Venues = Object.entries(groupByVenue).sort((a, b) => ((b[1]?.length ?? 0) - (a[1]?.length ?? 0))).slice(0,3);

            //store days of the week
            const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            //get the most popular day for each top 3 venue
            for (const [venueID, applications] of top3Venues) {

               //group by day and find most popular one
               if (applications) {
                    let groupByDay = Object.groupBy(applications, (app) => {
                        
                        const date = new Date(app.date);
                        return days[date.getDay()];

                    });
    
                    //get the day and length of each day's applications, finding one with most
                    const mostPopularDay = Object.entries(groupByDay).sort(([day1,a], [day2,b]) => ((b?.length ?? 0) - (a?.length ?? 0))).slice(0,1);
                    //find most popular timeslot of the day
                    for (const [day, applications] of mostPopularDay) {
                        if (applications) {

                            //group the day's applications by starttime to endtime (hour minutes no seconds)
                            let groupByTime = Object.groupBy(applications, (app) => {
                                return `${app.startTime.slice(0,5)}-${app.endTime.slice(0,5)}`
                            });

                            const mostPopularTime = Object.entries(groupByTime).sort(([time1, a], [time2, b]) => (b?.length ?? 0) - (a?.length ?? 0))[0];

                            //LETS GOOOO WE ARE SO BACK WE ARE SOOO BACK
                            //console.log("venue id ", venueID, "most popular day is ", day, " most popular time is ", mostPopularTime[0]);

                            //get the name of this venue
                            const venue: string = allVenues.find((venue: Venue) => Number(venue.id) === Number(venueID))?.name ?? "";
                            
                            finalArr.push({ venue, day, timeslot: mostPopularTime[0] });
                        }  
                    }
               }
            }

            setMostPopularVenues(finalArr);

        } catch (error) {
            console.error("Error fetching all applications (Context File): ", error);
        }
    };

    const downloadReport = async () => {
        const report = pdfRef.current;

        if (report) {
            html2canvas(report).then((canvas) => {
                const img = canvas.toDataURL('image/png');
                const pdf = new jsPDF();

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width * 0.5 ;
                const imgHeight = canvas.height * 0.5;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = (pdfHeight - imgHeight * ratio) / 2;

                pdf.addImage(img, "PNG", imgX, imgY, imgWidth*ratio, imgHeight*ratio);
                pdf.save('report.pdf');

            });
        }

    }

    //return provider
    return (
        <ApplyContext.Provider value={{ allApplications, mostActiveHirers, mostPopularVenues, downloadReport, pdfRef }}>
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