import "reflect-metadata";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import shortlistedVenueRoutes from './routes/shortlistedVenue.routes'
import applicationRoutes from "./routes/application.routes";
import unavailableRoutes from "./routes/unavailable.routes";

const app = express();

// the purpose of this is to allow for testing without recreating tables multiple times

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api", shortlistedVenueRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/unavailable", unavailableRoutes);

export default app;
