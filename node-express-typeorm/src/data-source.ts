//this file references lots of code from week 8 lab

// DETAILS:
// - this configures the connection between node.js application and mssql database using typeorm
// - sets up mssql database connection with dev settings and entity definitions
// - also updates table during development, sql query logging (debugging, typeorm integration

import "reflect-metadata"
import { DataSourceOptions, DataSource} from "typeorm"
//import entities here
import { User } from './entities/User'
import { Venue } from './entities/Venue'
import { Application } from './entities/Application'
import { ShortlistedVenue } from './entities/ShortlistedVenue'
import { Unavailable } from './entities/Unavailable'


const isTesting = process.env.NODE_ENV === "test";

const sqliteConfig: DataSourceOptions = {
  type: "sqlite",
  database: isTesting ? ":memory:" : "database.sqlite",
  entities: [User, Venue, Application, ShortlistedVenue, Unavailable],
  synchronize: true,
  logging: true,
};


const mssqlConfig: DataSourceOptions = {
    type: "mssql",
    host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
    username: "s4164624",
    password: "Password_1",
    database: "s4164624",
    options: {
        encrypt: false,
    },
    synchronize: true, //set to false IN PRODUCTION to prevent data loss
    logging: true,
    entities: [User, Venue, Application, ShortlistedVenue, Unavailable], //add entities here
    migrations: [],
    subscribers: [],
};


export const AppDataSource = new DataSource(
  isTesting ? sqliteConfig : mssqlConfig
);