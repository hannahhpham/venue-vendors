import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import Carousel from "../components/Carousel";
import Main from '../components/Main';
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext";
import {useVenues} from '../context/VenueContext'
import {Venue} from '../types/venues'


export default function Home() {

  const router = useRouter();
  const { currUser, shortlistedVenues, vendorVenues } = useAuth();
  const {allVenues} = useVenues();

  //this is ok. authcontext doesnt get currUser immediately (cuz async? but index does)
  //console.log("currUser in index.js is ", currUser);

  const onClickDash = (): void => {
    router.push("/dashboard");
  }

  return (
    <div>
      <title>Home</title>

      <Header active={"none"} />


      <Main type="wholePage">
        <div className="p-20 m-auto text-center bg-blue-50">
          <h1 className="text-4xl font-bold">Welcome to Venue Vendors</h1>
          <h2>Your one stop shop for all things events!</h2>
          <br />
          {
            currUser ?
              (<Button text="Search venues now!" onClick={() => { router.push('./search') }} />)
              :
              (<Button text="Get Started Now!" onClick={() => { router.push('/signup') }} />)
          }
        </div>

        {
          currUser && currUser.type === "vendor" ? (
            <div className="m-3">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold inline">My Venues</h2>
                <Button className="inline px-5" onClick={onClickDash} text="Go to Dashboard">
                  <img src="arrowForwardFull.png" className="invert inline ml-2" />
                </Button>
              </div>
              {
                // TODO: double check if there is a double error message
                <Carousel type="shortlistedVenues" ranked={false}
                  carouselItems={vendorVenues} />
                // allVenues.filter((venue: Venue) => venue.ownerID === currUser.id).length > 0 &&
                // <Carousel type="shortlistedVenues" ranked={false} 
                // carouselItems = {allVenues.filter((venue: Venue) => venue.ownerID === currUser.id)} />
              }
              {
                vendorVenues.length === 0 &&
                <p><i>No venues found. Add your venues today by heading over to your dashboard.</i></p>
              }
              <hr className="mt-5 text-gray-200"></hr>
            </div>
          ) : (<p></p>)

        }

        {
          currUser && currUser.type === "hirer" ? (
            <div className="m-3 ">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold inline">My Shortlisted Venues</h2>
                <Button className="px-5" onClick={onClickDash} text="Go to Dashboard">
                  <img src="arrowForwardFull.png" className="invert inline ml-2" />
                </Button>
              </div>
              <Carousel type="shortlistedVenues" ranked={true}
                carouselItems={shortlistedVenues.map((venueID: number) => allVenues.find((venue: Venue) => venue.id === venueID)).filter((venue) => venue !== undefined)}
              />
              <hr className="mt-5 text-gray-200"></hr>
            </div>
          ) : (<p></p>)
        }

        <div className="grid grid-cols-2">
          <Card heading="Who are we?" style="bg-sky-100">
            <p>
              A group of venue owners and event planners.<br></br>
              We want to make sure that your event goes smoothly by helping you get a high quality venue.
              <br></br>
              Equally, we want to make sure that vendors' minds are at ease when
              allowing people to use their venue by pairing them with trustworthy
              customers.
              <br></br>
              It's a win win. So what are you waiting for? Get started today!
            </p>
          </Card>
          <Card heading="What do we do?" style="text-white bg-blue-900">
            <ul className="list-disc list-inside text-left m-3">
              <li><strong>Connect</strong> event organisers with venue owners</li>
              <li><strong>Streamline</strong> the hirirng process</li>
              <li>Allow for <strong>easy access</strong> to applications</li>
              <li>Help vendors shortlist hirers they can <strong>trust</strong></li>
              <li>Help hirers secure <strong>high quality</strong> venues</li>
            </ul>
          </Card>
        </div>

        <div className="p-5 m-auto text-center bg-blue-50">
          <br />
          <h2>So what are you waiting for?</h2>
          <br></br>
          {currUser ?
            (<Button text="Get Started Now!" onClick={onClickDash} />)
            :
            (<Button text="Get Started Now!" onClick={() => { router.push('/signup') }} />)
          }
          <br />
        </div>

      </Main>

    </div>

  );
}
