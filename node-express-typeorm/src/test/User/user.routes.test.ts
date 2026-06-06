import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../../app";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";


describe("User Routes - Testing User API Endpoints", () => {
  beforeEach(async () => {
    // Clear the users table before each test
    const userRepo = AppDataSource.getRepository(User);
    await userRepo.clear();
  });

  // getting all the users
  describe("GET /api/users", () => {
    it("should return an empty array when no users exist", async () => {
      const response = await request(app).get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all users when they exist", async () => {
      // Create a test user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.firstName = "Test";
      user.lastName = "User";
      user.email = "example@gmail.com";
      user.password = "testing123!";
      user.type = "hirer";
      user.phoneNumber = "0444123086"

      await userRepo.save(user);

      const response = await request(app).get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].firstName).toBe("Test");
      expect(response.body[0].lastName).toBe("User");
      expect(response.body[0].email).toBe("example@gmail.com");
      expect(response.body[0].password).toBe("testing123!");
      expect(response.body[0].type).toBe("hirer");
      expect(response.body[0].phoneNumber).toBe("0444123086");
    });
  });


  // getting a specific user
  describe("GET /api/users/:id", () => {
    it("should return the specific user when they exist", async () => {
      // Create a test user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.firstName = "Test";
      user.lastName = "User";
      user.email = "example@gmail.com";
      user.password = "testing123!";
      user.type = "hirer";
      user.phoneNumber = "0444123086"

      await userRepo.save(user);
      let response = await request(app).get("/api/users");
      expect(response.status).toBe(200);

      // now get that user
      response = await request(app).get(`/api/users/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("Test");
      expect(response.body.lastName).toBe("User");
      expect(response.body.email).toBe("example@gmail.com");
      expect(response.body.password).toBe("testing123!");
      expect(response.body.type).toBe("hirer");
      expect(response.body.phoneNumber).toBe("0444123086");
    });

    it("should return 404 when a User does not exist", async () => {
      const response = await request(app).get("/api/users/999");
      expect(response.status).toBe(404);
    });
  });


  // creating a new user
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const user = {
        firstName : "Test",
        lastName : "User",
        email : "example@gmail.com",
        password : "testing123!",
        type : "vendor",
        phoneNumber : "0400000001"
      };

      const response = await request(app).post("/api/users").send(user);

      expect(response.status).toBe(201);
      // cannot test password due to the hashing
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
      expect(response.body.email).toBe(user.email);
      expect(response.body.type).toBe(user.type);
      expect(response.body.phoneNumber).toBe(user.phoneNumber);
    });

    it("should return 400 when required fields are missing", async () => {
      const invalidUser = {
        firstName : "Test",
        lastName : "User",
        email : "example@gmail.com",
        password : "testing123!",
        type : "vendor",
      };

      const response = await request(app).post("/api/users").send(invalidUser);

      expect(response.status).toBe(400);
    });
  });


  // updating a user
  describe("PUT /api/users/:id", () => {
    it("should update a specific User", async () => {
      // Create a test user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.firstName = "Test";
      user.lastName = "User";
      user.email = "example@gmail.com";
      user.password = "testing123!";
      user.type = "hirer";
      user.phoneNumber = "0444123086"

      // save thr user in the repo
      await userRepo.save(user);

      // now get the specific user & update their details
      let response = await request(app).get(`/api/users/${user.id}`);
      expect(response.status).toBe(200);
      
      let updatedUser = response.body;
      updatedUser.firstName = "Test Updating";

      response = await request(app).put(`/api/users/${updatedUser.id}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("Test Updating");
    });

    
    // this is blocked by dtos
    // it("should return 400 when a User updation has an invalid change", async () => {
    //   // Create a test user
    //   const userRepo = AppDataSource.getRepository(User);
    //   const user = new User();
    //   user.firstName = "Test";
    //   user.lastName = "User";
    //   user.email = "example@gmail.com";
    //   user.password = "testing123!";
    //   user.type = "hirer";
    //   user.phoneNumber = "0444123086"

    //   // save the user to the repo
    //   await userRepo.save(user);

    //   // now get the specific user & update their details
    //   let response = await request(app).get(`/api/users/${user.id}`).send(user);
    //   expect(response.status).toBe(200);
      
    //   let updatedUser = response.body;
    //   updatedUser.type = "Test Errors";

    //   response = await request(app).put(`/api/users/${updatedUser.id}`);
    //   expect(response.status).toBe(400);
    // });
  });


  // deleting a user
  describe("DELETE /api/users/:id", () => {
    it("should delete a specific User", async () => {
      // Create a test user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.firstName = "Test";
      user.lastName = "User";
      user.email = "example@gmail.com";
      user.password = "testing123!";
      user.type = "hirer";
      user.phoneNumber = "0444123086"

      // save it to the repo
      await userRepo.save(user);

      // now delete the specific user
      const response = await request(app).delete(`/api/users/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User removed successfully");
    });

    it("should return 404 when deleting a User who does not exist already", async () => {
      const response = await request(app).delete("/api/users/999");
      expect(response.status).toBe(404);
    });
  });

});
