import './config'
import {Server} from "./server";
import {mongoConnection} from "@/infra/db/mongo/mongo-connection";

export async function bootstrap() {
    await mongoConnection.connect();

    const server = new Server();
    await server.init();
}

bootstrap()
    .then(() => console.log(`Server started at port ${process.env.PORT}`))
    .catch(console.error)
