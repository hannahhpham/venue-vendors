import { describe, it, expect,  beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Venue } from "../entities/Venue";
import app from '../app'
import {graphql} from '../app'

//graphql testing references: 
//- lecture 9 example 3
//- main project tests
//-https://dev.to/joaosc17/testing-a-graphql-application-with-jest-and-supertest-1353
//-https://www.preciouschicken.com/blog/posts/jest-testing-graphql-api/

describe("Testing graphQL API Endpoint for Venue Related Tests", () => {
    beforeAll(async () => {

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

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    // it("Should return an empty array when no venues exist", async () => {
    //         const response = await request(app).post("/graphql");
    //         expect(response.status).toBe(200);
    //         expect(response.body).toEqual([]);
    // });

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

        //expected results
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

        // return fetch("https://localhost:4001/graphql", {
        //     method: 'POST',
        //     body: JSON.stringify({query: 
        //         `query {
        //             venues {
        //                 name         
        //                 ownerID
        //             }
        //         }`
        //     })
        // })
        // .then(res => res.json())
        // .then(res => expect(res.data).toStrictEqual(expectedData));
    }); 

    //template
    // it("Return all venues in the database", () => {

    // }); 


});

