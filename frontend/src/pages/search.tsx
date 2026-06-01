import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from "react";
import { useVenues } from "../context/VenueContext";
import { Venue } from "../types/venues";
import Main from '../components/Main'
import Sidebar from '../components/Sidebar'


export default function Search() {
  const router = useRouter();

  const { allVenues } = useVenues();

//   // to support ease of use, start typing your search straight away with useRef ;)
//   const searchRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     searchRef.current?.focus();
//   })

  const [search, setSearch] = useState<string>("");

  //see if filter/sort has been used
  const [searchFiltered, setSearchFiltered] = useState<boolean>(false);
  const [searchSort, setSearchSort] = useState<boolean>(false);
  const [searchSuitability, setSearchSuitability] = useState<boolean>(false);

  //save the search results, so when users click a venue and back their old search is saved
  const [searchResults, setSearchResults] = useState<Venue[]>([]);

  //set filter form useStates
  //sheet spec says recommended suitability?? tf does that mean :')
  const [location, setLocation] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [minRate, setMinRate] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(0);

  //set sorting useState
  const [sortValue, setSortValue] = useState<string>("");

  const [suitabilityValue, setSuitabilityValue] = useState<string>("");

  //function to filter and sort. if not sorting/filtering allVenues array is returned
  //default parameter: https://stackoverflow.com/questions/23314806/setting-default-value-for-typescript-object-passed-as-argument
  //                   can use this to make the parameter whatver the state is rn
  const searchVenues = (currSortValue = sortValue, currSearchSort = searchSort, 
                        currSuitability = suitabilityValue, currSearchSuitability = searchSuitability) => {
    if (allVenues.length === 0 || !allVenues) return;

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

    if (searchSort) {
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
    }

    //suitability

    if (currSearchSuitability) {
        if (currSuitability == "casual") {
            result = result.filter((venue: Venue) => venue?.suitability?.includes("casual"));
        }
        else if (currSuitability == "formal") {
            result = result.filter((venue: Venue) => venue?.suitability?.includes("formal"));
        }
        else if (currSuitability == "corporate") {
            result = result.filter((venue: Venue) => venue?.suitability?.includes("corporate"));
        }
        else if (currSuitability == "party") {
            result = result.filter((venue: Venue) => venue?.suitability?.includes("party"));
        }

    }
    
    
    setSearchResults(result);

  }

//when the filter is turned on/off then change the search
  useEffect(() => {
    searchVenues();
  }, [searchFiltered, allVenues])

  //show venues as soon as page loads
  useEffect(() => {
    searchVenues();
  }, []);

  return (
    <Main type='wholePage'>
      <title>Search</title>

      <Header active={"search"} />

      <div>

        <div className="flex">
            {/* filter, search, suitability bar */}
            <Sidebar type='search'>
    
                {/* filtering */}
                <form className="border border-[#e0e0e0] rounded-md p-2 bg-white flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
                    <h3 className="text-center">Filter</h3>
                    {/* FIX THE STYLING OF THE LABEL ITS NOT ALIGNED TO THE INPUT*/}
                    <div className="ml-5 justify-center items-center">  
                        <div className="">
                            <label className="block font-bold">Capacity</label>
                            <div className="flex items-center">
                                <input className="w-[40%] mr-2" type="number" 
                                    onChange={(e)=>setMinCapacity(Number(e.target.value))}
                                ></input> 
                                <p> to </p>
                                <input className="w-[40%] ml-2" type="number" 
                                    onChange={(e)=>setMaxCapacity(Number(e.target.value))}></input>
                            </div>
                        </div>
                    </div>

                    {/* FIX THE STYLING OF THE LABEL ITS NOT ALIGNED TO THE INPUT*/}
                    <div className="">  
                            <div className="ml-5 justify-center items-center">
                                <label className="block font-bold">Rate (per hour)</label>

                                <div className="flex items-center">
                                    <input className="w-[40%] mr-2" type="number" 
                                            onChange={(e)=> {setMinRate(Number(e.target.value))}}/> 
                                    <p> to </p>
                                    <input className="w-[40%] ml-2" type="number" 
                                            onChange={(e)=>{setMaxRate(Number(e.target.value))}}/>
                                </div>

                            </div>
                    </div>

                    <div className="">
                        {/* https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array */}
                        <label className="font-bold block">Suburb</label>
                        <select onChange={(e) => setLocation(e.target.value)}
                                value={location}
                                className="w-[100%] border border-[#e0e0e0] block p-2 rounded">
                            <option value="">None selected</option>
                            {[...new Set(allVenues.map((venue: Venue) => venue.suburb))].map(
                                (suburb : string) => <option value={suburb}>{suburb}</option>
                            )}
                        </select>
                    </div>

                    <div className="flex">
                    <Button text="Filter" onClick={() => {setSearchFiltered(true)
                                                                searchVenues()} 
                                                        }/>
                    <Button text="Remove Filter" onClick={() => {setSearchFiltered(false) 
                                                                searchVenues()}}/>
                    </div>
                    
                </form>
                <br/>

                {/* sorting */}
                <form className="border border-[#e0e0e0] rounded-md p-2 bg-white flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
                    <h3 className="text-center">Sort</h3>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="rate" type="radio" name="sort"
                            onChange={(e) => {setSortValue(e.target.value)}}/> 
                        <label className="">Rate (ascending)</label>
                    </div>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="capacity" type="radio" name="sort"
                            onChange={(e) => {setSortValue(e.target.value)}}/> 
                        <label className="">Capacity (ascending)</label>
                    </div>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="alphabetical" type="radio" name="sort"
                            onChange={(e) => {setSortValue(e.target.value)}}/> 
                        <label className="">Alphabetical (ascending)</label>
                    </div>
                    
                    <div className="flex">
                    <Button text="Sort" onClick={() => {setSearchSort(true)
                                                        searchVenues(sortValue, true);
                                                        } 
                                                        }/>
                    <Button text="Remove Sort" onClick={() => {setSearchSort(false)
                                                               searchVenues("remove", false); 
                                                               setSortValue("")
                                                               }}/>
                    </div>
                </form> <br/>
        
                {/* suitability */}
                <form className='border border-[#e0e0e0] rounded-md p-2 bg-white flex flex-col items-center' onSubmit={(e) => e.preventDefault()}>
                    <h3 className="text-center">Suitability</h3>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="party" type="radio" name="suitability"
                            onChange={(e) => {setSuitabilityValue(e.target.value)}}/> 
                        <label className="">Parties</label>
                    </div>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="formal" type="radio" name="suitability"
                            onChange={(e) => {setSuitabilityValue(e.target.value)}}/> 
                        <label className="">Formal events</label>
                    </div>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="casual" type="radio" name="suitability"
                            onChange={(e) => {setSuitabilityValue(e.target.value)}}/> 
                        <label className="">Casual events</label>
                    </div>

                    <div className="flex">
                        <input className="mr-1 mt-1" value="corporate" type="radio" name="suitability"
                            onChange={(e) => {setSuitabilityValue(e.target.value)}}/> 
                        <label className="">Corporate events</label>
                    </div>

                    <Button text="Search" onClick={() => {setSearchSuitability(true)
                                                                searchVenues(sortValue, searchSort, suitabilityValue, true)}}/>
                    
                    <Button text="Remove Filter" onClick={() => {setSearchSuitability(false)
                                                               searchVenues("remove", false, "", false); 
                                                               setSuitabilityValue("")
                                                               }}/>
                </form>
                

            
            </Sidebar>

            
            <div className='w-[100%]'>
                 <input type="string"  placeholder="Search" className="p-5 mx-auto my-3 bg-white w-19/20 rounded-3xl" value={search} onChange={(e) => setSearch(e.target.value)}></input>
           {/* ref={searchRef} */}
           
            {/* search results */}
            <div className="flex-1 grid grid-cols-3 auto-rows-fr"> 
                
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
                    || v.capacity === Number(search) || v.rate === Number(search) )).length === 0 
                    ? 
                        "No venues match your specifications. Please try again. " 
                        : 
                        (searchResults.filter((v : Venue) => ((v.name.toLowerCase()).includes(search) || (v.suburb.toLowerCase()).includes(search) || v.postcode === Number(search) 
                            || v.capacity === Number(search) || v.rate === Number(search) || v.keywords?.includes(search))).map((venue: Venue) =>
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
        
        </div>
      </div>

    </Main>

  );
}
