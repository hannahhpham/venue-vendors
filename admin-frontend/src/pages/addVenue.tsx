import Header from "../components/Header";
import Button from "../components/Button";
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Venue, User } from "../types/types";
import { useVenues } from "../context/VenueContext";
import { useNotif } from '../context/NotifContext';
import {UserService, VenueService} from '../services/api'

export default function SubmitApplication() {
    const router = useRouter();
    const { currUser, allUsers } = useAuth();
    const { addVenue, fetchVenues } = useVenues();
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
    
    //new field: give the venue to a vendor
    const [vendorId, setVendorId] = useState<number>(0);

    if (currUser) {
        
        const handleAddVenue = async (e: React.FormEvent) => {
            e.preventDefault();

            //frontend validation. checks fields aren't blank
            if (name.trim() && phone.trim() && email.trim() && address.trim() && suburb.trim()
                    && state.trim() && postcode!=0 && cap!=0 && rate!=0 && desc.trim()) {
                
                
                let validation_passed:boolean = true;

                //frontend validation
                const number_regex = /[0-9]{10}/;
                const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                const string_only = /^[a-zA-Z]+$/;
                const postcode_regex = /[0-9]{4}/;

                //validate fields
                if (!number_regex.test(phone)) {
                    validation_passed = false;
                    showNotif("Phone number must be 10 digits.", "fail");
                }
                if (!email_regex.test(email)) {
                    validation_passed = false;
                    showNotif("Email is in incorrect format", "fail");
                }
                if (!string_only.test(suburb)) {
                    validation_passed = false;
                    showNotif("Suburb must contain only letters.", "fail");
                }
                if (!postcode_regex.test(String(postcode))) {
                    validation_passed = false;
                    showNotif("Postcode must be 4 numbers.", "fail");
                }
                if (cap <= 0) {
                    validation_passed = false;
                    showNotif("Capacity must be positive value.", "fail");
                }
                if (rate <= 0) {
                    validation_passed = false;
                    showNotif("Rate must be a positive value.", "fail");
                }

                if (validation_passed) {
                    try {
                        // add the venue to the database
                        await addVenue(name, phone, email, address, suburb, state, postcode, cap,
                            rate, desc, vendorId, suitability);
                        
                        // update the user's venues and all venues
                        fetchVenues();

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
                        setVendorId(0);

                        showNotif("Venue successfully added.", "success");

                    } catch {
                        showNotif("Failed to add venue. Please check your inputs are valid", "fail");
                    }
                }

            }
            else {
                showNotif("Please don't leave fields blank/set to 0.", "fail");
            }        
        }
        
        return (
            <main>
                <title>Add Venue</title>

                <Header active={"addVenue"} />


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

                                <label className="mb-2">
                                    Vendor Assigned
                                </label>
                                <select className="block p-2 outline outline-black bg-neutral-50 rounded w-100" 
                                    onChange={(e) => {setVendorId(Number(e.target.value))}}>
                                    {
                                        allUsers.map((user: User) => 
                                            <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                                        )
                                    }
                                </select>

                        
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


            </main>

        );

    } else {
       
        
    }

}
