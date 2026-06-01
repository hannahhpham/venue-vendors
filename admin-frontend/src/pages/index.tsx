import {VenueService} from '../services/api'

export default function Home() {
  return (
    <div>
      <p>admin frontend</p>

      <button onClick={async () => {
        const venues = await VenueService.getAllVenues();
        console.log(venues);
      }}>test api</button>
    </div>
  );
}
