import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Venue } from "../../entities/Venue";
import { ShortlistedVenue } from "../../entities/ShortlistedVenue";

describe("ShortlistedVenue Routes - Testing ShortlistedVenue API Endpoints", () => {
    beforeAll(async () => {
        // Clear the unavailable table before each test
        const shortlist = AppDataSource.getRepository(ShortlistedVenue);
        await shortlist.clear();

        const venueRepo = AppDataSource.getRepository(Venue);
        await venueRepo.clear();

        const userRepo = AppDataSource.getRepository(User);
        await userRepo.clear();

        // mock vendor
        const vendor = new User();
        vendor.firstName = "Vendor";
        vendor.lastName = "Test";
        vendor.email = "vendor@vv.com";
        vendor.password = "vendor123!";
        vendor.type = "vendor";
        vendor.phoneNumber = "0444122086"
        // save the mock owner
        let res = userRepo.create(vendor);
        await userRepo.save(res);

        // mock hirer
        const hirer = new User();
        hirer.firstName = "Hirer";
        hirer.lastName = "Test";
        hirer.email = "hirer@vv.com";
        hirer.password = "hirer123!";
        hirer.type = "hirer";
        hirer.phoneNumber = "0444123086"
        // save the mock owner
        res = userRepo.create(hirer);
        await userRepo.save(res);

        // mock venue
        const venue = new Venue();
        venue.name = "Test";
        venue.address = "Venue";
        venue.email = "example@gmail.com";
        venue.description = "testing123!";
        venue.capacity = 20;
        venue.postcode = 3030;
        venue.ownerID = 1;
        venue.phone = "0444123086";
        venue.rate = 50;
        venue.state = "VIC";
        venue.suitability = "formal";
        venue.suburb = "Melbourne";
        // save the mock venue
        const res2 = venueRepo.create(venue);
        await venueRepo.save(res2);
    });

    // getting all the blocked periods for a hirer
    describe("GET /api/shortlistedVenues/:hirerID", () => {
        it("should return an empty array when nothing is shortlisted", async () => {
            const response = await request(app).get("/api/shortlistedVenues/2");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it("should return all shortlisted venues when they exist", async () => {
            const shortlist = AppDataSource.getRepository(ShortlistedVenue);

            // create a mock blocked period
            const ranked = new ShortlistedVenue();
            ranked.rank = 4;
            ranked.venueID = 1;
            ranked.hirerID = 2;

            // save the mock period
            await shortlist.save(ranked);

            // verify the inputs match
            const response = await request(app).get("/api/shortlistedVenues/2");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].rank).toBe(4);
            expect(response.body[0].hirerID).toBe(2);
            expect(response.body[0].venueID).toBe(1);
        });
    });


    // getting a specific entry in a hirer's ShortlistedVenue
    describe("GET /api/:rank/shortlistedVenues/:hirerID", () => {
        it("should return the specific shortlisted item when they exist", async () => {
            const shortlist = AppDataSource.getRepository(ShortlistedVenue);

            // create a mock shortlisted venue
            const ranked = new ShortlistedVenue();
            ranked.rank = 4;
            ranked.venueID = 1;
            ranked.hirerID = 2;

            // save the mock shortlist
            await shortlist.save(ranked);

            // now get that shortlist
            const response = await request(app).get(`/api/${ranked.rank}/shortlistedVenues/${ranked.hirerID}`);
            expect(response.status).toBe(200);
            expect(response.body.rank).toBe(ranked.rank);
            expect(response.body.venueID).toBe(ranked.venueID);
            expect(response.body.hirerID).toBe(ranked.hirerID);
        });

        it("should return 404 when a ShortlistedVenue does not exist", async () => {
            const response = await request(app).get("/api/999/shortlistedVenues/999");
            expect(response.status).toBe(404);
        });
    });


    // Adding to the Shortlist
    describe("POST /api/shortlistedVenues/:hirerID", () => {
        it("should create a new shortlisted item", async () => {
            // create a mock shortlisted venue
            const ranked = {
                rank : 4,
                venueID : 1,
                hirerID : 2,
            }

            const response = await request(app).post(`/api/shortlistedVenues/${ranked.hirerID}`).send(ranked);
            expect(response.status).toBe(201);
            expect(response.body.rank).toBe(ranked.rank);
            expect(response.body.venueID).toBe(ranked.venueID);
            expect(response.body.hirerID).toBe(ranked.hirerID);
        });

        it("should return 400 when required fields are missing", async () => {
            // create a mock shortlist period - no venueID given
            const rankedInvalid = {
                rank : 4,
                hirerID : 2,
            }

            const response = await request(app).post(`/api/shortlistedVenues/${rankedInvalid.hirerID}`).send(rankedInvalid);
            expect(response.status).toBe(400);
        });
    });


    // updating a ShortlistedVenue
    describe("PUT /api/shortlistedVenues/:hirerID", () => {
        it("should update a specific ShortlistedVenue", async () => {
            const shortlist = AppDataSource.getRepository(ShortlistedVenue);

            // create a mock shortlisted venue
            const ranked = new ShortlistedVenue();
            ranked.rank = 4;
            ranked.venueID = 1;
            ranked.hirerID = 2;

            // save the mock shortlist
            await shortlist.save(ranked);

            // now get the specific shortlist & update its details
            let response = await request(app).get(`/api/${ranked.rank}/shortlistedVenues/${ranked.hirerID}`);
            expect(response.status).toBe(200);

            let updated = response.body;
            updated.rank = 5;

            response = await request(app).put(`/api/shortlistedVenues/${updated.hirerID}`).send(updated);
            expect(response.status).toBe(200);
            expect(response.body.rank).toBe(5);
        });


        // gives a 200 code - which means it worked??
        it("should return 400 when an updated shortlist has an invalid change", async () => {
            const shortlist = AppDataSource.getRepository(ShortlistedVenue);

            // create a mock shortlisted venue
            const ranked = new ShortlistedVenue();
            ranked.rank = 4;
            ranked.venueID = 1;
            ranked.hirerID = 2;

            // save the mock shortlist
            await shortlist.save(ranked);

            // now get the specific shortlist venue & update its details
            let response = await request(app).get(`/api/${ranked.rank}/shortlistedVenues/${ranked.hirerID}`);
            expect(response.status).toBe(200);

            let updatedBlock = response.body;
            updatedBlock.rank = "testing invalid";

            response = await request(app).put(`/api/shortlistedVenues/${updatedBlock.hirerID}`).send(updatedBlock);
            expect(response.status).toBe(400);
        });
    });


    // deleting a application
    describe("DELETE /api/shortlistedVenues/:id", () => {
        it("should delete a specific shortlisted item", async () => {
            const shortlist = AppDataSource.getRepository(ShortlistedVenue);

            // create a mock shortlisted venue
            const ranked = new ShortlistedVenue();
            ranked.rank = 4;
            ranked.venueID = 1;
            ranked.hirerID = 2;

            // save the mock shortlist
            await shortlist.save(ranked);

            // now delete the specific shortlist period
            const response = await request(app).delete(`/api/shortlistedVenues/${ranked.hirerID}`).send({venueID: ranked.venueID});
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Venue removed from shortlist successfully");
        });

        it("should return 404 when deleting a ShortlistedVenue which does not exist", async () => {
            const response = await request(app).delete("/api/shortlistedVenues/2").send({venueID: 99});
            expect(response.status).toBe(404);
        });
    });

});
