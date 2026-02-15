import {Express, Request, Response} from "express";
import * as express from "express";
import {TranscribeEventInput} from "@/application/http/inputs/transcribe-event-input";
import {EventBridge} from "@/application/http/inputs/event-bridge";
import {onTranscribed} from "@/application/domain/events/on-transcribed";

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

        if (body.source === 'aws.transcribe') {
            const detail = body.detail as TranscribeEventInput
            onTranscribed.run(detail)
                .catch(console.error)
        }

        res.json({status: true});
    }
}
