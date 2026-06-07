import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";


const PORT = process.env.PORT || 4001;

const app = express();

// the purpose of this is to allow for testing without recreating tables multiple times

app.use(cors());
app.use(express.json());

//graphql specific - used to start server for the tests
export async function graphql(app: any) {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    app.use("/graphql", expressMiddleware(apolloServer));
}

export default app;
