import * as express from "express";
import * as cors from "cors";
import {Express, Request, Response} from "express";

import {ComprehendController} from "@/application/http/comprehend.controller";
import {AppError} from "@/core/errors/app-error";
import {EventsController} from "@/application/http/events.controller";

export class Server {
    public app: Express;


    constructor() {
        this.app = express();

        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.app.use(cors());
        // this.app.use(RequestContext.use);
    }

    async init() {
        this.defineControllers();

        this.app.use((err: AppError, req, res, next) => {
            let statusCode = 500;

            if (err.statusCode) {
                statusCode = err.statusCode;
            }

            console.error('error'.red.bold);
            console.error(err.stack);
            console.error(err);

            res.status(statusCode);
            res.json({status: false, message: err.message})
        });

        return this.app.listen(process.env.PORT);
    }

    private defineControllers() {
        // this.app.use("/api/comprehend", new ComprehendController(this.app));
        new ComprehendController(this.app);
        new EventsController(this.app);
    }
}
