import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { User } from "../../types/users"
import { Venue, shortlistedVenueType } from "../../types/venues"
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
import { applicationAPI, venueAPI, shortlistedVenueAPI } from "../../services/api";
import * as utils from "../../utils/utils";
import HistBookings from "../../components/HistBookings";
import BlockedPeriods from "../../components/BlockedPeriods";


export default function VenuePage() {
  const router = useRouter();
  //const { allVenues } = useVenues();
  const { currUser, allUsers, getRepRating, shortlistedVenues, getShortlistedVenues } = useAuth();
  const { allApplications, setBooking, shortlist } = useApplications();
  const { allBlocked, blockVenue, unblockVenue } = useUnavail();
  const { showNotif } = useNotif();
  // this is a string - the venue id
  const { id } = router.query;

  // when this prints there are deadass like 10 million console logs. need to figure out why
  // console.log("shortlistedVenues is " + JSON.stringify(shortlistedVenues));

  // the following code is based on [id].tsx, profile, frontend, Lecture 9 Example 1
  const [thisVenue, setThisVenue] = useState<Venue | undefined>(undefined);

  useEffect(() => {
    try {
      if (id) {
        fetchVenue();
        fetchCurrApps();
      }
    }
    catch {
      // to also allow for ppl who aren't logged in
      router.push('/');
    }

  }, [id]);

  const fetchVenue = async () => {
    try {
      const data = await venueAPI.getVenue(id as string);
      setThisVenue(data);
    } catch (error) {
      console.error("Error fetching venue ([id].tsx): ", error);
      router.push('/');
    }
  };

  // get all the applications submitted for this venue
  const [currApps, setCurrApps] = useState<Application[]>([]);

  const fetchCurrApps = async () => {
    try {
      const data = await applicationAPI.getVenueApps(Number(id));
      setCurrApps(data);
      setShortList(currApps.filter((app: Application) => app.rank !== -1));
    } catch (error) {
      console.error("Error fetching applications ([id].tsx): ", error);
    }
  };

  // this semi works
  // it doesn't show it in the correct order, but you can see some change
  // look at 10/4/27
  // const sort = () : Application[] => {
  //   const sorted = useMemo(() => {
  //       [...currApps].sort((a, b) => {
  //       const aRep = allUsers.find(u => u.id === a.hirerID)?.reputation;
  //       const bRep = allUsers.find(u => u.id === b.hirerID)?.reputation;
  //       if (aRep && bRep) {
  //         if (aRep < bRep) {
  //           return -1;
  //         } else if (aRep > bRep) {
  //           return 1;
  //         } else {
  //           return 0;
  //         }
  //       } else {
  //         return 0;
  //       }
  //     })
  //   }, []);
  //   return sorted ?? [];
  // }

  // get all the shortlisted applications for the venue
  const [shortListItems, setShortList] = useState<Application[]>(currApps.filter((app: Application) =>
    app.rank !== -1));

  // get the unavailable times for this venue
  // CHANGE THIS
  const [blocked, setBlocked] = useState<Unavailable[]>(allBlocked.filter((b: Unavailable) =>
    b.venueID === Number(id) && !utils.compareTime(b.date)));

  // update blocked times when changed
  useEffect(() => {
    setBlocked(allBlocked.filter((b: Unavailable) =>
      b.venueID === Number(id) && !utils.compareTime(b.date)));
  }, [allBlocked]);

  // to deal with viewing the details of the venue
  const [popupDet, setPopupDet] = useState<boolean>(false);

  // to deal with the date to show application for
  const [dateStr, setDateStr] = useState<string>("");

  // will update the order off the shortlist shown on the screen
  // but, it's not instant, you need to do something else before you see it
  // (e.g. press view venue details)
  // same for shortlisting an event, it will update on page refresh
  useEffect(() => {
    // have a look at this
    fetchCurrApps();
    setShortList(currApps.filter((app: Application) => app.rank !== -1));
    //console.log("shortlisted apps: " + JSON.stringify(shortListItems));
  }, [allApplications]);

  // to block the venue
  const [blockDate, setBlockDate] = useState<string>("");
  const [blockStart, setBlockStart] = useState<string>("");
  const [blockEnd, setBlockEnd] = useState<string>("");

  // to deal with the filtering
  const [filterRep, setFilterRep] = useState<boolean>(false);

  const [today, setToday] = useState<Application[]>([]);


  const sorted = useMemo(() => {
    return [...currApps].sort((a, b) => {
      const aRep = allUsers.find(u => u.id === a.hirerID)?.reputation;
      const bRep = allUsers.find(u => u.id === b.hirerID)?.reputation;
      //console.log(aRep + " " + bRep);
      if (aRep && bRep) {
        if (aRep < bRep) {
          console.log("im 1");
          return 1;
        } else if (aRep > bRep) {
          console.log("im -1");
          return -1;
        } else {
          console.log("im 0");
          return 0;
        }
      }
      console.log("im 0 bc a and b don't exist");
        return 0;
    });
  }, [filterRep]);


  //hirer stuff ------------------------------------------------------------------------------------------------------------
  //hirer hooks
  const [shortlistRank, setShortlistRank] = useState<number>(1);

  if (thisVenue) {
    //hirer stuff ------------------------------------------------------------------------------------------------------------
    //below functions and states are for shortlisting venues, 

    //handler functions for shortlisting venues
    //this is a lot of code try simplify this later
    const shortlistVenue = async (venueID: number, rankToInsertAt: number): Promise<void> => {
      if (currUser) {

        if (shortlistedVenues.length == 5) { //if shortlist is full
          showNotif("Your shortlist is full! Please remove shortlisted venues to add more.", "fail");
        }
        else {
          if (shortlistedVenues.length < rankToInsertAt) { //shortlisting at end of list. CHECK

            showNotif("You have shortlisted this venue.", "success");
            await shortlistedVenueAPI.shortlistVenue(currUser.id, venueID, rankToInsertAt);
            await getShortlistedVenues(); //update state
            //console.log(result);
          }
          else { //inserting in the middle of the list
            showNotif("You have shortlisted this venue.", "success");

            let shortlistItem: shortlistedVenueType;

            //change ranks of the venues ranking after the added venue
            for (let i = shortlistedVenues.length; i >= rankToInsertAt; i--) {

              shortlistItem = await shortlistedVenueAPI.getShortlistByRank(currUser.id, i);

              await shortlistedVenueAPI.updateRank(shortlistItem.hirerID, shortlistItem.venueID, shortlistItem.rank + 1);
            }

            //add venue and update state
            await shortlistedVenueAPI.shortlistVenue(currUser.id, venueID, rankToInsertAt);
            await getShortlistedVenues(); //update state
          }
        }
      }

    }

    const changeRanking = async (venueID: number, newRanking: number): Promise<void> => {

      //get the original rank of the venue
      const oldRanking = shortlistedVenues.indexOf(venueID) + 1;

      //move this venue down. shift venues between old rank and new rank up by 1
      if (newRanking > oldRanking && currUser) {
        //find max - the new ranking, or number of shortlisted venues
        let min = Math.min(newRanking, shortlistedVenues.length);
        for (let i = oldRanking + 1; i <= min; i++) {
          await shortlistedVenueAPI.updateRank(currUser.id, shortlistedVenues[i - 1], i - 1);

        }
      }
      //move this venue up. shift venues between this and newranking down by 1
      else if (newRanking < oldRanking && currUser) {
        for (let i = newRanking; i < oldRanking; i++) {
          await shortlistedVenueAPI.updateRank(currUser.id, shortlistedVenues[i - 1], i + 1);
        }

      }
      //if equal then do nothing #lol

      //change venue rank and update state
      if (currUser) {
        await shortlistedVenueAPI.updateRank(currUser.id, venueID, newRanking);
        showNotif("Venue ranking successfully updated", "success");
      }
      await getShortlistedVenues(); //update state
    }





    const removeShortlistedVenue = async (venueID: number) => {
      //find the index corresponding to the venueID

      if (currUser) {//delete and shift every venue's rank under this venue up
        let removedVenuePosition: number = 0;

        for (let i = 0; i < shortlistedVenues.length; i++) {
          if (shortlistedVenues[i] == venueID) {
            removedVenuePosition = i; //this is the index which every venue after should be updated
          }
        }

        //for every venue after the removed venue, decrease its rank by 1
        for (let i = removedVenuePosition + 1; i < shortlistedVenues.length; i++) {
          await shortlistedVenueAPI.updateRank(currUser.id, shortlistedVenues[i], i);
        }

        await shortlistedVenueAPI.deleteShortlist(currUser.id, venueID);
        //so we update the shortlisted venues, which is scheduled for next render. need useeffect
        await getShortlistedVenues();

        showNotif("Venue successfully removed from shortlist.", "success");
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

            // VENDOR Owner VIEW --------------------------------------------------------------------------------------------------
            currUser.type === "vendor" ? (

              <div className="grid grid-cols-[60%_40%] ml-3">

                <main>

                  <h1 className="text-2xl font-bold mt-2">Upcoming Applications</h1>
                  <div className="max-h-50 overflow-x-hidden overflow-y-auto">
                  {
                    currApps.filter((app: Application) => !utils.compareTime(app.date)).length > 0 &&
                    currApps.filter((app: Application) =>
                      !utils.compareTime(app.date)).map((app: Application) => (
                        <div key={app.id}>
                          <ApplicationsCard app={app} history={false} />
                        </div>
                      ))
                  }
                  {
                    currApps.filter((app: Application) => !utils.compareTime(app.date)).length === 0 &&
                    <p>No new applications found.</p>
                  }
                </div>

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
                                <div key={app.id}>
                                  <ApplicationsCard app={app} history={false} />
                                </div>
                              ))
                          }
                        </div>

                      ) : (
                        // SORT BY THE REPUTATION
                        <div>
                          {
                            currApps.filter((app: Application) => app.date === dateStr).length > 0 &&
                            sorted.map((app: Application) => (
                              <div key={app.id}>
                                <ApplicationsCard app={app} history={false} />
                              </div>
                            ))
                          }
                        </div>
                      )

                    }
                  </div>

                  <hr className="m-5 text-gray-200"></hr>

                  <HistBookings currApps={currApps} />

                </main>


                <Sidebar type='vendorVenue'>
                  <Button className="text-black px-5 py-2 my-5 rounded-md font-medium"
                    onClick={() => setPopupDet(true)}
                    text="View Venue Details" onLeft={true}>
                    <img src="../eye.png" className="invert inline mr-2" />
                  </Button>
                  {
                    popupDet &&
                    <Popup onClose={() => setPopupDet(false)}>
                      <div className="h-100 w-9/10">
                        <VenueDetails edit={true} venue={thisVenue} onUpdate={fetchVenue}></VenueDetails>
                      </div>
                    </Popup>
                  }

                  <hr className="my-3 text-gray-200"></hr>


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
                            <i>To reflect the changes, please change the date and return to this date</i>
                          </p>

                          {
                            shortListItems.length > 0 &&
                            shortListItems.filter((app: Application) =>
                              app.date === dateStr).sort(function (a: Application, b: Application) {
                                const aRank: number | undefined = shortListItems.filter(
                                  (i: Application) => i.id === a.id).at(0)?.rank;
                                const bRank: number | undefined = shortListItems.filter(
                                  (i: Application) => i.id === b.id).at(0)?.rank;
                                if (aRank && bRank) {
                                  if (aRank < bRank) {
                                    return -1;
                                  } else {
                                    return 1;
                                  }
                                } else {
                                  return 0;
                                }
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

                  <BlockedPeriods venueID={Number(id)} view="vendor" />

                  <hr className="my-10 text-gray-200"></hr>

                  <h2 className="text-2xl font-bold">Analytics</h2>
                  {
                    currApps.length > 0 &&
                    <div>
                      <h3>Most Chosen Applicant</h3>
                      <Analytics type="mostAccepted" currApps={currApps} />
                      <hr />
                      <Analytics type="activeHirers" currApps={currApps} />
                      <hr />
                      <Analytics type="utilisation" currApps={currApps} />
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
                    <div className="flex flex-col w-[100%] items-center bg-white border border-[#e0e0e0] rounded-md m-2 p-2">

                      {/* check if this venue is alr shortlisted. if yes, show option to change ranking/delete */}
                      {/* if not shortlisted, then rank */}
                      <div className="flex flex-col">
                        <label>{shortlistedVenues.includes(thisVenue.id) ?
                          (<p>Change current ranking:</p>) : (<p>Assign a ranking:</p>)}</label>
                        <select className="border border-[#e0e0e0] rounded-md m-2 p-2"
                          onChange={(e) => { setShortlistRank(parseInt(e.target.value)) }}>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                      </div>
                      {
                        shortlistedVenues.includes(thisVenue.id) ?
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

                    </div>
                  </div>

                  <div className="mb-3">
                    <BlockedPeriods venueID={Number(id)} view="other" />
                  </div>

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
                <div className="mt-3">
                  <BlockedPeriods venueID={Number(id)} view="other" />
                </div>
              </Sidebar>
            </div>

          )
        }


      </Main>
    );
  } else {

    // while this page is loading due to async functions
    return (
      <div>
        <title>Loading...</title>

        <Header active="search" />

        <h1></h1>
      </div>
    )
  }

}