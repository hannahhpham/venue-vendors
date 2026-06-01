import {User, Venue, Application, Unavailable} from '../types/types'
import { gql } from "@apollo/client";
import { client } from "./apollo-client";
import {GET_VENUES} from './graphql'

//types returned 
type VenueType = {
    venues: Venue[]
}

//make services for separate tables
export const VenueService = {
    getAllVenues: async(): Promise<Venue[]> => {
        const {data} = await client.query<VenueType>({query: GET_VENUES});
        
        if (data) {
            return data.venues;
        }
        else {
            return [];
        }
    }
}
