import './config'
import {Server} from "./server";

export async function bootstrap() {
    const server = new Server();
    await server.init();
}

bootstrap()
    .then(() => console.log(`Server started at port ${process.env.PORT}`))
    .catch(console.error)
