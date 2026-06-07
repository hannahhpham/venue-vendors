[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23728555&assignment_repo_type=AssignmentRepo)

## Github Link
Click here: [Github link](https://github.com/rmit-fsd-2026-s1/a2-fsdpra01-07tue2-30pmveronikateam7)

ER Diagram: [Here](https://lucid.app/lucidchart/1a83b8c0-cbd1-4331-a1d0-6c9d3a8d1767/edit?beaconFlowId=6008D67B83EE8E45&page=0_0&invitationId=inv_0daf918d-d3b0-49ab-9d0e-26c9e19aff96#)

# Web Services
Main Project Backend (refer to .env file for endpoints): 
- https://a2-fsdpra01-07tue2-30pmveronikateam7.onrender.com/api
Main Project Frontend:
- 
Admin Backend: Has Apollo Sandbox available for testing
- https://a2-fsdpra01-07tue2-30pmveronikateam7-j3eq.onrender.com/graphql
Admin Frontend: Admin username and password is 'admin'
- https://a2-fsdpra01-07tue2-30pmveronikateam7-iy7x.onrender.com


# Installation details:
After running npm install, please also use the commands below in each project:
- main frontend:
```bash
npm install chartjs chart.js react-chartjs-2 chartjs-adapter-date-fns date-fns
```
- main backend: please install typeorm 

- admin frontend:
```bash
npm install jspdf html2canvas-pro
```

- admin backend: please install graphql
```bash
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest better-sqlite3
```

# FOR TESTING
pls install:
```bash
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
npm install --save-dev supertest @types/supertest
npm install sqlite3
```
- if installing sqlite3 version 5.0.1 doen't work, download version 5.0.3


# Database Details
We are using Hannah Pham's database details for data storage. Details can be found below:
- Username: s4164624
- Password:

# Website URLS
- Vendor and Hirer Frontend:
- Vendor and Hirer Backend:
- Admin Frontend:
- Admin Backend:

## Vendor Explanations
# TO DO:
- fix the rounding of the stars in applications
- fix all the repurposed carousels - (home shows 5 never ending venues  |   in the hirer's past applications, it displays error message when none have been hirer)
- fix up the sorting by reputation
- merge stuff into the context files to clean up [id].tsx particularly
- do applications need to be validated bc currently they aren't ...
- look at file size requirements when it comes to docs - i don't think anything was enforced here

## Hirer Explanations
- credibility and reputation explanations here 

## AI Use
- ChatGPT was used to generate venue details (eg: venue name, phone number, description)
- ChatGPT was also used to generate application details (eg: application description, event name)

## References for TypeOrm/Database Stuff
- lab week 7 and 8
- lecture code and slideshows: week 9, 11, 12 
- Veronika's FSD Miro Board: https://au.miro.com/app/board/u3jVOfyZVek=/
- MatsT (2010). Creation date column in SQL table. [online] Stack Overflow. Available at: https://stackoverflow.com/questions/2737763/creation-date-column-in-sql-table [Accessed 1 May 2026].
- Typeorm.io. (2025). Entities | TypeORM. [online] Available at: https://typeorm.io/docs/entity/entities/ [Accessed 1 May 2026].
- Typeorm.io. (2026). Decorator reference | TypeORM. [online] Available at: https://typeorm.io/docs/help/decorator-reference/ [Accessed 1 May 2026].
- ‌Typeorm.io. (2026). Many-to-many relations | TypeORM. [online] Available at: https://typeorm.io/docs/relations/many-to-many-relations [Accessed 6 May 2026].
- Ben Awad (2019) 'Cascade Delete TypeORM' [video], YouTube website, accessed 14 May 2026. https://www.youtube.com/watch?v=S1pxdAL2Dz8
- npmjs, “class-validator,” npmjs, Feb. 26, 2026. https://www.npmjs.com/package/class-validator (accessed May 19, 2026).
- https://stackoverflow.com/questions/72801198/apollo-client-refetch-queries
- SVOBOL. TypeORM column type dependent on database. [online] Stack Overflow. Available at: https://stackoverflow.com/questions/49463691/typeorm-column-type-dependant-on-database [Accessed 6 June 2026]
- https://medium.com/@wathsaradesilva2000/create-pdfs-in-react-using-jspdf-and-html2canvas-aa59667438fc
- https://dev.to/joaosc17/testing-a-graphql-application-with-jest-and-supertest-1353
- https://www.preciouschicken.com/blog/posts/jest-testing-graphql-api/
- “Setup and Teardown · Jest,” Jestjs.io, May 07, 2026. https://jestjs.io/docs/setup-teardown (accessed June 07, 2026).
‌- https://www.contentful.com/blog/how-to-use-graphql-variables/
- https://www.apollographql.com/docs/apollo-server/api/plugin/landing-pages 