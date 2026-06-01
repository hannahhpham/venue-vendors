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
            state
            postcode
            rate
            description
            suitability
        }
    }
`;
