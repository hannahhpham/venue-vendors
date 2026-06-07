import "@jest/globals";
import { AppDataSource } from "../data-source";
import { afterAll, beforeAll } from "@jest/globals";

//to distinguish sqlite boolean from mssql bit
process.env.NODE_ENV = "test";

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error("Error during test database initialization:", error);
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
