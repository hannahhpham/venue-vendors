import {gql} from '@apollo/client'
// import { client } from "./graphql";

//define graphql queries
export const GET_VENUES = gql`
    query GetVenues {
        venues {
            id
            name
            phone
            email
            address
            suburb
            state
            postcode
            capacity
            rate
            description
            suitability
            ownerID
        }
    }
`;

export const GET_VENUE = gql`
    query GetVenue($id: ID!) {
        venue (id: $id) {
            id
            name
            phone
            email
            address
            suburb
            state
            postcode
            capacity
            rate
            description
            suitability
            ownerID
        }
    }
`;
