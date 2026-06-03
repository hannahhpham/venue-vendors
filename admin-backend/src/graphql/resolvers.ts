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

        //this syntax sucks i hate this
        venue: async (_: any, { id }: { id: number }) => {
            return await VenueRepository.findOne({where: {id: id}});
        },

        getUsers: async(_: any) => {
            return await userRepository.find({where: {type: "vendor"}});
        },

    },

    Mutation: { //CREATE UPDATE DELETE
        updateVenue: async(_: any, {id, name, phone, email, address, suburb, state, postcode, capacity, rate, description, suitability}: 
            {id: number, name: string, phone: string, email: string, address: string, suburb: string, state: any, postcode: number,
                capacity: number, rate: number, description: string, suitability: string}) => {

            await VenueRepository.update(id, {name, phone, email, address, suburb, state, postcode, capacity, rate, description, suitability});
            return await VenueRepository.findOne({where: {id: id}})
            
        },

        //delete venue
        deleteVenue: async(_: any, {id}: {id: number}) => {
            const result = await VenueRepository.delete(id);
            return result.affected !== 0;
        },

        //create venue - need to get all users, check their ids and if they're a vendor
        createVenue: async(_: any, {name, phone, email, address, suburb, state, postcode, capacity,
            rate, description, ownerID, suitability} : {name: string, phone: string, email: string, address: string, suburb: string, 
            state: any, postcode: number, capacity: number, rate: number, description: string, ownerID: number, suitability: string}) => {
           
            const venue = VenueRepository.create({name, phone, email, address, suburb, state, postcode, capacity,
                rate, description, ownerID, suitability});
            return await VenueRepository.save(venue);
        }

        //update owner

        //feature venue

        //unfeature venue

    }

}