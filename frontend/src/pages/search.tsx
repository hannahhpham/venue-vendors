import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { useVenues } from "../context/VenueContext";
import { Venue } from "../types/venues";
import Main from '../components/Main'
import Popup from '../components/Popup'
import { venueAPI } from "../services/api";

export default function Search() {
  const router = useRouter();

  const [allVenues, setAllVenues] = useState<Venue[]>([]);

  useEffect(() => {
    venues();
  }, []);
  
  const venues = async () => {
    try {
        const data = await venueAPI.getAllVenues();
        setAllVenues(data);
    } catch (error) {
        console.log("Error getting all venues: ", error);
    }
  };
  //const { allVenues } = useVenues();

  const [search, setSearch] = useState<string>("");
  const [filterPopup, setFilterPopup] = useState<boolean>(false);

  //see if filter/sort has been used
  const [searchFiltered, setSearchFiltered] = useState<boolean>(false);
  const [searchSort, setSearchSort] = useState<boolean>(false);

  //save the search results, so when users click a venue and back their old search is saved
  const [searchResults, setSearchResults] = useState<Venue[]>(allVenues);

  //set filter form useStates
  //sheet spec says recommended suitability?? tf does that mean :')
  const [location, setLocation] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [minRate, setMinRate] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(0);

  //set sorting useState
  const [sortValue, setSortValue] = useState<string>("");

  //function to filter and sort. if not sorting/filtering allVenues array is returned
  //default parameter: https://stackoverflow.com/questions/23314806/setting-default-value-for-typescript-object-passed-as-argument
  //                   can use this to make the parameter whatver the state is rn
  const searchVenues = (currSortValue = sortValue) => {

    //if rate and capacity are 0 then ignore those values
    //if suburb is 'none selected' ignore that
    let result: Venue[] = allVenues;

    if (searchFiltered) {
        if (location !== "" ) {
            result = result.filter((venue: Venue) => venue.suburb === location);
        }
    //console.log("min capacity is: " + minCapacity);
    result = result.filter((venue: Venue) => venue.capacity >= (minCapacity || 0));
    result = result.filter((venue: Venue) => venue.capacity <= (maxCapacity || Math.max(...allVenues.map((venue: Venue)=> venue.capacity))));
    result = result.filter((venue: Venue) => venue.rate >= (minRate || 0));
    result = result.filter((venue: Venue) => venue.rate <= (maxRate || Math.max(...allVenues.map((venue: Venue)=> venue.rate)) ));
        
    }

    if (currSortValue === "remove") {
        result = [...result];
    }
    else if (currSortValue === 'rate') {
        result = [...result].sort((a, b) => a.rate - b.rate);
    }
    else if (currSortValue === 'capacity') {
        result = [...result].sort((a, b) => a.capacity - b.capacity);
    }
    else if (currSortValue === 'alphabetical') {
        result = result.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    
    setSearchResults(result);
    //return result;

  }

//when the filter is turned on/off then change the search
  useEffect(() => {
    searchVenues();
  }, [searchFiltered, sortValue, allVenues])

  //show venues as soon as page loads
  useEffect(() => {
    searchVenues();
  }, []);

  return (
    <Main type='wholePage'>
      <title>Search</title>

      <Header active={"search"} />

      <div>

        {/* div encompassing search bar and filtering */}
        <div className="">
            <input type="string" placeholder="Search" className="p-5 mx-auto my-3 bg-white w-19/20 rounded-3xl" value={search} onChange={(e) => setSearch(e.target.value)}></input>
            
            <div className="flex">
                <Button text="Filter" onClick={()=>{setFilterPopup(true)}}/>
                
                {/* idea: make sort just a dropdown instead of a popup */}
                <div className="w-[65px] h-[40px]">
                    <select className="bg-black hover:bg-[#474747] text-white font-bold rounded p-2 m-1 w-full h-full" 
                            value={sortValue}
                            onChange={(e) => {setSortValue(e.target.value)}}>
                        <option hidden>Sort</option>
                        <option value="rate">Rate (asc)</option>
                        <option value="capacity">Capacity (asc)</option>
                        <option value="alphabetical">Alphabetical (asc)</option>
                        <option value="remove">Remove Sort</option>
                    </select> 
                </div>
    
            </div>
            
        </div>

        <div className="grid grid-cols-3 auto-rows-fr">
            {
                search === "" ? (

                    searchResults.length === 0 ? "No venues match your specifications." : (
                        searchResults.map((venue: Venue) =>
                            <div key={venue.id}>
                                <button  onClick={() => router.push(`/venues/${venue.id}`)}>
                                <Card heading={venue.name} style="hover:bg-sky-100">
                                    <h3 className="italic text-base font-medium">{venue.address}</h3>
                                    <p>{venue.description}</p>
                                </Card>
                                </button>
                            </div>
                        )
                    )

                ) 
                : 
                //check if the search comes up empty. if yes, display message and otherwise show contents
                //added in the venue description so that keywords like 'weddings' and 'corporate' show up - this helps fulfill 'recommended suitability'
                (searchResults.filter((v : Venue) => ((v.name.toLowerCase()).includes(search) || (v.suburb.toLowerCase()).includes(search) || v.postcode === Number(search) 
                || v.capacity === Number(search) || v.rate === Number(search) || v.description.includes(search))).length === 0 
                ? 
                    "No venues match your specifications. Please try again. " 
                    : 
                    (searchResults.filter((v : Venue) => ((v.name.toLowerCase()).includes(search) || (v.suburb.toLowerCase()).includes(search) || v.postcode === Number(search) 
                        || v.capacity === Number(search) || v.rate === Number(search) || v.description.includes(search))).map((venue: Venue) =>
                        <div key={venue.id}>
                            <button className="px-5 py-2" onClick={() => router.push(`/venues/${venue.id}`)}>
                            <Card heading={venue.name} style="hover:bg-sky-100">
                                <h3 className="italic text-base font-medium">{venue.address}</h3>
                                <p>{venue.description}</p>
                            </Card>
                            </button>
                        </div>
                    )
                    )

                )
                
            }
        </div>
      </div>

      { filterPopup && 
        <Popup onClose={()=>{setFilterPopup(false)}}>
            <form className="flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
                <h2>Filter Your Search</h2>

                {/* FIX THE STYLING OF THE LABEL ITS NOT ALIGNED TO THE INPUT*/}
                <div className="m-3">  
                        <div className="flex justify-center items-center">
                            <label className="">Capacity</label>
                            <input className="w-[25%] mr-2" type="number" 
                                   onChange={(e)=>setMinCapacity(Number(e.target.value))}
                                   ></input> 
                            <p> to </p>
                            <input className="w-[25%] ml-2" type="number" 
                                   onChange={(e)=>setMaxCapacity(Number(e.target.value))}></input>
                        </div>
                </div>

                {/* FIX THE STYLING OF THE LABEL ITS NOT ALIGNED TO THE INPUT*/}
                <div className="m-3 ">  
                        <div className="flex justify-center items-center">
                            <label className="">Rate (per hour)</label>
                            <input className="w-[25%] mr-2" type="number" 
                                    onChange={(e)=> {setMinRate(Number(e.target.value))}}/> 
                            <p> to </p>
                            <input className="w-[25%] ml-2" type="number" 
                                    onChange={(e)=>{setMaxRate(Number(e.target.value))}}/>
                        </div>
                </div>

                <div className="flex items-center">
                    {/* https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array */}
                    <label>Suburb</label>
                    <select onChange={(e) => setLocation(e.target.value)}
                            value={location}
                            className="border border-[#e0e0e0] block p-2 rounded">
                        <option value="">None selected</option>
                        {[...new Set(allVenues.map((venue: Venue) => venue.suburb))].map(
                            (suburb : string) => <option value={suburb}>{suburb}</option>
                        )}
                    </select>
                </div>

                <Button text="Filter Results" onClick={() => {setSearchFiltered(true)
                                                              searchVenues()} 
                                                      }/>
                <Button text="Remove Filter" onClick={() => {setSearchFiltered(false) 
                                                             searchVenues()}}/>
            </form>
        </Popup>
      }

    </Main>

  );
}
