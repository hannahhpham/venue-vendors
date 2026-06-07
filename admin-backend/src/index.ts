import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { expressMiddleware } from "@as-integrations/express4"; //changed this - wrong path
import app from './app'
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault  } from '@apollo/server/plugin/landingPage/default';


//this file references code from lectorial 9 example 2

//const app = express();
const PORT = process.env.PORT || 4001; //changed from port 3001

app.use(cors());
app.use(express.json());

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
    // Install a landing page plugin based on NODE_ENV
    ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],

  });

  await apolloServer.start();

  app.use("/graphql", expressMiddleware(apolloServer));

  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);

export default app;
