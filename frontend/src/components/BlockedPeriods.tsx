import React, { useState, useEffect } from "react";
import { Application } from "../types/apply";
import { User } from "../types/users";
import { useUnavail } from "../context/UnavailContext";
import * as utils from "../utils/utils";
import { Unavailable } from "../types/unavail";
import { useNotif } from "../context/NotifContext";
import Card from "./Card";
import Button from "./Button";


interface BlockedPeriodProps {
    venueID: number,
    view: "vendor" | "other"
}

const BlockedPeriods = ({ venueID, view }: BlockedPeriodProps) => {

    const { blockVenue, unblockVenue, getBlockedVenue } = useUnavail();
    const { showNotif } = useNotif();

    // to block the venue
    const [blockDate, setBlockDate] = useState<string>("");
    const [blockStart, setBlockStart] = useState<string>("");
    const [blockEnd, setBlockEnd] = useState<string>("");

    // to store the current blocked periods
    const [currBlocked, setCurrBlocked] = useState<Unavailable[]>([]);

    useEffect(() => {
        fetchBlocked();
    }, []);

    const fetchBlocked = async () => {
        const data = await getBlockedVenue(venueID) ?? [];
        setCurrBlocked(data.filter((b: Unavailable) => !utils.compareTime(b.date)));
    }

    return (
        <div>
            <h2 className="text-2xl font-bold">Unavailability</h2>
            <div className="mt-3">
                <div className="max-h-50 overflow-y-scroll mb-3">
                    {
                        view === "vendor" ? (
                            
                            currBlocked.length > 0 &&
                            currBlocked.sort(function (a, b) {
                                const aDate: string | undefined = currBlocked.filter((u: Unavailable) =>
                                    u.id === a.id).at(0)?.date;
                                const bDate: string | undefined = currBlocked.filter((u: Unavailable) =>
                                    u.id === b.id).at(0)?.date;
                                if (aDate && bDate) {
                                    if (aDate > bDate) {
                                        return 1;
                                    } else {
                                        return -1;
                                    }
                                }
                                return 0;
                            }).map((u: Unavailable) => (
                                <div key={u.id}>
                                    <Card heading="">
                                        <div className="grid grid-cols-2">
                                            <div>
                                                <h3 className="text-lg">{new Date(u.date).toDateString()}</h3>
                                                <p>{u.startTime.slice(0, 5)} to {u.endTime.slice(0, 5)}</p>
                                            </div>
                                            {
                                                view === "vendor" ? (
                                                    <Button className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
                                                        onClick={() => unblockVenue(u.id)} text="Unblock"></Button>
                                                ) : (
                                                    <div />
                                                )
                                            }
                                        </div>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div />
                        )
                    }
                    {
                        currBlocked.length === 0 &&
                        <p><i>Completely available!</i></p>
                    }
                </div>

            </div>

            {
                view === "vendor" ? (
                    <div>
                        <div className="grid grid-cols-[2fr_1.5fr_1.5fr]">
                            <label>Date<br />
                                <input type="date" min={utils.getCurrDate()} value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
                            </label>
                            <label>Start
                                <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
                            </label>
                            <label>End
                                <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
                            </label>
                        </div>
                        <Button className="px-5 py-2 my-2 rounded-xl" onClick={() => {

                            //blocking date validation
                            if (blockDate != "" && blockStart != "" && blockEnd != "") { //ensure fields are non-empty
                                if (blockStart < blockEnd) {
                                    try {
                                        blockVenue(venueID, blockDate, blockStart, blockEnd);
                                        setBlockDate("");
                                        setBlockEnd("");
                                        setBlockStart("");
                                        fetchBlocked();
                                    } catch { //catch for if backend validation fails
                                        showNotif("Failed to block venue. Please check your inputs.", 'fail');
                                    }
                                }
                                else {
                                    showNotif("Please ensure start time is before end time.", "fail");
                                }
                            }
                            else {
                                showNotif("Please enter block date and time", 'fail');
                            }


                        }}
                            text="Block Venue" />
                    </div>

                ) : (
                    <div className="mb-3">
                    {
                      currBlocked.length > 0 &&
                      currBlocked.filter((u: Unavailable) => u.date < Date()).sort(function (a: Unavailable, b: Unavailable) {
                        const aDate: string | undefined = currBlocked.filter((u: Unavailable) => u.id === a.id).at(0)?.date;
                        const bDate: string | undefined = currBlocked.filter((u: Unavailable) => u.id === b.id).at(0)?.date;
                        if (aDate && bDate) {
                          if (aDate < bDate) {
                            return -1;
                          } else {
                            return 1;
                          }
                        }
                        return 0;
                      }).map((b: Unavailable) => (
                        <div key={b.id}>
                          <Card heading={new Date(b.date).toDateString()}>
                            <p>{b.startTime.slice(0, 5)} to {b.endTime.slice(0, 5)}</p>
                          </Card>
                        </div>
                      ))
                    }
                    {
                      currBlocked.length === 0 &&
                      <p><i>Good news! We're fully available to host your next incredible event!</i></p>
                    }
                  </div>
                )
            }
        </div>
    );
}

export default BlockedPeriods;