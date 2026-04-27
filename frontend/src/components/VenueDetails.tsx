import React from 'react'
import { useState } from 'react'
import { useVenues } from '../context/VenueContext'
import {useNotif} from '../context/NotifContext'
import { Venue } from '../types/venues'
import Popup from './Popup'
import Button from './Button'

//define types needed for the whole component
interface VenueDetailsType {
  edit: boolean,
  venue: Venue
}

//use this for past venues as well
//and application?

const VenueDetails = ({ edit, venue }: VenueDetailsType) => {

  const { editVenue } = useVenues();
  const {showNotif} = useNotif();


  //STATES ARE ONLY USED FOR VENDOR SIDE - NOT HIRER SIDE
  const [popup, setPopup] = useState<boolean>(false);

  //states for the data types in. weird intialisation is so prefill works
  const [name, setName] = useState<string>(venue.name || "");
  const [phone, setPhone] = useState<string>(venue.phone || "");
  const [email, setEmail] = useState<string>(venue.email || "");
  const [address, setAddress] = useState<string>(venue.address || "");
  const [suburb, setSuburb] = useState<string>(venue.suburb ||"");
  const [state, setState] = useState<string>("VIC");                // bc it is the first value - otherwise, it will be blank for those who don't actually select a value
  const [postcode, setPostcode] = useState<number>(venue.postcode || 0);
  const [cap, setCap] = useState<number>(venue.capacity || 0);
  const [rate, setRate] = useState<number>(venue.rate || 0);
  const [desc, setDesc] = useState<string>(venue.description.trim() || "");


  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();

      const updatedVenue: Venue = {
        id: venue.id,
        name: name,
        phone: phone,
        email: email,
        address: address,
        suburb: suburb,
        state: "VIC",
        postcode: postcode,
        capacity: cap,
        rate: rate,
        stars: venue.id,
        description: desc.trim(),
        ownerID: venue.ownerID
      }

      // add the venue to your localStorage (NOTE: any new user will not be able to access these venues, only those in the files)
      editVenue(venue.id, updatedVenue);

      // reset all states to defaults
      setName(venue.name || "");
      setAddress(venue.address || "");
      setCap(venue.capacity || 0);
      setRate(venue.rate || 0);
      setDesc(venue.description.trim() || "");
      setEmail(venue.email || "");
      setPhone(venue.phone || "");
      setPostcode(venue.postcode || 0);
      setState("VIC");
      setSuburb(venue.suburb ||"");

      showNotif("Venue details successfully updated.", 'success');
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
                    <select className="block p-2 outline outline-black bg-neutral-50 rounded w-10/10" required value={state} onChange={(e) => setState(e.target.value)}>
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

                  <Button text="Submit" className="m-5" />
                </form>

              </Popup>
            }
          </div>)
          : (<div />)}
      </div>

      <div className="details flex bg-white border border-[#e0e0e0] rounded-md m-2 p-2">

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
    </div>
  )
}

export default VenueDetails
