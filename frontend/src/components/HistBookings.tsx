import React from "react";
import { Application } from "../types/apply";
import * as utils from "../utils/utils";
import ApplicationsCard from "./ApplicationsCard";


interface HistBookingProps {
    currApps: Application[]
}

const HistBookings = ({ currApps }: HistBookingProps) => {
    //
    return (
        <div>
            <h1 className="text-2xl font-bold mt-2">History</h1>
            <div className="max-h-150 overflow-x-hidden overflow-y-auto">
                {
                    currApps.filter((app: Application) => app.isAccepted &&
                        (utils.compareTime(app.date))).length > 0 &&
                    currApps.filter((app: Application) => app.isAccepted &&
                        (utils.compareTime(app.date))).map((app: Application) => (
                            <ApplicationsCard key={app.id} app={app} history={true} />
                        ))
                }
                {
                    currApps.filter((app: Application) => app.isAccepted &&
                        (utils.compareTime(app.date))).length === 0 &&
                    <p><i>No previous hiring history.</i></p>
                }
            </div>
        </div>
    );
};

export default HistBookings;