import * as express from "express";
// import cors from "cors";
import {Express} from "express";

import {ComprehendController} from "@/application/http/comprehend.controller";

export class Server {
    public app: Express;

    constructor() {
        this.app = express();

        this.app.use(express.json());
        this.app.use(express.urlencoded());
        // this.app.use(cors());
        // this.app.use(RequestContext.use);
    }

    async init() {
        this.defineControllers();

        return this.app.listen(process.env.PORT);
    }

    private defineControllers() {
        // this.app.use("/api/comprehend", new ComprehendController(this.app));
        new ComprehendController(this.app);
    }
}
