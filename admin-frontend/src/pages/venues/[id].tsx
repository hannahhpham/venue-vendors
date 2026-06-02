import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User, Venue } from "../../types/types"
import { useAuth } from "../../context/AuthContext";
import { useNotif } from '../../context/NotifContext'
//import {useVenues} from ''
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import Card from "../../components/Card";
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar'
import { VenueService } from "../../services/api";
import * as utils from "../../utils/utils";


export default function VenuePage() {
  const router = useRouter();
  //const { allVenues } = useVenues();
  const { currUser } = useAuth();

  const { showNotif } = useNotif();
  // this is a string - the venue id
  const { id } = router.query;

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
    }
  }, [id]);

  const fetchVenue = async () => {
    try {
      const data = await VenueService.getVenue(id as string);
      if (data) {
        setThisVenue(data);
      }

    } catch (error) {
      console.error("Error fetching venue ([id].tsx): ", error);
    }
  };

  // to deal with viewing the details of the venue
  const [popupDet, setPopupDet] = useState<boolean>(false);

  
  if (thisVenue) {


    return (
        <div>

            <title>{thisVenue.name}</title>

            <Header active="none" />

            <h1 className="text-3xl font-bold p-10 bg-blue-200">{thisVenue.name}</h1>
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
