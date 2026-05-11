import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "../../types/users"
import { Venue } from "../../types/venues"
import { Application } from "../../types/apply";
import { Unavailable } from "../../types/unavail";
import { useAuth } from "../../context/AuthContext";
import { useApplications } from "../../context/ApplyContext";
import { useUnavail } from "../../context/UnavailContext";
import { useNotif } from '../../context/NotifContext'
//import {useVenues} from ''
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import Card from "../../components/Card";
import ApplicationsCard from "../../components/ApplicationsCard";
import VenueDetails from '../../components/VenueDetails';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar'
import Main from '../../components/Main';
import Analytics from "../../components/Analytics";
import { applicationAPI, venueAPI, blockedAPI } from "../../services/api";


export default function VenuePage() {
  const router = useRouter();
  //const { allVenues } = useVenues();
  const { currUser, allUsers, updateUser } = useAuth();
  const { allApplications, setBooking, shortlist } = useApplications();
  const { allBlocked, blockVenue, unblockVenue } = useUnavail();
  const { showNotif } = useNotif();
  // this is a string - the venue id
  const { id } = router.query;

  //const thisVenue: Venue | undefined = allVenues.filter((venue: Venue) => venue.id === Number(id)).at(0);

  // the following code is based on [id].tsx, profile, frontend, Lecture 9 Example 1
  const [thisVenue, setThisVenue] = useState<Venue | undefined>(undefined);

  // the problem with this is that there is a delay in displaying the page
  // in this gap, it shows that "This venue does not exist"
  // as a (very) temporary fix, i removed the "this venue does not exist" to make it less obvious. same issue still happens
  // we probably need to use a different hook (?)
  useEffect( () => {
    if (id) {
      fetchVenue();
      fetchCurrApps();
    }
  }, [id]);

  const fetchVenue = async () => {
    try {
      const data = await venueAPI.getVenue(id as string);
      setThisVenue(data);
    } catch (error) {
      console.error("Error fetching venue ([id].tsx): ", error);
    }
  };

  // get all the applications submitted for this venue
  const [currApps, setCurrApps] = useState<Application[]>([]);

  const fetchCurrApps = async () => {
    try {
      const data = await applicationAPI.getVenueApps(Number(id));
      setCurrApps(data);
    } catch (error) {
      console.error("Error fetching applications ([id].tsx): ", error);
    }
  };

  // get all the shortlisted applications for the venue
  const [shortListItems, setShortList] = useState<Application[]>(currApps.filter(
    (app: Application) => app.rank));

  // get the unavailable times for this venue
  const [blocked, setBlocked] = useState<Unavailable[]>(allBlocked.filter(
    (b: Unavailable) => (b.venueID === Number(id) && (b.date < Date()))));

  // update blocked times when changed
  useEffect(() => {
    setBlocked(allBlocked.filter((b: Unavailable) => (b.venueID === Number(id) && (b.date < Date()))));
  }, [allBlocked]);

  // will update the order off the shortlist shown on the screen
  // but, it's not instant, you need to do something else before you see it
    // (e.g. press view venue details)
  // same for shortlisting an event, it will update on page refresh
  useEffect(() => {
    setCurrApps(allApplications.filter((app: Application) => app.venueID === Number(id)));
    setShortList(currApps.filter((app: Application) => app.rank));
  }, [allApplications]);

  // to deal with viewing the details of the venue
  const [popupDet, setPopupDet] = useState<boolean>(false);

  // to deal with the date to show application for
  const [dateStr, setDateStr] = useState<string>("");

  // to block the venue
  const [blockDate, setBlockDate] = useState<string>("");
  const [blockStart, setBlockStart] = useState<string>("");
  const [blockEnd, setBlockEnd] = useState<string>("");

  // to deal with the filtering
  const [filterRep, setFilterRep] = useState<boolean>(false);


  //hirer stuff ------------------------------------------------------------------------------------------------------------
  //hirer hooks
  const [shortlistRank, setShortlistRank] = useState<number>(0);

  if (thisVenue) {
    //hirer stuff ------------------------------------------------------------------------------------------------------------
    //below functions and states are for shortlisting venues, 

    //handler functions for shortlisting venues
    //this is a lot of code try simplify this later
    const shortlistVenue = (venueID: number, indexToInsertAt: number): void => {
      //pass the updated shortlist here
      if (currUser && currUser.shortlistedVenues && currUser.shortlistedVenues.length + 1 > indexToInsertAt) {
        //this array isnt edited its just used so i dont have to write longer lines
        const venueShortlist = currUser.shortlistedVenues;

        let updatedUser = {
          ...currUser,
        }

        if (currUser.shortlistedVenues.length > 4) {
          // alert("You can only have 5 venues shortlisted! Please remove a shortlisted venue to continue.");
          showNotif("You can only have 5 venues shortlisted! Please remove a shortlisted venue to continue.", 'fail');
        }
        else {
          //get the ranking of this venue. shift other venues 1 to the right
          if (venueShortlist.length === 0) {
            updatedUser = {
              ...currUser,
              shortlistedVenues: [venueID]
            }
          }
          else if (venueShortlist.length > 0) {
            let newVenueShortlist: number[] = []; //make new array

            //add all the elements before the inserted venue into the new venue
            for (let i = 0; i < indexToInsertAt; i++) {
              newVenueShortlist.push(venueShortlist[i]);
            }
            newVenueShortlist.push(venueID); //insert the new venue

            //insert the remaining venues from the old venue list
            for (let i = indexToInsertAt; i < venueShortlist.length; i++) {
              newVenueShortlist.push(venueShortlist[i]);
            }

            updatedUser = {
              ...currUser,
              shortlistedVenues: newVenueShortlist
            };
          }
          showNotif("Venue successfully shortlisted.", 'success');
          updateUser(updatedUser);
        }
      }
    }

    const changeRanking = (venueID: number, newRanking: number): void => {
      if (currUser && currUser.shortlistedVenues) {
        const venueShortlist = currUser.shortlistedVenues;

        if (venueShortlist.length > 1 && venueShortlist.length > newRanking) {
          //get array without the element they want to change rnak of
          const oldArray: number[] = venueShortlist.filter((id: number) => (id !== venueID));

          //create the new array
          let newVenueShortlist: number[] = []; //make new array

          //add all the elements before the inserted venue into the new venue
          for (let i = 0; i < newRanking; i++) {
            newVenueShortlist.push(oldArray[i]);
          }
          newVenueShortlist.push(venueID); //insert the new venue

          //insert the remaining venues from the old venue list
          for (let i = newRanking; i < oldArray.length; i++) {
            newVenueShortlist.push(oldArray[i]);
          }

          //create the updated user
          const updatedUser = {
            ...currUser,
            shortlistedVenues: newVenueShortlist,
          }
          showNotif("Venue ranking successfully changed.", 'success');

          //update LS + useState
          updateUser(updatedUser);

        }

      }

    }

    const removeShortlistedVenue = (venueID: number) => {
      //find the index corresponding to the venueID

      if (currUser && currUser.shortlistedVenues) {

        //edit: this fucks up local storage EVEN THO IT LOOKS LIKE IT WORKS RAAAA
        // currUser.shortlistedVenues.splice(index, 1);
        //create a completely new user using old user information
        const updatedUser = {
          ...currUser, //get previous user details
          //create a mnew shortlisted venues
          shortlistedVenues: currUser.shortlistedVenues.filter(
            (id) => (id !== venueID))
        };

        showNotif("Venue removed from shortlist.", 'success');
        //update the user's information
        updateUser(updatedUser);

      }
    }


    return (
      <Main type='venue'>

        <title>{thisVenue.name}</title>

        <Header active="search" />

        <h1 className="text-3xl font-bold p-10 bg-blue-200">{thisVenue.name}</h1>


        {
          (currUser && (currUser.type === "hirer" || 
            (currUser.type === "vendor" && thisVenue.ownerID === currUser.id))) ? (

            // VENDOR VIEW --------------------------------------------------------------------------------------------------
            currUser.type === "vendor" ? (

              <div className="grid grid-cols-[60%_40%] ml-3">

                <main>

                  <Button className="text-black px-5 py-2 my-5 rounded-md font-medium"
                   onClick={() => setPopupDet(true)}
                    text="View Venue Details" onLeft={true}>
                      <img src="../eye.png" className="invert inline mr-2" />
                  </Button>
                  {
                    popupDet &&
                    <Popup onClose={() => setPopupDet(false)}>
                      <div className="h-100 w-9/10">
                        <VenueDetails edit={true} venue={thisVenue}></VenueDetails>
                      </div>
                    </Popup>

                  }

                  <h1 className="text-2xl font-bold mt-2">Applications</h1>

                  <div className="flex justify-between mr-15">
                    <div className="inline flex items-center gap-3">
                      <p className="inline">Showing results for </p>
                      <input type="date" className="inline" value={dateStr}
                       onChange={(e) => setDateStr(e.target.value)} />
                    </div>

                    <div className="inline flex items-center">
                      <input type="checkbox" className="inline mr-2"
                       onChange={() => setFilterRep(!filterRep)} />
                      <p className="inline">Filter by Reputation Score</p>
                    </div>
                  </div>


                  {/* sorting source: https://www.w3schools.com/js/js_array_sort.asp#mark_objects */}
                  <div className="max-h-150 overflow-x-hidden overflow-y-auto">
                    {
                      !filterRep ? (
                        <div>
                          {
                            currApps.filter((app: Application) => app.date === dateStr).length > 0 &&
                            currApps.filter((app: Application) => 
                              app.date === dateStr).map((app: Application) => (
                              <ApplicationsCard app={app} history={false} />
                            ))
                          }
                          {
                            currApps.filter((app: Application) => app.date === dateStr).length === 0 &&
                            <p>
                              <i>No applications found for this date. Please check a different date.</i>
                            </p>
                          }
                        </div>

                      ) : (
                        // SORT BY THE REPUTATION
                        <div>
                          {
                            currApps.filter((app: Application) => app.date === dateStr).length > 0 &&
                            currApps.filter((app: Application) => 
                              app.date === dateStr).sort(function (a : Application, b : Application) {
                              const aRep: number | undefined = allUsers.filter((u: User) => u.id === a.hirerID).at(0)?.reputation;
                              const bRep: number | undefined = allUsers.filter((u: User) => u.id === b.hirerID).at(0)?.reputation;
                              if (aRep && bRep) {
                                if (aRep > bRep) { return -1; }
                                if (aRep < bRep) { return 1; }
                              }
                              return 0;
                            }).map((app: Application) => (
                              <ApplicationsCard app={app} history={false} />
                            ))
                          }
                          {
                            currApps.filter((app: Application) => app.date === dateStr).length === 0 &&
                            <p>
                              <i>No applications found for this date. Please check a different date.</i>
                            </p>
                          }
                        </div>
                      )

                    }
                  </div>

                  <hr className="m-5 text-gray-200"></hr>

                  <h1 className="text-2xl font-bold mt-2">History</h1>
                  <div className="max-h-150 overflow-x-hidden overflow-y-auto">
                    {
                      currApps.filter((app: Application) => app.isAccepted && 
                      (app.date < Date() || app.date === Date())).length > 0 &&
                      currApps.filter((app: Application) => app.isAccepted && 
                      (app.date < Date() || app.date === Date())).map((app: Application) => (
                        <ApplicationsCard app={app} history={true} />
                      ))
                    }
                    {
                      currApps.filter((app: Application) => app.isAccepted && 
                      (app.date < Date() || app.date === Date())).length === 0 &&
                      <p><i>No previous hiring history.</i></p>
                    }
                  </div>

                </main>


                <Sidebar type='vendorVenue'>
                    <h2 className="text-2xl font-bold">Shortlisted Applications</h2>
                    <div className="flex items-center gap-3 mt-3">
                      <p className="inline">Showing results for </p>
                      <input type="date" className="inline" value={dateStr}
                       onChange={(e) => setDateStr(e.target.value)} />
                    </div>
                    <div className="">
                      {
                        dateStr !== "" ? (
                          <div>
                            <p>
                              <i>To reflect the changes, please press a button (e.g. filter by reputation) or refresh the browser</i>
                            </p>

                            {
                              shortListItems.length > 0 &&
                              shortListItems.filter((app: Application) => 
                                app.date === dateStr).sort(function (a : Application, b : Application) {
                                const aRank: number | undefined = shortListItems.filter(
                                  (i: Application) => i.id === a.id).at(0)?.rank;
                                const bRank: number | undefined = shortListItems.filter(
                                  (i: Application) => i.id === b.id).at(0)?.rank;
                                if (aRank && bRank) {
                                  if (aRank < bRank) { return -1; }
                                  if (aRank > bRank) { return 1; }
                                }
                                return 0;
                              }).map((app: Application) => (
                                <div key={app.id} className="mt-5 grid grid-cols-[3fr_3.5fr]">
                                  <div>
                                    <label>
                                      <input className="inline w-15 mr-2" type="number" defaultValue={app.rank}
                                       onChange={(e) => shortlist(app.id, Number(e.target.value))} />
                                      {app.eventName}
                                    </label>
                                  </div>
                                  {
                                    app.isAccepted ? (
                                      <div>
                                        <button className="bg-gray-500 text-white font-medium hover:bg-gray-600 px-3 py-2 rounded-lg"
                                         onClick={() => setBooking(app.id, undefined)}>
                                          <img className="inline invert mr-2" src="../edit_square.png" />Unapprove
                                        </button>
                                      </div>

                                    ) : (
                                      <div>
                                        {
                                          app.isAccepted === false ? (
                                            <div>
                                              <button className="bg-gray-500 text-white font-medium hover:bg-gray-600 px-3 py-2 rounded-lg"
                                               onClick={() => setBooking(app.id, undefined)}>
                                                <img className="inline invert mr-2" src="../edit_square.png" />Unreject
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="grid grid-cols-2">
                                              <div>
                                                <button className="bg-green-500 text-white font-medium hover:bg-green-600 px-3 py-2 rounded-lg"
                                                 onClick={() => setBooking(app.id, true)}>
                                                  <img className="inline invert mr-2" src="../tick.png" />Approve
                                                </button>
                                              </div>
                                              <div>
                                                <button className="bg-red-500 text-white font-medium hover:bg-red-600 px-3 py-2 rounded-lg"
                                                 onClick={() => setBooking(app.id, false)}>
                                                  <img className="inline invert mr-2" src="../deleteBin.png" />Reject
                                                </button>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>

                                    )
                                  }

                                </div>
                              ))
                            }
                            {
                              shortListItems.length === 0 &&
                              <p><i>No data found. Start shortlisting today!</i></p>
                            }
                          </div>

                        ) : (
                          <p><i>Please select a date to get started.</i></p>
                        )
                      }
                    </div>

                    <hr className="my-10 text-gray-200"></hr>

                    <h2 className="text-2xl font-bold">Unavailability</h2>
                    <div className="mt-3">
                      <div className="max-h-50 overflow-y-scroll mb-3">
                        {
                          blocked.length > 0 &&
                          blocked.sort(function (a, b) {
                            const aDate: string | undefined = blocked.filter((u: Unavailable) =>
                               u.id === a.id).at(0)?.date;
                            const bDate: string | undefined = blocked.filter((u: Unavailable) =>
                               u.id === b.id).at(0)?.date;
                            if (aDate && bDate) {
                              if (aDate > bDate) {
                                return -1;
                              } else {
                                return 1;
                              }
                            }
                            return 0;
                          }).map((u: Unavailable) => (
                            <div key={u.id}>
                              <Card heading="">
                                <div className="grid grid-cols-2">
                                  <div>
                                    <h3 className="text-lg">{new Date(u.date).toDateString()}</h3>
                                    <p>{u.startTime} to {u.endTime}</p>
                                  </div>
                                  <Button className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
                                   onClick={() => unblockVenue(u.id)} text="Unblock"></Button>
                                </div>
                              </Card>
                            </div>
                          ))
                        }
                        {
                          blocked.length === 0 &&
                          <p><i>Completely available!</i></p>
                        }
                      </div>

                    </div>
                    <div className="grid grid-cols-[2fr_1.5fr_1.5fr]">
                      <label>Date
                        <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
                      </label>
                      <label>Start
                        <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
                      </label>
                      <label>End
                        <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
                      </label>
                    </div>
                    <Button className="px-5 py-2 my-2 rounded-xl" onClick={() => blockVenue(Number(id), blockDate, blockStart, blockEnd)}
                     text="Block Venue" />

                    <hr className="my-10 text-gray-200"></hr>

                    <h2 className="text-2xl font-bold">Analytics</h2>
                    {
                      currApps.length > 0 &&
                      <div>
                        <h3>Most Chosen Applicant</h3>
                        <Analytics type="mostAccepted" currApps={currApps} />

                        <hr className="my-10 text-gray-200" />

                        <h3>Most Rejected Applicant</h3>
                        <Analytics type="mostRejected" currApps={currApps} />

                        <hr className="my-10 text-gray-200" />

                        <h3>Least Shortlisted Applicant</h3>
                        <Analytics type="leastShortlisted" currApps={currApps} />
                      </div>
                    }
                    {
                      currApps.length === 0 &&
                      <p><i>No applications for this venue. Unable to generate analytics.</i></p>
                    }

                </Sidebar>
              </div>

            ) : (
              // hirer view
              <div className="flex">
                <main className="w-[80%] min-w-0 " >
                  <Card heading={"Venue Description"}>
                    <p>{thisVenue.description}</p>
                  </Card>

                  <VenueDetails edit={false} venue={thisVenue} />

                </main>


                <Sidebar type="hirerVenue">
                  <div className="flex flex-col items-center">
                    <h3>Apply to Hire this Venue</h3>
                    <Button onClick={() => router.push(`${id}/submitApplication`)} text="Apply Here" />
                  </div> <br />


                  {/* shotlist functionality */}
                  <div className="flex flex-col items-center">
                    <h3>Shortlist this Venue</h3>
                    <form className="flex flex-col w-[100%] items-center bg-white border border-[#e0e0e0] rounded-md m-2 p-2">

                      {/* check if this venue is alr shortlisted. if yes, show option to change ranking/delete */}
                      {/* if not shortlisted, then rank */}
                      <div className="flex flex-col">
                        <label>{currUser.shortlistedVenues?.includes(thisVenue.id) ?
                          (<p>Change current ranking:</p>) : (<p>Assign a ranking:</p>)}</label>
                        <select className="border border-[#e0e0e0] rounded-md m-2 p-2"
                          onChange={(e) => { setShortlistRank(parseInt(e.target.value)) }}>
                          <option value={0}>1</option>
                          <option value={1}>2</option>
                          <option value={2}>3</option>
                          <option value={3}>4</option>
                          <option value={4}>5</option>
                        </select>
                      </div>
                      {
                        currUser.shortlistedVenues?.includes(thisVenue.id) ?
                          // if thisVenue is in the shortlistedVenues, show option to remove
                          (<div className="flex flex-col items-center">
                            <Button text="Change Ranking" onClick={() => { changeRanking(thisVenue.id, shortlistRank) }} />

                            <Button text="Remove from Shortlist" onClick={() => { removeShortlistedVenue(thisVenue.id) }} />

                          </div>)
                          :
                          // if thisVenue isn't in shortlist, show option to add
                          (<div className="flex flex-col items-center">
                            <Button text="Shortlist" onClick={() => { shortlistVenue(thisVenue.id, shortlistRank) }} />
                          </div>)
                      }

                    </form>
                  </div>

                  <div className="mb-3">
                    <h3>Unavailability</h3>
                    {
                      blocked.length > 0 &&
                      blocked.filter((u: Unavailable) => u.date < Date()).sort(function (a : Unavailable, b : Unavailable) {
                        const aDate: string | undefined = blocked.filter((u: Unavailable) => u.id === a.id).at(0)?.date;
                        const bDate: string | undefined = blocked.filter((u: Unavailable) => u.id === b.id).at(0)?.date;
                        if (aDate && bDate) {
                          if (aDate < bDate) {
                            return 1;
                          } else {
                            return -1;
                          }
                        }
                        return 0;
                      }).map((b: Unavailable) => (
                        <div key={b.id}>
                          <Card heading={new Date(b.date).toDateString()}>
                            <p>{b.startTime} to {b.endTime}</p>
                          </Card>
                        </div>
                      ))
                    }
                    {
                      blocked.length === 0 &&
                      <p><i>Good news! We're fully available to host your incredible event!</i></p>
                    }
                  </div>

                  {/* </aside> */}
                </Sidebar>
              </div>
            )

          ) : (

            // a general view of each venue
            <div className="grid grid-cols-[70%_30%]">
              <div>
                <Card heading={"Venue Description"} style={"bg-sky-50"}>
                  <p>{thisVenue.description.trim()}</p>
                </Card>

                <hr className="m-5 text-gray-200"></hr>

                <VenueDetails edit={false} venue={thisVenue} />
              </div>
              <Sidebar type="hirerVenue">
                  <h2 className="font-bold">Unavailability</h2>
                  <div className="mt-3">
                    <div className="mb-3">
                      {
                        blocked.length > 0 &&
                        blocked.filter((u: Unavailable) => u.date < Date()).sort(function (a : Unavailable, b : Unavailable) {
                          const aDate: string | undefined = blocked.filter((u: Unavailable) => u.id === a.id).at(0)?.date;
                          const bDate: string | undefined = blocked.filter((u: Unavailable) => u.id === b.id).at(0)?.date;
                          if (aDate && bDate) {
                            if (aDate < bDate) {
                              return 1;
                            } else {
                              return -1;
                            }
                          }
                          return 0;
                        }).map((b: Unavailable) => (
                          <div key={b.id}>
                            <Card heading={new Date(b.date).toDateString()}>
                              <p>{b.startTime} to {b.endTime}</p>
                            </Card>
                          </div>
                        ))
                      }
                      {
                        blocked.length === 0 &&
                        <p><i>Good news! We're fully available to host your next incredible event!</i></p>
                      }
                    </div>
                  </div>
              </Sidebar>
            </div>

          )
        }


      </Main>
    );
  } else {

    // if this venue does not exist
    return (
      <h1></h1>
    )
  }

}