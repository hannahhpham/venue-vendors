import React, { memo } from "react";
import { Application } from "../types/apply";
import { User } from "../types/users";
import { useAuth } from "../context/AuthContext";

// reference: Week 11 Example 3 Lectures

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

interface analyticsProps {
    // pass in currApps from [id].tsx
    currApps: Application[],
    // our interpretation of disctinction part i, ii, iii
    type: "mostAccepted" | "totalAccepted" | "activeHirers" | "utilisation",
}

const Analytics = ({ currApps, type }: analyticsProps) => {

    const { allUsers } = useAuth();

    if (currApps.length === 0) {

        return (
            <p><i>No data available to generate analytics.</i></p>
        )

    } else {

        // Register ChartJS components
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            ArcElement,
            BarElement,
            Title,
            Tooltip,
            Legend,
            Filler
        );


        const chartOptions = {
            indexAxis: 'y' as const,
            responsive: true,
            scales: {
                x: {
                    min: 0,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: "top" as const,
                },
            },
        };


        const pieChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top" as const,
                },
            },
        };


        // i. Most chosen applicant
        // we have done this for a given hirer as 
        // (number of isAccepted applications) / total isAccepted applications * 100 ==> percentage
        if (type === "mostAccepted") {

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
                numOfChosenApps.set(hirer, Math.round((count / allChosenApplicants.length) * 100));
            }
            // sort in descending order ==> highest % at start
            const arrayMap: number[][] = Array.from(numOfChosenApps);


            const labels = arrayMap.map((group: number[]) => (allUsers.find((user: User) => user.id === group[0])?.firstName));

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

        // ii. Overall Total Accepted (Across All Vendor Venues)
        // for a given hirer, we have done this as
        // (number of accepted applications across) / total rejected applications * 100 ==> percentage
        } else if (type === "totalAccepted") {

            // get all the ids of rejected applicants
            const allRejectApplicants: number[] = currApps.filter((app: Application) =>
                app.isAccepted === false).map((app: Application) => app.hirerID);

            // get the distinct set of rejected ids
            const distRejectApplicants = new Set<number>(allRejectApplicants);

            // Map (hirerID, rejected%)
            let numOfRejectedApps = new Map();
            for (const hirer of distRejectApplicants) {
                let count: number = 0;
                for (const h of allRejectApplicants) {
                    if (h === hirer) {
                        count++;
                    }
                }
                // percentage rating
                numOfRejectedApps.set(hirer, Math.round((count / allRejectApplicants.length) * 100));
            }
            // sort in descending order ==> highest % at the start
            const arrayMap: number[][] = Array.from(numOfRejectedApps).sort(
                (a: number[], b: number[]) => b[1] - a[1]);

            // show a max of 3 hirers
            const finalMap: number[][] = arrayMap.length > 2 ? arrayMap.slice(0, 3) : arrayMap;


            return (
                finalMap.length === 0 ? (
                    <p><i>No rejected applicants found. Unable to generate analytics.</i></p>
                ) : (
                    finalMap.map((group: number[]) => (
                        <div key={group[0]} className="grid grid-cols-[40%_60%] mb-1">
                            <p className="ml-auto mr-2">{allUsers.find((user: User) => user.id === group[0])?.firstName} {allUsers.find((user: User) => user.id === group[0])?.lastName}</p>
                            <div style={{ width: group[1] + "%" }} className={"text-white bg-blue-900"}> {group[1]}%</div>
                        </div>
                    ))
                )
            )


        } else if (type === "activeHirers") {

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

            const labels = arrayMap.map((group: number[]) => (allUsers.find((user: User) => user.id === group[0])?.firstName));

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

        }  else if (type === "utilisation") {

            // get the ids of all unshortlisted applicants
            const allShortlistApps: number[] = currApps.filter((app: Application) =>
                app.rank === undefined || app.rank === 0).map((app: Application) => app.hirerID);

            // get the distinct set of unshortlisted ids
            const distShortlistApps = new Set<number>(allShortlistApps);

            // Map(hirerID, unshortlisted%)
            let numOfShortlisted = new Map();
            for (const hirer of distShortlistApps) {
                let count: number = 0;
                for (const h of allShortlistApps) {
                    if (h === hirer) {
                        count++;
                    }
                }
                // percentage rating
                numOfShortlisted.set(hirer, Math.round((count / allShortlistApps.length) * 100));
            }
            // sort in ascending order ==> the lowest % at the start
            const arrayMap: number[][] = Array.from(numOfShortlisted).sort(
                (a: number[], b: number[]) => a[1] - b[1]);

            // show a max of 3 hirers
            const finalMap: number[][] = arrayMap.length > 2 ? arrayMap.slice(0, 3) : arrayMap;

            return (
                finalMap.length === 0 ? (
                    <p><i>No unshortlisted applicants found. Unable to generate analytics.</i></p>
                ) : (
                    finalMap.map((group: number[]) => (
                        <div key={group[0]} className="grid grid-cols-[40%_60%] mb-1">
                            <p className="ml-auto mr-2">{allUsers.find((user: User) => user.id === group[0])?.firstName} {allUsers.find((user: User) => user.id === group[0])?.lastName}</p>
                            <div style={{ width: group[1] + "%" }} className={`text-white bg-blue-900`}> {group[1]}%</div>
                        </div>
                    ))
                )
            )

        }

    }

};

// memo to make sure that the component only re renders upon a change in the props
// essentially, the change in the props is like an event listener
export default memo(Analytics);