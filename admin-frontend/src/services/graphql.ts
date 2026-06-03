import {gql} from '@apollo/client'
// import { client } from "./graphql";

//get all venues
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

//get 1 venue
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

//mutate venue details
export const UPDATE_VENUE = gql`
    mutation UpdateVenue(
        $id: ID!
        $name: String!
        $phone: String!
        $email: String!
        $address: String!
        $suburb: String!
        $state: VenueState!
        $postcode: Int!
        $capacity: Int!
        $rate: Int!
        $description: String!
        $suitability: String!
    ) {
        updateVenue(
            id: $id
            name: $name
            phone: $phone
            email: $email
            address: $address
            suburb: $suburb
            state: $state
            postcode: $postcode
            capacity: $capacity
            rate: $rate
            description: $description
            suitability: $suitability
        ) {
            id
            name
            phone
            email
            suburb
            state
            postcode
            capacity
            rate
            description
            suitability
        }
    }
`;

//delete venue

//update owner

//feature venue

//unfeature venue

//template
// export const UPDATE_VENUE = gql`
// `;
