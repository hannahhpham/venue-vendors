import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User, Venue } from "../../types/types"
import { useAuth } from "../../context/AuthContext";
import { useNotif } from '../../context/NotifContext'
import {useVenues} from '../../context/VenueContext'
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import Card from "../../components/Card";
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar'
import { VenueService } from "../../services/api";
import * as utils from "../../utils/utils";
import VenueDetails from '../../components/VenueDetails'


export default function VenuePage() {
  const router = useRouter();
  const { allVenues, editVenue } = useVenues();
  const { currUser, loading } = useAuth();
  const { showNotif } = useNotif();
  const { id } = router.query; // this is a string - the venue id

  // the following code is based on [id].tsx, profile, frontend, Lecture 9 Example 1
  const [thisVenue, setThisVenue] = useState<Venue | undefined>(undefined);

  // the problem with this is that there is a delay in displaying the page
  // in this gap, it shows that "This venue does not exist"
  // hannah: as a (very) temporary fix, i removed the "this venue does not exist" to make it less obvious. same issue still happens
  // we probably need to use a different hook (?)
  // hannahL is it useMemo and useCallback's time to shine....
  useEffect( () => {
    if (id) {
      fetchVenue();
      console.log("venue id is", id);
    }
  }, [id]);

  //check if there's a user. if not, redirect to homepage
  useEffect(() => {
    if (!loading && !currUser) {
      router.replace('/');
    }
  }, [loading, currUser]);

  //this gets the venue data for rendering information
  const fetchVenue = async () => {
    try {
      //call api
      if (id) {
        const venue = await VenueService.getVenue(String(id));
        setThisVenue(venue);
      }
    
    } catch (error) {
      console.error("Error fetching venue ([id].tsx): ", error);
    }
  };
  
  if (thisVenue && currUser) {
    return (
        <div>

            <title>{thisVenue.name}</title>

            <Header active="none" />

            <h1 className="text-3xl font-bold p-10 bg-blue-200">{thisVenue.name}</h1>

            {/* div encompassing main and side divs */}
            <div className="flex">

              {/* main div */}
              <main className="w-[80%] min-w-0 items-center" >
                  <Card heading={"Venue Description"}>
                    <p>{thisVenue.description}</p>
                  </Card>

                  <VenueDetails edit={true} venue={thisVenue} onUpdate={fetchVenue}/>

                </main>
              
              {/* sidebar */}
              <div className="w-[30%] bg-sky-50 min-h-80">
                <Sidebar type="hirerVenue">
                  <h3>Feature this Venue</h3>

                  <br/>

                  <h3>Re-assign this Venue</h3>

                  <br/>

                  <h3>Delete this Venue</h3>

                  <br/>
                </Sidebar>
              </div>
            
            </div>
        </div>

    );
  } else {

    // if this venue does not exist
    return (
      <div>
        <title>Unfound</title>

        <Header active="none" />

        <h1></h1>
      </div>
    )
  }
}
