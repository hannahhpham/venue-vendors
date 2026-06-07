import React, { memo } from "react";
import { Application } from "../types/types";
import { User } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { useApplications } from '../context/ApplyContext';
import * as utils from "../utils/utils";

// reference: Week 11 Example 3 Lectures
import "chartjs-adapter-date-fns";
import {
    Chart as ChartJS, CategoryScale, LinearScale, TimeScale,
    PointElement, LineElement, BarElement,
    Title, Tooltip, Legend, Filler, ArcElement
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

interface analyticsProps {
    // pass in currApps from [id].tsx, or the relevant data from dashboard.tsx
    currApps: Application[],
    type: "mostAccepted" | "totalAccepted" | "activeHirers",
}

const Analytics = ({ currApps, type }: analyticsProps) => {

    // to map to names
    const { allHirers } = useAuth();
    const {allApplications} = useApplications();

    if (currApps.length === 0) {

        return (
            <p><i>No data available to generate analytics.</i></p>
        )

    } else {

        // Register ChartJS components
        ChartJS.register(
            CategoryScale, LinearScale, PointElement, TimeScale,
            LineElement, ArcElement, BarElement,
            Title, Tooltip, Legend, Filler
        );


        const chartOptions = {
            indexAxis: 'y' as const,
            responsive: true,
            plugins: {
                legend: {
                    position: "top" as const,
                },
            },
            scales: {
                x: {
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        };


        const pieChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top" as const,
                },
            },
        };


        // get graph for the hirers with the highest ratio of accepted applications out of all their applications
        if (type === "mostAccepted") {
            let groupByHirer = Object.groupBy(allApplications, (app) => app.hirerID);//group by hirerid
            
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
            //calculate how many in each are accepted
            let percentage: number = 0;
            let hirerName: string = '';
            let arr = []; //intermediate array
            let hirerLabels = [];
            let hirerData = [];

            for (const [hirerID, apps] of Object.entries(groupByHirer)) {

                if (apps && apps.length > 0) { //count how many are accepted
                    let accepted = 0;
                    for (let i = 0 ; i < apps.length ; i++) {
                        if (apps[i].isAccepted === true) {
                            accepted++;
                        }
                    }
                    
                    percentage = Math.round((accepted/ apps.length) * 100) ; //get percentage of accepted applications and sort
                    hirerName = allHirers.find((user: User) => Number(user.id) === Number(hirerID))?.firstName || '';

                    arr.push({hirerName, percentage}); //get the hirer and their ratio
                }
    
            }
            arr = arr.sort((a, b) => b.percentage - a.percentage);   
            arr = arr.slice(0,3); //get the top 3 (or less if there aren't 3 in the first place)

            for (const {hirerName, percentage} of arr) {
                hirerLabels.push(hirerName);
                hirerData.push(percentage);
            }

            const barData = {
                labels: hirerLabels,
                datasets: [
                    {
                        label: "Most Chosen Applicant",
                        data: hirerData,
                        backgroundColor: "rgba(0, 48, 204, 0.75)",
                    },
                ],
            };

            return (
                allApplications.length === 0 ? (
                    <p><i>No accepted applicants found. Unable to generate analytics.</i></p>
                ) : (
                    <Bar options={chartOptions} data={barData} />
                )
            )

        // the selected applicants across all a vendor's venues - dashboard
        } else if (type === "totalAccepted") {

            // get the ids of hirers who have been accepted for the given venue
            const allChosenApplicants: number[] = currApps.filter((app: Application) =>
                app.isAccepted === true).map((app: Application) => app.hirerID);

            // get the distinct set
            const distChosenApplicants = new Set<number>(allChosenApplicants);

            // Map (hirerID, isAccepted%)
            let numOfChosenApps = new Map();
            for (const hirer of distChosenApplicants) {
                let count: number = 0;
                for (const h of allChosenApplicants) {
                    if (h === hirer) {
                        count++;
                    }
                }
                // percentage rating
                numOfChosenApps.set(hirer, count);
            }
            
            const arrayMap: number[][] = Array.from(numOfChosenApps);


            const labels = arrayMap.map((group: number[]) => (allHirers.find((user: User) => user.id === group[0])?.firstName));

            const barData = {
                labels: labels,
                datasets: [
                    {
                        label: "Most Chosen Applicant (%)",
                        data: arrayMap.map((group: number[]) => group[1]),
                        backgroundColor: "rgba(0, 48, 204, 0.75)",
                    },
                ],
            };

            return (
                arrayMap.length === 0 ? (
                    <p><i>No accepted applicants found. Unable to generate analytics.</i></p>
                ) : (
                    <Bar options={chartOptions} data={barData} />
                )
            )


        } else if (type === "activeHirers") {

            // console.log(allHirers);

            // get the ids of hirers who have been isAccepted
            const allChosenApplicants: number[] = currApps.filter((app: Application) =>
                app.isAccepted === true).map((app: Application) => app.hirerID);

            // get the distinct set
            const distChosenApplicants = new Set<number>(allChosenApplicants);

            // Map (hirerID, isAccepted%)
            let numOfChosenApps = new Map();
            for (const hirer of distChosenApplicants) {
                let count: number = 0;
                for (const h of allChosenApplicants) {
                    if (h === hirer) {
                        count++;
                    }
                }
                // percentage rating
                numOfChosenApps.set(hirer, count);
            }
            
            const arrayMap: number[][] = Array.from(numOfChosenApps);

            const labels = arrayMap.map((group: number[]) => (allHirers.find((user: User) => user.id === group[0])?.firstName));

            const pieData = {
                labels: labels,
                datasets: [
                    {
                        label: "Most Chosen Applicant",
                        data: arrayMap.map((group: number[]) => group[1]),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.5)",
                            "rgba(54, 162, 235, 0.5)",
                            "rgba(255, 206, 86, 0.5)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            return (
                arrayMap.length === 0 ? (
                    <p><i>No activer hirers found. Unable to generate analytics.</i></p>
                ) : (
                    <Pie options={pieChartOptions} data={pieData} />
                )
            )


        }

    }

};

// memo to make sure that the component only re renders upon a change in the props
// essentially, the change in the props is like an event listener
export default memo(Analytics);