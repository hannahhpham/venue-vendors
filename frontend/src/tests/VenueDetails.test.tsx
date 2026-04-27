import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {useAuth, AuthProvider} from '../context/AuthContext'
import {ApplyProvider} from '../context/ApplyContext'
import {VenueProvider} from '../context/VenueContext'
import {NotifProvider} from '../context/NotifContext'
import {UnavailProvider} from '../context/UnavailContext'
import {users, User} from '../types/users'
import {venues, Venue} from '../types/venues'
import VenueDetails from '../components/VenueDetails';

//test data
const testVenue: Venue = venues[0];

describe("Venue Details", () => {
    
    // first test: use the actual contexts (except authcontext, ned to mock useAuth. but mock the router
    it("Correct venue details are displayed", () => {
        
        //idk if i need all the providers actually
        const {getByTestId} = render(
            <NotifProvider>
                <VenueProvider>
                    <UnavailProvider>
                        <ApplyProvider>
                            {/* <AuthProvider> */}
                                <VenueDetails edit={true} venue={testVenue} /> 
                            {/* </AuthProvider> */}
                        </ApplyProvider>
                    </UnavailProvider>
                </VenueProvider>    
            </NotifProvider>
        );
        
        //get expected details. type specifically as input element so can use value
        const name: string = (getByTestId("name") as HTMLInputElement).value;
        const number: string = (getByTestId("number") as HTMLInputElement).value;
        const email: string = (getByTestId("email") as HTMLInputElement).value;
        const rate: string = (getByTestId("rate") as HTMLInputElement).value;
        const address: string = (getByTestId("address") as HTMLInputElement).value;
        const capacity: string = (getByTestId("capacity") as HTMLInputElement).value;
        expect(name).toEqual(testVenue.name); 
        expect(number).toEqual(testVenue.phone); 
        expect(email).toEqual(testVenue.email); 
        expect(rate).toEqual("$" + testVenue.rate); 
        expect(address).toEqual(testVenue.address + ", " + testVenue.suburb + ", " + testVenue.state + ", " + testVenue.postcode); 
        expect(capacity).toEqual(testVenue.capacity + " people"); 
    });

});