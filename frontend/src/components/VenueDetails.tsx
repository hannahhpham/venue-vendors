import React from 'react'
import { useState } from 'react'
import { useVenues } from '../context/VenueContext'
import { Venue } from '../types/venues'
import {useNotif} from '../context/NotifContext'
import Popup from './Popup'
import Button from './Button'

// define types needed for the whole component
interface VenueDetailsType {
  edit: boolean,
  venue: Venue,
  onUpdate?: () => void,
}


const VenueDetails = ({ edit, venue, onUpdate}: VenueDetailsType) => {

  const { editVenue, fetchVenues } = useVenues();
  const {showNotif} = useNotif();

  type states = 'VIC' | 'NSW' | 'SA' | 'TAS' | 'WA' | 'ACT' | 'NT' | 'QLD';

  //STATES ARE ONLY USED FOR VENDOR SIDE - NOT HIRER SIDE
  const [popup, setPopup] = useState<boolean>(false);

  //states for the data types in. weird intialisation is so prefill works
  const [name, setName] = useState<string>(venue.name || "");
  const [phone, setPhone] = useState<string>(venue.phone || "");
  const [email, setEmail] = useState<string>(venue.email || "");
  const [address, setAddress] = useState<string>(venue.address || "");
  const [suburb, setSuburb] = useState<string>(venue.suburb ||"");
  const [state, setState] = useState<string>(venue.state);                // bc it is the first value - otherwise, it will be blank for those who don't actually select a value
  const [postcode, setPostcode] = useState<number>(venue.postcode || 0);
  const [cap, setCap] = useState<number>(venue.capacity || 0);
  const [rate, setRate] = useState<number>(venue.rate || 0);
  const [desc, setDesc] = useState<string>(venue.description.trim() || "");
  const [suitability, setSuitability] = useState<string>(venue.suitability || "");

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();

    //frontend validation: check fields aren't empty or are just spaces 
    if (name.trim() && phone.trim() && email.trim() && address.trim() && suburb.trim()
        && state.trim() && postcode!=0 && cap!=0 && rate!=0 && desc.trim()) {
    
      const updatedVenue: Partial<Venue> = {
          name: name,
          phone: phone,
          email: email,
          address: address,
          suburb: suburb,
          state: state as states,
          postcode: postcode,
          capacity: cap,
          rate: rate,
          description: desc.trim(),
          suitability: suitability,
      }

      // store the edited values
      try {
        await editVenue(Number(venue.id), updatedVenue);
        
        if (onUpdate) {
          onUpdate();
          //console.log("suitability in venuedetails is ", suitability);
        }
      }
      catch {
        showNotif("Venue failed to update. Please check your inputs are valid.", "fail");
      }
      

      // reset all states to defaults
      setName(updatedVenue.name || "");
      setAddress(updatedVenue.address || "");
      setCap(updatedVenue.capacity || 0);
      setRate(updatedVenue.rate || 0);
      setDesc(updatedVenue.description || "");
      setEmail(updatedVenue.email || "");
      setPhone(updatedVenue.phone || "");
      setPostcode(updatedVenue.postcode || 0);
      setState(updatedVenue.state as states);
      setSuburb(updatedVenue.suburb || "");
      setSuitability(updatedVenue.suitability || "");
    
    }
    else {
      showNotif("Please enter non-space characeters into the fields. ", "fail");
    }

      

  }


  return (
    <div>
      <div className="details flex items-center justify-between pl-2 pr-2">
        <h3>Venue Details</h3>

        {edit ?
          (<div >
            <img className="hover:drop-shadow" src={"/edit_square.png"} onClick={() => setPopup(true)} />

            {popup &&
              //to edit the details
              <Popup onClose={() => setPopup(false)}>
                <form onSubmit={handleSubmit} className='h-100 m-auto text-center'>
                  <div>
                    <h3>Edit Venue Details</h3><br /><br />
                  </div>

                  <label className="mb-2">
                    Name
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="string" value={name} onChange={(e) => setName(e.target.value)} required></input>
                  </label>
                  <label className="mb-2">
                    Phone
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="string" value={phone} onChange={(e) => setPhone(e.target.value)} required></input>
                  </label>
                  <label className="mb-2">
                    Email
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                  </label>
                  <label className="mb-2">
                    Address
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="string" value={address} onChange={(e) => setAddress(e.target.value)} required></input>
                  </label>
                  <label className="mb-2">
                    Suburb
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="string" value={suburb} onChange={(e) => setSuburb(e.target.value)} required></input>
                  </label>
                  <label className="mb-2">
                    State
                    <select className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" required value={state} onChange={(e) => setState(e.target.value as states)}>
                      <option value="VIC">Victoria</option>
                      <option value="NSW">New South Wales</option>
                      <option value="TAS">Tasmania</option>
                      <option value="QLD">Queensland</option>
                      <option value="ACT">Australian Capital Territory</option>
                      <option value="SA">South Autralia</option>
                      <option value="NT">Northern Territory</option>
                      <option value="WA">Western Autralia</option>
                    </select>
                  </label>
                  <label className="mb-2">
                    Postcode
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="number" value={postcode} onChange={(e) => setPostcode(Number(e.target.value))} required></input>
                  </label>
                  <label className="mb-2">
                    Capacity
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="number" value={cap} onChange={(e) => setCap(Number(e.target.value))} required></input>
                  </label>
                  <label className="mb-2">
                    Rate
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} required></input>
                  </label>
                  <label className="mb-2">
                    Description
                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" type="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} required></input>
                  </label>

                  <label className="block">Suitability</label>

                  <div className="p-2 outline outline-black bg-neutral-50 rounded w-100">
                      <div className="flex">
                          <input className="mr-1 mt-1" value="party" type="radio" name="suitability"
                              onChange={(e) => {setSuitability(e.target.value)}}
                              checked={suitability === "party"} /> 
                          <label className="">Parties</label>
                      </div>

                      <div className="flex">
                          <input className="mr-1 mt-1" value="formal" type="radio" name="suitability"
                              checked={suitability === "formal"}
                              onChange={(e) => {setSuitability(e.target.value)}}/> 
                          <label className="">Formal events</label>
                      </div>

                      <div className="flex">
                          <input className="mr-1 mt-1" value="casual" type="radio" name="suitability"
                              checked={suitability === "casual"}
                              onChange={(e) => {setSuitability(e.target.value)}}/> 
                          <label className="">Casual events</label>
                      </div>

                      <div className="flex">
                          <input className="mr-1 mt-1" value="corporate" type="radio" name="suitability"
                              checked={suitability === "corporate"}
                              onChange={(e) => {setSuitability(e.target.value)}}/> 
                          <label className="">Corporate events</label>
                      </div>
                  </div>
                          

                  <Button text="Submit" className="m-5" />
                </form>

              </Popup>
            }
          </div>)
          : (<div />)}
      </div>

      <div className="details bg-white border border-[#e0e0e0] rounded-md m-2 p-2">

        <div className= "flex">
          <div className="flex-1 flex flex-col mr-2">
            <label>Venue Name</label>
            <input data-testid="name" value={venue.name} disabled></input>

            <label>Company Phone Number</label>
            <input data-testid="number" value={venue.phone} disabled></input>

            <label>Company Email</label>
            <input data-testid="email" value={venue.email} disabled></input>
          </div>

          <div className="flex-1 flex flex-col">
            <label>Venue Address</label>
            <input data-testid="address" value={venue.address + ", " + venue.suburb + ", " + venue.state + ", " + venue.postcode} disabled></input>

            <label>Venue Capacity</label>
            <input data-testid="capacity" value={`${venue.capacity} people`} disabled></input>

            <label>Venue Rate (per hour)</label>
            <input data-testid="rate" value={`$${venue.rate}`} disabled></input>
          </div>
        </div>
        
        <div className="w-full">
          <label className="details">Suitability</label>
          <input className="block w-130" value={`${venue.suitability}`} disabled></input>  
        </div>

      </div>

      

    </div>
  )
}

export default VenueDetails
