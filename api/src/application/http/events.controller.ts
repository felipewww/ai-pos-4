import {Express, Request, Response} from "express";
import * as express from "express";
import {TranscribeEventInput} from "@/application/http/inputs/transcribe-event-input";
import {EventBridge} from "@/application/http/inputs/event-bridge";
import {onTranscribed} from "@/application/domain/events/on-transcribed";
import {onComprehend} from "@/application/domain/events/on-comprehend";

export class EventsController {
    constructor(
        private readonly app: Express
    ) {
        const router = express.Router();

        router.post('/', this.castEvent)

        this.app.use('/events', router)
    }

    private castEvent(req: Request, res: Response) {
        console.log('event received!'.green.bold)
        const body = req.body as EventBridge<any>

        switch (body.source) {
            case 'aws.transcribe':
                onTranscribed.run(body.detail)
                    .catch(console.error)
                break;

            // case "aws.comprehend":
            //     onComprehend.run(body.detail)
            //         .catch(console.error)
            //     break;

            default:
                console.log('unknown event received'.red.bold)
                console.log(body)
        }

        res.json({status: true});
    }
}
