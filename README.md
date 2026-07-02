[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23728555&assignment_repo_type=AssignmentRepo)

## Github Repo Link
Click here: [Github link](https://github.com/rmit-fsd-2026-s1/a2-fsdpra01-07tue2-30pmveronikateam7)

ER Diagram: [Here](https://lucid.app/lucidchart/1a83b8c0-cbd1-4331-a1d0-6c9d3a8d1767/edit?beaconFlowId=6008D67B83EE8E45&page=0_0&invitationId=inv_0daf918d-d3b0-49ab-9d0e-26c9e19aff96#)

# Notes
- This project is a full stack web application that was co-developed by Ananya Venkatesh Babu (Github: ananya-priv) and Hannah Alyssa Pham (Github: hannahhpham).
- This project is no longer connected to an active database. Therefore, although it's possible to access the web services, core operations will no longer work. However, we believe that it is still a valuable codebase for future employment opportunities.

# Tech Stack
- Frontend: React TS
- Backend: Node and Express with TypeORM
- Database: Cloud MSSQL Server
- Server Deployment: Render

This project uses both a REST and GraphQL API design. The REST API design can be found in the main project backend, whilst the GraphQL API design can be found in the admin project backend.

# Instructions to run the project
- You are able to use the 4 web services below to access the main project frontend, main project backend (which is contained in the folder 'backend'), admin frontend, and admin backend. 
- Alternatively, you can download the project code and run it locally on your machine. Navigate to each of the 4 respective folders, and run the command 'npm run dev'.
- To run tests, navigate to either the 'backend' or 'admin-backend' folders and run 'npm test'


# Web Services
- Main Project Backend https://a2-fsdpra01-07tue2-30pmveronikateam7.onrender.com/api
- Main Project Frontend: https://a2-fsdpra01-07tue2-30pmveronikateam7-8ltq.onrender.com
- Admin Backend: https://a2-fsdpra01-07tue2-30pmveronikateam7-j3eq.onrender.com/graphql
- Admin Frontend: https://a2-fsdpra01-07tue2-30pmveronikateam7-iy7x.onrender.com


# Installation details:
After running npm install, please also use the commands below in each project:
- main frontend:
```bash
npm install chartjs chart.js react-chartjs-2 chartjs-adapter-date-fns date-fns
```

- main backend:
```bash
npm install typeorm
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
npm install --save-dev supertest @types/supertest
npm install sqlite3     # if installing sqlite3 version 5.0.1 doen't work, download version 5.0.3
```

- admin frontend:
```bash
npm install jspdf html2canvas-pro chartjs chart.js react-chartjs-2 chartjs-adapter-date-fns date-fns
```

- admin backend: please install graphql dependencies as well
```bash
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest better-sqlite3
```

# AI Use
- ChatGPT was used to generate dummy venue details (eg: venue name, phone number, description)
- ChatGPT was also used to generate dummy application details (eg: application description, event name)
