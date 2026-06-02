import {User, Venue, Application, Unavailable} from '../types/types'
import { gql } from "@apollo/client";
import { client } from "./apollo-client";
import * as operation from './graphql'

//types returned 
type VenueType = {
    venues: Venue[]
}

//make services for separate tables
export const VenueService = {
    //queries: get all venues, get one venue
    getAllVenues: async(): Promise<Venue[]> => {
        const {data} = await client.query<VenueType>({query: operation.GET_VENUES});
        
        if (data) {
            return data.venues;
        }
        else {
            return [];
        }
    },

    getVenue: async(venueID: string): Promise<Venue | null> => {
        const {data} = await client.query<Venue | null>({
            query: operation.GET_VENUE, 
            variables: {id: venueID}
        });

        if (data) {
            console.log(data);
            return data;
        }
        else {
            return null;
        }
        
    }

    //mutations: delete, update, create
}
