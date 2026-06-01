import {gql} from 'graphql-tag';
import {AppDataSource} from '../data-source'
import {User} from '../entities/User'
import {Venue} from '../entities/Venue'
import {Application} from '../entities/Application'
import {ShortlistedVenue} from '../entities/ShortlistedVenue'
import {Unavailable} from '../entities/Unavailable'

//make repositories here
const userRepository = AppDataSource.getRepository(User);
const VenueRepository = AppDataSource.getRepository(Venue);
const appRepository = AppDataSource.getRepository(Application);
const shortlistedVenueRepository = AppDataSource.getRepository(ShortlistedVenue);
const unavailRepository = AppDataSource.getRepository(Unavailable);

//this code is referenced from lectorial 9 example 2
//this is basically the 'controller'

export const resolvers = {
    Query: { //READ
        venues: async () => {
            return await VenueRepository.find();
        },


    },

    // Mutation: { //CREATE UPDATE DELETE

    // }

}