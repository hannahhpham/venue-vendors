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

export const GET_USERS = gql`
    query GetUsers {
        getUsers {
        id
        email
        firstName
        lastName
        type
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
            address
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
export const DELETE_VENUE = gql`
    mutation DeleteVenue($id: ID!) {
        deleteVenue(id: $id)
    }
`;

//create venue
export const ADD_VENUE = gql`
    mutation AddVenue(
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
        $ownerID: Int!
        $suitability: String!
    ) {
        createVenue(
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
            ownerID: $ownerID
            suitability: $suitability
        ) {
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
            ownerID
            suitability
        }
    }
`;

//update owner
export const UPDATE_OWNER = gql`
    mutation UpdateOwner($id: ID!, $ownerID: Int!) {
        updateOwner(
            id: $id
            ownerID: $ownerID
        ) {
            id
            ownerID
        }
    }

`;

//feature venue

//unfeature venue

//template
// export const UPDATE_VENUE = gql`
// `;
