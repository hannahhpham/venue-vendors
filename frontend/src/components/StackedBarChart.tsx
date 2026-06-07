// import React, { memo, useState, useEffect } from "react";
// import { Application } from "../types/apply";
// import { User } from "../types/users";
// import { useAuth } from "../context/AuthContext";
// import * as utils from "../utils/utils";
// import { applicationAPI } from "../services/api";
// import { useApplications } from "../context/ApplyContext";

// // reference: Week 11 Example 3 Lectures
// import {
//     Chart as ChartJS, CategoryScale, LinearScale,
//     PointElement, BarElement,
//     Title, Tooltip, Legend, Filler
// } from "chart.js";
// import { Bar } from "react-chartjs-2";


// const StackedBarChart = () => {

//     // to map to names
//     const { allUsers, currUser, vendorVenues } = useAuth();
//     const { allApplications } = useApplications();

//     const [allVenApps, setAllVenApps] = useState<Application[][]>([]);
//     //let allVenApps: Application[][] = [];

//     useEffect(() => {
//         vendorVenues.map(venue => {
//             getGraphApps(venue.id);
//         })

//     }, []);

//     // const getGraphApps = async (id: number) => {
//     //     try {
//     //         const data = await applicationAPI.getVenueApps(id);
//     //         setAllVenApps([...allVenApps, data.filter((a: Application) => a.isAccepted === true && utils.compareTime(a.date))]);
//     //     } catch (error) {
//     //         console.error("Failed to fetch all venue apps [auth context]:", error);
//     //     }
//     // }

//     const getGraphApps = (id: number) => {
//         const data = allApplications.filter((a: Application) => a.venueID === id && a.isAccepted === true && utils.compareTime(a.date));
//         console.log(JSON.stringify(data));
//         setAllVenApps([...allVenApps, data]);
//     }

//     console.log("the final lot: " + JSON.stringify(allVenApps));


//     // if (currApps.length === 0) {

//     //     return (
//     //         <p><i>No data available to generate analytics.</i></p>
//     //     )

//     // } else {

//     // Register ChartJS components
//     ChartJS.register(
//         CategoryScale, LinearScale, PointElement,
//         BarElement, Title, Tooltip, Legend, Filler
//     );


//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: "top" as const,
//             },
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     stepSize: 1
//                 },
//                 stacked: true
//             },
//             y: {
//                 stacked: true
//             }
//         }
//     };

//     // get the ids of hirers who have been accepted for the given venue
//     const allChosenApplicants: number[][] = allVenApps.map(venApps => venApps.filter((app: Application) =>
//         app.isAccepted === true).map((app: Application) => app.hirerID));

//     console.log("all chosen applicants: " + JSON.stringify(allChosenApplicants));

//     // get the distinct set

//     const distChosenApplicants: Set<number>[] = allChosenApplicants.map((venue) => new Set<number>(venue));

//     // Map (hirerID, isAccepted%)
//     let numOfChosenApps: Map<number, number>[] = [];
//     for (let i = 0; i < distChosenApplicants.length; ++i) {
//         for (const hirer of distChosenApplicants[i]) {
//             let counts: number = 0;
//             for (const h of allChosenApplicants[i]) {
//                 if (h === hirer) {
//                     counts++;
//                 }
//             }
//             // percentage rating
//             numOfChosenApps.push(new Map<number, number>([[hirer, counts]]));
//         }
//     }

//     console.log(JSON.stringify(numOfChosenApps));

//     const arrayMap: number[][][] = numOfChosenApps.map(arr => Array.from(arr));

//     console.log(JSON.stringify(arrayMap));


//     const peopleLabels = arrayMap.map((group: number[][]) =>
//         group.map((inner: number[]) => (
//             allUsers.find((user: User) => user.id === inner[0])?.firstName)));
//     console.log(JSON.stringify(peopleLabels));

//     // const datasets = peopleLabels.map((person, index) => {
//     //     const dataSet = arrayMap.map((arr1 : number[][]) => {
//     //         arr1[index].map((person, index, arr2: number[]) => 
//     //             arr2[index]
//     //         )
//     //     })

//     //     {
//     //         label: person,
//     //         data: dataSet,
//     //         backgroundColor: rgba(0, 48, 204, 0.75)
//     //     }
//     // })


//     const venueLabels = vendorVenues.map((venue) => venue.name);
//     //console.log(JSON.stringify(venueLabels));

//     const barData = {
//         labels: venueLabels,
//         datasets: [peopleLabels.map((ppl) => (
//             {
//                 label: ppl,
//                 data: [20, 30, 40],
                
//             }
//         ))
//             {
//                 label: "Person 1",
//                 data: [20, 30, 40, 50],
//                 backgroundColor: "rgba(0, 48, 204, 0.75)",
//             },
//             {
//                 label: "Person 2",
//                 data: [30, 40, 50, 60],
//                 backgroundColor: "rgba(255, 86, 241, 0.75)",
//             },
//             {
//                 label: "Person 3",
//                 data: [40, 50, 60, 70],
//                 backgroundColor: "rgba(99, 221, 0, 0.75)",
//             },
//         ],
//     };

//     return (
//         // arrayMap.length === 0 ? (
//         //     <p><i>No accepted applicants found. Unable to generate analytics.</i></p>
//         // ) : (
//         <Bar options={chartOptions} data={barData} />
//         //)
//     )


//     //}

// };

// // memo to make sure that the component only re renders upon a change in the props
// // essentially, the change in the props is like an event listener
// export default StackedBarChart;