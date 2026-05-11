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

    if (currUser && currUser.type === "vendor") {
        
        if (!currUser) {
            showNotif("Please login to access this page.", "fail");
            
        }
        // for the form
        const [name, setName] = useState<string>("");
        const [phone, setPhone] = useState<string>("");
        const [email, setEmail] = useState<string>("");
        const [address, setAddress] = useState<string>("");
        const [suburb, setSuburb] = useState<string>("");
        const [state, setState] = useState<string>("VIC");                // bc it is the first value - otherwise, it will be blank for those who don't actually select a value
        const [postcode, setPostcode] = useState<number>(0);
        const [cap, setCap] = useState<number>(0);
        const [rate, setRate] = useState<number>(0);
        const [desc, setDesc] = useState<string>("");

        const handleAddVenue = (e: React.FormEvent) => {
            e.preventDefault();

            const newVenue: Partial<Venue> = {
                //id: Date.now(),
                name: name,
                phone: phone,
                email: email,
                address: address,
                suburb: suburb,
                state: "VIC",               // FIND A WAY TO FIX THIS
                postcode: postcode,
                capacity: cap,
                rate: rate,
                //stars: 0,
                description: desc.trim(),
                ownerID: currUser.id
            }

            // add the venue to the database
            addVenue(newVenue);
            
            // update the user's venues and all venues
            fetchVendorVenues();

            // reset all states to defaults
            setName("");
            setAddress("");
            setCap(0);
            setRate(0);
            setDesc("");
            setEmail("");
            setPhone("");
            setPostcode(0);
            setState("VIC");
            setSuburb("");

            router.push("/dashboard");
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
                                     required value={state} onChange={(e) => setState(e.target.value)}>
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
                                <Button className="px-10 p-3 mt-5 bg-gray-200 rounded-md font-medium"
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
