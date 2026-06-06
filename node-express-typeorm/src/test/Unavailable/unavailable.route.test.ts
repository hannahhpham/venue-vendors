import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Venue } from "../../entities/Venue";
import { Unavailable } from "../../entities/Unavailable";

describe("Unavailable Routes - Testing Unavailable API Endpoints", () => {
    beforeAll(async () => {
        // Clear the unavailable table before each test
        const blockRepo = AppDataSource.getRepository(Unavailable);
        await blockRepo.clear();

        const venueRepo = AppDataSource.getRepository(Venue);
        await venueRepo.clear();

        const userRepo = AppDataSource.getRepository(User);
        userRepo.clear();

        // mock vendor
        const vendor = new User();
        vendor.firstName = "Vendor";
        vendor.lastName = "Test";
        vendor.email = "vendor@vv.com";
        vendor.password = "vendor123!";
        vendor.type = "vendor";
        vendor.phoneNumber = "0444122086"
        // save the mock owner
        const res = userRepo.create(vendor);
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

    // getting all the blocked periods
    describe("GET /api/unavailable", () => {
        it("should return an empty array when no blocked periods exist", async () => {
            const response = await request(app).get("/api/unavailable");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it("should return all unavailable periods when they exist", async () => {
            const blockRepo = AppDataSource.getRepository(Unavailable);

            // create a mock blocked period
            const block = new Unavailable();
            block.date = new Date("2026-06-18");
            block.startTime = "09:00";
            block.endTime = "17:00";
            block.venueID = 1;

            // save the mock period
            await blockRepo.save(block);

            // verify the inputs match
            const response = await request(app).get("/api/unavailable");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].date).toBe("2026-06-18");
            expect(response.body[0].startTime).toBe("09:00");
            expect(response.body[0].endTime).toBe("17:00");
            expect(response.body[0].venueID).toBe(1);
        });
    });


    // getting a specific Unavailable
    describe("GET /api/unavailable/:id", () => {
        it("should return the specific blocked period when they exist", async () => {
            const blockRepo = AppDataSource.getRepository(Unavailable);

            // create a mock blocked period for each test
            const block = new Unavailable();
            block.date = new Date("2026-06-18");
            block.startTime = "09:00";
            block.endTime = "17:00";
            block.venueID = 1;

            // save the mock period
            await blockRepo.save(block);

            // now get that period
            const response = await request(app).get(`/api/unavailable/${block.id}`);
            expect(response.status).toBe(200);
            expect(response.body.date).toBe("2026-06-18");
            expect(response.body.startTime).toBe("09:00");
            expect(response.body.endTime).toBe("17:00");
            expect(response.body.venueID).toBe(1);
        });

        it("should return 404 when an Unavailable does not exist", async () => {
            const response = await request(app).get("/api/unavailable/999");
            expect(response.status).toBe(404);
        });
    });


    // creating a new Applciation
    describe("POST /api/unavailable", () => {
        it("should create a new application", async () => {
            // create a mock blocked period for each test
            const block = {
                date : new Date("2026-06-18T00:00:00.000Z"),
                startTime : "09:00",
                endTime : "17:00",
                venueID : 1,
            }

            const response = await request(app).post("/api/unavailable").send(block);
            expect(response.status).toBe(201);
            expect(response.body.date).toBe("2026-06-18T00:00:00.000Z");
            expect(response.body.startTime).toBe("09:00");
            expect(response.body.endTime).toBe("17:00");
            expect(response.body.venueID).toBe(1);
        });

        it("should return 500 when required fields are missing", async () => {
            // create a mock blocked period - no date given
            const blockInvalid = {
                startTime : "09:00",
                endTime : "17:00",
                venueID : 1,
            }

            const response = await request(app).post("/api/unavailable").send(blockInvalid);
            expect(response.status).toBe(500);
        });
    });


    // updating a Unavailable
    describe("PUT /api/unavailable/:id", () => {
        it("should update a specific Unavailable", async () => {
            const blockRepo = AppDataSource.getRepository(Unavailable);

            // create a mock application for each test
            const block = new Unavailable();
            block.date = new Date("2026-06-18T00:00:00.000Z");
            block.startTime = "09:00";
            block.endTime = "17:00";
            block.venueID = 1;

            // save the mock application
            await blockRepo.save(block);

            // now get the specific venue & update its details
            let response = await request(app).get(`/api/unavailable/${block.id}`);
            expect(response.status).toBe(200);

            let updatedBlock = response.body;
            updatedBlock.date = new Date("2026-06-30T00:00:00.000Z");

            response = await request(app).put(`/api/unavailable/${updatedBlock.id}`).send(updatedBlock);
            expect(response.status).toBe(200);
            expect(response.body.date).toBe("2026-06-30T00:00:00.000Z");
        });


        it("should return 500 when a Blocked period updation has an invalid change", async () => {
            const blockRepo = AppDataSource.getRepository(Unavailable);

            // create a mock application for each test
            const block = new Unavailable();
            block.date = new Date("2026-06-18");
            block.startTime = "09:00";
            block.endTime = "17:00";
            block.venueID = 1;

            // save the mock application
            await blockRepo.save(block);

            // now get the specific venue & update its details
            let response = await request(app).get(`/api/unavailable/${block.id}`);
            expect(response.status).toBe(200);

            let updatedBlock = response.body;
            updatedBlock.date = new Date("2026-06-18ft6yguhij");

            response = await request(app).put(`/api/unavailable/${updatedBlock.id}`).send(updatedBlock);
            expect(response.status).toBe(500);
        });
    });


    // deleting a application
    describe("DELETE /api/unavailable/:id", () => {
        it("should delete a specific Venue", async () => {
            const blockRepo = AppDataSource.getRepository(Unavailable);

            // create a mock blocked period for each test
            const block = new Unavailable();
            block.date = new Date("2026-06-18");
            block.startTime = "09:00";
            block.endTime = "17:00";
            block.venueID = 1;

            // save the mock period
            await blockRepo.save(block);

            // now delete the specific blocked period
            const response = await request(app).delete(`/api/unavailable/${block.id}`);
            expect(response.status).toBe(204);
        });

        it("should return 404 when deleting an Unavailable which does not exist", async () => {
            const response = await request(app).delete("/api/unavailable/999");
            expect(response.status).toBe(404);
        });
    });

});
