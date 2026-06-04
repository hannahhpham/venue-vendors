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

    getUsers: async(): Promise<User[]> => {
        const {data} = await client.query<any>({query: operation.GET_USERS});
        return data.users;
    },

    //mutations
    updateVenue: async(id: number, name: string, phone: string, email: string, address: string, suburb: string, state: string, 
        postcode: number, capacity: number, rate: number, description: string, suitability: string): Promise<Venue> => {
        
            const {data} = await client.mutate<any>({
            mutation: operation.UPDATE_VENUE,
            variables: {id, name, phone, email, address, suburb, state, postcode, capacity, rate, description, suitability},
        });

        return data.updatedVenue;
    },

    //delete venue
    deleteVenue: async(id: number): Promise<boolean> => {
        const { data } = await client.mutate<any>({
            mutation: operation.DELETE_VENUE,
            variables: {id: id}
        })

        return data.deleteVenue;
    },

    createVenue: async(name: string, phone: string, email: string, address: string, suburb: string, state: string, 
        postcode: number, capacity: number, rate: number, description: string, ownerID: number, suitability: string): Promise<Venue> => {
        
            const {data} = await client.mutate<any>({
            mutation: operation.ADD_VENUE,
            variables: {name, phone, email, address, suburb, state, postcode, capacity, rate, description, ownerID, suitability},
        });

        console.log("data returned in api.ts was ", data);

        return data.newVenue;
    },

    //update owner
    updateVenueOwner: async(id: number, ownerID: number) => {
        //console.log("venue id is ", venueID, " vendor id is ", vendorID);
        const {data} = await client.mutate<any>({
            mutation: operation.UPDATE_OWNER,
            variables: {id, ownerID}
        });


        return data.venue;
    }

    //feature venue

    //unfeature venue
}

export const UserService = {
    getAllUsers: async() => {
        const {data} = await client.query<any>({query: operation.GET_USERS});
        
        return data.getUsers;
    }

}
