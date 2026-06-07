import { describe, it, expect,  beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Venue } from "../entities/Venue";
import app from '../app'
import {graphql} from '../app'

//graphql testing references: 
//- lecture 9 example 3
//- main project tests

describe("Testing graphQL API Endpoint for Venue Related Tests", () => {
    
    //setup the data source. call from app NOT index to prevent jest errors
    beforeEach(async () => {

        await graphql(app);

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Clear the venue table before each test
        const venueRepository = AppDataSource.getRepository(Venue);
        await venueRepository.clear();

        // deleted last due to FK constraints
        const userRepo = AppDataSource.getRepository(User);
        await userRepo.clear();
    });

    //close connection
    afterEach(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    //-------------------- note: these tests are based off the main project's backend tests ---------------

    // ------------------------------- TESTING QUERIES -------------------------------------------------
    //TEST 1: check that when theres no data in the database, the api correctly returns no venues.
    it("Should return an empty array when no venues exist", async () => {
        const expectedResult = {
            "venues": []
        };

        const response = await request(app).post("/graphql")
        .set("Content-Type", "application/json")
        .send({query: `
            query {
                venues {
                    name
                    ownerID
                }
            }
        `});
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expectedResult);
    });

    //TEST 2: check that when there's data in db, the venues are returned
    it("Return all venues in the database", async () => {
       
        // create a mock owner for each test
        const userRepo = AppDataSource.getRepository(User);
        const user = new User();
        user.firstName = "Test";
        user.lastName = "User";
        user.email = "example@gmail.com";
        user.password = "testing123!";
        user.type = "vendor";
        user.phoneNumber = "0444123086"
        // save the mock owner
        await userRepo.save(user);

        // Create a test venue
        const venueRepo = AppDataSource.getRepository(Venue);
        const venue = new Venue();
        venue.name = "Test";
        venue.address = "User";
        venue.email = "example@gmail.com";
        venue.description = "testing123!";
        venue.capacity = 20;
        venue.postcode = 3030;
        venue.ownerID = user.id;
        venue.phone = "0444123086";
        venue.rate = 50;
        venue.state = "VIC";
        venue.suitability = "formal";
        venue.suburb = "Melbourne";
        await venueRepo.save(venue);

        //expected results to compare the actual result to
        const expectedData = {
            "venues": [
                 {
                    name: "Test",
                    ownerID: user.id
                }
            ]
        }

        const response = await request(app).post("/graphql")
        .set("Content-Type", "application/json")
        .send({
            query: `
                query {
                    venues {
                        name
                        ownerID
                    }
                }
            `
        });

    expect(response.body.data).toStrictEqual(expectedData);

    }); 

    //TEST 3: testing getting 1 venue
    it("Should return the specific venues when they exist", async () => {
        const userRepo = AppDataSource.getRepository(User);
        // create a mock owner for each test
        const user = new User();
        user.firstName = "Test";
        user.lastName = "User";
        user.email = "example@gmail.com";
        user.password = "testing123!";
        user.type = "vendor";
        user.phoneNumber = "0444123086"
        // save the mock owner
        await userRepo.save(user);

        // Create a test venue
        const venueRepo = AppDataSource.getRepository(Venue);
        const venue = new Venue();

        venue.name = "Test";
        venue.address = "User";
        venue.email = "example@gmail.com";
        venue.description = "testing123!";
        venue.capacity = 20;
        venue.postcode = 3030;
        venue.ownerID = user.id;
        venue.phone = "0444123086";
        venue.rate = 50;
        venue.state = "VIC";
        venue.suitability = "formal";
        venue.suburb = "Melbourne";

        await venueRepo.save(venue);

        //get the venue from the database
        const response = await request(app).post("/graphql")
        .set("Content-Type", "application/json")
        .send({
            query: `
                query GetVenue($id: ID!) {
                    venue (id: $id) {
                        name
                        address
                        email
                        description
                        ownerID
                        phone
                    }
                }
            `, 
            variables: {
                id: venue.id,
            }
        });

        expect(response.status).toBe(200);
        expect(response.body.data.venue.name).toBe("Test");
        expect(response.body.data.venue.address).toBe("User");
        expect(response.body.data.venue.email).toBe("example@gmail.com");
        expect(response.body.data.venue.description).toBe("testing123!");
        expect(response.body.data.venue.ownerID).toBe(user.id);
        expect(response.body.data.venue.phone).toBe("0444123086");
    });

    //TEST 4: testing if error is returned
    it("should return 400 when a Venue does not exist", async () => {
        // const response = await request(app).get("/api/venues/999");

        //get the venue from the database
        const response = await request(app).post("/graphql")
        .set("Content-Type", "application/json")
        .send({
            query: `
                query {
                    venues(id: $id) {
                        name
                        address
                        email
                        description
                        ownerID
                        phone
                    }
                }
            `, 
            variables: {
                id: 999
            }
        
        });

        expect(response.status).toBe(400);
    });

    // --------------------------------------- TESTING MUTATIONS -----------------------------------------
    //TEST 5: creating a new venue
    it("should create a new venue", async () => {
        const userRepo = AppDataSource.getRepository(User);
        // create a mock owner for each test
        const user = new User();
        user.firstName = "Test";
        user.lastName = "User";
        user.email = "example@gmail.com";
        user.password = "testing123!";
        user.type = "vendor";
        user.phoneNumber = "0444123086"
        // save the mock owner
        await userRepo.save(user);

        //make a new venue and save it
        const response = await request(app).post("/graphql")
        .set("Content-Type", "application/json")
        .send({
            query: `
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
            `,
            variables: {
                id: 1,
                name: "Test",
                address: "User",
                email: "example@gmail.com",
                description: "testing123!",
                capacity: 20,
                postcode: 3030,
                ownerID: user.id,
                phone: "0444123086",
                rate: 50,
                state: "VIC",
                suitability: "formal",
                suburb: "Melbourne",
            }
        });

        console.log("response retuend was ", response.body.data);

        expect(response.status).toBe(200);
        expect(response.body.data.createVenue.name).toBe("Test");
        expect(response.body.data.createVenue.address).toBe("User");
        expect(response.body.data.createVenue.email).toBe("example@gmail.com");
        expect(response.body.data.createVenue.description).toBe("testing123!");
        expect(response.body.data.createVenue.ownerID).toBe(user.id);
        expect(response.body.data.createVenue.phone).toBe("0444123086");
    });

    //TEST 6: error should be returned for invalid venue
    it("should return 400 when required fields are missing", async () => {

        //make a new venue and save it with multiple missing values
        const response = await request(app).post("/graphql")
        .set("Content-Type", "application/json")
        .send({
            query: `
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
            `,
            variables: {
                id: 1,
                name: "Test",
                address: "User",
                // email: "example@gmail.com", //missing value
                description: "testing123!",
                capacity: 20,
                postcode: 3030,
                // ownerID: user.id, //missing value
                phone: "0444123086",
                rate: 50,
                state: "VIC",
                suitability: "formal",
                suburb: "Melbourne",
            }
        });

        expect(response.status).toBe(400);
    });



});

