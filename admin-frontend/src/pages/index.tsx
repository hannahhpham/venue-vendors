import {VenueService} from '../services/api'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'
import { useRouter } from 'next/router';
import {useAuth} from '../context/AuthContext'


export default function Home() {
  const router = useRouter();
  const {currUser} = useAuth();

  return (
    <div>
      <Header active="none"/>

      <div className="p-20 m-auto text-center bg-blue-50">
          <h1 className="text-4xl font-bold">Welcome to Venue Vendors Administration</h1>
          <h2>Your one-stop shop to manage all venues for the Venue Vendors website.</h2>
          <br />
          {
            currUser ?
              (<Button text="Manage venues" onClick={() => { router.push('./dashboard') }} />)
              :
              (<Button text="Login" onClick={() => { router.push('/login') }} />)
          }
        </div>

        <div className="grid grid-cols-2">
          <Card heading="What is this website for?" style="bg-sky-100">
            <p>
              Venue Vendors Administration is a platform for administrators of the Venue Vendors website 
              to manage all venues. <br/>
              This website provides tools to oversee venue information, manage vendor ownership, control featured venue 
              listings, and monitor platform activity through reporting and analytics. <br/>

            </p>
          </Card>
          <Card heading="How do I use this site?" style="text-white bg-blue-900">
            <p>You must login to access the full functionalities of this website. Upon 
              logging in, you will be able to perform CRUD operations on venues 
              and generate reports. Administrators can also manage featured venues, and assign venues to different vendors.
              Anything to do with the venues of the Venue Vendors website can be managed here!
            </p>            

            {/* <ul className="list-disc list-inside text-left m-3">
              <li>Login with your associated credentials.</li>
              <li>Navigate to the dashboard page.</li>
              <li>Start managing venues!</li>
            </ul> */}
          </Card>
        </div>
    </div>
  )
}
