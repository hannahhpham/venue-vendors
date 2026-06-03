import gql from "graphql-tag";

//define the shape of the api response (types)
//then define queries and mutations (function declarations basically)

//COMMENTS:
//- enums are done at the start, then all the types, then query/mutations, then functions(?)
//-not putting the password in type User cuz we don't want that exposed

export const typeDefs = gql`
    enum UserType {
        hirer
        vendor
    }

    enum VenueState {
        VIC
        TAS
        ACT
        SA
        WA
        NSW
        QLD
        NT
    }

    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        type: UserType!

        reputation: Int
        credibility: Int
        abn: String
        drivLic: String
        insur: String
        registrationCert: String

        createdAt: String!

    }

    type Venue {
        id: ID!
        name: String!
        phone: String!
        email: String!
        address: String!
        suburb: String!
        state: VenueState!
        postcode: Int!
        capacity: Int!
        rate: Int!
        description: String!
        suitability: String
        ownerID: Int!
    }

    type ShortlistedVenue {
        hirerID: ID!
        venueID: ID!
        rank: Int!
    }

    type Unavailable {
        id: ID!
        startTime: String!
        endTime: String!
        date: String!
        venueID: ID!
    }

    type Application {
        id: ID!
        eventName: String!
        startTime: String!
        endTime: String!
        date: String!
        guests: Int!
        description: String!
        
        abn: String
        registrationcert: String
        isAccepted: Boolean
        notes: String
        vendorRating: Int
        rank: Int

        hirerID: Int!
        venueID: Int!
    }

    type Query {
        venues: [Venue!]!
        venue(id: ID!): Venue
    }
        
    type Mutation {
        updateVenue(
            id: ID!
            name: String!
            phone: String!
            email: String!
            address: String!
            suburb: String!
            state: VenueState!
            postcode: Int!
            capacity: Int!
            rate: Int!
            description: String!
            suitability: String
        ): Venue!
    
    }

`;
    

