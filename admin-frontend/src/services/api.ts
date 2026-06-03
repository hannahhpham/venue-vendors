import {User, Venue, Application, Unavailable} from '../types/types'
import { gql } from "@apollo/client";
import { client } from "./apollo-client";
import * as operation from './graphql'


//make services for separate tables
export const VenueService = {
    //queries: get all venues, get one venue
    getAllVenues: async(): Promise<Venue[]> => {
        const {data} = await client.query<any>({query: operation.GET_VENUES});
        
        return data.venues;
    },

    getVenue: async(venueID: string): Promise<Venue> => {
        const {data} = await client.query<any>({
            query: operation.GET_VENUE, 
            variables: {id: venueID}
        });

        return data.venue;
    },

    updateVenue: async(id: number, name: string, phone: string, email: string, address: string, suburb: string, state: string, 
        postcode: number, capacity: number, rate: number, description: string, suitability: string): Promise<Venue> => {
        
            const {data} = await client.mutate<any>({
            mutation: operation.UPDATE_VENUE,
            variables: {id, name, phone, email, address, suburb, state, postcode, capacity, rate, description, suitability},
        });

        //console.log("data returned was ", data);

        return data.updatedVenue;
    },

    //delete venue

    //update owner

    //feature venue

    //unfeature venue
}
