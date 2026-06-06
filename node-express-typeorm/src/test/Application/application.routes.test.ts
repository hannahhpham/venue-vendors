import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Venue } from "../../entities/Venue";
import { Application } from "../../entities/Application";

describe("Application Routes - Testing Application API Endpoints", () => {
    beforeAll(async () => {
        // Clear the applications table before each test
        const appRepo = AppDataSource.getRepository(Application);
        await appRepo.clear();

        const venueRepo = AppDataSource.getRepository(Venue);
        await venueRepo.clear();

        const userRepo = AppDataSource.getRepository(User);
        userRepo.clear();

        // mock hirer
        const hirer = new User();
        hirer.firstName = "Hirer";
        hirer.lastName = "Test";
        hirer.email = "hirer@vv.com";
        hirer.password = "hirer123!";
        hirer.type = "hirer";
        hirer.phoneNumber = "0444123086"
        // save the mock owner
        let res = userRepo.create(hirer);
        await userRepo.save(res);

        // mock vendor
        const vendor = new User();
        vendor.firstName = "Vendor";
        vendor.lastName = "Test";
        vendor.email = "vendor@vv.com";
        vendor.password = "vendor123!";
        vendor.type = "vendor";
        vendor.phoneNumber = "0444122086"
        // save the mock owner
        res = userRepo.create(vendor);
        await userRepo.save(res);

        // mock venue
        const venue = new Venue();
        venue.name = "Test";
        venue.address = "User";
        venue.email = "example@gmail.com";
        venue.description = "testing123!";
        venue.capacity = 20;
        venue.postcode = 3030;
        venue.ownerID = 2;
        venue.phone = "0444123086";
        venue.rate = 50;
        venue.state = "VIC";
        venue.suitability = "formal";
        venue.suburb = "Melbourne";
        // save the mock venue
        const res2 = venueRepo.create(venue);
        await venueRepo.save(res2);
    });

    // getting all the applications
    describe("GET /api/applications", () => {
        it("should return an empty array when no applications exist", async () => {
            const response = await request(app).get("/api/applications");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it("should return all applications when they exist", async () => {
            const appRepo = AppDataSource.getRepository(Application);

            // create a mock application for each test
            const apply = new Application();
            apply.eventName = "Test Event";
            apply.date = new Date("2026-06-18");
            apply.description = "An awesome time!";
            apply.startTime = "09:00";
            apply.endTime = "17:00";
            apply.guests = 20;
            apply.rank = -1;
            apply.hirerID = 1;
            apply.venueID = 1;

            // save the mock application
            await appRepo.save(apply);

            // a select few of the attributes have been tested
            const response = await request(app).get("/api/applications");
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].eventName).toBe("Test Event");
            expect(response.body[0].date).toBe("2026-06-18");
            expect(response.body[0].startTime).toBe("09:00");
            expect(response.body[0].endTime).toBe("17:00");
            expect(response.body[0].guests).toEqual(20);
            expect(response.body[0].venueID).toBe(1);
            expect(response.body[0].hirerID).toBe(1);
        });
    });


    // getting a specific Application
    describe("GET /api/applications/:id", () => {
        it("should return the specific application when they exist", async () => {
            const appRepo = AppDataSource.getRepository(Application);

            // create a mock application for each test
            const apply = new Application();
            apply.eventName = "Test Event";
            apply.date = new Date("2026-06-18");
            apply.description = "An awesome time!";
            apply.startTime = "09:00";
            apply.endTime = "17:00";
            apply.guests = 20;
            apply.rank = -1;
            apply.hirerID = 1;
            apply.venueID = 1;

            // save the mock application
            await appRepo.save(apply);

            // now get that venue
            const response = await request(app).get(`/api/applications/${apply.id}`);
            expect(response.status).toBe(200);
            expect(response.body.eventName).toBe("Test Event");
            expect(response.body.date).toBe("2026-06-18");
            expect(response.body.startTime).toBe("09:00");
            expect(response.body.endTime).toBe("17:00");
            expect(response.body.guests).toEqual(20);
            expect(response.body.venueID).toBe(1);
            expect(response.body.hirerID).toBe(1);
        });

        it("should return 404 when an Application does not exist", async () => {
            const response = await request(app).get("/api/applications/999");
            expect(response.status).toBe(404);
        });
    });


    // creating a new Applciation
    describe("POST /api/applications", () => {
        it("should create a new application", async () => {
            const appRepo = AppDataSource.getRepository(Application);

            // create a mock application for each test
            const apply = {
                eventName : "Test Event",
                date : new Date("2026-06-18T00:00:00.000Z"),
                description : "An awesome time!",
                startTime : "09:00",
                endTime : "17:00",
                guests : 20,
                rank : -1,
                hirerID : 1,
                venueID : 1,
            }

            const response = await request(app).post("/api/applications").send(apply);
            expect(response.status).toBe(201);
            expect(response.body.eventName).toBe("Test Event");
            expect(response.body.date).toBe("2026-06-18T00:00:00.000Z");
            expect(response.body.startTime).toBe("09:00");
            expect(response.body.endTime).toBe("17:00");
            expect(response.body.guests).toEqual(20);
            expect(response.body.venueID).toBe(1);
            expect(response.body.hirerID).toBe(1);
        });

        it("should return 500 when required fields are missing", async () => {
            // create a mock application - no guest count given
            const applyInvalid = {
                eventName : "Test Event",
                date : new Date("2026-06-18T00:00:00.000Z"),
                description : "An awesome time!",
                startTime : "09:00",
                endTime : "17:00",
                rank : -1,
                hirerID : 1,
                venueID : 1,
            }

            const response = await request(app).post("/api/applications").send(applyInvalid);
            expect(response.status).toBe(500);
        });
    });


    // updating a Application
    describe("PUT /api/applications/:id", () => {
        it("should update a specific Application", async () => {
            const appRepo = AppDataSource.getRepository(Application);

            // create a mock application for each test
            const apply = new Application();
            apply.eventName = "Test Event";
            apply.date = new Date("2026-06-18");
            apply.description = "An awesome time!";
            apply.startTime = "09:00";
            apply.endTime = "17:00";
            apply.guests = 20;
            apply.rank = -1;
            apply.hirerID = 1;
            apply.venueID = 1;

            // save the mock application
            await appRepo.save(apply);

            // now get the specific venue & update its details
            let response = await request(app).get(`/api/applications/${apply.id}`);
            expect(response.status).toBe(200);

            let updatedApp = response.body;
            updatedApp.eventName = "Test Updating Event";

            response = await request(app).put(`/api/applications/${updatedApp.id}`).send(updatedApp);
            expect(response.status).toBe(200);
            expect(response.body.eventName).toBe("Test Updating Event");
        });


        // can't do this bc it accepts anything - there's no validation
        // it("should return 500 when a Venue updation has an invalid change", async () => {
        //     const appRepo = AppDataSource.getRepository(Application);

        //     // create a mock application for each test
        //     const apply = new Application();
        //     apply.eventName = "Test Event";
        //     apply.date = new Date("2026-06-18");
        //     apply.description = "An awesome time!";
        //     apply.startTime = "09:00";
        //     apply.endTime = "17:00";
        //     apply.guests = 20;
        //     apply.rank = -1;
        //     apply.hirerID = 1;
        //     apply.venueID = 1;

        //     // save the mock application
        //     await appRepo.save(apply);

        //     // now get the specific venue & update its details
        //     let response = await request(app).get(`/api/applications/${apply.id}`);
        //     expect(response.status).toBe(200);

        //     let updatedApp = response.body;
        //     updatedApp.guests = null;

        //     response = await request(app).put(`/api/applications/${updatedApp.id}`).send(updatedApp);
        //     expect(response.body.guests).toBe("jwno");
        //     expect(response.status).toBe(500);
        // });
    });


    // deleting a application
    describe("DELETE /api/applications/:id", () => {
        it("should delete a specific Venue", async () => {
            const appRepo = AppDataSource.getRepository(Application);

            // create a mock application for each test
            const apply = new Application();
            apply.eventName = "Test Event";
            apply.date = new Date("2026-06-18");
            apply.description = "An awesome time!";
            apply.startTime = "09:00";
            apply.endTime = "17:00";
            apply.guests = 20;
            apply.rank = -1;
            apply.hirerID = 1;
            apply.venueID = 1;

            // save the mock application
            await appRepo.save(apply);

            // now delete the specific user
            const response = await request(app).delete(`/api/applications/${apply.id}`);
            expect(response.status).toBe(204);
        });

        it("should return 404 when deleting an Application which does not exist", async () => {
            const response = await request(app).delete("/api/applications/999");
            expect(response.status).toBe(404);
        });
    });

});
