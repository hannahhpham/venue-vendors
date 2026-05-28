import Header from "../components/Header";
import Button from "../components/Button";
import Main from '../components/Main';
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Venue } from "../types/venues";
import { useVenues } from "../context/VenueContext";
import { useNotif } from '../context/NotifContext';

export default function SubmitApplication() {
    const router = useRouter();
    const { currUser, fetchVendorVenues } = useAuth();
    const { addVenue } = useVenues();
    const {showNotif} = useNotif();

    type states = 'VIC' | 'NSW' | 'SA' | 'TAS' | 'WA' | 'ACT' | 'NT' | 'QLD';

    // for the form
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [suburb, setSuburb] = useState<string>("");
    const [state, setState] = useState<states>("VIC" as states);                // bc it is the first value - otherwise, it will be blank for those who don't actually select a value
    const [postcode, setPostcode] = useState<number>(0);
    const [cap, setCap] = useState<number>(0);
    const [rate, setRate] = useState<number>(0);
    const [desc, setDesc] = useState<string>("");
    const [suitability, setSuitability] = useState<string>("");

    if (currUser && currUser.type === "vendor") {
        
        if (!currUser) {
            showNotif("Please login to access this page.", "fail");
            router.push('/');
        }

        const handleAddVenue = async (e: React.FormEvent) => {
            e.preventDefault();

            //frontend validation. checks fields aren't blank
            if (name.trim() && phone.trim() && email.trim() && address.trim() && suburb.trim()
                    && state.trim() && postcode!=0 && cap!=0 && rate!=0 && desc.trim()) {
                
                        const newVenue: Partial<Venue> = {
                    //id: Date.now(),
                    name: name.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    address: address.trim(),
                    suburb: suburb.trim(),
                    state: state as states,               // FIND A WAY TO FIX THIS
                    postcode: postcode,
                    capacity: cap,
                    rate: rate,
                    //stars: 0,
                    description: desc.trim(),
                    ownerID: currUser.id,
                    suitability: suitability,
                }

                try {
                    // add the venue to the database
                    await addVenue(newVenue);
                    
                    // update the user's venues and all venues
                    fetchVendorVenues();
                    
                    router.push("/dashboard");

                    // reset all states to defaults
                    setName("");
                    setAddress("");
                    setCap(0);
                    setRate(0);
                    setDesc("");
                    setEmail("");
                    setPhone("");
                    setPostcode(0);
                    setState("VIC" as states);
                    setSuburb("");
                    setSuitability("");

                } catch {
                    showNotif("Failed to add venue. Please check your inputs are valid", "fail");
                }

            }
            else {
                showNotif("Please don't leave fields blank/set to 0.", "fail");
            }        
        }
        
        return (
            <Main type='wholePage'>
                <title>Add Venue</title>

                <Header active={"dashboard"} />


                <div className="">

                    <div className="pl-5 pt-5">
                        <main className="m-3">
                            <h2 className="text-2xl font-bold">Add Venues</h2>

                            <form className="p-2" onSubmit={handleAddVenue}>
                                <label className="mb-2">
                                    Name
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="string" value={name} onChange={(e) => setName(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Phone
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="string" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Email
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Address
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="string" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    Suburb
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="string" value={suburb} onChange={(e) => setSuburb(e.target.value)} required />
                                </label>
                                <label className="mb-2">
                                    State
                                    <select className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     required value={state} onChange={(e) => setState(e.target.value as states)}>
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
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="number" value={postcode} onChange={(e) => setPostcode(Number(e.target.value))} required />
                                </label>
                                <label className="mb-2">
                                    Capacity
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="number" value={cap} onChange={(e) => setCap(Number(e.target.value))} required />
                                </label>
                                <label className="mb-2">
                                    Rate
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} required />
                                </label>
                                <label className="mb-2">
                                    Description
                                    <input className="block p-2 outline outline-black bg-neutral-50 rounded w-100"
                                     type="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} required />
                                </label>

                        
                                <label>Suitability</label>

                                <div className="p-2 outline outline-black bg-neutral-50 rounded w-100">
                                    <div className="flex">
                                        <input className="mr-1 mt-1" value="party" type="radio" name="suitability"
                                            onChange={(e) => {setSuitability(e.target.value)}}/> 
                                        <label className="">Parties</label>
                                    </div>

                                    <div className="flex">
                                        <input className="mr-1 mt-1" value="formal" type="radio" name="suitability"
                                            onChange={(e) => {setSuitability(e.target.value)}}/> 
                                        <label className="">Formal events</label>
                                    </div>

                                    <div className="flex">
                                        <input className="mr-1 mt-1" value="casual" type="radio" name="suitability"
                                            onChange={(e) => {setSuitability(e.target.value)}}/> 
                                        <label className="">Casual events</label>
                                    </div>

                                    <div className="flex">
                                        <input className="mr-1 mt-1" value="corporate" type="radio" name="suitability"
                                            onChange={(e) => {setSuitability(e.target.value)}}/> 
                                        <label className="">Corporate events</label>
                                    </div>
                                </div>
                            

                                <Button className="px-10 p-3 mt-5 rounded-md font-medium"
                                 type="submit" text="Submit"></Button>
                            </form>

                        </main>
                    </div>

                </div>


            </Main>

        );

    } else {
        //
        
    }

}
