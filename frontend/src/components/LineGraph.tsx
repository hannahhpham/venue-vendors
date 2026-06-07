import React, { ChangeEvent, memo, useMemo, useState } from "react";
import { Application } from "../types/apply";
import * as utils from "../utils/utils";

// reference: Week 11 Example 3 Lectures

import {
    Chart as ChartJS, CategoryScale, LinearScale, TimeScale,
    PointElement, LineElement, BarElement,
    Title, Tooltip, Legend, Filler, ArcElement,
    ChartOptions,
    TimeScaleTimeOptions
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";


interface LineGraphProps {
    // pass in currApps from [id].tsx, or the relevant data from dashboard.tsx
    currApps: Application[],
}

const LineGraph = ({ currApps }: LineGraphProps) => {

    //type filter = 'week' | 'thisMonth' | 'lastMonth' | 'all';
    const [dateFilter, setDateFilter] = useState<string>("all");

    let consideredApps = currApps.filter((app: Application) =>
            app.isAccepted === true && utils.compareTime(app.date)).toSorted((a, b) => {
            if (a.date < b.date) {
                return 1;
            }
            if (a.date > b.date) {
                return -1;
            }
            return 0;
        });

    const minDateAll : string = useMemo(() => {
        consideredApps.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            }
            if (a.date > b.date) {
                return -1;
            }
            return 0;
        });
        if (consideredApps.length === 0) {
            return new Date().toISOString()
        }
            
        return consideredApps.at(consideredApps.length - 1)?.date ?? new Date().toISOString();
    }, [currApps]);


    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>(new Date().toISOString());

    // source: https://www.w3schools.com/js/js_date_methods_set.asp
    const handleChange = () => {
        console.log(dateFilter);
        const today = new Date();
        let final = new Date();

        switch (dateFilter) {
            case "all":
                setMinDate("");
                setMaxDate("");
                setMinDate(minDateAll);
                setMaxDate(today.toISOString());
                break;
            
            case "lastMonth":
                setMinDate("");
                setMaxDate("");
                final.setMonth(today.getMonth() - 2);
                setMinDate(final.toISOString());
                final.setMonth(today.getMonth() - 1);
                setMaxDate(final.toISOString());
                break;

            case "thisMonth":
                setMinDate("");
                setMaxDate("");
                final.setMonth(today.getMonth() - 1);
                setMinDate(final.toISOString());
                setMaxDate(today.toISOString());
                break;

            case "week":
                setMinDate("");
                setMaxDate("");
                final.setDate(today.getDate() - 7);
                console.log("7 days ago: ", final.toDateString());
                setMinDate(final.toISOString());
                setMaxDate(today.toISOString());
                break;
            
            default:
                setMinDate("");
                setMaxDate("");
                setMinDate(minDateAll);
                setMaxDate(today.toISOString());
                console.log("min date: ", minDateAll);
        }

        // if (dateFilter === "all") {
        //     setMinDate(minDateAll);
        //     setMaxDate(today.toISOString());

        // }
        // if (dateFilter === "lastMonth") {
        //     final.setMonth(today.getMonth() - 2);
        //     setMinDate(final.toISOString());
        //     final.setMonth(today.getMonth() - 1);
        //     setMaxDate(final.toISOString());

        // } else if (dateFilter === "thisMonth") {
        //     final.setMonth(today.getMonth() - 1);
        //     setMinDate(final.toISOString());
        //     setMaxDate(today.toISOString());

        // } else if (dateFilter === "week") {
        //     final.setDate(today.getDate() - 7);
        //     console.log("7 days ago: ", final.toDateString());
        //     setMinDate(final.toISOString());
        //     setMaxDate(today.toISOString());
        // }
    }


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

        const lineChartOptions: ChartOptions<'line'> = {
            responsive: true,
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: 'day',
                        tooltipFormat: "MMM dd yyyy",
                        displayFormats: {
                            day: 'MMM dd',
                        }
                    },
                    min: minDate,
                    max: maxDate
                },
                y: {
                    min: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: "top" as const,
                },
            },
        };


        // get all the dates that the venue has been used (hired)
        const allChosenApplicants: string[] = consideredApps.map((app: Application) => app.date);

        // get the distinct set of dates
        const distChosenApplicants = new Set<string>(allChosenApplicants);

        // Map (hirerID, isAccepted%)
        let numOfChosenApps = new Map();
        for (const hirer of distChosenApplicants) {
            let count: number = 0;
            for (const h of allChosenApplicants) {
                if (h === hirer) {
                    count++;
                }
            }
            // count # bookings per day
            numOfChosenApps.set(hirer, count);
        }

        const arrayMap: [string, number][] = Array.from(numOfChosenApps);


        const labels = arrayMap.map((group: [string, number]) => group[0]);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: "Utilisation of Venue",
                    data: arrayMap.map((group: [string, number]) => ({
                        x: group[0],
                        y: group[1]
                    })),
                    backgroundColor: "rgba(0, 48, 204, 0.75)",
                },
            ],
            // datasets: [
            //     {
            //         label: "Utilisation of Venue",
            //         data: arrayMap.map((group: [string, number]) => group[1]),
            //         backgroundColor: "rgba(0, 48, 204, 0.75)",
            //     },
            // ],
        }

        return (
            arrayMap.length === 0 ? (
                <p><i>No accepted past bookings found. Unable to generate utilisation analytics.</i></p>
            ) : (
                <div className="mt-3">
                    <div className="inline">
                        <p className="inline">Showing results for </p>
                        <select value={dateFilter} className="outline rounded-lg" onChange={(e) => {
                            console.log("given:", e.target.value);
                            setDateFilter(e.target.value);
                            console.log("stored:", dateFilter);
                            handleChange();
                        }}>
                            <option value="all">All Time</option>
                            <option value="week">This Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                        </select>
                    </div>
                    <Line options={lineChartOptions} data={data} />
                </div>
            )
        )

    }

};

// memo to make sure that the component only re renders upon a change in the props
// essentially, the change in the props is like an event listener
export default LineGraph;