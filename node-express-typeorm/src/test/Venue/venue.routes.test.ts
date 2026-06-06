import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Venue } from "../../entities/Venue";

describe("Venue Routes - Testing Venue API Endpoints", () => {
    beforeEach(async () => {
        // Clear the users table before each test
        const venueRepo = AppDataSource.getRepository(Venue);
        await venueRepo.clear();

        // deleted last due to FK constraints
        const userRepo = AppDataSource.getRepository(User);
        await userRepo.clear();
    });

    // getting all the venues
    describe("GET /api/venues", () => {
        it("should return an empty array when no venues exist", async () => {
            const response = await request(app).get("/api/venues");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it("should return all venues when they exist", async () => {
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

            // a selcect few of the attributes have been tested
            const response = await request(app).get("/api/venues");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].name).toBe("Test");
            expect(response.body[0].address).toBe("User");
            expect(response.body[0].email).toBe("example@gmail.com");
            expect(response.body[0].description).toBe("testing123!");
            expect(response.body[0].ownerID).toBe(user.id);
            expect(response.body[0].phone).toBe("0444123086");
        });
    });


    // getting a specific venue
    describe("GET /api/venues/:id", () => {
        it("should return the specific venues when they exist", async () => {
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

            // now get that venue
            const response = await request(app).get(`/api/venues/${venue.id}`);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Test");
            expect(response.body.address).toBe("User");
            expect(response.body.email).toBe("example@gmail.com");
            expect(response.body.description).toBe("testing123!");
            expect(response.body.ownerID).toBe(user.id);
            expect(response.body.phone).toBe("0444123086");
        });

        it("should return 404 when a Venue does not exist", async () => {
            const response = await request(app).get("/api/venues/999");
            expect(response.status).toBe(404);
        });
    });


    // creating a new venue
    describe("POST /api/venues", () => {
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

            // Create a test venue
            const venue = {
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
            };

            const response = await request(app).post("/api/venues").send(venue);
            expect(response.status).toBe(201);
            expect(response.body.name).toBe("Test");
            expect(response.body.address).toBe("User");
            expect(response.body.email).toBe("example@gmail.com");
            expect(response.body.description).toBe("testing123!");
            expect(response.body.ownerID).toBe(user.id);
            expect(response.body.phone).toBe("0444123086");
        });

        it("should return 400 when required fields are missing", async () => {
            // missing ownerID - FK Constraint
            const invalidVenue = {
                name: "Test",
                address: "User",
                email: "example@gmail.com",
                description: "testing123!",
                capacity: 20,
                postcode: 3030,
                phone: "0444123086",
                rate: 50,
                state: "VIC",
                suitability: "formal",
                suburb: "Melbourne",
            };

            const response = await request(app).post("/api/venues").send(invalidVenue);

            expect(response.status).toBe(400);
        });
    });


    // updating a Venue
    describe("PUT /api/venues/:id", () => {
        it("should update a specific Venue", async () => {
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

            // save the venue
            await venueRepo.save(venue);

            // now get the specific venue & update its details
            let response = await request(app).get(`/api/venues/${venue.id}`);
            expect(response.status).toBe(200);

            let updatedVenue = response.body;
            updatedVenue.name = "Test Updating";

            response = await request(app).put(`/api/venues/${updatedVenue.id}`).send(updatedVenue);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Test Updating");
        });


        // can't test bc of the dtos
        // it("should return 404 when a Venue updation has an invalid change", async () => {
        //     const userRepo = AppDataSource.getRepository(User);
        //     // create a mock owner for each test
        //     const user = new User();
        //     user.firstName = "Test";
        //     user.lastName = "User";
        //     user.email = "example@gmail.com";
        //     user.password = "testing123!";
        //     user.type = "vendor";
        //     user.phoneNumber = "0444123086"
        //     // save the mock owner
        //     await userRepo.save(user);

        //     // Create a test venue
        //     const venueRepo = AppDataSource.getRepository(Venue);
        //     const venue = new Venue();
        //     venue.name = "Test";
        //     venue.address = "User";
        //     venue.email = "example@gmail.com";
        //     venue.description = "testing123!";
        //     venue.capacity = 20;
        //     venue.postcode = 3030;
        //     venue.ownerID = user.id;
        //     venue.phone = "0444123086";
        //     venue.rate = 50;
        //     venue.state = "VIC";
        //     venue.suitability = "formal";
        //     venue.suburb = "Melbourne";
        //     // save the venue
        //     await venueRepo.save(venue);

        //     // now get the specific venue & update its details
        //     let response = await request(app).get(`/api/venues/${venue.id}`);
        //     expect(response.status).toBe(200);

        //     let updatedVenue = response.body;
        //     updatedVenue.email = "Test Updation Errors";

        //     response = await request(app).put(`/api/venues/${updatedVenue.id}`).send(updatedVenue);
        //     expect(response.status).toBe(404);
        // });
    });


    // deleting a venue
      describe("DELETE /api/venues/:id", () => {
        it("should delete a specific Venue", async () => {
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

            // save the venue
            await venueRepo.save(venue);

          // now delete the specific user
          const response = await request(app).delete(`/api/venues/${venue.id}`);
          expect(response.status).toBe(204);
        });

        it("should return 404 when deleting a Venue which does not exist", async () => {
          const response = await request(app).delete("/api/venues/999");
          expect(response.status).toBe(404);
        });
      });

});
