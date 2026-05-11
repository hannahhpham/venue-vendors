import Header from "../components/Header";
import Card from "../components/Card";
import Carousel from "../components/Carousel";
import ApplicationCarousel from "../components/ApplicationCarousel";
import Button from "../components/Button";
import Stars from '../components/Stars';
import UserDetails from '../components/UserDetails';
import Sidebar from '../components/Sidebar';
import Main from '../components/Main';
import Documents from '../components/Documents'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext";
import { useVenues } from "../context/VenueContext";
import { Application } from '../types/apply';
import { Venue } from "../types/venues";
import {useApplications} from '../context/ApplyContext'
import { shortlistedVenueAPI } from '../services/api'
import { venueAPI } from "../services/api";
import * as utils from '../utils/utils';

export default function Dashboard() {
  const router = useRouter();
  const { currUser, shortlistedVenues, venueApplications, vendorVenues, fetchVendorVenues } = useAuth();
  // const {allApplications} = useApplications();
  const { allVenues, removeVenue } = useVenues();

  const deleteVenue = (id : number) => {
    removeVenue(id);

    // update the vendor's list of venues
    // performed here because useAuth must be used within an AuthProvider
    fetchVendorVenues();
  }

  if (currUser) {
    return (
      <Main type="dashboard">

        <title>Dashboard</title>

        <Header active={"dashboard"} />

        <div className="p-10 bg-sky-100">
          <h1 className="text-3xl">Welcome back, {currUser.firstName}</h1>
          <p>You have successfully logged in</p>
        </div>

        {currUser.type === "vendor" ?

          // WHEN THE USER IS A VENDOR
          (
            <div className="grid grid-cols-[80%_20%]">

              <div className="pl-5 pt-5">
                <section className="m-3">
                  <h2 className="text-2xl font-bold">My Venues</h2>
                  <div>
                    {
                      vendorVenues.map((venue: Venue) =>
                          <div key={venue.id}>
                            <Card heading={venue.name}>
                              <h3 className="italic text-base font-medium">{venue.address}</h3>
                              <p>{venue.description}</p>
                              <div className="flex gap-5 place-content-center">
                                <Button className="px-10 p-3 mt-5 bg-green-500 rounded-md font-medium hover:bg-green-600"
                                  onClick={() => router.push(`/venues/${venue.id}`)} text="Manage">
                                  <img src="arrowForwardFull.png" className="invert inline ml-2"></img></Button>
                                <Button className="px-10 p-3 mt-5 bg-red-500 rounded-md font-medium hover:bg-red-600"
                                  onClick={() => deleteVenue(venue.id)} text="Delete" onLeft={true}>
                                  <img src="deleteBin.png" className="invert inline mr-2"></img></Button>
                              </div>
                            </Card>
                          </div>
                        )
                    }
                  </div>

                  <Button className="px-10 p-3 mt-5 rounded-md font-medium"
                    onClick={() => router.push("/addVenue")} text="Add Venue" onLeft={true}>
                    <img src="add.png" className="invert inline mr-2"></img>
                  </Button>

                </section>
              </div>


              <Sidebar type='dashboard'>
                <aside className="m-3">
                  <UserDetails edit={true} />
                </aside>
              </Sidebar>
            </div>
          )

          :
          // WHEN THE USER IS A HIRER
          (
            <div className="flex">

              <main className="w-[80%] min-w-0 ">

                <div className="ml-5">
                  <h2 className="p-2">Recommended Venues</h2>
                  {/* error with api: api access takes longer -> brief moment where getting allVenues hasn;t finished -> error. */}
                  {/* fix: add a fallback option via ??. [] is what is used if allVenues isn't ready yet */}
                  <Carousel type="all" ranked={false} carouselItems={allVenues} />
                </div> <br />


                <div className="ml-5">
                  <h2 className="p-2">My Shortlisted Venues</h2>
                  <Carousel type="shortlistedVenues" ranked={true}

                    //this uses the shorlistedVenues which are of type Venue
                    carouselItems={shortlistedVenues} />
                </div><br />

                <div className="ml-5">
                  <h2 className='p-2'>My Applications</h2>
                  {/* this carousel only shows applications that were rejected, submitted,
                   or accepted BUT occurring in the future */}
                      <ApplicationCarousel type='applications'
                    carouselItems={venueApplications.filter((app: Application) =>
                      app.date > utils.getCurrDate() || app.isAccepted === false) ?? []} />
                </div><br />

                <div className="ml-5">
                  <h2 className="p-2">Venue Hire History</h2>

                  {/* this carousel shows applications that were approved AND in the past */}
                  {<ApplicationCarousel type='pastVenues' carouselItems={
                    venueApplications.filter((app: Application) =>
                      app.isAccepted === true && app.date < utils.getCurrDate())
                  } />}
                </div><br /><br />

              </main>


              <Sidebar type='dashboard'>
                <h3>My Star Rating</h3>
                <Stars type="hirerRating" /> <br />

                <h3>My Credibility Score</h3>
                <Stars type="hirerCredibility" /> <br />

                <UserDetails edit={true} />

                <br />

                <Documents edit={true} />

                <br />
              </Sidebar>
            </div>

          )
        }


      </Main>

    );

  }

}
