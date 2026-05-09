//REFERENCES:
// FSD Lab 8
// increasing body size: https://stackoverflow.com/questions/74387929/increase-body-limit-for-specific-route-with-expressjs 

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import shortlistedVenueRoutes from './routes/shortlistedVenue.routes'
import applicationRoutes from "./routes/application.routes";
import unavailableRoutes from "./routes/unavailable.routes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use("/api", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api", shortlistedVenueRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/unavailable", unavailableRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
