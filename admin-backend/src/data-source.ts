//this file references lots of code from week 8 lab

// DETAILS:
// - this configures the connection between node.js application and mssql database using typeorm
// - sets up mssql database connection with dev settings and entity definitions
// - also updates table during development, sql query logging (debugging, typeorm integration

import "reflect-metadata"
import { DataSource} from "typeorm"
//omg with veronika's code you don't have to import everything
// import {User} from './entities/User'
// import {Venue} from './entities/Venue'
// import {Application} from './entities/Application'
// import {ShortlistedVenue} from './entities/ShortlistedVenue'
// import {Unavailable} from './entities/Unavailable'

export const AppDataSource = new DataSource({
    type: "mssql",
    host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
    username: "s4164624",
    password: "s_4164624",
    database: "s4164624", //or username??
    options: {
        encrypt: false,
    },
    synchronize: false, //set to false IN PRODUCTION to prevent data loss
    logging: true,
    entities: ["src/entities/**/*.{js,ts}"], //add entities here
    migrations: [],
    subscribers: [],
});